<template>
 <div class="page-container md-layout-column" >

    <md-toolbar class="md-primary">
      <md-button class="md-icon-button" @click="showNavigation = true">
        <md-icon>menu</md-icon>
      </md-button>
      <!-- Show the title and navigation path here -->
      <img src="https://diglife.com/brand/logo_primary.svg" />
      <span class="md-title">{{service ? '' : selected }} {{service}}</span>

      <div class="md-toolbar-section-end">
        <md-button @click="nav('Home')" v-bind:style="[selected == 'Home' ? {color: '#fec019'} : {color: '#fff'}]">Home</md-button>
        <md-button @click="nav('Projects')" v-bind:style="[selected == 'Projects' ? {color: '#fec019'} : {color: '#fff'}]">projects</md-button>
        <md-button @click="nav('Operations')" v-bind:style="[selected == 'Operations' ? {color: '#fec019'} : {color: '#fff'}]">ops</md-button>
        <md-button @click="nav('Friends')" v-bind:style="[selected == 'Friends' ? {color: '#fec019'} : {color: '#fff'}]">friends</md-button>
      </div>
    </md-toolbar>

   <!-- Show secondary navigation buttons -->
   <div v-if="service" style="position: absolute; right:10px; bottom:10px;">
      <md-button title="Get more help" @click="sub('wikiLink')" class="md-fab md-mini md-plain">
        <md-icon>help_outline</md-icon>
      </md-button>
      <md-button title="Open in new window" @click="sub('appLink')" class="md-fab md-mini md-plain">
        <md-icon>fullscreen</md-icon>
      </md-button>
      <md-button title="Request access" @click="sub('inviteLink')" class="md-fab md-mini md-plain">
        <md-icon>lock_open</md-icon>
      </md-button>
      <md-button title="Show more context" @click="sub('mapLink')" class="md-fab md-mini md-plain">
        <md-icon>blur_on</md-icon>
      </md-button>
   </div>

    <!-- for more info on the drawer component: https://vuematerial.io/components/drawer -->
    <md-drawer :md-active.sync="showNavigation" id="drawer">
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title">DigLife Services</span>
      </md-toolbar>

    <!-- for more info on the list component: https://vuematerial.io/components/list/ -->
      <md-list>
        <md-list-item @click="open('Chat')" v-if="selected == 'Home'">   
        <md-icon>chat</md-icon>
          <span class="md-list-item-text">DigLife Chat</span>
        </md-list-item>

        <md-list-item @click="open('Ghost Publishing')" v-if="selected == 'Home'">
        <md-icon>web</md-icon>
          <span class="md-list-item-text">DigLife Posts</span>
        </md-list-item> 

        <md-list-item @click="open('Mailtrain News')" v-if="selected == 'Operations'">
        <md-icon>email</md-icon>
          <span class="md-list-item-text">DigLife News</span>
        </md-list-item>
        
        <md-list-item @click="open('Project Chat')" v-if="selected == 'Projects'">
        <md-icon>chat</md-icon>
          <span class="md-list-item-text">Project Chat</span>
        </md-list-item>

        <md-list-item @click="open('Operations Chat')" v-if="selected == 'Operations'">
        <md-icon>chat</md-icon>
          <span class="md-list-item-text">Operations Chat</span>
        </md-list-item>

        <md-list-item @click="open('Shared Drive')" v-if="selected == 'Home'">
        <md-icon>folder</md-icon>
          <span class="md-list-item-text">Shared Drive</span>
        </md-list-item>

        <md-list-item @click="open('Decision Making')" v-if="selected == 'Home'">
        <md-icon>thumb_up</md-icon>
          <span class="md-list-item-text">Decision Making</span>
        </md-list-item>

        <md-list-item v-if="selected == 'Home'">
        <md-icon>local_library</md-icon>
          <span class="md-list-item-text">Library</span>
        </md-list-item>

        <md-list-item v-if="selected == 'Home'">
        <md-icon>event</md-icon>
          <span class="md-list-item-text">Calendar</span>
        </md-list-item>

        <md-list-item v-if="selected == 'Home'">
        <md-icon>videocam</md-icon>
          <span class="md-list-item-text">Zoom Calls</span>
        </md-list-item>

        <md-list-item @click="open('Code Editing')" v-if="selected == 'Operations'">
        <md-icon>code</md-icon>
          <span class="md-list-item-text">Code Editing</span>
        </md-list-item>

      </md-list>
    </md-drawer>

 <md-content>
      <particlesJS/>
      <img v-if="selected == 'Home'" id="logo" src="https://diglife.com/brand/logo_domain_all.svg" />
      <img v-if="selected == 'Home2'" id="logo" src="https://diglife.com/brand/logo_domain_diglife.svg" />
      <img v-if="selected == 'Projects'" id="logo" src="https://diglife.com/brand/logo_domain_project.svg" />
      <img v-if="selected == 'Operations'" id="logo" src="https://diglife.com/brand/logo_domain_ops.svg" />
      <img v-if="selected == 'Friends'" id="logo" src="https://diglife.com/brand/logo_domain_friend.svg" />
      <iframe name="theApp" id="theApp" style="display: none; width:100%; height:85vh;" frameBorder="0"></iframe>
 </md-content>


  </div>
</template>

<script>
import particlesJS from "./Particles";
export default {
  name: "Navbar",
  components: { particlesJS },
  data: () => ({
    showNavigation: false,
    showSidepanel: false,
    selected: "Home",
    service: "",
    appLink: "",
    wikiLink: "",
    mapLink: ""
  }),

  computed: {
    //https://vuejs.org/v2/guide/computed.html
  },
  methods: {
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
          window.open(this.appLink,"_blank")
         break;
      case "wikiLink":
          window.open(this.wikiLink, "theApp");
        break;
      case "mapLink":
          window.open(this.mapLink, "theApp");
        break;
      }
     },
    open: function(menu) {
      document.getElementById("drawer").classList.remove("md-active");
      this.service = menu;
      var element = document.getElementById("logo");
      element.style.display = "none";

      element = document.getElementById("particles-js");
      element.style.display = "none";

      element = document.getElementById("theApp");
      element.style.display = "block";

      switch (menu) {
        case "Chat":
         this.appLink = "https://chat.diglife.com/the-collective/channels/collective-open-chat";
         this.wikiLink = "";
         this.mapLink = "";
          window.open( this.appLink, "theApp");
         break;
        case "Project Chat":
         this.appLink = "https://chat.diglife.com/the-collective/channels/collective-open-chat";
         this.wikiLink = "https://docs.google.com/document/d/10WLH45PCo952P1L6lLryrw1IMk0JtwWjFkC0E5HukAY/view";
         this.mapLink = "";
          window.open( this.appLink, "theApp");
         break;
        case "Operations Chat":
         this.appLink = "https://chat.diglife.com/the-collective/channels/collective-open-chat";
         this.wikiLink = "https://docs.google.com/document/d/10WLH45PCo952P1L6lLryrw1IMk0JtwWjFkC0E5HukAY/view";
         this.mapLink = "";
          window.open( this.appLink, "theApp");
         break;
        case "Shared Drive":
         this.appLink = "https://drive.google.com/embeddedfolderview?id=0B_zdMVo5TxZQS0dmYlhXaUJIams";
         this.wikiLink = "";
         this.mapLink = "";
          window.open( this.appLink, "theApp");
         break;
        case "Ghost Publishing":
         this.appLink = "https://diglife.com/ghost";
         this.wikiLink = "";
         this.mapLink = "";
          window.open( this.appLink, "theApp");
         break;
        case "Mailtrain News":
         this.appLink = "https://mailtrain.diglife.com/";
         this.wikiLink = "";
         this.mapLink = "";
          window.open( this.appLink, "theApp");
         break;
        case "Decision Making":
         this.appLink = "https://tree.taiga.io/project/sceenius-digital-life-collective/issues?type=857455,857456&order_by=type";
         this.wikiLink = "";
         this.mapLink = "";
          window.open( this.appLink, "theApp");
         break;
        case "Code Editing":
         this.appLink = "https://codesandbox.io/s/mok0knm7l9";
         this.wikiLink = "";
         this.mapLink = "";
          window.open( this.appLink, "theApp");
         break;
      }
    }
  }
};
</script>

<style>

.md-title {
  font-size: 24px !important;
  margin-left: 0px !important;
  color: #404040 !important;
  font-weight: bold !important;
}
.md-toolbar {
  background-color: #00b0a0 !important;
}

.md-toolbar img {
  height: 55px !important;
}

.md-fab {
  background-color: #fec019 !important;
}

.md-icon {
    color: #404040 !important;
}
.md-content {  
  min-height: 90vh;
  max-height: 90vh;
}

.page-container {
  min-height: 100vh;
  max-height: 100vh;
  
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(#000, 0.12);
}

.md-content {
  padding: 16px;
}

.md-content img {
  position: absolute;
  top: 10%;
  left: 3%;
  width: 60vh;
  height: 60vh;
}
</style>
