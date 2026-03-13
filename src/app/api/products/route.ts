// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// GET - Get all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    
    // Add validation for pagination
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10'))) // Max 50 items
    const skip = (page - 1) * limit

    // Build where filter
    const where: any = {}
    
    if (category) {
      where.category = category
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } }, // Case insensitive
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get products
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })

    const total = await prisma.product.count({ where })

    // Add cache headers for better performance
    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })

  } catch (error) {
    console.error('Products GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST - Create a product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Basic validation
    if (!body.name || !body.price) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      )
    }

    // Validate price is positive
    if (body.price <= 0) {
      return NextResponse.json(
        { error: 'Price must be positive' },
        { status: 400 }
      )
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description || '',
        price: body.price,
        category: body.category || '',
        stock: Math.max(0, body.stock || 0) // Ensure non-negative stock
      }
    })

    return NextResponse.json({ product }, { status: 201 })

  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}