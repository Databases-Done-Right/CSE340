const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
}

/* ***************************
 *  Get all inventory items and dealership data by dealership_id
 * ************************** */
async function getInventoryByDealershipId(dealership_id) {
  try {
    const data = await pool.query(
      `SELECT i.*, d.dealership_name, d.dealership_address FROM public.inventory AS i 
      JOIN public.dealership AS d 
      ON i.dealership_id = d.dealership_id 
      WHERE i.dealership_id = $1`,
      [dealership_id]
    )
    return data.rows
  } catch (error) {
    console.error("getdealershipsbyid error " + error)
  }
}

/* ***************************
 *  Get all vehicle items by vehicle_id
 * ************************** */
async function getInventoryByVehicleId(vehicle_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      WHERE i.inv_id = $1`,
      [vehicle_id]
    )
    return data.rows
  } catch (error) {
    console.error("getvehiclebyid error " + error)
  }
}


/* *****************************
*   Register new classification
* *************************** */
async function registerClassification(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Register new inventory
* *************************** */
async function registerInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, dealership_id){
  try {
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, dealership_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, dealership_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Update inventory Data
* *************************** */
async function updateInventory(inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id, dealership_id){
  try {
    const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10, dealership_id = $12 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id, inv_id, dealership_id])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* *****************************
*   Delete inventory Data
* *************************** */
async function deleteInventory(inv_id){
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1';
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    console.error("Delete inventory error: " + error)
  }
}

module.exports = { getClassifications, getInventoryByClassificationId, getInventoryByDealershipId, getInventoryByVehicleId, registerClassification, registerInventory, getInventoryByVehicleId, updateInventory, deleteInventory }
