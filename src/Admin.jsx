
import { useState, useEffect } from "react";
import "./Admin.css";
import { getProjects, saveProjects } from "./utils/projectStorage";

const ADMIN_PASSWORD = "KEERTHI";

const emptyForm = {
  name: "",
  category: "",
  description: "",
  technologies: "",
  github: "",
  demo: "",
};

export default function Admin() {
  // Authentication
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem("admin_authenticated") === "true"
  );

  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Project management
  const [projects, setProjects] = useState(() => getProjects());
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const refreshProjects = () => setProjects(getProjects());

    window.addEventListener("projects-updated", refreshProjects);

    return () =>
      window.removeEventListener("projects-updated", refreshProjects);
  }, []);

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authenticated", "true");
      setAuthenticated(true);
      setLoginError("");
      setPassword("");
    } else {
      setLoginError("Incorrect password. Please try again.");
    }
  };

  // Project handlers
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingIndex(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) return;

    const project = {
      ...form,
      technologies: form.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean),
    };

    const updated = [...projects];

    if (editingIndex !== null) {
      updated[editingIndex] = project;
    } else {
      updated.push(project);
    }

    saveProjects(updated);
    setProjects(updated);
    resetForm();
  };

  const handleEdit = (index) => {
    const project = projects[index];

    setForm({
      name: project.name || "",
      category: project.category || "",
      description: project.description || "",
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : project.technologies || "",
      github: project.github || "",
      demo: project.demo || "",
    });

    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    if (!window.confirm("Delete this project?")) return;

    const updated = projects.filter((_, i) => i !== index);

    saveProjects(updated);
    setProjects(updated);

    if (editingIndex === index) resetForm();
  };

  // PASSWORD SCREEN
  // This conditional return must remain INSIDE Admin().
  
if (!authenticated) {
  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <span className="admin-login-label">PORTFOLIO ADMIN</span>

        <h1>Admin Access</h1>

        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
          />

          {loginError && (
            <p className="admin-login-error">{loginError}</p>
          )}

          <button type="submit">Enter</button>
        </form>
      </div>
    </div>
  );
}


  // EXISTING ADMIN DASHBOARD
  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-mark">K</div>
          <div>
            <h2>KEERTHI K</h2>
            <span>PORTFOLIO ADMIN</span>
          </div>
        </div>

        <div className="admin-nav-label">WORKSPACE</div>

        <nav className="admin-navigation">
          <a href="#overview" className="active">
            <span>▦</span> Overview
          </a>

          <a href="#projects">
            <span>▣</span> Projects
          </a>

          <a href="#project-form" onClick={() => setShowForm(true)}>
            <span>＋</span> Add Project
          </a>
        </nav>

        <div className="admin-sidebar-bottom">
          <span className="admin-status-dot"></span>
          Portfolio management
          <a href="/">← Back to website</a>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">

        <header className="admin-topbar">
          <div>
            <span className="admin-breadcrumb">Workspace / Overview</span>
            <h1>Dashboard</h1>
          </div>

          <a href="/" className="admin-view-site">
            View Website ↗
          </a>
        </header>

        {/* OVERVIEW */}
        <section id="overview" className="admin-overview">
          <div className="admin-welcome">
            <div>
              <span className="admin-eyebrow">PORTFOLIO MANAGEMENT</span>
              <h2>Welcome back!</h2>
              <p>Manage your projects and keep your portfolio updated.</p>
            </div>
            <div className="admin-welcome-icon">✦</div>
          </div>

          <div className="admin-stats">
            <div className="admin-stat-card">
              <span>Total Projects</span>
              <strong>{projects.length}</strong>
              <small>Projects in your portfolio</small>
            </div>

            <div className="admin-stat-card">
              <span>Project Management</span>
              <strong>Active</strong>
              <small>Local browser storage</small>
            </div>

            <div className="admin-stat-card">
              <span>Available Actions</span>
              <strong>03</strong>
              <small>Add, edit and delete</small>
            </div>
          </div>
        </section>

        {/* PROJECT MANAGEMENT */}
        <section id="projects" className="admin-project-section">
          <div className="admin-section-heading">
            <div>
              <span className="admin-eyebrow">CONTENT MANAGEMENT</span>
              <h2>Your Projects</h2>
              <p>Manage the projects displayed on your portfolio.</p>
            </div>

            <button
              className="admin-primary-btn"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              + Add New Project
            </button>
          </div>

          <div className="admin-project-list">
            {projects.length === 0 ? (
              <div className="admin-empty">
                <span>▣</span>
                <h3>No projects yet</h3>
                <p>Add your first project to get started.</p>
                <button
                  className="admin-primary-btn"
                  onClick={() => setShowForm(true)}
                >
                  Add Project
                </button>
              </div>
            ) : (
              projects.map((project, index) => (
                <article className="admin-project-card" key={index}>
                  <div className="admin-project-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="admin-project-info">
                    <span className="admin-project-category">
                      {project.category || "GENERAL"}
                    </span>

                    <h3>{project.name}</h3>
                    <p>{project.description}</p>

                    <div className="admin-tech-list">
                      {(Array.isArray(project.technologies)
                        ? project.technologies
                        : []
                      ).map((tech, i) => (
                        <span key={i}>{tech}</span>
                      ))}
                    </div>
                  </div>

                  <div className="admin-project-actions">
                    <button
                      className="admin-edit-btn"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>

                    <button
                      className="admin-delete-btn"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        {/* ADD / EDIT FORM */}
        {showForm && (
          <section id="project-form" className="admin-form-section">
            <div className="admin-section-heading">
              <div>
                <span className="admin-eyebrow">PROJECT DETAILS</span>
                <h2>
                  {editingIndex !== null ? "Edit Project" : "Add New Project"}
                </h2>
                <p>Enter the information for your portfolio project.</p>
              </div>

              <button className="admin-close-btn" onClick={resetForm}>
                ✕
              </button>
            </div>

            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <label>
                  Project Name *
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter project name"
                    required
                  />
                </label>

                <label>
                  Category
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. WEB DEVELOPMENT"
                  />
                </label>

                <label className="admin-full-width">
                  Description
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your project..."
                    rows="4"
                  />
                </label>

                <label className="admin-full-width">
                  Technologies
                  <input
                    name="technologies"
                    value={form.technologies}
                    onChange={handleChange}
                    placeholder="React, Node.js, Supabase"
                  />
                  <small>Separate technologies using commas.</small>
                </label>

                <label>
                  GitHub URL
                  <input
                    name="github"
                    value={form.github}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                  />
                </label>

                <label>
                  Live Demo URL
                  <input
                    name="demo"
                    value={form.demo}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </label>
              </div>

              <div className="admin-form-footer">
                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>

                <button type="submit" className="admin-primary-btn">
                  {editingIndex !== null ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </section>
        )}

        <footer className="admin-footer">
          <span>KEERTHI K · PORTFOLIO ADMIN</span>
          <span>© 2026 All rights reserved.</span>
        </footer>
      </main>
    </div>
  );
}
