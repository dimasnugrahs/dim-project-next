"use client";

import React, { useEffect, useState } from "react";
import "../styles/Spinwheel.css";

const Spinwheel = () => {
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState(null);
  const [clicks, setClicks] = useState(0); // State untuk mengelola klik tombol
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
    "500.000",
    "1.000.000",
  ];

  const selectableOptions = ["100.000", "150.000", "200.000"];
  const segmentCount = options.length;
  const segmentAngle = 360 / segmentCount;

  const handleSpin = () => {
    if (spinning) return;

    // Jika selected sudah ada, maka reset halaman dan state
    if (selected !== null) {
      setSelected(null);
      setAngle(0);
      setClicks(0); // Reset click counter
      window.location.reload(); // Refresh halaman
      return;
    }

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

  const handleSaveToDatabase = async () => {
    try {
      const response = await fetch("/api/spinwheels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name, // nama yang diinput di form modal
          prize: selected, // hasil dari spin
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan data");
      }

      const data = await response.json();
      console.log("Data berhasil disimpan:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (selected && !spinning) {
      handleSaveToDatabase(); // Simpan data setelah spin selesai
      setIsResultModalOpen(true); // Tampilkan modal ucapan selamat
    }
  }, [selected, spinning]);

  console.log(selected + name);

  return (
    <div>
      {isNameModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Get your Luckiest day ever!
                </h3>
              </div>
              <div className="p-4 md:p-5 space-y-2">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  Hello! Dont think twice to explore more this website, enjoy
                  all the features and grab your luck. Letsgooo~
                </p>
              </div>
              <div className="p-4 md:p-5 space-y-4 ">
                <form onSubmit={handleNameSubmit}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Ready to spin? Drop your name first here!"
                    required
                  />
                  <div className="flex justify-end mb-2">
                    <button
                      type="submit"
                      className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-12 py-2.5 text-center border-none"
                    >
                      Click Here
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isNameModalOpen && (
        <div className="App">
          <div>
            <h1 className="title-spin">Hello {name}, Get your spin below!</h1>
          </div>
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
          {selected && !spinning && (
            <div className="result">Hasil: Rp{selected}</div>
          )}
        </div>
      )}

      {isResultModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Yeayyy! You`ve hit the jackpot!
                </h3>
              </div>
              <div className="p-4 md:p-5 space-y-2">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  Hello!&nbsp;
                  <span className="text-gray-900 dark:text-white">
                    <strong>{name}</strong>
                  </span>
                  , grats! you`ve won{" "}
                  <span className="text-gray-900 dark:text-white">
                    <strong>Rp{selected}</strong>
                  </span>{" "}
                  from this event. Send me the video you`re recording right now.
                  I hope you and around can fully enjoy and blessed the joy
                  of&nbsp;
                  <span className="text-gray-900 dark:text-white">
                    <strong>Galungan and Kuningan</strong>
                  </span>{" "}
                  celebrations.
                </p>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  &nbsp;
                </p>
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  Dont worries bout to this event, this website was created
                  during the break day and very enjoy. Thanks a lot for all your
                  help while working on this project! Yoshhh~
                </p>
              </div>
              <div className="p-4 md:p-5 space-y-4 flex justify-end">
                <button
                  type="submit"
                  onClick={() => setIsResultModalOpen(false)}
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-12 py-2.5 text-center border-none"
                >
                  Close Now
                </button>
              </div>
            </div>
          </div>
        </div>

        // <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        //   <div className="bg-white p-5 rounded shadow-lg">
        //     <h2>Selamat, {name}!</h2>
        //     <p>Anda mendapatkan: {selected}</p>
        //     <button
        //       onClick={() => setIsResultModalOpen(false)}
        //       className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
        //     >
        //       Tutup
        //     </button>
        //   </div>
        // </div>
      )}
    </div>
  );
};

export default Spinwheel;
