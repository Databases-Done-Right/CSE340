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
    metaTitle: `${className} Vehicles - CSE 340`,
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

/* ***************************
 *  Build management form links
 * ************************** */
invCont.buildManagementLinks = async function (req, res, next) {
  const nav = await utilities.getNav()
  res.render("./inventory/management", {
    metaTitle: `Inventory Management - CSE 340`,
    title: "Inventory Management",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Build inventory management form
 * ************************************** */
invCont.buildManagementInventoryForm = async function (req, res, next) {
  const nav = await utilities.getNav()
  const classificationOptions = await utilities.getClassificationOptions()
  res.render("./inventory/add-inventory", {
    metaTitle: `Add Inventory Form - CSE 340`,
    title: "Add New Inventory",
    nav,
    classificationOptions,
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image-tn.png",
    errors: null,
  })
}

/* ****************************************
 *  Build classification management form
 * ************************************** */
invCont.buildManagementClassificationForm = async function (req, res, next) {
  const nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    metaTitle: `Add Classification Form - CSE 340`,
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Classification Addition
* *************************************** */
invCont.registerClassification = async function registerClassification(req, res) {
  const { classification_name } = req.body

  const regResult = await invModel.registerClassification(classification_name)

  if (regResult) {
    let nav = await utilities.getNav()
    req.flash(
      "notice",
      `Congratulations, you\'re registered a new classification!`
    )
    res.status(201).render("./inventory/add-classification", {
      metaTitle: `Add Classification Form - CSE 340`,
      title: "Add New Classification",
      nav,
      errors: null,
    })
  } else {
    let nav = await utilities.getNav()
    req.flash("notice", "Sorry, we were unable to add the new classificaiton to the site.")
    res.status(501).render("./inventory/add-classification", {
      metaTitle: `Add Classification Failed - CSE 340`,
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Process Inventory Addition
* *************************************** */
invCont.registerInventory = async function registerInventory(req, res) {
  let nav = await utilities.getNav()
  const classificationOptions = await utilities.getClassificationOptions()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const regResult = await invModel.registerInventory(
    inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered a new vehicle!`
    )
    res.status(201).render("./inventory/add-inventory", {
      metaTitle: `Add Inventory Form - CSE 340`,
      title: "Add New Inventory",
      nav,
      classificationOptions,
      inv_image: "/images/vehicles/no-image.png",
      inv_thumbnail: "/images/vehicles/no-image-tn.png",
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, we were unable to add the new vehicle to the site.")
    res.status(501).render("./inventory/add-inventory", {
      metaTitle: `Add Inventory Failed - CSE 340`,
      title: "Add New Inventory",
      nav,
      classificationOptions,
      inv_image: "/images/vehicles/no-image.png",
      inv_thumbnail: "/images/vehicles/no-image-tn.png",
      errors: null,
    })
  }
}

module.exports = invCont