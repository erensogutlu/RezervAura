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
const rezervasyonFormu = document.getElementById("rezervasyonFormu");
const tarihInput = document.getElementById("tarih");
const saatSelect = document.getElementById("saat");
const masaSecenekleriDiv = document.getElementById("masaSecenekleri");
const secilenMasaNoInput = document.getElementById("secilenMasaNo");
const mesajP = document.getElementById("mesaj");

// toplam masa sayısı ve saat aralıkları
const toplamMasaSayisi = 10; // kafedeki toplam masa sayısı
const baslangicSaat = 9; // sabah 9
const bitisSaat = 22; // akşam 10

tarihInput.addEventListener("change", () => {
	saatleriDoldur();
	bosMasalariGetir();
});

// saat seçeneklerini doldurma fonksiyonu
function saatleriDoldur() {
	saatSelect.innerHTML = ""; // saatleri temizle

	const bugun = new Date();
	const bugunYil = bugun.getFullYear();
	const bugunAy = (bugun.getMonth() + 1).toString().padStart(2, "0");
	const bugunGun = bugun.getDate().toString().padStart(2, "0");
	const bugunSaat = bugun.getHours();

	const secilenTarih = tarihInput.value;

	for (let s = baslangicSaat; s <= bitisSaat; s++) {
		const option = document.createElement("option");
		const saatString = s.toString().padStart(2, "0") + ":00";
		option.value = saatString;
		option.textContent = saatString;

		// Eğer seçilen tarih bugünün tarihi ise ve saat geçmişse disable yap
		if (
			secilenTarih === `${bugunYil}-${bugunAy}-${bugunGun}` &&
			s <= bugunSaat
		) {
			option.disabled = true;
		}

		saatSelect.appendChild(option);
	}
}

// bu fonksiyon dolu masaları daha belirgin gösterecek ve sadece boş masaların seçimine izin verecek
function masalariGoster(doluMasalar = []) {
	masaSecenekleriDiv.innerHTML = ""; // önceki masaları temizle
	for (let i = 1; i <= toplamMasaSayisi; i++) {
		const masaKarti = document.createElement("div");
		masaKarti.classList.add("masa-karti");
		masaKarti.textContent = `Masa ${i}`;
		masaKarti.dataset.masaNo = i;

		// masa dolu mu kontrol et
		const masaDolu = doluMasalar.includes(i);
		if (masaDolu) {
			masaKarti.classList.add("dolu");
			masaKarti.title = "Bu masa dolu, seçilemez.";
		} else {
			// sadece boş masaların tıklanabilir olmasını sağla
			masaKarti.addEventListener("click", () => {
				// eğer masa dolu değilse
				if (!masaKarti.classList.contains("dolu")) {
					// tüm seçili masaları temizle
					document.querySelectorAll(".masa-karti.secili").forEach((kart) => {
						kart.classList.remove("secili");
					});
					// tıklanan masayı seçili yap
					masaKarti.classList.add("secili");
					secilenMasaNoInput.value = i; // gizli inputa masa numarasını kaydet
				}
			});
		}
		masaSecenekleriDiv.appendChild(masaKarti);
	}
	// masa seçimi sıfırlanmış olabileceği için, eğer önceden seçilmiş bir masa varsa onu tekrar seçili yap
	const mevcutSecilenMasa = secilenMasaNoInput.value;
	if (mevcutSecilenMasa) {
		const seciliMasaElementi = document.querySelector(
			`.masa-karti[data-masa-no="${mevcutSecilenMasa}"]`
		);
		if (seciliMasaElementi && !seciliMasaElementi.classList.contains("dolu")) {
			seciliMasaElementi.classList.add("secili");
		} else {
			secilenMasaNoInput.value = ""; // eğer seçili masa dolduysa sıfırla
		}
	}
}

// tarih ve saat değiştiğinde boş masaları güncelleme fonksiyonu
async function bosMasalariGetir() {
	const secilenTarih = tarihInput.value;
	const secilenSaat = saatSelect.value;

	if (!secilenTarih || !secilenSaat) {
		masalariGoster(); // tarih veya saat seçili değilse tüm masaları boş göster
		secilenMasaNoInput.value = ""; // masa seçimini sıfırla
		return;
	}

	try {
		// seçilen tarih ve saat için tüm rezervasyonları al
		const anlikGoruntuler = await firestoreVeritabani
			.collection("rezervasyonlar")
			.where("tarih", "==", secilenTarih)
			.where("saat", "==", secilenSaat)
			.get();

		const doluMasalar = [];
		anlikGoruntuler.forEach((doc) => {
			const rezervasyon = doc.data();
			doluMasalar.push(rezervasyon.masaNo);
		});

		masalariGoster(doluMasalar); // dolu masaları işaretle
		// eğer seçili olan masa dolu hale geldiyse seçimi kaldır
		const mevcutSecilenMasa = parseInt(secilenMasaNoInput.value);
		if (mevcutSecilenMasa && doluMasalar.includes(mevcutSecilenMasa)) {
			secilenMasaNoInput.value = "";
			mesajGoster(
				"Seçtiğiniz masa, başka bir rezervasyon nedeniyle doldu. Lütfen başka bir masa seçin.",
				"hata"
			);
		}
	} catch (hata) {
		console.error("Boş masaları getirirken hata oluştu:", hata);
		mesajGoster("Masalar yüklenirken bir hata oluştu.", "hata");
		masalariGoster(); // hata durumunda tüm masaları boş göster (güvenli taraf)
		secilenMasaNoInput.value = ""; // masa seçimini sıfırla
	}
}

// rezervasyon formunu gönder
rezervasyonFormu.addEventListener("submit", async (e) => {
	e.preventDefault(); // formun varsayılan gönderimini engelle

	const adSoyad = document.getElementById("adSoyad").value.trim();
	const telefon = document.getElementById("telefon").value.trim();
	const tarih = tarihInput.value;
	const saat = saatSelect.value;
	const kisiSayisi = document.getElementById("kisiSayisi").value;
	const secilenMasaNo = secilenMasaNoInput.value;

	// alanların dolu olup olmadığını kontrol et
	if (!adSoyad || !telefon || !tarih || !saat || !kisiSayisi) {
		mesajGoster("Lütfen tüm alanları doldurun.", "hata");
		return;
	}

	if (!secilenMasaNo) {
		mesajGoster("Lütfen bir masa seçin.", "hata");
		return;
	}

	// telefon numarasının geçerliliğini kontrol et (10 haneli sayı)
	const telefonRegex = /^[0-9]{10}$/;
	if (!telefonRegex.test(telefon)) {
		mesajGoster(
			"Lütfen geçerli bir 10 haneli telefon numarası girin (örn: 5xxxxxxxxx).",
			"hata"
		);
		return;
	}

	// kişi sayısının geçerliliğini kontrol et
	const kisiSayisiInt = parseInt(kisiSayisi);
	if (isNaN(kisiSayisiInt) || kisiSayisiInt < 1 || kisiSayisiInt > 10) {
		mesajGoster("Kişi sayısı 1 ile 10 arasında olmalıdır.", "hata");
		return;
	}

	// rezervasyon verisini oluştur
	const rezervasyonVerisi = {
		adSoyad,
		telefon,
		tarih,
		saat,
		kisiSayisi: kisiSayisiInt,
		masaNo: parseInt(secilenMasaNo),
		olusturmaTarihi: firebase.firestore.FieldValue.serverTimestamp(), // Rezervasyon zaman damgası
	};

	try {
		// aynı masa, tarih ve saat için başka bir rezervasyon var mı kontrol et (tekrar güvenlik kontrolü)
		const mevcutRezervasyonlar = await firestoreVeritabani
			.collection("rezervasyonlar")
			.where("tarih", "==", tarih)
			.where("saat", "==", saat)
			.where("masaNo", "==", parseInt(secilenMasaNo))
			.get();

		if (!mevcutRezervasyonlar.empty) {
			mesajGoster(
				"Bu masa, seçtiğiniz tarih ve saat için zaten rezerve edilmiş. Lütfen başka bir masa veya zaman seçin.",
				"hata"
			);
			bosMasalariGetir(); // masaları tekrar güncelle
			return;
		}

		// rezervasyonu firestore ekle
		await firestoreVeritabani
			.collection("rezervasyonlar")
			.add(rezervasyonVerisi);
		mesajGoster("Rezervasyonunuz başarıyla oluşturuldu!", "basarili");
		rezervasyonFormu.reset(); // formu sıfırla
		secilenMasaNoInput.value = ""; // gizli masa numarasını sıfırla
		bosMasalariGetir(); // masaları tekrar güncelle
	} catch (hata) {
		console.error("Rezervasyon oluşturulurken hata oluştu:", hata);
		mesajGoster(
			"Rezervasyon oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.",
			"hata"
		);
	}
});

// mesaj gösterme fonksiyonu
function mesajGoster(mesaj, tip = "varsayilan") {
	mesajP.textContent = mesaj;
	mesajP.className = "mesaj " + tip; // css sınıfını dinamik olarak ayarla
	setTimeout(() => {
		mesajP.textContent = "";
		mesajP.className = "mesaj";
	}, 5000); // 5 saniye sonra mesajı gizle
}

// olay dinleyicileri
tarihInput.addEventListener("change", bosMasalariGetir);
saatSelect.addEventListener("change", bosMasalariGetir);

// sayfa yüklendiğinde çalışacak fonksiyonlar
document.addEventListener("DOMContentLoaded", () => {
	// bugünün tarihini varsayılan olarak ayarla
	const bugun = new Date();
	const ay = (bugun.getMonth() + 1).toString().padStart(2, "0");
	const gun = bugun.getDate().toString().padStart(2, "0");
	tarihInput.value = `${bugun.getFullYear()}-${ay}-${gun}`;
	tarihInput.min = `${bugun.getFullYear()}-${ay}-${gun}`; // geçmiş tarihleri engelle

	saatleriDoldur(); // saatleri yeniden oluştur
	bosMasalariGetir(); // ardından boş masaları getir
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

// sayfayı her 10 dakikada bir yenile
setInterval(() => {
	location.reload();
}, 600000); // 10 dakika
