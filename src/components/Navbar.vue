<template>
  <div class="page-container md-layout-column">
    <!--
      ----------------------------------------------------------------------
        SNACKBARS  - https://vuematerial.io/components/snackbar
      ----------------------------------------------------------------------
    -->
    <md-snackbar :md-duration="4000" :md-active.sync="showSnackBar" md-persistent>
      <span>{{ snack }}</span>
      <md-button class="md-primary" @click="showSnackBar = false;">Dismiss</md-button>
    </md-snackbar>

    <md-snackbar
      v-if="profile.diffTime < 31 && Math.random() > 0.5"
      :md-duration="4000"
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
      >Please read this</md-button>
    </md-snackbar>

    <md-snackbar
      v-if="profile.diffTime > 31 && Math.random() > 0.8"
      :md-duration="4000"
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
      >Update it now</md-button>
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
      <md-dialog-title style="padding: 0px; color: #404040 !important;">My Profile</md-dialog-title>
      <Tags/>
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
      <md-dialog-title style="color: #404040 !important;">Welcome to DigLife!</md-dialog-title>
      <div style="padding: 0 25px ;">
        If you are a member of the Digital Life Collective, please use your
        Mattermost username to log into the portal. If you are not a member yet,
        <a
          href="https://diglife.com/join-us/"
        >
          <u>join us</u>!
        </a>
        <br>
        <br>
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
            style="background: #0DC9C9; color: white;"
          >
            <md-icon style="color: white;">exit_to_app</md-icon>Enter
          </md-button>
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
          <md-list style="margin: 50px; overflow: auto; height: 55vh !important;">
            <md-list-item v-for="(member, index) in members" :key="member.id">
              <md-avatar>
                <img
                  style="top:0; left: 0; width: 60px; height: 50px;"
                  v-bind:src="avatarLink2(index)"
                >
              </md-avatar>
              <span class="md-list-item-text">
                {{ member.first_name }} {{ member.last_name }} ({{
                member.username
                }})
              </span>
              <md-button @click="directMessage(member.id);" class="md-icon-button md-list-action">
                <!-- Create a direct message channel -->
                <md-icon class="md-primary">forum</md-icon>
              </md-button>
            </md-list-item>
          </md-list>
        </md-tab>
      </md-tabs>
      <md-dialog-actions style="padding: 25px">
        <md-button class @click="cancelAccess();">Close</md-button>
      </md-dialog-actions>
    </md-dialog>

    <!--
      ----------------------------------------------------------------------
        DIALOG BOXES - SUDO DIALOG
      ----------------------------------------------------------------------
    -->
    <md-dialog :md-active.sync="activeAccess" id="access">
      <!-- https://github.com/vuematerial/vue-material/issues/201 -->
      <md-dialog-title>{{ service.replace(/[!#*@%/."'\\&]/, "") }}</md-dialog-title>
      <md-tabs md-dynamic-height>
        <md-tab md-label="About This Service">
          <p>{{ channel.header }}</p>
          <p v-if="channel.purpose">{{ channel.purpose.tags }}</p>
        </md-tab>
        <md-tab md-label="Team Members">
          <md-list style="margin: 50px; overflow: auto; height: 55vh !important;">
            <md-list-item v-for="(member, index) in members" :key="member.id">
              <md-avatar>
                <img
                  style="top:0; left: 0; width: 50px; height: 50px;"
                  v-bind:src="avatarLink2(index)"
                >
              </md-avatar>
              <span class="md-list-item-text">
                {{ member.first_name }} {{ member.last_name }} ({{
                member.username
                }})
              </span>
              <md-button @click="directMessage(member.id);" class="md-icon-button md-list-action">
                <!-- Create a direct message channel -->
                <md-icon class="md-primary">forum</md-icon>
              </md-button>
            </md-list-item>
          </md-list>
        </md-tab>
      </md-tabs>
      <md-dialog-actions style="padding: 25px">
        <md-button class @click="cancelAccess();">Cancel</md-button>
        <md-button
          class="md-success md-raised"
          @click="requestAccess();"
          style="background: #0DC9C9; color: white;"
        >
          <md-icon style="color: white;">lock_open</md-icon>Request Access
        </md-button>
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
      <md-dialog-title>
        <md-icon style="color: black;">{{ mode.toLowerCase() }}</md-icon>
        {{ mode }} Menu Entry
      </md-dialog-title>
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
          <span class="md-helper-text">
            Pick an icon
            <a
              href="https://material.io/tools/icons/?style=baseline"
              target="icons"
            >from this list</a>
          </span>
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
          <md-button class="md-success md-raised" @click="activeMenu = false;">Cancel</md-button>
          <md-button
            v-if="mode == 'Add'"
            class="md-success md-raised"
            @click="onConfirmAddMenu();"
            style="background: #0DC9C9; color: white;"
          >Save</md-button>
          <md-button
            v-if="mode == 'Edit'"
            class="md-success md-raised"
            @click="onConfirmDeleteMenu(menuindex);"
            sty
            le="background: #0DC9C9; color: white;"
          >Remove</md-button>
          <md-button
            v-if="mode == 'Edit'"
            class="md-success md-raised"
            @click="onConfirmEditMenu(menuindex);"
            style="background: #0DC9C9; color: white;"
          >Save</md-button>
        </md-dialog-actions>
      </div>
    </md-dialog>

    <!--
      ----------------------------------------------------------------------
        TOOLBAR - https://vuematerial.io/components/toolbar/
      ----------------------------------------------------------------------
    -->
    <md-toolbar :class="['md-primary', 'md-toolbar']" v-if="profile">
      <md-button class="md-icon-button" @click="showNavigation = true;">
        <md-icon>menu</md-icon>
      </md-button>
      <!-- Show the title and navigation path here -->
      <!-- img src="https://diglife.com/brand/logo_primary.svg" / -->
      <span class="md-title">
        {{
        !service
        ? domain.toUpperCase()
        : service.replace(/[!#*@%/."'\\&:]/, "").toUpperCase()
        }}
      </span>

      <div class="md-toolbar-section-end md-scrollbar">
        <md-button
          v-for="(dom, index) in domains"
          :key="index"
          :title="dom"
          @click="service == '' ? nav(dom) : sub(service, dom);"
          v-bind:style="[
            domain === dom ? { color: '#fec019' } : { color: '#fff' }
          ]"
        >{{ dom.replace("friends", "partners").substring(0, 4) }}</md-button>

        <md-button
          v-if="domains.length > 0"
          style="background-color: #c5536f;"
          title="All domains"
          @click="service == '' ? nav('all') : sub(service, 'all');"
          v-bind:style="[
            domain === 'all' ? { color: '#fec019' } : { color: '#fff' }
          ]"
        >ALL</md-button>

        <md-menu>
          <md-avatar style="cursor: pointer; border: 2px solid transparent;" md-menu-trigger>
            <div class="pulsating-circle"></div>
            <img v-bind:src="avatarLink">
          </md-avatar>

          <md-menu-content class="md-card-menu">
            <md-menu-item @click="onLogout();">
              <md-icon>logout</md-icon>
              <span>Logout</span>
            </md-menu-item>
            <md-menu-item @click="openSettings();">
              <md-icon>person</md-icon>
              <span>Profile</span>
            </md-menu-item>
            <md-menu-item @click="openNote('https://notepad.diglife.coop/s/B1PgFFi4E');">
              <md-icon>help</md-icon>
              <span>Help</span>
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
      <div id="inner">
        <md-button title="Show Holonic Map" @click="sub('holons');" class="md-fab md-mini md-plain">
          <md-icon>bubble_chart</md-icon>
        </md-button>

        <md-button title="Show Network Map" @click="sub('skills');" class="md-fab md-mini md-plain">
          <md-icon>scatter_plot</md-icon>
        </md-button>

        <md-button title="Show Channels" @click="sub('channels');" class="md-fab md-mini md-plain">
          <md-icon>forum</md-icon>
        </md-button>

        <md-button title="Show Calendar" @click="sub(':Calendar');" class="md-fab md-mini md-plain">
          <md-icon>event</md-icon>
        </md-button>

        <md-button title="Show Folders" @click="sub(':Folders');" class="md-fab md-mini md-plain">
          <md-icon>folder</md-icon>
        </md-button>

        <md-button title="Show Notes" @click="sub('notes');" class="md-fab md-mini md-plain">
          <md-icon>insert_drive_file</md-icon>
        </md-button>
      </div>
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
        <span class="md-title" style="color: white;">
          {{
          domain.toUpperCase()
          }}
        </span>
      </md-toolbar>

      <!--
        ----------------------------------------------------------------------
          LIST - https://vuematerial.io/components/list/
        ----------------------------------------------------------------------
      -->
      <md-list>
        <md-list-item v-if="username">
          <md-avatar>
            <img v-bind:src="avatarLink">
          </md-avatar>
          <div v-if="profile" class="md-list-item-text">
            <p
              style="font-weight: bold; font-size: 1.4em"
            >{{ profile.first_name }} {{ profile.last_name }}</p>
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
          <span class="md-list-item-text">{{ channel.display_name.replace(/[!#*@%/."'\\&]/, "") }}</span>

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
          >verified_user</md-icon>
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
      <img v-if="!service" id="logo" v-bind:src="logoLink">
      <p v-if="users && !service" class="counter">{{ users.length - 1 }}</p>
      <Particles v-if="!service"/>

      <Channels v-if="service == 'channels'" :domain="domain"/>
      <Notes v-if="service == 'notes'" :domain="domain"/>
      <Meetings v-if="service == 'meetings'" :domain="domain"/>
      <Holons v-if="service == 'holons'" :domain="domain"/>
      <Skills v-if="service == 'skills'" :domain="domain"/>

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
import { BASEURL, CHATURL } from "../main.js";
import Particles from "./Particles.vue";
import Tags from "./Tags.vue";
import Channels from "./Channels.vue";
import Notes from "./Notes.vue";
import Meetings from "./Meetings.vue";
import Holons from "./Holons.vue";
import Skills from "./Skills.vue";
import Slack from "node-slack";
import Moment from "moment-timezone";

import _ from "lodash/fp/object"; //lodash/fp/object for objects only
import db from "../firebase/init.js";

export default {
  name: "Navbar",
  components: { Particles, Tags, Channels, Notes, Holons, Skills, Meetings },
  data: () => ({
    // form: {
    //   username: null
    // },
    showNavigation: false,
    showSidepanel: false,
    showServices: false,
    showSnackBar: false,
    showProfileReminder: true,
    activeUser: false,
    activeAccess: false,
    activeInfo: false,
    activeSettings: false,
    activeMenu: false,
    service: "",
    username: "",
    snack: "",
    users: [],
    domains: [],
    domain: "",
    channels: [],
    profile: "",
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
    //this.domain = this.$route.params.domain || "diglife";
    // username coming from cookie
    if (this.$cookies.get("username")) {
      this.username = this.$cookies.get("username");
    } else {
      this.activeUser = true;
    }

    // get query parameter (use params for path)
    //if (this.$route.params.service) {
    this.service = this.$route.query.service || "";
    //}

    //showServices cookie
    this.showServices =
      this.$cookies.get("showServices") == "true" ? true : false;
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

        if (data.username === this.username) {
          // calculate days since joined
          data.diffTime = new Date().getTime();
          data.diffTime =
            (data.diffTime - data.create_at) / (1000 * 60 * 60 * 24);

          this.profile = data;
          //this.username = this.$cookies.get("username");
          this.activeUser = false;
        }
      });
    });

    // LOAD DOMAINS AND CHANNELS /////////////////////////////////////////////
    let channelsRef = db.database().ref("portal_channels");
    if (this.$cookies.get("username")) {
      let domainsRef = db
        .database()
        .ref(
          "portal_profiles/" +
            this.$cookies.get("username").replace(".", "%2E") +
            "/domains"
        );
      //console.log(this.domains, domainsRef)
      domainsRef
        .once("value", profile => {
          if (profile.exists()) {
            this.domains = profile.val();
            if (this.$route.query.domain) {
              this.domain = this.$route.query.domain;
            } else if (this.$cookies.get("mydomain")) {
              this.domain = this.$cookies.get("mydomain");
            } else {
              this.domain = this.domains[0];
            }
            console.log("Loading domains.." + this.domain);
          }
        })
        .then(profile => {
          console.log("Loading channels..");
          let channelsRef = db.database().ref("portal_channels");
          // porta_extensions contains any channel info not stored in Mattermost
          //let extensionsRef = db.database().ref("portal_extensions");
          channelsRef.on("child_added", channel => {
            var data = channel.val();
            // if (channel.val().display_name.charAt(0) !== "#") {
            //     extensionsRef.child(channel.key).once("value", extension => {
            // if (extension.exists()) {
            //   data = _.merge(data, extension.val());
            // }
            if (this.domains.includes(this.domain)) {
              //(data.tags && this.domain === "all" && this.domains.filter(value => data.tags.includes(value)))
              //(this.domain === "all" && this.domains.includes(this.domain))
              this.channels.push(data);
              //this.notes.sort(SortByTime);
            }
            //console.log(this.channels, this.domain);
            //this.channels.push(channel.val());
            // sort here due to asnyc promise
            //this.channels.sort(SortByName);
            //console.log(channel.key, data.name, extension.val());
          });
        });
    }

    //console.log("This channel: ", this.channels);
    // }
    // });

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
        //var data = group.val();
        //console.log(data);

        if (group.key === "channels") {
          this.groups = group.val();
        }
      });
    }

    // update cookies
    this.$cookies.config("365d");
  },

  ///////////////////////////////////////////////////////////////////////////////
  //  COMPUTED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  computed: {
    // domain: function() {
    //   if (this.$route.params.domain) {
    //     return this.$route.params.domain;
    //   } else if (this.$cookies.get("mydomain")) {
    //     return this.$cookies.get("mydomain");
    //   } else {
    //     return "diglife";
    //   }
    // },

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
        this.domain.toLowerCase() +
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
    document.title = "DigLife Portal";
  },

  ///////////////////////////////////////////////////////////////////////////////
  //  BEFORE DESTROY - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  beforeDestroy: function() {},

  ///////////////////////////////////////////////////////////////////////////////
  //  METHODS - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  methods: {
    openNote: function(note) {
      this.service = "Help";
      var element = document.getElementById("theApp");
      element.src = "about:blank";
      element.style.display = "block";
      // window.onload = function() {
      window.open(note, "theApp");
    },

    switchService: function() {
      this.$cookies.set("showServices", this.showServices);
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
      return (
        this.channels[index].purpose.domain &&
        this.channels[index].purpose.domain == this.domain
      );
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

        //update groups
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
          )
          .then(response =>
            db
              .database()
              .ref(
                "portal_profiles/" +
                  this.username.replace(".", "%2E") +
                  "/grouptags"
              )
              .set(this.groups.grouptags)
          )
          .then(response =>
            // load personal channels and tags from group membership
            db
              .database()
              .ref("portal_profiles/" + this.username.replace(".", "%2E"))
              .once("value")
              .then(group => {
                let data = group.val();
                this.groups = data.channels;
                this.tags = data.tags ? data.tags : [];
                this.domains = data.domains;
                // assign default domain
                if (this.$route.query.domain) {
                  this.domain = this.$route.query.domain;
                } else if (this.$cookies.get("mydomain")) {
                  this.domain = this.$cookies.get("mydomain");
                } else {
                  this.domain = this.domains[0];
                  console.log(
                    "domain: ",
                    this.domain,
                    this.username,
                    this.profile
                  );
                }
              })
          );

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
      this.service = "";
      this.domain = "";
      this.profile = "";
      this.username = "";
      //this.$cookies.remove("username");
      this.$cookies.remove("mydomain");
      this.$cookies.remove("showServices");
      this.activeUser = true;
    },

    nav: function(dom) {
      //window.history.pushState("Navbar", "Nav", "/nav/" + dom);
      this.$cookies.set("mydomain", dom);
      this.domain = dom;
      this.service = "";
      this.showNavigation = true;
      var element = document.getElementById("theApp");
      element.style.display = "none";
    },

    sub: function(menu, dom) {
      if (dom) {
        this.domain = dom;
      }
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
          let timezone = Moment.tz.guess();
          this.snack = "Showing calendar in local timezone for " + timezone;
          this.showSnackBar = true;
          switch (this.domain) {
            case "diglife":
              drive =
                "6fkigtu9vcqjtv9bnfd23lvqsk@group.calendar.google.com&ctz=" +
                timezone;
              break;
            case "projects":
              drive =
                "classroom109491638889680858364@group.calendar.google.com&ctz=" +
                timezone;
              break;
            case "ops":
              drive =
                "0627opclgoft1e0o1mql6fk1l8%40group.calendar.google.com&ctz=" +
                timezone;
              break;
            case "friends":
              drive = "";
              break;
            case "openlearning":
              drive = "";
              break;
            case "ecosystem-maps":
              drive = "";
              break;
            case "cc-college":
              drive = "omdev.ca%40gmail.com&ctz=";
              break;

            default:
              drive =
                "6fkigtu9vcqjtv9bnfd23lvqsk@group.calendar.google.com&ctz=" +
                timezone;
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
          switch (this.domain) {
            case "diglife":
              drive = "1pfEKM3g_gUbHosuwzbc-ea29gjwGAmVZ";
              break;
            case "projects":
              drive = "1m2EkiK57l0kOjaK3oXzBGvoOYxU_7sme";
              break;
            case "Oops":
              drive = "1fZ5-UEJlnD5_N_YGtP0BNckuxP7TvRJR";
              break;
            case "partners":
              drive = "1e2-z9FTqOMJXUc0JRMAEm7XynpkSRy60";
              break;
            case "openlearning":
              drive = "";
              break;
            case "ecosystem-maps":
              drive = "";
              break;
            case "cc-college":
              drive = "1bOH-VSg7uyMxGrWQ4fJY-Dw0C9EDR3eZ";
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
        case "holons":
          this.service = "";
          window.history.pushState(
            "Navbar",
            "Holons",
            "?service=holons&domain=" + this.domain
          );
          //this.$router.push({ name: "Navbar", path: "/holons/" + this.domain });
          this.$nextTick(() => {
            this.service = "holons";
          });
          break;
        case "skills":
          this.service = "";
          window.history.pushState(
            "Navbar",
            "Skills",
            "?service=skills&domain=" + this.domain
          );
          //this.$router.push({ name: "Navbar", path: "/skills/" + this.domain });
          this.$nextTick(() => {
            this.service = "skills";
          });
          break;
        case "notes":
          this.service = "";
          window.history.pushState(
            "Navbar",
            "Notes",
            "?service=notes&domain=" + this.domain
          );
          this.$nextTick(() => {
            this.service = "notes";
          });
          break;
        case "channels":
          this.service = "";
          window.history.pushState(
            "Navbar",
            "Channels",
            "?service=channels&domain=" + this.domain
          );
          this.$nextTick(() => {
            this.service = "channels";
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
      //   this.service === "Channels" ||
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
<style>
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

.md-dialog,
.md-tab {
  width: 480px !important;
  height: 640px !important;
  max-width: 480px !important;
  max-height: 640px !important;
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
  bottom: 25%;
  right: 0;
  transition: 0.5s;
}

#actions #inner {
  border-radius: 25px;
  margin-left: 32px;
  padding-left: 8px;
  border-left: 8px solid #FEC019;
  transition: 1s;
}

#actions:hover {
  width: 120px;
}

#actions:hover > #inner {
  border-left: 8px solid transparent;
}

#actions .md-button {
  margin-left: 0;
}
.md-title {
  font-size: 24px !important;
  margin-left: 0px !important;
  color: white !important;
  font-weight: bold !important;
}
.md-card .md-title {
  color: #404040 !important;
}
.md-toolbar {
  background-color: #f47e7e !important;
}

.md-toolbar-section-end .md-button {
  min-width: 40px !important;
  min-height: 40px !important;
  width: 40px !important;
  height: 40px !important;
  margin: 0 8px 0 0px !important;
  background-color: GREEN;
  overflow: hidden;
  font-size: 0.8em;
  background-color: #db5d7c;
  color: #fff;
  border-radius: 5px;
}

.md-tabs-container {
  height: 100% !important;
  padding: 10px !important;
}

.md-tab p {
  font-size: 1.2em;
  padding: 30px 0 0 10px;
}

.md-switch {
  margin: 0px 5px;
}

.md-checked .md-switch-container {
  background-color: rgba(
    0,
    0,
    0,
    0.5
  ) !important; /* not selected switch color */
}

.md-checked .md-switch-thumb {
  background-color: #fff !important; /* 00E4CF */
}

.md-switch-thumb {
  background-color: #404040 !important; /* 00E4CF */
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

.pulsating-circle {
  border: 10px solid #fff;
  -webkit-border-radius: 30px;
  height: 50px;
  width: 50px;
  position: absolute;
  left: -10px;
  top: -10px;
  -webkit-animation: pulsate 1s ease-out;
  -webkit-animation-iteration-count: 10;
  opacity: 0;
}
@-webkit-keyframes pulsate {
  0% {
    -webkit-transform: scale(0.1, 0.1);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1.2, 1.2);
    opacity: 0;
  }
}

.md-toolbar-section-end {
  max-height: 60px;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  text-align: right;
  display: block !important;
}

.md-toolbar-section-end::-webkit-scrollbar {
  display: none;
}

.md-toolbar-section-end:hover::-webkit-scrollbar {
  display: none;
}
</style>
