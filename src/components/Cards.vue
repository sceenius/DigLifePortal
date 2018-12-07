<template>
  <div class="md-layout md-gutter" v-if="service == ''">
    <md-card
      md-with-hover
      v-for="(topic, index) in topics"
      :key="index"
      v-bind:class="'card' + topic"
      class="md-layout-item"
    >
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">{{ topic.display_name.replace("#", "") }}</div>
          <div class="md-subhead">Interest & Research Group</div>
          <md-chip>Active</md-chip>
        </md-card-header-text>
        <md-button
          class="md-icon-button"
          @click="showCardNavigation = true;"
          style="position: absolute; top:10px; right: 0px; z-index: 99;"
        >
          <md-icon>menu</md-icon>
        </md-button>

        <md-card-media md-medium>
          <i
            mg
            src="https://ledger.diglife.coop/images/cards/card_chemistry.svg"
            alt="People"
          />
        </md-card-media>
      </md-card-header>

      <div class="md-card-mid">
        <p class="info" v-if="topic.purpose.tags">
          <md-icon>local_offer</md-icon>
          {{
            topic.purpose.tags
              .toString()
              .replace(/[!#*@%/.><"'\\&]/, "")
              .replace(/[,]/g, ", ")
          }}
        </p>
        <p class="info">
          <md-icon>question_answer</md-icon>
          {{ topic.total_msg_count }} message<span
            v-if="topic.total_msg_count > 1"
            >s</span
          >
          posted in channel
        </p>
      </div>
      <md-card-actions>
        <md-button
          style="background: #00b0a0; color: white;"
          @click="
            openGroup(topic.purpose.link, topic.display_name.replace('#', ''));
          "
          >Open</md-button
        >
      </md-card-actions>
      <div class="md-card-footer">
        <div class="md-card-avatars md-scrollbar">
          <md-avatar style="border: 2px solid yellow;">
            <img
              title="Owner"
              v-bind:src="avatarLink(topic.creator)"
              alt="Avatar"
            />
          </md-avatar>
          <md-avatar v-for="(member, index) in topic.members" :key="index">
            <img title="Member" v-bind:src="avatarLink(member)" alt="Avatar" />
          </md-avatar>
        </div>
      </div>
    </md-card>
  </div>
</template>

<script>
import { BASEURL, CHATURL } from "/constants.js";
import db from "@/firebase/init";
//import topics from "@/components/navbar";

export default {
  name: "Tags",
  components: {},
  data() {
    return {
      service: "",
      tag: "",
      channels: [],
      topics: []
    };
  },
  ///////////////////////////////////////////////////////////////////////////////
  //  CREATED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  created: function() {
    let channelsRef = db.database().ref("portal_channels");
    channelsRef.on("child_added", channel => {
      if (channel.val().display_name.charAt(0) === "#") {
        this.topics.push(channel.val());
        this.topics.sort(SortByName);
      }
    });
    function SortByName(x, y) {
      return x.display_name === y.display_name
        ? 0
        : x.display_name > y.display_name
        ? 1
        : -1;
    }
  },
  ///////////////////////////////////////////////////////////////////////////////
  //  COMPUTED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  computed: {},
  ///////////////////////////////////////////////////////////////////////////////
  //  METHODS - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  methods: {
    // compute v-bind:src for img
    avatarLink: function(username) {
      return BASEURL + "images/avatars/avatar_" + username + ".png";
    },

    openGroup: function(link, service) {
      window.open(link, "_blank");
    }
  }
};
</script>

<style>
.md-card {
  width: 260px;
  max-width: 260px;
  height: 340px;
  max-height: 340px;
  margin: 20px 0 0 20px;
  display: inline-block;
  vertical-align: top;
  background-color: #eee !important;
}

.md-card-header {
  height: 134px;
  max-height: 134px;
  margin: -5px 0 0 -5px;
}

.md-card-mid {
  height: 85px;
  max-height: 85px;
  margin: 10px;
  overflow: auto;
}

.md-card .md-title {
  font-weight: bold;
  font-size: 1.8em !important;
  line-height: 1em;
  margin-bottom: 5px;
  width: 200px !important;
}
.md-card-footer {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  max-height: 60px;
  background-color: #ddd;
  overflow: hide;
}

.md-card-avatars {
  max-height: 60px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}

.md-card-avatars::-webkit-scrollbar {
  width: 5px;
  display: none;
}

.md-card-avatars:hover::-webkit-scrollbar {
  display: block;
}

/* Track */
.md-card-avatars::-webkit-scrollbar-track {
  border-radius: 5px;
}

/* Handle */
.md-card-avatars::-webkit-scrollbar-thumb {
  background: #bbb;
  border-radius: 5px;
}

.md-card-actions {
  position: absolute;
  bottom: 60px;
  right: 0px;
}
.md-card .md-avatar {
  margin: 10px 0px 10px 4px;
  border: 1px #ccc solid;
}
.md-card .md-chip {
  background-color: #fc5f61;
  color: white;
  margin: 10px 0 0 0;
  padding: 0px 30px 0px 30px;
  font-size: 1em;
  font-weight: bold;
}

.md-card-media img {
  position: absolute !important;
  right: 30px;
  top: 10px;
  width: 80%;
}

.md-card:hover {
  opacity: 1;
}

.md-subhead {
  color: #222;
  font-size: 1em;
}

.info {
  color: gray;
  margin: 0 0 8px 0;
  line-height: 1em;
  font-size: 1em !important;
}

.info .md-icon {
  font-size: 1.4em !important;
}
</style>
