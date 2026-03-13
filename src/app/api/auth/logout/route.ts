// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    
    // Delete session cookie
    cookieStore.delete('session')
    
    // Also delete any other auth cookies you might have
    cookieStore.delete('token')
    cookieStore.delete('refreshToken')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    }, {
      headers: {
        'Cache-Control': 'no-store'
      }
    })
    
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, message: 'Logout failed' },
      { status: 500 }
    )
  }
}

// Handle GET requests (for direct links)
export async function GET() {
  try {
    const cookieStore = await cookies()
    
    // Clear all auth cookies
    cookieStore.delete('session')
    cookieStore.delete('token')
    cookieStore.delete('refreshToken')
    
    // Get base URL from env or default
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    // Redirect to login with message
    const loginUrl = new URL('/login', baseUrl)
    loginUrl.searchParams.set('message', 'Logged out successfully')
    
    return NextResponse.redirect(loginUrl)
    
  } catch (error) {
    // Even if error, redirect to login
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    return NextResponse.redirect(new URL('/login', baseUrl))
  }
}