import http from 'http';
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  res.end('<h1>안녕하세요! seung0910 사이트입니다!</h1>');
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
