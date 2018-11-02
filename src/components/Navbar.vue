<template>
 <div class="page-container md-layout-column" >

    <md-snackbar :md-duration="4000" :md-active.sync="showSnackbar" md-persistent>
      <span>Thank you! Your request has been submitted.</span>
      <md-button class="md-primary" @click="showSnackbar = false">Close</md-button>
    </md-snackbar>

    <!-- md-dialog-prompt
      :md-active.sync="activeUser"
      v-model="username"
      md-input-name="username"
      md-title="What is your Mattermost username?"
      md-input-maxlength="30"
      md-input-placeholder="Please type your username..."
      md-confirm-text="Enter" 
      @md-confirm="onConfirm()"  /-->

    <md-dialog :md-active.sync="activeUser" >
      <md-dialog-title>Welcome to DigLife!</md-dialog-title>
      <div style="padding: 0 25px ;">
        <md-field id="username">
          <label>Username</label>
          <md-input v-model="username" @keyup.prevent.esc="onConfirm()" @keyup.enter="onConfirm()" required></md-input>
          <span class="md-helper-text">Enter your Mattermost username</span>
          <span class="md-error">The username does not exist</span>
          <md-icon>person</md-icon>
        </md-field>
        <md-dialog-actions style="padding: 25px 0;">
          <md-button class="md-success md-raised" @click="onConfirm()" style="background: #00b0a0; color: white;" ><md-icon style="color: white;">exit_to_app</md-icon> Enter</md-button>
        </md-dialog-actions>
      </div>
    </md-dialog>




   <md-dialog :md-active.sync="activeAccess" id="access">
   <!-- https://github.com/vuematerial/vue-material/issues/201 -->
      <md-dialog-title>Request Access</md-dialog-title>
      <md-tabs md-dynamic-height>
        <md-tab md-label="About This Service">
          <p>{{channel.header}}</p>
        </md-tab>
        <md-tab md-label="Team Members">      
          <md-list style="padding: 30px;"> 
           <md-list-item v-for="(member, index) in members" :key="member.id">
              <md-avatar><img style="top:0; left: 0; width: 50px; height: 50px;" v-bind:src="avatarLink2(index)" ></md-avatar>
              <span class="md-list-item-text">{{member.first_name}} {{member.last_name}} ({{member.username}})</span>
              <md-button class="md-icon-button md-list-action">
                <!-- Create a direct message channel -->
                <md-icon class="md-primary">chat_bubble</md-icon>
              </md-button>
            </md-list-item>
          </md-list>
        </md-tab>
      </md-tabs>
      <md-dialog-actions style="padding: 25px">
        <md-button class="" @click="cancelAccess()">Cancel</md-button>
        <md-button class="md-success md-raised" @click="requestAccess()" style="background: #00b0a0; color: white;" ><md-icon style="color: white;">lock_open</md-icon> Request Access</md-button>
      </md-dialog-actions>
    </md-dialog>   

    <md-toolbar class="md-primary">
      <md-button class="md-icon-button" @click="showNavigation = true">
        <md-icon>menu</md-icon>
      </md-button>
      <!-- Show the title and navigation path here -->
      <!-- img src="https://diglife.com/brand/logo_primary.svg" / -->
      <span class="md-title">{{service ? '' : 'DigLife' }} {{service ? '' : selected }} {{service}}</span>

      <div class="md-toolbar-section-end">
        <md-button @click="nav('Home')" v-bind:style="[selected == 'Home' ? {color: '#fec019'} : {color: '#fff'}]">Home</md-button>
        <md-button @click="nav('Projects')" v-bind:style="[selected == 'Projects' ? {color: '#fec019'} : {color: '#fff'}]">projects</md-button>
        <md-button @click="nav('Operations')" v-bind:style="[selected == 'Operations' ? {color: '#fec019'} : {color: '#fff'}]">ops</md-button>
        <md-button @click="nav('Friends')" v-bind:style="[selected == 'Friends' ? {color: '#fec019'} : {color: '#fff'}]">friends</md-button>
      </div>
    </md-toolbar>

   <!-- Show action buttons -->
   <div v-if="service" id="actions" >
      <md-button title="Open support group" @click="sub('chatLink')" class="md-fab md-mini md-plain">
        <md-icon>chat_bubble_outline</md-icon>
      </md-button>
      <md-button title="Open app in new window" @click="sub('appLink')" class="md-fab md-mini md-plain">
        <md-icon>fullscreen</md-icon>
      </md-button>
      <md-button title="Social Ledger Social Objects" @click="sub('dashboardLink')" class="md-fab md-mini md-plain">
        <md-icon>apps</md-icon>
      </md-button>
      <md-button title="Social Ledger Holonic Chart" @click="sub('mapLink')" class="md-fab md-mini md-plain">
        <md-icon>blur_circular</md-icon>
      </md-button>
   </div>

    <!-- for more info on the drawer component: https://vuematerial.io/components/drawer -->
    <md-drawer :md-active.sync="showNavigation" id="drawer">
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title" style="color: white;">{{selected}} Services</span>
      </md-toolbar>

    <!-- for more info on the list component: https://vuematerial.io/components/list/ -->
      <md-list>
         <md-list-item v-if="username">
            <md-avatar>
              <img v-bind:src="avatarLink" >
            </md-avatar>
            <div v-if="profile" class="md-list-item-text">
              <p style="font-weight: bold; font-size: 1.4em">{{profile.first_name}} {{profile.last_name}}</p>
              <p style="color: #aaa;">{{profile.position}}</p>
            </div>   
        </md-list-item>

        <md-divider style="margin-bottom: 10px;" class="md-inset"></md-divider>

        <md-list-item v-for="(channel, index) in channels" :key="channel.id" @click="openService(index)" v-if="showDomain(index)">
          <md-icon>{{channel.purpose.icon}}</md-icon>
          <span class="md-list-item-text">{{channel.display_name}}</span>
         <!-- check the channel membership of the current user OR public channel-->
         <!-- need to fix a case if there is a partial string match -->
          <md-icon v-if="groups.includes(channel.name) || channel.type == 'O'" style="color: green;">verified_user</md-icon>
          <md-icon v-else style="color: lightgray;">verified_user</md-icon>

        </md-list-item>

      </md-list>
    </md-drawer>

 <md-content>
      <p id="welcome" v-if="username && !service" >Welcome back, <a @click="onReopen()">{{profile.first_name}} {{profile.last_name}}</a></p>
      <p v-if="users && !service" class="counter">{{users.length}}</p>
      <particlesJS/>
      <img v-if="selected == 'Home'" id="logo" src="https://diglife.com/brand/logo_secondary_home.svg" />
      <img v-if="selected == 'Projects'" id="logo" src="https://diglife.com/brand/logo_secondary_projects.svg" />
      <img v-if="selected == 'Operations'" id="logo" src="https://diglife.com/brand/logo_secondary_operations.svg" />
      <img v-if="selected == 'Friends'" id="logo" src="https://diglife.com/brand/logo_secondary_friends.svg" />
      <iframe name="theApp" id="theApp" style="display: none; width:100%; height:95vh;" frameBorder="0"></iframe>
 </md-content>

  </div>
</template>

<script>
import { BASEURL, CHATURL } from "/constants.js";
import particlesJS from "./Particles";
import Slack from "node-slack";
export default {
  name: "Navbar",
  components: { particlesJS },
  data: () => ({
    form: {
      username: null
    },
    showNavigation: false,
    showSidepanel: false,
    selected: "Home",
    service: "",
    serviceDescription: "",
    username: "",
    activeUser: false,
    activeAccess: false,
    users: "",
    profile: false,
    groups: "",
    channels: "",
    members: "",
    total: "",
    channel: "",
    showSnackbar: false,
    invalid: true,
  }),
  created: function() {
    this.axios
      .get(BASEURL + "webhooks/portal_users.php?file=base-diglife.php")
      .then(response => (this.users = response.data))

      .then(
        response =>
          (this.profile = this.users.find(item => {
            return item.username === this.$cookies.get("username");
          }))
      )

      .then(
        response =>
          (this.username =
            typeof this.profile === "undefined" ? "" : this.profile.username)
      )

      .then(
        response =>
          (this.activeUser = typeof this.profile === "undefined" ? true : false)
      );

    // get all channels for current user
    this.axios
      .get(
        BASEURL +
          "webhooks/portal_groups.php?file=base-diglife.php&username=" +
          this.$cookies.get("username")
      )
      .then(response => (this.groups = response.data));

    function SortByName(x,y) {
      return ((x.display_name === y.display_name) ? 0 : ((x.display_name > y.display_name) ? 1 : -1 ));
    }

    // get all channels for lederbot user and sort them 
    // to build the menu structure for a given domain (team)
    this.axios
      .get(
        BASEURL +
          "webhooks/portal_channels.php?file=base-diglife.php&user_id=r1jriqbx6tnkddxjgek5dn7xxa"
      )
      .then(response => (this.channels = response.data))
      .then(response => (this.channels.sort(SortByName)));

    //  this.axios
    //   .get(
    //     BASEURL + "assets/total.json"
    //   )
    //   .then(response => (this.total = response.data));
  },

  computed: {
    avatarLink: function() {
      return BASEURL + "webhooks/images/avatar_" + this.username + ".png";
    },
    //https://lodash.com/
    orderedUsers: function() {
      return _.orderBy(this.channel, "display_name");
    },
    invalidate: function() {
      return (this.invalid === true ? 'md-invalid' : "");
    },
  },

  mounted: function() {
    this.$cookies.config("365d");
  },
  methods: {
    avatarLink2: function(index) {
      return BASEURL + "webhooks/images/avatar_" + this.members[index].username + ".png";
    },
    showDomain: function(index) {
      return this.channels[index].purpose.domain
        ? this.channels[index].purpose.domain.includes(this.selected)
        : false;
    },
    cancelAccess: function() {
      this.activeAccess = false;
      this.service = "";
      var element = document.getElementById("particles-js");
      element.style.display = "block";
      element = document.getElementById("logo");
      element.style.display = "block";
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
      var element = document.getElementById("particles-js");
      element.style.display = "block";
      element = document.getElementById("logo");
      element.style.display = "block";
      this.showSnackbar = true;
    },

    onConfirm: function() {
      if (!this.username || !JSON.stringify(this.users).includes("\"username\":\""+this.username.toLowerCase()+"\"")) {  
        this.activeUser= true; document.getElementById("username").classList.add("md-invalid") }
      else {
        this.activeUser= false;
         document.getElementById("username").classList.remove("md-invalid")
        this.username = this.username.replace("@", "").toLowerCase();
        // cookies are not stored on mobile devices, new prommpt for every session
        this.$cookies.set("username", this.username);

        // update groups and profile for newly logged in user (no cookie set)
        this.axios
        .get(
          BASEURL +
            "webhooks/portal_groups.php?file=base-diglife.php&username=" +
            this.username
        )
        .then(response => (this.groups = response.data))
        .then(
          response =>
            (this.profile = this.users.find(item => {
              return item.username === this.username;
            }))
        );

        // update theme for user
        this.axios
        .get(
          BASEURL +
            "webhooks/portal_prefs.php?file=base-diglife.php&username=" +
            this.username
        )

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
      this.showNavigation = false;
      this.service = "";
      var element = document.getElementById("theApp");
      element.style.display = "none";
      element = document.getElementById("particles-js");
      element.style.display = "block";
      element = document.getElementById("logo");
      element.style.display = "block";
    },
    sub: function(menu) {
      // Open the contextual action button
      switch (menu) {
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
      // remove overlay, beware, this will kill the menu
      //document.getElementsByClassName("md-overlay")[0].style.display = "none";
      //var overlay = document.getElementsByClassName("md-overlay")[0];
      //overlay.parentNode.removeChild(overlay);

       document.getElementById("drawer").classList.remove("md-active");
      this.showNavigation = false;
      this.service = this.channels[index].display_name;
      this.channel = this.channels[index];
      //this.channel.namebrackets = '{'+this.channel.name+'}';

      // get all users (members) for channel
      // to show in members tab
      this.axios
      .get(
        BASEURL +
          "webhooks/portal_members.php?file=base-diglife.php&channel_id="+this.channel.id
      )
      .then(response => (this.members = response.data));

      var element = document.getElementById("logo");
      element.style.display = "none";

      element = document.getElementById("particles-js");
      element.style.display = "none";

      element = document.getElementById("theApp");
      element.style.display = "block";

      if (
        this.groups.includes(this.channels[index].name) ||
        this.channels[index].type === "O"
      ) {
        // Access has been granted
        window.open(this.channels[index].purpose.link, "theApp");
      } else {
        // Open dialoug to request access
        this.serviceDescription = this.channels[index].header;
        this.activeAccess = true;
      }
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
  top: 50%;
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
  font-wei ght: bold !important;
}
.md-toolbar {
  background-color: #00b0a0 !important;
}

.md-tab p {
  font-size: 1.2em;
  padding: 30px 0 0 10px;
}

.md-toolbar img {
  height: 55px !important;
}

.md-fab {
  background-color: #fec019 !important;
}

#actions .md-icon {
  color: #404040 !important;
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
}

.md-content img {
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
