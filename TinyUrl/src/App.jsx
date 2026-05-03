import React, { useEffect, useState } from "react";
import api from "./api";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [urls, setUrls] = useState([]);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(null);

  const loadUrls = async () => {
    const res = await api.get("/public");
    setUrls(res.data);
  };

  useEffect(() => {
    loadUrls();
  }, []);

  const createUrl = async () => {
    if (!url.trim()) return;
    await api.post("/shorten", { originalUrl: url, isPrivate });
    setUrl("");
    loadUrls();
  };

  const deleteUrl = async (id) => {
    await api.delete(`/${id}`);
    loadUrls();
  };

  const searchUrls = async (q) => {
    if (!q.trim()) { loadUrls(); return; }
    const res = await api.get(`/search?query=${q}`);
    setUrls(res.data);
  };

  const copyToClipboard = (code) => {
    const shortUrl = `http://localhost:7181/r/${code}`;
    navigator.clipboard.writeText(shortUrl);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="app-root">
      {/* Header / Create Section */}
      <div className="hero-section">
        <h1 className="app-title">Tiny URL</h1>

        <div className="input-row">
          <input
            className="url-input"
            placeholder="Enter URL to shorten"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createUrl()}
          />
          <label className="private-label">
            <input
              type="checkbox"
              className="private-checkbox"
              checked={isPrivate}
              onChange={() => setIsPrivate(!isPrivate)}
            />
            <span>IsPrivate</span>
          </label>
        </div>

        <button className="generate-btn" onClick={createUrl}>
          Generate
        </button>
      </div>

      {/* List Section */}
      <div className="list-section">
        <h2 className="list-title">Public URLs</h2>

        <input
          className="search-input"
          placeholder="Search URLs..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            searchUrls(e.target.value);
          }}
        />

        <div className="url-list">
          {urls.length === 0 && (
            <p className="empty-state">No URLs found.</p>
          )}
          {urls.map((u) => {
            const shortUrl = `http://localhost:7181/r/${u.shortCode}`;
            return (
              <div className="url-card" key={u.id}>
                <div className="url-card-body">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="short-link"
                  >
                    {shortUrl}
                  </a>

                  <div className="url-card-meta">
                    <button
                      className="copy-btn"
                      onClick={() => copyToClipboard(u.shortCode)}
                    >
                      {copied === u.shortCode ? "Copied!" : "Copy"}
                    </button>
                    <span className="clicks-badge">{u.clicks} clicks</span>
                  </div>

                  <p className="original-url">{u.originalUrl}</p>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => deleteUrl(u.id)}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
