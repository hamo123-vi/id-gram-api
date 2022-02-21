const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')

//Load env variables
dotenv.config({ path : './config/config.env'})

//Load routes
const auth = require('./routes/auth');
const users = require('./routes/users');

//Initializing app
const app = express()

//Connect to database
connectDB()

//Body parser
app.use(express.json())

//File upload
app.use(fileUpload());

//Enable CORS
app.use(cors());

//Make 'public' folder static
app.use(express.static(path.join(__dirname, 'public')))

//Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

//Error handler
app.use(errorHandler)

//Create Express server
const PORT = process.env.PORT;
const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode in port ${PORT}`))