/**
 * API route for checking database status
 * This route is protected and only accessible by admin users
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/db';
import { setupDatabase } from '@/lib/dbSetup';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated as admin
    const session = await getServerSession();
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check database connection
    const isConnected = await checkDatabaseConnection();
    
    if (!isConnected) {
      return NextResponse.json(
        { status: 'error', message: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database status check error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to check database status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated as admin
    const session = await getServerSession();
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Initialize database
    const setupResult = await setupDatabase();
    
    if (!setupResult) {
      return NextResponse.json(
        { status: 'error', message: 'Database setup failed' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Database setup completed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to set up database' },
      { status: 500 }
    );
  }
}