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
            @click="activeDialogHistory = false;"
            >Cancel</md-button
          >
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
        title="Update card history"
        @click="activeDialogHistory = true;"
        class="md-fab md-mini md-plain"
      >
        <md-icon>file_copy</md-icon>
      </md-button>
      <md-button
        title="Go back to card view"
        @click="returnToCards();"
        class="md-fab md-mini md-plain"
      >
        <md-icon>view_comfy</md-icon>
      </md-button>
    </div>

    <!--
      ----------------------------------------------------------------------
        DIALOG BOXES - EDIT NOTE
      ----------------------------------------------------------------------
    -->
    <md-button
      v-if="!activeDialogNote"
      @click="createCard();"
      class="md-fab md-primary"
      style="position: absolute; bottom: 20px; right: 20px; z-index: 99"
    >
      <md-icon>add</md-icon>
    </md-button>

    <md-dialog
      :md-close-on-esc="false"
      :md-click-outside-to-close="false"
      :md-active.sync="activeDialogNote"
    >
      <md-dialog-title
        ><md-icon style="color: black;">how_to_vote </md-icon>
        {{ mode }} Zetttelkasten Note</md-dialog-title
      >

      <div style="padding: 0 25px ;">
        <md-field id="display_name">
          <label>Title</label>
          <md-input v-model="display_name" required></md-input>
          <span class="md-helper-text">Enter the name of this Note</span>
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
          <span class="md-error"></span>
        </md-field>

        <md-dialog-actions style="padding: 25px 0;">
          <md-button
            class="md-success md-raised"
            @click="activeDialogNote = false;"
            >Cancel</md-button
          >
          <md-button
            v-if="mode == 'Edit'"
            class="md-success md-raised"
            @click="onConfirm(formindex);"
            style="background: #C9162B; color: white;"
            >Update</md-button
          >
          <md-button
            v-if="mode == 'Create'"
            class="md-success md-raised"
            @click="onConfirm();"
            style="background: #C9162B; color: white;"
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
      v-if="service == 'Zettelkasten'"
      v-for="(note, index) in notes"
      :key="index"
      class="md-layout-item"
      id="noteCards"
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

        <div class="md-subhead">Zettelkasten Note</div>
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
      </div>

      <div class="md-card-mid">
        <p class="info">
          <md-icon>access_time</md-icon>
          Changed {{ note.fromTime }}
        </p>
        <p class="info" style="width: 250px; height: 90px; overflow: auto;">
          <md-chip v-for="(tag, index) in note.tags" :key="tag.id">
            {{ tag }}
          </md-chip>
        </p>
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
import Moment from "moment";
import Slugify from "slugify";
import _ from "lodash/fp/object"; //lodash/fp/object for objects only
import { BASEURL, CHATURL } from "../constants.js";
import db from "../firebase/init";

export default {
  name: "Notes",
  components: { VueTagsInput, VueMarkdown },
  data() {
    return {
      service: "Zettelkasten",
      tag: "",
      mode: "", // Edit or Create mode for dialog
      script: "", // Edit or Create script for execution
      showServices: false,
      showCardNavigation: false,
      activeDialogHistory: false,
      activeDialogNote: false,
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

    function SortByTime(x, y) {
      return x.id === y.id ? 0 : x.time < y.time ? 1 : -1;
    }
    // LOAD CHANNELS AND EXTENSIONS /////////////////////////////////////////////
    let notesRef = db.database().ref("portal_notes");
    notesRef.on("child_added", note => {
      var data = note.val();
      data.fromTime = Moment(data.time).fromNow();
      this.notes.push(data);
      this.notes.sort(SortByTime);
    });

    var element = document.getElementById("theApp");
    element.style.display = "none";
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
    time: function() {
      return Moment(note.time).fromNow();
    }
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

    returnToCards: function() {
      this.service = "Zettelkasten";
      document.getElementById("theApp").style.display = "none";
    },

    // create new card
    createCard: function(note) {
      // all interest groups created in the diglife domain
      //this.note_id = Math.random().toString(36).substring(7);
      this.display_name = "";
      this.name = "";
      this.icon = "";
      this.formtags = [];
      this.mode = "Create";
      this.activeDialogNote = true;
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
        note.fromTime = Moment(note.time).fromNow();
        _.merge(arr, note);
        //this.notes[note.id] = "note";
      });
      this.notes.sort(SortByTime);
      console.log(this.notes);
      this.activeDialogHistory = false;

      function SortByTime(x, y) {
        return x.id === y.id ? 0 : x.time < y.time ? 1 : -1;
      }
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
          break;
        case "open":
          // following not working since service is not visible in Navbar
          // window.onload = function() {
          //   window.open(note.purpose.link, "theApp");
          // let prefsRef = db
          //   .database()
          //   .ref("portal_profiles/" + this.username + "/prefs");
          // prefsRef.update({
          //   service: "Zettelkasten Note",
          //   link: "https://notepad.diglife.coop/" + note.id
          // });
          this.service = "Zettelkasten Note";
          var element = document.getElementById("theApp");
          element.src = "about:blank";
          element.style.display = "block";
          // window.onload = function() {
          window.open("https://notepad.diglife.coop/" + note.id, "theApp");

          // };

          // };
          break;
        case "ask":
          break;
        case "leave":
          break;
        default:
      }
    }
  }
};
</script>
