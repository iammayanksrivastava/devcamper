require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const bootcamps    = require('./routes/routeBootcamps')
const courses      = require('./routes/routeCourses')
const auth         = require('./routes/routeAuth')
const customLog    = require('./middleware/logger')
const errorHandler = require('./middleware/error')
const fileupload   = require('express-fileupload')
const reviews      = require('./routes/routeReview')
const sanitize     = require('express-mongo-sanitize')
const helmet       = require("helmet");
const xss          = require("xss-clean")
const hpp          = require("hpp")
const ratelimit    = require("express-rate-limit")
const cors         = require("cors")

mongoose
  .connect('mongodb://localhost/devcamper', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();


// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileupload())
app.use(sanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(cors()) 


//Express Rate Limit
const limiter = ratelimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter); 


app.use(express.static(path.join(__dirname, 'public')))

//Mount Routes 
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/reviews', reviews)


app.use(errorHandler)


// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



const index = require('./routes/routeBootcamps');
app.use('/', index);


module.exports = app;
