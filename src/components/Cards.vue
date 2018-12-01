<template>
  <div>
    <md-card
      md-with-hover
      v-for="(card, index) in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
      :key="index"
    >
      <md-card-area md-inset>
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">Research Topic</div>
            <div class="md-subhead">Self-sovereign Identity</div>
            <md-chip>Active</md-chip>
          </md-card-header-text>

          <md-card-media md-medium>
            <img
              src="https://ledger.diglife.coop/images/cards/card_chemistry.svg"
              alt="People"
            />
          </md-card-media>
        </md-card-header>
        <p style="margin: 0 5px 0 15px; color: gray; t ext-indent: -1.7em">
          <md-icon>bookmark</md-icon>Identity Platform, Data Sharing,
          Distributed Ledger, Sovrin, Trust Framework
        </p>
        <md-card-actions>
          <md-button>Leave</md-button>
          <md-button style="background: #00b0a0; color: white;">Join</md-button>
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

export default {
  name: "Tags",
  components: {},
  data() {
    return {
      tag: ""
    };
  },
  ///////////////////////////////////////////////////////////////////////////////
  //  CREATED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  created: function() {},

  ///////////////////////////////////////////////////////////////////////////////
  //  METHODS - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  methods: {
    xxxxxxxxxx: function(index) {}
  }
};
</script>

<style>
.md-card {
  width: 360px;
  margin: 14px;
  display: inline-block;
  vertical-align: top;
  background-color: #eee !important;
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
}
</style>
