const STORAGE_KEY = "keerthi_portfolio_projects";

export const defaultProjects = [
  {
    number: "01",
    name: "Host OF",
    category: "FILE SHARING",
    description:
      "A full-stack application for uploading and sharing files conveniently.",
    technologies: ["MERN", "Supabase"],
    github: "",
    demo: "https://host-of.vercel.app",
  },
  {
    number: "02",
    name: "bit data",
    category: "CLOUD STORAGE",
    description:
      "A cloud file manager for storing, organizing, and finding important documents.",
    technologies: ["React", "Express", "Node.js", "Supabase"],
    github: "",
    demo: "",
  },
];

export function getProjects() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultProjects;
  } catch {
    return defaultProjects;
  }
}

export function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

  window.dispatchEvent(new Event("projects-updated"));
}