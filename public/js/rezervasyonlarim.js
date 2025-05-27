const firebaseConfig = {
	apiKey: "AIzaSyCAyOyZdAEBdMWUgDVOxeb6eDGvR-w44rw",
	authDomain: "booking-1dc76.firebaseapp.com",
	projectId: "booking-1dc76",
	storageBucket: "booking-1dc76.firebasestorage.app",
	messagingSenderId: "257659816223",
	appId: "1:257659816223:web:64d9d86b0b82b604f7c82a",
};

// firebase başlat
firebase.initializeApp(firebaseConfig);
const firestoreVeritabani = firebase.firestore(); // firestore veritabanı referansı

// dom elemanlarını seç
const rezervasyonSorguFormu = document.getElementById("rezervasyonSorguFormu");
const sorguTelefonInput = document.getElementById("sorguTelefon");
const sorguMesajP = document.getElementById("sorguMesaj");
const sorgulananRezervasyonlarListesiDiv = document.getElementById(
	"sorgulananRezervasyonlarListesi"
);
const sorgulananRezervasyonTablosuBody = document.querySelector(
	"#sorgulananRezervasyonTablosu tbody"
);

// başlangıçta rezervasyon listesini gizle
document.addEventListener("DOMContentLoaded", () => {
	sorgulananRezervasyonlarListesiDiv.style.display = "none";
});

// rezervasyon sorgulama formu gönderildiğinde
rezervasyonSorguFormu.addEventListener("submit", async (e) => {
	e.preventDefault();
	const telefonNumarasi = sorguTelefonInput.value.trim();

	if (!telefonNumarasi) {
		mesajGoster("Lütfen telefon numaranızı girin.", "hata");
		sorgulananRezervasyonlarListesiDiv.style.display = "none";
		return;
	}

	// telefon numarasının geçerliliğini kontrol et (10 haneli sayı)
	const telefonRegex = /^[0-9]{10}$/;
	if (!telefonRegex.test(telefonNumarasi)) {
		mesajGoster(
			"Lütfen geçerli bir 10 haneli telefon numarası girin (örn: 5xxxxxxxxx).",
			"hata"
		);
		sorgulananRezervasyonlarListesiDiv.style.display = "none";
		return;
	}

	await rezervasyonlariTelefonIleGetir(telefonNumarasi);
});

// telefon numarasına göre rezervasyonları getir ve listele
async function rezervasyonlariTelefonIleGetir(telefon) {
	sorgulananRezervasyonTablosuBody.innerHTML =
		'<tr><td colspan="7" style="text-align: center;">Rezervasyonlarınız yükleniyor...</td></tr>';
	sorgulananRezervasyonlarListesiDiv.style.display = "block";

	try {
		const anlikGoruntuler = await firestoreVeritabani
			.collection("rezervasyonlar")
			.where("telefon", "==", telefon)
			.orderBy("tarih", "asc") // tarihe göre sırala
			.orderBy("saat", "asc") // saate göre sırala
			.get();

		if (anlikGoruntuler.empty) {
			sorgulananRezervasyonTablosuBody.innerHTML =
				'<tr><td colspan="7" style="text-align: center;">Bu telefon numarasına ait aktif rezervasyon bulunamadı.</td></tr>';
			mesajGoster(
				"Bu telefon numarasına ait aktif rezervasyon bulunamadı.",
				"bilgi"
			);
			return;
		}

		sorgulananRezervasyonTablosuBody.innerHTML = ""; // mevcut içeriği temizle
		anlikGoruntuler.forEach((doc) => {
			const rezervasyon = doc.data();
			const rezervasyonID = doc.id;

			const satir = document.createElement("tr");
			satir.innerHTML = `
                <td data-label="Ad Soyad">${rezervasyon.adSoyad}</td>
                <td data-label="Telefon">${rezervasyon.telefon}</td>
                <td data-label="Tarih">${rezervasyon.tarih}</td>
                <td data-label="Saat">${rezervasyon.saat}</td>
                <td data-label="Kişi Sayısı">${rezervasyon.kisiSayisi}</td>
                <td data-label="Masa No">${rezervasyon.masaNo}</td>
                <td data-label="İşlem">
                    <button class="button sil" data-id="${rezervasyonID}">İptal Et</button>
                </td>
            `;
			sorgulananRezervasyonTablosuBody.appendChild(satir);
		});

		// iptal butonlarına olay dinleyici ekle
		document.querySelectorAll(".button.sil").forEach((button) => {
			button.addEventListener("click", (e) => {
				const id = e.target.dataset.id;
				if (confirm("Bu rezervasyonu iptal etmek istediğinize emin misiniz?")) {
					rezervasyonuIptalEt(id, telefon); // iptal sonrası tekrar sorgula
				}
			});
		});

		mesajGoster("Rezervasyonlarınız listelendi.", "basarili");
	} catch (hata) {
		console.error("Rezervasyonlar çekilirken hata oluştu:", hata);
		sorgulananRezervasyonTablosuBody.innerHTML =
			'<tr><td colspan="7" style="text-align: center; color: red;">Rezervasyonlarınız yüklenirken bir hata oluştu.</td></tr>';
		mesajGoster("Rezervasyonlar yüklenirken bir hata oluştu.", "hata");
	}
}

// rezervasyon iptal etme fonksiyonu
async function rezervasyonuIptalEt(id, telefonNumarasi) {
	try {
		await firestoreVeritabani.collection("rezervasyonlar").doc(id).delete();
		mesajGoster("Rezervasyon başarıyla iptal edildi.", "basarili");
		await rezervasyonlariTelefonIleGetir(telefonNumarasi); // listeyi yeniden yükle
	} catch (hata) {
		console.error("Rezervasyon iptal edilirken hata oluştu:", hata);
		mesajGoster(
			"Rezervasyon iptal edilirken bir hata oluştu. Lütfen tekrar deneyin.",
			"hata"
		);
	}
}

// mesaj gösterme fonksiyonu
function mesajGoster(mesaj, tip = "varsayilan") {
	sorguMesajP.textContent = mesaj;
	sorguMesajP.className = "mesaj " + tip;
	setTimeout(() => {
		sorguMesajP.textContent = "";
		sorguMesajP.className = "mesaj";
	}, 5000);
}

// toggle
const toggleBtn = document.getElementById("toggleBtn");
const navLinks = document.getElementById("navLinks");

toggleBtn.addEventListener("click", () => {
	if (navLinks.style.display === "flex") {
		navLinks.style.display = "none";
		toggleBtn.classList.remove("active");
	} else {
		navLinks.style.display = "flex";
		toggleBtn.classList.add("active");
	}
});

window.addEventListener("resize", () => {
	if (window.innerWidth > 768) {
		navLinks.style.display = "flex";
	} else {
		navLinks.style.display = "none";
	}
});
