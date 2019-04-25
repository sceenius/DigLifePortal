<template>
  <div>
    <!--
      ----------------------------------------------------------------------
        SNACKBARS  - https://vuematerial.io/components/snackbar
      ----------------------------------------------------------------------
    -->
    <md-snackbar :md-duration="4000" :md-active.sync="showSnackBar" md-persistent>
      <span>{{ snack }}</span>
      <md-button class="md-primary" @click="showSnackBar = false;">Dismiss</md-button>
    </md-snackbar>
    <!--
      ----------------------------------------------------------------------
        DIALOG BOXES - SETTINGS DIALOG
      ----------------------------------------------------------------------
    -->
    <md-dialog :md-active.sync="activeSettings" style="width:650px;">
      <md-dialog-title>Profile Tags</md-dialog-title>
      <Tags style="padding: 20px;"/>
    </md-dialog>

    <svg width="100%" height="100%"></svg>
  </div>
</template>

<script>
//import {scaleLinear} from "d3-scale";
import * as d3 from "d3"; //all
import db from "../firebase/init";
import Tags from "./Tags.vue";
import Moment from "moment";
import { BASEURL, CHATURL } from "../main.js";
import _ from "lodash/fp/array"; //lodash/fp/object for objects only

export default {
  name: "Skills",
  components: { Tags },
  props: ["domain"],
  data() {
    return {
      service: "Skills",
      users: [],
      nodes: [],
      links: [],
      profiles: [],
      activeSettings: false,
      showSnackBar: false,
      width: "",
      height: "",
      color: "",
      drag: "",
      snack: ""
    };
  },
  ///////////////////////////////////////////////////////////////////////////////
  //  CREATED - https://vuejs.org/v2/guide/instance.html
  //
  ///////////////////////////////////////////////////////////////////////////////
  created: function() {
    let usersRef = db.database().ref("portal_users");
    let profilesRef = db.database().ref("portal_profiles");

    usersRef.once("value", users => {
      users.forEach(user => {
        let data = user.val();
        //console.log(JSON.stringify(data.channels));
        data.moretags = [];
        data.fromTime = Moment(data.create_at).fromNow();
        data.diffTime = new Date().getTime();
        data.diffTime =
          (data.diffTime - data.create_at) / (1000 * 60 * 60 * 24);
        //console.log(data.diffTime);

        profilesRef
          .child(data.username.replace(".", "%2E"))
          .once("value", profile => {
            let snapshot = profile.val();
            if (snapshot) {
              if (snapshot.tags) {
                data.moretags = [];
                for (let i = 0; i < snapshot.tags.length; i++) {
                  data.moretags.push(snapshot.tags[i].text);
                }
              }
              if (snapshot.domains) {
                data.domains = snapshot.domains;
              }
              // lodash merge crashes, so use https://github.com/tc39/proposal-object-rest-spread
              data = { ...data, ...snapshot }; //_.merge(data, snapshot);
            }
          })
          .then(profile => {
            if (data.domains.includes(this.domain) || this.domain == "all") {
              this.users.push(data);
              //if (data.domains.includes(domain)) { //requires updated profile
              this.nodes.push({
                id: data.username,
                domains: data.domains,
                location: data.timezone.automaticTimezone,
                group: 1,
                tags: data.moretags.length > 0 ? data.moretags.sort() : [],
                fromTime: data.fromTime,
                diffTime: data.diffTime,
                fullname: data.first_name + " " + data.last_name
              });
              this.users.forEach((user, index, arr) => {
                if (user.username !== data.username) {
                  //console.log(data.moretags);
                  //let intersection = [];
                  let intersection = _.intersection(
                    user.moretags,
                    data.moretags
                  );

                  if (intersection.length > 0) {
                    //console.log(this.links);
                    this.links.push({
                      source: user.username,
                      target: data.username,
                      value: intersection.length,
                      tags: intersection
                    });
                  }
                }
              });
            } // IF DOMAIN
          });
      });
    });
  },

  ///////////////////////////////////////////////////////////////////////////////
  //  MOUNTED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  //methods: { }
  mounted: function() {
    new Promise(resolve => setTimeout(resolve, 1000)).then(resolve => {
      console.log("Continuing...");
      this.height = 932;
      this.width = this.height;

      this.color = d3.scaleOrdinal(d3.schemeCategory10);

      var drag = simulation => {
        function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }

        function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }

        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }

        return d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
      };

      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      const links = this.graph.links.map(d => Object.create(d));
      const nodes = this.graph.nodes.map(d => Object.create(d));

      const simulation = d3
        .forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("collide", d3.forceCollide(40))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(this.width / 2, this.height / 2 - 100));

      const svg = d3
        .select("svg")
        .attr("preserveAspectRatio", "xMinYMin")
        .attr(
          "viewBox",
          `${-100} ${-100} ${this.width + 100} ${this.height + 100}`
        )
        .style("display", "block");

      const link = svg
        .append("g")
        .attr("stroke", "#404040")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("stroke-width", d => d.value)
        .on("mouseover.tooltip", d => {
          tooltip
            .transition()
            .duration(300)
            .style("opacity", 0.8);
          tooltip
            .html(
              "<p>" +
                d.value +
                " Shared Tag" +
                (d.value > 1 ? "s" : "") +
                ":</p><br>" +
                (d.tags
                  ? d.tags
                      .map(el => {
                        return "<span>" + el + "</span><br>";
                      })
                      .toString()
                      .replace(/,/g, "")
                  : "No tags defined")
            )
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + 10 + "px");
        })
        .on("mouseout.tooltip", d => {
          tooltip
            .transition()
            .duration(100)
            .style("opacity", 0);
        });

      const node = svg
        .append("g")
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", 20)
        .attr("stroke", d => {
          return d.diffTime > 30 ? "#eee" : "#000";
        })
        .attr("stroke-dasharray", d => {
          return d.diffTime > 30 ? null : "3,3";
        })
        .attr("stroke-width", 1.5)
        .attr("id", d => {
          return d.id;
        })
        .style("fill", d => {
          return "url(#avatar_" + d.id + ")";
        })
        .on("mouseover.tooltip", d => {
          tooltip
            .transition()
            .duration(300)
            .style("opacity", 0.8);
          tooltip
            .html(
              "<p margin-bottom: 1em>" +
                (d.fullname !== " " ? d.fullname : d.id) +
                "<br><i style='font-size: 0.8em;'>Joined " +
                d.fromTime +
                "</i><br>Local Time: " +
                Moment.tz(d.location).format("LT") +
                "</p><br>" +
                (d.tags.length > 0
                  ? d.tags
                      .map(el => {
                        return el + "<hr>";
                      })
                      .toString()
                      .replace(/,/g, "")
                  : "No tags defined")
            )
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + 10 + "px");
        })
        .on("mouseout.tooltip", d => {
          tooltip
            .transition()
            .duration(100)
            .style("opacity", 0);
        })
        .on("click", d => {
          if (d.id === this.$cookies.get("username")) {
            this.activeSettings = true;
          } else {
            // open a 1:1 chat window
            window.open(
              CHATURL +
                (this.domain == "all" ? d.domains[0] : this.domain) +
                "/messages/@" +
                d.id,
              "_target"
            );
            ///-- https://chat.diglife.coop/"+data.domain[0]+"/messages/@"+username"
          }
        })
        //.attr("stroke", d =>  this.color(d.group) )
        .call(drag(simulation));
      //node.append("title").text(d => d.id);

      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        node.attr("cx", d => d.x).attr("cy", d => d.y);
      });

      const defs = svg.append("svg:defs");

      for (var i = 0; i < this.graph.nodes.length; i++) {
        defs
          .append("svg:pattern")
          .data(this.graph.nodes)
          .attr("id", d => {
            //console.log(this.graph.nodes[i]);
            return "avatar_" + this.graph.nodes[i].id;
          })
          .attr("width", "1")
          .attr("height", "1")
          .append("svg:image")
          .attr("xlink:href", d => {
            return (
              "https://ledger.diglife.coop/images/avatars/avatar_" +
              this.graph.nodes[i].id +
              ".png"
            );
          })
          // .attr("id", d => {
          //   return "image_" + this.graph.nodes[i].id;
          // })
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", 40)
          .attr("height", 40);
      }

      //invalidation.then(() => simulation.stop());
      this.snack =
        "Click on your avatar to update your profile, then refresh the map.";
      this.showSnackBar = true;
      return svg.node();
    });
  },

  ///////////////////////////////////////////////////////////////////////////////
  //  METHODS - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  methods: {},

  ///////////////////////////////////////////////////////////////////////////////
  //  COMPUTED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  computed: {
    graph: function() {
      let domain =
        !this.domain || this.domain === "Home"
          ? "diglife"
          : this.domain.toLowerCase();
      return {
        nodes: this.nodes,
        links: this.links
      };
    }
  }
};
</script>

<style>
div.tooltip {
  line-height: 1em;
  position: absolute;
  background-color: #0dc9c9;
  color: white;
  height: auto;
  font-weight: normal;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.6);
  pointer-events: none;
  column-count: 2;
  -webkit-column-count: 2; /* Chrome, Safari, Opera */
  -moz-column-count: 2; /* Firefox */
}

div.tooltip span {
  padding: 5px;
}

div.tooltip hr {
  margin: 2px 0 2px 0;
  border-bottom: 0px;
  border-top: 1px dotted #fff;
  font-weight: normal;
}

div.tooltip p {
  background-color: white;
  color: #0dc9c9;
  font-weight: bold;
  padding: 5px;
  margin: 0 0 -10px;
}
</style>
