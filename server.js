const express = require('express')
const app = express()
const path = require('path')
const port = 3000
 
app.set("views", path.join(__dirname, "views"))
app.set('view engine', 'ejs')

app.use('/', express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.render('index')
})
app.listen(port, () => console.log(`example app listening on port ${port}`))