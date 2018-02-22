var express = require('express');
var morgan = require('morgan');
var path = require('path');

var pool=require('pg').Pool;
var config ={
    user:'nmrindani',
    database:'nmrindani',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:process.env.DB_PASSWORD
    
};
 



var app = express();
app.use(morgan('combined'));


var pool=new pool (config);
app.get('/test-db',function(req,res){
    //make a select request
    //return a response with the results



pool.query('SELECT * FROM test',function(err,result){
   
   if (err)
   {
        res.status(500).send(err.toString());
    }
   
    else   {res.send(JSON.stringify(result));
            }
});
});

function createTemplate (data){
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


//----------------------------------------

app.get('/:articleName',function (req,res){
    var articleName = req.params.articleName;
    res.send(createTemplate(articles[articleName]));
});

//---------------------------------------
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/articles/:articlename', function (req, res) {
 // res.sendFile(path.join(__dirname, 'ui', 'article1.html'));
 
 pool.query("SELECT * FROM article WHERE title = '"+ req.params.articleName + "'",function(err,result){
     if (err)
     {
        res.status(500).send(err.toString());
    }
   else
  // { if(result.rows.length===0) {
    //   res.status(404).send('Article not found');
  // }
  // else
   { var articleData=result.rows[0];
    res.send(createTemplate(articleData));
 }
   }
   });

  });
  
/*app.get('/article2', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article2.html'));
  });
  
app.get('/article3', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article3.html'));
  });  
  */



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