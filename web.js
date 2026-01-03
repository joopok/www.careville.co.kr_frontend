import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORTS = [8001, 8002]; // 동시에 사용할 포트 목록
const DIST_DIR = path.join(__dirname, 'dist');

// MIME types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
};

// FAQ storage
const DATA_DIR = path.join(__dirname, 'data');
const FAQ_FILE = path.join(DATA_DIR, 'faqs.json');

function ensureFaqFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(FAQ_FILE)) {
      fs.writeFileSync(FAQ_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (e) {
    console.error('FAQ storage init error:', e);
  }
}

function readFaqs() {
  ensureFaqFile();
  try {
    const raw = fs.readFileSync(FAQ_FILE, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch {
    return [];
  }
}

function writeFaqs(items) {
  ensureFaqFile();
  fs.writeFileSync(FAQ_FILE, JSON.stringify(items, null, 2), 'utf-8');
}

// Parse JSON body
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

// Send JSON response
function sendJson(res, statusCode, data, acceptEncoding = '') {
  const json = JSON.stringify(data);
  const buffer = Buffer.from(json, 'utf-8');

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (acceptEncoding.includes('gzip') && buffer.length > 1024) {
    res.setHeader('Content-Encoding', 'gzip');
    res.writeHead(statusCode);
    zlib.gzip(buffer, (err, compressed) => {
      res.end(err ? buffer : compressed);
    });
  } else {
    res.writeHead(statusCode);
    res.end(buffer);
  }
}

// Send file with optional gzip
function sendFile(res, filePath, acceptEncoding = '') {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    res.setHeader('Content-Type', contentType);

    // Cache headers
    if (ext === '.html') {
      res.setHeader('Cache-Control', 'no-cache');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }

    // Gzip for text-based files > 1KB
    const compressible = ['.html', '.css', '.js', '.json', '.svg', '.txt'];
    if (acceptEncoding.includes('gzip') && compressible.includes(ext) && data.length > 1024) {
      res.setHeader('Content-Encoding', 'gzip');
      zlib.gzip(data, (err, compressed) => {
        if (err) {
          res.writeHead(200);
          res.end(data);
        } else {
          res.writeHead(200);
          res.end(compressed);
        }
      });
    } else {
      res.writeHead(200);
      res.end(data);
    }
  });
}

// Main request handler
async function handleRequest(req, res) {
  const acceptEncoding = req.headers['accept-encoding'] || '';
  const url = new URL(req.url, `http://localhost`);
  const pathname = url.pathname;
  const method = req.method;

  // CORS preflight
  if (method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.writeHead(204);
    res.end();
    return;
  }

  // --- FAQ API ---
  if (pathname === '/api/faqs' && method === 'GET') {
    const items = readFaqs();
    sendJson(res, 200, { success: true, data: items }, acceptEncoding);
    return;
  }

  if (pathname === '/api/faqs' && method === 'POST') {
    const body = await parseBody(req);
    const { question, answer, category = '', display = true, order = 0 } = body;
    if (!question || !answer) {
      sendJson(res, 400, { success: false, message: 'question and answer are required' }, acceptEncoding);
      return;
    }
    const items = readFaqs();
    const id = Date.now().toString();
    const item = { id, question, answer, category, display: !!display, order: Number(order) || 0 };
    items.push(item);
    items.sort((a, b) => (a.order || 0) - (b.order || 0));
    writeFaqs(items);
    sendJson(res, 200, { success: true, data: item }, acceptEncoding);
    return;
  }

  // FAQ update/delete
  const faqMatch = pathname.match(/^\/api\/faqs\/(.+)$/);
  if (faqMatch) {
    const id = faqMatch[1];

    if (method === 'PUT') {
      const body = await parseBody(req);
      const items = readFaqs();
      const idx = items.findIndex(x => x.id === id);
      if (idx === -1) {
        sendJson(res, 404, { success: false, message: 'FAQ not found' }, acceptEncoding);
        return;
      }
      const prev = items[idx];
      const updated = {
        ...prev,
        ...(body.question !== undefined ? { question: body.question } : {}),
        ...(body.answer !== undefined ? { answer: body.answer } : {}),
        ...(body.category !== undefined ? { category: body.category } : {}),
        ...(body.display !== undefined ? { display: !!body.display } : {}),
        ...(body.order !== undefined ? { order: Number(body.order) || 0 } : {}),
      };
      items[idx] = updated;
      items.sort((a, b) => (a.order || 0) - (b.order || 0));
      writeFaqs(items);
      sendJson(res, 200, { success: true, data: updated }, acceptEncoding);
      return;
    }

    if (method === 'DELETE') {
      const items = readFaqs();
      const next = items.filter(x => x.id !== id);
      if (next.length === items.length) {
        sendJson(res, 404, { success: false, message: 'FAQ not found' }, acceptEncoding);
        return;
      }
      writeFaqs(next);
      sendJson(res, 200, { success: true }, acceptEncoding);
      return;
    }
  }

  // --- Static files ---
  let filePath = path.join(DIST_DIR, pathname === '/' ? 'index.html' : pathname);

  // Security: prevent directory traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Check if file exists
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    sendFile(res, filePath, acceptEncoding);
    return;
  }

  // SPA fallback - serve index.html for all routes
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    sendFile(res, indexPath, acceptEncoding);
  } else {
    res.writeHead(404);
    res.end('Not Found - dist/index.html missing. Run npm run build first.');
  }
}

// Create servers for each port
const servers = [];

// Check dist folder
function checkDistFolder() {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('❌ dist/index.html 파일이 없습니다!');
    console.error('📦 npm run build 명령어로 빌드를 먼저 실행하세요.');
    return false;
  }
  return true;
}

// Start servers on all ports
function startServer() {
  if (!checkDistFolder()) {
    process.exit(1);
  }

  // 환경변수로 포트가 지정된 경우 해당 포트만 사용
  const portsToUse = process.env.PORT ? [parseInt(process.env.PORT)] : PORTS;

  portsToUse.forEach((port) => {
    const server = http.createServer(handleRequest);

    server.listen(port, () => {
      console.log(`🚀 CareVille 서버가 포트 ${port}에서 실행 중입니다.`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️ 포트 ${port}가 이미 사용 중입니다. 건너뜁니다.`);
      } else {
        console.error(`서버 에러 (포트 ${port}):`, err);
      }
    });

    servers.push(server);
  });

  console.log(`📦 환경: ${process.env.NODE_ENV || 'production'}`);
  console.log(`📂 정적 파일 경로: ${DIST_DIR}`);
  console.log('✅ Node.js 내장 모듈만 사용 (외부 의존성 없음)');

  // Graceful shutdown
  const shutdown = () => {
    console.log('서버 종료 중...');
    servers.forEach(s => s.close());
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer();
