import ThemeToggle from "@/components/ThemeToggle";
import { projects } from "@/lib/projects";

export default function Home() {
  return (
    <main className="page">
      <div className="page-container">
        <header className="page-header">
          <div className="page-header-row">
            <div>
              <h1 className="hero-title animate-fade-up" style={{ animationDelay: "0ms" }}>Jem</h1>
              <p className="hero-tagline animate-fade-up" style={{ animationDelay: "100ms" }}>Building AI agent tooling</p>
            </div>
            <div className="header-actions animate-fade-in" style={{ animationDelay: "300ms" }}>
              <a href="https://github.com/ccakmak60" target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="GitHub">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <section>
          <h2 className="section-heading animate-fade-up" style={{ animationDelay: "200ms" }}>Projects</h2>
          <ul>
            {projects.map((p, i) => (
              <li key={p.name} className="animate-fade-up" style={{ animationDelay: `${250 + i * 30}ms` }}>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="project-list-item">
                  <span className="project-name">{p.name}</span>
                  <span className="project-type mono">{p.type}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <footer className="page-footer animate-fade-in" style={{ animationDelay: "1200ms" }}>
          <p className="footer-text">&copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </main>
  );
}
