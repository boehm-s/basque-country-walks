import express		from 'express';
import session		from 'express-session';
import bodyParser	from 'body-parser';
import logger		from 'morgan';
import cookieParser	from 'cookie-parser';
import path		from 'path';
import fbConfig         from './fb';

const app              = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser({limit: '50mb'}));

app.use(express.static(path.join(__dirname, '..', 'public')));



export default app;
