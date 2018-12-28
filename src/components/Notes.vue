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
            style="background: #C9162B; color: white;"
            >Update</md-button
          >
          <md-button
            v-if="mode == 'Create'"
            class="md-success md-raised"
            @click="onConfirmNote();"
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

    <md-button
      v-if="service == 'Zettelkasten'"
      @click="createCard();"
      class="md-fab md-primary"
      style="position: absolute; bottom: 20px; right: 20px; z-index: 199"
    >
      <md-icon>add</md-icon>
    </md-button>

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
            <md-menu-item @click="copyCard(note, index);">
              <md-icon>file_copy</md-icon>
              <span>Copy</span>
            </md-menu-item>

            <md-menu-item @click="deleteCard(note);">
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
  computed: {
    time: function() {
      return Moment(note.time).fromNow();
    }

    // template: function() {
    //   return (
    //     "<p style='text-align: right; position: absolute; right: 50px'><img width=120 src='https://ledger.diglife.coop/images/brand/logo_primary.svg'></p>\n\n# " +
    //     this.display_name +
    //     "\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n## Subtitle goes here\n\n:::warning\n###### tags: " +
    //     (this.formtags.length > 0
    //       ? this.formtags.reduce(function(accumulator, currentValue) {
    //           return [...accumulator, "`" + currentValue.text + "`"];
    //         })
    //       : "") +
    //     "\n###### authors: `" +
    //     this.username +
    //     "`\n:::"
    //   );
    // }

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

    // create new card
    createCard: function(note) {
      //this.note.id = Math.random().toString(36).substring(7);
      //this.note.owner(s) = members
      this.display_name = "";
      this.name = "";
      this.icon = "";
      this.formtags = [];
      this.mode = "Create";
      this.activeDialogNote = true;
    },

    // edit existing card (needs index of note)
    editCard: function(note, index) {
      alert("Please use the application to edit a card.");
    },

    deleteCard: function(note, index) {
      alert("Please use the application to delete a card.");
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
        note.members = [this.username];
        notesRef.child(note.id).update(note);
      });
      this.activeDialogHistory = false;
    },

    // submit card edits
    onConfirmNote: function(formindex) {
      // error validation
      if (this.display_name === "") {
        document.getElementById("display_name").classList.add("md-invalid");
      } else if (this.formtags.length === 0) {
        document.getElementById("formtags").classList.add("md-invalid");
      } else {
        let element = document.getElementById("templatetext");
        switch (this.template) {
          case "plain":
            element.value =
              "<p style='text-align: right; position: absolute; right: 50px'><img width=120 src='https://ledger.diglife.coop/images/brand/logo_primary.svg'></p>\n\n# " +
              this.display_name +
              "\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n" +
              "## Subtitle goes here\n\n";
            break;
          case "meeting":
            element.value =
              "#  :video_camera: Core Team Meeting Agenda & Notes\n" +
              "## ```" +
              Moment().format("LLLL") +
              "```\n" +
              ":warning: Please record the call and post the [link to the recording here](https://wherever.com).\n" +
              "### :eyes: Participants\n" +
              "Chair:\nScribe:\nAttendees:\nApologies:\n" +
              "### :alarm_clock: Meeting Agenda\n" +
              "Please announce that the call will be recorded and posted publicly unless anyone objects; note clearly in call if any sections are not to be shared publicly; allow for short [check-ins & check-outs](https://toolbox.hyperisland.com/check-in-questions) (one thing you liked/learned, one thing you'd change).\n" +
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
              "";
            break;
          case "other":
            break;
          default:
            break;
        }

        // prepare the template tags for CodiMD
        let templatetags = this.formtags.slice();
        // It's missing the first element, so faking it
        templatetags.unshift({ text: "test" });
        let result = templatetags.reduce(function(accumulator, currentValue) {
          return [...accumulator, "`" + currentValue.text + "`"];
        });

        element.value =
          element.value +
          ":::warning\n" +
          "###### tags: " +
          result +
          "\n###### authors: `" +
          this.username +
          "`\n:::";
        element.focus();
        element.select();
        document.execCommand("copy");
        this.activeDialogNote = false;

        this.service = "CodiMD";
        var element = document.getElementById("theApp");
        element.src = "about:blank";
        element.style.display = "block";
        window.open("https://notepad.diglife.coop/new", "theApp");
      }
    },

    // execute card action
    cardAction: function(action, note) {
      switch (action) {
        case "edit":
          this.service = "Zettelkasten Note";
          var element = document.getElementById("theApp");
          element.src = "about:blank";
          element.style.display = "block";
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
