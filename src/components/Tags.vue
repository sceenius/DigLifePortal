<template>
  <div>
    <p style="margin-top:-20px">
      Your skillsets and expertise (not interests):
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
        <!-- v-if="props.tag.verified" -->
        <md-icon
          v-if="grouptags && JSON.stringify(grouptags).includes(props.tag.text)"
          style="color: white; margin: -2px 3px 0 0; font-size: 20px !important;"
          >verified_user</md-icon
        >
      </div>
    </vue-tags-input>

    <div>
      <p>Skillsets and expertise needed in work teams:</p>
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
import { BASEURL, CHATURL } from "/constants.js";
import db from "@/firebase/init";

export default {
  name: "Tags",
  components: {
    VueTagsInput
  },
  data() {
    return {
      tag: "",
      grouptags: [],
      channels: [],
      users: [],
      tags: [
        // { text: "Knowledge Management", verified: true },
        // { text: "Web Design", verified: true },
        // { text: "Social Collaboration", verified: true },
        // { text: "Governance" },
        // { text: "Social Ledger", verified: true }
      ],
      autocompleteItems: [
        // { text: "Accessibility", frequency: 5 },
        // { text: "Accounting", frequency: 2 },
        // { text: "Administration", frequency: 4 },
        // { text: "Artificial Intelligence", frequency: 5 },
        // { text: "Authentication", frequency: 7 },
        // { text: "Automation", frequency: 4 },
        // { text: "Biometrics", frequency: 10 },
        // { text: "Bitcoin", frequency: 10 },
        // { text: "Blockchain", frequency: 5 },
        // { text: "Business Development", frequency: 10 },
        // { text: "Change Management", frequency: 9 },
        // { text: "Co-Design", frequency: 2 },
        // { text: "Collaboration", frequency: 10 },
        // { text: "Collective Currencies", frequency: 3 },
        // { text: "Collective Intelligence", frequency: 5 },
        // { text: "Communication", frequency: 5 },
        // { text: "Community Organizing", frequency: 5 },
        // { text: "Compliance", frequency: 6 },
        // { text: "Computer Science", frequency: 1 },
        // { text: "Conflict Resolution", frequency: 2 },
        // { text: "Conflict Resolution", frequency: 6 },
        // { text: "Consent-Based Decision-Making", frequency: 9 },
        // { text: "Cooperation At Scale", frequency: 1 },
        // { text: "Co-Operative", frequency: 2 },
        // { text: "Cryptocurrency", frequency: 2 },
        // { text: "Currency Design", frequency: 3 },
        // { text: "Cutting Fragmentation And Redundant Effort", frequency: 10 },
        // { text: "Data Analysis", frequency: 8 },
        // { text: "Data Science", frequency: 8 },
        // { text: "Decentralization", frequency: 8 },
        // { text: "Decision Making", frequency: 1 },
        // { text: "Deep Listening", frequency: 10 },
        // { text: "Developing Competitive Strategies", frequency: 8 },
        // { text: "Education Systems", frequency: 9 },
        // { text: "Event Planning", frequency: 1 },
        // { text: "Facilitation", frequency: 4 },
        // { text: "Finance Tech", frequency: 10 },
        // { text: "Foraging Social Amplification", frequency: 3 },
        // { text: "Free Speech", frequency: 4 },
        // { text: "GDPR", frequency: 4 },
        // { text: "Global Communication", frequency: 1 },
        // { text: "Governance", frequency: 8 },
        // { text: "Grant Writing", frequency: 2 },
        // { text: "Graphic Design", frequency: 4 },
        // { text: "Hardware Design", frequency: 8 },
        // { text: "Healthcare Systems", frequency: 6 },
        // { text: "Html", frequency: 3 },
        // { text: "Human Intelligence", frequency: 9 },
        // { text: "Identity", frequency: 1 },
        // { text: "Inclusion", frequency: 2 },
        // { text: "Individual Empowerment", frequency: 8 },
        // { text: "Interviewing", frequency: 7 },
        // { text: "Knowledge Management", frequency: 4 },
        // { text: "Legal", frequency: 2 },
        // { text: "Lifelong Learning", frequency: 4 },
        // { text: "Listening", frequency: 2 },
        // { text: "Machine Learning", frequency: 5 },
        // { text: "Marketing", frequency: 3 },
        // { text: "Marketing Tech", frequency: 8 },
        // { text: "Member Development", frequency: 9 },
        // { text: "Member Engagement", frequency: 6 },
        // { text: "Member Relations", frequency: 6 },
        // { text: "Network Governance", frequency: 10 },
        // { text: "Network Mapping", frequency: 2 },
        // { text: "Network Weaving", frequency: 1 },
        // { text: "Non-Violent Communication", frequency: 1 },
        // {
        //   text: "Nurturing And Sustaining Authentic Relationships",
        //   frequency: 10
        // },
        // { text: "Onboarding", frequency: 4 },
        // { text: "Open Source Software", frequency: 3 },
        // { text: "Organizational Design", frequency: 4 },
        // { text: "Organizational Learning", frequency: 8 },
        // { text: "Orientation", frequency: 7 },
        // { text: "Outreach", frequency: 10 },
        // { text: "Participatory Action Research", frequency: 2 },
        // { text: "Peer-To-Peer Networks", frequency: 2 },
        // { text: "People First", frequency: 7 },
        // { text: "Personal Development", frequency: 7 },
        // { text: "Personal Web Sites", frequency: 9 },
        // { text: "Presentation", frequency: 6 },
        // { text: "Privacy", frequency: 4 },
        // { text: "Privacy", frequency: 4 },
        // { text: "Problem Solving", frequency: 9 },
        // { text: "Process Design", frequency: 10 },
        // { text: "Programming", frequency: 9 },
        // { text: "Project Management", frequency: 1 },
        // { text: "Public Relations", frequency: 7 },
        // { text: "Public Speaking", frequency: 2 },
        // { text: "Qualitative Analysis", frequency: 1 },
        // { text: "Quantitative Analysis", frequency: 3 },
        // { text: "Quantum Informatics", frequency: 6 },
        // { text: "Reflection And Learning", frequency: 10 },
        // { text: "Robotics", frequency: 6 },
        // { text: "Self-Organization", frequency: 10 },
        // { text: "Semantic Analysis", frequency: 10 },
        // { text: "Social Awareness", frequency: 2 },
        // { text: "Social Collaboration", frequency: 8 },
        // { text: "Social Intelligence", frequency: 7 },
        // { text: "Social Media", frequency: 1 },
        // { text: "Social Network Analysis", frequency: 9 },
        // { text: "Sociocracy", frequency: 2 },
        // { text: "Software Development", frequency: 10 },
        // { text: "Software Engineering", frequency: 7 },
        // { text: "Statistics", frequency: 3 },
        // { text: "Surveillance", frequency: 2 },
        // { text: "Sys Admin", frequency: 9 },
        // { text: "System Design", frequency: 10 },
        // { text: "Systems Architecture", frequency: 5 },
        // { text: "Tax And Government", frequency: 10 },
        // { text: "Team/Project Coordination", frequency: 7 },
        // { text: "Tech We Trust", frequency: 5 },
        // { text: "Usability", frequency: 5 },
        // { text: "User Experience", frequency: 2 },
        // { text: "User Interface Design", frequency: 8 },
        // { text: "UX/UI Design", frequency: 5 },
        // { text: "Visualization", frequency: 4 },
        // { text: "Vulnerability", frequency: 4 },
        // { text: "Web Design", frequency: 1 },
        // { text: "Web Deveopment", frequency: 9 },
        // { text: "Wordpress", frequency: 2 },
        // { text: "Writing", frequency: 2 }
      ]
    };
  },
  ///////////////////////////////////////////////////////////////////////////////
  //  CREATED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  created: function() {
    // load personal channels and tags from group membership
    let groupsRef = db
      .database()
      .ref("portal_profiles/" + this.$cookies.get("username"));
    groupsRef
      .once("value")
      .then(group => {
        if (group.val().grouptags) {
          this.grouptags = group.val().grouptags;
        }
        if (group.val().tags) {
          this.tags = group.val().tags;
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
        this.autocompleteItems = group.val().grouptags;

        console.log("ALL" + this.autocompleteItems);
      })
      .then(
        group =>
          (this.autocompleteItems = this.autocompleteItems.map(function(
            element
          ) {
            return { text: element };
          }))
      )
      .catch(error => {
        console.log("code:" + error.code + " message:" + error.message);
      });

    let usersRef = db.database().ref("portal_users");
    usersRef.on("child_added", user => {
      this.users.push(user.val());
      if (user.val().username === this.$cookies.get("username")) {
        this.profile = user.val();
      }
    });

    // load personal profile from users
    // this.profile = this.users.find(item => {
    //   return item.username === this.$cookies.get("username");
    // });

    // //fetch user channels and channel tags
    // this.axios
    //   .get(
    //     BASEURL +
    //       "webhooks/portal_profiles.php?file=base-diglife-coop.php&username=" +
    //       this.$cookies.get("username")
    //   )
    //   .then(response => (this.groups = response.data));

    // //fetch ledgerbot (=all) channels and channel tags
    // // FEATURE --- AGGREGATE FROM FB
    // this.axios
    //   .get(
    //     BASEURL +
    //       "webhooks/portal_profiles.php?file=base-diglife-coop.php&username=ledgerbot"
    //   )
    //   .then(response => (this.channels = response.data))
    //   .then(
    //     response =>
    //       (this.autocompleteItems = this.channels.tags.map(function(element) {
    //         return { text: element };
    //       }))
    //   );

    // fetch personal profile data from Firestore
    // db.firestore()
    //   .collection("members")
    //   .doc(this.$cookies.get("username"))
    //   .get()
    //   .then(doc => {
    //     if (doc.exists) {
    //       if (doc.data().tags === undefined) {
    //         this.tags = [];
    //       } else this.tags = doc.data().tags;
    //     } else {
    //       // doc.data() will be undefined in this case

    //       console.log(
    //         "No document for user " + this.$cookies.get("username") + "!"
    //       );
    //     }
    //   })
    //   .catch(function(error) {
    //     console.log("Error getting document:", error);
    //   });
  },
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
        // add tags to Firebase
        console.log("New Tags:" + this.tags);
        db.database()
          .ref("portal_profiles/" + this.$cookies.get("username") + "/tags")
          .set(this.tags);
      } else {
        alert("This is a duplicate!");
      }
    },

    deleteTag(obj) {
      obj.deleteTag();
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
    },
    addDupe(obj) {
      alert("This is a duplicate!");
    },
    saveTag(arr) {
      this.tags = arr;
      // add tags to Firebase
      db.database()
        .ref("portal_profiles/" + this.$cookies.get("username") + "/tags")
        .update(this.tags);
    }
  }
};
</script>

<style>
.vue-tags-input {
  max-width: 100% !important;
}

.new-tag-input {
  font-weight: bold !important;
}
.icon-close,
.icon-undo {
  background-color: #6dcec5;
  border-radius: 50%;
  padding: 2px 2px 2px 3px;
  margin-left: 3px;
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

.md-chip {
  cursor: pointer;
}

.shading1 {
  opacity: 0.5;
}
</style>
