const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
const MongoClient = require('mongodb').MongoClient;
const methodeOverride =require('method-override')
app.use(methodeOverride('_methode'))
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

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


// app.get('/index', function(요청, 응답){ // '/'는 기본값홈페이지로 지정함
  //  응답.render('/index.ejs')
//});
// app.get('/write', function(요청, 응답){
  //  응답.render('/write.ejs');
 //}); 


 app.get('/index', function(요청, 응답){
      db.collection('post').find().toArray(function(에러, 결과){
          console.log(결과);
          응답.render('index.ejs', { posts : 결과}); 
      });
  });

  app.get('/', function(요청, 응답){
    db.collection('post').find().toArray(function(에러, 결과){
        console.log(결과);
        응답.render('write.ejs', { posts : 결과}); 
    });
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

app.get('/list', function(요청, 응답){
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


app.get('/edit/:id', function(요청,응답){

    db.collection('post').findOne({_id : parseInt(요청.params.id)}, function(에러, 결과){
        console.log(결과)
        응답.render('edit.ejs', {post : 결과})
    })
    
})

//$set은 업데이트 해주세요(없으면 추가해주시고요)
app.put('/edit', function(요청, 응답){
    db.collection('post').updateOne({ _id : parseInt(요청.body.id)},{ $set : { 제목: 요청.body.title, 날짜 : 요청.body.date } }, function
        (에러, 결과){ 
        console.log('수정완료')
        응답.redirect('/list')
    })
    
});

const passport = require('passport');
const LocalStraregy = require('passport-local').Strategy;
const session = require('express-session');

app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/login', function(요청, 응답){
    응답.render('login.ejs')
});


app.post('/login', passport.authenticate('local', {
    failureRedirect : '/fail' // 실패하면 이거코드 실행
}), function(요청, 응답){
    응답.redirect('/')         // 성공하면 회원인증하고 redirect
});

app.get('/mypage', 로그인했니, function(요청, 응답){
    console.log(요청.user)
    응답.render('mypage.ejs', {사용자 : 요청.user})
})

function 로그인했니(요청, 응답, next){
    if(요청.user){
        next()
    }else {
        응답.send('로그인 해주세요!')
    }
}


//로그인기능 구현 및 id/pw Strategy이용해서 DB와 맞는지
passport.use(new LocalStraregy({
    usernameField: 'id',
    passwordField: 'pw',
    session: true,
    passReqToCallback: false,
  }, function (입력한아이디, 입력한비번, done) {
    //console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({ id: 입력한아이디 }, function (에러, 결과) {
      if (에러) return done(에러)
  
      if (!결과) return done(null, false, { message: '존재하지않는 아이디요' })
      if (입력한비번 == 결과.pw) { //DB에 아이디가 있으면, 입력한비번과 결과.pw 비교
        return done(null, 결과)
      } else {
        return done(null, false, { message: '비번틀렸어요' })
      }
    })
  }));


  //세션 만들기
  passport.serializeUser(function(user, done){ //세션을 저장시키는 코드(로그인 성공시 발동)
    done(null, user.id)
  });

  passport.deserializeUser(function(아이디, done){ //이 세션 데이터를 가진 사람을 DB에서 찾아주세요(마이페이지 접속시 발동)
    db.collection('login').findOne({id : 아이디}, function(에러, 결과){
        done(null, 결과)
    })
    
  });