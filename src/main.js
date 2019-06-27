import Vue from "vue";
import App from "./App.vue";
import VueMaterial from "vue-material";
import VueCookies from "vue-cookies";
import VueAddToCalendar from "vue-add-to-calendar";
//import Hypothesis from "hypothesis";
//import SequentialEntrance from "vue-sequential-entrance";
//import "vue-sequential-entrance/vue-sequential-entrance.css";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";
import "./assets/styles/cards.css";
//import "./assets/styles/navbar.css";
import "./assets/styles/particles.css";
import "./assets/styles/tags.css";
import "./assets/styles/notes.css";
//import Slack from "node-slack";
import axios from "axios";
import VueAxios from "vue-axios";
//import { BASEURL, CHATURL } from "./src/constants.js";
import db from "./firebase/init";
import router from "./router";

export const BASEURL = "https://ledger.diglife.coop/";
export const CHATURL = "https://chat.diglife.coop/";
export const NOTEURL = "https://notepad.diglife.coop/";

Vue.config.productionTip = false;
//Vue.config.BASE = "https://diglife.com/webhooks";

Vue.use(VueAxios, axios);
Vue.use(VueCookies);
Vue.use(VueMaterial);
Vue.use(VueAddToCalendar);
//Vue.use(Hypothesis);
//Vue.use(SequentialEntrance);

//Vue.use(Vuex);

new Vue({
  render: h => h(App),
  router,
  components: { App },
  template: "<App/>",
  data: () => ({
    users: [],
    channels: [],
    meetings: [],
    groups: ""
  }),
  created: function() {
    // this.axios
    //   .get(BASEURL + "webhooks/portal_meetings.php?file=base-diglife-coop.php")
    //   .then(response => (this.meetings = response.data.meetings))
    //   //.then(response => console.log(this.users))
    //   .then(response =>
    //     db
    //       .database()
    //       .ref("portal_meetings")
    //       .update(this.meetings)
    //   );

    this.axios
      .get(BASEURL + "webhooks/portal_users2.php?file=base-diglife-coop.php")
      .then(response => (this.users = response.data))
      //.then(response => console.log(this.users))
      .then(response =>
        db
          .database()
          .ref("portal_users")
          .update(this.users)
      );

    // note that archived channels are not removed from Firebase and need to be purged from time to time
    // also note that special characters might corrupt the reutrning json file, so FB won't update
    this.axios
      .get(
        BASEURL +
          "webhooks/portal_channels2.php?file=base-diglife-coop.php&username=ledgerbot"
      )
      .then(response => (this.channels = response.data))
      //.then(response => console.log(this.channels))
      // note: if channels are NOT loading, we have a problem with the JSON file
      // copy the file from above link and see where the issue is (e.g. purpose)
      .then(response =>
        db
          .database()
          .ref("portal_channels")
          .update(this.channels)
      );

    if (this.$cookies.get("username")) {
      this.axios
        .get(
          BASEURL +
            "webhooks/portal_groups2.php?file=base-diglife-coop.php&username=" +
            this.$cookies.get("username")
        )
        .then(response => (this.groups = response.data))
        .then(response => console.log(this.groups))
        .then(response =>
          db
            .database()
            .ref(
              "portal_profiles/" +
                this.$cookies.get("username").replace(".", "%2E")
            )
            .update(this.groups)
        );

      this.axios.get(
        BASEURL +
          "webhooks/portal_avatar.php?file=base-diglife-coop.php&username=" +
          this.$cookies.get("username")
      );
    }

    this.axios
      .get(
        BASEURL +
          "webhooks/portal_groups2.php?file=base-diglife-coop.php&username=ledgerbot"
      )
      .then(response => (this.groups = response.data))
      //.then(response => console.log(this.groups))
      .then(response =>
        db
          .database()
          .ref("portal_profiles/ledgerbot")
          .update(this.groups)
      );
  }
}).$mount("#app");
