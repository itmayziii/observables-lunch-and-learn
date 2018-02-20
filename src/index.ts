import { Router } from "./router";
import { Nav } from "./nav";

document.addEventListener("DOMContentLoaded", function (event) {
    const router = new Router();
    router.initialize();
    const nav = new Nav(router).initialize();
});