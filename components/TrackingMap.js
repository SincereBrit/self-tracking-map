@import 'leaflet/dist/leaflet.css';

:root {
  --bg: #0f172a;
  --panel: rgba(15, 23, 42, 0.75);
  --panel-soft: rgba(30, 41, 59, 0.9);
  --card: rgba(15, 23, 42, 0.7);
  --border: rgba(148, 163, 184, 0.18);
  --text: #e2e8f0;
  --muted: #94a3b8;
  --primary: #38bdf8;
  --primary-strong: #0ea5e9;
  --success: #22c55e;
  --shadow: 0 20px 45px rgba(15, 23, 42, 0.4);
}

* {
  box-sizing: border-box;
}

html {
  background: radial-gradient(circle at top, #0f172a 0%, #020817 55%, #020617 100%);
  color: var(--text);
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: Arial, Helvetica, sans-serif;
  background: transparent;
}

button {
  font: inherit;
}

.page-shell {
  min-height: 100vh;
  padding: 32px 24px 64px;
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.7), rgba(2, 6, 23, 0.92)),
    radial-gradient(circle at top, rgba(56, 189, 248, 0.16), transparent 35%);
}

.page-container {
  max-width: 1180px;
  margin: 0 auto;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.eyebrow {
  display: inline-block;
  margin-bottom: 6px;
  color: var(--primary);
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: clamp(2.2rem, 5vw, 3.2rem);
  line-height: 1.1;
}

.status-pill {
  border: 1px solid var(--border);
  background: rgba(15, 23, 42, 0.7);
  color: var(--text);
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.status-pill.live {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.5);
  color: #bbf7d0;
}

.hero-panel,
.map-panel,
.sessions-panel {
  border: 1px solid var(--border);
  border-radius: 24px;
  background: rgba(15, 23, 42, 0.7);
  box-shadow: var(--shadow);
}

.hero-panel {
  display: grid;
  grid-template-columns: 1.2fr 1.8fr;
  gap: 24px;
  align-items: center;
  padding: 24px;
  margin-bottom: 20px;
}

.status-text {
  margin: 0 0 18px;
  font-size: 1.05rem;
  color: var(--muted);
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

button {
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
}

button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

.primary-button {
  background: linear-gradient(135deg, var(--primary), var(--primary-strong));
  color: #082f49;
  font-weight: 700;
}

.secondary-button {
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.3);
  color: var(--text);
}

.ghost-button {
  background: rgba(148, 163, 184, 0.08);
  border: 1px solid var(--border);
  color: var(--text);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.stat-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-card span {
  color: var(--muted);
  font-size: 0.82rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.stat-card strong {
  font-size: clamp(1.2rem, 2.5vw, 1.7rem);
}

.map-panel {
  overflow: hidden;
  padding: 12px;
  margin-bottom: 20px;
}

.map-container {
  position: relative;
  min-height: 480px;
  width: 100%;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.15);
}

.map-container .leaflet-container {
  height: 100%;
  width: 100%;
  min-height: 480px;
  background: #0b1120;
}

.map-loading {
  display: grid;
  place-items: center;
  min-height: 480px;
  background: rgba(15, 23, 42, 0.7);
  color: var(--muted);
  border-radius: 18px;
}

.sessions-panel {
  padding: 24px;
}

.section-header {
  margin-bottom: 18px;
}

.section-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.empty-state {
  color: var(--muted);
  border: 1px dashed var(--border);
  border-radius: 18px;
  padding: 30px 20px;
  text-align: center;
}

.session-list {
  display: grid;
  gap: 14px;
}

.session-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-radius: 18px;
  padding: 16px 18px;
}

.session-date {
  margin: 0 0 8px;
  color: var(--muted);
  font-size: 0.82rem;
}

.session-card h3 {
  margin: 0;
  font-size: 1.1rem;
}

.session-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: right;
  color: var(--muted);
}

@media (max-width: 768px) {
  .hero-panel {
    grid-template-columns: 1fr;
  }

  .session-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .session-meta {
    text-align: left;
  }
}
