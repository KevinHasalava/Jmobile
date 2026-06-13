import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { protect, admin as checkAdmin } from '@/lib/auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'mock_cloud',
  api_key: process.env.CLOUDINARY_API_KEY || 'mock_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'mock_secret'
});

export async function POST(req, { params }) {
  const resolvedParams = await params;
  const route = resolvedParams?.route || [];
  const type = route[0]; // product, bank-slip, avatar

  const userReq = await protect(req);
  if (!userReq) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

  if (type === 'product' && !(await checkAdmin(userReq))) {
    return NextResponse.json({ success: false, message: 'Not authorized as admin' }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const files = [];

    for (const [key, value] of formData.entries()) {
      // Depending on the field, it might be a File/Blob
      if (typeof value === 'object' && value.arrayBuffer) {
        files.push({ key, file: value });
      }
    }

    if (files.length === 0) return NextResponse.json({ success: false, message: 'No files provided' }, { status: 400 });

    const uploadPromises = files.map(async ({ key, file }) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ resource_type: 'auto', folder: `mobile-shop/${type}s` }, (error, result) => {
          if (error) reject(error);
          else resolve({ filename: file.name, path: result.secure_url, mimetype: file.type, size: file.size });
        });
        stream.end(buffer);
      });
    });

    const results = await Promise.all(uploadPromises);

    if (type === 'product') {
       const images = results.filter(r => !r.mimetype.includes('video'));
       const video = results.find(r => r.mimetype.includes('video'));
       return NextResponse.json({ success: true, message: 'Files uploaded successfully', data: { images, video } }, { status: 200 });
    } else {
       return NextResponse.json({ success: true, message: 'File uploaded successfully', data: results[0] }, { status: 200 });
    }

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
