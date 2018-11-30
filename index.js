import Vue from "vue";
import App from "@/App";
import VueMaterial from "vue-material";
import VueCookies from "vue-cookies";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";
import axios from "axios";
import VueAxios from "vue-axios"; 

Vue.config.productionTip = false;
//Vue.config.BASE = "https://diglife.com/webhooks";

Vue.use(VueAxios, axios);
Vue.use(VueCookies);
Vue.use(VueMaterial);

new Vue({
  el: "#app",
  components: { App },
  template: "<App/>"
});
