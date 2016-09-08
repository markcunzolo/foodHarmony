function sendComment() {
  var contactComment = {
    name: document.getElementById('contactName').value,
    email: document.getElementById('contactEmail').value,
    body: document.getElementById('contactMessage').value,
  };

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200){
      var modal = document.getElementById('sentMessageModal');
      var span = document.getElementsByClassName("close");
      modal.style.display = 'block';
      span.onclick = function() {
      modal.style.display = "none";
      };
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }; 
    clearContactForm();
    };
  };
  xhttp.open("POST", apiContactUs);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send(JSON.stringify(contactComment));
}

function clearContactForm() {
    document.getElementById('contactName').value = "";
    document.getElementById('contactEmail').value = "";
    document.getElementById('contactMessage').value = "";
}