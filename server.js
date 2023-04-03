const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');

MongoClient.connect('mongodb+srv://tjsdnd3103:tjsdnd3103@sunwoong.pbgylxn.mongodb.net/?retryWrites=true&w=majority', function(에러, client){
    
    
    if(에러) return console.log(에러)

    db = client.db('todoapp'); //mongodb의 todoapp에 연결
    
    ///db.collection('post').insertOne({이름 : 'Woong', 나이 : 25}, function(에러, 결과){
       // console.log('저장완료')
        //  })

    app.listen(8080, function(){
        console.log('listening on 8080')
    });

});






// 누군가가 /?? 으로 방문을 하면..
// ??관련된 안내문을 띄워주자


app.get('/', function(요청, 응답){ // '/'는 기본값홈페이지로 지정함
    응답.sendFile(__dirname + '/index.html')

});

 app.get('/write', function(요청, 응답){
    응답.sendFile(__dirname + '/write.html');
 }); 

 //어떤 사람이 /add 경로로 POST 요청을 하면...
 //?? 를 해주세요~

app.post('/add', function(요청, 응답){
    응답.send('전송완료!!!')
    db.collection('counter').findOne({name : '게시물갯수'}, function(에러, 결과){
        console.log(결과.totalPost)
        var 총게시물갯수 = 결과.totalPost;

        db.collection('post').insertOne( { _id : 총게시물갯수 + 1, 제목 : 요청.body.title, 날짜 : 요청.body.date } , function(){
            console.log('저장완료');
            //counter라는 콜렉션에 있는 totalPost 라는 항목도 1 증가시켜야함 (수정)
            db.collection('counter').updateOne({name:'게시물갯수'},{ $inc : {totalPost:1} },function(에러, 결과){
                if(에러){return console.log(에러)}
            })
          });

    


    });
    
});








///list로 GET요청으로 접속하면
//실제 DB에 저장된 데이터들로 예쁘게 꾸며진HTML을 보여줌

app.get('/list', function(요총, 응답){
  //디비에 저장된 post라는 collection안의 모든 데이터를 꺼내주세요
    db.collection('post').find().toArray(function(에러, 결과){
        console.log(결과);
        응답.render('list.ejs', { posts : 결과}); //여기가 ejs 파일 보여주는거임
                                               //왜 이렇게 코드 짯냐면 데이터를 먼저 꺼내오고 ejs를 보여줘야겠죠?
    });


    
});

app.delete('/delete', function(요청, 응답){
    console.log(요청.body)
    요청.body._id = parseInt(요청.body._id);
    //요청.body에 담겨온 게시물번호를 가진 글을 db에서 찾아서 삭제해주세요
    db.collection('post').deleteOne(요청.body, function(에러, 결과){
        console.log('삭제완료');
        응답.status(200).send({ messsage : '성공했습니다' });
    });
});



app.get('/detail/:id', function(요청, 응답){
    db.collection('post').findOne({_id : parseInt(요청.params.id)}, function(에러, 결과){
        console.log(결과); 
        응답.render('detail.ejs', {data : 결과});
        //어떤사람이 detail/??로 접속하면
        //DB에서 {_id:?}인 게시물로 찾음 요청.params.id
        //찾은 결과를 detail.ejs로 보냄
    })

})