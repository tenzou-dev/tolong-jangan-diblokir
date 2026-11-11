import React, { useState } from "react";

interface GameMenuProps {
  onStart: (playerData: { name: string; gender: string }) => void;
}

export const GameMenu: React.FC<GameMenuProps> = ({ onStart }) => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("laki-laki");
  const [error, setError] = useState("");

  const handleStart = () => {
    if (!name.trim()) {
      setError("Masukkan nama kamu dulu sebelum bermain.");
      return;
    }
    setError("");
    onStart({ name, gender });
  };

  return (
    <div className="game-menu">
      <div className="menu-content">
        <div className="menu-header">
          <div className="game-logo">👻</div>
          <h1 className="game-title">Tolong,<br/>Jangan Diblokir</h1>
          <p className="game-subtitle">Suatu malam, ponsel kamu berisik…</p>
        </div>

        <div className="menu-form">
          <div className="form-group">
            <label className="form-label">Masukkan nama kamu:</label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: Budi / Siti"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Kamu laki-laki atau perempuan?</label>
            <div className="gender-select">
              <button
                className={`gender-btn ${gender === "laki-laki" ? "active" : ""}`}
                onClick={() => setGender("laki-laki")}
              >
                👦 Laki-laki
              </button>
              <button
                className={`gender-btn ${gender === "perempuan" ? "active" : ""}`}
                onClick={() => setGender("perempuan")}
              >
                👧 Perempuan
              </button>
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}

          <button className="btn-start" onClick={handleStart}>
            MULAI BERMAIN
          </button>
        </div>

        <div className="menu-footer">
          <div className="menu-links">
            <button className="btn-link" onClick={() => alert("Pengaturan akan segera hadir")}>⚙️ Pengaturan</button>
            <button className="btn-link" onClick={() => alert("Tentang game ini akan segera hadir")}>ℹ️ Tentang</button>
            <button className="btn-link" onClick={() => alert("Kamu telah keluar dari game")}>🚪 Keluar</button>
          </div>
        </div>
      </div>
    </div>
  );
};
