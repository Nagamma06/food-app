const express = require('express');
const colors = require('colors');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDb = require('./config/db')

//dot env configuration
dotenv.config();

//DB connection
connectDb();
// rest object
const app = express();

//middleware
app.use(cors());
app.use(express.json()); //data in json format from client
app.use(morgan('dev')); //


//route
//http://localhost:8080
app.use('/api/v1/test',require('./routes/testRoute'))
app.use('/api/v1/auth',require('./routes/authRoutes'))
app.get('/',(req,res)=>{
  return res.status(200).send("<h1>Welcome to Food Server App</h1>");
})

//PORT
const PORT=process.env.PORT || 5000

//listen 
app.listen(PORT,()=>{
 console.log(`node server running on ${PORT}`.white.bgMagenta);
})