import Vue from "vue";
import Router from "vue-router";
import Navbar from "../components/Navbar";
import Holons from "../components/Holons";
import Skills from "../components/Skills";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Navbar",
      component: Navbar
    },
    {
      path: "/holons",
      name: "Holons",
      component: Holons
    },
    {
      path: "/skills",
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
