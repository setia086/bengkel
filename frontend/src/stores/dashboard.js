import { defineStore } from "pinia";
import api from "../api/axios";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    statistik: {
      totalPelanggan: 0,
      totalKendaraan: 0,
      totalMekanik: 0,
      totalKategoriSparepart: 0,
      totalSparepart: 0,
      totalServis: 0,
      totalPembayaran: 0,
      pendapatan: 0,
    },

    servis: {
      menunggu: 0,
      proses: 0,
      selesai: 0,
    },

    stokMenipis: [],
    servisTerbaru: [],
    pembayaranTerbaru: [],

    loading: false,
    error: null,
  }),

  actions: {
    async loadDashboard() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get("/dashboard");

        console.log("DATA DASHBOARD:", response.data);

        const data = response.data.data;

        this.statistik = data.statistik ?? {
          totalPelanggan: 0,
          totalKendaraan: 0,
          totalMekanik: 0,
          totalKategoriSparepart: 0,
          totalSparepart: 0,
          totalServis: 0,
          totalPembayaran: 0,
          pendapatan: 0,
        };

        this.servis = data.servis ?? {
          menunggu: 0,
          proses: 0,
          selesai: 0,
        };

        this.stokMenipis = data.stokMenipis ?? [];
        this.servisTerbaru = data.servisTerbaru ?? [];
        this.pembayaranTerbaru = data.pembayaranTerbaru ?? [];

      } catch (error) {
        console.error("Gagal mengambil dashboard:", error);

        this.error =
          error.response?.data?.message ||
          "Gagal mengambil data dashboard";
      } finally {
        this.loading = false;
      }
    },
  },
});