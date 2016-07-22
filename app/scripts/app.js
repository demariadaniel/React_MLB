import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router'
import { createStore } from 'redux'

var store = createStore(() => {});

var reducer = function (state = {}, action) {
    console.log('reducer_1 was called with state', state, 'and action', action)
    return state;
}

store = createStore(reducer);

console.log(store.getState());

var Games = React.createClass({
	getInitialState: function() {
		return {
			gamesInfo: [],
			date: '2015-07-28',
			gameDetail: {}
			}
		},
	componentDidMount: function() {
			this.loadDate();
		},
	loadDate: function(){
		let self = this;
		console.log(self.state.date);
		let year = self.state.date.substr(0,4);
		let month = self.state.date.substr(5,2);
		let day = self.state.date.substr(8,2);
		console.log(year + " " + month + " " + day);
		$.ajax({
				type: "POST",
				url: '/api',
				dataType: 'json',
				data:{year:year, month:month, day:day},
				success: function(data){
					if (data == undefined) {
						console.log('no games')
					} else {
						console.log(data);
						if (Array.isArray(data) != true){
							data = [data];
							console.log('this is the problem');
						}
						self.setState({gamesInfo: data});
					}}
				})
	},
	onChange: function(event){
		console.log(event.target.value);
		this.setState({date: event.target.value});
	},
	handleGetGamesClick: function(event){
		console.log(this.state.date);
		this.loadDate();
	},
	getGameDetail: function(game){
		console.log(game);
		var reducer = function (state = {}, action) {
    		console.log('reducer_1 was called with state', state, 'and action', action)
    		return state;
			}

		store = createStore(reducer);
		//this.loadDate();
	},
	render: function(){
		return (
				<div className="appBox container">
					<div className="row">
						<div className="dates col-md-3">
							<input 	className="form-control input-md" 
									type="date" 
									name="date" 
									value={this.state.date}
									onChange={this.onChange}>
							</input>
							<button className="btn btn-default"
									onClick={this.handleGetGamesClick}>Get Games
							</button>
						</div>
					</div>
					<div className="row appRow">
						{this.state.gamesInfo.map((game,i) => {
							let homeWin = "";
							let awayWin = "";
							if (!game.linescore) {
								return (
										<div className="game col-md-3 text-center" key={i}>
											<p>{game}</p>
										</div>
									)
							}
							if (game.linescore.r.home > game.linescore.r.away) {
								homeWin = "homeWin";
								awayWin = "";
									} else {
										homeWin = "";
										awayWin = "awayWin";
									}
									//use Redux to share state btwn {Games} and {Details}	 onClick={this.setState({gameDetail: game})}
									//<Link to="/details">
							return (
									<div className="game col-md-3 text-center" key={i} 
										onClick={function(){
													console.log(game);
													var reducer = function (state = {}, action) {
											    		action.item = game;
												    	switch (action.type){
												    		case'GAME_DETAIL':
												    			return [
												    				...state,
												    				action.item
												    			]
												    		default:
												    			return state;
												    	}
													}
													store = createStore(reducer);
													store.dispatch({type: 'GAME_DETAIL'})
													console.log(store.getState());
											}}>
										<Link to="/details">
											<p className={homeWin}>Home Team: {game.home_team_name}</p>
											<p>Score: {game.linescore.r.home}</p>
											<p className={awayWin}>Away Team: {game.away_team_name}</p>
											<p>Score: {game.linescore.r.away}</p>
										</Link>
									</div>
									)
								}
							)}
					</div>
				</div>
			)
	}
})

var Details = React.createClass({
	getInitialState: function() {
		return {
			gameDetail: store.getState()[0]
			}
		},
	render: function() {
		console.log(this.state.gameDetail);
		return(
			<div className="appBox container">
				<div className="innBox">
					<h1>Details</h1>
					<Link to="/">
						<button className="btn btn-primary btnBack">Back</button>
					</Link>
				</div>
				<div className="row innBox text-center">
					<div className="col-md-5">
						<h2>{this.state.gameDetail.home_team_name}</h2>
						<h3>{this.state.gameDetail.linescore.r.home}</h3>
					</div>
					<div className="col-md-5 col-md-offset-1 text-center">
						<h2>{this.state.gameDetail.away_team_name}</h2>
						<h3>{this.state.gameDetail.linescore.r.away}</h3>
					</div>
				</div>
				<div className="row innBox text-center">
						<div className="col-md-4">
							<h4>E</h4>
							<p>Away: {this.state.gameDetail.linescore.e.away}</p>
							<p>Home: {this.state.gameDetail.linescore.e.home}</p>
							<h4>H</h4>
							<p>Away: {this.state.gameDetail.linescore.h.away}</p>
							<p>Home: {this.state.gameDetail.linescore.h.home}</p>
						</div>
						<div className="col-md-4">
							<h4>HR</h4>
							<p>Away: {this.state.gameDetail.linescore.hr.away}</p>
							<p>Home: {this.state.gameDetail.linescore.hr.home}</p>
							<h4>R</h4>
							<p>Away: {this.state.gameDetail.linescore.r.away}</p>
							<p>Home: {this.state.gameDetail.linescore.r.home}</p>
						</div>
						<div className="col-md-4">
							<h4>SB</h4>
							<p>Away: {this.state.gameDetail.linescore.sb.away}</p>
							<p>Home: {this.state.gameDetail.linescore.sb.home}</p>
							<h4>SO</h4>
							<p>Away: {this.state.gameDetail.linescore.so.away}</p>
							<p>Home: {this.state.gameDetail.linescore.so.home}</p>
						</div>
				</div>
			</div>
			)
	}
})

ReactDOM.render((
	<Router history={browserHistory}>
		<Route path='/' component={Games} />	
			<Route path='/details' component={Details} />
	</Router>), 
	document.getElementById('app')
	);