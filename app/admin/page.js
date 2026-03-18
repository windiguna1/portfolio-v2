export default function AdminDashboard() {
  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Welcome Back, Admin</h1>
        <p>Manage your portfolio content from here.</p>
      </header>
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Profile Overview</h3>
          <p>Update your bio, name, and resume link.</p>
        </div>
        <div className="dashboard-card">
          <h3>Work Experience</h3>
          <p>Add and manage your career history.</p>
        </div>
        <div className="dashboard-card">
          <h3>Projects</h3>
          <p>Upload new portfolio items and images.</p>
        </div>
      </div>
    </div>
  );
}
