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

app.listen(PORT, () => {
  console.log(`🚀 CareVille 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📦 환경: ${process.env.NODE_ENV || 'production'}`);
  console.log(`📂 정적 파일 경로: ${path.join(__dirname, 'dist')}`);
});
