<template>
  <div class="md-layout md-gutter" style="padding: 20px;">
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
            style="background: #00B0A0; color: white;"
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
      <md-button
        title="Go back to app view"
        @click="returnToApp();"
        class="md-fab md-mini md-plain"
      >
        <md-icon>exit_to_app</md-icon>
      </md-button>
    </div>

    <!--
      ----------------------------------------------------------------------
        DIALOG BOXES - CREATE NOTE
      ----------------------------------------------------------------------
    -->
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

        <md-field id="formtags">
          <vue-tags-input
            :validation="validation"
            style="ma rgin-top: 50px; width: 100%; border: 0px"
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

        <md-field>
          <label for="template">Template</label>
          <md-select v-model="template" name="template" id="template">
            <md-option value="plain">Plain</md-option>
            <md-option value="meeting">Meeting</md-option>
          </md-select>
          <span class="md-helper-text"
            >Select your template. The text will be copied to your clipboard, so
            you can paste it into the document.</span
          >
          <span class="md-error">This field cannot be blank</span>
        </md-field>

        <textarea
          id="templatetext"
          style="width: 0%; height: 0px; background-color:#ddd; padding: 5px; font-size: 0.9em;"
        >
        </textarea>

        <md-dialog-actions style="padding: 25px 0;">
          <md-button
            class="md-success md-raised"
            @click="activeDialogNote = false;"
            >Cancel</md-button
          >
          <md-button
            v-if="mode == 'Edit'"
            class="md-success md-raised"
            @click="onConfirmNote(formindex);"
            style="background: #00B0A0; color: white;"
            >Update</md-button
          >
          <md-button
            v-if="mode == 'Create'"
            class="md-success md-raised"
            @click="onConfirmNote();"
            style="background: #00B0A0; color: white;"
            >Create</md-button
          >
        </md-dialog-actions>
      </div>
    </md-dialog>

    <!--
      ----------------------------------------------------------------------
        CARDS // https://codesandbox.io/s/r4yov1w80n for animation
      ----------------------------------------------------------------------
    -->
    <md-speed-dial v-if="service == 'Zettelkasten'">
      <md-speed-dial-target>
        <md-icon class="md-morph-initial">add</md-icon>
        <md-icon class="md-morph-final">close</md-icon>
      </md-speed-dial-target>

      <md-speed-dial-content>
        <textarea
          id="Clipboard"
          style="position: absolute; opacity: 0; width: 0%; height: 0px;"
        >
        </textarea>

        <md-button
          class="md-icon-button"
          @click="createNote('plain');"
          title="Create plain note"
        >
          <md-icon>assignment</md-icon>
        </md-button>

        <md-button
          class="md-icon-button"
          @click="createNote('meeting');"
          title="Create meeting note"
        >
          <md-icon>videocam</md-icon>
        </md-button>

        <md-button
          class="md-icon-button"
          @click="createNote('news');"
          title="Create news note"
        >
          <md-icon>date_range</md-icon>
        </md-button>
      </md-speed-dial-content>
    </md-speed-dial>

    <sequential-entrance>
      <md-card
        md-with-hover
        v-if="service == 'Zettelkasten'"
        v-for="(note, index) in notes"
        :key="index"
        class="md-layout-item"
        id="noteCards"
      >
        <div class="md-card-banner">
          <md-icon
            class="md-size-1x"
            style="cursor: pointer; color: #FEC019; z-index: 99;position: absolute; top:-5px; right: 20px;"
            >bookmark</md-icon
          >
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
              <md-menu-item @click="copyCard(note, index);">
                <md-icon>file_copy</md-icon>
                <span>Copy</span>
              </md-menu-item>

              <md-menu-item @click="deleteCard(note, index);">
                <md-icon>delete</md-icon>
                <span>Delete</span>
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
              <!--
                md-icon
                  style="line-height: 0.9; font-size: 1em !important; color: #404040;"
                  >how_to_vote
                </md-icon
              -->
              {{ note.text.replace(/:[\w]+:/, "") }}
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
          <md-button @click="cardAction('edit', note);">Edit</md-button>
          <md-button
            style="background: #00B0A0; color: white;"
            @click="cardAction('open', note);"
            >Open</md-button
          >
        </md-card-actions>

        <div class="md-card-footer">
          <div class="md-card-avatars md-scrollbar">
            <md-menu v-for="(member, index2) in note.members" :key="index2">
              <md-avatar
                style="cursor: pointer; border: 2px solid transparent;"
                md-menu-trigger
              >
                <img v-bind:src="avatarLink(member)" alt="Avatar" />
                <!-- md-tooltip md-direction="top">{{ member }}</md-tooltip -->
              </md-avatar>

              <md-menu-content class="md-card-menu">
                <md-menu-item>
                  <md-icon>person</md-icon>
                  <span>{{ member }}</span>
                </md-menu-item>

                <md-menu-item @click="removeMember(member, index);">
                  <md-icon>delete</md-icon>
                  <span>Remove</span>
                </md-menu-item>
              </md-menu-content>
            </md-menu>
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
import Moment from "moment";
import Slugify from "slugify";
import _ from "lodash/fp/object"; //lodash/fp/object for objects only
import { BASEURL, CHATURL } from "../../index.js";
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
      template: "",
      templatetext: "",
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
    // use only locally since logout may change this
    this.username = this.$cookies.get("username");

    function SortByTime(x, y) {
      return x.id === y.id ? 0 : x.time < y.time ? 1 : -1;
    }
    // LOAD CHANNELS AND EXTENSIONS /////////////////////////////////////////////
    let notesRef = db.database().ref("portal_notes");
    // FB ADDED PATTERN /////////////////////////////
    notesRef.on("child_added", note => {
      var data = note.val();
      this.notes.push(data);
      this.notes.sort(SortByTime);
    });
    // FB CHANGED PATTERN /////////////////////////////
    notesRef.on("child_changed", note => {
      var data = note.val();
      // do not use arrow function here since it won't update this.notes
      // also merge Firebase data after form submission, not here
      this.notes.forEach(function(element, index, arr) {
        if (element.id === data.id) {
          // lodash function to merge objects recursively
          arr[index] = _.merge(arr[index], data);
        }
      });
    });
    var element = document.getElementById("theApp");
    element.style.display = "none";
  },
  ///////////////////////////////////////////////////////////////////////////////
  //  COMPUTED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  computed: {},
  ///////////////////////////////////////////////////////////////////////////////
  //  METHODS - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  methods: {
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
      this.activeDialogNote = false;
      var element = document.getElementById("theApp");
      element.src = "about:blank";
      element.style.display = "none";
    },

    returnToApp: function() {
      this.service = "CodiMD";
      var element = document.getElementById("theApp");
      element.src = "about:blank";
      element.style.display = "block";
      window.open("https://notepad.diglife.coop/", "theApp");
    },

    // edit existing card (needs index of note)
    editCard: function(note, index) {
      alert("Please use the application to edit a card.");
    },

    deleteCard: function(note, index) {
      //remove from Firebase
      db.database()
        .ref("portal_notes/" + note.id)
        .remove();
      // remove from array
      //console.log(this.notes);
      this.notes = this.notes.filter(element => element.id !== note.id);
      //remove from app (manually)
      this.snack =
        "Card successfully removed. Please also remove from the app. ";
      this.showSnackBar = true;
    },

    removeMember: function(member, index) {
      // PATTERN remove from array, then update FB with array
      this.notes[index].members = this.notes[index].members.filter(
        element => element !== member
      );
      //remove from Firebase
      db.database()
        .ref("portal_notes/" + this.notes[index].id)
        .update(this.notes[index]);

      this.snack = "Member successfully removed.";
      this.showSnackBar = true;
    },

    // submit card edits
    createNote: function(type) {
      let clipboard = document.getElementById("Clipboard");
      switch (type) {
        case "plain":
          clipboard.value =
            "# Title goes here\n" +
            "## Subtitle goes here\n" +
            "\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n" +
            ":::warning\n" +
            "###### tags: `plain`" +
            "\n###### authors: `" +
            this.$cookies.get("username") +
            "`\n:::" +
            "";
          break;
        case "meeting":
          clipboard.value =
            "#  :video_camera: Core Team Meeting Agenda & Notes\n" +
            "## ```" +
            Moment().format("LLLL") +
            "```\n" +
            ":warning: Please record the call and post the [link to the recording here](https://wherever.com).\n" +
            "### :eyes: Participants\n" +
            "Chair:\nScribe:\nAttendees:\nApologies:\n" +
            "### :heavy_check_mark: Meeting Checklist\n" +
            "- [x] Did you change access to this file to 'Freely' (top right)?\n" +
            "- [ ] Did you appoint a chair and note-taker for this meeting?\n" +
            "- [ ] Did you start the recording and announce the call will be recorded & posted publicly?\n" +
            "- [ ] Did you allow for short [check-ins and/or check-outs](https://toolbox.hyperisland.com/check-in-questions)?\n" +
            "- [ ] Did you post the recording and created a link above in the note?\n" +
            "### :alarm_clock: Meeting Agenda\n" +
            "- [x] \n" +
            "- [ ] \n" +
            "- [ ] \n" +
            "### :memo: Meeting Notes\n" +
            "Please update this section during the meeting; you can edit this content concurrently.\n" +
            "- [x] \n" +
            "- [ ] \n" +
            "- [ ] \n" +
            "### :clapper: Actions & Decisions\n" +
            "Please record any actions and/or decisions from the meeting; attach names & dates and check off items completed, if possible.\n" +
            "- [x] \n" +
            "- [ ] \n" +
            "- [ ] \n" +
            ":::warning\n" +
            "###### tags: `meeting`" +
            "\n###### authors: `" +
            this.$cookies.get("username") +
            "`\n:::" +
            "";
          break;
        case "news":
          clipboard.value =
            "#  :newspaper: Newsletter Topics\n" +
            "Please contribute to our newsletter and fill out one of the sections below.\n" +
            "### :calendar: Campaign Info\n" +
            "Launch Date:\nTarget Audience:\nNewsletter Editors:\n" +
            "### :tada: Topic 1\n" +
            "Author: ```name```\n" +
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n" +
            "### :tada: Topic 2\n" +
            "Author: ```name```\n" +
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n" +
            "### :tada: Topic 3\n" +
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n" +
            "Author: ```name```\n" +
            "### :tada: Topic 4\n" +
            "Author: ```name```\n" +
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n" +
            ":::warning\n" +
            "###### tags: `news`" +
            "\n###### authors: `" +
            this.$cookies.get("username") +
            "`\n:::" +
            "";
          break;
        default:
          break;
      }

      clipboard.focus();
      clipboard.select();
      document.execCommand("copy");

      this.service = "CodiMD";
      var element = document.getElementById("theApp");
      element.src = "about:blank";
      element.style.display = "block";
      window.open("https://notepad.diglife.coop/new", "theApp");
      this.snack =
        "Template copied to clipboard. Please paste it into the new file.";
      this.showSnackBar = true;
    },

    // submit notes history
    onConfirmHistory: function() {
      // loop through the JSON array and update Firebase
      // must use arrow function to access this.variables
      // merge variables is courtesy of Firebase
      let notesRef = db.database().ref("portal_notes");
      let notes = JSON.parse(this.history).history;
      notes.forEach(note => {
        note.fromTime = Moment(note.time).fromNow();
        notesRef.child(note.id).update(note);
      });
      this.activeDialogHistory = false;
    },

    // execute card action
    cardAction: function(action, note) {
      switch (action) {
        case "edit":
          this.service = "Zettelkasten Note";
          var element = document.getElementById("theApp");
          element.src = "about:blank";
          element.style.display = "block";
          //add member on edit action
          if (
            note.members &&
            !JSON.stringify(note.members).includes(
              this.$cookies.get("username")
            )
          ) {
            let notesRef = db.database().ref("portal_notes");
            note.members.push(this.$cookies.get("username"));
            notesRef.child(note.id).update(note);
          } else if (!note.members) {
            let notesRef = db.database().ref("portal_notes");
            note.members = [this.$cookies.get("username")];
            notesRef.child(note.id).update(note);
          }
          // window.onload = function() {
          window.open(
            "https://notepad.diglife.coop/" + note.id + "?both",
            "theApp"
          );
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
