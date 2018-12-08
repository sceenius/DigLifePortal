<template>
  <div class="md-layout md-gutter" v-if="service == ''">
    <!--
      ----------------------------------------------------------------------
        DIALOG BOXES - LOGIN DIALOG
      ----------------------------------------------------------------------
    -->
    <md-button
      @click="activeTopic = true;"
      class="md-fab md-primary"
      style="position: absolute; bottom: 20px; right: 20px; z-index: 99"
    >
      <md-icon>add</md-icon>
    </md-button>
    <md-dialog
      :md-close-on-esc="false"
      :md-click-outside-to-close="false"
      :md-active.sync="activeTopic"
      style="width: 400px; height: 600px"
    >
      <md-dialog-title
        ><md-icon style="color: black;">group_work</md-icon> Create Interest
        Group</md-dialog-title
      >
      <div style="padding: 0 25px ;">
        <md-field>
          <label>Title</label>
          <md-input v-model="display_name" required></md-input>
          <span class="md-helper-text"
            >Enter the name of this Interest Group</span
          >
          <span class="md-error"></span>
        </md-field>

        <md-field>
          <label>URL</label>
          <md-input v-model="name" required></md-input>
          <span class="md-helper-text"
            >Enter your URL of this Interest Group</span
          >
          <span class="md-error"></span>
        </md-field>

        <md-field>
          <label>Description</label>
          <md-textarea v-model="header"></md-textarea>
          <span class="md-helper-text"
            >Enter a short description for this Interest Group</span
          >
          <span class="md-error"></span>
        </md-field>

        <vue-tags-input
          style="margin-top: 50px;"
          required
          v-model="tag"
          :formtags="formtags"
          :allow-edit-tags="true"
          :autocomplete-items="autocompleteItems"
        >
        </vue-tags-input>

        <md-dialog-actions style="padding: 25px 0;">
          <md-button class="md-success md-raised" @click="activeTopic = false;"
            >Cancel</md-button
          >
          <md-button
            class="md-success md-raised"
            @click="onConfirm();"
            style="background: #00b0a0; color: white;"
            ><md-icon style="color: white;">group_work</md-icon>
            Create</md-button
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
        <md-button
          class="md-icon-button"
          @click="showCardNavigation = true;"
          style="font-size: 0.8em; position: absolute; top:-5px; left: -5px;"
        >
          <md-icon style="font-size: 0.8em; color: white;"">menu</md-icon>
        </md-button>

        <div class="md-subhead" style="margin: 1px 0 0 35px; opacity: 1;">Interest & Research Group</div>
        <img
          style="width: 25px; position: absolute; top: 2px; right: 0px; "
          src="https://diglife.com/brand/logo_secondary.svg"
        />
              </div>
      <div class="md-card-header">
        <md-card-header-text st yle="margin-top: -5px;">
          <div class="md-title">{{ topic.display_name.replace("#", "") }}</div>
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
      <!--
        md-card-media md-medium>
          <img
            src="https://ledger.diglife.coop/images/cards/card_chemistry.svg"
            alt="People"
          />
        </md-card-media
      -->

      <div class="md-card-mid">
        <p class="info" v-if="topic.purpose.tags">
          <md-icon>local_offer</md-icon>
          {{
            topic.purpose.tags
              .toString()
              .replace(/[!#*@%/.><"'\\&]/, "")
              .replace(/[,]/g, ", ")
          }}
        </p>
        <p class="info">
          <md-icon>question_answer</md-icon>
          {{ topic.total_msg_count }} message<span
            v-if="topic.total_msg_count > 1"
            >s</span
          >
          posted in channel
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
        <md-button
          v-if="!isMember(topic)"
          style="background: #00b0a0; color: white;"
          @click="cardAction('join', topic);"
          >Join</md-button
        >
      </md-card-actions>
      <div class="md-card-footer">
        <div class="md-card-avatars md-scrollbar">
          <!--
            md-avatar style="border: 2px solid yellow;">
              <img
                title="Creator"
                v-bind:src="avatarLink(topic.creator)"
                alt="Avatar"
              />
            </md-avatar
          -->
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
import { BASEURL, CHATURL } from "/constants.js";
import db from "@/firebase/init";
//import topics from "@/components/navbar";

export default {
  name: "Tags",
  components: { VueTagsInput },
  data() {
    return {
      service: "",
      tag: "",
      showServices: false,
      activeTopic: false,
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
      display_name: "",
      name: "",
      header: "",
      formtags: ""
    };
  },
  ///////////////////////////////////////////////////////////////////////////////
  //  CREATED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  created: function() {
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
    channelsRef.on("child_added", channel => {
      let data = channel.val();
      if (data.display_name.charAt(0) === "#") {
        this.topics.push(data);
        this.topics.sort(SortByName);
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
  computed: {},
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
    // compute v-bind:src for img
    avatarLink: function(username) {
      return BASEURL + "images/avatars/avatar_" + username + ".png";
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
.md-card {
  width: 240px;
  min-width: 240px;
  max-width: 240px;
  height: 320px;
  max-height: 320px;
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
  height: 90px;
  width: 100%;
  background-color: #e2e2e2;
  top: 30px; left: 0px;
  padding: 10px;
}

.md-card .md-chip {
  position: absolute;
  top: 35px; right: 5px;
  background-color: #fc5f61;
  color: white;
  margin: 10px 0 0 0;
  padding: 0px 20px 0px 20px;
  font-size: 0.9em;
  font-wei ght: bold;
}
.md-card-mid {
  position: absolute; 
  width: 100%;
  top: 120px; left: 0px;
  padding: 10px;
}

.md-card .md-title {
  font-weight: bold;
  font-size: 1.8em !important;
  line-height: 1em;
  margin-bottom: 5px;
  width: 200px !important;
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
  color: gray;
  margin: 0 0 8px 0;
  line-height: 1em;
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
</style>
