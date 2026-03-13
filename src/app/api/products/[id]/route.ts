// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// GET product
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Add cache headers for better performance
    return NextResponse.json(product, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('Product GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT update
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Check if product exists first
    const existing = await prisma.product.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Validate required fields if needed
    if (body.price && body.price <= 0) {
      return NextResponse.json(
        { error: 'Price must be positive' },
        { status: 400 }
      )
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: body
    })
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Product PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if product exists first
    const existing = await prisma.product.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    await prisma.product.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ 
      success: true,
      message: 'Product deleted successfully' 
    })
  } catch (error) {
    console.error('Product DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}