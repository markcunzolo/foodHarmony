(function(){
  var queryString = window.location.href; // Get the current URL
  queryString = queryString.split('?')[1]; // Get all characters after the ? in the URL
  $.auth.configure({
    apiUrl: apiEndpointBase
  });
  if(queryString === "logout"){
    logout();
  }
  
  $("input#loginUsername").focus();
})();

function login() {
    $.auth.emailSignIn({
        password: $('#loginPassword')[0].value,
        email: $('#loginUsername')[0].value
    });
}

function logout(){
  $.auth.signOut();
  localStorage.removeItem("usersName");
  localStorage.removeItem("usersId");
  window.location = 'login.html';
}


function register() {
    var formData = {
        name: $('#name')[0].value,
        password: $('#registerPassword')[0].value,
        passwordConfirmation: $('#registerPasswordConfirmation')[0].value,
        email: $('#registerUsername')[0].value
    };
    $.auth.emailSignUp(formData);
}


PubSub.subscribe('auth.validation.success', function(ev, user) {
  localStorage.setItem('usersName', user.name);
  localStorage.setItem('usersId', user.id);
  window.location = 'index.html';
});

PubSub.subscribe('auth.emailRegistration.success', function(ev, msg) {
  confirmEmailModal();
  //alert('Thanks ' + msg.name + '. Check your email to confirm.');
});

function confirmEmailModal() {
  var modal = document.getElementById('addRestaurantModal');
  var span = document.getElementsByClassName("close")[0];
  modal.style.display = 'block';
  span.onclick = function() {
      modal.style.display = "none";
      clearRegistration();
  };
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
          clearRegistration();
      }
  };
}

function clearRegistration() {
  $('#name')[0].value = '';
  $('#registerPassword')[0].value = '';
  $('#registerPasswordConfirmation')[0].value = '';
  $('#registerUsername')[0].value = '';
}

function emailPassword() {
var modal = document.getElementById('emailPass');
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

function forgotPassword() {
    var formData = {
        email: $('#passwordReset')[0].value,
    }
    $.auth.requestPasswordReset(formData);
}
PubSub.subscribe('auth.passwordResetRequest.success', function(ev, msg) {
  alert('Check your email!');
});
PubSub.subscribe('auth.emailConfirmation.success', function(ev, msg) {
  alert('Welcome' + $.auth.user.name + '! Change your password!');
});
