<template>
  <div class="page-container md-layout-column">
    <!--
      ----------------------------------------------------------------------
        SNACKBARS  - https://vuematerial.io/components/snackbar
      ----------------------------------------------------------------------
    -->
    <md-snackbar
      :md-duration="4000"
      :md-active.sync="showSnackBar"
      md-persistent
    >
      <span>{{ snack }}</span>
      <md-button class="md-primary" @click="showSnackBar = false;"
        >Dismiss
      </md-button>
    </md-snackbar>

    <md-snackbar
      v-if="profile.diffTime < 30 && Math.random() > 0.5"
      :md-duration="10000"
      :md-active.sync="showProfileReminder"
      md-persistent
    >
      <span>First Time Here?</span>
      <md-button
        class="md-primary"
        @click="
          showProfileReminder = false;
          openNote('https://notepad.diglife.coop/s/B1PgFFi4E');
        "
        >Please read this</md-button
      >
    </md-snackbar>

    <md-snackbar
      v-if="profile.diffTime > 30 && Math.random() > 0.8"
      :md-duration="10000"
      :md-active.sync="showProfileReminder"
      md-persistent
    >
      <span>Have you seen your profile lately?</span>
      <md-button
        class="md-primary"
        @click="
          showProfileReminder = false;
          activeSettings = true;
        "
        >Update it now</md-button
      >
    </md-snackbar>

    <!--
      ----------------------------------------------------------------------
        DIALOG BOXES  - https://vuematerial.io/components/dialog
      ----------------------------------------------------------------------
    -->
    <!--
      ----------------------------------------------------------------------
        DIALOG BOXES - SETTINGS DIALOG
      ----------------------------------------------------------------------
    -->
    <md-dialog :md-active.sync="activeSettings" style="padding: 20px;">
      <md-dialog-title style="padding: 0px; color: #404040 !important;"
        >My Profile</md-dialog-title
      >
      <Tags />
    </md-dialog>

    <!--
      ----------------------------------------------------------------------
        DIALOG BOXES - LOGIN DIALOG
      ----------------------------------------------------------------------
    -->
    <md-dialog
      :md-close-on-esc="false"
      :md-click-outside-to-close="false"
      :md-active.sync="activeUser"
      style="max-width: 400px; max-height: 350px !important;"
    >
      <md-dialog-title style="color: #404040 !important;"
        >Welcome to DigLife!</md-dialog-title
      >
      <div style="padding: 0 25px ;">
        If you are a member of the Digital Life Collective, please use your
        Mattermost username to log into the portal. If you are not a member yet,
        <a href="https://diglife.com/join-us/"><u>join us</u>!</a><br /><br />
        <md-field id="username">
          <label>Username</label>
          <md-input
            v-model="username"
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
            style="background: #00B0A0; color: white;"
            ><md-icon style="color: white;">exit_to_app</md-icon>
            Enter</md-button
          >
        </md-dialog-actions>
      </div>
    </md-dialog>

    <!--
      ----------------------------------------------------------------------
        DIALOG BOXES - INFO  DIALOG
      ----------------------------------------------------------------------
    -->
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

    <!--
      ----------------------------------------------------------------------
        DIALOG BOXES - SUDO DIALOG
      ----------------------------------------------------------------------
    -->
    <md-dialog :md-active.sync="activeAccess" id="access">
      <!-- https://github.com/vuematerial/vue-material/issues/201 -->
      <md-dialog-title>{{
        service.replace(/[!#*@%/."'\\&]/, "")
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
          style="background: #00B0A0; color: white;"
          ><md-icon style="color: white;">lock_open</md-icon> Request
          Access</md-button
        >
      </md-dialog-actions>
    </md-dialog>

    <!--
      ----------------------------------------------------------------------
        DIALOG BOXES - MENU DIALOG
      ----------------------------------------------------------------------
    -->
    <md-dialog
      :md-close-on-esc="false"
      :md-click-outside-to-close="false"
      :md-active.sync="activeMenu"
    >
      <md-dialog-title
        ><md-icon style="color: black;">{{ mode.toLowerCase() }}</md-icon
        >{{ mode }} Menu Entry</md-dialog-title
      >
      <div style="padding: 0 25px ;">
        <md-field id="menutitle">
          <label>Title</label>
          <md-input v-model="menutitle" required></md-input>
          <span class="md-helper-text">Enter the title of this Menu Entry</span>
          <span class="md-error">This field cannot be blank</span>
        </md-field>

        <md-field>
          <label>Icon</label>
          <md-input v-model="menuicon" required></md-input>
          <span class="md-helper-text"
            >Pick an icon
            <a
              href="https://material.io/tools/icons/?style=baseline"
              target="icons"
              >from this list</a
            ></span
          >
          <span class="md-error"></span>
          <md-icon>{{ menuicon }}</md-icon>
        </md-field>

        <md-field id="menulink">
          <label>URL</label>
          <md-input v-model="menulink" required></md-input>
          <span class="md-helper-text">Enter the link of this Menu Entry</span>
          <span class="md-error">This field cannot be blank</span>
        </md-field>

        <md-dialog-actions style="padding: 25px 0;">
          <md-button class="md-success md-raised" @click="activeMenu = false;"
            >Cancel</md-button
          >
          <md-button
            v-if="mode == 'Add'"
            class="md-success md-raised"
            @click="onConfirmAddMenu();"
            style="background: #00B0A0; color: white;"
            >Save</md-button
          >
          <md-button
            v-if="mode == 'Edit'"
            class="md-success md-raised"
            @click="onConfirmDeleteMenu(menuindex);"
            sty
            le="background: #00B0A0; color: white;"
            >Remove</md-button
          >
          <md-button
            v-if="mode == 'Edit'"
            class="md-success md-raised"
            @click="onConfirmEditMenu(menuindex);"
            style="background: #00B0A0; color: white;"
            >Save</md-button
          >
        </md-dialog-actions>
      </div>
    </md-dialog>

    <!--
      ----------------------------------------------------------------------
        TOOLBAR - https://vuematerial.io/components/toolbar/
      ----------------------------------------------------------------------
    -->
    <md-toolbar :class="['md-primary', 'md-toolbar-' + domain]" v-if="profile">
      <md-button class="md-icon-button" @click="showNavigation = true;">
        <md-icon>menu</md-icon>
      </md-button>
      <!-- Show the title and navigation path here -->
      <!-- img src="https://diglife.com/brand/logo_primary.svg" / -->
      <span class="md-title"
        >{{
          !service
            ? domain.toUpperCase()
            : service.replace(/[!#*@%/."'\\&:]/, "")
        }}
      </span>

      <div class="md-toolbar-section-end">
        <md-button
          @click="nav(domain, 'Home');"
          v-bind:style="[
            subdomain == 'Home' ? { color: '#fec019' } : { color: '#fff' }
          ]"
          >Home</md-button
        >
        <md-button
          @click="nav(domain, 'Projects');"
          v-if="domain == 'diglife'"
          v-bind:style="[
            subdomain == 'Projects' ? { color: '#fec019' } : { color: '#fff' }
          ]"
          >proj</md-button
        >
        <md-button
          @click="nav(domain, 'Ops');"
          v-if="domain == 'diglife'"
          v-bind:style="[
            subdomain == 'Ops' ? { color: '#fec019' } : { color: '#fff' }
          ]"
          >ops</md-button
        >
        <md-button
          @click="nav(domain, 'Friends');"
          v-if="domain == 'diglife'"
          v-bind:style="[
            subdomain == 'Friends' ? { color: '#fec019' } : { color: '#fff' }
          ]"
          >friends</md-button
        >

        <md-menu>
          <md-avatar
            style="cursor: pointer; border: 2px solid transparent;"
            md-menu-trigger
            ><img v-bind:src="avatarLink"
          /></md-avatar>

          <md-menu-content class="md-card-menu">
            <md-menu-item @click="onLogout();">
              <md-icon>logout</md-icon>
              <span>Logout</span>
            </md-menu-item>
            <md-menu-item @click="openSettings();">
              <md-icon>person</md-icon>
              <span>Profile</span>
            </md-menu-item>
          </md-menu-content>
        </md-menu>
      </div>
    </md-toolbar>

    <!--
      ----------------------------------------------------------------------
        CONTEXTUAL ACTION BUTTONS
          <md-icon>info_outline</md-icon>
          <md-icon>chat_bubble_outline</md-icon>
          <md-icon>apps</md-icon>
          <md-icon>blur_circular</md-icon>
          <md-icon>folder_shared</md-icon>
      ----------------------------------------------------------------------
    -->
    <div id="actions">
      <md-button
        v-if="service && service.charAt(0) !== ':'"
        title="Open app in new window"
        @click="sub('appLink');"
        class="md-fab md-mini md-plain"
      >
        <md-icon>fullscreen</md-icon>
      </md-button>
      <md-button
        v-if="service && service.charAt(0) !== ':'"
        v-for="(menu, index) in channel.menu"
        :key="index"
        v-bind:title="menu.title"
        @click="sub(menu.link);"
        @contextmenu.prevent="editMenu(menu, index);"
        class="md-fab md-mini md-plain"
      >
        <md-icon>{{ menu.icon }}</md-icon>
      </md-button>

      <md-button
        v-if="service && service.charAt(0) !== ':'"
        title="Add Menu Entry"
        @click="addMenu();"
        class="md-fab md-mini md-plain"
      >
        <md-icon>add</md-icon>
      </md-button>
      <md-button
        v-if="!service || service.charAt(0) === ':'"
        title="Show Holons"
        @click="sub(':Holons');"
        class="md-fab md-mini md-plain"
      >
        <md-icon>blur_circular</md-icon>
      </md-button>
      <md-button
        v-if="!service || service.charAt(0) === ':'"
        title="Show Skills"
        @click="sub(':Skills');"
        class="md-fab md-mini md-plain"
      >
        <md-icon>people_outline</md-icon>
      </md-button>

      <md-button
        v-if="!service || service.charAt(0) === ':'"
        title="Show Conversations"
        @click="sub(':Conversations');"
        class="md-fab md-mini md-plain"
      >
        <md-icon>announcement</md-icon>
      </md-button>
      <md-button
        v-if="!service || service.charAt(0) === ':'"
        title="Show Conversations"
        @click="sub(':Conversations');"
        class="md-fab md-mini md-plain"
      >
        <md-icon>chat</md-icon>
      </md-button>
      <md-button
        v-if="!service || service.charAt(0) === ':'"
        title="Show Calendar"
        @click="sub(':Calendar');"
        class="md-fab md-mini md-plain"
      >
        <md-icon>event</md-icon>
      </md-button>
      <md-button
        v-if="!service || service.charAt(0) === ':'"
        title="Show Meetings"
        @click="sub(':Meetings');"
        class="md-fab md-mini md-plain"
      >
        <md-icon>videocam</md-icon>
      </md-button>
      <md-button
        v-if="!service || service.charAt(0) === ':'"
        title="Show Folders"
        @click="sub(':Folders');"
        class="md-fab md-mini md-plain"
      >
        <md-icon>folder_shared</md-icon>
      </md-button>
      <md-button
        v-if="!service || service.charAt(0) === ':'"
        title="Show Notes"
        @click="sub(':Notes');"
        class="md-fab md-mini md-plain"
      >
        <md-icon>description</md-icon>
      </md-button>
    </div>
    <!--
      ----------------------------------------------------------------------
        DRAWER MENU BAR - https://vuematerial.io/components/drawer
      ----------------------------------------------------------------------
    -->
    <md-drawer :md-active.sync="showNavigation" id="drawer">
      <md-toolbar
        class="md-transparent"
        md-elevation="0"
        :class="['md-primary', 'md-toolbar-' + domain.toLowerCase()]"
      >
        <md-switch
          id="switch"
          class="md-toolbar-section-end"
          title="show only my services"
          v-model="showServices"
          @change="switchService();"
        ></md-switch>
        <span class="md-title" style="color: white;">{{ subdomain }}</span>
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
                (showServices && showGroup(index) && showDomain(index)))
          "
        >
          <md-icon>{{ channel.purpose.icon }}</md-icon>
          <span class="md-list-item-text">{{
            channel.display_name.replace(/[!#*@%/."'\\&]/, "")
          }}</span>

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
            <!--
              tags.filter(
                value => -1 !== channel.purpose.tags.indexOf(value)
              ).length > 0
            -->
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
            <!--
              tags.filter(
                value => -1 !== channel.purpose.tags.indexOf(value)
              ).length === 0
            -->
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
      <img
        v-if="!service && domain == 'diglife'"
        id="logo"
        v-bind:src="logoLink"
      />
      <p v-if="users && !service" class="counter">{{ users.length - 1 }}</p>

      <Particles v-if="!service" />
      <Interests v-if="service == ':Conversations'" :domain="domain" />
      <Notes v-if="service == ':Notes'" :domain="domain" />
      <Meetings v-if="service == ':Meetings'" :domain="domain" />
      <Holons v-if="service == ':Holons'" :domain="domain" />
      <Skills v-if="service == ':Skills'" :domain="domain" />
      <iframe
        name="theApp"
        id="theApp"
        style="width:100%; min-height:95vh; max-height: 95vh; overflow: auto; display: none"
        frameborder="0"
        scrolling="yes"
      ></iframe>
    </md-content>
  </div>
  <!-- END page-container md-layout-column -->
</template>

<script>
import { BASEURL, CHATURL } from "../../index.js";
import Particles from "./Particles.vue";
import Tags from "./Tags.vue";
import Interests from "./Interests.vue";
import Notes from "./Notes.vue";
import Meetings from "./Meetings.vue";
import Holons from "./Holons.vue";
import Skills from "./Skills.vue";
import Slack from "node-slack";

import _ from "lodash/fp/object"; //lodash/fp/object for objects only
import db from "../firebase/init.js";

export default {
  name: "Navbar",
  components: { Particles, Tags, Interests, Notes, Holons, Skills, Meetings },
  data: () => ({
    // form: {
    //   username: null
    // },
    showNavigation: false,
    showSidepanel: false,
    showServices: false,
    showSnackBar: false,
    showProfileReminder: true,
    activeUser: true,
    activeAccess: false,
    activeInfo: false,
    activeSettings: false,
    activeMenu: false,
    domain: "diglife",
    subdomain: "Home",
    service: "",
    username: "",
    snack: "",
    users: [],
    channels: [],
    profile: [],
    groups: [],
    members: [],
    total: "",
    channel: "",
    invalid: true,
    tags: [],
    menus: [],
    mode: "",
    menutitle: "",
    menulink: "",
    menuicon: "",
    menuindex: "",
    foundUser: false
  }),

  ///////////////////////////////////////////////////////////////////////////////
  //  CREATED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  created: function() {
    // domain coming from router
    this.domain = this.$route.params.domain || "diglife";
    //this.domain = domain.toUpperCase(); //charAt(0).toUpperCase() + domain.slice(1);

    console.log("Intializing app..");
    let usersRef = db.database().ref("portal_users");
    let profilesRef = db.database().ref("portal_profiles");

    console.log("Loading users..");
    usersRef.on("child_added", user => {
      let data = user.val();

      let path = data.username.replace(".", "%2E");
      profilesRef.child(path).once("value", profile => {
        let snapshot = profile.val();

        // add  data to users array
        this.users.push(data);
        //console.log(data);

        if (data.username === this.$cookies.get("username")) {
          // calculate days since joined
          data.diffTime = new Date().getTime();
          data.diffTime =
            (data.diffTime - data.create_at) / (1000 * 60 * 60 * 24);

          this.profile = data;
          this.username = this.$cookies.get("username");
          this.activeUser = false;
        }
      });
    });

    console.log("Loading channels..");
    let channelsRef = db.database().ref("portal_channels");
    // porta_extensions contains any channel info not stored in Mattermost
    let extensionsRef = db.database().ref("portal_extensions");
    channelsRef.on("child_added", channel => {
      var data = channel.val();
      if (channel.val().display_name.charAt(0) !== "#") {
        extensionsRef.child(channel.key).once("value", extension => {
          if (extension.exists()) {
            data = _.merge(data, extension.val());
          }
          this.channels.push(data);
          // sort here due to asnyc promise
          this.channels.sort(SortByName);
          //console.log(channel.key, data.name, extension.val());
        });

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

    console.log("Loading groups..");
    if (this.$cookies.get("username")) {
      let groupsRef = db
        .database()
        .ref(
          "portal_profiles/" + this.$cookies.get("username").replace(".", "%2E")
        );
      groupsRef.on("child_added", group => {
        var data = group.val();
        //console.log(data);

        if (group.key === "channels") {
          this.groups = group.val();
          //console.log(this.groups);
        }
      });

      // let prefsRef = db
      //   .database()
      //   .ref("portal_profiles/" + this.$cookies.get("username") + "/prefs");
      // prefsRef.on("child_added", pref => {
      //   if (pref.key === "showServices") {
      //     this.showServices = pref.val();
      //   } else if (pref.key === "service") {
      //     this.service = pref.val();
      //   } else if (pref.key === "link") {
      //     window.open(pref.val(), "theApp");
      //     console.log(pref.val());
      //   }
      // });
      // prefsRef.on("child_changed", pref => {
      //   if (pref.key === "showServices") {
      //     this.showServices = pref.val();
      //   } else if (pref.key === "service") {
      //     this.service = pref.val();
      //   } else if (pref.key === "link") {
      //     window.open(pref.val(), "theApp");
      //   }
      // });
    }

    // update cookies
    this.$cookies.config("365d");
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
        this.subdomain.toLowerCase() +
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
  mounted: function() {},

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
    openNote: function(note) {
      this.service = "Onboarding";
      var element = document.getElementById("theApp");
      element.src = "about:blank";
      element.style.display = "block";
      // window.onload = function() {
      window.open(note, "theApp");
    },
    switchService: function() {
      //this.$cookies.set("showServices", this.showServices);
      db.database()
        .ref(
          "portal_profiles/" +
            this.$cookies.get("username").replace(".", "%2E") +
            "/prefs"
        )
        .update({ showServices: this.showServices });
    },
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
      //console.log("-----",this.channels[index].team, this.domain);
      return this.channels[index].purpose.domain &&
        (this.channels[index].team === this.domain ||
          ["Home", "Projects", "Ops", "Friends"].includes(this.subdomain))
        ? this.channels[index].purpose.domain.includes(this.subdomain)
        : false;
    },
    showGroup: function(index) {
      //check if current group is listed in channel
      return JSON.stringify(this.groups).includes(
        this.channels[index].team + "/" + this.channels[index].name
      );
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
        username: "ledgerbot",
        icon_url: "https://diglife.com/brand/logo_secondary_dark.svg",
        unfurl_links: true,
        link_names: 1
      });
      this.service = "";
      //var element = document.getElementById("particles-js");
      //element.style.display = "block";
      //element = document.getElementById("logo");
      //element.style.display = "block";
      this.snack = "Thank you! Your request has been submitted.";
      this.showSnackBar = true;
    },

    editMenu: function(menu, index) {
      this.menutitle = menu.title;
      this.menulink = menu.link;
      this.menuicon = menu.icon;
      this.menuindex = index;
      this.mode = "Edit";
      this.activeMenu = true;
    },

    addMenu: function() {
      this.menutitle = "";
      this.menulink = "";
      this.menuicon = "";
      this.mode = "Add";
      this.activeMenu = true;
    },

    onConfirmAddMenu: function() {
      this.activeMenu = false;
      //console.log(this.channel.channel_id);
      this.channels.forEach((channel, index, arr) => {
        if (channel.channel_id === this.channel.channel_id) {
          if (arr[index].menu === undefined) {
            arr[index].menu = [];
          }
          // push new menu entry to channels
          arr[index].menu.push({
            title: this.menutitle,
            link: this.menulink,
            icon: this.menuicon
          });
          // write entire menu to Firebase
          db.database()
            .ref("portal_extensions/" + this.channel.channel_id + "/menu")
            .set(arr[index].menu);

          this.snack = "Menu entry successfully added.";
          this.showSnackBar = true;
          window.open(this.menulink, "theApp");
        }
      });
    },

    onConfirmDeleteMenu: function(menuindex) {
      this.activeMenu = false;
      this.channels.forEach((channel, index, arr) => {
        if (channel.channel_id === this.channel.channel_id) {
          arr[index].menu.splice(menuindex, 1);
          // write entire menu to Firebase
          db.database()
            .ref("portal_extensions/" + this.channel.channel_id + "/menu")
            .set(arr[index].menu);
        }
      });
      this.snack = "Menu entry successfully removed.";
      this.showSnackBar = true;
    },

    onConfirmEditMenu: function(menuindex) {
      this.activeMenu = false;
      //console.log(this.channel.channel_id);
      this.channels.forEach((channel, index, arr) => {
        if (channel.channel_id === this.channel.channel_id) {
          // push new menu entry to channels
          arr[index].menu[menuindex] = {
            title: this.menutitle,
            link: this.menulink,
            icon: this.menuicon
          };
          // write entire menu to Firebase
          db.database()
            .ref("portal_extensions/" + this.channel.channel_id + "/menu")
            .update(arr[index].menu);

          this.snack = "Menu entry successfully updated.";
          this.showSnackBar = true;
          window.open(this.menulink, "theApp");
        }
      });
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
        document.getElementById("username").classList.remove("md-invalid");
        this.username = this.username.replace("@", "").toLowerCase();
        // cookies are not stored on mobile devices, new prommpt for every session
        this.$cookies.set("username", this.username);

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

        //update avatar
        this.axios.get(
          BASEURL +
            "webhooks/portal_avatar.php?file=base-diglife-coop.php&username=" +
            this.$cookies.get("username")
        );

        this.axios
          .get(
            BASEURL +
              "webhooks/portal_groups2.php?file=base-diglife-coop.php&username=" +
              this.username
          )
          .then(response => (this.groups = response.data))
          //.then(response => console.log(this.channels))
          .then(response =>
            db
              .database()
              .ref(
                "portal_profiles/" +
                  this.username.replace(".", "%2E") +
                  "/channels"
              )
              // update channels and grouptags for this user
              // note: SET  WILL  overwrite other data of this user profile
              .set(this.groups.channels)
              .ref(
                "portal_profiles/" +
                  this.username.replace(".", "%2E") +
                  "/grouptags"
              )
              .set(this.groups.grouptags)
          )
          .then(
            // load personal channels and tags from group membership
            db
              .database()
              .ref("portal_profiles/" + this.username.replace(".", "%2E"))
              .once("value")
              .then(group => {
                let data = group.val();
                this.groups = data.channels;
                //console.log("This channel:" + this.groups);
                this.tags = data.tags ? data.tags : [];
                //console.log("This tag:" + this.tags[1]);
              })
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

        this.$nextTick(function() {
          this.activeUser = false;
          this.showProfileReminder = true;
        });
        // this forces Vue to recalc all computed props
        //this.$forceUpdate();
      }
    },

    onLogout: function() {
      // Logout
      this.profile = "";
      this.username = "";
      this.$cookies.set("username", "");
      this.activeUser = true;
    },

    nav: function(domain, subdomain) {
      this.domain = domain;
      this.subdomain = subdomain;
      this.showNavigation = true;
      this.service = "";
      var element = document.getElementById("theApp");
      element.style.display = "none";
    },

    sub: function(menu) {
      let element = document.getElementById("theApp");
      let drive = "";
      element.src = "about:blank";
      element.style.display = "none";
      // Open the contextual action button
      switch (menu) {
        case ":Calendar":
          element.src = "about:blank";
          element.style.display = "block";
          this.service = ":Calendar";

          switch (this.subdomain) {
            case "Home":
              drive = "6fkigtu9vcqjtv9bnfd23lvqsk@group.calendar.google.com";
              break;
            case "Projects":
              drive =
                "classroom109491638889680858364@group.calendar.google.com";
              break;
            case "Ops":
              drive = "0627opclgoft1e0o1mql6fk1l8%40group.calendar.google.com";
              break;
            case "Friends":
              drive = "";
              break;
            case "Openlearning":
              drive = "";
              break;
            case "Ecosystem-maps":
              drive = "";
              break;
            default:
              drive = "6fkigtu9vcqjtv9bnfd23lvqsk@group.calendar.google.com";
              break;
          }

          window.open(
            "https://calendar.google.com/calendar/embed?src=" + drive,
            "theApp"
          );

          break;
        case ":Folders":
          element.src = "about:blank";
          element.style.display = "block";
          this.service = ":Folders";
          switch (this.subdomain) {
            case "Home":
              drive = "1pfEKM3g_gUbHosuwzbc-ea29gjwGAmVZ";
              break;
            case "Projects":
              drive = "1m2EkiK57l0kOjaK3oXzBGvoOYxU_7sme";
              break;
            case "Ops":
              drive = "1fZ5-UEJlnD5_N_YGtP0BNckuxP7TvRJR";
              break;
            case "Friends":
              drive = "1e2-z9FTqOMJXUc0JRMAEm7XynpkSRy60";
              break;
            case "Openlearning":
              drive = "";
              break;
            case "Ecosystem-maps":
              drive = "";
              break;
            default:
              drive = "0B_zdMVo5TxZQS0dmYlhXaUJIams";
              break;
          }

          window.open(
            "https://drive.google.com/embeddedfolderview?id=" + drive + "#grid",
            "theApp"
          );

          break;
        case ":Holons":
          this.service = "";
          this.$nextTick(() => {
            this.service = ":Holons";
          });
          break;
        case ":Skills":
          this.service = "";
          this.$nextTick(() => {
            this.service = ":Skills";
          });
          break;
        case ":Notes":
          this.service = "";
          this.$nextTick(() => {
            this.service = ":Notes";
          });
          break;
        case ":Conversations":
          this.service = "";
          this.$nextTick(() => {
            this.service = ":Conversations";
          });
          break;
        case ":Meetings":
          this.service = "";
          this.$nextTick(() => {
            this.service = ":Meetings";
          });
          break;
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
        case "driveLink":
          window.open(
            "https://drive.google.com/embeddedfolderview?id=0Bz4dFOWUcWRqb0dHVTdNT3VZZXc#grid",
            "theApp"
          );
          break;
        default:
          window.open(menu, "theApp");
      }
    },

    openService: function(index) {
      // let prefsRef = db
      //   .database()
      //   .ref("portal_profiles/" + this.username + "/prefs");
      // prefsRef.update({ service: this.channels[index].display_name });
      if (this.channels[index].purpose.link.substring(8, 12) === "chat") {
        this.service = "Mattermost";
      } else {
        this.service = this.channels[index].display_name;
      }
      var element = document.getElementById("theApp");
      // if (
      //   this.service === "Zettelkasten" ||
      //   this.service === "Conversations" ||
      //   this.service === "Help Desk"
      // ) {
      //   element.style.display = "none";
      // } else {
      element.src = "about:blank";
      element.style.display = "block";
      // }

      // Need to change title to Mattermost for all non-service channels
      this.channel = this.channels[index];
      //this.$forceUpdate();
      document.getElementById("drawer").classList.remove("md-active");
      this.showNavigation = false;

      if (
        JSON.stringify(this.groups).includes(
          this.channels[index].team + "/" + this.channels[index].name
        ) ||
        this.channels[index].type === "O"
      ) {
        // window.onload = function() {
        // this.service = this.channels[index].display_name;
        window.open(this.channels[index].purpose.link, "theApp");
        // };
      } else {
        this.activeAccess = true;
      }

      // get all users (members) for channel and show in members tab
      // this.axios
      //   .get(
      //     BASEURL +
      //       "webhooks/portal_members.php?file=base-diglife-coop.php&channel_id=" +
      //       this.channel.id
      //   )
      //   .then(response => (this.members = response.data))

      // hide and show elements on UI
      //var element = document.getElementById("logo");
      //element.style.display = "none";

      //element = document.getElementById("particles-js");
      //element.style.display = "none";

      // open app link or request access dialog
      // .then(response => {});
    }
  }
};
</script>
<style></style>
