var express = require('express');
var app = express()
var Sequelize = require('sequelize');
var cors=require('cors');
var bodyParser = require('body-parser');
//GET POST PUT DELETE

var DB_NAME = 'jahaberm_dvd';
var DB_USER = 'jahaberm';
var DB_PASSWORD = '8787266053';
var sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD,{
  dialect: 'mysql',
  host: 'vps.uscitp.com',
  _socket :'/var/lib/mysql/mysql.sock'
});

var dvd_titles = sequelize.define('dvd_titles',{
  title: {
    type: Sequelize.STRING
  },
  award:{
    type: Sequelize.STRING
  },
  movielist:{
    type: Sequelize.STRING
  }
}, {
    timestamps:false
});
//middleware
app.use(cors());
app.use(bodyParser());
app.use(bodyParser.urlencoded({extended: true}));
//ORM =object relational mapper


// app.put('/api/movies/:id', function(request,response){
//   dvd_titles.findById(request.params.id).then(function(title){
//     if (title){
//       title.update({
//         title: request.body.title
//       }).then(function(title){
//         response.json(title);
//       });
//     }else{
//       response.status(404).json({
//         message: 'Movie title not found'
//       });
//     }
//   });
// });

//add movies
app.post('/api/movies', function(request, response){
//response.json(request.body);
var title = dvd_titles.build({
  movielist: request.body.movielist
});

  title.save().then(function(title){
      response.json(title);
  });
});

//delete movies
app.delete('/api/movies/:id', function(request, response){
  dvd_titles.findById(request.params.id).then(function(title){
//if the title is actually found
    if(title){
      title.destroy().then(function(title){
        response.json(title);
      });
    }else{
      response.status(404).json({
        message:'Move title not found'
      });
    }
  });
});
//get all of the movies
app.get('/api/movies', function (request, response){
var promise = dvd_titles.findAll();
promise.then(function(dvd_titles){
    response.json({
    data: dvd_titles
    });
  });
});

//get all of the movies by ID
app.get('/api/movies/byID/:id', function (request, response){
dvd_titles.findById(request.params.id);
promise.then(function(dvd_titles){
    response.json({
    data: dvd_titles
    });
  });
});

//get the movielist
// app.get('/api/movielist', function (request, response){
// var promise = dvd_titles.findAll();
// promise.then(function(dvd_titles){
//     response.json({
//     data: dvd_titles
//     });
//   });
// });



// used in ember search page to search for movies in the db
app.get('/api/movies/search/:id', function (request, response){
var promise =  dvd_titles.findAll({
    where: {
       title: {
         $like: '%' + request.params.id +'%'
       }
}
});

promise.then(function(dvd_titles){
    response.json({
    data: dvd_titles
    });
  });
});


app.listen(3000)
