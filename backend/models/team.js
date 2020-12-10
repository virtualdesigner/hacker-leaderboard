const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
    team_name: {
        type: String,
        required: true
    },
    wins: {
        type: Number,
        required: true
    },
    losses: {
        type: Number,
        required: true
    },
    ties: {
        type: Number,
        required: true
    },
    score: {
        type: Number,
        required: true
    }
})
module.exports = mongoose.model("Team", teamSchema, "teams")