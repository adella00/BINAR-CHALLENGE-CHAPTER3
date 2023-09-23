// OUR OWN PACKAGE/MODULE
const carRouter = require("./routers/carsRoutes")

// THIRD PARTY PACKAGE/MODULE
const express = require("express")
const morgan = require("morgan")

const app = express()

//middleware
app.use(express.json())
app.use(morgan("dev"))

// our own middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  console.log("Time:", req.requestTime)
  next()
})

app.use("/", carRouter)
app.use("/cars", carRouter)

module.exports = app
