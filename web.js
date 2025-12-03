import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 8001;

// 포트에서 실행 중인 프로세스 종료
async function killProcessOnPort(port) {
  try {
    // lsof로 포트 사용 중인 프로세스 찾기
    const { stdout } = await execAsync(`lsof -ti:${port}`);
    const pid = stdout.trim();

    if (pid) {
      console.log(`🔍 포트 ${port}에서 실행 중인 프로세스 발견: PID ${pid}`);

      // 프로세스 종료
      await execAsync(`kill -9 ${pid}`);
      console.log(`✅ 프로세스 ${pid} 종료 완료`);

      // 포트가 완전히 해제될 때까지 대기
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    }
    return false;
  } catch (error) {
    // lsof에서 프로세스를 찾지 못한 경우 (정상)
    if (error.code === 1) {
      return false;
    }
    console.error('포트 확인 중 오류:', error.message);
    return false;
  }
}

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

// 서버 시작 함수
async function startServer() {
  try {
    // 포트 사용 중인 프로세스 확인 및 종료
    const killed = await killProcessOnPort(PORT);
    if (killed) {
      console.log(`🔄 포트 ${PORT} 정리 완료, 서버 시작 중...`);
    }
    // 서버 시작
    const server = app.listen(PORT, () => {
      console.log(`🚀 CareVille 서버가 포트 ${PORT}에서 실행 중입니다.`);
      console.log(`📦 환경: ${process.env.NODE_ENV || 'production'}`);
      console.log(`📂 정적 파일 경로: ${path.join(__dirname, 'dist')}`);
    }).on('error', async (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ 포트 ${PORT}가 여전히 사용 중입니다. 재시도 중...`);

        // 한 번 더 시도
        await killProcessOnPort(PORT);
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 재귀 호출로 다시 시작 시도
        startServer();
      } else {
        console.error('서버 에러:', err);
        process.exit(1);
      }
    });

    // Graceful shutdown (server 정의 후에 등록)
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