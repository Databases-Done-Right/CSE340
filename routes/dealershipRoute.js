// Needed Resources 
const express = require("express")
const router = new express.Router() 
const dealershipController = require("../controllers/dealershipController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/dealership-validation')

// Route to main dealership management view
router.get("/", utilities.checkLogin, utilities.checkIsAdmin, utilities.handleErrors(dealershipController.buildManagement));

// Route to build dealership by subpage
router.get("/edit/:dealershipId", utilities.checkLogin, utilities.checkIsAdmin, utilities.handleErrors(dealershipController.buildDealershipEditView));

// Route to update an dealership's information
router.post("/edit/", utilities.checkLogin, utilities.checkIsAdmin, regValidate.dealershipUpdateRules(), regValidate.checkDealershipUpdateData, utilities.handleErrors(dealershipController.updateDealership))

// Route to perform the dealership delete
router.post("/delete/", utilities.checkLogin, utilities.checkIsAdmin, utilities.handleErrors(dealershipController.deleteDealership))

// Route to delete a dealership
router.get("/delete/:dealershipId", utilities.checkLogin, utilities.checkIsAdmin, utilities.handleErrors(dealershipController.buildDealershipDeleteView))

// Route to build account signup subpage
router.get("/add", utilities.checkLogin, utilities.checkIsAdmin, utilities.handleErrors(dealershipController.buildAdd));

// Route to retrieve dealerships via ajax
router.get("/getDealerships/", utilities.handleErrors(dealershipController.getDealershipJSON))

// Route to handle the account signup
router.post(
    "/add",
    utilities.checkLogin, utilities.checkIsAdmin, 
    regValidate.dealershipRules(),
    regValidate.checkDealershipData,
    utilities.handleErrors(dealershipController.registerDealership)
)

module.exports = router;