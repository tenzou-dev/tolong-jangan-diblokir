import React from "react";

interface WhatsAppHeaderProps {
  contactName: string;
  status: "online" | "typing" | "offline";
  onBack: () => void;
}

export const WhatsAppHeader: React.FC<WhatsAppHeaderProps> = ({
  contactName,
  status,
  onBack,
}) => {
  const statusText =
    status === "typing" ? "mengetik..." : status === "online" ? "online" : "offline";
  const statusClass = status === "typing" ? "typing" : "";

  return (
    <header className="whatsapp-header">
      <div className="header-left">
        <button className="back-arrow" onClick={onBack} aria-label="Kembali">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <div className="profile-pic profile-placeholder">N</div>
        <div className="header-info">
          <span className="contact-name">{contactName}</span>
          <span className={`contact-status ${statusClass}`}>{statusText}</span>
        </div>
      </div>
      <div className="header-right">
        <button className="icon-button" aria-label="Video Call">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 7.48V15.5a2 2 0 0 1-2 2H7.5a2 2 0 0 1-2-2v-8A2 2 0 0 1 5.5 3h8a2 2 0 0 1 2 2z" />
          </svg>
        </button>
        <button className="icon-button" aria-label="Voice Call">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </button>
        <button className="menu-button" aria-label="More options">
          <span className="menu-dot" />
          <span className="menu-dot" />
          <span className="menu-dot" />
        </button>
      </div>
    </header>
  );
};