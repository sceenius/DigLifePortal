import Vue from "vue";
import App from "@/App";
import VueMaterial from "vue-material";
import VueCookies from "vue-cookies";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";
import axios from "axios";
import VueAxios from "vue-axios";
import { BASEURL, CHATURL } from "/constants.js";
import db from "@/firebase/init";
//import Vuex from "vuex";

Vue.config.productionTip = false;
//Vue.config.BASE = "https://diglife.com/webhooks";

Vue.use(VueAxios, axios);
Vue.use(VueCookies);
Vue.use(VueMaterial);
//Vue.use(Vuex);

new Vue({
  el: "#app",
  components: { App },
  template: "<App/>",
  data: () => ({
    users: []
  }),
  created: function() {
    this.axios
      .get(BASEURL + "webhooks/portal_users.php?file=base-diglife-coop.php")
      .then(response => (this.users = response.data))
      .then(response => console.log(this.users))
      .then(response =>
        this.users.forEach(function(user) {
          db.collection("users")
            .doc(user.id)
            .set({
              first_name: user.first_name || "",
              last_name: user.last_name || "",
              username: user.username || "",
              position: user.position || "",
              role: user.role || ""
            });
        })
      );
  }
});
