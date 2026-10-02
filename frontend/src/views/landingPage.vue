<script setup>
import { ref, onMounted, onUnmounted } from "vue";

import {
  WrenchScrewdriverIcon,
  ClockIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightIcon,
  PhoneIcon,
  MapPinIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/vue/24/outline";

/* =========================
   CAROUSEL
========================= */

const currentSlide = ref(0);

const slides = [
  {
    image: "/images/bengkel-1.jpg",
    title: "Servis Motor Lebih Mudah",
    description:
      "Rawat kendaraan Anda dengan layanan bengkel yang profesional, cepat, dan terpercaya.",
  },
  {
    image: "/images/bengkel-2.jpg",
    title: "Booking Servis Tanpa Ribet",
    description:
      "Tentukan jadwal servis kendaraan Anda dengan mudah tanpa harus antre lama.",
  },
  {
    image: "/images/bengkel-3.jpg",
    title: "Kendaraan Ditangani Profesional",
    description:
      "Percayakan kendaraan Anda kepada mekanik berpengalaman dengan pelayanan terbaik.",
  },
];

let carouselTimer;

function nextSlide() {
  currentSlide.value =
    (currentSlide.value + 1) % slides.length;
}

function prevSlide() {
  currentSlide.value =
    (currentSlide.value - 1 + slides.length) %
    slides.length;
}

function goToSlide(index) {
  currentSlide.value = index;
}

onMounted(() => {
  carouselTimer = setInterval(() => {
    nextSlide();
  }, 5000);
});

onUnmounted(() => {
  clearInterval(carouselTimer);
});
</script>

<template>
  <div class="landing-page">

    <!-- ================= NAVBAR ================= -->

    <header class="landing-navbar">
      <div class="container navbar-inner">

        <RouterLink to="/" class="brand">

          <div class="brand-icon">
            <WrenchScrewdriverIcon />
          </div>

          <div>
            <span class="brand-name">BengkelKu</span>
            <span class="brand-subtitle">
              Motor Service
            </span>
          </div>

        </RouterLink>


        <nav class="desktop-nav">

          <a href="#beranda">Beranda</a>
          <a href="#layanan">Layanan</a>
          <a href="#tentang">Tentang Kami</a>
          <a href="#cara-kerja">Cara Kerja</a>
          <a href="#kontak">Kontak</a>

        </nav>


        <div class="navbar-actions">

          <RouterLink
            to="/login"
            class="btn-login"
          >
            Login
          </RouterLink>

          <RouterLink
            to="/register"
            class="btn-register"
          >
            Daftar
          </RouterLink>

        </div>

      </div>
    </header>


    <!-- ================= HERO CAROUSEL ================= -->

    <section
      id="beranda"
      class="hero-carousel"
    >

      <div
        v-for="(slide, index) in slides"
        :key="slide.image"
        class="hero-slide"
        :class="{ active: currentSlide === index }"
        :style="{
          backgroundImage: `url(${slide.image})`
        }"
      >

        <div class="hero-overlay"></div>

        <div class="container hero-container">

          <div class="hero-content">

            <span class="hero-badge">
              <span class="badge-dot"></span>
              Bengkel Motor Profesional
            </span>

            <h1>
              {{ slide.title }}
            </h1>

            <p>
              {{ slide.description }}
            </p>

            <div class="hero-buttons">

              <RouterLink
                to="/login"
                class="btn-primary"
              >
                Booking Servis
                <ArrowRightIcon />
              </RouterLink>

              <a
                href="#layanan"
                class="btn-secondary"
              >
                Lihat Layanan
              </a>

            </div>

          </div>

        </div>

      </div>


      <!-- PREVIOUS -->

      <button
        class="carousel-arrow carousel-prev"
        @click="prevSlide"
        aria-label="Slide sebelumnya"
      >
        <ChevronLeftIcon />
      </button>


      <!-- NEXT -->

      <button
        class="carousel-arrow carousel-next"
        @click="nextSlide"
        aria-label="Slide berikutnya"
      >
        <ChevronRightIcon />
      </button>


      <!-- INDICATORS -->

      <div class="carousel-indicators">

        <button
          v-for="(slide, index) in slides"
          :key="index"
          class="carousel-dot"
          :class="{ active: currentSlide === index }"
          @click="goToSlide(index)"
          :aria-label="`Slide ${index + 1}`"
        ></button>

      </div>

    </section>


    <!-- ================= QUICK INFO ================= -->

    <section class="quick-info">

      <div class="container quick-info-grid">

        <div class="quick-info-item">

          <div class="quick-icon">
            <ShieldCheckIcon />
          </div>

          <div>
            <strong>Terpercaya</strong>
            <span>Pelayanan profesional</span>
          </div>

        </div>


        <div class="quick-info-item">

          <div class="quick-icon">
            <WrenchScrewdriverIcon />
          </div>

          <div>
            <strong>Mekanik Profesional</strong>
            <span>Ditangani tenaga berpengalaman</span>
          </div>

        </div>


        <div class="quick-info-item">

          <div class="quick-icon">
            <ClockIcon />
          </div>

          <div>
            <strong>Hemat Waktu</strong>
            <span>Booking servis online</span>
          </div>

        </div>


        <div class="quick-info-item">

          <div class="quick-icon">
            <ClipboardDocumentCheckIcon />
          </div>

          <div>
            <strong>Transparan</strong>
            <span>Riwayat servis tersimpan</span>
          </div>

        </div>

      </div>

    </section>


    <!-- ================= LAYANAN ================= -->

    <section
      id="layanan"
      class="section services-section"
    >

      <div class="container">

        <div class="section-heading">

          <span class="section-label">
            LAYANAN KAMI
          </span>

          <h2>
            Semua Kebutuhan Motor
            <span>Dalam Satu Tempat</span>
          </h2>

          <p>
            Kami menyediakan berbagai layanan untuk menjaga
            kendaraan Anda tetap nyaman dan aman digunakan.
          </p>

        </div>


        <div class="services-grid">

          <div class="service-card">

            <div class="service-icon">
              <WrenchScrewdriverIcon />
            </div>

            <h3>Servis Mesin</h3>

            <p>
              Pemeriksaan dan perawatan mesin agar performa
              kendaraan tetap optimal.
            </p>

            <span class="service-link">
              Selengkapnya →
            </span>

          </div>


          <div class="service-card">

            <div class="service-icon">
              <Cog6ToothIcon />
            </div>

            <h3>Perawatan Berkala</h3>

            <p>
              Perawatan rutin untuk menjaga kondisi kendaraan
              tetap prima dan nyaman.
            </p>

            <span class="service-link">
              Selengkapnya →
            </span>

          </div>


          <div class="service-card">

            <div class="service-icon">
              <ClipboardDocumentCheckIcon />
            </div>

            <h3>Ganti Oli</h3>

            <p>
              Penggantian oli berkualitas untuk menjaga
              performa mesin kendaraan.
            </p>

            <span class="service-link">
              Selengkapnya →
            </span>

          </div>


          <div class="service-card">

            <div class="service-icon">
              <ShieldCheckIcon />
            </div>

            <h3>Pemeriksaan Kendaraan</h3>

            <p>
              Pemeriksaan menyeluruh untuk menemukan masalah
              kendaraan lebih awal.
            </p>

            <span class="service-link">
              Selengkapnya →
            </span>

          </div>

        </div>

      </div>

    </section>


    <!-- ================= TENTANG ================= -->

    <section
      id="tentang"
      class="section about-section"
    >

      <div class="container about-grid">

        <div class="about-image">

          <div class="about-image-overlay">

            <strong>10+</strong>

            <span>
              Layanan Perawatan
            </span>

          </div>

        </div>


        <div class="about-content">

          <span class="section-label">
            TENTANG KAMI
          </span>

          <h2>
            Merawat Kendaraan
            <span>Dengan Sepenuh Hati</span>
          </h2>

          <p>
            BengkelKu hadir untuk memberikan pengalaman servis
            kendaraan yang lebih mudah dan transparan melalui
            perpaduan pelayanan bengkel dan teknologi digital.
          </p>

          <div class="about-features">

            <div class="about-feature">

              <ShieldCheckIcon />

              <div>
                <strong>Pelayanan Terpercaya</strong>
                <span>
                  Mengutamakan kualitas pelayanan.
                </span>
              </div>

            </div>


            <div class="about-feature">

              <WrenchScrewdriverIcon />

              <div>
                <strong>Teknisi Berpengalaman</strong>
                <span>
                  Kendaraan ditangani secara profesional.
                </span>
              </div>

            </div>


            <div class="about-feature">

              <ClipboardDocumentCheckIcon />

              <div>
                <strong>Riwayat Tersimpan</strong>
                <span>
                  Data servis kendaraan dapat dipantau.
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>


    <!-- ================= CARA KERJA ================= -->

    <section
      id="cara-kerja"
      class="section process-section"
    >

      <div class="container">

        <div class="section-heading">

          <span class="section-label">
            CARA KERJA
          </span>

          <h2>
            Servis Jadi
            <span>Lebih Sederhana</span>
          </h2>

          <p>
            Hanya beberapa langkah untuk mendapatkan pengalaman
            servis yang lebih praktis.
          </p>

        </div>


        <div class="process-grid">

          <div class="process-item">

            <div class="process-number">
              01
            </div>

            <CalendarDaysIcon />

            <h3>Booking</h3>

            <p>
              Pilih kendaraan dan jadwalkan servis.
            </p>

          </div>


          <div class="process-item">

            <div class="process-number">
              02
            </div>

            <WrenchScrewdriverIcon />

            <h3>Pemeriksaan</h3>

            <p>
              Mekanik melakukan pemeriksaan kendaraan.
            </p>

          </div>


          <div class="process-item">

            <div class="process-number">
              03
            </div>

            <Cog6ToothIcon />

            <h3>Servis</h3>

            <p>
              Kendaraan dikerjakan sesuai kebutuhan.
            </p>

          </div>


          <div class="process-item">

            <div class="process-number">
              04
            </div>

            <ClipboardDocumentCheckIcon />

            <h3>Selesai</h3>

            <p>
              Lihat hasil dan riwayat servis kendaraan.
            </p>

          </div>

        </div>

      </div>

    </section>


    <!-- ================= CTA ================= -->

    <section class="cta-section">

      <div class="container">

        <div class="cta-card">

          <div>

            <span class="cta-label">
              SIAP MERAWAT KENDARAAN?
            </span>

            <h2>
              Jadwalkan Servis
              Kendaraan Anda.
            </h2>

            <p>
              Booking servis dengan mudah melalui platform kami.
            </p>

          </div>

          <RouterLink
            to="/login"
            class="btn-cta"
          >
            Booking Servis
            <ArrowRightIcon />
          </RouterLink>

        </div>

      </div>

    </section>


    <!-- ================= FOOTER ================= -->

    <footer
      id="kontak"
      class="footer"
    >

      <div class="container footer-grid">

        <div class="footer-brand">

          <div class="brand footer-brand-logo">

            <div class="brand-icon">
              <WrenchScrewdriverIcon />
            </div>

            <div>
              <span class="brand-name">
                BengkelKu
              </span>

              <span class="brand-subtitle">
                Motor Service
              </span>
            </div>

          </div>

          <p>
            Solusi servis kendaraan yang mudah,
            transparan, dan terpercaya.
          </p>

        </div>


        <div class="footer-column">

          <h3>Layanan</h3>

          <a href="#layanan">
            Servis Mesin
          </a>

          <a href="#layanan">
            Perawatan Berkala
          </a>

          <a href="#layanan">
            Ganti Oli
          </a>

          <a href="#layanan">
            Pemeriksaan
          </a>

        </div>


        <div class="footer-column">

          <h3>Navigasi</h3>

          <a href="#beranda">
            Beranda
          </a>

          <a href="#tentang">
            Tentang Kami
          </a>

          <a href="#cara-kerja">
            Cara Kerja
          </a>

          <RouterLink to="/login">
            Login
          </RouterLink>

        </div>


        <div class="footer-column">

          <h3>Kontak</h3>

          <div class="contact-item">
            <MapPinIcon />
            <span>Alamat Bengkel</span>
          </div>

          <div class="contact-item">
            <PhoneIcon />
            <span>08xx-xxxx-xxxx</span>
          </div>

        </div>

      </div>


      <div class="footer-bottom">

        <div class="container">

          <p>
            © 2026 BengkelKu. Semua hak dilindungi.
          </p>

        </div>

      </div>

    </footer>

  </div>
</template>