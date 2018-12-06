<template>
  <div class="page-container md-layout-column">
    <!--
      ----------------------------------------------------------------------
        SNACKBARS  - https://vuematerial.io/components/snackbar
      ----------------------------------------------------------------------
    -->
    <md-snackbar
      :md-duration="4000"
      :md-active.sync="showSnackbar"
      md-persistent
    >
      <span>Thank you! Your request has been submitted.</span>
      <md-button class="md-primary" @click="showSnackbar = false;"
        >Close</md-button
      >
    </md-snackbar>

    <md-snackbar
      :md-duration="6000"
      :md-active.sync="showProfileReminder"
      md-persistent
    >
      <span>Please update your personal profile!</span>
      <md-button class="md-primary" @click="activeSettings = true;"
        >Do now</md-button
      >
    </md-snackbar>

    <!--
      ----------------------------------------------------------------------
        DIALOG BOXES  - https://vuematerial.io/components/dialog
      ----------------------------------------------------------------------
    -->
    <md-dialog :md-active.sync="activeSettings">
      <md-dialog-title>My Settings</md-dialog-title>
      <md-tabs md-dynamic-height>
        <md-tab md-label="Tags">
          <div
            style="margin: 20px 0 0 10px; width: 95%; overflow: auto; height: 55vh !important;"
          >
            <Tags />
          </div>
        </md-tab>
        <md-tab md-label="Groups">
          <md-list
            style="margin: 20px 0 0 10px; width: 90%; overflow: auto; height: 55vh !important;"
          >
            <md-list-item v-for="(group, index) in groups" :key="index">
              <span class="md-list-item-text">{{ group }}</span>
              <md-button
                @click="directMessage(index);"
                class="md-icon-button md-list-action"
              >
                <!-- Create a direct message channel -->
                <md-icon class="md-primary">chat_bubble</md-icon>
              </md-button>
            </md-list-item>
          </md-list>
        </md-tab>
      </md-tabs>
    </md-dialog>

    <md-dialog
      :md-close-on-esc="false"
      :md-click-outside-to-close="false"
      :md-active.sync="activeUser"
    >
      <md-dialog-title>Welcome to DigLife!</md-dialog-title>
      <div style="padding: 0 25px ;">
        If you are a member of the Digital Life Collective, please use your
        Mattermost username to log into the portal. If you are not a member yet,
        <a href="https://diglife.com/join-us/"><u>join us</u>!</a><br /><br />
        <md-field id="username">
          <label>Username</label>
          <md-input
            v-model.lazy="username"
            @keyup.prevent.esc="onConfirm();"
            @keyup.enter="onConfirm();"
            required
          ></md-input>
          <span class="md-helper-text">Enter your Mattermost username</span>
          <span class="md-error">The username does not exist</span>
          <md-icon>person</md-icon>
        </md-field>
        <md-dialog-actions style="padding: 25px 0;">
          <md-button
            class="md-success md-raised"
            @click="onConfirm();"
            style="background: #00b0a0; color: white;"
            ><md-icon style="color: white;">exit_to_app</md-icon>
            Enter</md-button
          >
        </md-dialog-actions>
      </div>
    </md-dialog>

    <md-dialog :md-active.sync="activeInfo" id="info">
      <!-- https://github.com/vuematerial/vue-material/issues/201 -->
      <md-dialog-title>{{ service }}</md-dialog-title>
      <md-tabs md-dynamic-height>
        <md-tab md-label="About This Service">
          <p>{{ channel.header }}</p>
        </md-tab>
        <md-tab md-label="Team Members">
          <md-list
            style="margin: 50px; overflow: auto; height: 55vh !important;"
          >
            <md-list-item v-for="(member, index) in members" :key="member.id">
              <md-avatar
                ><img
                  style="top:0; left: 0; width: 60px; height: 50px;"
                  v-bind:src="avatarLink2(index)"
              /></md-avatar>
              <span class="md-list-item-text"
                >{{ member.first_name }} {{ member.last_name }} ({{
                  member.username
                }})</span
              >
              <md-button
                @click="directMessage(member.id);"
                class="md-icon-button md-list-action"
              >
                <!-- Create a direct message channel -->
                <md-icon class="md-primary">chat_bubble</md-icon>
              </md-button>
            </md-list-item>
          </md-list>
        </md-tab>
      </md-tabs>
      <md-dialog-actions style="padding: 25px">
        <md-button class="" @click="cancelAccess();">Close</md-button>
      </md-dialog-actions>
    </md-dialog>

    <md-dialog :md-active.sync="activeAccess" id="access">
      <!-- https://github.com/vuematerial/vue-material/issues/201 -->
      <md-dialog-title>{{
        service.replace(/[!#*@%/.><"'\\&]/, "")
      }}</md-dialog-title>
      <md-tabs md-dynamic-height>
        <md-tab md-label="About This Service">
          <p>{{ channel.header }}</p>
          <p v-if="channel.purpose">{{ channel.purpose.tags }}</p>
        </md-tab>
        <md-tab md-label="Team Members">
          <md-list
            style="margin: 50px; overflow: auto; height: 55vh !important;"
          >
            <md-list-item v-for="(member, index) in members" :key="member.id">
              <md-avatar
                ><img
                  style="top:0; left: 0; width: 50px; height: 50px;"
                  v-bind:src="avatarLink2(index)"
              /></md-avatar>
              <span class="md-list-item-text"
                >{{ member.first_name }} {{ member.last_name }} ({{
                  member.username
                }})</span
              >
              <md-button
                @click="directMessage(member.id);"
                class="md-icon-button md-list-action"
              >
                <!-- Create a direct message channel -->
                <md-icon class="md-primary">chat_bubble</md-icon>
              </md-button>
            </md-list-item>
          </md-list>
        </md-tab>
      </md-tabs>
      <md-dialog-actions style="padding: 25px">
        <md-button class="" @click="cancelAccess();">Cancel</md-button>
        <md-button
          class="md-success md-raised"
          @click="requestAccess();"
          style="background: #00b0a0; color: white;"
          ><md-icon style="color: white;">lock_open</md-icon> Request
          Access</md-button
        >
      </md-dialog-actions>
    </md-dialog>

    <!--
      ----------------------------------------------------------------------
        TOOLBAR - https://vuematerial.io/components/toolbar/
      ----------------------------------------------------------------------
    -->
    <md-toolbar class="md-primary">
      <md-button class="md-icon-button" @click="showNavigation = true;">
        <md-icon>menu</md-icon>
      </md-button>
      <!-- Show the title and navigation path here -->
      <!-- img src="https://diglife.com/brand/logo_primary.svg" / -->
      <span class="md-title"
        >{{ service ? "" : "DigLife" }} {{ service ? "" : selected }}
        {{ service.replace(/[!#*@%/.><"'\\&]/, "") }}</span
      >

      <div class="md-toolbar-section-end">
        <md-button
          @click="nav('Home');"
          v-bind:style="[
            selected == 'Home' ? { color: '#fec019' } : { color: '#fff' }
          ]"
          >Home</md-button
        >
        <md-button
          @click="nav('Projects');"
          v-bind:style="[
            selected == 'Projects' ? { color: '#fec019' } : { color: '#fff' }
          ]"
          >projects</md-button
        >
        <md-button
          @click="nav('Operations');"
          v-bind:style="[
            selected == 'Operations' ? { color: '#fec019' } : { color: '#fff' }
          ]"
          >ops</md-button
        >
        <md-button
          @click="nav('Friends');"
          v-bind:style="[
            selected == 'Friends' ? { color: '#fec019' } : { color: '#fff' }
          ]"
          >friends</md-button
        >
      </div>
    </md-toolbar>

    <!--
      ----------------------------------------------------------------------
        CONTEXTUAL ACTION BUTTONS
      ----------------------------------------------------------------------
    -->
    <div v-if="service && service != 'Interest Groups'" id="actions">
      <md-button
        title="Learn more"
        @click="sub('infoLink');"
        class="md-fab md-mini md-plain"
      >
        <md-icon>info_outline</md-icon>
      </md-button>
      <md-button
        title="Open support group"
        @click="sub('chatLink');"
        class="md-fab md-mini md-plain"
      >
        <md-icon>chat_bubble_outline</md-icon>
      </md-button>
      <md-button
        title="Open app in new window"
        @click="sub('appLink');"
        class="md-fab md-mini md-plain"
      >
        <md-icon>fullscreen</md-icon>
      </md-button>
      <md-button
        title="Social Ledger Social Objects"
        @click="sub('dashboardLink');"
        class="md-fab md-mini md-plain"
      >
        <md-icon>apps</md-icon>
      </md-button>
      <md-button
        title="Social Ledger Holonic Chart"
        @click="sub('mapLink');"
        class="md-fab md-mini md-plain"
      >
        <md-icon>blur_circular</md-icon>
      </md-button>
    </div>

    <!--
      ----------------------------------------------------------------------
        DRAWER MENU BAR - https://vuematerial.io/components/drawer
      ----------------------------------------------------------------------
    -->
    <md-drawer :md-active.sync="showNavigation" id="drawer">
      <md-toolbar class="md-transparent" md-elevation="0">
        <md-switch
          id="switch"
          class="md-toolbar-section-end"
          title="show only my services"
          v-model="showServices"
        ></md-switch>
        <span class="md-title" style="color: white;">{{ selected }}</span>
      </md-toolbar>

      <!--
        ----------------------------------------------------------------------
          LIST - https://vuematerial.io/components/list/
        ----------------------------------------------------------------------
      -->
      <md-list>
        <md-list-item v-if="username">
          <md-avatar> <img v-bind:src="avatarLink" /> </md-avatar>
          <div v-if="profile" class="md-list-item-text">
            <p style="font-weight: bold; font-size: 1.4em">
              {{ profile.first_name }} {{ profile.last_name }}
            </p>
            <p style="color: #aaa;">{{ profile.position }}</p>
          </div>
          <md-button
            title="Open Settings"
            @click="openSettings();"
            class="md-icon-button md-list-action"
          >
            <!-- Create a direct message channel -->
            <md-icon>settings</md-icon>
          </md-button>
        </md-list-item>

        <md-divider style="margin-bottom: 10px;" class="md-inset"></md-divider>
        <!-- new condition: joining domain via domain sudo group -->
        <md-list-item
          v-for="(channel, index) in channels"
          :key="channel.id"
          @click="openService(index);"
          v-if="
            groups &&
              ((!showServices && showDomain(index)) ||
                service === 'Interest Groups' ||
                (showServices &&
                  JSON.stringify(groups).includes(
                    channel.team + '/' + channel.name
                  ) &&
                  showDomain(index)))
          "
        >
          <md-icon>{{ channel.purpose.icon }}</md-icon>
          <span class="md-list-item-text">{{
            channel.display_name.replace(/[!#*@%/.><"'\\&]/, "")
          }}</span>
          <!--
            check the channel membership of the current user OR public channel
          -->
          <!-- need to fix a case if there is a partial string match -->
          <!--
            groups is a promise that comes in later, hence part of the condition
          -->
          <md-icon
            title="You are a verified member of this group"
            style="color: green;"
            v-if="
              groups &&
                channel.type !== 'O' &&
                JSON.stringify(groups).includes(
                  channel.team + '/' + channel.name
                )
            "
            >verified_user
          </md-icon>
          <md-icon
            title="We suggest to join based on your profile"
            style="color: orange;"
            v-if="
              groups &&
                channel.purpose.tags &&
                channel.type !== 'O' &&
                !JSON.stringify(groups).includes(
                  channel.team + '/' + channel.name
                ) &&
                ((channel.purpose.tags &&
                  tags.indexOf(channel.purpose.tags[0]) > -1) ||
                  tags.indexOf(channel.purpose.tags[1]) > -1 ||
                  tags.indexOf(channel.purpose.tags[2]) > -1 ||
                  tags.indexOf(channel.purpose.tags[3]) > -1 ||
                  tags.indexOf(channel.purpose.tags[4]) > -1)
            "
            >verified_user
          </md-icon>
          <md-icon
            title="You are not a member of this group"
            style="color: lightgray;"
            v-if="
              groups &&
                !JSON.stringify(groups).includes(
                  channel.team + '/' + channel.name
                ) &&
                channel.type !== 'O' &&
                (!channel.purpose.tags ||
                  (tags.indexOf(channel.purpose.tags[0]) == -1 &&
                    tags.indexOf(channel.purpose.tags[1]) == -1 &&
                    tags.indexOf(channel.purpose.tags[2]) == -1 &&
                    tags.indexOf(channel.purpose.tags[3]) == -1 &&
                    tags.indexOf(channel.purpose.tags[4]) == -1))
            "
            >verified_user
          </md-icon>
        </md-list-item>
      </md-list>
    </md-drawer>

    <!--
      ----------------------------------------------------------------------
        PAGE CONTENT
      ----------------------------------------------------------------------
    -->
    <md-content class="md-scrollbar">
      <p id="welcome" v-if="profile && service == ''">
        Welcome, <a @click="onReopen();">{{ username }}</a>
      </p>
      <img v-if="!service" id="logo" v-bind:src="logoLink" />
      <p v-if="users && !service" class="counter">{{ users.length - 1 }}</p>
      <Particles v-if="!service" />

      <Cards v-if="service == 'Interest Groups'" />

      <iframe
        name="theApp"
        id="theApp"
        style="display: none; width:100%; min-height:95vh; max-height: 95vh; overflow: auto;"
        frameborder="0"
        scrolling="yes"
      ></iframe>
    </md-content>
  </div>
  <!-- END page-container md-layout-column -->
</template>

<script>
import { BASEURL, CHATURL } from "/constants.js";
import Particles from "@/components/Particles";
import Tags from "@/components/Tags";
import Cards from "@/components/Cards";
import Slack from "node-slack";
import db from "@/firebase/init";

export default {
  name: "Navbar",
  components: { Particles, Tags, Cards },
  data: () => ({
    form: {
      username: null
    },
    showNavigation: false,
    showSidepanel: false,
    showServices: false,
    showSnackbar: false,
    showProfileReminder: false,
    activeUser: true,
    activeAccess: false,
    activeInfo: false,
    activeSettings: false,
    selected: "Home",
    service: "",
    username: "",
    users: [],
    channels: [],
    profile: false,
    groups: [],
    members: "",
    total: "",
    channel: "",
    invalid: true,
    tags: []
  }),

  ///////////////////////////////////////////////////////////////////////////////
  //  CREATED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  created: function() {
    let usersRef = db.database().ref("portal_users");
    usersRef.on("child_added", user => {
      //snapshot.forEach(user => {
      this.users.push(user.val());
      if (user.val().username === this.$cookies.get("username")) {
        this.profile = user.val();
        this.username = this.$cookies.get("username");
        this.activeUser = false;
        console.log("This user: ", user.val());
      }
      //});
    });

    let channelsRef = db.database().ref("portal_channels");
    channelsRef.on("child_added", channel => {
      if (channel.val().display_name.charAt(0) !== "#") {
        var data = channel.val();
        //Purpose is a JSON string that needs to be converted to an object
        // if (data.purpose !== "") {
        //   data.purpose = JSON.parse(data.purpose);
        // }
        this.channels.push(data);
        this.channels.sort(SortByName);
        //console.log("This channel: ", this.channels);
      }
    });

    function SortByName(x, y) {
      return x.display_name === y.display_name
        ? 0
        : x.display_name > y.display_name
        ? 1
        : -1;
    }

    if (this.$cookies.get("username")) {
      let groupsRef = db
        .database()
        .ref("portal_profiles/" + this.$cookies.get("username"));
      groupsRef.on("child_added", group => {
        var data = group.val();
        if (group.key === "channels") {
          this.groups = group.val();
        }
        //console.log("New Groups: "+group.key, this.groups);
      });
    }
  },

  ///////////////////////////////////////////////////////////////////////////////
  //  COMPUTED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  computed: {
    // compute v-bind:src for img
    avatarLink: function() {
      return (
        BASEURL + "images/avatars/avatar_" + this.profile.username + ".png"
      );
    },
    // compute v-bind:src for im54321`
    logoLink: function() {
      return (
        BASEURL +
        "images/brand/logo_secondary_" +
        this.selected.toLowerCase() +
        ".svg"
      );
    },
    //https://lodash.com/
    // orderedUsers: function() {
    //   return _.orderBy(this.channel, "display_name");
    // },
    invalidate: function() {
      return this.invalid === true ? "md-invalid" : "";
    }
  },

  ///////////////////////////////////////////////////////////////////////////////
  //  MOUNTED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  mounted: function() {
    this.$cookies.config("365d");
    // Cookies are strings, so need to convert to boolean!
    // need to find a place to save cookie (e.g. My Settings)
    this.showServices = this.$cookies.get("showServices");
    if (this.showServices === "true") {
      this.showServices = true;
    } else {
      this.showServices = false;
    }
    //this.$forceUpdate();
  },

  ///////////////////////////////////////////////////////////////////////////////
  //  BEFORE DESTROY - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  beforeDestroy: function() {
    //this.$cookies.set("showServices", this.showServices); not working
    //console.log(this.showServices);
  },

  ///////////////////////////////////////////////////////////////////////////////
  //  METHODS - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  methods: {
    avatarLink2: function(index) {
      return (
        BASEURL +
        "images/avatars/avatar_" +
        this.members[index].username +
        ".png"
      );
    },

    showDomain: function(index) {
      //check if current domain is listed in channel
      return this.channels[index].purpose.domain
        ? this.channels[index].purpose.domain.includes(this.selected)
        : false;
    },

    directMessage: function(member_id) {
      // create new direct message channel, if none exists
      this.axios
        .get(
          BASEURL +
            "webhooks/portal_direct_message.php?file=base-diglife-coop.php&user_id=" +
            this.profile.id +
            "&member_id=" +
            member_id
        )
        .then(response => (this.directUser = response.data))
        .then(response =>
          window.open(
            CHATURL + "/the-collective/channels/" + this.directUser.name,
            "theApp"
          )
        );
      this.activeAccess = false;
      this.showNavigation = false;
      document.getElementsByClassName("md-overlay")[0].style.display = "none";
    },

    cancelAccess: function() {
      this.activeAccess = false;
      this.activeInfo = false;
      this.service = "";
      //var element = document.getElementById("particles-js");
      //element.style.display = "block";
      //element = document.getElementById("logo");
      //element.style.display = "block";
    },

    openSettings: function() {
      document.getElementById("drawer").classList.remove("md-active");
      this.showNavigation = false;
      this.activeSettings = true;
    },

    requestAccess: function() {
      this.activeAccess = false;

      var slack = new Slack(CHATURL + "hooks/" + this.channel.purpose.hook);
      var err = slack.send({
        text:
          "##### :closed_lock_with_key: Request for Access\n@" +
          this.username +
          " is requesting sudo access to the [" +
          this.service +
          " Service](" +
          this.channel.purpose.link +
          ")",
        channel: this.channel.name,
        username: "Access Bot",
        icon_url: "https://diglife.com/brand/logo_secondary_dark.svg",
        unfurl_links: true,
        link_names: 1
      });
      this.service = "";
      //var element = document.getElementById("particles-js");
      //element.style.display = "block";
      //element = document.getElementById("logo");
      //element.style.display = "block";
      this.showSnackbar = true;
    },

    onSettingsConfirm: function() {
      this.activeSettings = false;
      this.$cookies.set("showServices", this.showServices); // not working
    },

    onConfirm: function() {
      if (
        !this.username ||
        !JSON.stringify(this.users).includes(
          '"username":"' + this.username.toLowerCase() + '"'
        )
      ) {
        this.activeUser = true;
        document.getElementById("username").classList.add("md-invalid");
      } else {
        this.activeUser = false;
        document.getElementById("username").classList.remove("md-invalid");
        this.username = this.username.replace("@", "").toLowerCase();
        // cookies are not stored on mobile devices, new prommpt for every session
        this.$cookies.set("username", this.username);

        // load personal channels and tags from group membership
        let groupsRef = db.database().ref("portal_profiles/" + this.username);
        groupsRef.once("value").then(group => {
          this.groups = group.val().channels;
          //console.log("This channel:" + this.groups);
          this.tags = group.val().tags;
          //console.log("This tag:" + this.tags[1]);
        });

        // load personal profile from users
        this.profile = this.users.find(item => {
          return item.username === this.username;
        });

        // // update groups and profile for newly logged in user (no cookie set)
        // this.axios
        //   .get(
        //     BASEURL +
        //       "webhooks/portal_profiles2.php?file=base-diglife-coop.php&username=" +
        //       this.username
        //   )
        //   .then(response => (this.groups = response.data))
        //   .then(
        //     response =>
        //       (this.profile = this.users.find(item => {
        //         return item.username === this.username;
        //       }))
        //   );

        // update theme for user
        this.axios.get(
          BASEURL +
            "webhooks/portal_prefs.php?file=base-diglife-coop.php&username=" +
            this.username
        );

        // // UPDATE FROM FIREBASE HERE FOR FIRST ENTRY
        // db.firestore()
        //   .collection("members")
        //   .doc(this.username)
        //   .get()
        //   .then(doc => {
        //     if (doc.exists) {
        //       this.tags = doc.data().tags;
        //       // hell of a map reduce function to flatten JSON
        //       this.tags = this.tags.reduce((accumulator, currentValue) => {
        //         return [...accumulator, currentValue.text];
        //       });
        //     } else {
        //       // doc.data() will be undefined in this case
        //       console.log("No document for user " + this.username + "!");
        //     }
        //   })
        //   .catch(function(error) {
        //     console.log("Error getting document:", error);
        //   });

        this.showProfileReminder = true;
        // this forces Vue to recalc all computed props
        //this.$forceUpdate();
      }
    },

    onReopen: function() {
      // Open dialoug box again to change name
      this.activeUser = true;
    },

    nav: function(menu) {
      this.selected = menu;
      this.showNavigation = true;
      this.service = "";
      var element = document.getElementById("theApp");
      element.style.display = "none";
      //element = document.getElementById("particles-js");
      //element.style.display = "block";
      //element = document.getElementById("logo");
      //element.style.display = "block";
    },

    sub: function(menu) {
      // Open the contextual action button
      switch (menu) {
        case "infoLink":
          // Open dialoug to request access
          this.activeInfo = true;
          break;
        case "appLink":
          window.open(this.channel.purpose.link, "_blank");
          break;
        case "dashboardLink":
          window.open(
            BASEURL +
              "webhooks/portal_dashboard.php?user=" +
              this.username +
              "&username=" +
              this.username +
              "&team=" +
              this.channel.team +
              "&channel=" +
              this.channel.name +
              "&database=tokens&scope=none&search=",
            "theApp"
          );
          break;
        case "chatLink":
          window.open(
            CHATURL + this.channel.team + "/channels/" + this.channel.name,
            "theApp"
          );
          break;
        case "mapLink":
          alert(
            BASEURL +
              "webhooks/portal_circle.php?command=view&team=" +
              this.channel.team +
              "&channel=" +
              this.channel.name +
              "&user=" +
              this.username +
              "&username=" +
              this.username
          );
          window.open(
            BASEURL +
              "webhooks/portal_circle.php?command=view&team=" +
              this.channel.team +
              "&channel=" +
              this.channel.name +
              "&user=" +
              this.username +
              "&username=" +
              this.username,
            "theApp"
          );
          break;
        default:
      }
    },

    openService: function(index) {
      document.getElementById("drawer").classList.remove("md-active");
      this.showNavigation = false;
      this.service = this.channels[index].display_name;
      this.channel = this.channels[index];

      // get all users (members) for channel and show in members tab
      this.axios
        .get(
          BASEURL +
            "webhooks/portal_members.php?file=base-diglife-coop.php&channel_id=" +
            this.channel.id
        )
        .then(response => (this.members = response.data));

      // hide and show elements on UI
      //var element = document.getElementById("logo");
      //element.style.display = "none";

      //element = document.getElementById("particles-js");
      //element.style.display = "none";

      var element = document.getElementById("theApp");
      element.style.display = "block";

      // open app link or request access dialog
      if (
        JSON.stringify(this.groups).includes(this.channels[index].name) ||
        this.channels[index].type === "O"
      ) {
        // Access has been granted
        window.open(this.channels[index].purpose.link, "theApp");
      } else {
        // Open dialog to request access
        this.activeAccess = true;
      }
    }
  }
};
</script>

<style>
.md-con tent ifra me {
  min-width: 100vh;
  max-width: 100vh;
  height: 90vh;
  min-height: 100vh;
  max-height: 100vh;
  padding: 0px;
  overflow: auto;
  display: inline-block;
}
#welcome {
  color: #aaa;
  text-align: right;
  margin: 10px;
  position: absolute;
  right: 5px;
}
#logo {
  position: absolute;
  top: 55%;
  left: 50%;
  width: 450px;
  height: 450px;
  margin-top: -225px; /* Half the height */
  margin-left: -225px; /* Half the width */
}

@media only screen and (max-width: 600px) {
  #logo {
    width: 250px;
    height: 250px;
    margin-top: -125px; /* Half the height */
    margin-left: -125px; /* Half the width */
  }
  iframe {
    min-height: 85vh !important;
    max-height: 85vh !important;
  }
}

#actions {
  position: absolute;
  width: 40px;
  right: 20px;
  bottom: 40%;
}
#actions .md-button {
  margin-left: 0;
}
.md-title {
  font-size: 24px !important;
  margin-left: 0px !important;
  color: #white !important;
  font-weight: bold !important;
}
.md-toolbar {
  background-color: #00b0a0 !important;
}

.md-tabs-container {
  height: 100% !important;
  padding: 10px !important;
}

.md-tab p {
  font-size: 1.2em;
  padding: 30px 0 0 10px;
}

.md-toolbar img {
  height: 55px !important;
}

.md-switch {
  margin: 0px 5px;
}

.md-checked .md-switch-container {
  background-color: #6dcec5 !important; /* not selected switch color */
}

.md-checked .md-switch-thumb {
  background-color: #fff !important; /* 00E4CF */
}

.md-switch-thumb {
  background-color: #6dcec5 !important; /* 00E4CF */
}

.md-fab {
  background-color: #fec019 !important;
}

#actions .md-icon {
  color: #404040 !important;
}

.md-icon {
  display: inline;
}
.page-container {
  min-height: 100vh;
  max-height: 100vh;

  overflow: hidden;
  position: relative;
  border: 1px solid rgba(#000, 0.12);
}

.md-content {
  min-height: 100vh;
  max-height: 100vh;
  padding: 0px;
  overflow: auto;
}

.md-content img #logo {
  position: absolute;
  top: 10%;
  left: 3%;
  width: 60vh;
  height: 60vh;
}

.counter {
  position: absolute;
  bottom: 0px;
  right: 30px;
  font-size: 5em;
  color: #ddd;
}
</style>
