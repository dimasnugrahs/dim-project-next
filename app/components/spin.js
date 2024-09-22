"use client";

import React, { useState, useEffect } from "react";
import "../styles/Spinwheel.css";

const Spinwheel = () => {
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState(""); // State untuk menyimpan nama pengguna
  const [isNameModalOpen, setIsNameModalOpen] = useState(true); // Modal untuk input nama
  const [isResultModalOpen, setIsResultModalOpen] = useState(false); // Modal untuk hasil spin

  const options = [
    "50.000",
    "100.000",
    "150.000",
    "200.000",
    "250.000",
    "300.000",
    "1.000.000",
    "500.000",
  ];

  const selectableOptions = ["100.000", "150.000", "200.000"];
  const segmentCount = options.length;
  const segmentAngle = 360 / segmentCount;

  const handleSpin = () => {
    if (spinning) return;

    // Reset hasil sebelumnya
    setSelected(null);

    // Pilih nilai acak dari selectableOptions
    const randomIndex = Math.floor(Math.random() * selectableOptions.length);
    const selectedOption = selectableOptions[randomIndex];
    setSelected(selectedOption);

    // Tentukan posisi (index) dari opsi yang dipilih di roda
    const selectedOptionIndex = options.indexOf(selectedOption);

    // Hitung sudut berhenti agar opsi yang dipilih berhenti tepat di depan panah
    const stopAngle =
      405 - (selectedOptionIndex * segmentAngle + segmentAngle / 2);

    // Tambahkan rotasi untuk efek spinning
    const totalAngle = stopAngle + 360 * 7; // Rotasi minimal 5 kali

    setAngle((prevAngle) => prevAngle + totalAngle);
    setSpinning(true);

    setTimeout(() => {
      setSpinning(false);
      setIsResultModalOpen(true); // Buka modal hasil spin setelah selesai
    }, 4000); // Durasi animasi 4 detik
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    setIsNameModalOpen(false); // Tutup modal input nama setelah disubmit
  };

  return (
    <div>
      {/* Modal Input Nama */}
      {isNameModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg">
            <h2>Masukkan Nama Anda</h2>
            <form onSubmit={handleNameSubmit}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full"
                placeholder="Masukkan Nama"
                required
              />
              <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                Lanjutkan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Spinwheel dan tombol */}
      {!isNameModalOpen && (
        <div className="App">
          <h1 className="title-spin">Spin Gaskeun, {name}!</h1>
          <div className="indicator">&#9660;</div>
          <div className="wheel-container">
            <div className="wheel" style={{ transform: `rotate(${angle}deg)` }}>
              {options.map((option, index) => (
                <div
                  key={index}
                  className="segment"
                  style={{
                    transform: `rotate(${index * segmentAngle}deg)`,
                    clipPath: "polygon(0 0, 100% 0, 100% 100%)", // Membuat segmen
                  }}
                >
                  <span>{option}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleSpin} disabled={spinning}>
            {spinning
              ? "Memutar..."
              : selected === null
              ? "Putar Spinwheel"
              : "Reset & Spin Lagi"}
          </button>
        </div>
      )}

      {/* Modal Hasil Spin */}
      {isResultModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg">
            <h2>Selamat, {name}!</h2>
            <p>Anda mendapatkan: {selected}</p>
            <button
              onClick={() => setIsResultModalOpen(false)}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Spinwheel;
