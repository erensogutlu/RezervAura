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
const adminGirisKutusu = document.getElementById("adminGirisKutusu");
const adminGirisFormu = document.getElementById("adminGirisFormu");
const adminKullaniciAdiInput = document.getElementById("adminKullaniciAdi");
const adminSifreInput = document.getElementById("adminSifre");
const adminGirisMesaj = document.getElementById("adminGirisMesaj");
const rezervasyonlarListesiDiv = document.getElementById(
	"rezervasyonlarListesi"
);
const rezervasyonTablosuBody = document.querySelector(
	"#rezervasyonTablosu tbody"
);

// önceden belirlenmiş admin kullanıcı adı ve şifre
const YONETICI_KULLANICI_ADI = "admin@panel.com";
const YONETICI_SIFRE = "123456"; // gerçek uygulamalarda bu bilgileri direkt kodda tutmayın!

let girisYapildiMi = false; // admin giriş durumu

// admin girişini kontrol et
adminGirisFormu.addEventListener("submit", (e) => {
	e.preventDefault();
	const girilenKullaniciAdi = adminKullaniciAdiInput.value;
	const girilenSifre = adminSifreInput.value;

	if (
		girilenKullaniciAdi === YONETICI_KULLANICI_ADI &&
		girilenSifre === YONETICI_SIFRE
	) {
		girisYapildiMi = true;
		adminGirisMesajGoster("Giriş başarılı!", "basarili");
		adminGirisKutusu.style.display = "none"; // giriş kutusunu gizle
		rezervasyonlarListesiDiv.style.display = "block"; // rezervasyon listesini göster
		rezervasyonlariGetirVeListele(); // rezervasyonları yükle
	} else {
		adminGirisMesajGoster("Kullanıcı adı veya şifre hatalı.", "hata");
	}
});

// tüm rezervasyonları firestore'dan çek ve tabloya listele
async function rezervasyonlariGetirVeListele() {
	if (!girisYapildiMi) return; // giriş yapılmadıysa işlem yapma

	rezervasyonTablosuBody.innerHTML =
		'<tr><td colspan="7" style="text-align: center;">Rezervasyonlar yükleniyor...</td></tr>'; // yükleniyor mesajı

	try {
		const anlikGoruntuler = await firestoreVeritabani
			.collection("rezervasyonlar")
			.orderBy("olusturmaTarihi", "desc") // en yeni rezervasyonları üste getir
			.get();

		if (anlikGoruntuler.empty) {
			rezervasyonTablosuBody.innerHTML =
				'<tr><td colspan="7" style="text-align: center;">Henüz hiçbir rezervasyon bulunamadı.</td></tr>';
			return;
		}

		rezervasyonTablosuBody.innerHTML = ""; // mevcut içeriği temizle
		anlikGoruntuler.forEach((doc) => {
			const rezervasyon = doc.data();
			const rezervasyonID = doc.id; // rezervasyonun id

			const satir = document.createElement("tr");
			satir.innerHTML = `
                <td data-label="Ad Soyad">${rezervasyon.adSoyad}</td>
                <td data-label="Telefon">${rezervasyon.telefon}</td>
                <td data-label="Tarih">${rezervasyon.tarih}</td>
                <td data-label="Saat">${rezervasyon.saat}</td>
                <td data-label="Kişi Sayısı">${rezervasyon.kisiSayisi}</td>
                <td data-label="Masa No">${rezervasyon.masaNo}</td>
                <td data-label="İşlem">
                    <button class="button sil" data-id="${rezervasyonID}">Sil</button>
                </td>

            `;

			rezervasyonTablosuBody.appendChild(satir);

			// tüm satırlar eklendikten sonra bir defa çalışmalı
			document.querySelectorAll(".geldiCheckbox").forEach((checkbox) => {
				checkbox.addEventListener("change", async (e) => {
					const id = e.target.dataset.id;
					const yeniDurum = e.target.checked;
					const updateData = {
						geldiMi: yeniDurum,
					};

					if (yeniDurum) {
						updateData.geldiTarihi = firebase.firestore.Timestamp.now();
					} else {
						updateData.geldiTarihi = firebase.firestore.FieldValue.delete();
					}

					try {
						await firestoreVeritabani
							.collection("rezervasyonlar")
							.doc(id)
							.update(updateData);
						adminGirisMesajGoster("Rezervasyon güncellendi.", "basarili");
					} catch (hata) {
						console.error("Geldi durumu güncellenirken hata:", hata);
						adminGirisMesajGoster("Güncelleme sırasında hata oluştu.", "hata");
					}
				});
			});
		});

		// silme butonlarına olay dinleyici ekle
		document.querySelectorAll(".button.sil").forEach((button) => {
			button.addEventListener("click", (e) => {
				const id = e.target.dataset.id;
				if (confirm("Bu rezervasyonu silmek istediğinize emin misiniz?")) {
					rezervasyonuSil(id);
				}
			});
		});
	} catch (hata) {
		console.error("Rezervasyonlar çekilirken hata oluştu:", hata);
		rezervasyonTablosuBody.innerHTML =
			'<tr><td colspan="7" style="text-align: center; color: red;">Rezervasyonlar yüklenirken bir hata oluştu.</td></tr>';
		adminGirisMesajGoster(
			"Rezervasyonlar yüklenirken bir hata oluştu.",
			"hata"
		);
	}
}

// rezervasyon silme fonksiyonu
async function rezervasyonuSil(id) {
	try {
		await firestoreVeritabani.collection("rezervasyonlar").doc(id).delete();
		adminGirisMesajGoster("Rezervasyon başarıyla silindi.", "basarili");
		rezervasyonlariGetirVeListele(); // listeyi yeniden yükle
	} catch (hata) {
		console.error("Rezervasyon silinirken hata oluştu:", hata);
		adminGirisMesajGoster("Rezervasyon silinirken bir hata oluştu.", "hata");
	}
}

// admin giriş mesajı gösterme fonksiyonu
function adminGirisMesajGoster(mesaj, tip = "varsayilan") {
	adminGirisMesaj.textContent = mesaj;
	adminGirisMesaj.className = "mesaj " + tip;
	setTimeout(() => {
		adminGirisMesaj.textContent = "";
		adminGirisMesaj.className = "mesaj";
	}, 5000);
}

// sayfa yüklendiğinde admin giriş formunu göster, rezervasyon listesini gizle
document.addEventListener("DOMContentLoaded", () => {
	rezervasyonlarListesiDiv.style.display = "none";
});

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

// loader
const loader = document.getElementById("loader-wrapper");

const MIN_LOAD_TIME = 500;
const startTime = Date.now();

window.addEventListener("load", () => {
	const elapsed = Date.now() - startTime;
	const remaining = MIN_LOAD_TIME - elapsed;

	setTimeout(
		() => {
			loader.style.opacity = "0";
			setTimeout(() => {
				loader.style.display = "none";
			}, 500);
		},
		remaining > 0 ? remaining : 0
	);
});
