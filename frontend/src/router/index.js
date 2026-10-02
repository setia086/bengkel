import { createRouter, createWebHistory } from "vue-router";

import AdminLayout from "../layouts/adminlayout.vue";
import UserLayout from "../layouts/UserLayout.vue";
import UserDashboard from "../views/UserDashboard.vue";
import UserPortal from "../views/UserPortal.vue";
import Login from "../views/login.vue";
import Register from "../views/register.vue";
import LandingPage from "../views/landingPage.vue";
import Dashboard from "../views/dashboard.vue";
import Pelanggan from "../views/pelanggan.vue";
import Kendaraan from "../views/kendaraan.vue";
import Mekanik from "../views/mekanik.vue";
import KategoriSparepart from "../views/kategoriSparepart.vue";
import Sparepart from "../views/sparepart.vue";
import Servis from "../views/servis.vue";
import ServisDetail from "../views/servisDetail.vue";
import Pembayaran from "../views/pembayaran.vue";
import Laporan from "../views/laporan.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "landing",
      component: LandingPage,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
    {
      path: "/",
      component: AdminLayout,
      children: [
        { path: "", redirect: "/dashboard" },
        { path: "dashboard", name: "dashboard", component: Dashboard },
        { path: "pelanggan", name: "pelanggan", component: Pelanggan },
        { path: "kendaraan", name: "kendaraan", component: Kendaraan },
        { path: "mekanik", name: "mekanik", component: Mekanik },
        {
          path: "kategoriSparepart",
          name: "kategoriSparepart",
          component: KategoriSparepart,
        },
        { path: "sparepart", 
          name: "sparepart", 
          component: Sparepart },

        { path: "servis", 
          name: "servis", 
          component: Servis },

        { path: "servis/:id", 
          name: "servis-detail", 
          component: ServisDetail, 
          props: true },

          {
          path: "pembayaran",
          name: "pembayaran",
          component: Pembayaran,
        },
        {
          path: "laporan",
          name: "laporan",
          component: Laporan,
        },
      ],
    },
    {
      path: "/user",
      component: UserLayout,
      children: [
        {
          path: "dashboard",
          name: "user-dashboard",
          component: UserDashboard,
        },
        { path: "vehicles", name: "user-vehicles", component: UserPortal, props: { section: "vehicles" } },
        { path: "booking", name: "user-booking", component: UserPortal, props: { section: "booking" } },
        { path: "services", name: "user-services", component: UserPortal, props: { section: "services" } },
        { path: "payments", name: "user-payments", component: UserPortal, props: { section: "payments" } },
        { path: "history", name: "user-history", component: UserPortal, props: { section: "history" } },
        { path: "profile", name: "user-profile", component: UserPortal, props: { section: "profile" } },
      ],
    },
  ],
});

export default router;