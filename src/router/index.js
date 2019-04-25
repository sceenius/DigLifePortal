import Vue from "vue";
import Router from "vue-router";
import Navbar from "../components/Navbar.vue";
import Holons from "../components/Holons.vue";
import Skills from "../components/Skills.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Navbar",
      component: Navbar
    },
    {
      path: "/:service/:domain",
      name: "Navbar",
      component: Navbar
    },
    {
      path: "/skills/:domain",
      name: "Skills",
      component: Skills
    },
    {
      path: "/:domain",
      name: "Navbar",
      component: Navbar
    }
  ]
});
