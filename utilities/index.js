const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const dealershipModel = require("../models/dealership-model")

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
* Build the dealership view HTML
* ************************************ */
Util.buildDealershipGrid = async function(data){
  let grid = '';
  if(data.length > 0){
    data.forEach(dealer => { 
      grid +='<div>';
        grid += `<a href="../../inv/dealership/${dealer.dealership_id}" title="${dealer.dealership_name} ${dealer.dealership_address} - Used Cars">`;
          grid += `${dealer.dealership_name} (${dealer.dealership_address})`;
        grid += '</a>';
      grid += '</div>';
    })
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
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
  let tbr = `<option value="" label="No option selected"></option>`;
  data.rows.forEach((row) => {
    tbr += `<option value="${row.classification_id}"${row.classification_id == req ? " selected" : "" }>${row.classification_name}</option>`;
  })
  return tbr
}

/* ************************
 * Constructs the dealership options HTML for forms
 ************************** */
Util.getDealershipOptions = async function (req, res, next) {
  let data = await dealershipModel.getAllDealerships()
  let tbr = `<option value="" label="No option selected"></option>`;
  data.rows.forEach((row) => {
    tbr += `<option value="${row.dealership_id}"${row.dealership_id == req ? " selected" : "" }>${row.dealership_name}</option>`;
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

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check Authorized User
 * ************************************ */
Util.checkAuthorizedUser = (req, res, next) => {
  if(res?.locals?.accountData?.account_type == "Admin" || res?.locals?.accountData?.account_type == "Employee") {
    next()
  } else {
    req.flash("notice", "Please login to continue.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check Is Admin
 * ************************************ */
Util.checkIsAdmin = (req, res, next) => {
  if(res?.locals?.accountData?.account_type == "Admin") {
    next()
  } else {
    req.flash("notice", "You must be an administrator to access this page.")
    return res.redirect("/account/login")
  }
}

module.exports = Util