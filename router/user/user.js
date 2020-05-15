const Express = require('express');
const app = Express();

app.get('/', function (req, res) {
    res.send('Hello World');
})

app.get('/user/login', function(req, res) {
    let loginID = req.body.loginID;
    let loginPassword = req.body.loginPassword;

    
})

// PORT
const port = process.env.PORT || 3000;
const server = app.listen(port, function() {
    const host = server.address().address;
    const port = server.address().port;

    console.log("Start listening at port: " + port);
})