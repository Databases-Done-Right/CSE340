// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by dealvership view
router.get("/dealership/:dealershipId", utilities.handleErrors(invController.buildByDealershipId));

// Route to build vehicle by vehicle view
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildByVehicleId));

// Route to inventory management links view
router.get("/", utilities.checkAuthorizedUser, utilities.handleErrors(invController.buildManagementView));

// Route to edit an inventory item
router.get("/edit/:vehicleId", utilities.checkAuthorizedUser, utilities.handleErrors(invController.buildInventoryEditView))

// Route to update an inventory item
router.post("/update/", utilities.checkAuthorizedUser, invValidate.inventoryUpdateRules(), invValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory))

// Route to delete an inventory item
router.get("/delete/:vehicleId", utilities.checkAuthorizedUser, utilities.handleErrors(invController.buildInventoryDeleteView))

// Route to perform the inventory item delete
router.post("/delete/", utilities.checkAuthorizedUser, utilities.handleErrors(invController.deleteInventory))

// Route to inventory classification management form view
router.get("/management/classification/", utilities.checkAuthorizedUser, utilities.handleErrors(invController.buildManagementClassificationForm));

// Route to retrieve classifications via ajax
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to register new classification
router.post("/management/classification/", utilities.checkAuthorizedUser, invValidate.classificationRules(), invValidate.checkClassificationData, utilities.handleErrors(invController.registerClassification));

// Route to inventory management form view
router.get("/management/inventory/", utilities.checkAuthorizedUser, utilities.handleErrors(invController.buildManagementInventoryForm));

// Route to register new inventory
router.post( "/management/inventory/", utilities.checkAuthorizedUser, invValidate.inventoryRules(), invValidate.checkInventoryData, utilities.handleErrors(invController.registerInventory));

module.exports = router;