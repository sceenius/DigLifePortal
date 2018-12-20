<template>
  <div class="md-layout md-gutter">
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
      <md-button class="md-primary" @click="showSnackBar = false;"
        >Dismiss</md-button
      >
    </md-snackbar>

    <!--
      ----------------------------------------------------------------------
        DIALOG BOXES - HISTORY DIALOG
      ----------------------------------------------------------------------
    -->
    <md-dialog
      :md-close-on-esc="false"
      :md-click-outside-to-close="false"
      :md-active.sync="activeDialogHistory"
      style="width: 400px;"
    >
      <md-dialog-title>Update Notes</md-dialog-title>
      <div style="padding: 0 25px ;">
        text goes here
        <md-field id="history">
          <label>History</label>
          <md-textarea v-model="history"></md-textarea>
          <span class="md-helper-text">Paste your notes from below</span>
          <span class="md-error">The history does not exist</span>
        </md-field>
        <iframe
          name="theApp2"
          src="https://notepad.diglife.coop/history"
          width="100%"
          frameborder="1"
          scrolling="yes"
        ></iframe>
        <md-dialog-actions style="padding: 25px 0;">
          <md-button
            class="md-success md-raised"
            @click="onConfirmHistory();"
            style="background: #C9162B; color: white;"
            ><md-icon style="color: white;">exit_to_app</md-icon>
            Update</md-button
          >
        </md-dialog-actions>
      </div>
    </md-dialog>

    <!--
      ----------------------------------------------------------------------
        CONTEXTUAL ACTION BUTTONS
      ----------------------------------------------------------------------
    -->
    <div id="actions">
      <md-button
        title="Open app in new window"
        @click="activeDialogHistory = true;"
        class="md-fab md-mini md-plain"
      >
        <md-icon>view_module</md-icon>
      </md-button>
    </div>
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
            <md-menu-item @click="editCard(note, index);">
              <md-icon>edit</md-icon>
              <span>Edit</span>
            </md-menu-item>

            <md-menu-item @click="deleteCard(note);">
              <md-icon>archive</md-icon>
              <span>Archive</span>
            </md-menu-item>
          </md-menu-content>
        </md-menu>

        <div class="md-subhead">Note</div>
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
              >how_to_vote
            </md-icon>
            {{ note.text }}
          </div>
        </md-card-header-text>

        <md-chip style="background-color: green">Authored</md-chip>
      </div>

      <div class="md-card-mid">
        <p class="info"><vue-markdown>Text here</vue-markdown></p>
      </div>

      <md-card-actions>
        <md-button
          style="background: #C9162B; color: white;"
          @click="cardAction('open', note);"
          >Open</md-button
        >
      </md-card-actions>

      <div class="md-card-footer">
        <div class="md-card-avatars md-scrollbar">
          <md-avatar v-for="(member, index) in note.members" :key="index">
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
      activeDialogHistory: false,
      showSnackBar: false,
      snack: "",
      result: "",
      history: "",
      status: "",
      notes: [],
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
    // //console.log("-------");
    // this.axios
    //   .get("https://notepad.diglife.coop/history")
    //   .then(response => (this.notes = response.data))
    //   .then(response => console.log("-------", response.data))
    //   .catch(error => {
    //     console.log(error.message);
    //   });

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
    isMember: function(note) {
      return JSON.stringify(this.groups).includes(note.team + "/" + note.name);
    },
    // is suggested
    isSuggested: function(note) {
      if (note.purpose.tags) {
        //alert(this.tags);
        return this.tags.filter(
          value => -1 !== note.purpose.tags.indexOf(value)
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
    createCard: function(note) {
      // all interest groups created in the diglife domain
      this.team_id = this.notes[0].team_id;
      this.channel_id = "";
      this.display_name = "";
      this.name = "";
      this.icon = "";
      this.header = "";
      this.formtags = [];
      this.mode = "Create";
      this.activeDialognote = true;
    },

    // edit existing card (needs index of note)
    editCard: function(note, index) {
      //alert(note.purpose.tags);
      this.team_id = note.team_id;
      this.channel_id = note.channel_id;
      this.display_name = note.display_name;
      this.name = note.name;
      this.icon = note.purpose.icon;
      this.header = note.header;
      //this.formtags = note.purpose.tags;
      // the tag control needs text key-value pairs
      if (note.purpose.tags && note.purpose.tags[0].text === undefined) {
        this.formtags = note.purpose.tags.map(function(element) {
          return { text: element };
        });
      } else {
        this.formtags = note.purpose.tags;
      }
      this.formindex = index;
      this.mode = "Edit";
      this.activeDialognote = true;
    },

    // edit existing card (needs index of note)
    deleteCard: function(note, index) {
      console.log(
        "webhooks/" +
          "portal_delete_channel.php" +
          "?file=base-diglife-coop.php" +
          "&channel_id=" +
          note.channel_id
      );

      this.axios
        .get(
          BASEURL +
            "webhooks/" +
            "portal_delete_channel.php" +
            "?file=base-diglife-coop.php" +
            "&channel_id=" +
            note.channel_id
        )
        .then(delete this.notes[index])
        .then(
          db
            .database()
            .ref("portal_channels/" + note.channel_id)
            .remove()
        )
        .then(
          db
            .database()
            .ref("portal_extensions/" + note.channel_id)
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

    // submit notes history
    onConfirmHistory: function() {
      let notesRef = db.database().ref("portal_notes");
      this.notes = JSON.parse(this.history).history;
      this.notes.forEach(function(note, index, arr) {
        notesRef.child(note.id).update(note);
        //this.notes[note.id] = "note";
      });
      console.log(this.notes);
      this.activeDialogHistory = false;
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
        // note channels starting with "#"
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
              this.channel = _.merge(this.notes[formindex], response.data);
            } else {
              this.channel = response.data;
              // this would be pushed twice, child_added
              //this.notes.push(response.data);
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

        this.activeDialognote = false;
      }
    },

    // execute card action
    cardAction: function(action, note) {
      switch (action) {
        case "join":
          // join channel
          this.axios
            .get(
              BASEURL +
                "webhooks/portal_join_channel.php?file=base-diglife-coop.php&username=" +
                this.$cookies.get("username") +
                "&channel_id=" +
                note.channel_id
            )
            .then(response => (this.result = response.data))
            .then(response => this.groups.push(note.team + "/" + note.name))
            .then(response => note.members.push(this.$cookies.get("username")));
          break;
        case "open":
          // following not working since service is not visible in Navbar
          // window.onload = function() {
          //   window.open(note.purpose.link, "theApp");
          window.open(note.purpose.link, note.name);
          // };
          break;
        case "ask":
          let question = prompt("Please ask your question", "Ask the Expert");

          var slack = new Slack(CHATURL + "hooks/" + note.purpose.hook);
          var err = slack.send({
            text:
              "##### :question: Question from @" +
              this.username +
              "\n" +
              question +
              "\n_Tip: you can respond via a direct message or invite the user into this channel._",
            channel: note.name,
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
                note.channel_id
            )
            .then(response => (this.result = response.data))
            .then(response =>
              this.groups.splice(
                this.groups.indexOf(note.team + "/" + note.name),
                1
              )
            )
            .then(response =>
              note.members.splice(
                note.members.indexOf(this.$cookies.get("username")),
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
