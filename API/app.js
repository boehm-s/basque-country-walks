import http        from 'http';
import path        from 'path';
import bodyParser  from 'body-parser';
import app         from './config/app';
import walksRoutes from  './routes/walks';

const port	= '3000';
const server	= http.createServer(app);

app.use('/walks', walksRoutes);
app.get('/health-check', (_req, res) => res.json({success: true}));

server.listen(port);
console.log('server listening on port ' + port);


module.exports = app;
