import { useState, useRef, useCallback } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #F0EEE8;
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    padding: 2rem 1.5rem;
    max-width: 960px;
    margin: 0 auto;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
  }

  .logo-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-icon {
    width: 40px;
    height: 40px;
    background: #0F6E56;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-title { font-size: 17px; font-weight: 500; color: #1A1916; }
  .logo-sub { font-size: 12px; color: #6B6960; margin-top: 1px; }

  .badge {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    padding: 4px 12px;
    border-radius: 20px;
    background: #E1F5EE;
    color: #0F6E56;
    letter-spacing: 0.03em;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    align-items: start;
  }

  @media (max-width: 640px) {
    .grid { grid-template-columns: 1fr; }
  }

  .card {
    background: #fff;
    border: 0.5px solid #E2E0D8;
    border-radius: 16px;
    padding: 1.25rem;
  }

  .section-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #9E9D96;
    margin-bottom: 12px;
  }

  .upload-zone {
    border: 1.5px dashed #C8C6BC;
    border-radius: 12px;
    padding: 2.5rem 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }

  .upload-zone:hover, .upload-zone.drag {
    border-color: #1D9E75;
    background: #E1F5EE;
  }

  .upload-zone.has-image {
    border-style: solid;
    border-color: #E2E0D8;
    padding: 0;
    height: 260px;
  }

  .upload-icon-wrap {
    width: 48px;
    height: 48px;
    margin: 0 auto 1rem;
    background: #F0EEE8;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0.5px solid #E2E0D8;
  }

  .upload-label { font-size: 14px; font-weight: 500; color: #1A1916; margin-bottom: 4px; }
  .upload-hint { font-size: 12px; color: #9E9D96; }

  .upload-btn {
    margin-top: 1rem;
    display: inline-block;
    font-size: 13px;
    font-weight: 500;
    padding: 8px 20px;
    background: #1A1916;
    color: #fff;
    border-radius: 8px;
    cursor: pointer;
    border: none;
    font-family: 'DM Sans', sans-serif;
  }

  .preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
    display: block;
  }

  .preview-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.45);
    opacity: 0;
    transition: 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
  }

  .upload-zone.has-image:hover .preview-overlay { opacity: 1; }

  .preview-overlay-btn {
    background: rgba(255,255,255,0.15);
    border: 0.5px solid rgba(255,255,255,0.4);
    color: #fff;
    font-size: 12px;
    padding: 7px 16px;
    border-radius: 7px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }

  .file-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 1rem;
  }

  .info-key { font-size: 11px; color: #6B6960; }
  .info-val { font-size: 13px; color: #1A1916; font-weight: 500; font-family: 'DM Mono', monospace; margin-top: 2px; }

  .analyze-btn {
    width: 100%;
    margin-top: 1rem;
    padding: 12px;
    background: #0F6E56;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.2s;
  }

  .analyze-btn:hover:not(:disabled) { background: #1D9E75; }
  .analyze-btn:disabled { background: #C8C6BC; cursor: not-allowed; color: #9E9D96; }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Result panel */
  .result-placeholder {
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #9E9D96;
    font-size: 13px;
    text-align: center;
  }

  .verdict-box {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
    border-radius: 10px;
    margin-bottom: 1rem;
    animation: fadeUp 0.4s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: none; }
  }

  .verdict-icon {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .verdict-label { font-size: 11px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 2px; }
  .verdict-title { font-size: 17px; font-weight: 500; }

  .conf-wrap { margin-bottom: 14px; }
  .conf-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
  .conf-label { font-size: 12px; color: #6B6960; }
  .conf-val { font-size: 13px; font-weight: 500; font-family: 'DM Mono', monospace; }
  .conf-track { height: 6px; background: #F0EEE8; border-radius: 3px; overflow: hidden; border: 0.5px solid #E2E0D8; }
  .conf-fill { height: 100%; border-radius: 3px; transition: width 1s cubic-bezier(0.4,0,0.2,1); }

  .error-box {
    padding: 12px;
    background: #FCEBEB;
    border-radius: 8px;
    border-left: 3px solid #E24B4A;
    font-size: 13px;
    color: #A32D2D;
  }

  .disclaimer {
    margin-top: 1rem;
    padding: 10px 12px;
    background: #FAEEDA;
    border-radius: 8px;
    border-left: 3px solid #EF9F27;
    font-size: 12px;
    color: #854F0B;
    line-height: 1.5;
  }

  .history-list { display: flex; flex-direction: column; gap: 8px; }
  .history-empty { font-size: 13px; color: #9E9D96; text-align: center; padding: 1.5rem 0; }

  .history-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: #F0EEE8;
    border-radius: 8px;
    border: 0.5px solid #E2E0D8;
  }

  .history-thumb {
    width: 36px;
    height: 36px;
    border-radius: 6px;
    background: #E2E0D8;
    flex-shrink: 0;
    overflow: hidden;
  }

  .history-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .history-name { font-size: 12px; font-weight: 500; color: #1A1916; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .history-meta { font-size: 11px; color: #9E9D96; margin-top: 1px; }
  .history-info { flex: 1; min-width: 0; }

  .history-status {
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 10px;
    flex-shrink: 0;
  }

  .stat-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .stat { background: #F0EEE8; border: 0.5px solid #E2E0D8; border-radius: 10px; padding: 12px; text-align: center; }
  .stat-num { font-size: 20px; font-weight: 500; font-family: 'DM Mono', monospace; color: #1A1916; }
  .stat-lbl { font-size: 11px; color: #6B6960; margin-top: 3px; }
`;

export default function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ total: 0, positive: 0, negative: 0 });
  const fileInputRef = useRef(null);

  const handleFile = (selected) => {
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  }, []);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);

      const isPneumonia = data.prediction === "PNEUMONIA";
      const conf = Math.round((data.confidence || 0) * 100);
      const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const name = file.name.length > 16 ? file.name.slice(0, 14) + "…" : file.name;

      setHistory((prev) => [{ name, timestamp, isPneumonia, conf, preview }, ...prev].slice(0, 4));
      setStats((prev) => ({
        total: prev.total + 1,
        positive: prev.positive + (isPneumonia ? 1 : 0),
        negative: prev.negative + (!isPneumonia ? 1 : 0),
      }));
    } catch (err) {
      console.error(err);
      setResult({ error: "Failed to connect to API. Make sure the server is running on port 8000." });
    }

    setLoading(false);
  };

  const isPneumonia = result?.prediction === "PNEUMONIA";
  const confidence = result ? Math.round((result.confidence || 0) * 100) : 0;
  const normalConf = 100 - confidence;

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* Header */}
        <div className="header">
          <div className="logo-row">
            <div className="logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2a5 5 0 0 1 5 5v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h1V7a5 5 0 0 1 5-5z" />
                <circle cx="12" cy="15" r="2" />
              </svg>
            </div>
            <div>
              <div className="logo-title">PneumoScan</div>
              <div className="logo-sub">AI-assisted chest X-ray analysis</div>
            </div>
          </div>
          <span className="badge">v1.0 · Local</span>
        </div>

        <div className="grid">
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Upload Card */}
            <div className="card">
              <div className="section-label">Upload X-ray</div>

              <div
                className={`upload-zone${preview ? " has-image" : ""}${dragging ? " drag" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => !preview && fileInputRef.current?.click()}
              >
                {!preview ? (
                  <>
                    <div className="upload-icon-wrap">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B6960" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <div className="upload-label">Drop chest X-ray here</div>
                    <div className="upload-hint">PNG, JPG, JPEG supported</div>
                    <button className="upload-btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                      Choose file
                    </button>
                  </>
                ) : (
                  <>
                    <img src={preview} alt="X-ray preview" className="preview-img" />
                    <div className="preview-overlay">
                      <button className="preview-overlay-btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                        Replace image
                      </button>
                    </div>
                  </>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files[0])}
              />

              {file && (
                <div className="file-info">
                  {[
                    ["Filename", file.name.length > 14 ? file.name.slice(0, 12) + "…" : file.name],
                    ["Size", (file.size / 1024).toFixed(0) + " KB"],
                    ["Format", file.type.split("/")[1]?.toUpperCase() || "IMG"],
                    ["Status", loading ? "Analyzing…" : result ? "Done" : "Ready"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div className="info-key">{k}</div>
                      <div className="info-val">{v}</div>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="analyze-btn"
                onClick={handleAnalyze}
                disabled={!file || loading}
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18M9 21V9" />
                    </svg>
                    Analyze X-ray
                  </>
                )}
              </button>
            </div>

            {/* Session Stats */}
            <div className="card">
              <div className="section-label">Session overview</div>
              <div className="stat-row">
                {[
                  [stats.total, "scans run"],
                  [stats.positive, "positive"],
                  [stats.negative, "negative"],
                ].map(([num, lbl]) => (
                  <div className="stat" key={lbl}>
                    <div className="stat-num">{num}</div>
                    <div className="stat-lbl">{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Results Card */}
            <div className="card">
              <div className="section-label">Analysis results</div>

              {!result && !loading && (
                <div className="result-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C8C6BC" strokeWidth="1.2" strokeLinecap="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                  <p>Upload an X-ray image<br />to begin analysis</p>
                </div>
              )}

              {loading && (
                <div className="result-placeholder">
                  <div className="spinner" style={{ borderColor: "rgba(15,110,86,0.2)", borderTopColor: "#0F6E56", width: 28, height: 28, borderWidth: 3 }} />
                  <p style={{ color: "#6B6960" }}>Running inference…</p>
                </div>
              )}

              {result?.error && (
                <div className="error-box">{result.error}</div>
              )}

              {result && !result.error && (
                <div style={{ animation: "fadeUp 0.4s ease both" }}>
                  {/* Verdict */}
                  <div
                    className="verdict-box"
                    style={{
                      background: isPneumonia ? "#FCEBEB" : "#E1F5EE",
                    }}
                  >
                    <div
                      className="verdict-icon"
                      style={{ background: isPneumonia ? "#F7C1C1" : "#9FE1CB" }}
                    >
                      {isPneumonia ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A32D2D" strokeWidth="2" strokeLinecap="round">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                          <line x1="12" y1="9" x2="12" y2="13" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div
                        className="verdict-label"
                        style={{ color: isPneumonia ? "#A32D2D" : "#0F6E56" }}
                      >
                        Prediction
                      </div>
                      <div
                        className="verdict-title"
                        style={{ color: isPneumonia ? "#A32D2D" : "#0F6E56" }}
                      >
                        {isPneumonia ? "Pneumonia detected" : "No pneumonia detected"}
                      </div>
                    </div>
                  </div>

                  {/* Confidence bars */}
                  <div className="conf-wrap">
                    <div className="conf-top">
                      <span className="conf-label">Pneumonia probability</span>
                      <span className="conf-val">{confidence}%</span>
                    </div>
                    <div className="conf-track">
                      <div
                        className="conf-fill"
                        style={{
                          width: `${confidence}%`,
                          background: isPneumonia ? "#E24B4A" : "#1D9E75",
                        }}
                      />
                    </div>
                  </div>

                  <div className="conf-wrap">
                    <div className="conf-top">
                      <span className="conf-label">Normal probability</span>
                      <span className="conf-val">{normalConf}%</span>
                    </div>
                    <div className="conf-track">
                      <div
                        className="conf-fill"
                        style={{ width: `${normalConf}%`, background: "#1D9E75" }}
                      />
                    </div>
                  </div>

                  <div className="disclaimer">
                    For clinical support only. This analysis does not replace professional radiological evaluation.
                  </div>
                </div>
              )}
            </div>

            {/* History Card */}
            <div className="card">
              <div className="section-label">Recent scans</div>
              <div className="history-list">
                {history.length === 0 ? (
                  <div className="history-empty">No scans yet</div>
                ) : (
                  history.map((h, i) => (
                    <div className="history-item" key={i}>
                      <div className="history-thumb">
                        {h.preview && <img src={h.preview} alt="thumb" />}
                      </div>
                      <div className="history-info">
                        <div className="history-name">{h.name}</div>
                        <div className="history-meta">{h.timestamp} · {h.conf}% conf.</div>
                      </div>
                      <span
                        className="history-status"
                        style={{
                          background: h.isPneumonia ? "#FCEBEB" : "#E1F5EE",
                          color: h.isPneumonia ? "#A32D2D" : "#0F6E56",
                        }}
                      >
                        {h.isPneumonia ? "Positive" : "Negative"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}