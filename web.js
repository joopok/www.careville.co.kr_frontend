import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 8001;

// Gzip 압축 활성화 (성능 최적화)
app.use(compression());

// JSON/body parser (for API endpoints) - MUST be before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- FAQ API (file-based) ---
const DATA_DIR = path.join(__dirname, 'data');
const FAQ_FILE = path.join(DATA_DIR, 'faqs.json');

async function ensureFaqFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(FAQ_FILE);
    } catch {
      await fs.writeFile(FAQ_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (e) {
    console.error('FAQ storage init error:', e);
  }
}

async function readFaqs() {
  await ensureFaqFile();
  const raw = await fs.readFile(FAQ_FILE, 'utf-8');
  return JSON.parse(raw || '[]');
}

async function writeFaqs(items) {
  await ensureFaqFile();
  await fs.writeFile(FAQ_FILE, JSON.stringify(items, null, 2), 'utf-8');
}

// List FAQs
app.get('/api/faqs', async (req, res) => {
  try {
    const items = await readFaqs();
    res.json({ success: true, data: items });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to load FAQs' });
  }
});

// Create FAQ
app.post('/api/faqs', async (req, res) => {
  try {
    const { question, answer, category = '', display = true, order = 0 } = req.body || {};
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'question and answer are required' });
    }
    const items = await readFaqs();
    const id = Date.now().toString();
    const item = { id, question, answer, category, display: !!display, order: Number(order) || 0 };
    items.push(item);
    items.sort((a, b) => (a.order || 0) - (b.order || 0));
    await writeFaqs(items);
    res.json({ success: true, data: item });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to create FAQ' });
  }
});

// Update FAQ
app.put('/api/faqs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, category, display, order } = req.body || {};
    const items = await readFaqs();
    const idx = items.findIndex((x) => x.id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'FAQ not found' });
    const prev = items[idx];
    const updated = {
      ...prev,
      ...(question !== undefined ? { question } : {}),
      ...(answer !== undefined ? { answer } : {}),
      ...(category !== undefined ? { category } : {}),
      ...(display !== undefined ? { display: !!display } : {}),
      ...(order !== undefined ? { order: Number(order) || 0 } : {}),
    };
    items[idx] = updated;
    items.sort((a, b) => (a.order || 0) - (b.order || 0));
    await writeFaqs(items);
    res.json({ success: true, data: updated });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to update FAQ' });
  }
});

// Delete FAQ
app.delete('/api/faqs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const items = await readFaqs();
    const next = items.filter((x) => x.id !== id);
    if (next.length === items.length) return res.status(404).json({ success: false, message: 'FAQ not found' });
    await writeFaqs(next);
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to delete FAQ' });
  }
});

// dist 폴더의 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1y', // 정적 자산 캐시 1년
  etag: true,
  setHeaders: (res, filepath) => {
    // HTML 파일은 캐시하지 않음
    if (filepath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// React Router 지원 - 모든 경로를 index.html로 처리 (API 라우트 이후에 위치)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Internal Server Error');
});

// dist 폴더 존재 확인
async function checkDistFolder() {
  const distPath = path.join(__dirname, 'dist', 'index.html');
  try {
    await fs.access(distPath);
    return true;
  } catch {
    console.error('❌ dist/index.html 파일이 없습니다!');
    console.error('📦 npm run build 명령어로 빌드를 먼저 실행하세요.');
    return false;
  }
}

// 서버 시작 함수
async function startServer() {
  try {
    // dist 폴더 확인
    const distExists = await checkDistFolder();
    if (!distExists) {
      process.exit(1);
    }

    // 서버 시작
    const server = app.listen(PORT, () => {
      console.log(`🚀 CareVille 서버가 포트 ${PORT}에서 실행 중입니다.`);
      console.log(`📦 환경: ${process.env.NODE_ENV || 'production'}`);
      console.log(`📂 정적 파일 경로: ${path.join(__dirname, 'dist')}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ 포트 ${PORT}가 이미 사용 중입니다.`);
        console.error('💡 Cafe24 앱 관리에서 앱을 중지 후 다시 실행하세요.');
        process.exit(1);
      } else {
        console.error('서버 에러:', err);
        process.exit(1);
      }
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, closing server gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, closing server gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('서버 시작 실패:', error);
    process.exit(1);
  }
}

// 서버 시작
startServer();
