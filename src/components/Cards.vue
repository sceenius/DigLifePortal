<template>
  <div class="md-layout md-gutter">
    <md-card
      md-with-hover
      v-for="(topic, index) in topics"
      :key="index"
      v-bind:class="'card' + topic"
      class="md-layout-item"
    >
      <md-card-area md-inset>
        <md-card-header style="margin-bottom: 10px ;">
          <md-card-header-text>
            <div class="md-title">
              {{ topic.display_name.replace("#", "") }}
            </div>
            <div class="md-subhead">Interest & Research Group</div>
            <md-chip>Active</md-chip>
          </md-card-header-text>
          <md-button
            class="md-icon-button"
            @click="showCardNavigation = true;"
            style="position: absolute; top:5px; right: 5px; z-index: 99;"
          >
            <md-icon>menu</md-icon>
          </md-button>

          <md-card-media md-medium>
            <img
              src="https://ledger.diglife.coop/images/cards/card_chemistry.svg"
              alt="People"
            />
          </md-card-media>
        </md-card-header>
        <md-card-area
          style="height: 65px; margin: -15px 0 -15px 15px; overflow: auto;"
        >
          <p class="info">
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
        </md-card-area>
        <md-card-actions>
          <md-button
            style="background: #00b0a0; color: white;"
            @click="
              openGroup(
                topic.purpose.link,
                topic.display_name.replace('#', '')
              );
            "
            >Open</md-button
          >
        </md-card-actions>
      </md-card-area>
      <div class="md-card-footer">
        <md-avatar>
          <img
            title="Jim"
            src="https://ledger.diglife.coop/images/avatars/avatar_jimscarver.png"
            alt="Avatar"
          />
        </md-avatar>
        <md-avatar>
          <img
            title="Christina"
            src="https://ledger.diglife.coop/images/avatars/avatar_christina.png"
            alt="Avatar"
          />
        </md-avatar>
        <md-avatar>
          <img
            title="Joachim"
            src="https://ledger.diglife.coop/images/avatars/avatar_joachim.png"
            alt="Avatar"
          />
        </md-avatar>
        <md-avatar>
          <img
            title="Graham"
            src="https://ledger.diglife.coop/images/avatars/avatar_graham.png"
            alt="Avatar"
          />
        </md-avatar>
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
  //  METHODS - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  methods: {
    openGroup: function(link, service) {
      this.service = service;
      window.open(link, "_blank");
    }
  }
};
</script>

<style>
.md-card {
  width: 340px;
  max-width: 340px;
  height: 315px;
  max-height: 315px;
  margin: 14px;
  display: inline-block;
  vertical-align: top;
  background-color: #eee !important;
  opacity: 0.3;
}
.md-card .md-title {
  font-weight: normal !important;
  font-size: 1.8em !important;
  line-height: 1em;
  margin-bottom: 5px;
  width: 200px !important;
}
.md-card-footer {
  margin-left: 10px;
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
.card1,
.card2 {
  opacity: 1 !important;
}
.md-card:hover {
  opacity: 1;
}

.md-card-area {
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
