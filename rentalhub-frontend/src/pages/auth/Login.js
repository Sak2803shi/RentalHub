import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        alert("Invalid email or password");
        return;
      }

      const data = await response.json();

      // Save JWT
      localStorage.setItem("token", data.token);

      // Decode JWT
      const decoded = jwtDecode(data.token);
      console.log("Decoded JWT:", decoded);

      const role = decoded.role;
      localStorage.setItem("role", role);

      alert("Login Successful!");

      // Redirect by role
      if (role === "ROLE_ADMIN") navigate("/admin");
      else if (role === "ROLE_CUSTOMER") navigate("/customer");
      else if (role === "ROLE_AGENT") navigate("/agent");
      else if (role === "ROLE_OWNER") navigate("/owner");
      else navigate("/login");

    } catch (error) {
      console.error("Login error:", error);
      alert("Server error");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card col-md-4 mx-auto shadow p-4">
        <h3 className="text-center mb-4">RentalHub Login</h3>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
