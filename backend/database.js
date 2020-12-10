const mongoose = require('mongoose');
const connection = "mongodb+srv://hacker-username:Kaz5tyLCNioE1EWD@cluster0.a7jqf.mongodb.net/leaderboard?retryWrites=true&w=majority";
mongoose.connect(connection,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log('check!', err));
