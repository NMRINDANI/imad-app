var express = require('express');
var morgan = require('morgan');
var path = require('path');
var app = express();
app.use(morgan('combined'));
var crypto=require('crypto');



//---------table test call(pool) from RDBMS DATABASE---

var pool=require('pg').Pool;
var config ={
    user:'nmrindani',
    database:'nmrindani',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:process.env.DB_PASSWORD
};
 
var pool=new pool (config);
app.get('/test-db',function(req,res){

pool.query('SELECT * FROM test',function(err,result){
   
   if (err)
   {
        res.status(500).send(err.toString());
    }
   
    else   {res.send(JSON.stringify(result));
            }
});
});

//-----------------------------------------------------------------------------

function hash(input,salt){
    // how do we create a hash...
  
    var hashed=crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return ["pbkdf2","10000",salt,hashed.toString('hex')].join('$');
}

app.get('/hash/:input', function(req,res){
    var hashedString=hash(req.params.input,"this is ramdom string");
    res.send(hashedString);
    });
    
    
    
app.get('/create-user',function (req,res){
    //username, passowrd
    var salt = crypto.getRandomBytes(128).toString('hex');
    var dbString=hash(password,salt);
    pool.query('INSERT INTO "user"(username,password) VALUES ($1,$2)',(username,dbString) ,function(err,result){
         if (err)
     {
        res.status(500).send(err.toString());
    }
   else{
       res.send(JSON.stringify(result.rows));
     }
    });
});    

//------------creating Tempplate-----funciton+articles

function createTemplate(data){
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;
    
    
var htmlTemplate = `
<html>
    <head>
       
        <title>
          ${title}
        </title>
       
    </head>
        <body>
                <a href="/">Home</a>
             <div>
             <hr/>
              <h3> ${heading}  </h3>    
             </div>
             <div>
             <h4> ${date}<h4>
             </div>
            <h3> This is First page made using html </h3>
            <div>
            <div class="container">
            ${content}
            </div>
        </body>
    
</html>
`;
return htmlTemplate;
}


var articles = {
    
    'articleone' : {
    title: 'Article || NMRINDANI',
    heading: 'Article-one',
    date :'Feb 23 2018',
    content:`
    hi welcome all hi welcome all hi welcome allhi welcome allhi welcome allhi welcome allhi welcome all
    hi welcome allhi welcome allhi welcome allhi welcome all hi welcome all hi welcome all.
    `
},
    'articletwo' : { title: 'Article || NMRINDANI',
    heading: 'Article-two',
    date :'Feb 24 2018',
    content:`
    hi welcome all hi welcome all hi welcome allhi welcome allhi welcome allhi welcome allhi welcome all
    hi welcome allhi welcome allhi welcome allhi welcome all hi welcome all hi welcome all.
    `},
    'articlethree' :{ title: 'Article || NMRINDANI',
    heading: 'Article-three',
    date :'Feb 25 2018',
    content:`
    hi welcome all hi welcome all hi welcome allhi welcome allhi welcome allhi welcome allhi welcome all
    hi welcome allhi welcome allhi welcome allhi welcome all hi welcome all hi welcome all.
    `}
};


//------------------call articleName----------------------

app.get('/:articleName',function (req,res){
    var articleName = req.params.articleName;
    res.send(createTemplate(articles[articleName]));
});

//-------------------------------------------------

//-------pull from article with data article title name  ..io/articles/article-one----

app.get('/articles/:articleName', function (req, res) {
 
 pool.query("SELECT * FROM article WHERE title = '"+ req.params.articleName + "'",function(err,result){
     if (err)
     {
        res.status(500).send(err.toString());
    }
   else
  { if(result.rows.length===0) {
       res.status(404).send('Article not found');
   }
  else
   { var articleData=result.rows[0];
    res.send(createTemplate(articleData));
 }
  }
   });

  });
//-------------------------------------------------------------  
/*app.get('/article2', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article2.html'));
  });
  
app.get('/article3', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article3.html'));
  });  
  */

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});