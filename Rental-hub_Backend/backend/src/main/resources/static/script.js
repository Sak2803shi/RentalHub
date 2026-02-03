// ================= LOGIN FUNCTION =================
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("HTTP Status " + res.status);
        }
        return res.json();
    })
    .then(data => {
        console.log("LOGIN RESPONSE:", data); // 👈 important

        if (data.token) {
            localStorage.setItem("token", data.token);
            window.location.href = "dashboard.html";
        } else {
            document.getElementById("message").innerText = "Login Failed";
        }
    })
    .catch(err => {
        console.error("LOGIN ERROR:", err);
        document.getElementById("message").innerText = "Login Error: " + err.message;
    });
}


// ================= PAGE LOAD ROLE DISPLAY =================
window.onload = function () {
    const role = getRoleFromToken();
    const roleText = document.getElementById("roleText");

    if (roleText && role) {
        roleText.innerText = "Logged in as: " + role;
    }
}


// ================= GET ROLE FROM JWT =================
function getRoleFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        return payload.role;   // must match backend claim name
    } catch (e) {
        console.log("Invalid token");
        return null;
    }
}


// ================= GET PROTECTED DATA =================
function getData() {
    const token = localStorage.getItem("token");
    const role = getRoleFromToken();

    if (!token || !role) {
        alert("Please login again");
        window.location.href = "index.html";
        return;
    }

    let url = "";

    if (role === "ROLE_AGENT") url = "http://localhost:8080/api/agents";
    else if (role === "ROLE_CUSTOMER") url = "http://localhost:8080/api/customers";
    else if (role === "ROLE_OWNER") url = "http://localhost:8080/api/owners";
    else {
        alert("Unknown role!");
        return;
    }

    fetch(url, {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(res => {
        if (res.status === 401) {
            alert("Session expired. Login again.");
            localStorage.removeItem("token");
            window.location.href = "index.html";
        }
        return res.json();
    })
    .then(data => {
        document.getElementById("result").innerText =
            role + " DATA:\n" + JSON.stringify(data, null, 2);
    })
    .catch(err => console.log(err));
}


// ================= LOGOUT FUNCTION =================
function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}
