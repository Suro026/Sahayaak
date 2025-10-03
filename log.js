// Replace with your actual Xano API base URL
const XANO_BASE_URL = "https://x8abcd-1234.us-east-1.xano.io/api";


// ----------- LOGIN HANDLER -----------
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('log');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('unamelog').value;
        const password = document.getElementById('passwordlog').value;
        if (username === 'admin' && password === 'admin') {
            // Notify parent window (index.html) of successful login
            window.parent.postMessage('login-success', '*');
        } else {
            alert('Invalid credentials. Please use admin/admin.');
        }
    });
});

// ----------- REGISTRATION HANDLER -----------
document.querySelector("#register form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("reg_name").value;
    const phone = document.getElementById("reg_phone").value;
    const email = document.getElementById("reg_email").value;
    const username = document.getElementById("reg_uname").value;
    const password = document.getElementById("pass").value;

    try {
        const response = await fetch(`${XANO_BASE_URL}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone, email, username, password }),
        });
        const data = await response.json();

        if (response.ok) {
            // Save authToken to localStorage for later API calls
            localStorage.setItem("token", data.authToken);
            localStorage.setItem("user", JSON.stringify(data.user));

            alert("Registration successful!");
            window.location.href = "index.html";
        } else {
            alert("Registration failed: " + (data.message || "Check your details"));
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred during registration.");
    }
});
