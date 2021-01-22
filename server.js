const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const moment = require('moment')
const app = express()
const port = 3000
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(path.join(__dirname, 'DB/siswa.db'));

app.set("views", path.join(__dirname, "views"))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, 'public')))

app.get('/',(req, res, next)=>{
  res.render('login')
})

app.get('/', (req, res) => {
  const {
    cid,
    id,
    cnama,
    nama,
    cumur,
    umur,
    ctinggi,
    tinggi,
    ctanggallahir,
    startdate,
    enddate,
    cismenikah,
    ismenikah
  } = req.query
  let params = [];

  if (cid && id) {
    params.push(`id = ${id}`);
  }
  if (cnama && nama) {
    params.push(`nama  like %${nama}%`);
  }
  if (cumur && umur) {
    params.push(`umur  ${umur}`);
  }
  if (ctinggi && tinggi) {
    params.push(`tinggi  ${tinggi}`);

  }
  if (ctanggallahir && startdate && enddate) {
    params.push(`tanggallahir between '${startdate}' and '${enddate}'`);
  }
  if (cismenikah && ismenikah) {
    params.push(`ismenikah  ${ismenikah}`);
  }

  const page = req.query.page || 1;
  const limit = 3;
  const offset = (page - 1) * limit

  let sql = 'SELECT COUNT(id) as total from siswa';

  if (params.length > 0) {
    sql += ` where ${ params.join(' AND ')}`
  }

  db.all(sql, (err, data) => {
    if (err) return res.send(err)
    if (data.length == 0) res.send('data tidak ada')
    const total = data[0].total
    const pages = Math.ceil(total / limit)

    sql = 'select * from siswa'
    if (params.length > 0) {
      sql += ` where ${ params.join(' AND ')}`
    }
    sql += ` limit ? offset ?`;


    console.log(sql);
    db.all(sql, [limit, offset], (err, data) => {
      if (err) return res.send(err)
      console.log("hasilnya", data);
      res.render('index', {
        data,
        moment,
        page,
        pages,
        query: req.query
      })
    })
  })
})

app.get('/add', function(req, res) {
  res.render('form', {
    title: 'form tambah',
    item: {}
  })
})

app.post('/add', function(req, res) {
  db.run('INSERT INTO siswa (nama, umur, tinggi, tanggallahir, ismenikah) values(?,?,?,?,?)', [req.body.nama, parseInt(req.body.umur), parseFloat(req.body.tinggi), req.body.tanggallahir, JSON.parse(req.body.ismenikah)], (err) => {
    if (err) return res.send(err)
    res.redirect('/')
  })
})

app.get('/edit/:id', function(req, res) {
  db.all('SELECT * FROM siswa WHERE id=?', [parseInt(req.params.id)], (err, data) => {
    if (err) return res.send(err)
    if (data.length == 0) res.send('data tidak ada')
    res.render('form', {
      title: "form edit",
      item: data[0]
    })
  })
})

app.post('/edit/:id', function(req, res) {
  db.run('UPDATE siswa SET nama=?, umur=?, tinggi=?, tanggallahir=?, ismenikah=? WHERE id=?', [req.body.nama, parseInt(req.body.umur), parseFloat(req.body.tinggi), req.body.tanggallahir, JSON.parse(req.body.ismenikah), parseInt(req.params.id)], (err) => {
    if (err) return res.send(err)
    res.redirect('/')
  })
})

app.get('/delete/:id', function(req, res) {
  db.run('DELETE FROM siswa WHERE id=?', [parseInt(req.params.id)], (err, data) => {
    if (err) return res.send(err)
    res.redirect('/')
  })
})

app.listen(port, () => console.log(`example app listening on port ${port}`))