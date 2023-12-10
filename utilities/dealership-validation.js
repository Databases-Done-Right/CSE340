const utilities = require(".")
const { body, validationResult } = require("express-validator")
const dealershipModel = require("../models/dealership-model")
const validate = {}

/*  **********************************
 *  Dealership Addition Data Validation Rules
 * ********************************* */
validate.dealershipRules = () => {
    return [
      // name is required and must be string
      body("dealership_name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide the name of this dealership."), // on error this message is sent.
  
      // address is required and must be string
      body("dealership_address")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide the address for this dealership.") // on error this message is sent.

    ]
}

/* ******************************
 * Check data and return errors or continue to dealership addition
 * ***************************** */
validate.checkDealershipData = async (req, res, next) => {
    const { dealership_name, dealership_address } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("./dealership/add", {
        errors,
        metaTitle: `Create a New Dealership - CSE 340`,
        title: "Add A New Dealership",    
        nav,
        dealership_name, dealership_address,
      })
      return
    }
    next()
}

/*  **********************************
 *  Dealership Data Validation Rules
 * ********************************* */
validate.dealershipUpdateRules = () => {
  return [
    // name is required and must be string
    body("dealership_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please provide the name of this dealership."), // on error this message is sent.

  // address is required and must be string
  body("dealership_address")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please provide the address for this dealership.") // on error this message is sent.
  ]
}

/* ******************************
 * Check data and return errors or continue to account update
 * ***************************** */
validate.checkDealershipUpdateData = async (req, res, next) => {
  const { dealership_id, dealership_name, dealership_address } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    const dealershipInfo = await dealershipModel.getDealershipById(dealership_id)
    let nav = await utilities.getNav()
    res.render("./dealership/edit", {
      errors,
      metaTitle: "Edit Dealership - " + dealershipInfo.dealership_name + " - CSE 340",
      title: "Edit Dealership - " + dealershipInfo.dealership_address,
      nav,
      dealership_name: dealershipInfo.dealership_name,
      dealership_address: dealershipInfo.dealership_address,
      dealership_id
    })
    return
  }
  next()
}
  
module.exports = validate