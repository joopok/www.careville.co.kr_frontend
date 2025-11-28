#!/bin/bash

# CareVille Frontend Deployment Script for Cafe24

echo "🚀 Starting deployment process..."

# 1. Build production files
echo "📦 Building production files..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully!"
echo ""
echo "📁 Production files are in: dist/"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📤 Next Steps for Cafe24 Deployment:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Option 1: FTP/SFTP Client (Recommended)"
echo "  - Open FileZilla or Cyberduck"
echo "  - Host: seung0910.cafe24app.com"
echo "  - Username: seung0910"
echo "  - Upload dist/* to /www/ or /public_html/"
echo ""
echo "Option 2: Cafe24 Control Panel"
echo "  - Visit: https://hosting.cafe24.com/"
echo "  - Use web-based file manager"
echo "  - Upload dist/* contents"
echo ""
echo "Option 3: Command Line (if FTP port is known)"
echo "  - Check Cafe24 control panel for FTP details"
echo "  - Use: ftp seung0910.cafe24app.com"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
