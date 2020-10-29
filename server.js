const express = require('express')
const path = require('path')
var bodyParser = require('body-parser')
const app = express()
const port = 3000
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(path.join(__dirname, 'DB/siswa.db'));
 
app.set("views", path.join(__dirname, "views"))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


app.use('/', express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  db.all('select * from siswa', (err, data) => {
    if(err) return res.send (err)
    console.log("hasilnya" ,data);
    res.render('index', { data })
  })
 
})

app.get('/add', function (req, res) {
  res.render('form', {
    title:'form tambah'
  })
})

app.post('/add', function (req, res) {
  db.run('INSERT INTO siswa (nama, umur, tinggi, tanggallahir, ismenikah) values(?,?,?,?,?)', [ req.body.nama, parseInt(req.body.umur), parseFloat(req.body.tinggi), req.body.tanggallahir, req.body.ismenikah], (err)=>{
    if(err) return res.send(err)
    res.redirect('/')
  })
  })
app.listen(port, () => console.log(`example app listening on port ${port}`))