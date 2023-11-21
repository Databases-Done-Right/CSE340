const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

baseController.badLink = async function(req, res){
  let nav = await utilities.getNav()
  res.render("errors/error", {
    title: '500',
    message: 'Something went wrong :-(',
    nav
  })
}

module.exports = baseController