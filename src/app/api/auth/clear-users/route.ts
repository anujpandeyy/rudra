import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST() {
  try {
    await connectDB();
    await User.deleteMany({});
    return NextResponse.json({ success: true, message: 'All users cleared' });
  } catch (error) {
    console.error('Error clearing users:', error);
    return NextResponse.json(
      { error: 'Error clearing users' },
      { status: 500 }
    );
  }
} 