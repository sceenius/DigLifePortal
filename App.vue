<template>
  <div class="page-container md-layout-column">
    <md-toolbar class="md-primary">
      <md-button class="md-icon-button" @click="showNavigation = true">
        <md-icon>menu</md-icon>
      </md-button>
      <span class="md-title">DigLife {{selected}} {{service}}</span>

      <div class="md-toolbar-section-end">
        <md-button @click="nav('Home')" v-bind:style="[selected == 'Home' ? {color: '#fec019'} : {color: '#fff'}]">Home</md-button>
        <md-button @click="nav('Projects')" v-bind:style="[selected == 'Projects' ? {color: '#fec019'} : {color: '#fff'}]">Projects</md-button>
        <md-button @click="nav('Operations')" v-bind:style="[selected == 'Operations' ? {color: '#fec019'} : {color: '#fff'}]">Ops</md-button>
        <img style="height: 35px" src="https://diglife.com/brand/logo_secondary.svg" />
      </div>
    </md-toolbar>

    <!-- for more info on the drawer component: https://vuematerial.io/components/drawer -->
    <md-drawer :md-active.sync="showNavigation" id="drawer">
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title">DigLife Services</span>
      </md-toolbar>

    <!-- for more info on the list component: https://vuematerial.io/components/list/ -->
      <md-list>
        <md-list-item @click="open('chat')" v-if="selected == 'Home'">   
        <md-icon>chat</md-icon>
          <span class="md-list-item-text">Chat</span>
        </md-list-item>

        <md-list-item @click="open('projects')" v-if="selected == 'Projects'">
        <md-icon>assignment</md-icon>
          <span class="md-list-item-text">Projects</span>
        </md-list-item>

        <md-list-item @click="open('operations')" v-if="selected == 'Operations'">
        <md-icon>build</md-icon>
          <span class="md-list-item-text">Operations</span>
        </md-list-item>

        <md-list-item @click="open('folder')" v-if="selected == 'Home'">
        <md-icon>folder</md-icon>
          <span class="md-list-item-text">Shared Drive</span>
        </md-list-item>

        <md-list-item @click="open('governance')" v-if="selected == 'Home'">
        <md-icon>thumb_up</md-icon>
          <span class="md-list-item-text">Governance</span>
        </md-list-item>

        <md-list-item @click="open('publishing')" v-if="selected == 'Operations'">
        <md-icon>web</md-icon>
          <span class="md-list-item-text">Publishing</span>
        </md-list-item> 

        <md-list-item @click="open('newsletters')" v-if="selected == 'Operations'">
        <md-icon>email</md-icon>
          <span class="md-list-item-text">Newsletters</span>
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
      <iframe name="theApp" id="theApp" style="width:100%; height:100%;" frameBorder="0"></iframe>
    </md-content>
  </div>
</template>

<script>
  import particlesJS from './components/Particles'
  export default {
    name: 'Temporary',
    components: { particlesJS },
    data: () => ({
      showNavigation: false,
      showSidepanel: false,
      selected: 'Home',
      service: ''
    }),
    methods: { 
    nav: function (menu) {
      this.selected = menu;
      this.service = '';
    },
    open: function (menu) {
      document.getElementById("drawer").classList.remove('md-active');
      this.service = menu.charAt(0).toUpperCase() + menu.substring(1);
      var element = document.getElementById("logo");
      if(element !== null) { element.parentNode.removeChild(element); }
      element = document.getElementById("particles-js");
      if(element !== null) { element.parentNode.removeChild(element); }
      switch(menu) {
        case "chat":
           window.open('https://chat.diglife.com/the-collective/channels/collective-open-chat', "theApp");
        break;
        case "projects":
           window.open('https://chat.diglife.com/the-collective/channels/collective-open-chat', "theApp");
        break;
        case "operations":
           window.open('https://chat.diglife.com/the-collective/channels/collective-open-chat', "theApp");
        break;
        case "folder":
           window.open('https://drive.google.com/embeddedfolderview?id=0B_zdMVo5TxZQS0dmYlhXaUJIams#list', "theApp");
        break;
        case "publishing":
           window.open('https://diglife.com/ghost', "theApp");
        break;
        case "newsletters":
           window.open('https://mailtrain.diglife.com/', "theApp");
        break;
        case "governance":
           window.open('https://tree.taiga.io/project/sceenius-digital-life-collective/issues?type=857455,857456&order_by=type', "_blank");
        break;
        case "coding":
           window.open('https://codesandbox.io/s/984253v014', "theApp");
        break;


        

      }
    }
  }
  }
</script>

<style lang="scss" scoped>

  .page-container {
    min-height: 300px;
    overflow: hidden;
    position: relative;
    border: 1px solid rgba(#000, .12);
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
