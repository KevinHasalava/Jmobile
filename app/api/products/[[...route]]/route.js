import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { protect, admin } from '@/lib/auth';

const PRODUCT_LIST_FIELDS = 'name brand price originalPrice rating numReviews category stock featured image images _id';

export async function GET(req, { params }) {
  await connectDB();
  const resolvedParams = await params;
  const route = resolvedParams?.route || [];
  const action = route[0];
  const searchParams = req.nextUrl.searchParams;

  try {
    if (action === 'featured') {
      const products = await Product.find({ featured: true })
        .select(PRODUCT_LIST_FIELDS).sort('-rating').limit(8).lean().exec();
      return NextResponse.json({ success: true, count: products.length, data: products }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
    }

    if (action === 'filters') {
      const rawBrands = await Product.distinct('brand');
      const rawCategories = await Product.distinct('category');
      const brands = [...new Set(rawBrands.map(b => b?.toLowerCase()))].map(lower => rawBrands.find(b => b?.toLowerCase() === lower)).filter(Boolean);
      const categories = [...new Set(rawCategories.map(c => c?.toLowerCase()))].map(lower => rawCategories.find(c => c?.toLowerCase() === lower)).filter(Boolean);
      const priceStats = await Product.aggregate([{ $group: { _id: null, minPrice: { $min: '$price' }, maxPrice: { $max: '$price' } } }]);

      return NextResponse.json({
        success: true,
        data: { brands: brands.sort(), categories: categories.sort(), priceRange: priceStats[0] || { minPrice: 0, maxPrice: 0 } }
      }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
    }

    if (route.length === 1 && action !== 'featured' && action !== 'filters') { // getProduct by ID
      const id = action;
      if (!id || id.length !== 24) return NextResponse.json({ success: false, message: 'Invalid product ID format' }, { status: 400 });

      const product = await Product.findById(id).lean().exec();
      if (!product) return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });

      return NextResponse.json({ success: true, data: product }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
    }

    if (route.length === 0) { // getProducts
      const search = searchParams.get('search');
      const brand = searchParams.get('brand');
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      const category = searchParams.get('category');
      const featured = searchParams.get('featured');
      const sortBy = searchParams.get('sortBy') || '-createdAt';
      const page = Number(searchParams.get('page')) || 1;
      const limit = Number(searchParams.get('limit')) || 12;

      let query = {};
      if (search) {
        query.$or = [{ name: { $regex: search, $options: 'i' } }, { brand: { $regex: brand || search, $options: 'i' } }, { model: { $regex: search, $options: 'i' } }];
      } else {
        if (brand) query.brand = brand;
        if (category && category !== 'all') query.category = category;
        if (featured === 'true') query.featured = true;
      }
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      const totalProducts = await Product.countDocuments(query);
      const totalPages = Math.ceil(totalProducts / limit);
      const skip = (page - 1) * limit;

      const products = await Product.find(query).select(PRODUCT_LIST_FIELDS).sort(sortBy).limit(limit).skip(skip).lean().exec();

      return NextResponse.json({ success: true, count: products.length, total: totalProducts, page, pages: totalPages, hasMore: page < totalPages, data: products }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
    }

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: false, message: 'Route not found' }, { status: 404 });
}

export async function POST(req, { params }) {
  await connectDB();
  const userReq = await protect(req);
  if (!userReq || !(await admin(userReq))) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

  try {
    const body = await req.json();
    body.createdBy = userReq._id;
    const product = await Product.create(body);

    return NextResponse.json({ success: true, data: product }, { status: 201, headers: { 'Cache-Control': 'no-cache' } });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  const resolvedParams = await params;
  const route = resolvedParams?.route || [];
  
  const userReq = await protect(req);
  if (!userReq || !(await admin(userReq))) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

  try {
    if (route.length === 1) {
      const id = route[0];
      const body = await req.json();
      let product = await Product.findById(id);

      if (!product) return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });

      product = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });
      return NextResponse.json({ success: true, data: product }, { status: 200, headers: { 'Cache-Control': 'no-cache' } });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: false, message: 'Route not found' }, { status: 404 });
}

export async function DELETE(req, { params }) {
  await connectDB();
  const resolvedParams = await params;
  const route = resolvedParams?.route || [];

  const userReq = await protect(req);
  if (!userReq || !(await admin(userReq))) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

  try {
    if (route.length === 1) {
      const id = route[0];
      const product = await Product.findById(id);
      if (!product) return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });

      await product.deleteOne();
      return NextResponse.json({ success: true, message: 'Product removed' }, { status: 200, headers: { 'Cache-Control': 'no-cache' } });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: false, message: 'Route not found' }, { status: 404 });
}
