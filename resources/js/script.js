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
    var checkboxContent = '<input class="checkbox typeCheckbox" id="' + restaurantType.id + '" type="checkbox" name="' + restaurantType.name + '" value="' + restaurantType.name + '">' + 
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
    var checkboxContent = '<input class="checkbox foodCheckbox" id="' + foodType.id + '" type="checkbox" name="' + foodType.name + '" value="' + foodType.name + '">' + 
    '<label class="checkboxLabel" for="' + foodType.id + '">' + foodType.name + '</label>';
    newCheckbox.innerHTML = checkboxContent;
    newRow.appendChild(newCheckbox);
  });
}

/*function logout() {
  $('#loginListItem').show();
  $('#logoutListItem').hide();
  localStorage.removeItem("usersName");
  localStorage.removeItem("usersId");
  window.location = "login.html?logout";
}*/





/*------------------------------ Calling main functions when page done loading ---------------------------------*/

$(document).ready(function(){ //when the document finishes loading, do these things
  
  getRestaurantTypes();

  getFoodTypes();

  if (localStorage.getItem('usersName')) {
    $('#usersName').html('Welcome ' + localStorage.getItem('usersName') + '!');
    $('#loginListItem').hide();
    $('#logoutListItem').show();
  } else {
    $('#loginListItem').show();
    $('#logoutListItem').hide();   
  }

  $('a[href*=#]').click(function() { //find any link that looks like <a href="#"> and add a click event to it
    //Check that the link is pointing to the same page and domain, strips the # and just looks at what comes after
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var $target = $(this.hash); //set target equal to the anchor part of the url
      $target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
      if ($target.length) {
        var targetOffset = $target.offset().top; //set the coordinates of the top of the element
        $('html,body').animate({ //get the html body and snimate a scroll to the targetOffset position in 1 second
          scrollTop: targetOffset}, 1000);
       return false;
      }
    }
  });

  $('#detailedSearchButton').click(function(){
    window.location = "results.html?type="+$('#restaurantTypeSearch').val()+"&food="+$('#foodTypeSearch').val()+"&cost="+$('#costLevelSearch').val();
  });

});











