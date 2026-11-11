import React from "react";

interface ChatEndingProps {
  ending: "survived" | "missing" | "possessed";
  onNextChapter: () => void;
  onRestart: () => void;
}

export const ChatEnding: React.FC<ChatEndingProps> = ({ ending, onNextChapter, onRestart }) => {
  const endingData: Record<string, { title: string; desc: string; btnNext: string; color: string }> = {
    survived: {
      title: "Nindi Selamat",
      desc: "Nindi berhasil keluar dari gedung kampus. Dia akan menghubungi kamu keesokan harinya melalui nomor baru.",
      btnNext: "Lanjut ke Chapter 2",
      color: "#25d366",
    },
    missing: {
      title: "Nindi Hilang",
      desc: "Nindi tiba-tiba menghilang dari kontak kamu. HP-nya masih aktif, tapi yang merespons bukan Nindi lagi.",
      btnNext: "Lanjut ke Chapter 2",
      color: "#ffa500",
    },
    possessed: {
      title: "Nindi Dikendalikan",
      desc: "Entitas telah menguasai Nindi sepenuhnya. Pesan-pesan yang datang sekarang bukan dari manusia lagi.",
      btnNext: "Lanjut ke Chapter 2",
      color: "#ff0000",
    },
  };

  const data = endingData[ending];
  const btnStyle: React.CSSProperties = { backgroundColor: data.color as string, color: "#000" };

  return (
    <div className="game-menu">
      <div className="menu-content">
        <div className="menu-header">
          <div className="game-logo" style={{ fontSize: "72px" }}>💀</div>
          <h1 className="game-title" style={{ color: data.color as string }}>{data.title}</h1>
          <p className="game-subtitle">{data.desc}</p>
        </div>

        <div className="menu-form" style={{ gap: 16 }}>
          <button className="btn-start" onClick={onNextChapter} style={btnStyle}>
            {data.btnNext}
          </button>
          <button className="btn-link" onClick={onRestart}>Mulai Ulang Chapter 1</button>
        </div>

        <div className="menu-footer">
          <div className="menu-links">
            <button className="btn-link" onClick={() => alert("Pengaturan akan segera hadir")}>⚙️ Pengaturan</button>
          </div>
        </div>
      </div>
    </div>
  );
};
