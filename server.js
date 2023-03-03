const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
app.listen(8080, function(){
    console.log('listening on 8080')
});

// 누군가가 /?? 으로 방문을 하면..
// ??관련된 안내문을 띄워주자


app.get('/', function(요청, 응답){
    응답.sendFile(__dirname + '/index.html')

});

 app.get('/write', function(요청, 응답){
    응답.sendFile(__dirname + '/write.html');
 }); 

 //어떤 사람이 /add 경로로 POST 요청을 하면...
 //?? 를 해주세요~

app.post('/add', function(요청, 응답){
    응답.send('전송완료')
    console.log(요청.body.title)
    console.log(요청.body.date)
});