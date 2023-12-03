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
invCont.buildManagementView = async function (req, res, next) {
  const nav = await utilities.getNav()
  const classificationSelect = await utilities.getClassificationOptions()
  res.render("./inventory/management", {
    metaTitle: `Inventory Management - CSE 340`,
    title: "Inventory Management",
    nav,
    classificationSelect,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ****************************************
 *  Build inventory edit form
 * ************************************** */
invCont.buildInventoryEditView = async function (req, res, next) {
  const inventory_id = parseInt(req.params.vehicleId)
  const nav = await utilities.getNav()
  const inventoryData = await invModel.getInventoryByVehicleId(inventory_id)
  const inventoryInfo = inventoryData[0];
  const classificationOptions = await utilities.getClassificationOptions(inventoryInfo.classification_id)
  res.render("./inventory/edit-inventory", {
    metaTitle: "Edit Inventory - " + inventoryInfo.inv_make + " " + inventoryInfo.inv_model + " - CSE 340",
    title: "Edit Inventory - " + inventoryInfo.inv_make + " " + inventoryInfo.inv_model,
    nav,
    classificationOptions,
    inv_id: inventoryInfo.inv_id,
    inv_make: inventoryInfo.inv_make,
    inv_model: inventoryInfo.inv_model,
    inv_year: inventoryInfo.inv_year,
    inv_description: inventoryInfo.inv_description,
    inv_image: inventoryInfo.inv_image,
    inv_thumbnail: inventoryInfo.inv_thumbnail,
    inv_price: inventoryInfo.inv_price,
    inv_miles: inventoryInfo.inv_miles,
    inv_color: inventoryInfo.inv_color,
    classificationId: inventoryInfo.classification_id,
    errors: null,
  })
}

/* ****************************************
*  Update Inventory Data
* *************************************** */
invCont.updateInventory = async function updateInventory(req, res) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
      metaTitle: `Edit ${itemName} Failed - CSE 340`,
      title: `Edit ${itemName}`,
      nav,
      classificationOptions,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      errors: null,
    })
  }
}

/* ****************************************
 *  Build inventory delete form
 * ************************************** */
invCont.buildInventoryDeleteView = async function (req, res, next) {
  const inventory_id = parseInt(req.params.vehicleId)
  const nav = await utilities.getNav()
  const inventoryData = await invModel.getInventoryByVehicleId(inventory_id)
  const inventoryInfo = inventoryData[0];
  const itemName = `${inventoryInfo.inv_make} ${inventoryInfo.inv_model}`
  const classificationOptions = await utilities.getClassificationOptions(inventoryInfo.classification_id)
  res.render("./inventory/delete-inventory", {
    metaTitle: "Delete Inventory - " + itemName + " - CSE 340",
    title: "Delete Inventory - " + itemName,
    nav,
    classificationOptions,
    inv_id: inventoryInfo.inv_id,
    inv_make: inventoryInfo.inv_make,
    inv_model: inventoryInfo.inv_model,
    inv_year: inventoryInfo.inv_year,
    inv_description: inventoryInfo.inv_description,
    inv_image: inventoryInfo.inv_image,
    inv_thumbnail: inventoryInfo.inv_thumbnail,
    inv_price: inventoryInfo.inv_price,
    inv_miles: inventoryInfo.inv_miles,
    inv_color: inventoryInfo.inv_color,
    classificationId: inventoryInfo.classification_id,
    errors: null,
  })
}

/* ****************************************
*  Delete Inventory Data
* *************************************** */
invCont.deleteInventory = async function deleteInventory(req, res) {
  let nav = await utilities.getNav()
  const {
    inv_id,
  } = req.body
  const theVehicle = await invModel.getInventoryByVehicleId(parseInt(inv_id))
  const deleteResult = await invModel.deleteInventory(
    parseInt(inv_id),
  )

  const itemName = `${theVehicle[0].inv_make} ${theVehicle[0].inv_model}`
  if (deleteResult) {
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-inventory", {
      metaTitle: `Delete ${itemName} Failed - CSE 340`,
      title: `Delete ${itemName}`,
      nav,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      errors: null,
    })
  }
}

module.exports = invCont