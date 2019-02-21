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
        DIALOG BOXES - EDIT CARD
      ----------------------------------------------------------------------
    -->
    <md-button
      v-if="!activeDialogTopic"
      @click="createCard();"
      class="md-fab md-primary"
      style="position: absolute; bottom: 20px; right: 20px; z-index: 99"
    >
      <md-icon>add</md-icon>
    </md-button>

    <md-dialog
      :md-close-on-esc="false"
      :md-click-outside-to-close="false"
      :md-active.sync="activeDialogTopic"
    >
      <md-dialog-title
        ><md-icon style="color: black;">group_work</md-icon> {{ mode }} Interest
        Group</md-dialog-title
      >

      <!-- https://vuematerial.io/components/form name="dialog.cardForm" -->
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
          <span class="md-error">This field cannot be blank</span>
        </md-field>

        <md-field id="formtags">
          <vue-tags-input
            :validation="validation"
            style="ma rgin-top: 50px; width: 100%; border: 0px"
            required="true"
            v-model="tag"
            @tags-changed="newTags => (formtags = newTags)"
            :tags="formtags"
            :allow-edit-tags="true"
            :autocomplete-items="autocompleteItems"
          >
          </vue-tags-input>
          <span class="md-helper-text">Enter one or more tags</span>
          <span class="md-error">This field cannot be blank</span>
        </md-field>

        <md-dialog-actions style="padding: 25px 0;">
          <md-button
            class="md-success md-raised"
            @click="activeDialogTopic = false;"
            >Cancel</md-button
          >
          <md-button
            v-if="mode == 'Edit'"
            class="md-success md-raised"
            @click="onConfirm(formindex);"
            style="background: #00B0A0; color: white;"
            >Update</md-button
          >
          <md-button
            v-if="mode == 'Create'"
            class="md-success md-raised"
            @click="onConfirm();"
            style="background: #00B0A0; color: white;"
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
    <sequential-entrance>
      <md-card
        md-with-hover
        v-if="(showServices && isMember(topic)) || !showServices"
        v-for="(topic, index) in topics"
        :key="index"
        class="md-layout-item"
      >
        <div class="md-card-banner">
          <md-menu>
            <md-button class="md-icon-button" md-menu-trigger>
              <md-icon style="font-size: 1.8em !important; color: white;"
                >menu</md-icon
              >
            </md-button>

            <md-menu-content class="md-card-menu">
              <md-menu-item @click="editCard(topic, index);">
                <md-icon>edit</md-icon>
                <span>Edit</span>
              </md-menu-item>

              <md-menu-item @click="deleteCard(topic);">
                <md-icon>archive</md-icon>
                <span>Archive</span>
              </md-menu-item>
            </md-menu-content>
          </md-menu>

          <div class="md-subhead">Conversation</div>
          <img
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
              {{ topic.display_name.replace(/[!#*@%/."'\\&]/, "") }}
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
            style="background: #00B0A0; color: white;"
            @click="cardAction('open', topic);"
            >Open</md-button
          >
          <md-button v-if="!isMember(topic)" @click="cardAction('ask', topic);"
            >Ask</md-button
          >
          <md-button
            v-if="!isMember(topic)"
            style="background: #00B0A0; color: white;"
            @click="cardAction('join', topic);"
            >Join</md-button
          >
        </md-card-actions>

        <div class="md-card-footer">
          <div class="md-card-avatars md-scrollbar">
            <md-avatar v-for="(member, index) in topic.members" :key="index">
              <img v-bind:src="avatarLink(member)" alt="Avatar" />
              <md-tooltip md-direction="top">{{ member }}</md-tooltip>
            </md-avatar>
          </div>
        </div>
      </md-card>
    </sequential-entrance>
  </div>
</template>

<script>
import VueTagsInput from "@johmun/vue-tags-input";
import VueMarkdown from "vue-markdown";
import Slack from "node-slack";
import Slugify from "slugify";
import _ from "lodash/fp/object"; //lodash/fp/object for objects only
import { BASEURL, CHATURL } from "../../index.js";
import db from "../firebase/init.js";

export default {
  name: "Tags",
  components: { VueTagsInput, VueMarkdown },
  props: ["domain", "type"],
  data() {
    return {
      service: "",
      tag: "",
      mode: "", // Edit or Create mode for dialog
      script: "", // Edit or Create script for execution
      showServices: false,
      showCardNavigation: false,
      activeDialogTopic: false,
      showSnackBar: false,
      snack: "",
      result: "",
      status: "",
      topics: [],
      topics2: [],
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
      formindex: "",
      username: "",
      validation: [
        {
          type: "min-length",
          rule: /^.{3,}$/,
          disableAdd: true
        },
        {
          type: "no-numbers",
          rule: /^([^0-9]*)$/
        },
        {
          type: "avoid-item",
          rule: /^(?!Cannot).*$/,
          disableAdd: true
        },
        {
          type: "no-braces",
          rule: text => text.indexOf("{") !== -1 || text.indexOf("}") !== -1
        }
      ]
    };
  },
  ///////////////////////////////////////////////////////////////////////////////
  //  CREATED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  created: function() {
    this.username = this.$cookies.get("username");

    // LOAD USER GROUPS AND TAGS /////////////////////////////////////////////
    if (this.username) {
      let groupsRef = db.database().ref("portal_profiles/" + this.username);
      groupsRef.on("child_added", group => {
        var data = group.val();
        if (group.key === "channels") {
          this.groups = data;
        } else if (group.key === "tags") {
          // convert tags to flat array
          this.tags = data.reduce((accumulator, currentValue) => {
            return [...accumulator, currentValue.text];
          });
        }
      });
    }

    // LOAD USER PREFERENCES ///////////////////////////////////////////////////
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

    // LOAD CHANNELS AND EXTENSIONS /////////////////////////////////////////////
    let channelsRef = db.database().ref("portal_channels");
    // porta_extensions contains any channel info not stored in Mattermost
    let extensionsRef = db.database().ref("portal_extensions");
    channelsRef.on("child_added", channel => {
      var data = channel.val();
      //console.log(channel.key, data.name);
      // only load topic channels into the card component
      if (
        (this.type === "Imp" && data.display_name.charAt(0) === "!") ||
        (this.type === "Aff" && data.display_name.charAt(0) === "#") ||
        (this.type === "Wor" && data.display_name.charAt(0) === "/")
      ) {
        extensionsRef.child(channel.key).once("value", extension => {
          if (extension.exists()) {
            data = _.merge(data, extension.val());
          }
          this.topics.push(data);
          //console.log(channel.key, data.name, extension.val());
          //this.topics.sort(SortByName);  WARNING: SORT CORRUPTS DATA
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
    });
    channelsRef.on("child_removed", channel => {
      let data = channel.val();
      this.topics.forEach(function(element, index, arr) {
        if (element.channel_id === data.channel_id) {
          // lodash function to merge objects recursively
          arr.splice(index, 1);
        }
      });
    });

    //this.$forceUpdate();
  },
  ///////////////////////////////////////////////////////////////////////////////
  //  COMPUTED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  computed: {
    // invalidate: function() {
    //   return this.invalid === true ? "md-invalid" : "";
    // }
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

    // create slug for URL
    slug: function() {
      this.name = Slugify(this.display_name, { lower: true });
    },
    // compute v-bind:src for img
    avatarLink: function(username) {
      return BASEURL + "images/avatars/avatar_" + username + ".png";
    },

    // create new card
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
      this.activeDialogTopic = true;
    },

    // edit existing card (needs index of topic)
    editCard: function(topic, index) {
      //alert(topic.purpose.tags);
      this.team_id = topic.team_id;
      this.channel_id = topic.channel_id;
      this.display_name = topic.display_name;
      this.name = topic.name;
      this.icon = topic.purpose.icon;
      this.header = topic.header;
      //this.formtags = topic.purpose.tags;
      // the tag control needs text key-value pairs
      if (topic.purpose.tags && topic.purpose.tags[0].text === undefined) {
        this.formtags = topic.purpose.tags.map(function(element) {
          return { text: element };
        });
      } else {
        this.formtags = topic.purpose.tags;
      }
      this.formindex = index;
      this.mode = "Edit";
      this.activeDialogTopic = true;
    },

    // edit existing card (needs index of topic)
    deleteCard: function(topic, index) {
      this.axios
        .get(
          BASEURL +
            "webhooks/" +
            "portal_delete_channel.php" +
            "?file=base-diglife-coop.php" +
            "&channel_id=" +
            topic.channel_id
        )
        .then(delete this.topics[index])
        .then(
          db
            .database()
            .ref("portal_channels/" + topic.channel_id)
            .remove()
        )
        .then(
          db
            .database()
            .ref("portal_extensions/" + topic.channel_id)
            .remove()
        )
        .then(response => {
          this.showSnackBar = true;
          this.snack = "This card has been successfully removed.";
        })
        .catch(error => {
          this.showSnackBar = true;
          this.snack = "Network Error, please try again later.";
          console.log(error);
        });
    },

    // submit card edits
    onConfirm: function(formindex) {
      // error validation
      if (this.display_name === "") {
        document.getElementById("display_name").classList.add("md-invalid");
      } else if (this.name === "") {
        document.getElementById("name").classList.add("md-invalid");
      } else if (this.formtags.length === 0) {
        // not working -- need to invoke requored field here
        document.getElementById("formtags").classList.add("md-invalid");
        // no errors
      } else {
        // we have two scripts for updating and creating channels
        if (this.mode === "Edit") {
          this.script = "portal_update_channel.php";
        } else if (this.mode === "Create") {
          this.script = "portal_create_channel.php";
        }

        // prepare some values before writing them back to MM
        // topic channels starting with "#"
        if (this.display_name[0] !== "#") {
          this.display_name = "#" + this.display_name;
        }
        this.formtags.unshift({ text: "test" }); // It's missing the first element, so faking it
        this.formtags = this.formtags.reduce(function(
          accumulator,
          currentValue
        ) {
          return [...accumulator, currentValue.text];
        });

        //console.log(this.formtags);
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
          // does not update all fields
          .then(response => {
            if (this.mode === "Edit") {
              this.channel = _.merge(this.topics[formindex], response.data);
            } else {
              this.channel = response.data;
              // this would be pushed twice, child_added
              //this.topics.push(response.data);
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
            if (this.channel.status_code) {
              this.snack = "Mattermost Error: " + this.channel.message;
            } else {
              this.snack = "Network Error, please try again later.";
            }
            this.showSnackBar = true;
          });

        this.activeDialogTopic = false;
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
          // following not working since service is not visible in Navbar
          // window.onload = function() {
          //   window.open(topic.purpose.link, "theApp");
          this.service = topic.display_name.replace("#", "");
          var element = document.getElementById("theApp");
          element.src = "about:blank";
          element.style.display = "block";
          window.open(topic.purpose.link, "theApp");
          // };
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
