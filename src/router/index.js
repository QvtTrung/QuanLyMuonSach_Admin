import { createWebHistory, createRouter } from "vue-router";
import LibraryPage from "@/pages/LibraryPage.vue";
import AuthPage from "@/pages/AuthPage.vue";
const routes = [
    {
        path: "/home",
        name: "librarypage",
        component: LibraryPage,
    },
    {
        path: "/",
        name: "authpage",
        component: AuthPage,
    },
    {
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: () => import("@/pages/404Page.vue"),
    },    
];
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});
export default router;