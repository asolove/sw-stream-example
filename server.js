let express = require('express')
let layouts = require('express-ejs-layouts')

let app = express()
app.set('view engine', 'ejs')
app.use(layouts)
app.use(express.static('static'))

let renderView = (file, title) => (req, res) =>
  res.render(file, {
    title: title,
    layout: 'nolayout' in req.query ? "inline" : "layout"
  })

app.get('/', renderView("home", "My fast site"))
app.get('/about', renderView("about", "About"))

let renderPartial = (file) => (req, res) =>
  res.render(file, {layout: false, title: ""})

app.get('/header', renderPartial("header"))
app.get('/footer', renderPartial("footer"))


app.listen(3000)
