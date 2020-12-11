const express = require('express');
const router = express.Router();

const Team = require('../models/team.js');

router.get('/', (req, res) => {
    let page = 0
	Team.find().sort({ score: 'descending' }).skip(page * 10).limit(10).then((users) => { page += 1; res.json(users)}).catch((err) => console.log(err));
});

router.post('/', (req, res) => {
    let page = 0;
	const { team_name, wins, losses, score } = req.body;
	const newTeam = new Team({
		team_name,
		wins,
		losses,
		score
	});
	newTeam
		.save()
		.then(() =>
			res.json({
				message: 'Created team successfully'
			})
		)
		.catch((err) =>
			res.status(400).json({
				error: err,
				message: 'Error creating team'
			})
		);
});

router.post('/update', (req, res) => {
	const teamsToUpdate = req.body;

	Team.bulkWrite(
		[{
			updateOne: {
				filter: { _id: teamsToUpdate[0]._id },
				update: { ...teamsToUpdate[0] },
				upsert: true
			}
		},
		{
			updateOne: {
				filter: { _id: teamsToUpdate[1]._id },
				update: { ...teamsToUpdate[1] },
				upsert: true
			}
		}]
	).then(() =>
    res.json({
        message: 'Updated pair successfully'
    })
)
.catch((err) =>
    res.status(400).json({
        error: err,
        message: 'Error creating team'
    })
);
		
});
module.exports = router;
