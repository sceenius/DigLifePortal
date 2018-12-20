<template>
  <div class="md-layout md-gutter" v-if="service == ''">
    <!--
      ----------------------------------------------------------------------
        CARDS
      ----------------------------------------------------------------------
    -->
    <md-card
      md-with-hover
      v-for="(note, index) in notes"
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

        <div class="md-subhead"></div>
        <img
          style="width: 20px; position: absolute; top: 5px; right: 2px; "
          src="https://ledger.diglife.coop/images/brand/logo_secondary.svg"
        />
        <img
          style="width: 200px; position: absolute; top: -25px; left: 25px; z-index: 99; "
          src="https://ledger.diglife.coop/images/brand/card_ribbon.png"
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
          style="background: #C9162B; color: white;"
          @click="cardAction('open', topic);"
          >Open</md-button
        >
        <md-button v-if="!isMember(topic)" @click="cardAction('ask', topic);"
          >Ask</md-button
        >
        <md-button
          v-if="!isMember(topic)"
          style="background: #C9162B; color: white;"
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
  </div>
</template>

<script>
import VueTagsInput from "@johmun/vue-tags-input";
import VueMarkdown from "vue-markdown";
import Slack from "node-slack";
import Slugify from "slugify";
import _ from "lodash/fp/object"; //lodash/fp/object for objects only
import { BASEURL, CHATURL } from "../constants.js";
import db from "../firebase/init";

export default {
  name: "Notes",
  components: { VueTagsInput, VueMarkdown },
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
      notes: "",
      cards: [],
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

    // LOAD CHANNELS AND EXTENSIONS /////////////////////////////////////////////
    let notesRef = db.database().ref("portal_notes");
    notesRef.on("child_added", note => {
      var data = note.val();
      this.notes.push(data);
      //console.log(channel.key, data.name, extension.val());
    });
    //console.log("-------");
    this.axios
      .post("https://notepad.diglife.coop/new")
      .then(response => (this.notes = response.data))
      .then(response => console.log("-------", response.data))
      .catch(error => {
        console.log(error.message);
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
      console.log(
        "webhooks/" +
          "portal_delete_channel.php" +
          "?file=base-diglife-coop.php" +
          "&channel_id=" +
          topic.channel_id
      );

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
          window.open(topic.purpose.link, topic.name);
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
