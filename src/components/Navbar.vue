<template>
 <div class="page-container md-layout-column" >

    <md-snackbar :md-duration="4000" :md-active.sync="showSnackbar" md-persistent>
      <span>Thank you! Your request has been submitted.</span>
      <md-button class="md-primary" @click="showSnackbar = false">Close</md-button>
    </md-snackbar>

    <md-dialog-prompt
      :md-active.sync="activeUser"
      v-model="username"
      md-title="What is your Mattermost username?"
      md-input-maxlength="30"
      md-input-placeholder="Please type your username..."
      md-confirm-text="Enter" 
      @md-confirm="onConfirm()"  />

   <md-dialog :md-active.sync="activeAccess">
      <md-dialog-title>Request Access</md-dialog-title>
      <md-tabs md-dynamic-height>
        <md-tab md-label="About this service">
          <p>{{channel.header}}</p>
        </md-tab>
      </md-tabs>
      <md-dialog-actions>
        <md-button class="" @click="cancelAccess()">Cancel</md-button>
        <md-button class="md-success md-raised" @click="requestAccess()"><md-icon>lock_open</md-icon> Request Access</md-button>
      </md-dialog-actions>
    </md-dialog>   

    <md-toolbar class="md-primary">
      <md-button class="md-icon-button" @click="showNavigation = true">
        <md-icon>menu</md-icon>
      </md-button>
      <!-- Show the title and navigation path here -->
      <!-- img src="https://diglife.com/brand/logo_primary.svg" / -->
      <span class="md-title">DigLife {{service ? '' : selected }} {{service}}</span>

      <div class="md-toolbar-section-end">
        <md-button @click="nav('Home')" v-bind:style="[selected == 'Home' ? {color: '#fec019'} : {color: '#fff'}]">Home</md-button>
        <md-button @click="nav('Projects')" v-bind:style="[selected == 'Projects' ? {color: '#fec019'} : {color: '#fff'}]">projects</md-button>
        <md-button @click="nav('Operations')" v-bind:style="[selected == 'Operations' ? {color: '#fec019'} : {color: '#fff'}]">ops</md-button>
        <md-button @click="nav('Friends')" v-bind:style="[selected == 'Friends' ? {color: '#fec019'} : {color: '#fff'}]">friends</md-button>
      </div>
    </md-toolbar>

   <!-- Show action buttons -->
   <div v-if="service" id="actions" >
      <md-button title="Get more help" @click="sub('wikiLink')" class="md-fab md-mini md-plain">
        <md-icon>help_outline</md-icon>
      </md-button>
      <md-button title="Open in new window" @click="sub('appLink')" class="md-fab md-mini md-plain">
        <md-icon>fullscreen</md-icon>
      </md-button>
      <md-button title="Request access" @click="sub('accessLink')" class="md-fab md-mini md-plain">
        <md-icon>lock_open</md-icon>
      </md-button>
      <md-button title="Open support group" @click="sub('supportLink')" class="md-fab md-mini md-plain">
        <md-icon>chat_bubble_outline</md-icon>
      </md-button>
      <md-button title="Show more context" @click="sub('mapLink')" class="md-fab md-mini md-plain">
        <md-icon>blur_on</md-icon>
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
            <div class="md-list-item-text">
              <p style="font-weight: bold; font-size: 1.4em">{{profile.first_name}} {{profile.last_name}}</p>
              <p style="color: #aaa;">{{profile.email}}</p>
            </div>
        
        </md-list-item>

        <md-divider style="margin-bottom: 10px;" class="md-inset"></md-divider>

        <md-list-item @click="open('Chat')" v-if="selected == 'Home'">   
        <md-icon>chat</md-icon>
          <span class="md-list-item-text">DigLife Chat {{verifiedChat}}</span>
          <md-icon v-if="verifiedChat" style="color: green;">verified_user</md-icon>
        </md-list-item>

        <md-list-item @click="open('Ghost Publishing')" v-if="selected == 'Home'">
        <md-icon>web</md-icon>
          <span class="md-list-item-text">DigLife Publishing {{verifiedGhostPublishing}}</span>
          <md-icon v-if="verifiedGhostPublishing" style="color: green;">verified_user</md-icon>
        </md-list-item> 

        <md-list-item @click="open('Mailtrain News')" v-if="selected == 'Operations'">
        <md-icon>email</md-icon>
          <span class="md-list-item-text">DigLife News</span>
          <md-icon v-if="verifiedMailtrainNews" style="color: green;">verified_user</md-icon>
        </md-list-item>
        
        <md-list-item @click="open('Projects Chat')" v-if="selected == 'Projects'">
        <md-icon>chat</md-icon>
          <span class="md-list-item-text">Projects Chat</span>
          <md-icon v-if="verifiedProjectsChat" style="color: green;">verified_user</md-icon>
        </md-list-item>

        <md-list-item @click="open('Operations Chat')" v-if="selected == 'Operations'">
        <md-icon>chat</md-icon>
          <span class="md-list-item-text">Operations Chat</span>
          <md-icon v-if="verifiedOperationsChat" style="color: green;">verified_user</md-icon>
        </md-list-item>

        <md-list-item @click="open('Shared Drive')" v-if="selected == 'Home'">
        <md-icon>folder</md-icon>
          <span class="md-list-item-text">Shared Drive</span>
          <md-icon v-if="verifiedSharedDrive" style="color: green;">verified_user</md-icon>
        </md-list-item>

        <md-list-item @click="open('Decision Making')" v-if="selected == 'Home'">
        <md-icon>thumb_up</md-icon>
          <span class="md-list-item-text">Decision Making</span>
          <md-icon v-if="verifiedDecisionMaking" style="color: green;">verified_user</md-icon>
        </md-list-item>

        <md-list-item @click="open('Library')" v-if="selected == 'Home'">
        <md-icon>local_library</md-icon>
          <span class="md-list-item-text">Library</span>
          <md-icon v-if="verifiedLibrary" style="color: green;">verified_user</md-icon>
        </md-list-item>

        <md-list-item @click="open('Calendar')" v-if="selected == 'Home'">
        <md-icon>event</md-icon>
          <span class="md-list-item-text">Calendar</span>
          <md-icon v-if="verifiedCalendar" style="color: green;">verified_user</md-icon>
        </md-list-item>

        <md-list-item @click="open('Zoom')" v-if="selected == 'Home'">
        <md-icon>videocam</md-icon>
          <span class="md-list-item-text">Zoom Calls</span>
          <md-icon v-if="verifiedZoom" style="color: green;">verified_user</md-icon>
        </md-list-item>

        <md-list-item @click="open('System Administration')" v-if="selected == 'Operations'">
        <md-icon>code</md-icon>
          <span class="md-list-item-text">System Administration</span>
          <md-icon v-if="verifiedSysadmin" style="color: green;">verified_user</md-icon>
        </md-list-item>

        <md-list-item v-for="(channel, index) in channels" :key="channel.id" @click="openSudoService(index)" v-if="selected == channel.purpose.domain && channels.message !== 'No channels were found' ">
          <md-icon>{{channel.purpose.icon}}</md-icon>
          <span class="md-list-item-text">{{channel.display_name}}</span>
         <!-- check the channel membership of the current user OR public channel-->
          <md-icon v-if="groups.includes(channel.name) || channel.type == 'O'" style="color: green;">verified_user</md-icon>

        </md-list-item>

      </md-list>
    </md-drawer>

 <md-content>
      <p id="welcome" v-if="username" >Welcome back, <a @click="onReopen()">{{profile.first_name}} {{profile.last_name}}</a></p>
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
    appLink: "",
    wikiLink: "",
    mapLink: "",
    accessLink: "",
    serviceDescription: "",
    username: "",
    activeUser: false,
    activeAccess: false,
    users: "",
    profile: "",
    groups: "",
    channels: "",
    total: "",
    channel: "",
    showSnackbar: false
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

    // get all channels for current user and domain=governance
    this.axios
      .get(
        BASEURL +
          "webhooks/portal_groups.php?file=base-diglife.php&team_id=qrgqzehi97bduyz874ep6q8ije&user_id=" +
          this.$cookies.get("userid")
      )
      .then(response => (this.groups = response.data));

    // get all channels for lederbot user and domain=governance
    // to build the menu structure for a given domain (team)
    this.axios
      .get(
        BASEURL +
          "webhooks/portal_channels.php?file=base-diglife.php&team_id=qrgqzehi97bduyz874ep6q8ije&user_id=r1jriqbx6tnkddxjgek5dn7xxa"
      )
      .then(response => (this.channels = response.data));

    //  this.axios
    //   .get(
    //     BASEURL + "assets/total.json"
    //   )
    //   .then(response => (this.total = response.data));
  },

  computed: {
    verifiedChat: function() {
      return this.$cookies.get("verifiedChat");
    },
    verifiedProjectsChat: function() {
      return this.$cookies.get("verifiedProjectsChat");
    },
    verifiedOperationsChat: function() {
      return this.$cookies.get("verifiedOperationsChat");
    },
    verifiedGhostPublishing: function() {
      return this.groups.includes("ghost-authors"); // NEW WAY
    },
    verifiedMailtrainNews: function() {
      return this.$cookies.get("verifiedMailtrainNews");
    },
    verifiedSharedDrive: function() {
      return this.$cookies.get("verifiedSharedDrive");
    },
    verifiedDecisionMaking: function() {
      return this.$cookies.get("verifiedDecisionMaking");
    },
    verifiedLibrary: function() {
      return this.$cookies.get("verifiedLibrary");
    },
    verifiedCalendar: function() {
      return this.$cookies.get("verifiedCalendar");
    },
    verifiedZoom: function() {
      return this.$cookies.get("verifiedZoom");
    },
    verifiedSysadmin: function() {
      return this.groups.includes("testing");
    },
    avatarLink: function() {
      return BASEURL + "webhooks/images/avatar_" + this.username + ".png";
    }
  },

  mounted: function() {
    this.$cookies.config("365d");
  },
  methods: {
    cancelAccess: function() {
      // BUG - cannot open menu anymore
      this.activeAccess = false;
      this.service = "";
      var element = document.getElementById("particles-js");
      element.style.display = "block";
      element = document.getElementById("logo");
      element.style.display = "block";
    },
    requestAccess: function() {
      this.activeAccess = false;
      // we set the cookie immediately to true, later this will be pulled
      // from MM - if a user is a member of the support group
      this.$cookies.set("verified" + this.service.replace(" ", ""), true);

      var slack = new Slack(CHATURL + "hooks/"+this.channel.purpose.hook);
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
      this.activeAccess = false;
      this.service = "";
      var element = document.getElementById("particles-js");
      element.style.display = "block";
      element = document.getElementById("logo");
      element.style.display = "block";
      this.showSnackbar = true;

    },
    onConfirm: function() {
      this.username = this.username.replace("@", "").toLowerCase();
      this.$cookies.set("username", this.username);
      for (var i = 0; i < this.users.length; i++) {
        if (this.users[i].username === this.username) {
          this.profile = this.users[i];
        }
      }

      if (
        typeof this.profile !== "undefined" &&
        this.username === this.profile.username
      ) {
        this.$cookies.set("userid", this.profile.id);
        this.$cookies.set("verifiedChat", true);

        console.log(this.profile.id);
        //this.activeUser = false;
      } else {
        //this.$cookies.remove("username");
        this.$cookies.set("verifiedChat", false);
        //this.activeUser = true;
      }

      // set the number of nodes displayed in the particle animation
      this.$cookies.set("particles", parseInt(this.users.length,10)-5);
      console.log(parseInt(this.users.length,10)-5);

      // this forces Vue to recalc all computed props
      this.$forceUpdate();
    },
    onReopen: function() {
      // Open dialoug box again to change name
      this.activeUser = true;
    },
    nav: function(menu) {
      this.selected = menu;
      this.service = "";
      var element = document.getElementById("theApp");
      element.style.display = "none";
      element = document.getElementById("particles-js");
      element.style.display = "block";
      element = document.getElementById("logo");
      element.style.display = "block";
    },
    sub: function(menu) {
      switch (menu) {
        case "appLink":
          window.open(this.appLink, "_blank");
          break;
        case "wikiLink":
          window.open(this.wikiLink, "theApp");
          break;
        case "accessLink":
          this.requestAccess();
          break;
        case "mapLink":
          window.open(this.mapLink, "theApp");
          break;
        default:
      }
    },
    
    openService: function(name,link) {
      // remove overlay
     var overlay = document.getElementsByClassName("md-overlay")[0];
      overlay.parentNode.removeChild(overlay);

      document.getElementById("drawer").classList.remove("md-active");
      // remove background
      this.service = name; 
      console.log(this.service);
      var element = document.getElementById("logo");
      element.style.display = "none";

      element = document.getElementById("particles-js");
      element.style.display = "none";

      element = document.getElementById("theApp");
      element.style.display = "block";

       window.open(link, "theApp");
    },
    openSudoService: function(index) {
      // remove overlay
     var overlay = document.getElementsByClassName("md-overlay")[0];
      overlay.parentNode.removeChild(overlay);

      document.getElementById("drawer").classList.remove("md-active");
      this.service = this.channels[index].display_name; 

      var element = document.getElementById("logo");
      element.style.display = "none";

      element = document.getElementById("particles-js");
      element.style.display = "none";

      element = document.getElementById("theApp");
      element.style.display = "block";

      if (this.groups.includes(this.channels[index].name) || this.channels[index].type === 'O') {
        // Access has been granted
        window.open(this.channels[index].purpose.link, "theApp");
      } else {
        // Open dialoug to request access
        this.serviceDescription = this.channels[index].header;
        this.channel = this.channels[index];
        this.activeAccess = true;
      }
    },
    open: function(menu) {

      // remove overlay
     var overlay = document.getElementsByClassName("md-overlay")[0];
      overlay.parentNode.removeChild(overlay);

      document.getElementById("drawer").classList.remove("md-active");
      this.service = menu;
      var element = document.getElementById("logo");
      element.style.display = "none";

      element = document.getElementById("particles-js");
      element.style.display = "none";

      element = document.getElementById("theApp");
      element.style.display = "block";

      // this switch menu only assigns variables for the links
      switch (menu) {
        case "Chat":
          this.appLink =
            "https://chat.diglife.com/the-collective/channels/collective-open-chat";
          this.wikiLink =
            "https://diglife.com/webhooks/dashboard.php?user=joachim&username=joachim&team=practices&channel=social-ledger-lab&database=tokens&scope=none&search=";
          this.mapLink =
            "https://diglife.com/webhooks/circle.php?command=view&team=practices&channel=social-ledger-lab&user=joachim&username=joachim&activity=social-ledger-training-videos";
          this.accessLink =
            "https://chat.diglife.com/technology-crew/channels/mattermost-admin-grp";
          break;
        case "Projects Chat":
          this.appLink =
            "https://chat.diglife.com/the-collective/channels/collective-open-chat";
          this.wikiLink =
            "https://docs.google.com/document/d/10WLH45PCo952P1L6lLryrw1IMk0JtwWjFkC0E5HukAY/view";
          this.mapLink = "";
          this.accessLink =
            "https://chat.diglife.com/technology-crew/channels/projects-chat";
          break;
        case "Operations Chat":
          this.appLink =
            "https://chat.diglife.com/the-collective/channels/collective-open-chat";
          this.wikiLink =
            "https://docs.google.com/document/d/10WLH45PCo952P1L6lLryrw1IMk0JtwWjFkC0E5HukAY/view";
          this.mapLink = "";
          break;
        case "Shared Drive":
          this.appLink =
            "https://drive.google.com/embeddedfolderview?id=0B_zdMVo5TxZQS0dmYlhXaUJIams";
          this.wikiLink = "";
          this.mapLink = "";
          break;
        case "Ghost Publishing":
          this.serviceDescription =
            "Ghost is our main publishing platform. All web pages you see on http://diglife.com are published through Ghost. If you would like to become an author and publish your own articles on Ghost, please click on the Request Access button below";
          this.appLink = "https://diglife.com/ghost";
          this.wikiLink = "";
          this.mapLink = "";
          this.accessLink =
            "https://chat.diglife.com/technology-crew/channels/ghost-publishing";
          break;
        case "Mailtrain News":
          this.appLink = "https://mailtrain.diglife.com/";
          this.wikiLink = "";
          this.mapLink = "";
          break;
        case "Decision Making":
          this.appLink =
            "https://tree.taiga.io/project/sceenius-digital-life-collective/issues?type=857455,857456&order_by=type";
          this.wikiLink = "";
          this.mapLink = "";
          break;
        case "System Administration":
          this.appLink = "https://codesandbox.io/s/mok0knm7l9";
          this.wikiLink = "";
          this.mapLink = "";
          this.accessLink =
            "https://chat.diglife.com/technology-crew/channels/sysadmin";
          break;

        default:
      }
      // For now, we check if the cookie has been set, then open the app
      // This will be tied to an API call in MM to check if user is a
      // member of the corresponding support group for this service
      // this.groups.includes("ghost-authors")
      if (this.$cookies.get("verified" + this.service.replace(" ", ""))) {
        // Access has been granted
        window.open(this.appLink, "theApp");
      } else {
        // Open dialoug to request access
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
  bottom: 10px;
}
#actions .md-button {
  margin-left: 0;
}
.md-title {
  font-size: 24px !important;
  margin-left: 0px !important;
  color: #white !important;
  fo nt-weight: bold !important;
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
