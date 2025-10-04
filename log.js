// log.js (New Code)

document.addEventListener('DOMContentLoaded', function() {
    
    // ----------- LOGIN HANDLER -----------
    const loginForm = document.getElementById('log');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('unamelog').value;
            const password = document.getElementById('passwordlog').value;

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // This tells your main page (index.html) that the login was successful
                    window.parent.postMessage('login-success', '*');
                })
                .catch((error) => {
                    alert('Login failed: ' + error.message);
                });
        });
    }

    // ----------- REGISTRATION HANDLER -----------
    const registerForm = document.querySelector("#register form");
    if(registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("reg_email").value;
            const password = document.getElementById("pass").value;

            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    alert("Registration successful! You can now log in.");
                    // Switch back to the login view
                    document.querySelector('.container').classList.remove('active');
                })
                .catch((error) => {
                    alert("Registration failed: " + error.message);
                });
        });
    }
});