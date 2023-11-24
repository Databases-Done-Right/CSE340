const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build vehicle by vehicle view
 * ************************** */
invCont.buildByVehicleId = async function (req, res, next) {
  const vehicle_id = req.params.vehicleId
  const data = await invModel.getInventoryByVehicleId(vehicle_id)
  const view = await utilities.buildVehicleView(data)
  const nav = await utilities.getNav()
  const {
    inv_year: year,
    inv_make: make,
    inv_model: model,
  } = data[0]
  res.render("./inventory/vehicle", {
    metaTitle: `${year} ${make} ${model} - CSE 340`,
    title: `${year} ${make} ${model}`,
    nav,
    view,
    errors: null,
  })
}

module.exports = invCont