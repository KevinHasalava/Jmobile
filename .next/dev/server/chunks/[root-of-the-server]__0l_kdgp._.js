module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/db.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
// ─── Connection cache for serverless environments (Vercel) ───────────────────
// Vercel spins up a new function instance per request. Without caching,
// every request creates a NEW MongoDB connection → "Too many connections" error.
// This module-level cache persists across invocations within the same warm instance.
let cachedConn = null;
let cachedPromise = null;
const connectDB = async ()=>{
    const mongoUri = process.env.MONGO_URI;
    // ─── Strict guard: fail fast if MONGO_URI is missing ───
    if (!mongoUri || mongoUri.trim() === '') {
        console.error('\n❌ FATAL: MONGO_URI is not defined in environment variables.');
        console.error('   → For local dev: create .env.local with MONGO_URI=mongodb+srv://...');
        console.error('   → For Vercel:    add MONGO_URI in Project Settings → Environment Variables\n');
        throw new Error('MONGO_URI is not defined');
    }
    // ─── Return cached connection if already connected ───
    if (cachedConn && __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connection.readyState === 1) {
        return cachedConn;
    }
    // ─── Return pending promise if connection is in progress ───
    if (cachedPromise) {
        return cachedPromise;
    }
    // Mask password in logs for security
    const maskedUri = mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    console.log('\n🔍 MongoDB Connection Attempt:');
    console.log(`   URI: ${maskedUri}`);
    cachedPromise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connect(mongoUri, {
        // Connection pool — max 10 concurrent connections
        maxPoolSize: 10,
        minPoolSize: 2,
        // Serverless-friendly: don't buffer commands if not connected
        bufferCommands: false,
        // Timeouts
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000
    }).then((conn)=>{
        console.log(`\n✅ MongoDB Connected!`);
        console.log(`   Host: ${conn.connection.host}`);
        console.log(`   Database: ${conn.connection.name}`);
        console.log(`   Pool size: ${conn.connection.options?.maxPoolSize || 10}`);
        cachedConn = conn;
        cachedPromise = null;
        return conn;
    }).catch((error)=>{
        console.error(`\n❌ MongoDB Connection Error: ${error.message}\n`);
        cachedPromise = null;
        throw error;
    });
    return cachedPromise;
};
const __TURBOPACK__default__export__ = connectDB;
}),
"[project]/models/Product.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const mongoose = __turbopack_context__.r("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [
            true,
            'Please provide a product name'
        ],
        trim: true
    },
    brand: {
        type: String,
        required: [
            true,
            'Please provide a brand name'
        ],
        trim: true,
        index: true // Index for fast brand filtering
    },
    model: {
        type: String,
        required: false,
        trim: true
    },
    price: {
        type: Number,
        required: [
            true,
            'Please provide a price'
        ],
        min: 0,
        index: true // Index for price range queries
    },
    originalPrice: {
        type: Number,
        min: 0
    },
    description: {
        type: String,
        required: [
            true,
            'Please provide a description'
        ]
    },
    specifications: {
        display: String,
        processor: String,
        ram: String,
        storage: String,
        camera: String,
        battery: String,
        os: String,
        color: [
            String
        ]
    },
    images: [
        {
            type: String
        }
    ],
    image: {
        type: String
    },
    video: {
        type: String
    },
    category: {
        type: String,
        required: [
            true,
            'Please provide a category'
        ],
        trim: true,
        index: true // Index for category filtering
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false,
        index: true // Index for featured products
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
        index: true // Index for rating sorting
    },
    numReviews: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true // Index for sorting by creation date
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
// Compound index for common search patterns
productSchema.index({
    category: 1,
    brand: 1,
    price: 1
});
productSchema.index({
    featured: 1,
    createdAt: -1
});
productSchema.index({
    name: 'text',
    brand: 'text',
    description: 'text'
}); // Full-text search index
// Update the updatedAt timestamp before saving
productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});
module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/models/User.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

const mongoose = __turbopack_context__.r("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
const bcrypt = __turbopack_context__.r("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
const crypto = __turbopack_context__.r("[externals]/crypto [external] (crypto, cjs)");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [
            true,
            'Please provide a name'
        ],
        trim: true
    },
    email: {
        type: String,
        required: [
            true,
            'Please provide an email'
        ],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [
            true,
            'Please provide a password'
        ],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: [
            'user',
            'admin'
        ],
        default: 'user'
    },
    phone: {
        type: String,
        trim: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: ''
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    resetPasswordRequestCount: {
        type: Number,
        default: 0
    },
    resetPasswordRequestWindow: Date
});
// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};
// Generate and hash password reset token
userSchema.methods.getResetPasswordToken = async function() {
    // Generate 32-byte secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    // Hash token with bcrypt and set to resetPasswordToken field
    const salt = await bcrypt.genSalt(10);
    this.resetPasswordToken = await bcrypt.hash(resetToken, salt);
    // Set expire (15 minutes)
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
}),
"[project]/lib/auth.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "admin",
    ()=>admin,
    "generateToken",
    ()=>generateToken,
    "protect",
    ()=>protect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$User$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/User.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.js [app-route] (ecmascript)");
;
;
;
async function protect(req) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer')) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, process.env.JWT_SECRET);
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$User$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(decoded.id).select('-password');
            if (!user) return null;
            return user;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    return null;
}
async function admin(user) {
    if (user && user.role === 'admin') {
        return true;
    }
    return false;
}
function generateToken(id) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
}
}),
"[project]/app/api/products/[[...route]]/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Product$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Product.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.js [app-route] (ecmascript)");
;
;
;
;
const PRODUCT_LIST_FIELDS = 'name brand price originalPrice rating numReviews category stock featured image images _id';
async function GET(req, { params }) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    const resolvedParams = await params;
    const route = resolvedParams?.route || [];
    const action = route[0];
    const searchParams = req.nextUrl.searchParams;
    try {
        if (action === 'featured') {
            const products = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Product$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
                featured: true
            }).select(PRODUCT_LIST_FIELDS).sort('-rating').limit(8).lean().exec();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                count: products.length,
                data: products
            }, {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store'
                }
            });
        }
        if (action === 'filters') {
            const rawBrands = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Product$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].distinct('brand');
            const rawCategories = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Product$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].distinct('category');
            const brands = [
                ...new Set(rawBrands.map((b)=>b?.toLowerCase()))
            ].map((lower)=>rawBrands.find((b)=>b?.toLowerCase() === lower)).filter(Boolean);
            const categories = [
                ...new Set(rawCategories.map((c)=>c?.toLowerCase()))
            ].map((lower)=>rawCategories.find((c)=>c?.toLowerCase() === lower)).filter(Boolean);
            const priceStats = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Product$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].aggregate([
                {
                    $group: {
                        _id: null,
                        minPrice: {
                            $min: '$price'
                        },
                        maxPrice: {
                            $max: '$price'
                        }
                    }
                }
            ]);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                data: {
                    brands: brands.sort(),
                    categories: categories.sort(),
                    priceRange: priceStats[0] || {
                        minPrice: 0,
                        maxPrice: 0
                    }
                }
            }, {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store'
                }
            });
        }
        if (route.length === 1 && action !== 'featured' && action !== 'filters') {
            const id = action;
            if (!id || id.length !== 24) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Invalid product ID format'
            }, {
                status: 400
            });
            const product = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Product$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(id).lean().exec();
            if (!product) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Product not found'
            }, {
                status: 404
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                data: product
            }, {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store'
                }
            });
        }
        if (route.length === 0) {
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
                query.$or = [
                    {
                        name: {
                            $regex: search,
                            $options: 'i'
                        }
                    },
                    {
                        brand: {
                            $regex: brand || search,
                            $options: 'i'
                        }
                    },
                    {
                        model: {
                            $regex: search,
                            $options: 'i'
                        }
                    }
                ];
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
            const totalProducts = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Product$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments(query);
            const totalPages = Math.ceil(totalProducts / limit);
            const skip = (page - 1) * limit;
            const products = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Product$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find(query).select(PRODUCT_LIST_FIELDS).sort(sortBy).limit(limit).skip(skip).lean().exec();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                count: products.length,
                total: totalProducts,
                page,
                pages: totalPages,
                hasMore: page < totalPages,
                data: products
            }, {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store'
                }
            });
        }
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: error.message
        }, {
            status: 500
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: false,
        message: 'Route not found'
    }, {
        status: 404
    });
}
async function POST(req, { params }) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    const userReq = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["protect"])(req);
    if (!userReq || !await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["admin"])(userReq)) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: false,
        message: 'Not authorized'
    }, {
        status: 401
    });
    try {
        const body = await req.json();
        body.createdBy = userReq._id;
        const product = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Product$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create(body);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: product
        }, {
            status: 201,
            headers: {
                'Cache-Control': 'no-cache'
            }
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: error.message
        }, {
            status: 500
        });
    }
}
async function PUT(req, { params }) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    const resolvedParams = await params;
    const route = resolvedParams?.route || [];
    const userReq = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["protect"])(req);
    if (!userReq || !await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["admin"])(userReq)) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: false,
        message: 'Not authorized'
    }, {
        status: 401
    });
    try {
        if (route.length === 1) {
            const id = route[0];
            const body = await req.json();
            let product = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Product$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(id);
            if (!product) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Product not found'
            }, {
                status: 404
            });
            product = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Product$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndUpdate(id, body, {
                new: true,
                runValidators: true
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                data: product
            }, {
                status: 200,
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
        }
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: error.message
        }, {
            status: 500
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: false,
        message: 'Route not found'
    }, {
        status: 404
    });
}
async function DELETE(req, { params }) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    const resolvedParams = await params;
    const route = resolvedParams?.route || [];
    const userReq = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["protect"])(req);
    if (!userReq || !await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["admin"])(userReq)) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: false,
        message: 'Not authorized'
    }, {
        status: 401
    });
    try {
        if (route.length === 1) {
            const id = route[0];
            const product = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Product$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(id);
            if (!product) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Product not found'
            }, {
                status: 404
            });
            await product.deleteOne();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                message: 'Product removed'
            }, {
                status: 200,
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
        }
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: error.message
        }, {
            status: 500
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: false,
        message: 'Route not found'
    }, {
        status: 404
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0l_kdgp._.js.map