RezervAura - "Masanın enerjisini hisset."

Bu proje, kafe veya restoran için geliştirilmiş, masa rezervasyonlarını yönetmeye yönelik bir web uygulamasıdır. Kullanıcıların kolayca masa seçip rezervasyon yapmasını sağlarken, yöneticiler için de rezervasyonları görüntüleme ve yönetme imkanı sunar.

* Özellikler : 

-> Masa Seçimi ve Durum Gösterimi: Kullanıcılar, mevcut masaları görsel olarak görebilir ve boş/dolu durumlarına göre seçim yapabilir.

      + Boş Masalar : Gri renkte gösterilir.

      + Dolu Masalar : Sarı renkte gösterilir ve tıklanamaz hale gelir.
     
      + Kapasite Kontrolü : Seçilen kişi sayısına göre masanın uygun olup olmadığı kontrol edilir. Kapasitesi yetersiz olan masalar da dolu olarak işaretlenir.

-> Tarih ve Saat Seçimi : Kullanıcılar, rezervasyon yapmak istedikleri tarih ve saati seçebilir. Masa durumları, seçilen tarih ve saate göre dinamik olarak güncellenir.

-> Kullanıcı Rezervasyonu : Ad-soyad, telefon, kişi sayısı, tarih ve saat bilgileriyle kolayca rezervasyon yapabilir.

-> Çift Rezervasyon Engelleme : Aynı masa, tarih ve saat için rezervasyon yapılması engellenir.

-> Admin Paneli : Yöneticiler için ayrı bir giriş alanı bulunur.

      + Tüm rezervasyonları listeleyebilir.

      + Tarihe göre rezervasyonları filtreleyebilir.

      + Mevcut rezervasyonları silebilir.

-> Firebase Entegrasyonu: Tüm masa ve rezervasyon verileri Google Firebase Firestore üzerinde güvenli bir şekilde saklanır.

-> Modern Arayüz: Temiz ve modern bir kullanıcı arayüzü tasarımı sunar.

YONETICI_KULLANICI_ADI = "admin@panel.com"
YONETICI_SIFRE = "123456"

* Kullanılan Teknolojiler :

      + HTML / CSS

      + JavaScript

      Veritabanı: Google Firebase Firestore

* Geliştirici : Eren Söğütlü

--------------------------------------------------------------------------------

*** Önemli Güvenlik Uyarısı : Bu Uygulama Public Kullanım İçin Uygun Değildir!
Geliştirdiğim bu rezervasyon sistemi projesi, bir demo amaçlı bir çalışma olarak tasarlanmıştır. Ancak mevcut haliyle, ciddi güvenlik zaafiyetleri içermektedir ve kesinlikle halka açık (public) bir ortamda, gerçek kullanıcı verileriyle veya hassas bilgilerle kullanılmamalıdır.

Güvenlik Riskleri Nelerdir?
Bu uygulamanın mevcut kod yapısında, özellikle kullanıcı yetkilendirme ve veri güvenliği konularında temel eksiklikler bulunmaktadır :

1 - Kimlik Doğrulama ve Yetkilendirme Eksikliği :

Sistemde şu anda bir kullanıcı giriş/kayıt sistemi veya rol bazlı erişim kontrolü (RBAC) bulunmamaktadır. Bu, herkesin uygulamanın tüm işlevlerine (örneğin, rezervasyon yapma, silme veya yönetme) erişebileceği anlamına gelir.

Gerçek bir senaryoda, bir kullanıcı diğer kullanıcıların rezervasyonlarını görüntüleyebilir, silebilir veya değiştirebilir. Bu durum, veri bütünlüğünün ihlaline ve kullanıcı gizliliğinin ortadan kalkmasına neden olur.

2 - Veri Güvenliği ve Doğrulama (Input Validation) Eksikliği :

Rezervasyon formları veya diğer veri giriş alanlarında kapsamlı girdi doğrulama (input validation) yapılmamaktadır. Kötü niyetli kullanıcılar, SQL Injection, Cross-Site Scripting (XSS) veya diğer enjeksiyon saldırılarıyla sistemi istismar edebilir.

Bu durum, veritabanının zarar görmesine, hassas bilgilerin çalınmasına veya web sitesinin ele geçirilmesine yol açabilir.

3 - Hassas Bilgi Saklama :

Bu sistemde kullanıcı şifreleri veya diğer hassas kişisel veriler tutuluyor, bu verilerin şifrelenmemiş veya güvenli olmayan bir şekilde saklanması riski vardır. Şifreler her zaman hash'lenmeli ve tuzlanmalıdır(Salting).

Neden Public Ortamda Kullanılmamalıdır?
Yukarıda belirtilen güvenlik zaafiyetleri nedeniyle, bu uygulama herhangi bir canlı ortamda kullanıldığında :

Veri İhlalleri : Müşteri bilgileri (ad, telefon, rezervasyon detayları) kolayca görüntülenebilir, değiştirilebilir veya silinebilir.

Sistem İstismarı : Kötü niyetli kişiler, sistemi kullanarak gereksiz yere rezervasyonlar oluşturabilir, kapasiteyi kilitleyebilir veya hizmet reddi (DoS) saldırıları düzenleyebilir.

İtibar Kaybı : Güvenlik olayları, işletmenizin itibarına ciddi zarar verebilir ve yasal sonuçlara yol açabilir.

--------------------------------------------------------------------------------

ReserveAura - "Feel the energy of the table."

This project is a web application developed for cafes or restaurants to manage table reservations. It allows users to easily select and book tables, while also providing administrators with the ability to view and manage reservations.

* Features :

-> Table Selection and Status Display: Users can visually view available tables and make selections based on their empty/occupied status.

  + Empty Tables : Shown in gray.

  + Occupied Tables : Shown in yellow and become unclickable.

  + Capacity Control : The availability of the table is checked according to the selected number of people. Tables with insufficient capacity are also marked as occupied.

-> Date and Time Selection : Users can select the date and time they want to make a reservation. Table statuses are dynamically updated according to the selected date and time.

-> User Reservation : Easily make reservations with name-surname, phone number, number of people, date and time information.

-> Double Booking Prevention: Reservations for the same table, date and time are prevented.

-> Admin Panel: There is a separate login area for administrators.

   + Can list all reservations.

   + Can filter reservations by date.

   + Can delete existing reservations.

-> Firebase Integration: All table and reservation data is securely stored on Google Firebase Firestore.

-> Modern Interface: Provides a clean and modern user interface design.

ADMIN_USER_NAME = "admin@panel.com"
ADMIN_PASSWORD = "123456"

* Technologies Used:

  + HTML / CSS

  + JavaScript

Database: Google Firebase Firestore

* Developer: Eren Söğütlü

--------------------------------------------------------------------------------

*** Important Security Warning: This Application is Not Suitable for Public Use!
This reservation system project I developed was designed as a demo study. However, in its current form, it contains serious security vulnerabilities and should never be used in a public environment, with real user data or sensitive information.

What are the Security Risks?
There are fundamental deficiencies in the current code structure of this application, especially in user authorization and data security:

1 - Lack of Authentication and Authorization:

There is currently no user login/registration system or role-based access control (RBAC) in the system. This means that everyone can access all functions of the application (for example, making, deleting or managing reservations).

In a real scenario, a user can view, delete or change the reservations of other users. This causes data integrity to be violated and user privacy to be lost.

2 - Lack of Data Security and Input Validation:

Comprehensive input validation is not performed on reservation forms or other data entry fields. Malicious users can exploit the system with SQL Injection, Cross-Site Scripting (XSS) or other injection attacks.

This may lead to database damage, theft of sensitive information or website compromise.

3 - Storing Sensitive Information:

This system stores user passwords or other sensitive personal data, there is a risk that this data is stored unencrypted or insecurely. Passwords should always be hashed and salted.

Why Should It Not Be Used in Public Environments?

Due to the security vulnerabilities mentioned above, when this application is used in any live environment:

Data Breaches: Customer information (name, phone, reservation details) can be easily viewed, changed or deleted.

System Exploitation: Malicious individuals can use the system to create unnecessary reservations, lock capacity or organize denial of service (DoS) attacks.

Reputation Loss: Security incidents can seriously damage your business's reputation and lead to legal consequences.
