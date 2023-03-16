const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');

MongoClient.connect('mongodb+srv://tjsdnd3103:tjsdnd3103@sunwoong.pbgylxn.mongodb.net/?retryWrites=true&w=majority', function(에러, client){
    
    
    if(에러) return console.log(에러)

    db = client.db('todoapp'); //mongodb의 todoapp에 연결
    
    db.collection('post').insertOne({이름 : 'Woong', 나이 : 25}, function(에러, 결과){
        console.log('저장완료')
    });

    app.listen(8080, function(){
        console.log('listening on 8080')
    });

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
    응답.send('전송완료!!!')
    console.log(요청.body.title)
    console.log(요청.body.date)
    db.collection('post').insertOne( { 제목 : 요청.body.title, 날짜 : 요청.body.date } , function(){
        console.log('저장완료')
      });
});
 
///list로 GET요청으로 접속하면
//실제 DB에 저장된 데이터들로 예쁘게 꾸며진HTML을 보여줌

app.get('/list', function(요총, 응답){
    응답.render('list.ejs');
});

