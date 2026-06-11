// Vercel Serverless Entry Point
// All Express routes/middleware remain in server.js — this just bridges Vercel's api/ requirement
const app = require('../server');

module.exports = app;
