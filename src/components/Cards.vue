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
          <md-chip style="background-color: green" v-if="isMember(topic)"
            >Joined</md-chip
          >
          <md-chip
            style="background-color: orange"
            v-if="isSuggested(topic) && !isMember(topic)"
            >Suggested</md-chip
          >
          <md-chip
            style="background-color: #ccc"
            v-if="!isMember(topic) && !isSuggested(topic)"
            >Not Joined</md-chip
          >
        </md-card-header-text>
        <md-button
          class="md-icon-button"
          @click="showCardNavigation = true;"
          style="position: absolute; top:5px; right: 5px; z-index: 99;"
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
        <md-button v-if="isMember(topic)" @click="cardAction('leave', topic);"
          >Leave</md-button
        >
        <md-button
          v-if="isMember(topic)"
          style="background: #00b0a0; color: white;"
          @click="cardAction('open', topic);"
          >Open</md-button
        >
        <md-button
          v-if="!isMember(topic)"
          style="background: #00b0a0; color: white;"
          @click="cardAction('join', topic);"
          >Join</md-button
        >
      </md-card-actions>
      <div class="md-card-footer">
        <div class="md-card-avatars md-scrollbar">
          <!--
            md-avatar style="border: 2px solid yellow;">
              <img
                title="Creator"
                v-bind:src="avatarLink(topic.creator)"
                alt="Avatar"
              />
            </md-avatar
          -->
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
      result: "",
      topics: [],
      groups: [],
      tags: []
    };
  },
  ///////////////////////////////////////////////////////////////////////////////
  //  CREATED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  created: function() {
    let channelsRef = db.database().ref("portal_channels");
    channelsRef.on("child_added", channel => {
      let data = channel.val();
      if (data.display_name.charAt(0) === "#") {
        this.topics.push(data);
        this.topics.sort(SortByName);
      }
    });

    if (this.$cookies.get("username")) {
      let groupsRef = db
        .database()
        .ref("portal_profiles/" + this.$cookies.get("username"));
      groupsRef.on("child_added", group => {
        var data = group.val();
        if (group.key === "channels") {
          this.groups = data;
        } else if (group.key === "tags") {
          this.tags = data.reduce((accumulator, currentValue) => {
            return [...accumulator, currentValue.text];
          });
        }
        //console.log("New Groups: "+group.key, this.groups);
      });
    }

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
    // is member
    isMember: function(topic) {
      return JSON.stringify(this.groups).includes(
        topic.team + "/" + topic.name
      );
    },
    // is suggested
    isSuggested: function(topic) {
      if (topic.purpose.tags) {
        //alert(this.tags);
        return this.tags.filter(
          value => -1 !== topic.purpose.tags.indexOf(value)
        ).length;
      } else {
        return false;
      }
    },
    // compute v-bind:src for img
    avatarLink: function(username) {
      return BASEURL + "images/avatars/avatar_" + username + ".png";
    },

    // execute card action
    cardAction: function(action, topic) {
      switch (action) {
        case "join":
          // join channel
          this.axios
            .get(
              BASEURL +
                "webhooks/portal_join_channel.php?file=base-diglife-coop.php&username=" +
                this.$cookies.get("username") +
                "&channel_id=" +
                topic.channel_id
            )
            .then(response => (this.result = response.data))
            .then(response => this.groups.push(topic.team + "/" + topic.name))
            .then(response =>
              topic.members.push(this.$cookies.get("username"))
            );
          break;
        case "open":
          window.open(topic.purpose.link, topic.name);
          break;
        case "leave":
          // leave channel
          this.axios
            .get(
              BASEURL +
                "webhooks/portal_leave_channel.php?file=base-diglife-coop.php&username=" +
                this.$cookies.get("username") +
                "&channel_id=" +
                topic.channel_id
            )
            .then(response => (this.result = response.data))
            .then(response =>
              this.groups.splice(
                this.groups.indexOf(topic.team + "/" + topic.name),
                1
              )
            )
            .then(response =>
              topic.members.splice(
                topic.members.indexOf(this.$cookies.get("username")),
                1
              )
            );
          break;
        default:
      }
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
  margin: -5px 0 15px -15px;
}

.md-card-mid {
  height: 85px;
  max-height: 85px;
  margin: 0px;
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
