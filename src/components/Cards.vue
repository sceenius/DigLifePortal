<template>
  <div class="md-layout md-gutter">
    <md-card
      md-with-hover
      v-for="(card, index) in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"
      :key="index"
      v-bind:class="'card' + card"
      class="md-layout-item"
    >
      <md-card-area md-inset>
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">Research Group</div>
            <div class="md-subhead">Self-sovereign Identity</div>
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
        <p style="margin: 0 5px 0 15px; color: gray; t ext-indent: -1.7em">
          <md-icon>bookmark</md-icon>Identity Platform, Data Sharing,
          Distributed Ledger, Sovrin, Trust Framework
        </p>
        <md-card-actions>
          <md-button>Ask</md-button>
          <md-button v-if="card > 2" style="background: #00b0a0; color: white;"
            >Join</md-button
          >
          <md-button v-if="card <= 2" style="background: #00b0a0; color: white;"
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
  width: 340px;
  max-width: 340px;
  height: 310px;
  max-height: 310px;
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
</style>
