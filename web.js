import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8001;

// Gzip 압축 활성화 (성능 최적화)
app.use(compression());

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

// React Router 지원 - 모든 경로를 index.html로 처리
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Internal Server Error');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// 포트 충돌 처리
const server = app.listen(PORT, () => {
  console.log(`🚀 CareVille 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📦 환경: ${process.env.NODE_ENV || 'production'}`);
  console.log(`📂 정적 파일 경로: ${path.join(__dirname, 'dist')}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ 포트 ${PORT}가 이미 사용 중입니다.`);
    console.log('🔄 기존 프로세스를 종료하거나 다른 포트를 사용하세요.');
    process.exit(1);
  } else {
    console.error('서버 에러:', err);
    process.exit(1);
  }
});
