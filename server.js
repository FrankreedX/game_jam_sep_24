const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const http = require('http')
const server = http.createServer(app);

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars')
// app.set('views', './views')

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index');
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let port = process.env.PORT || 3000
server.listen(port, () => {
    console.log('listening on *:', port)
})

exports.server = server
