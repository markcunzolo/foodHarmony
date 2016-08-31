$.auth.configure({
  apiUrl: 'http://localhost:3000'
});

function login() {
    $.auth.emailSignIn({
        password: $('#loginPassword')[0].value,
        email: $('#loginUsername')[0].value
    });
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
  window.location = 'index.html';
});