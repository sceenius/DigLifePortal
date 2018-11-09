<template>
  <div>
    <vue-tags-input
      v-model="tag"
      :tags="tags"
      @tags-changed="newTags => (tags = newTags)"
    />
  </div>
</template>

<script>
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
        { text: "Digital Identity" },
        { text: "AI" },
        { text: "Governance" },
        { text: "Self-Organization" },
        { text: "Graphic Design" },
        { text: "Technology" },
        { text: "Social Ledger" }
      ]
    };
  }
};
</script>

<style>
.vue-tags-input {
  max-width: 100% !important;
}
.icon-close,
.icon-undo {
  background-color: #6dcec5;
  border-radius: 50%;
  padding: 2px;
  margin-left: 2px;
}

li.tag {
  height: 34px !important;
  padding: 0 12px !important;
  background-color: #00b0a0 !important;
  border-radius: 34px !important;
  font-size: 15px !important;
  line-height: 34px !important;
  vertical-align: middle !important;
  white-space: nowrap !important;
}
</style>
