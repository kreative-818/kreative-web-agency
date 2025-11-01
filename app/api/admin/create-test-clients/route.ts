
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { clients, clientPortalUsers, projects } from '@/lib/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const results: Array<{
      name: string;
      email: string;
      password?: string;
      company?: string;
      project?: string;
      status: string;
    }> = [];

    // Check if Chris Klein already exists
    const existingChris = await db.select().from(clients).where(eq(clients.email, 'chris@testclient.com')).limit(1);
    
    if (existingChris.length === 0) {
      // 1. Create Chris Klein account
      const chrisPasswordHash = await bcrypt.hash('testpass123', 10);
      
      const [chrisClient] = await db.insert(clients).values({
        fullName: 'Chris Klein',
        email: 'chris@testclient.com',
        phone: '(919) 555-0101',
        businessName: 'Klein Enterprises',
        status: 'active',
      }).returning();

      await db.insert(clientPortalUsers).values({
        clientId: chrisClient.id,
        email: 'chris@testclient.com',
        password: chrisPasswordHash,
        fullName: 'Chris Klein',
        phone: '(919) 555-0101',
        role: 'client',
      });

      // Create a test project for Chris
      await db.insert(projects).values({
        title: 'Klein Enterprises Website',
        description: 'Professional website for Klein Enterprises - modern, responsive design with lead capture and analytics.',
        projectType: 'website',
        clientId: chrisClient.id,
        status: 'in_progress',
        progress: 25,
        estimatedCompletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      });

      results.push({
        name: 'Chris Klein',
        email: 'chris@testclient.com',
        password: 'testpass123',
        company: 'Klein Enterprises',
        project: 'Klein Enterprises Website',
        status: 'created',
      });
    } else {
      results.push({
        name: 'Chris Klein',
        email: 'chris@testclient.com',
        status: 'already_exists',
      });
    }

    // Check if Tess Klein already exists
    const existingTess = await db.select().from(clients).where(eq(clients.email, 'tess@testclient.com')).limit(1);
    
    if (existingTess.length === 0) {
      // 2. Create Tess Klein account
      const tessPasswordHash = await bcrypt.hash('testpass123', 10);
      
      const [tessClient] = await db.insert(clients).values({
        fullName: 'Tess Klein',
        email: 'tess@testclient.com',
        phone: '(919) 555-0102',
        businessName: 'Tess Design Studio',
        status: 'active',
      }).returning();

      await db.insert(clientPortalUsers).values({
        clientId: tessClient.id,
        email: 'tess@testclient.com',
        password: tessPasswordHash,
        fullName: 'Tess Klein',
        phone: '(919) 555-0102',
        role: 'client',
      });

      // Create a test project for Tess
      await db.insert(projects).values({
        title: 'Tess Design Studio Portfolio',
        description: 'Portfolio website for Tess Design Studio - showcase creative work with stunning visuals.',
        projectType: 'website',
        clientId: tessClient.id,
        status: 'in_progress',
        progress: 40,
        estimatedCompletionDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      });

      results.push({
        name: 'Tess Klein',
        email: 'tess@testclient.com',
        password: 'testpass123',
        company: 'Tess Design Studio',
        project: 'Tess Design Studio Portfolio',
        status: 'created',
      });
    } else {
      results.push({
        name: 'Tess Klein',
        email: 'tess@testclient.com',
        status: 'already_exists',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Test client accounts processed',
      results,
      loginUrl: 'https://kreativeaiagency.com/portal/login',
      adminUrl: 'https://kreativeaiagency.com/admin/clients',
    });

  } catch (error: any) {
    console.error('Error creating test clients:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
