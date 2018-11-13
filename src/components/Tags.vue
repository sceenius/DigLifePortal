<template>
  <div>
    <vue-tags-input
      v-model="tag"
      :tags="tags"
      :allow-edit-tags="true"
      :autocomplete-items="filteredItems"
      @tags-changed="newTags => (tags = newTags)"
      @before-adding-tag="formatTag"
      @adding-duplicate="addDupe"
    >
      <div
        slot="tagLeft"
        class="my-tag-left"
        slot-scope="props"
        @click="props.performOpenEdit(props.index);"
      >
        <md-icon
          v-if="props.tag.verified"
          style="color: white; margin: -2px 3px 0 0; font-size: 20px !important;"
          >verified_user</md-icon
        >
      </div>
    </vue-tags-input>

    <div style="overflow: auto; height: 45vh;">
      <p style="margin: -20px 0px 10px -10px ">Suggested tags:</p>
      <md-chip
        style="margin: 3px;"
        v-bind:style="{ opacity: 1 - 1 / tag.frequency + 0.5 }"
        :md-clickable="true"
        v-for="(tag, index) in autocompleteItems"
        :key="tag.id"
        @click="addTag(index);"
      >
        {{ tag.text }}</md-chip
      >
    </div>
  </div>
</template>

<script>
// http://www.vue-tags-input.com/
import VueTagsInput from "@johmun/vue-tags-input";

export default {
  name: "Tags",
  components: {
    VueTagsInput
  },
  data() {
    return {
      tag: "",
      tags: [
        { text: "Knowledge Management", verified: true },
        { text: "Web Design", verified: true },
        { text: "Social Collaboration", verified: true },
        { text: "Governance" },
        { text: "Social Ledger", verified: true }
      ],
      autocompleteItems: [
        { text: "Accessibility", frequency: 1 },
        { text: "Administration", frequency: 2 },
        { text: "Artificial Intelligence", frequency: 4 },
        { text: "Authentication", frequency: 8 },
        { text: "Automation", frequency: 3 },
        { text: "Biometrics", frequency: 1 },
        { text: "Bitcoin", frequency: 3 },
        { text: "Blockchain", frequency: 1 },
        { text: "Collective Intelligence", frequency: 5 },
        { text: "Communication", frequency: 1 },
        { text: "Compliance", frequency: 1 },
        { text: "Computer Science", frequency: 1 },
        { text: "Conflict Resolution", frequency: 7 },
        { text: "Co-operative", frequency: 1 },
        { text: "Cryptocurrency", frequency: 6 },
        { text: "Data Analysis", frequency: 2 },
        { text: "Decentralization", frequency: 1 },
        { text: "Decision Making", frequency: 2 },
        { text: "Education Systems", frequency: 8 },
        { text: "Finance Tech", frequency: 3 },
        { text: "GDPR", frequency: 1 },
        { text: "Governance", frequency: 8 },
        { text: "Healthcare Systems", frequency: 1 },
        { text: "Human Intelligence", frequency: 8 },
        { text: "Identity", frequency: 3 },
        { text: "Inclusion", frequency: 3 },
        { text: "Interviewing", frequency: 8 },
        { text: "Knowledge Management", frequency: 1 },
        { text: "Listening", frequency: 1 },
        { text: "Marketing", frequency: 8 },
        { text: "Marketing Tech", frequency: 1 },
        { text: "Member Development", frequency: 8 },
        { text: "Member Engagement", frequency: 8 },
        { text: "Onboarding", frequency: 3 },
        { text: "Open source software", frequency: 8 },
        { text: "Orientation", frequency: 8 },
        { text: "Peer-to-peer networks", frequency: 1 },
        { text: "Presentation", frequency: 1 },
        { text: "Privacy", frequency: 1 },
        { text: "Programming", frequency: 2 },
        { text: "Project Management", frequency: 8 },
        { text: "Qualitative Analysis", frequency: 8 },
        { text: "Quantitative Analysis", frequency: 1 },
        { text: "Quantum Informatics", frequency: 1 },
        { text: "Robotics", frequency: 1 },
        { text: "Self-organization", frequency: 2 },
        { text: "Semantic Analysis", frequency: 1 },
        { text: "Social Awareness", frequency: 2 },
        { text: "Social Collaboration", frequency: 3 },
        { text: "Social intelligence", frequency: 1 },
        { text: "Social Media", frequency: 5 },
        { text: "Social Network Analysis", frequency: 5 },
        { text: "Sociocracy", frequency: 4 },
        { text: "Speaking", frequency: 1 },
        { text: "Statistics", frequency: 5 },
        { text: "Surveillance", frequency: 5 },
        { text: "Systems Architecture", frequency: 1 },
        { text: "Tor", frequency: 1 },
        { text: "Usability", frequency: 4 },
        { text: "User Experience", frequency: 1 },
        { text: "User Interface Design", frequency: 3 },
        { text: "Visualization", frequency: 2 },
        { text: "Web Design ", frequency: 3 },
        { text: "Web Development", frequency: 8 },
        { text: "Writing", frequency: 1 }
      ]
    };
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
      // check for dupes in This.tags
      if (
        !JSON.stringify(this.tags).includes(
          '"' + this.autocompleteItems[index].text + '"'
        )
      ) {
        this.tags.push(this.autocompleteItems[index]);
      } else {
        alert("This is a duplicate!");
      }
    },
    formatTag(obj) {
      let words = obj.tag.text.split(" ").filter(str => str !== "");
      // capitalize
      words = words.map(str => str[0].toUpperCase() + str.slice(1));
      obj.tag.text = words.join(" ");
      obj.addTag();
    },
    addDupe(obj) {
      alert("This is a duplicate!");
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
