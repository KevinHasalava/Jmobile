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
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

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
"[project]/app/api/upload/[[...route]]/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/cloudinary/cloudinary.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.js [app-route] (ecmascript)");
;
;
;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'mock_cloud',
    api_key: process.env.CLOUDINARY_API_KEY || 'mock_key',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'mock_secret'
});
async function POST(req, { params }) {
    const resolvedParams = await params;
    const route = resolvedParams?.route || [];
    const type = route[0]; // product, bank-slip, avatar
    const userReq = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["protect"])(req);
    if (!userReq) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: false,
        message: 'Not authorized'
    }, {
        status: 401
    });
    if (type === 'product' && !await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["admin"])(userReq)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'Not authorized as admin'
        }, {
            status: 403
        });
    }
    try {
        const formData = await req.formData();
        const files = [];
        for (const [key, value] of formData.entries()){
            // Depending on the field, it might be a File/Blob
            if (typeof value === 'object' && value.arrayBuffer) {
                files.push({
                    key,
                    file: value
                });
            }
        }
        if (files.length === 0) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'No files provided'
        }, {
            status: 400
        });
        const uploadPromises = files.map(async ({ key, file })=>{
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            return new Promise((resolve, reject)=>{
                const stream = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].uploader.upload_stream({
                    resource_type: 'auto',
                    folder: `mobile-shop/${type}s`
                }, (error, result)=>{
                    if (error) reject(error);
                    else resolve({
                        filename: file.name,
                        path: result.secure_url,
                        mimetype: file.type,
                        size: file.size
                    });
                });
                stream.end(buffer);
            });
        });
        const results = await Promise.all(uploadPromises);
        if (type === 'product') {
            const images = results.filter((r)=>!r.mimetype.includes('video'));
            const video = results.find((r)=>r.mimetype.includes('video'));
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                message: 'Files uploaded successfully',
                data: {
                    images,
                    video
                }
            }, {
                status: 200
            });
        } else {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                message: 'File uploaded successfully',
                data: results[0]
            }, {
                status: 200
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
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1t6_-yu._.js.map