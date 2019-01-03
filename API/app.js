import http        from 'http';
import path        from 'path';
import app         from './config/app';
import walksRoutes from  './routes/walks';

require('./config/db');

const port	= '3000';
const server	= http.createServer(app);

global.AUTHORIZED_IDS = [];

app.post('/authorize-id/:id', (req, res) => {
    if (req.headers.secret === require('./../secret')) {
	global.AUTHORIZED_IDS.push(req.params.id);
	res.json({success: true});
    } else {
	res.status(401).json({success: true});
    }
});

app.use('/walks', walksRoutes);
app.get('/health-check', (_req, res) => res.json({success: true}));

server.listen(port);
console.log('server listening on port ' + port);

// Express error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Something broke!');
});


module.exports = app;
