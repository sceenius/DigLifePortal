<template>
  <div>
    <!--
      ----------------------------------------------------------------------
        SNACKBARS  - https://vuematerial.io/components/snackbar
      ----------------------------------------------------------------------
    -->
    <md-snackbar
      :md-duration="4000"
      :md-active.sync="showSnackBar"
      md-persistent
    >
      <span>{{ snack }}</span>
      <md-button class="md-primary" @click="showSnackBar = false;"
        >Dismiss</md-button
      >
    </md-snackbar>
    <!--
      ----------------------------------------------------------------------
        DIALOG BOXES - SETTINGS DIALOG
      ----------------------------------------------------------------------
    -->
    <md-dialog :md-active.sync="activeSettings" style="width:650px;">
      <md-dialog-title>Profile Tags</md-dialog-title>
      <Tags style="padding: 20px;" />
    </md-dialog>

    <svg width="100%" height="100%"></svg>
  </div>
</template>

<script>
//import {scaleLinear} from "d3-scale";
import * as d3 from "d3"; //all
import db from "../firebase/init";
import Tags from "./Tags";
import Moment from "moment";
import { BASEURL, CHATURL } from "../constants.js";
import _ from "lodash/fp/array"; //lodash/fp/object for objects only

export default {
  name: "Skills",
  components: { Tags },
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

    usersRef
      .once("value", users => {
        users.forEach(user => {
          let data = user.val();
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
                //console.log(snapshot)
                if (snapshot.tags) {
                  data.moretags = snapshot.tags.reduce(
                    (accumulator, currentValue) => {
                      // possible insert to only show tags in range
                      // if (currentValue.frequency > 0.3 && currentValue.frequency < 10)
                      return [...accumulator, currentValue.text];
                    }
                  );
                }

                // lodash merge crashes, so use https://github.com/tc39/proposal-object-rest-spread
                data = { ...data, ...snapshot }; //_.merge(data, snapshot);
              }
            })
            .then(profile => {
              //console.log(data.moretags);
              this.users.push(data);
              this.nodes.push({
                id: data.username,
                group: 1,
                tags: data.moretags,
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
            });
        });
      })
      // we need to wait for the data to become available
      // since SVG only draws the visual once
      .then(() => new Promise(resolve => setTimeout(resolve, 500)))
      //.then(users => console.log(this.users))
      .then(() => {
        this.$nextTick(() => {
          this.draw();
        });
      });
  },

  ///////////////////////////////////////////////////////////////////////////////
  //  MOUNTED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  //methods: {}
  mounted: function() {},

  ///////////////////////////////////////////////////////////////////////////////
  //  METHODS - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  methods: {
    draw: function() {
      // https://beta.observablehq.com/@mbostock/d3-force-directed-graph
      // possible refinement of skills is a radar map with n corners (each corner is a skill)
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
                        return el + "<br>";
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
              "<p>" +
                (d.fullname !== " " ? d.fullname : d.id) +
                "<br><i style='font-size: 0.8em;'>Joined " +
                d.fromTime +
                "</i></p><br>" +
                (d.tags.length > 0
                  ? d.tags
                      .map(el => {
                        return el + "<br>";
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
      // }, 500);
    }
  },

  ///////////////////////////////////////////////////////////////////////////////
  //  COMPUTED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  computed: {
    graph: function() {
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
  position: absolute;
  background-color: #00b0a0;
  color: white;
  max-width: 200px;
  height: auto;
  padding: 10px;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.6);
  pointer-events: none;
}
div.tooltip p {
  background-color: white;
  color: #00b0a0;
  font-weight: bold;
  padding: 5px;
  margin: 0 0 -10px;
}
</style>
