import _debug   from 'debug';
import mongoose from 'mongoose';

const debug = _debug('mongoose');
const error = _debug('mongoose:error');
const dbURI = 'mongodb://localhost:27017/basque-country-walks';

mongoose.connect(dbURI, {
    useNewUrlParser: true
});

mongoose.connection.on('connected',    _ => debug(`Mongoose default connection open to ${dbURI}`));
mongoose.connection.on('error',        e => error(`Mongoose default connection error: ${e}`));
mongoose.connection.on('disconnected', _ => debug('Mongoose default connection disconnected'));

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', _ =>  {
    mongoose.connection.close(_ => {
	error('Mongoose default connection disconnected through app termination');
	process.exit(0);
    });
});
