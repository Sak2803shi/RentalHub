import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="bg-dark text-white p-3 vh-100" style={{ width: "250px" }}>
      <h4>Admin Panel</h4>
      <ul className="nav flex-column">
        <li className="nav-item"><Link to="/admin/dashboard" className="nav-link text-white">Dashboard</Link></li>
        <li className="nav-item"><Link to="/admin/users" className="nav-link text-white">Users</Link></li>
        <li className="nav-item"><Link to="/admin/add-owner" className="nav-link text-white">Add Owner</Link></li>
        <li className="nav-item"><Link to="/admin/add-agent" className="nav-link text-white">Add Agent</Link></li>
        <li className="nav-item"><Link to="/admin/add-customer" className="nav-link text-white">Add Customer</Link></li>
      </ul>
    </div>
  );
}
