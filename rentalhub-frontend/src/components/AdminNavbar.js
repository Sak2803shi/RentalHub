function AdminNavbar() {
  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <span className="navbar-brand">Admin Panel</span>
      <button
        className="btn btn-danger"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </nav>
  );
}

export default AdminNavbar;
