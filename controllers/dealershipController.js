const dealershipModel = require("../models/dealership-model")
const utilities = require("../utilities/")

const dealershipCont = {}

/* ****************************************
*  Deliver main management view
* *************************************** */
dealershipCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./dealership/management", {
    metaTitle: `Dealership Management - CSE 340`,
    title: "Dealership Management",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver add new dealership view
* *************************************** */
dealershipCont.buildAdd = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./dealership/add", {
    metaTitle: `Create a New Dealership - CSE 340`,
    title: "Add A New Dealership",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process New Dealership Form
* *************************************** */
dealershipCont.registerDealership = async function registerDealership(req, res) {
  let nav = await utilities.getNav()
  const { dealership_name, dealership_address } = req.body

  const regResult = await dealershipModel.registerDealership(
    dealership_name,
    dealership_address
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, ${dealership_name} has been successfully added to the site.`
    )
    res.status(201).render("./dealership/management", {
      metaTitle: `Dealership Management - CSE 340`,
      title: "Dealership Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the new dealership was unable to be added.")
    res.status(501).render("./dealership/add", {
      metaTitle: `Add Dealership Failed - CSE 340`,
      title: "Add Dealership",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
dealershipCont.getDealershipJSON = async function getDealership(req, res, next) {
  const dealershipData = await dealershipModel.getAllDealerships()
  if (dealershipData) {
    return res.json(dealershipData.rows)
  } else {
    next(new Error("No data returned"))
  }
}

/* ****************************************
 *  Build dealership delete form
 * ************************************** */
dealershipCont.buildDealershipDeleteView = async function buildDealershipDeleteView(req, res, next) {
  const dealership_id = parseInt(req.params.dealershipId)
  const nav = await utilities.getNav()
  const dealershipInfo = await dealershipModel.getDealershipById(dealership_id)
  res.render("./dealership/delete", {
    metaTitle: "Delete Dealership - " + dealershipInfo.dealership_name + " - CSE 340",
    title: "Delete Dealership - " + dealershipInfo.dealership_name,
    nav,
    dealership_id: dealershipInfo.dealership_id,
    dealership_name: dealershipInfo.dealership_name,
    dealership_address: dealershipInfo.dealership_address,
    errors: null,
  })
}

/* ****************************************
*  Delete Dealership Data
* *************************************** */
dealershipCont.deleteDealership = async function deleteDealership(req, res) {
  let nav = await utilities.getNav()
  const {
    dealership_id,
  } = req.body
  const theDealership = await dealershipModel.getDealershipById(parseInt(dealership_id))
  const deleteResult = await dealershipModel.deleteDealership(
    parseInt(dealership_id),
  )

  const itemName = `${theDealership.dealership_name}`
  if (deleteResult) {
    req.flash("notice", `The ${itemName} dealership was successfully deleted.`)
    res.redirect("/dealership/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("dealership/delete", {
      metaTitle: `Delete ${itemName} Failed - CSE 340`,
      title: `Delete ${itemName}`,
      nav,
      dealership_name,
      dealership_address,
      errors: null,
    })
  }
}


/* ****************************************
 *  Build account edit form
 * ************************************** */
dealershipCont.buildDealershipEditView = async function buildDealershipEditView(req, res, next) {
  const dealership_id = parseInt(req.params.dealershipId)
  const nav = await utilities.getNav()
  const dealershipInfo = await dealershipModel.getDealershipById(dealership_id)
  res.render("./dealership/edit", {
    metaTitle: "Edit Dealership - " + dealershipInfo.dealership_name + " - CSE 340",
    title: "Edit Dealership - " + dealershipInfo.dealership_name,
    nav,
    dealership_id,
    dealership_name: dealershipInfo.dealership_name,
    dealership_address: dealershipInfo.dealership_address,
    errors: null,
  })
}

/* ****************************************
*  Process Dealership Updates
* *************************************** */
dealershipCont.updateDealership = async function updateDealership(req, res) {
  let nav = await utilities.getNav()
  const { dealership_id, dealership_name, dealership_address } = req.body

  const regResult = await dealershipModel.updateDealership(
    dealership_id,
    dealership_name,
    dealership_address
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations the information associated with the ${dealership_name} has been successfully updated!`
    )
    res.status(201).render("./dealership/management", {
      metaTitle: `Dealership Management - CSE 340`,
      title: "Dealership Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("./dealership/management", {
      metaTitle: `Dealership Management - CSE 340`,
      title: "Dealership Management",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
/*accountCont.updateAccountPassword = async function updateAccountPassword(req, res) {
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
} */

module.exports = dealershipCont