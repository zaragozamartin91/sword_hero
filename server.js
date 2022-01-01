/**
 * Module dependencies.
 */
const express = require('express')
const path = require('path')

const bodyParser = require("body-parser")
const app = module.exports = express()

// Path to the static resources directory
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/sword_hero', express.static(path.join(__dirname, 'docs')))


// Without this you would need to
// supply the extension to res.render()
// ex: res.render('users.html').
app.set('view engine', 'html')

app.get('/config', (_req, res) => {
    const profile = process.env.PROFILE || 'development'
    res.send({ profile })
})


/* istanbul ignore next */
const port = process.env.PORT || 8080
app.listen(port)
console.log('Express started on port ', port)
