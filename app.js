const express=require("express")
const mongoose=require("mongoose")
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/config');
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');

const app=express();

mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


app.use(bodyParser.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.listen(config.PORT,()=>{
    console.log(`Server is running on port ${config.PORT}`)
})