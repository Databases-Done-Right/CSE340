const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const accountCont = {}

/* ****************************************
*  Deliver account view
* *************************************** */
accountCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/management", {
    metaTitle: `Account Management - CSE 340`,
    title: "Management",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver login view
* *************************************** */
accountCont.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    metaTitle: `Account Login - CSE 340`,
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
accountCont.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    metaTitle: `Register for a New Account - CSE 340`,
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
accountCont.registerAccount = async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      metaTitle: `Registration Problem - CSE 340`,
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      metaTitle: `Login - CSE 340`,
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      metaTitle: `Registration Failed - CSE 340`,
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
accountCont.accountLogin = async function accountLogin(req, res, next) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    metaTitle: `Account Login - CSE 340`,
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
}

/* ****************************************
 *  Process logout request
 * ************************************ */
accountCont.accountLogout = async function accountLogout(req, res) {
  let nav = await utilities.getNav()
   res.cookie("jwt", "", { httpOnly: true, maxAge: 0 })
   return res.redirect("/")
}

/* ****************************************
 *  Build account edit form
 * ************************************** */
accountCont.buildAccountEditView = async function (req, res, next) {
  const account_id = parseInt(req.params.accountId)
  const nav = await utilities.getNav()
  const accountInfo = await accountModel.getAccountById(account_id)
  res.render("./account/edit-account", {
    metaTitle: "Edit Account - " + accountInfo.account_firstname + " " + accountInfo.account_lastname + " - CSE 340",
    title: "Edit Account - " + accountInfo.account_firstname + " " + accountInfo.account_lastname,
    nav,
    account_id,
    account_firstname: accountInfo.account_firstname,
    account_lastname: accountInfo.account_lastname,
    account_email: accountInfo.account_email,
    errors: null,
  })
}

/* ****************************************
*  Process Account Updates
* *************************************** */
accountCont.updateAccount = async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  const regResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations ${account_firstname}, your account information has been successfully updated!`
    )
    res.status(201).render("./account/management", {
      metaTitle: `Account Management - CSE 340`,
      title: "Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("./account/management", {
      metaTitle: `Account Management - CSE 340`,
      title: "Management",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
accountCont.updateAccountPassword = async function updateAccountPassword(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("./account/edit-account", {
      metaTitle: `Account Management - CSE 340`,
      title: "Management",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.updateAccountPassword(
    account_id,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, your password has been successfully updated.`
    )
    res.status(201).render("./account/management", {
      metaTitle: `Account Management - CSE 340`,
      title: "Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("./account/management", {
      metaTitle: `Account Management - CSE 340`,
      title: "Management",
      nav,
      errors: null,
    })
  }
}

module.exports = accountCont