<template>
 <div class="page-container md-layout-column">

    <md-toolbar class="md-primary">
      <md-button class="md-icon-button" @click="showNavigation = true">
        <md-icon>menu</md-icon>
      </md-button>
      <!-- Show the title and navigation path here -->
      <span class="md-title">DigLife {{service ? '' : selected }} {{service}}</span>

      <div class="md-toolbar-section-end">
        <md-button @click="nav('Home')" v-bind:style="[selected == 'Home' ? {color: '#fec019'} : {color: '#fff'}]">Home</md-button>
        <md-button @click="nav('Projects')" v-bind:style="[selected == 'Projects' ? {color: '#fec019'} : {color: '#fff'}]">Projects</md-button>
        <md-button @click="nav('Operations')" v-bind:style="[selected == 'Operations' ? {color: '#fec019'} : {color: '#fff'}]">Ops</md-button>
        <img style="height: 35px" src="https://diglife.com/brand/logo_secondary.svg" />
      </div>
    </md-toolbar>

   <!-- Show secondary navigation buttons -->
   <div v-if="service" style="position: absolute; right:15px; bottom:0px;">
      <md-button @click="sub('wikiLink')" class="md-fab md-mini md-plain">
        <md-icon>language</md-icon>
      </md-button>
      <md-button @click="sub('appLink')" class="md-fab md-mini md-plain">
        <md-icon>fullscreen</md-icon>
      </md-button>
      <md-button @click="sub('mapLink')" class="md-fab md-mini md-plain">
        <md-icon>map</md-icon>
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

        <md-list-item @click="open('Shared Folder')" v-if="selected == 'Home'">
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

        <md-list-item @click="open('coding')" v-if="selected == 'Operations'">
        <md-icon>code</md-icon>
          <span class="md-list-item-text">Coding</span>
        </md-list-item>

      </md-list>
    </md-drawer>

    <md-content style="height: 800px;">
      <particlesJS/>
      <img id="logo" width=50% src="https://diglife.com/brand/logo_primary.svg" />
      <iframe name="theApp" id="theApp" style="width:100%; height:95%;" frameBorder="0"></iframe>
  
  
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
      if (element !== null) {
        element.parentNode.removeChild(element);
      }
      element = document.getElementById("particles-js");
      if (element !== null) {
        element.parentNode.removeChild(element);
      }
      switch (menu) {
        case "Chat":
         this.appLink = "https://chat.diglife.com/the-collective/channels/collective-open-chat";
         this.wikiLink = "";
         this.mapLink = "";
          window.open( this.appLink, "theApp");
         break;
        case "Project Chat":
         this.appLink = "https://chat.diglife.com/the-collective/channels/collective-open-chat";
         this.wikiLink = "";
         this.mapLink = "";
          window.open( this.appLink, "theApp");
         break;
        case "Operations Chat":
         this.appLink = "https://chat.diglife.com/the-collective/channels/collective-open-chat";
         this.wikiLink = "";
         this.mapLink = "";
          window.open( this.appLink, "theApp");
         break;
        case "Shared Folder":
         this.appLink = "https://drive.google.com/embeddedfolderview?id=0B_zdMVo5TxZQS0dmYlhXaUJIams#list";
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
        case "Taiga Governance":
         this.appLink = "https://tree.taiga.io/project/sceenius-digital-life-collective/issues?type=857455,857456&order_by=type";
         this.wikiLink = "";
         this.mapLink = "";
          window.open( this.appLink, "theApp");
         break;
        case "CodeSandBox Editing":
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
.page-container {
  min-height: 300px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(#000, 0.12);
}

// Demo purposes only
.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}

.md-content {
  padding: 16px;
}

.md-content img {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 500px;
  margin-top: -250px; /* Half the height */
  margin-left: -250px; /* Half the width */
}
</style>
