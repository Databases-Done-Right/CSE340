const utilities = require("../utilities/")
const dealershipModel = require("../models/dealership-model")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  const dealershipData = await dealershipModel.getAllDealerships()
  const dealershipBlocks = await utilities.buildDealershipGrid(dealershipData.rows)
  // req.flash("notice", "This is a flash message.") // the first parameter is the class that is assigned to the message itself
  res.render("index", {
    metaTitle: `CSE 340 - Homepage`,
    title: "Home",
    nav,
    dealershipBlocks,
    errors: null,
  })
}

baseController.badLink = async function(req, res){
  let nav = await utilities.getNav()
  res.render("errors/error", {
    metaTitle: `CSE 340 - Server 500 Error`,
    title: '500',
    message: 'Something went wrong :-(',
    nav,
    errors: null,
  })
}

module.exports = baseController