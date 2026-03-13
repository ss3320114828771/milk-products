// app/api/cart/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// GET - Get single cart item
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }  // Changed to Promise
) {
  try {
    const { id } = await params  // Added await
    const item = await prisma.cartItem.findUnique({
      where: { id },
      include: { product: true }
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    )
  }
}

// PUT - Update quantity
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }  // Changed to Promise
) {
  try {
    const { id } = await params  // Added await
    const { quantity } = await request.json()

    if (quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be at least 1' },
        { status: 400 }
      )
    }

    const item = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { product: true }
    })

    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    )
  }
}

// DELETE - Remove item
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }  // Changed to Promise
) {
  try {
    const { id } = await params  // Added await
    await prisma.cartItem.delete({
      where: { id }
    })

    return NextResponse.json({ 
      message: 'Item removed' 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to remove item' },
      { status: 500 }
    )
  }
}