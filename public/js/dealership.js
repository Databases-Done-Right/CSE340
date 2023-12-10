'use strict' 

// Build inventory items into HTML table components and inject into DOM 
function buildDealershipList(data) { 
    let inventoryDisplay = document.getElementById("dealershipDisplay"); 
    // Set up the table labels 
    let dataTable = '<thead>'; 
    dataTable += '<tr><th>Dealership Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
    dataTable += '</thead>'; 
    // Set up the table body 
    dataTable += '<tbody>'; 
    // Iterate over all dealerships in the array and put each in a row 
    data.forEach(function (element) { 
     dataTable += `<tr><td>${element.dealership_name}</td>`; 
     dataTable += `<td><a href='/dealership/edit/${element.dealership_id}' title='Click to update'>Modify</a></td>`; 
     dataTable += `<td><a href='/dealership/delete/${element.dealership_id}' title='Click to delete'>Delete</a></td></tr>`; 
    }) 
    dataTable += '</tbody>'; 
    // Display the contents in the Inventory Management view 
    inventoryDisplay.innerHTML = dataTable; 
}

let classIdURL = "/dealership/getDealerships/"
  fetch(classIdURL) 
  .then(function (response) { 
   if (response.ok) { 
    return response.json(); 
   } 
   throw Error("Network response was not OK"); 
  }) 
  .then(function (data) { 
   console.log(data); 
   buildDealershipList(data); 
  }) 
  .catch(function (error) { 
   console.log('There was a problem: ', error.message) 
  }) 