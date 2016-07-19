// import { createStore } from 'redux'

var App = React.createClass({
	getInitialState: function() {
		return {
			gamesInfo: [],
			date: '2015-07-28',
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
	onClick: function(event){
		console.log(this.state.date);
		this.loadDate();
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
									onClick={this.onClick}>Get Games
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
							return (
									<div className="game col-md-3 text-center" key={i}>
										<p className={homeWin}>Home Team: {game.home_team_name}</p>
										<p>Score: {game.linescore.r.home}</p>
										<p className={awayWin}>Away Team: {game.away_team_name}</p>
										<p>Score: {game.linescore.r.away}</p>
									</div>
									)
							}
						)}
					</div>
				</div>
			)
	}
})

ReactDOM.render(
	<App />, document.getElementById('app')
	);