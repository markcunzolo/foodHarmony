function getRestaurantTypes() { //gets all restaurant types from api and passes to dropdowns & checkboxes 
  $.ajax({
    url: apiRestaurantTypes,
    type: 'GET',
    success: function(result) {
      updateRestaurantTypesDropdown(result);
      updateRestaurantTypesCheckbox(result);
    }
  });
}

function getFoodTypes() { //gets all food types from api and passes to dropdowns & checkboxes 
  $.ajax({
    url: apiFoodTypes,
    type: 'GET',
    success: function(result) {
      updateFoodTypesDropdown(result);
      updateFoodTypesCheckbox(result);
    }
  });
}

function updateRestaurantTypesDropdown(restaurantTypes) { //creates new option for every array index in result & appends it to select
  if (typeof restaurantTypes === 'string') {
    restaurantTypes = JSON.parse(restaurantTypes);
  }
  var restaurantTypeSearch = $('#restaurantTypeSearch')[0]; //gets the rest type selector
  restaurantTypes.forEach(function(restaurantType) {
    var newOpt = document.createElement('option');
    newOpt.value = restaurantType.name;
    newOpt.id = restaurantType.id; //added id to help automatic name selection
    newOpt.innerHTML = restaurantType.name;
    restaurantTypeSearch.appendChild(newOpt);
  });
}

function updateFoodTypesDropdown(foodTypes) { //creates new option for every array index in result & appends it to select
  if (typeof foodTypes === 'string') {
    foodTypes = JSON.parse(foodTypes);
  }
  var foodTypeSearch = $('#foodTypeSearch')[0]; //gets the food type selector
  foodTypes.forEach(function(foodType) {
    var newOpt = document.createElement('option');
    newOpt.value = foodType.name;
    newOpt.id = foodType.id; //added id to help automatic name selection
    newOpt.innerHTML = foodType.name;
    foodTypeSearch.appendChild(newOpt);
  });
}

function updateRestaurantTypesCheckbox(restaurantTypes) { //creates new checkbox for every array index in result & appends it
  if (typeof restaurantTypes === 'string') {
    restaurantTypes = JSON.parse(restaurantTypes);
  }
  var restaurantTypeContainer = $('#restaurantTypeContainer')[0]; //gets the rest type container
  var newRow;
  restaurantTypes.forEach(function(restaurantType, index) {
    if (index === 0 || index%4 === 0) {
      newRow = document.createElement('div');
      newRow.classList.add('row', 'checkboxContainer');
      restaurantTypeContainer.appendChild(newRow);
    }
    var newCheckbox = document.createElement('div'); 
    newCheckbox.classList.add('col', 'span-1-of-4');
    var checkboxContent = '<input class="checkbox" id="' + restaurantType.id + '" type="checkbox" name="' + restaurantType.name + '" value="' + restaurantType.name + '">' + 
    '<label class="checkboxLabel" for="' + restaurantType.id + '">' + restaurantType.name + '</label>';
    newCheckbox.innerHTML = checkboxContent;
    newRow.appendChild(newCheckbox);
  });
}

function updateFoodTypesCheckbox(foodTypes) { //creates new checkbox for every array index in result & appends it
  if (typeof foodTypes === 'string') {
    foodTypes = JSON.parse(foodTypes);
  }
  var foodTypeContainer = $('#foodTypeContainer')[0]; //gets the rest type container
  var newRow;
  foodTypes.forEach(function(foodType, index) {
    if (index === 0 || index%4 === 0) {
      newRow = document.createElement('div');
      newRow.classList.add('row', 'checkboxContainer');
      foodTypeContainer.appendChild(newRow);
    }
    var newCheckbox = document.createElement('div'); 
    newCheckbox.classList.add('col', 'span-1-of-4');
    var checkboxContent = '<input class="checkbox" id="' + foodType.id + '" type="checkbox" name="' + foodType.name + '" value="' + foodType.name + '">' + 
    '<label class="checkboxLabel" for="' + foodType.id + '">' + foodType.name + '</label>';
    newCheckbox.innerHTML = checkboxContent;
    newRow.appendChild(newCheckbox);
  });
}


















/*------------------------------ Calling main functions when page done loading ---------------------------------*/

$(document).ready(function(){ //when the document finishes loading, do these things
  
  getRestaurantTypes();
  getFoodTypes();

});











