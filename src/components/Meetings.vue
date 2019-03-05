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
      v-if="!activeDialogmeeting"
      @click="createCard();"
      class="md-fab md-primary"
      style="position: absolute; bottom: 20px; right: 20px; z-index: 99"
    >
      <md-icon>add</md-icon>
    </md-button>

    <md-dialog
      :md-close-on-esc="false"
      :md-click-outside-to-close="false"
      :md-active.sync="activeDialogmeeting"
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
            @click="activeDialogmeeting = false;"
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
    <!-- sequential-entrance -->
    <md-card
      md-with-hover
      v-for="(meeting, index) in meetings"
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
            <md-menu-item @click="editCard(meeting, index);">
              <md-icon>edit</md-icon>
              <span>Edit</span>
            </md-menu-item>

            <md-menu-item @click="deleteCard(meeting);">
              <md-icon>archive</md-icon>
              <span>Archive</span>
            </md-menu-item>
          </md-menu-content>
        </md-menu>

        <div class="md-subhead"></div>
        <img
          src="https://ledger.diglife.coop/images/brand/logo_secondary.svg"
        />
      </div>

      <div class="md-card-header">
        <md-card-header-text>
          <div class="md-title">
            <md-icon>videocam</md-icon>{{ meeting.topic }}
          </div>
        </md-card-header-text>

        <md-chip style="background-color: green">Not started</md-chip>
      </div>

      <div class="md-card-mid">
        <p class="info"><vue-markdown></vue-markdown></p>
      </div>

      <md-card-actions>
        <md-button
          v-if="isMember(meeting)"
          @click="cardAction('leave', meeting);"
          >Leave</md-button
        >
        <md-button
          v-if="isMember(meeting)"
          style="background: #00B0A0; color: white;"
          @click="cardAction('open', meeting);"
          >Open</md-button
        >
        <md-button
          v-if="!isMember(meeting)"
          @click="cardAction('ask', meeting);"
          >Ask</md-button
        >
        <md-button
          v-if="!isMember(meeting)"
          style="background: #00B0A0; color: white;"
          @click="cardAction('join', meeting);"
          >Join</md-button
        >
      </md-card-actions>

      <div class="md-card-footer">
        <div class="md-card-avatars md-scrollbar">
          <md-avatar v-for="(member, index) in meeting.members" :key="index">
            <img v-bind:src="avatarLink(member)" alt="Avatar" />
            <md-tooltip md-direction="top">{{ member }}</md-tooltip>
          </md-avatar>
        </div>
      </div>
    </md-card>
    <!-- /sequential-entrance -->
  </div>
</template>

<script>
import VueTagsInput from "@johmun/vue-tags-input";
import VueMarkdown from "vue-markdown";
import Slack from "node-slack";
import Slugify from "slugify";
import _ from "lodash/fp/object"; //lodash/fp/object for objects only
import { BASEURL, CHATURL } from "../main.js";
import db from "../firebase/init.js";

export default {
  name: "Meetings",
  components: { VueTagsInput, VueMarkdown },
  data() {
    return {
      service: "",
      tag: "",
      mode: "", // Edit or Create mode for dialog
      script: "", // Edit or Create script for execution
      showServices: false,
      showCardNavigation: false,
      activeDialogmeeting: false,
      showSnackBar: false,
      snack: "",
      result: "",
      status: "",
      meetings: [],
      autocompleteItems: [],
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

    // LOAD MEETINGS /////////////////////////////////////////////
    let meetingsRef = db.database().ref("portal_meetings");
    meetingsRef.on("child_added", meeting => {
      var data = meeting.val();
      console.log(data);
      this.meetings.push(data);
    });
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
    isMember: function(meeting) {
      return JSON.stringify(this.groups).includes(
        meeting.team + "/" + meeting.name
      );
    },
    // is suggested
    isSuggested: function(meeting) {
      if (meeting.purpose.tags) {
        //alert(this.tags);
        return this.tags.filter(
          value => -1 !== meeting.purpose.tags.indexOf(value)
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
    createCard: function(meeting) {
      // all interest groups created in the diglife domain
      this.team_id = this.meetings[0].team_id;
      this.channel_id = "";
      this.display_name = "";
      this.name = "";
      this.icon = "";
      this.header = "";
      this.formtags = [];
      this.mode = "Create";
      this.activeDialogmeeting = true;
    },

    // edit existing card (needs index of meeting)
    editCard: function(meeting, index) {
      //alert(meeting.purpose.tags);
      this.team_id = meeting.team_id;
      this.channel_id = meeting.channel_id;
      this.display_name = meeting.display_name;
      this.name = meeting.name;
      this.icon = meeting.purpose.icon;
      this.header = meeting.header;
      //this.formtags = meeting.purpose.tags;
      // the tag control needs text key-value pairs
      if (meeting.purpose.tags && meeting.purpose.tags[0].text === undefined) {
        this.formtags = meeting.purpose.tags.map(function(element) {
          return { text: element };
        });
      } else {
        this.formtags = meeting.purpose.tags;
      }
      this.formindex = index;
      this.mode = "Edit";
      this.activeDialogmeeting = true;
    },

    // edit existing card (needs index of meeting)
    deleteCard: function(meeting, index) {
      this.axios
        .get(
          BASEURL +
            "webhooks/" +
            "portal_delete_channel.php" +
            "?file=base-diglife-coop.php" +
            "&channel_id=" +
            meeting.channel_id
        )
        .then(delete this.meetings[index])
        .then(
          db
            .database()
            .ref("portal_channels/" + meeting.channel_id)
            .remove()
        )
        .then(
          db
            .database()
            .ref("portal_extensions/" + meeting.channel_id)
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
        // meeting channels starting with "#"
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
              this.channel = _.merge(this.meetings[formindex], response.data);
            } else {
              this.channel = response.data;
              // this would be pushed twice, child_added
              //this.meetings.push(response.data);
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

        this.activeDialogmeeting = false;
      }
    },

    // execute card action
    cardAction: function(action, meeting) {
      switch (action) {
        case "join":
          // join channel
          this.axios
            .get(
              BASEURL +
                "webhooks/portal_join_channel.php?file=base-diglife-coop.php&username=" +
                this.$cookies.get("username") +
                "&channel_id=" +
                meeting.channel_id
            )
            .then(response => (this.result = response.data))
            .then(response =>
              this.groups.push(meeting.team + "/" + meeting.name)
            )
            .then(response =>
              meeting.members.push(this.$cookies.get("username"))
            );
          break;
        case "open":
          // following not working since service is not visible in Navbar
          // window.onload = function() {
          //   window.open(meeting.purpose.link, "theApp");
          this.service = meeting.display_name.replace("#", "");
          var element = document.getElementById("theApp");
          element.src = "about:blank";
          element.style.display = "block";
          window.open(meeting.purpose.link, "theApp");
          // };
          break;
        case "ask":
          let question = prompt("Please ask your question", "Ask the Expert");

          var slack = new Slack(CHATURL + "hooks/" + meeting.purpose.hook);
          var err = slack.send({
            text:
              "##### :question: Question from @" +
              this.username +
              "\n" +
              question +
              "\n_Tip: you can respond via a direct message or invite the user into this channel._",
            channel: meeting.name,
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
                meeting.channel_id
            )
            .then(response => (this.result = response.data))
            .then(response =>
              this.groups.splice(
                this.groups.indexOf(meeting.team + "/" + meeting.name),
                1
              )
            )
            .then(response =>
              meeting.members.splice(
                meeting.members.indexOf(this.$cookies.get("username")),
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
