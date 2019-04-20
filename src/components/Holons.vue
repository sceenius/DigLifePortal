<template>
  <svg width="100%" height="100%">
    <defs></defs>
  </svg>
</template>

<script>
//import {scaleLinear} from "d3-scale";
//import hierachy from "d3-hierarchy";
//import d3 from '../assets/d3';
import * as d3 from "d3"; //all
import db from "../firebase/init.js";
import { BASEURL, CHATURL } from "../main.js";

export default {
  name: "Holons",
  color: "",
  components: {},
  props: ["domain"],
  data() {
    return {
      username: "",
      service: "Holons",
      channels: [],
      domains: [],
      flares2: [],
      //domains: [],
      holons: [],
      width: "",
      height: "",
      element: ""
      //domain: this.domain
    };
  },
  ///////////////////////////////////////////////////////////////////////////////
  //  CREATED - https://vuejs.org/v2/guide/instance.html
  //  ANIMATIONS - https://www.visualcinnamon.com/2015/05/gooey-effect.html
  ///////////////////////////////////////////////////////////////////////////////
  created: function() {
    //let domain = this.domain === "Home" ? "diglife" : this.domain.toLowerCase();
    let utime = new Date().getTime();
    this.username = this.$cookies.get("username");

    //let domainsRef = db.database().ref("portal_profiles/daviding/domains");
    let channelsRef = db.database().ref("portal_channels");
    let profilesRef = db.database().ref("portal_profiles");

    profilesRef
      .child(this.username.replace(".", "%2E") + "/domains")
      .once("value")
      .then(doms => {
        this.domains = doms.val();

        for (var dom in this.domains) {
          // IN vs OF UNCLEAR
          this.holons[this.domains[dom]] = [];
          this.holons[this.domains[dom]].topics = [];
          this.holons[this.domains[dom]].important = [];
        }

        channelsRef.on("child_added", channel => {
          var data = channel.val();

          //console.log(this.domains);
          if (this.domains.includes(data.team)) {
            this.channels.push(data);
            //console.log(data.team, this.holons[data.team]);
            if (data.display_name.charAt(0) === "!") {
              //console.log("--------", data);
              this.holons[data.team].important.push({
                id: data.channel_id,
                name: data.display_name,
                image: data.image,
                members: data.members,
                is_member: data.members.includes(this.username),
                size: data.total_msg_count,
                link: CHATURL + data.team + "/channels/" + data.name,
                opacity: 1 / Math.sqrt((utime - data.last_post_at) / 86400000) // 1/SQR(#days since last post)
              });
            } else if (data.display_name.charAt(0) === "#") {
              this.holons[data.team].topics.push({
                id: data.channel_id,
                name: data.display_name,
                image: data.image,
                members: data.members,
                is_member: data.members.includes(this.username),
                size: data.total_msg_count,
                link: CHATURL + data.team + "/channels/" + data.name,
                opacity: 1 / Math.sqrt((utime - data.last_post_at) / 86400000) // 1/SQR(#days since last post)
              });
            } else if (data.display_name.charAt(0) !== "#") {
              this.holons[data.team].push({
                id: data.channel_id,
                name: data.display_name,
                image: data.image,
                members: data.members,
                is_member: data.members.includes(this.username),
                size: data.total_msg_count,
                link: CHATURL + data.team + "/channels/" + data.name,
                opacity: 1 / Math.sqrt((utime - data.last_post_at) / 86400000) // 1/SQR(#days since last post)
              });
            }
          } // IF INCLUDES
        });
      });
  },

  mounted: function() {
    // https://beta.observablehq.com/@mbostock/d3-zoomable-circle-packing

    //    this.$nextTick(function() {

    new Promise(resolve => setTimeout(resolve, 500)).then(resolve => {
      //console.log(this.flare);
      this.color = d3
        .scaleLinear()
        .domain([0, 5])
        //.range(["rgba(0, 176, 160,0.4)", "rgba(0,95,86,1)"])
        //.range(["rgba(219,93,124,0.4)", "rgba(219,93,124,1)"])
        //.range(["#00e8d2", "#00554d"])
        .range(["rgba(253,177,126,0.2)", "rgba(253,177,126,1)"])
        .interpolate(d3.interpolateHcl);

      this.format = d3.format(",d");
      this.width = 932;
      this.height = this.width;

      this.pack = data =>
        d3
          .pack()
          .size([this.width, this.height])
          .padding(3)(
          d3
            .hierarchy(data)
            .sum(d => d.size)
            .sort((a, b) => b.value - a.value)
        );

      const root = this.pack(this.flare);
      let focus = root;
      let view;

      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      const svg = d3
        .select("svg") //this.$el
        .attr("preserveAspectRatio", "xMinYMin")
        .attr(
          "viewBox",
          `-${this.width / 2 + 150} -${this.height / 2} ${this.width +
            250} ${this.height + 1050}`
        )
        .style("display", "block")
        .style("margin", "0 -14px")
        .style("width", "calc(100% + 14px)")
        .style("height", "auto")
        .style("background", this.color(0))
        .style("cursor", "pointer")
        .on("click", () => zoom(root));

      const node = svg
        .append("g")
        //.style("filter", "url(#gooey)")
        .selectAll("circle")
        .data(root.descendants().slice(1))
        .enter()
        .append("circle")
        .attr("class", "node")
        // adjust opacity levels based on time-to-last-update
        // would be nice to auto-archive after XX months
        .attr("fill", d =>
          d.children
            ? this.color(d.depth)
            // : d.data.image
            // ? "url(#" + d.data.id + ")"
            : d.data.is_member
            ? "rgba(15,186,185, " + d.data.opacity + ")"
            : "rgba(255,255,255, " + d.data.opacity + ")"
        )
        .style("opacity", d => (d.data.image ? d.data.opacity : 1))
        .attr("pointer-events", d => (!d.children ? null : null)) // "none" to turn off

        // Can only click on holons that have children
        .on(
          "click",
          d =>
            (d.children &&
              focus !== d &&
              (zoom(d), d3.event.stopPropagation())) ||
            (!d.children && window.open(d.data.link, d.data.name))
        )
        // .on("click", d => !d.children && window.open(d.data.link, d.data.name))
        .on("mouseover.tooltip", d => {
          if (!d.children) {
            tooltip
              .transition()
              .duration(300)
              .style("opacity", 0.8);
            tooltip
              .html(
                "<p>" +
                  d.data.name +
                  "</p><br>" +
                  (d.data.members
                    ? d.data.members
                        .map(el => {
                          return el + "<br>";
                        })
                        .toString()
                        .replace(/,/g, "")
                    : "No members defined")
              )
              .style("left", d3.event.pageX + "px")
              .style("top", d3.event.pageY + 10 + "px");
          }
        })
        .on("mouseout.tooltip", d => {
          tooltip
            .transition()
            .duration(100)
            .style("opacity", 0);
          //}
        });

      const label = svg
        .append("g")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .selectAll("text")
        .call(wrap, 20)
        .data(root.descendants())
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("pointer-events", d => (d.children ? null : null))
        // Click event on labels is the same as on nodes
        .on(
          "click",
          d =>
            (d.children &&
              focus !== d &&
              (zoom(d), d3.event.stopPropagation())) ||
            (!d.children && window.open(d.data.link, d.data.name))
        )

        // .attr("cursor", "alias")
        .style("fill-opacity", d => (d.parent === root ? 1 : 0))
        .style("display", d => (d.parent === root ? "inline" : "none"))
        //.style("font", d => 40 - d.depth*5 + "px Roboto")
        .style(
          "font",
          d => (d.depth === 1 ? 40 : d.depth > 1 ? 24 : null) + "px Roboto"
        )
        .text(d => d.data.name);

      // note: you cannot change the bg color in SVG
      // .on("click", d =>
      //   !d.children ? window.open(d.data.link, d.data.name) : null
      // );

      // animation when loading map
      d3.selectAll("text")
        .style("stroke-width", 0)
        .style("stroke", "transparent")
        .style("fill", "transparent")
        .transition()
        .duration(6000)
        .style("stroke", "white")
        .style("fill", "black");

      d3.selectAll("circle")
        .transition()
        .duration(0)
        .attr("r", 0)
        .transition()
        .duration(5000)
        .attr("r", d => d.r * 1);

      zoomTo([root.x, root.y, root.r * 2.15]); /////////////

      function wrap(text, width) {
        text.each(function() {
          var text = d3.select(this),
            words = text
              .text()
              .split(/\s+/)
              .reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text
              .text(null)
              .append("tspan")
              .attr("x", 0)
              .attr("y", y)
              .attr("dy", dy + "em");
          while ((word = words.pop())) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text
                .append("tspan")
                .attr("x", 0)
                .attr("y", y)
                .attr("dy", ++lineNumber * lineHeight + dy + "em")
                .text(word);
            }
          }
        });
      }

      function zoomTo(v) {
        const k = 982 / v[2];

        view = v;

        label.attr(
          "transform",
          d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
        );
        node.attr(
          "transform",
          d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
        );
        node.attr("r", d => d.r * k);
      }

      function zoom(d) {
        const focus0 = focus;

        focus = d;

        const transition = svg
          .transition()
          .duration(d3.event.altKey ? 7500 : 750)
          .tween("zoom", d => {
            const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
            return t => zoomTo(i(t));
          });

        label
          .filter(function(d) {
            return d.parent === focus || this.style.display === "inline";
          })
          .transition(transition)
          .style("fill-opacity", d => (d.parent === focus ? 1 : 0))
          .on("start", function(d) {
            if (d.parent === focus) this.style.display = "inline";
          })
          .on("end", function(d) {
            if (d.parent !== focus) this.style.display = "none"; //none
          });
      }

      const defs = svg.append("svg:defs");
      //https://bl.ocks.org/mph006/7e7d7f629de75ada9af5
      // goal:
      // .style("fill", d => {
      //   return "url(#avatar_" + d.id + ")";
      // })

      var queue = [];
      var animX = 0;
      queue.push(this.flare);
      while (queue.length !== 0) {
        let el = queue.shift();
        if (el.id && el.image) {
          defs
            .append("svg:pattern")
            // data MUST have an array to work
            .data([el])
            .attr("id", d => {
              //console.log(d.id);
              return d.id;
            })
            .attr("width", "1")
            .attr("height", "1")
            .append("svg:image")
            .attr("xlink:href", d => {
              return (
                "https://ledger.diglife.coop/images/holons/" + el.id + ".jpg"
              );
            });
        }

        animX = animX + 1;
        if (el.children !== undefined) {
          for (var i = 0; i < el.children.length; i++) {
            queue.push(el.children[i]);
          }
        }
      }

      return svg.node();
    }); // pROMISE
  },
  ///////////////////////////////////////////////////////////////////////////////
  //  COMPUTED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  computed: {
    // this is the data structure that is loaded into the graph
    // in the future, would be good to store the revision history
    // https://bl.ocks.org/feifang/664c0f16adfcb4dea31b923f74e897a0

    flare: function() {
      let domain =
        !this.domain || this.domain === "Home"
          ? "diglife"
          : this.domain.toLowerCase();

      var flares = [];
      for (var dom of this.domains) {
        // skip leftover domains
        if (this.holons[dom].length) {
          flares.push({
            name: dom.replace("friends", "partners").toUpperCase(),
            children: this.holons[dom].concat(
              {
                name: "Interest Groups",
                children: this.holons[dom].topics
              },
              {
                name: "Important Channels",
                children: this.holons[dom].important
              }
            )
          });
        }
      }

      if (domain === "diglife") {
        return {
          name: "Digital Life Collective",
          children: flares
        };
      } else {
        return {
          name: "Digital Life Collective",
          children: [
            {
              name: this.domain,
              children: this.holons[domain].concat(
                {
                  name: "Interest Groups",
                  children: this.holons[domain].topics
                },
                {
                  name: "Important Channels",
                  children: this.holons[domain].important
                }
              )
            }
          ]
        };
      }
    }
  },

  ///////////////////////////////////////////////////////////////////////////////
  //  METHODS - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  methods: {}
};
</script>

<style>
.label {
  font: 16px "Roboto", Helvetica, Arial, sans-serif;
  font-weight: 700;
  text-anchor: middle;
  text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff, 0 -1px 0 #fff;
}

div.tooltip {
  position: absolute;
  background-color: #F47E7E;
  color: white;
  max-width: 200px;
  height: auto;
  padding: 10px;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.6);
  pointer-events: none;
}
div.tooltip p {
  background-color: white;
  color: #F47E7E;
  font-weight: bold;
  padding: 5px;
  margin: 0 0 -10px;
}
</style>
