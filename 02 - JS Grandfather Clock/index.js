const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('./'));

app.get('/', (req, res) => {
    res.render('index.html');
});

app.listen(3000,  () => {
    console.log('Listening on port 3000...');
})