var router = require('express').Router(); // 다른파일이나 라이브러리 여기에 첨부하겠습니다

function 로그인했니(요청, 응답, next){
    if(요청.user){
        next()
    }else {
        응답.send('로그인 해주세요!')
    }
}

router.use('/shirts', 로그인했니); //특정 URL에만 적용하는 미들웨어 로그인했니 미들웨어

router.get('/shirts',  function(요청, 응답){
    응답.send('셔츠 파는 페이지입니다.');
 });
 
 router.get('/pants',  function(요청, 응답){
    응답.send('바지 파는 페이지입니다.');
 }); 

 module.exports = router; //router를 배출하겠다는 의미