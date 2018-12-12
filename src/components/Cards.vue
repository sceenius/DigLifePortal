<template>
  <div class="md-layout md-gutter" v-if="service == ''">
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
      <md-button class="md-primary" @click="showSnackbar = false;"
        >Dismiss</md-button
      >
    </md-snackbar>

    <!--
      ----------------------------------------------------------------------
        DIALOG BOXES - LOGIN DIALOG
      ----------------------------------------------------------------------
    -->
    <md-button
      v-if="!activeTopic"
      @click="createCard();"
      class="md-fab md-primary"
      style="position: absolute; bottom: 20px; right: 20px; z-index: 99"
    >
      <md-icon>add</md-icon>
    </md-button>

    <md-dialog
      :md-close-on-esc="false"
      :md-click-outside-to-close="false"
      :md-active.sync="activeTopic"
    >
      <md-dialog-title
        ><md-icon style="color: black;">group_work</md-icon> {{ mode }} Interest
        Group</md-dialog-title
      >
      <div style="padding: 0 25px ;">
        <md-field id="display_name">
          <label>Title</label>
          <md-input
            v-on:keyup="slug"
            v-model="display_name"
            required
          ></md-input>
          <span class="md-helper-text"
            >Enter the name of this Interest Group</span
          >
          <span class="md-error">This field cannot be blank</span>
        </md-field>

        <md-field id="name">
          <label>Slug</label>
          <md-input v-model="name" required></md-input>
          <span class="md-helper-text"
            >Unique name as it appears in the URL</span
          >
          <span class="md-error">This field cannot be blank</span>
        </md-field>

        <md-field>
          <label>Icon</label>
          <md-input v-model="icon" required></md-input>
          <span class="md-helper-text"
            >Pick an icon
            <a
              href="https://material.io/tools/icons/?style=baseline"
              target="icons"
              >from this list</a
            ></span
          >
          <span class="md-error"></span>
          <md-icon>{{ icon }}</md-icon>
        </md-field>

        <md-field>
          <label>Description</label>
          <md-textarea
            style="font-size: 0.9em;"
            v-model="header"
            required
          ></md-textarea>
          <span class="md-helper-text"
            >Enter a short description for this Interest Group</span
          >
          <span class="md-error"></span>
        </md-field>

        <vue-tags-input
          style="margin-top: 50px;"
          required
          v-model="tag"
          @tags-changed="newTags => (formtags = newTags)"
          :tags="formtags"
          :allow-edit-tags="true"
          :autocomplete-items="autocompleteItems"
        >
        </vue-tags-input>

        <md-dialog-actions style="padding: 25px 0;">
          <md-button class="md-success md-raised" @click="activeTopic = false;"
            >Cancel</md-button
          >
          <md-button
            v-if="mode == 'Edit'"
            class="md-success md-raised"
            @click="onConfirm();"
            style="background: #00b0a0; color: white;"
            >Update</md-button
          >
          <md-button
            v-if="mode == 'Create'"
            class="md-success md-raised"
            @click="onConfirm();"
            style="background: #00b0a0; color: white;"
            >Create</md-button
          >
        </md-dialog-actions>
      </div>
    </md-dialog>

    <!--
      ----------------------------------------------------------------------
        CARDS
      ----------------------------------------------------------------------
    -->
    <md-card
      md-with-hover
      v-if="(showServices && isMember(topic)) || !showServices"
      v-for="(topic, index) in topics"
      :key="index"
      class="md-layout-item"
    >
      <div class="md-card-banner">
        <md-menu>
          <md-button
            style="font-size: 0.8em; position: absolute; top:-5px; left: -5px;"
            class="md-icon-button"
            md-menu-trigger
          >
            <md-icon style="font-size: 1.8em !important; color: white;"
              >menu</md-icon
            >
          </md-button>

          <md-menu-content class="md-card-menu">
            <md-menu-item @click="editCard(topic);">
              <md-icon>edit</md-icon>
              <span>Edit</span>
            </md-menu-item>

            <md-menu-item @click="deleteCard(topic);">
              <md-icon>archive</md-icon>
              <span>Archive</span>
            </md-menu-item>
          </md-menu-content>
        </md-menu>

        <div class="md-subhead">Interest & Research Group</div>
        <img
          style="width: 20px; position: absolute; top: 5px; right: 2px; "
          src="https://ledger.diglife.coop/images/brand/logo_secondary.svg"
        />
      </div>

      <div class="md-card-header">
        <md-card-header-text>
          <div class="md-title">
            <md-icon
              style="line-height: 0.9; font-size: 1em !important; color: #404040;"
              >{{ topic.purpose.icon }}</md-icon
            >
            {{ topic.display_name.replace("#", "") }}
          </div>
        </md-card-header-text>

        <md-chip style="background-color: green" v-if="isMember(topic)"
          >Joined</md-chip
        >
        <md-chip
          style="background-color: orange"
          v-if="isSuggested(topic) && !isMember(topic)"
          >Suggested</md-chip
        >
        <md-chip
          style="background-color: #ccc"
          v-if="!isMember(topic) && !isSuggested(topic)"
          >Not Joined</md-chip
        >
      </div>

      <div class="md-card-mid">
        <p class="info">
          <vue-markdown>{{
            topic.header.replace(/^(.{280}[^\s]*).*/, "$1...")
          }}</vue-markdown>
        </p>
      </div>

      <md-card-actions>
        <md-button v-if="isMember(topic)" @click="cardAction('leave', topic);"
          >Leave</md-button
        >
        <md-button
          v-if="isMember(topic)"
          style="background: #00b0a0; color: white;"
          @click="cardAction('open', topic);"
          >Open</md-button
        >
        <md-button v-if="!isMember(topic)" @click="cardAction('ask', topic);"
          >Ask</md-button
        >
        <md-button
          v-if="!isMember(topic)"
          style="background: #00b0a0; color: white;"
          @click="cardAction('join', topic);"
          >Join</md-button
        >
      </md-card-actions>

      <div class="md-card-footer">
        <div class="md-card-avatars md-scrollbar">
          <md-avatar v-for="(member, index) in topic.members" :key="index">
            <img
              v-bind:title="member"
              v-bind:src="avatarLink(member)"
              alt="Avatar"
            />
          </md-avatar>
        </div>
      </div>
    </md-card>
  </div>
</template>

<script>
import VueTagsInput from "@johmun/vue-tags-input";
import VueMarkdown from "vue-markdown";
import Slack from "node-slack";
import Slugify from "slugify";
import _ from "lodash/fp/object"; //lodash/fp/object for objects only
import { BASEURL, CHATURL } from "/constants.js";
import db from "@/firebase/init";
//import topics from "@/components/navbar";

export default {
  name: "Tags",
  components: { VueTagsInput, VueMarkdown },
  data() {
    return {
      service: "",
      tag: "",
      mode: "", // Edit or Create mode for dialog
      script: "", // Edit or Create script for execution
      showServices: false,
      showCardNavigation: false,
      activeTopic: false,
      showSnackBar: false,
      snack: "",
      result: "",
      status: "",
      topics: [],
      groups: [],
      tags: [],
      autocompleteItems: [
        { text: "Accessibility", frequency: 5 },
        { text: "Accounting", frequency: 2 },
        { text: "Administration", frequency: 4 },
        { text: "Artificial Intelligence", frequency: 5 },
        { text: "Authentication", frequency: 7 },
        { text: "Automation", frequency: 4 },
        { text: "Biometrics", frequency: 10 },
        { text: "Bitcoin", frequency: 10 }
      ],
      channel_id: "",
      display_name: "",
      name: "", //Slugify(this.display_name),
      header: "",
      icon: "",
      formtags: [],
      username: ""
    };
  },
  ///////////////////////////////////////////////////////////////////////////////
  //  CREATED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  created: function() {
    this.username = this.$cookies.get("username");

    let prefsRef = db
      .database()
      .ref("portal_profiles/" + this.$cookies.get("username") + "/prefs");
    prefsRef.on("child_added", pref => {
      if (pref.key === "showServices") {
        this.showServices = pref.val();
      }
    });

    prefsRef.on("child_changed", pref => {
      if (pref.key === "showServices") {
        this.showServices = pref.val();
      }
    });

    let channelsRef = db.database().ref("portal_channels");
    // porta_extensions contains any channel info not stored in Mattermost
    let extensionsRef = db.database().ref("portal_extensions");
    channelsRef.on("child_added", channel => {
      var data = channel.val();
      if (data.display_name.charAt(0) === "#") {
        extensionsRef.child(data.channel_id).once("value", extension => {
          if (extension.exists()) {
            data = _.merge(data, extension.val());
          }
          this.topics.push(data);
          this.topics.sort(SortByName);
        });
      }
    });
    channelsRef.on("child_changed", channel => {
      let data = channel.val();
      this.topics.forEach(function(element, index, arr) {
        if (element.channel_id === data.channel_id) {
          // lodash function to merge objects recursively
          arr[index] = _.merge(arr[index], data);
        }
      });

      //this.topics[i].display_name = channel.val().display_name;
    });

    //this.$forceUpdate();

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
          this.groups = data;
        } else if (group.key === "tags") {
          this.tags = data.reduce((accumulator, currentValue) => {
            return [...accumulator, currentValue.text];
          });
        }
        //console.log("New Groups: "+group.key, this.groups);
      });
    }

    // Cookies are strings, so need to convert to boolean!
    // need to find a place to save cookie (e.g. My Settings)
    // this.showServices = this.$cookies.get("showServices");
    // if (this.showServices === "true") {
    //   this.showServices = true;
    // } else {
    //   this.showServices = false;
    // }
  },
  ///////////////////////////////////////////////////////////////////////////////
  //  COMPUTED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  computed: {
    invalidate: function() {
      return this.invalid === true ? "md-invalid" : "";
    }
  },
  ///////////////////////////////////////////////////////////////////////////////
  //  METHODS - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  methods: {
    // is member
    isMember: function(topic) {
      return JSON.stringify(this.groups).includes(
        topic.team + "/" + topic.name
      );
    },
    // is suggested
    isSuggested: function(topic) {
      if (topic.purpose.tags) {
        //alert(this.tags);
        return this.tags.filter(
          value => -1 !== topic.purpose.tags.indexOf(value)
        ).length;
      } else {
        return false;
      }
    },

    slug: function() {
      //if (this.mode === "Create") {
      this.name = Slugify(this.display_name, { lower: true });
      //}
    },
    // compute v-bind:src for img
    avatarLink: function(username) {
      return BASEURL + "images/avatars/avatar_" + username + ".png";
    },

    // create card
    createCard: function(topic) {
      // all interest groups created in the diglife domain
      this.team_id = this.topics[0].team_id;
      this.channel_id = "";
      this.display_name = "";
      this.name = "";
      this.icon = "";
      this.header = "";
      this.formtags = [];
      this.mode = "Create";
      // this.formtags = topic.purpose.tags.map(function(element) {
      //   return { text: element };
      //});
      this.activeTopic = true;
    },

    // edit card
    editCard: function(topic) {
      //alert(topic.purpose.tags);
      this.team_id = topic.team_id;
      this.channel_id = topic.channel_id;
      this.display_name = topic.display_name;
      this.name = topic.name;
      this.icon = topic.purpose.icon;
      this.header = topic.header;
      this.formtags = topic.purpose.tags;
      this.mode = "Edit";
      // this.formtags = topic.purpose.tags.map(function(element) {
      //   return { text: element };
      //});
      this.activeTopic = true;
    },

    // submit card edits
    onConfirm: function() {
      // error validation
      if (this.display_name === "") {
        document.getElementById("display_name").classList.add("md-invalid");
      } else if (this.name === "") {
        document.getElementById("name").classList.add("md-invalid");
      } else {
        if (this.mode === "Edit") {
          this.script = "portal_update_channel.php";
        } else if (this.mode === "Create") {
          this.script = "portal_create_channel.php";
        }
        if (this.display_name[0] !== "#") {
          this.display_name = "#" + this.display_name;
        }
        this.axios
          .get(
            BASEURL +
              "webhooks/" +
              this.script +
              "?file=base-diglife-coop.php" +
              "&channel_id=" +
              this.channel_id +
              "&team_id=" +
              this.team_id +
              "&display_name=" +
              this.display_name.replace("#", "%23") +
              "&name=" +
              this.name +
              "&header=" +
              encodeURI(this.header) +
              "&icon=" +
              this.icon +
              "&tags=" +
              JSON.stringify(this.formtags)
          )
          .then(response => (this.channel = response.data))
          //.then(response => console.log(this.channel))
          .then(response => {
            if (this.channel.status_code) {
              this.showSnackBar = true;
              this.snack =
                "Mattermost Error (" +
                this.channel.status_code +
                "): " +
                this.channel.message;
            }
          })
          .then(response =>
            db
              .database()
              .ref("portal_channels/" + this.channel.id)
              .update({
                name: this.channel.name,
                display_name: this.channel.display_name,
                header: this.channel.header,
                purpose: JSON.parse(this.channel.purpose)
              })
          )
          .then(response => {
            this.showSnackBar = true;
            this.snack = "This card has been successfully updated.";
          })
          .catch(error => {
            this.showSnackBar = true;
            this.snack = "Network Error, please try again later.";
          });

        this.activeTopic = false;
      }
    },

    // execute card action
    cardAction: function(action, topic) {
      switch (action) {
        case "join":
          // join channel
          this.axios
            .get(
              BASEURL +
                "webhooks/portal_join_channel.php?file=base-diglife-coop.php&username=" +
                this.$cookies.get("username") +
                "&channel_id=" +
                topic.channel_id
            )
            .then(response => (this.result = response.data))
            .then(response => this.groups.push(topic.team + "/" + topic.name))
            .then(response =>
              topic.members.push(this.$cookies.get("username"))
            );
          break;
        case "open":
          window.open(topic.purpose.link, topic.name);
          break;
        case "ask":
          let question = prompt("Please ask your question", "Ask the Expert");

          var slack = new Slack(CHATURL + "hooks/" + topic.purpose.hook);
          var err = slack.send({
            text:
              "##### :question: Question from @" +
              this.username +
              "\n" +
              question +
              "\n_Tip: you can respond via a direct message or invite the user into this channel._",
            channel: topic.name,
            username: "ledgerbot",
            icon_url: "https://diglife.com/brand/logo_secondary_dark.svg",
            unfurl_links: true,
            link_names: 1
          });
          this.snack = "Thank You. Your question has been submitted.";
          this.showSnackBar = true;

          break;
        case "leave":
          // leave channel
          this.axios
            .get(
              BASEURL +
                "webhooks/portal_leave_channel.php?file=base-diglife-coop.php&username=" +
                this.$cookies.get("username") +
                "&channel_id=" +
                topic.channel_id
            )
            .then(response => (this.result = response.data))
            .then(response =>
              this.groups.splice(
                this.groups.indexOf(topic.team + "/" + topic.name),
                1
              )
            )
            .then(response =>
              topic.members.splice(
                topic.members.indexOf(this.$cookies.get("username")),
                1
              )
            );
          break;
        default:
      }
    }
  }
};
</script>

<style>
.md-dialog {
  width: 400px;
  height: 680px;
  overflow: auto;
}
.md-card {
  width: 250px;
  min-width: 250px;
  max-width: 250px;
  height: 350px;
  max-height: 350px;
  margin: 20px 0 0 20px;
  display: inline-block;
  vertical-align: top;
  background-color: #eee !important;
  cursor: default !important;
}

.md-card-banner {
  position: absolute;
  left: 0;
  top: 0;
  padding: 5px;
  width: 100%;
  color: white;
  max-height: 30px;
  background-color: #00b0a0;
  overflow: hide;
}

.md-card-header {
  position: absolute;
  height: 86px;
  width: 100%;
  background-color: #e2e2e2;
  top: 30px;
  left: 0px;
  padding: 10px;
}

.md-card .md-chip {
  position: absolute;
  top: 35px;
  right: 5px;
  background-color: #fc5f61;
  color: white;
  margin: 10px 0 0 0;
  padding: 0px 20px 0px 20px;
  font-size: 0.9em;
}
.md-card-mid {
  position: absolute;
  width: 100%;
  top: 110px;
  left: 0px;
  padding: 10px;
}

.md-card .md-title {
  font-weight: bold;
  font-size: 1.8em !important;
  color: #404040;
  line-height: 0.9em;
  width: 100% !important;
}

.md-card .md-subhead {
  position: absolute;
  top: 6px;
  left: 35px;
  margin: 0;
  padding: 0;
  opacity: 1;
}

.md-card-footer {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  max-height: 60px;
  background-color: #e2e2e2;
  overflow: hide;
}

.md-card-avatars {
  max-height: 60px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}

.md-card-avatars::-webkit-scrollbar {
  width: 5px;
  display: none;
}

.md-card-avatars:hover::-webkit-scrollbar {
  display: block;
}

/* Track */
.md-card-avatars::-webkit-scrollbar-track {
  border-radius: 5px;
}

/* Handle */
.md-card-avatars::-webkit-scrollbar-thumb {
  background: #bbb;
  border-radius: 5px;
}

.md-card-actions {
  position: absolute;
  bottom: 60px;
  right: 0px;
}
.md-card .md-avatar {
  margin: 10px 0px 10px 4px;
  border: 1px #ccc solid;
}

.md-card-media img {
  position: absolute;
  left: 0px;
  top: 10px;
  width: 40%;
  overflow: hidden;
}

.md-card:hover {
  opacity: 1;
}

.md-card .info {
  color: #404040;
  margin: -5px 0 0 0;
  line-height: 1.2em;
  font-size: 0.9em;
}

.md-card .info .md-icon {
  font-size: 1.4em !important;
}

li.tag {
  height: 34px !important;
  padding: 0 10px !important;
  background-color: #00b0a0 !important;
  border-radius: 40px !important;
  font-size: 15px !important;
  line-height: 34px !important;
  vertical-align: middle !important;
  white-space: nowrap !important;
}

.md-card-menu .md-list-item-content {
  min-height: 20px !important;
  padding: 5px;
}

.md-card-menu .md-menu-item span {
  font-size: 0.9em !important;
  position: absolute;
  left: 40px;
}

.md-card-menu .md-menu-item .md-icon {
  font-size: 1.4em !important;
}

.md-card-menu {
  margin-top: 11px;
}

.md-field {
  margin-bottom: 35px;
}
</style>
