<template>
  <div>
    <vue-tags-input
      v-model="tag"
      :tags="tags"
      :allow-edit-tags="true"
      :autocomplete-items="filteredItems"
      @tags-changed="newTags => (tags = newTags)"
    />

    <div style="overflow: auto; height: 45vh;">
      <p style="margin: -20px 0px 10px -10px ">Suggested tags:</p>
      <md-chip
        style="margin: 3px;"
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
        { text: "Knowledge Management" },
        { text: "Web Design" },
        { text: "Social Collaboration" },
        { text: "Governance" },
        { text: "Social Ledger" }
      ],
      autocompleteItems: [
        { text: "Accessibility", frequency: 1 },
        { text: "Administration", frequency: 1 },
        { text: "Artificial Intelligence", frequency: 1 },
        { text: "Authentication", frequency: 1 },
        { text: "Automation", frequency: 1 },
        { text: "Biometrics", frequency: 1 },
        { text: "Bitcoin", frequency: 1 },
        { text: "Blockchain", frequency: 1 },
        { text: "Collective Intelligence", frequency: 1 },
        { text: "Communication", frequency: 1 },
        { text: "Compliance", frequency: 1 },
        { text: "Computer Science", frequency: 1 },
        { text: "Conflict Resolution", frequency: 1 },
        { text: "Co-operative", frequency: 1 },
        { text: "Cryptocurrency", frequency: 1 },
        { text: "Data Analysis", frequency: 1 },
        { text: "Decentralization", frequency: 1 },
        { text: "Decision Making", frequency: 1 },
        { text: "Education Systems", frequency: 1 },
        { text: "Finance Tech", frequency: 1 },
        { text: "GDPR", frequency: 1 },
        { text: "Governance", frequency: 1 },
        { text: "Healthcare Systems", frequency: 1 },
        { text: "Human Intelligence", frequency: 1 },
        { text: "Identity", frequency: 1 },
        { text: "Inclusion", frequency: 1 },
        { text: "Interviewing", frequency: 1 },
        { text: "Knowledge Management", frequency: 1 },
        { text: "Listening", frequency: 1 },
        { text: "Marketing", frequency: 1 },
        { text: "Marketing Tech", frequency: 1 },
        { text: "Member Development", frequency: 1 },
        { text: "Member Engagement", frequency: 1 },
        { text: "Onboarding", frequency: 1 },
        { text: "Open source software", frequency: 1 },
        { text: "Orientation", frequency: 1 },
        { text: "Peer-to-peer networks", frequency: 1 },
        { text: "Presentation", frequency: 1 },
        { text: "Privacy", frequency: 1 },
        { text: "Programming", frequency: 1 },
        { text: "Project Management", frequency: 1 },
        { text: "Qualitative Analysis", frequency: 1 },
        { text: "Quantitative Analysis", frequency: 1 },
        { text: "Quantum Informatics", frequency: 1 },
        { text: "Robotics", frequency: 1 },
        { text: "Self-organization", frequency: 1 },
        { text: "Semantic Analysis", frequency: 1 },
        { text: "Social Awareness", frequency: 1 },
        { text: "Social Collaboration", frequency: 1 },
        { text: "Social intelligence", frequency: 1 },
        { text: "Social Media", frequency: 1 },
        { text: "Social Network Analysis", frequency: 1 },
        { text: "Sociocracy", frequency: 1 },
        { text: "Speaking", frequency: 1 },
        { text: "Statistics", frequency: 1 },
        { text: "Surveillance", frequency: 1 },
        { text: "Systems Architecture", frequency: 1 },
        { text: "Tor", frequency: 1 },
        { text: "Usability", frequency: 1 },
        { text: "User Experience", frequency: 1 },
        { text: "User Interface Design", frequency: 1 },
        { text: "Visualization", frequency: 1 },
        { text: "Web Design ", frequency: 1 },
        { text: "Web Development", frequency: 1 },
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
      this.tags.push(this.autocompleteItems[index]);
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
</style>
