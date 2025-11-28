const express = require('express');
const app = express();

// Cafe24에서 지정한 포트 사용 (환경변수에서 가져옴)
const PORT = process.env.PORT || 8001;

app.get('/', (req, res) => {
    res.send('안녕하세요! Node.js 서버가 실행 중이에요!');
});

app.listen(PORT, () => {
    console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
});