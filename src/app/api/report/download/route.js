import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import MedicalReport from '@/models/MedicalReport';
import { verifyToken } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = verifyToken(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const reportId = searchParams.get('id');

    if (!reportId) return NextResponse.json({ error: 'Report ID required' }, { status: 400 });

    await connectDB();

    const report = await MedicalReport.findOne({ _id: reportId, userId: user._id });
    if (!report) return NextResponse.json({ error: 'Report not found' }, { status: 404 });

    if (report.status !== 'Available') {
      return NextResponse.json({ error: 'Report not ready for download' }, { status: 400 });
    }

    // Fetch file from storage (adjust based on your storage solution)
    const fileResponse = await fetch(report.fileUrl);
    const blob = await fileResponse.blob();

    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${report.title}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}