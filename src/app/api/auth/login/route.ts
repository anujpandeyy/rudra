import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    console.log('Login attempt for email:', email);

    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    try {
      await connectDB();
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    let user;
    try {
      user = await User.findOne({ email }).select('+password');
      console.log('User search result:', user ? 'Found' : 'Not found');
    } catch (error) {
      console.error('Error finding user:', error);
      return NextResponse.json(
        { error: 'Error finding user' },
        { status: 500 }
      );
    }
    
    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    let isMatch;
    try {
      isMatch = await bcrypt.compare(password, user.password);
      console.log('Password comparison result:', isMatch);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return NextResponse.json(
        { error: 'Error verifying password' },
        { status: 500 }
      );
    }
    
    if (!isMatch) {
      console.log('Password mismatch');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

  
    let token;
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }
      token = sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );
      console.log('Token created successfully');
    } catch (error) {
      console.error('Error creating token:', error);
      return NextResponse.json(
        { error: 'Error creating authentication token' },
        { status: 500 }
      );
    }


    let userData;
    try {
      userData = await User.findById(user._id).select('-password');
      console.log('User data retrieved successfully');
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return NextResponse.json(
        { error: 'Error retrieving user data' },
        { status: 500 }
      );
    }


    const response = NextResponse.json({
      success: true,
      user: userData
    });

 
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Unexpected login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 