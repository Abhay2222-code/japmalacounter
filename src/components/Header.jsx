import React, { useEffect, useState } from "react";
import deities from "../data/deities.js";
import MalaRing from "./MalaRing";

const Header = () => {
  const [count, setCount] = useState(0);
  const [mala, setMala] = useState(0);
  const [message, setMessage] = useState(" जप प्रारंभ करने के लिए अपने आराध्य देव का चयन करें।");
  const [theme, setTheme] = useState("light");
  const [selectedDeity, setSelectedDeity] = useState(null);
  const [ringActive, setRingActive] = useState(false);

  const progress = Math.min((count / 108) * 100, 100);

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const savedCount = localStorage.getItem("count");
    const savedMala = localStorage.getItem("mala");

    if (savedCount !== null) {
      setCount(Number(savedCount));
    }

    if (savedMala !== null) {
      setMala(Number(savedMala));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("count", count);
    localStorage.setItem("mala", mala);
  }, [count, mala]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleDeitySelect = (deity) => {
    setSelectedDeity(deity);
    setMessage(` ${deity.mantra} — जप के लिए तैयार है`);
  };

  const handleIncrement = () => {
  if (!selectedDeity) {
    alert("🙏 पहले अपने आराध्य देव का चयन करें।");
    return;
  }

  const mantra = selectedDeity.mantra;

    if (count === 108) {
      setCount(0);
      setMala((prev) => prev + 1);
      setMessage(`🙏 Mala complete.`);

      setRingActive(true);

      setTimeout(() => {
       setRingActive(false);
      }, 5000);

      const audio = new Audio(selectedDeity.sound);
      audio.play();

      if ("vibrate" in navigator) {
        navigator.vibrate([300, 100, 300]);
      }
    } else {
      setCount((prev) => prev + 1);
      setMessage("🪔 भक्तिभाव से जप करें...");
    }
  };

  const handleReset = () => {
    const confirmReset = window.confirm("Kya aap sach mein count aur mala ko 0 karna chahte hain?");

    if (confirmReset) {
      setCount(0);
      setMala(0);
      setSelectedDeity(null);
      setMessage("🌼शांति और एकाग्रता के साथ मंत्र-जाप शुरू करें।.");
    }
  };

  return (
    <div className="app-shell">
      {ringActive && < MalaRing/>}
      <div className="spiritual-card">
        <div className="card-top">
          <div>
             <img className="logo"
             src="/images/logo.png" alt="Logo"></img>
             
            <p className="eyebrow">JapaMala</p>
            <h1>{selectedDeity ? selectedDeity.mantra : "🙏 अपने इष्ट देवता को चुनें"}</h1>
            <p className="subtitle">हर मंत्र का जाप शांति, एकाग्रता और श्रद्धा के साथ करें।</p>
          </div>

          <div className="top-actions">
            <button className="reset-btn" onClick={handleReset}>
              🔄 Reset
            </button>
            <button className="theme-btn" onClick={toggleTheme}>
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
        </div>

        {!selectedDeity ? (
          <div className="deity-section">
            <div className="deity-grid">
              {deities.map((deity) => (
                <button
                  key={deity.id}
                  className="deity-card"
                  onClick={() => handleDeitySelect(deity)}
                >
                  <img src={deity.image} alt={deity.name} />
                  <span>{deity.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="selected-deity-card">
            <img src={selectedDeity.image} alt={selectedDeity.name} />
            <div>
              <p className="section-title">Selected</p>
              <h3>{selectedDeity.name}</h3>
            </div>
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-box">
            <span className="label">Current Count ☀️</span>
            <strong>{count}/108</strong>
          </div>
          <div className="stat-box">
            <span className="label">Completed Mala 📿</span>
            <strong>{mala}</strong>
          </div>
        </div>

        <div className="progress-track" aria-label="progress">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="message-box">{message}</div>

        <div className="action-row">
          <button className="primary-btn circular-btn" onClick={handleIncrement}>
            <strong>Count Mantra</strong>
           <span>📿</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
