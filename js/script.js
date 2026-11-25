
/* NAVIGASI MOBILE */

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");

    const icon = menuToggle.querySelector("i");

    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-xmark");
});

document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("show");

        const icon = menuToggle.querySelector("i");
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

        document.querySelectorAll(".nav-link").forEach(item => {
            item.classList.remove("active");
        });

        link.classList.add("active");
    });
});


/* JAM WITA */

function updateJam() {
    const sekarang = new Date();

    const jamWITA = sekarang.toLocaleTimeString("id-ID", {
        timeZone: "Asia/Makassar",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });

    document.getElementById("jam-realtime").innerText =
        jamWITA + " WITA";
}


/* STATUS SERVER */

function updateTampilan() {
    const sekarang = new Date();

    // Waktu mengikuti WITA
    const waktuWITA = new Date(
        sekarang.toLocaleString("en-US", {
            timeZone: "Asia/Makassar"
        })
    );

    const hari = waktuWITA.getDay();
    const jam = waktuWITA.getHours();
    const menit = waktuWITA.getMinutes();

    const waktuSekarang = jam + (menit / 60);

    // Senin-Kamis 08:00-15:30
    // Jumat 08:00-11:00
    const isJamKerja =
        (hari >= 1 && hari <= 4 &&
            waktuSekarang >= 8 &&
            waktuSekarang < 15.5) ||

        (hari === 5 &&
            waktuSekarang >= 8 &&
            waktuSekarang < 11);

    const statusLabel = document.getElementById("status-label");
    const countdownArea = document.getElementById("area-countdown");
    const sapaan = document.getElementById("sapaan");
    const pesan = document.getElementById("pesan-utama");

    if (isJamKerja) {

        statusLabel.className = "status-label open";
        statusLabel.innerHTML =
            '<span class="status-dot"></span> Gangguan Teknis';

        sapaan.innerText = "Mohon Maaf, Pak/Bu";

        pesan.innerText =
            "Server desa sedang mengalami gangguan koneksi atau dalam proses pemeliharaan sistem. Untuk memastikan apakah gangguan disebabkan oleh jaringan internet kantor atau pemadaman listrik, silakan hubungi Admin Desa melalui WhatsApp.";

        countdownArea.classList.add("hidden");

    } else {

        statusLabel.className = "status-label closed";
        statusLabel.innerHTML =
            '<span class="status-dot"></span> Akan Aktif Pada Jam Kerja';

        sapaan.innerText = "Server Sedang Istirahat";

        pesan.innerText =
            "Layanan desa saat ini berada di luar jam operasional. Silakan kembali pada jam kerja atau hubungi Admin Desa melalui WhatsApp untuk keperluan mendesak.";

        countdownArea.classList.remove("hidden");

        // Hitung jam aktif berikutnya
        let besok = new Date(waktuWITA);

        besok.setHours(8, 0, 0, 0);

        if (waktuWITA >= besok) {
            besok.setDate(besok.getDate() + 1);
        }

        // Lewati Sabtu dan Minggu
        while (besok.getDay() === 0 || besok.getDay() === 6) {
            besok.setDate(besok.getDate() + 1);
        }

        const selisih = besok - waktuWITA;

        const h = Math.floor(selisih / 3600000);
        const m = Math.floor((selisih % 3600000) / 60000);
        const s = Math.floor((selisih % 60000) / 1000);

        document.getElementById("timer").innerText =
            `${String(h).padStart(2, "0")}:` +
            `${String(m).padStart(2, "0")}:` +
            `${String(s).padStart(2, "0")}`;
    }

    document.getElementById("btn-wa").href =
        "https://wa.me/6285248555550?text=" +
        encodeURIComponent("Halo Admin Desa Banama, saya perlu bantuan layanan desa.");
}

updateJam();
updateTampilan();

setInterval(updateJam, 1000);
setInterval(updateTampilan, 1000);


/* MUSIK - AKTIF SAAT SENTUHAN / KLIK PERTAMA */

const bgMusic = document.getElementById("bg-music");
bgMusic.volume = 0.6;

let audioAktif = false;

function aktifkanAudio() {
    if (audioAktif) return;

    bgMusic.play().then(() => {
        audioAktif = true;

        document.removeEventListener("pointerdown", aktifkanAudio);
        document.removeEventListener("touchstart", aktifkanAudio);
        document.removeEventListener("click", aktifkanAudio);
    }).catch(() => {
        // Jika browser menolak, tunggu interaksi berikutnya
    });
}

document.addEventListener("pointerdown", aktifkanAudio);
document.addEventListener("touchstart", aktifkanAudio);
document.addEventListener("click", aktifkanAudio);
