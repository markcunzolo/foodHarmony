/*--------------------------------------------------------------------------------------------------------
Add Restaurant AJAX Post
--------------------------------------------------------------------------------------------------------*/

function postRestaurant() {



  var checkedGenres = [];
  var genres = $('.foodCheckbox');
  for (i=0; i<genres.length; i++) {
    if (genres[i].checked) {
      checkedGenres.push(parseInt(genres[i].id));
    }
  };




  var checkedTypes = [];
  var types = $('.typeCheckbox');
  for (i=0; i<types.length; i++) {
    if (types[i].checked) {
      checkedTypes.push(parseInt(types[i].id));
    }
  };




  var costRad = document.querySelector('input[name="costLevel"]:checked').value;
  /*costCbs.forEach(function(cb) {
    if(cb.checked){
      costCbs = cb.value
    }
  });*/

  var comment = {
    "restaurant" : {
        "name": document.getElementById('restName').value,
        "cost": costRad,
        "streetAddress": document.getElementById('streetAddress').value,
        "zipCode": document.getElementById('zipcode').value,
        "webSite": document.getElementById('website').value,
        "phoneNumber": document.getElementById('phoneNumber').value,
        "types": checkedTypes,
        "genres": checkedGenres,
    }
  }
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200){
      addRestaurant();
    };
  };
xhttp.open("POST", 'https://food-harmony.herokuapp.com/restaurants');
xhttp.setRequestHeader('Content-Type', 'application/json');
xhttp.send(JSON.stringify(comment));
}

function addRestaurant() {
var modal = document.getElementById('addRestaurantModal');
var span = document.getElementsByClassName("close")[0];
modal.style.display = 'block';
span.onclick = function() {
    modal.style.display = "none";
};
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};
}