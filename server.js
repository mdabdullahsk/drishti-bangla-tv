// server.js (CommonJS)
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const fetch = require("node-fetch");

const app = express();

// মূল স্ট্রিম সোর্স (তুমি চাইলে এখানে পরিবর্তন করবে)
const TARGET_BASE = "https://boishakhi.sonarbanglatv.com/boishakhi/boishakhitv/";

// Proxy route: /proxy/* -> TARGET_BASE/*
app.use("/proxy", createProxyMiddleware({
  target: TARGET_BASE,            // base of the remote origin
  changeOrigin: true,             // sets Host header to target
  pathRewrite: (path, req) => {
    // /proxy/index.m3u8  -> /index.m3u8
    // /proxy/media0.ts    -> /media0.ts
    return path.replace(/^\/proxy/, "");
  },
  onProxyReq: (proxyReq, req, res) => {
    // আপনি চাইলে এখানে হেডার যোগ/পরিবর্তন করতে পারেন
    // proxyReq.setHeader('referer', TARGET_BASE);
  },
  onError: (err, req, res) => {
    console.error("Proxy error:", err);
    res.status(502).send("Bad gateway (proxy error)");
  },
  logLevel: "warn",
  secure: false, // যদি টার্গেট HTTPS এবং সার্টিফিকেট ভিন্ন থাকে তখন false
}));

// (ঐচ্ছিক) একটি ছোট health route
app.get("/", (req, res) => {
  res.send("✅ Proxy server running. Use /proxy/index.m3u8");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
  console.log(`➡️  Proxying /proxy/* -> ${TARGET_BASE}`);
});
