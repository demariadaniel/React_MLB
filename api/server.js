var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(express.static(__dirname + './../app'));
app.use(bodyParser());
var request = require('request');

app.listen(8080, function(){
	console.log('Listening on Port 8080');
});

MLBurl = 'http://gd2.mlb.com/components/game/mlb/year_2015/month_07/day_28/master_scoreboard.json';

var mlb;

app.post('/api', function(req,res){
	MLBurl = 'http://gd2.mlb.com/components/game/mlb/year_' + req.body.year + '/month_' + req.body.month + '/day_' + req.body.day + '/master_scoreboard.json'
	console.log(MLBurl);
	request.get(MLBurl, function(err, response){
		if (err){
			console.log("Error: " + err)
			return
		}
		if (response.body == "GameDay - 404 Not Found"){
			console.log(response.body)
			games = ['No data available'];
			res.send(games)
			return
		}
		mlb = JSON.parse(response.body);
		if (!mlb.data.games.game) {
			games = ['No games scheduled'];
			res.send(games);
			return
		}
		games = mlb.data.games.game;
		res.send(games);
		console.log(mlb.data.games);
	});
});