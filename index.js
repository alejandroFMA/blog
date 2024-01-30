const express = require('express');
const cors = require('cors');
require('./database/connection');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const routesArticle = require("./routes/article")
app.use ("/api/", routesArticle)



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})