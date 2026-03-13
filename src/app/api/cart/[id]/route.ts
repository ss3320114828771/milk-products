// app/api/cart/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// GET - Get single cart item
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.cartItem.findUnique({
      where: { id: params.id },
      include: { product: true }
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Cart GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart item' },
      { status: 500 }
    )
  }
}

// PUT - Update quantity
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { quantity } = await request.json()

    // Validate quantity
    if (typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be a positive number' },
        { status: 400 }
      )
    }

    // Check if item exists
    const existing = await prisma.cartItem.findUnique({
      where: { id: params.id },
      include: { product: true }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    // Check stock availability
    if (quantity > existing.product.stock) {
      return NextResponse.json(
        { error: 'Insufficient stock', availableStock: existing.product.stock },
        { status: 400 }
      )
    }

    const item = await prisma.cartItem.update({
      where: { id: params.id },
      data: { quantity },
      include: { product: true }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Cart PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    )
  }
}

// DELETE - Remove item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if item exists
    const existing = await prisma.cartItem.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    await prisma.cartItem.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Item removed from cart' 
    })
  } catch (error) {
    console.error('Cart DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    )
  }
}

// PATCH - Increment/Decrement
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await request.json()
    
    // Validate action
    if (!action || !['increment', 'decrement'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Use "increment" or "decrement"' },
        { status: 400 }
      )
    }
    
    const item = await prisma.cartItem.findUnique({
      where: { id: params.id },
      include: { product: true }
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    let newQuantity = item.quantity
    
    if (action === 'increment') {
      newQuantity = item.quantity + 1
      // Check stock on increment
      if (newQuantity > item.product.stock) {
        return NextResponse.json(
          { error: 'Insufficient stock', availableStock: item.product.stock },
          { status: 400 }
        )
      }
    } else if (action === 'decrement') {
      newQuantity = item.quantity - 1
    }

    if (newQuantity < 1) {
      await prisma.cartItem.delete({
        where: { id: params.id }
      })
      return NextResponse.json({ 
        success: true,
        message: 'Item removed from cart',
        removed: true
      })
    }

    const updated = await prisma.cartItem.update({
      where: { id: params.id },
      data: { quantity: newQuantity },
      include: { product: true }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Cart PATCH error:', error)
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    )
  }
}