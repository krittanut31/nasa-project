const express = require('express')
const cors = require('cors')

const planetesRouter = require('./routes/planets/planets.router')

const app = express()

app.use(cors({
  origin:'http://localhost:3000'
}))
app.use(express.json())
app.use(planetesRouter)

module.exports = app