app.get('/', (req, res) => {
    const page = req.query.page || 1;
    const limit = 3;
    const offset = (page - 1) * limit
  
    db.all('SELECT COUNT(id) as total from siswa ', (err, data) => {
      if (err) return res.send(err)
      if (data.length == 0) res.send('data tidak ada')
      const total = data[0].total
      const pages = Math.ceil(total / limit)
  
      db.all('select * from siswa limit ? offset ?',[limit,offset], (err, data) => {
        if (err) return res.send(err)
        console.log("hasilnya", data);
        res.render('index', {
          data,
          moment,
          page,
          pages
        })
      })
    })
  })