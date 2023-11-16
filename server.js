/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
var path = require('path')
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")


/* ***********************
 * View Engine and Templates
 *************************/

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

// Original index route ... it was later replaced with a dynamic db call (see below)
//app.get("/", (req, res) => {
//  res.render(path.join(__dirname, './views', 'index.ejs'))
//})

// Index route - this route is served by the buildHome function within the baseController file
app.get("/", baseController.buildHome)

// Inventory routes - any route that starts with /inv will be redirected to the inventoryRoute file to find the rest of the route
app.use("/inv", inventoryRoute)

app.use(express.static(path.join(__dirname, '/public')))