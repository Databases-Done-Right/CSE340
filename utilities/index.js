const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>Our Price: $' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

 /* ************************
 * Constructs the classification options HTML for forms
 ************************** */
Util.getClassificationOptions = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let tbr = `<option value=""></option>`;
  data.rows.forEach((row) => {
    tbr += `<option value="${row.classification_id}"${row.classification_id == req ? " selected" : "" }>${row.classification_name}</option>`;
  })
  return tbr
}

/* **************************************
* Build the vehicle view HTML
* ************************************ */
Util.buildVehicleView = async function(data){
  const {
    inv_image: image,
    inv_price: price,
    inv_miles: mileage,
    inv_description: description,
    inv_year: year,
    inv_make: make,
    inv_model: model,
  } = data[0];
  let tbr
  if(data.length > 0){
    tbr = `<div id="vehicleContainer">
            <div class="vehicleImageContainer"><img src="${image}" alt="${year} ${make} ${model}"></div>
            <div class="vehicleDataContainer">
              <div class="vehiclePrice"><span>Price</span> $${new Intl.NumberFormat('en-US').format(price)}</div>
              <div class="vehicleMilage"><span>Mileage</span> ${new Intl.NumberFormat('en-US').format(mileage)}</div>
              <div class="vehicleDescription">${description}</div>
            </div>
          </div>`
  } else { 
    tbr += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return tbr
}

/* ***********************************************************
 * Middleware for Handling Errors
 * Wrap other function in this for
 * General Error Handling
 ************************************************************* */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util