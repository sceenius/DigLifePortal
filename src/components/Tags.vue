<template>
  <div>
    <vue-tags-input
      v-model="tag"
      :tags="tags"
      :allow-edit-tags="true"
      :autocomplete-items="filteredItems"
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
      ],
      autocompleteItems: [
        { text: "Identity" },
        { text: "Artificial Intelligence" },
        { text: "Human Intelligence" },
        { text: "DigLife" },
        { text: "Self-Organization" }
      ]
    };
  },
  computed: {
    filteredItems() {
      return this.autocompleteItems.filter(i =>
        new RegExp(this.tag, "i").test(i.text)
      );
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
</style>
