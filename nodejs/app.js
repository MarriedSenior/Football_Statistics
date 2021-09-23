const request = require('request');
/*
const fs = require('fs');
const path = require('path');
const HTTPS = require('https');
const domain = "www.osstestdw.ml"
const sslport = 23023;
*/
var express = require('express')
var app = express()


app.use(express.static(__dirname + '/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
// api키 변경 필요
const api_key = 'e2133d897fmsh64fafbbb5226011p1b0391jsn51403f111f2c'
//팀 정보
var teamStats = []
var teams;
var playerStats = []

//선수 분석
const playerStatOptions = {
  method: 'GET',
  url: 'https://api-football-beta.p.rapidapi.com/players',
  qs: {season: '2020', league: '39', team: '33'},
  headers: {
    'x-rapidapi-key': api_key,
    'x-rapidapi-host': 'api-football-beta.p.rapidapi.com',
    useQueryString: true
  }
};

//팀 분석
var teamStatOptions = {
  method: 'GET',
  url: 'https://api-football-beta.p.rapidapi.com/teams/statistics',
  qs: {team: '33', season: '2019', league: '39'},
  headers: {
    'x-rapidapi-key': api_key,
    'x-rapidapi-host': 'api-football-beta.p.rapidapi.com',
    useQueryString: true
  }
};

// 전체 팀
const teamsOptions = {
  method: 'GET',
  url: 'https://api-football-beta.p.rapidapi.com/teams',
  qs: {league: '39', season: '2020'},
  headers: {
    'x-rapidapi-key': api_key,
    'x-rapidapi-host': 'api-football-beta.p.rapidapi.com',
    useQueryString: true
  }
};



//팀 순위
const standingsOptions = {
  method: 'GET',
  url: 'https://api-football-beta.p.rapidapi.com/standings',
  qs: {season: '2020', league: '39'},
  headers: {
    'x-rapidapi-key': api_key,
    'x-rapidapi-host': 'api-football-beta.p.rapidapi.com',
    useQueryString: true
  }
};

// top 20
const topScorersOptions = {
  method: 'GET',
  url: 'https://api-football-beta.p.rapidapi.com/players/topscorers',
  qs: {season: '2020', league: '39'},
  headers: {
    'x-rapidapi-key': api_key,
    'x-rapidapi-host': 'api-football-beta.p.rapidapi.com',
    useQueryString: true
  }
};



app.get('/TopScorers', function(req, res){
  request(topScorersOptions, function(error, response, body){
    if (error) throw new Error(error);
    var resData = JSON.parse(body)
    res.render('PersonalStanding.ejs', {resData})
  })
})

app.get('/TeamStanding', function(req, res){
  request(standingsOptions, function(error, response, body){
    if (error) throw new Error(error);
    var teamStanding = JSON.parse(body)
    res.render('TeamStanding.ejs', {teamStanding})
  })
})

app.get('/TeamStat', function(req, res){
  res.render('TeamStat.ejs', {teams})
})

app.get('/TeamStat/:id', function(req, res){
  var teamId = req.params.id;
  teamStatOptions.qs.team = teamId;
  request(teamStatOptions, function(error, response, body){
    if (error) throw new Error(error);
    var teamStat = JSON.parse(body)
    var players = [];
    for(var i = 0 ; i < playerStats.length; i++){
      if(playerStats[i].statistics[0].team.id == teamId){
        players.push(playerStats[i]);
      }
    }
    res.render('TeamStatDetail.ejs', {teamStat, players})
  })
})

app.get('/PlayerStat', function(req, res){
  res.render('PersonalStat.ejs', {playerStats})
})
app.get('/PlayerStat/:id', function(req, res){
  var playerStat;
  for(var i = 0 ; i< playerStats.length; i++){
    if((playerStats[i].player.id + "") == req.params.id){
      playerStat = playerStats[i];
      break;
    }
  }
  res.render('PersonalStatDetail.ejs', {playerStat})
})

app.get('/', function(req, res){
  if(playerStats.length == 0){
    request(teamsOptions, function (error, response, body) {
      if (error) throw new Error(error);
      teams = JSON.parse(body)
  
      for(var i = 0 ; i < 20; i++){
        playerStatOptions.qs.team = teams.response[i].team.id;
        request(playerStatOptions, function(error, response, body){
          if (error) throw new Error(error);
          var temp = JSON.parse(body)
          console.log(temp)
          for(var j = 0 ; j < temp.response.length; j++){
            playerStats.push(temp.response[j]);
          }
        })
      }
      res.render('index.ejs');
    });
  }
  else
    res.render('index.ejs');
})

var server = app.listen(23023, function(){
    var host = server.address().address
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port)
})
/*
try {
  const option = {
    ca: fs.readFileSync('/etc/letsencrypt/live/' + domain +'/fullchain.pem'),
    key: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain +'/privkey.pem'), 'utf8').toString(),
    cert: fs.readFileSync(path.resolve(process.cwd(), '/etc/letsencrypt/live/' + domain +'/cert.pem'), 'utf8').toString(),
  };

  HTTPS.createServer(option, app).listen(sslport, () => {
    console.log(`[HTTPS] Server is started on port ${sslport}`);
  });
} catch (error) {
  console.log('[HTTPS] HTTPS 오류가 발생하였습니다. HTTPS 서버는 실행되지 않습니다.');
  console.log(error);
}*/
