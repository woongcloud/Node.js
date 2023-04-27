var router = require('express').Router(); // 다른파일이나 라이브러리 여기에 첨부하겠습니다

router.get('/sports', function(요청, 응답){
    응답.send('스포츠 게시판입니다.');
 });
 
 router.get('/game', function(요청, 응답){
    응답.send('게임 게시판입니다.');
 }); 

 module.exports = router; //router를 배출하겠다는 의미