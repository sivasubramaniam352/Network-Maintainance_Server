const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan')
const passport = require('passport')

app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("combined"));
app.use(cors());
app.use(morgan('dev'))
 
//Passport
app.use(passport.initialize());

require('./globalFunctions');
const uri =  `mongodb://localhost:27017/N&M`
// const uri = 'mongodb+srv://siva:5353@learningcluster-jr3su.mongodb.net/test?retryWrites=true&w=majority'
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


mongoose.connect(uri)

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('DB connected successfully');
});

const imgRoute = require('./routes/api')

app.use('/api', imgRoute)

const PORT = 8001 
app.listen(PORT, () => {
    console.log(`server started at ${PORT}`);
})
