<template>
  <div>
    <p st yle="margin-top:-20px">
      Your skillsets & expertise (don't list interests):
    </p>
    <vue-tags-input
      v-model="tag"
      :tags="tags"
      :allow-edit-tags="true"
      :autocomplete-items="filteredItems"
      @before-adding-tag="formatTag"
      @adding-duplicate="addDupe"
      @before-deleting-tag="deleteTag"
      @tags-changed="saveTag"
    >
      <div
        slot="tagLeft"
        class="my-tag-left"
        slot-scope="props"
        @click="props.performOpenEdit(props.index);"
      >
        <md-icon
          v-if="grouptags && JSON.stringify(grouptags).includes(props.tag.text)"
          style="color: white; margin: -2px 3px 0 0; font-size: 20px !important;"
          >verified_user</md-icon
        >
      </div>
    </vue-tags-input>

    <div>
      <p>Skillsets and expertise needed in work teams & interest groups:</p>
      <md-chip
        style="margin: 3px;"
        v-bind:style="{ opacity: tag.frequency / 10 + 0.1 }"
        :md-clickable="true"
        v-for="(tag, index) in autocompleteItems"
        :key="tag.id"
        @click="addTag(index);"
      >
        {{ tag.text }}
      </md-chip>
    </div>
  </div>
</template>

<script>
// http://www.vue-tags-input.com/
import VueTagsInput from "@johmun/vue-tags-input";
import { BASEURL, CHATURL } from "../main.js";
import db from "../firebase/init.js";

export default {
  name: "Tags",
  components: {
    VueTagsInput
  },
  data() {
    return {
      tag: "",
      frequency: 0,
      grouptags: [],
      channels: [],
      //users: [],
      items: [],
      tags: [],
      autocompleteItems: []
    };
  },
  ///////////////////////////////////////////////////////////////////////////////
  //  CREATED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  created: function() {
    // load personal channels and tags from group membership
    let groupsRef = db
      .database()
      .ref(
        "portal_profiles/" + this.$cookies.get("username").replace(".", "%2E")
      );
    groupsRef
      .once("value")
      .then(group => {
        // tags from group membership
        if (group.val().grouptags) {
          this.grouptags = group.val().grouptags;
        }
        // personal tags
        if (group.val().tags) {
          this.tags = group.val().tags;
          this.tags.forEach((tag, index, arr) => {
            this.axios
              .get(
                "https://api.datamuse.com/words?sp=" +
                  tag.text +
                  "&qe=sp&md=f&max=1"
              )

              .then(response => {
                let frequency = parseFloat(
                  response.data[0].tags[1].replace("f:", "")
                );
                let color =
                  frequency > 0.3 && frequency < 50
                    ? "background-color: #00b0a0 !important;"
                    : "background-color: red !important;";
                this.tags[index].style = color;
                this.tags[index].frequency = frequency;

                db.database()
                  .ref(
                    "portal_profiles/" +
                      this.$cookies.get("username").replace(".", "%2E") +
                      "/tags/" +
                      index
                  )
                  .update({
                    frequency: frequency,
                    style: color
                  });
              });
          });
        }
      })
      .catch(error => {
        console.log("code:" + error.code + " message:" + error.message);
      });

    // load ledgerbot channels and tags from group membership
    groupsRef = db.database().ref("portal_profiles/ledgerbot");
    groupsRef
      .once("value")
      .then(group => {
        this.items = group.val().grouptags;
      })
      .then(
        group =>
          (this.autocompleteItems = this.items.map(function(element) {
            return { text: element };
          }))
      )
      //.then(group => console.log("ALL: " + this.autocompleteItems))

      .catch(error => {
        console.log("code:" + error.code + " message:" + error.message);
      });

    // add user data from MM users
    let usersRef = db.database().ref("portal_users");
    usersRef.on("child_added", user => {
      //this.users.push(user.val());
      if (user.val().username === this.$cookies.get("username")) {
        this.profile = user.val();
        this.profile.id = user.key;
      }
    });
  },

  ///////////////////////////////////////////////////////////////////////////////
  //  COMPUTED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  computed: {
    filteredItems() {
      return this.autocompleteItems.filter(i =>
        new RegExp(this.tag, "i").test(i.text)
      );
    }
  },
  ///////////////////////////////////////////////////////////////////////////////
  //  METHODS - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  methods: {
    addTag: function(index) {
      // convert tag to title case
      let words = this.autocompleteItems[index].text
        .split(" ")
        .filter(str => str !== "");
      // capitalize
      words = words.map(str => str[0].toUpperCase() + str.slice(1));
      this.autocompleteItems[index].text = words.join(" ");

      // check for dupes in This.tags
      if (
        !JSON.stringify(this.tags).includes(
          '"' + this.autocompleteItems[index].text + '"'
        )
      ) {
        this.tags.push(this.autocompleteItems[index]);
        // add tags to Firebase for both profiles and users
        db.database()
          .ref(
            "portal_profiles/" +
              this.$cookies.get("username").replace(".", "%2E") +
              "/tags"
          )
          .set(this.tags);
        db.database()
          .ref("portal_users/" + this.profile.id + "/tags")
          .set(this.tags);
      } else {
        alert("This is a duplicate!");
      }
    },

    deleteTag(obj) {
      obj.deleteTag();
      db.database()
        .ref("portal_profiles/" + this.$cookies.get("username") + "/tags")
        .set(this.tags);
      db.database()
        .ref("portal_users/" + this.profile.id + "/tags")
        .set(this.tags);
    },

    formatTag(obj) {
      let words = obj.tag.text.split(" ").filter(str => str !== "");
      // capitalize
      words = words.map(str => str[0].toUpperCase() + str.slice(1));
      obj.tag.text = words.join(" ");
      obj.addTag();
      // add tags to Firebase
      db.database()
        .ref("portal_profiles/" + this.$cookies.get("username") + "/tags")
        .set(this.tags);
      db.database()
        .ref("portal_users/" + this.profile.id + "/tags")
        .set(this.tags);
    },
    addDupe(obj) {
      alert("This is a duplicate!");
    },
    saveTag(arr) {
      this.tags = arr;
      // add tags to Firebase
      db.database()
        .ref(
          "portal_profiles/" +
            this.$cookies.get("username").replace(".", "%2E") +
            "/tags"
        )
        .update(this.tags);
    }
  }
};
</script>
