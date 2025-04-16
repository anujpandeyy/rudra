import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    console.log('Signup request received');
    const { username, email, password } = await request.json();
    console.log('Signup attempt for:', { username, email });

    
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected to MongoDB');

    
    console.log('Checking for existing user...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    
    console.log('Creating new user...');
    const user = await User.create({
      username,
      email,
      password,
    });
    console.log('User created successfully:', user._id);

    return NextResponse.json(
      { 
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    );
  }
} 