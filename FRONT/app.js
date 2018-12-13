const path       = require('path');
const http       = require('http');
const express    = require('express');
const bodyParser = require('body-parser');

const app        = express();
const server     = http.createServer(app);
const port       = process.env.PORT || process.env.port || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/',        (req, res) => {
    res.render('index', {});
});


server.listen(port, () => {
    console.log(`started on port ${port}`);
});
