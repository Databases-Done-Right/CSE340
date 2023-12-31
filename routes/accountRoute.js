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

// Route to logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

// Route to build account by subpage
router.get("/edit/:accountId", utilities.handleErrors(accountController.buildAccountEditView));

// Route to update an account's information
router.post("/edit/", utilities.checkLogin, regValidate.accountUpdateRules(), regValidate.checkAccountUpdateData, utilities.handleErrors(accountController.updateAccount))

// Route to change an account's password
router.post("/change-password/", utilities.checkLogin, regValidate.passwordUpdateRules(), regValidate.checkPasswordUpdateData, utilities.handleErrors(accountController.updateAccountPassword))

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