import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = function() {
	const [ teams, setTeams ] = useState([]);
	const [ selectedTeams, addToSelectedTeams ] = useState([]);
	const [ showAddTeam, changeAddPopup ] = useState(false);
	const [ showDeclarePopup, changeDeclarePopup ] = useState(false);
	const [ newTeamName, changeTeamName ] = useState('');
	const [ showSelect, changeSelectStatus ] = useState(false);
  const [ disableCheckboxes, changeCheckboxStatus ] = useState(false);
  const [pairStatus, changePairStatus] = useState('won')

	useEffect(() => {
		axios.get('/api/teams').then((res) => setTeams(res.data)).catch((err) => console.log(err));
	}, []);

	function goToNextPage() {
    axios.get('/api/teams').then((res) => setTeams(res.data)).catch((err) => console.log(err));
  }

	function goToPreviousPage() {}

	function addNewTeam() {
		if (typeof newTeamName === 'string' && newTeamName.trim().length > 0) {
			const newTeamInfo = {
				team_name: newTeamName,
				wins: 0,
				losses: 0,
				score: 0,
				ties: 0
			};
			axios
				.post('/api/teams', newTeamInfo)
				.then(function() {
					alert('Team added successfully!');
					window.location.reload();
				})
				.catch(function() {
					alert('Could not creat account. Please try again');
				});
		} else {
			window.alert('Team name field is empty!');
		}
  }
  
  function updatePairStatus() {
    const teamsToUpdate = []
    if(pairStatus === 'won') {
      teamsToUpdate.push({...selectedTeams[0], score: selectedTeams[0].score + 2, wins: selectedTeams[0].wins + 1}) 
      teamsToUpdate.push({...selectedTeams[1], losses: selectedTeams[1].losses + 1})
    } else if (pairStatus === "tied") {
      teamsToUpdate.push({...selectedTeams[0], score: selectedTeams[0].score + 1, ties: selectedTeams[0].ties + 1}) 
      teamsToUpdate.push({...selectedTeams[1], score: selectedTeams[1].score + 1, ties: selectedTeams[1].ties + 1})
    } else if (pairStatus === 'lost') {
      console.log(selectedTeams[0], selectedTeams[1])
      teamsToUpdate.push({...selectedTeams[0], losses: selectedTeams[0].losses + 1})
      teamsToUpdate.push({...selectedTeams[1], wins: selectedTeams[1].wins + 1, score: selectedTeams[1].score + 2})
    }

    axios
				.post('/api/teams/update', teamsToUpdate)
				.then(function() {
					alert('Pair updated successfully!');
					window.location.reload();
				})
				.catch(function() {
					alert('Could not update pair. Please try again');
				});
  }

	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				paddingTop: '100px',
				paddingBottom: '100px'
			}}
		>
			{showAddTeam && (
				<form
					style={{
						height: '300px',
						width: '500px',
						position: 'fixed',
						zIndex: 2,
						boxShadow: '0px 0px 20px 0.2px #828282',
						top: '30%',
						backgroundColor: 'white',
						position: 'relative',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<img src="" style={{ position: 'absolute' }} />
					<h1 style={{ fontFamily: 'sans-serif' }}>Add New Team</h1>
					<input
						type="text"
						placeholder="Team Name"
						onChange={(e) => changeTeamName(e.target.value)}
						value={newTeamName}
					/>
					<button
						style={{
							border: 'none',
							height: '40px',
							width: '110px',
							boxShadow: '0px 0px 5px 0.2px #828282',
							cursor: 'pointer',
							margin: '15px',
							outline: 'none'
						}}
						onClick={addNewTeam}
					>
						Insert
					</button>
				</form>
			)}
			{showDeclarePopup && (
				<div
					style={{
						height: '300px',
						width: '500px',
						position: 'fixed',
						zIndex: 2,
						boxShadow: '0px 0px 20px 0.2px #828282',
						top: '30%',
						backgroundColor: 'white',
						position: 'fixed',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<span>
						{selectedTeams[0].team_name}
						<select style={{marginLeft: '8px', marginRight: '8px', marginBottom: '20px'}} onClick={(e) => {
              console.log(e.target.value)
              if(e.target.value == "Won") {
                changePairStatus('won')
              } else if(e.target.value == "Lost with") {
                changePairStatus('lost')
              } else if(e.target.value == "Tied with") {
                changePairStatus('tied')
              }
            }
            }>
							<option>Won</option>
							<option>Lost with</option>
							<option>Tied with</option>
						</select>
						{selectedTeams[1].team_name}
					</span>
					<button
						style={{
							border: 'none',
							height: '40px',
							width: '110px',
							boxShadow: '0px 0px 5px 0.2px #828282',
							cursor: 'pointer',
							margin: '15px',
							outline: 'none'
						}}
						onClick={updatePairStatus}
					>
						Update
					</button>
				</div>
			)}
			<div style={{ display: 'flex' }}>
				<button
					style={{
						border: 'none',
						height: '40px',
						width: '110px',
						boxShadow: '0px 0px 5px 0.2px #828282',
						cursor: 'pointer',
						margin: '15px',
						outline: 'none'
					}}
					onClick={() => changeSelectStatus(true)}
				>
					Select Teams
				</button>
				<button
					style={{
						border: 'none',
						height: '40px',
						width: '110px',
						boxShadow: '0px 0px 5px 0.2px #828282',
						cursor: 'pointer',
						margin: '15px',
						outline: 'none'
					}}
					onClick={() => changeAddPopup(true)}
				>
					Add New Team
				</button>
			</div>
			<table>
				<caption>Hackers Leaderboard</caption>
				<thead>
					<tr>
						{showSelect && <th scope="col">Select</th>}
						<th scope="col">Ranking</th>
						<th scope="col">Name</th>
						<th scope="col">Wins</th>
						<th scope="col">Losses</th>
						<th scope="col">Ties</th>
						<th scope="col">Score</th>
					</tr>
				</thead>
				<tbody>
					{teams.map((team, idx) => {
						return (
							<tr>
								{showSelect && (
									<td>
										<input
											type="checkbox"
											onClick={(e) => {
												console.log(e.target.checked, disableCheckboxes, selectedTeams);
												const isToSelect = e.target.checked;
												if (!disableCheckboxes || selectedTeams.includes(team)) {
													if (isToSelect) {
														// user selects the checkbox
														if (selectedTeams.length >= 1) {
															changeCheckboxStatus(true);
															changeDeclarePopup(true);
														}
														addToSelectedTeams([ ...selectedTeams, team ]);
													} else {
														// user de-selects the checkbox
														addToSelectedTeams(
															selectedTeams.filter(
																(selectedTeam) => team._id !== selectedTeam._id
															)
														);
														changeCheckboxStatus(false);
													}
												}
											}}
											disabled={disableCheckboxes && !selectedTeams.includes(team)}
										/>
									</td>
								)}
								<td>{idx + 1}</td>
								<td>{team.team_name}</td>
								<td>{team.wins}</td>
								<td>{team.losses}</td>
								<td>{team.ties}</td>
								<td>{team.score}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<div style={{ display: 'flex' }}>
				<button
					style={{
						border: 'none',
						height: '40px',
						width: '110px',
						boxShadow: '0px 0px 5px 0.2px #828282',
						cursor: 'pointer',
						margin: '15px',
						outline: 'none'
					}}
					onClick={goToPreviousPage}
				>
					Back
				</button>
				<button
					style={{
						border: 'none',
						height: '40px',
						width: '110px',
						boxShadow: '0px 0px 5px 0.2px #828282',
						cursor: 'pointer',
						margin: '15px',
						outline: 'none'
					}}
					onClick={goToNextPage}
				>
					Next
				</button>
			</div>
		</div>
	);
};
export default App;
