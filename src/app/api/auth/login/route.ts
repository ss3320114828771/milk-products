import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { prisma } from '@/app/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    // Generic error message (don't reveal if user exists)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Set secure session cookie
    const cookieStore = await cookies()
    cookieStore.set('session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    // Log successful login (optional)
    console.log(`User logged in: ${user.email}`)

    return NextResponse.json({ 
      success: true,
      message: 'Login successful',
      user: userWithoutPassword 
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}