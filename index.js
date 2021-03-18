const express = require('express')
const morgan = require('morgan')
const connectDB = require('./config/db');
const app= express();

app.use(morgan('tiny'));
connectDB();

app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.set('view engine', 'ejs')
app.use(express.static('./public'))
app.get('/',(req,res) => {
    res.render('index.ejs',{
        message: "",
        urlvalue:""
    })
})

app.use('/api/url', require('./routes/url'));
app.use('/', require('./routes/index'));

const port = 3000
app.listen(port, () => {
    console.log('server is up on 3000');
})