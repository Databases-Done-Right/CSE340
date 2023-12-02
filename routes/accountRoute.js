// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

// Route to main account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement));

// Route to build account by subpage
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build account signup subpage
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to handle the account signup
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
  )

module.exports = router;