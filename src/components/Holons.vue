<template>
  <svg width="100%" height="100%">
    <defs>
      <filter id="gooey">
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
          result="gooey"
        />
        <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
      </filter>
    </defs>
  </svg>
</template>

<script>
//import {scaleLinear} from "d3-scale";
import * as d3 from "d3"; //all
//REMOVE DEPENDCY LATER  -- import hierachy from "d3-hierarchy";
import db from "../firebase/init";
import { BASEURL, CHATURL } from "../../index.js";

export default {
  name: "Holons",
  color: "",
  components: {},
  data() {
    return {
      service: "Holons",
      channels: [],
      holons: [],
      width: "",
      height: "",
      element: ""
    };
  },
  ///////////////////////////////////////////////////////////////////////////////
  //  CREATED - https://vuejs.org/v2/guide/instance.html
  //  ANIMATIONS - https://www.visualcinnamon.com/2015/05/gooey-effect.html
  ///////////////////////////////////////////////////////////////////////////////
  created: function() {
    let utime = new Date().getTime();
    this.holons.projects = []; // { name:"projects", children :
    this.holons.diglife = [];
    this.holons.operations = [];
    this.holons.friends = [];
    this.holons.topics = [];
    let channelsRef = db.database().ref("portal_channels");
    channelsRef.on("child_added", channel => {
      var data = channel.val();
      this.channels.push(data);
      if (data.team === "projects") {
        this.holons.projects.push({
          id: data.channel_id,
          name: data.display_name,
          image: data.image,
          members: data.members,
          size: data.total_msg_count,
          link: CHATURL + data.team + "/channels/" + data.name,
          opacity: 1 / Math.sqrt((utime - data.last_post_at) / 86400000) // 1/SQR(#days since last post)
        });
      } else if (
        data.team === "diglife" &&
        data.display_name.charAt(0) !== "#"
      ) {
        this.holons.diglife.push({
          id: data.channel_id,
          name: data.display_name,
          image: data.image,
          members: data.members,
          size: data.total_msg_count,
          link: CHATURL + data.team + "/channels/" + data.name,
          opacity: 1 / Math.sqrt((utime - data.last_post_at) / 86400000) // 1/SQR(#days since last post)
        });
      } else if (
        data.team === "diglife" &&
        data.display_name.charAt(0) === "#"
      ) {
        this.holons.topics.push({
          id: data.channel_id,
          name: data.display_name,
          image: data.image,
          members: data.members,
          size: data.total_msg_count,
          link: CHATURL + data.team + "/channels/" + data.name,
          opacity: 1 / Math.sqrt((utime - data.last_post_at) / 86400000) // 1/SQR(#days since last post)
        });
      } else if (data.team === "ops") {
        this.holons.operations.push({
          id: data.channel_id,
          name: data.display_name,
          image: data.image,
          members: data.members,
          size: data.total_msg_count,
          link: CHATURL + data.team + "/channels/" + data.name,
          opacity: 1 / Math.sqrt((utime - data.last_post_at) / 86400000) // 1/SQR(#days since last post)
        });
      } else if (data.team === "friends") {
        this.holons.friends.push({
          id: data.channel_id,
          name: data.display_name,
          image: data.image,
          members: data.members,
          size: data.total_msg_count,
          link: CHATURL + data.team + "/channels/" + data.name,
          opacity: 1 / Math.sqrt((utime - data.last_post_at) / 86400000) // 1/SQR(#days since last post)
        });
      }
    });
  },

  mounted: function() {
    // https://beta.observablehq.com/@mbostock/d3-zoomable-circle-packing
    this.color = d3
      .scaleLinear()
      .domain([0, 5])
      .range(["rgba(0, 176, 160,0.4)", "rgba(0,95,86,1)"])
      //.range(["#00e8d2", "#00554d"])
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
        `-${this.width / 2 + 150} -${this.height / 2} ${this.width + 250} ${this
          .height + 1050}`
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
          : d.data.image
          ? "url(#" + d.data.id + ")"
          : "rgba(255,255,255, " + d.data.opacity + ")"
      )
      .style("opacity", d => (d.data.image ? d.data.opacity : 1))
      .attr("pointer-events", d => (!d.children ? null : null)) // "none" to turn off
      // .on("mouseover", function() {
      //   d3.select(this).attr("stroke", "#fff");
      // })
      // .on("mouseout", function() {
      //   d3.select(this).attr("stroke", null);
      // })
      .on("click", d => focus !== d && (zoom(d), d3.event.stopPropagation()))
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
      .attr("pointer-events", d => (d.children ? "none" : null))
      .attr("cursor", "alias")
      .style("fill-opacity", d => (d.parent === root ? 1 : 0))
      .style("display", d => (d.parent === root ? "inline" : "none"))
      //.style("font", d => 40 - d.depth*5 + "px Roboto")
      .style(
        "font",
        d => (d.depth === 1 ? 40 : d.depth > 1 ? 24 : null) + "px Roboto"
      )
      .text(d => d.data.name)

      // note: you cannot change the bg color in SVG
      .on("click", d =>
        !d.children ? window.open(d.data.link, d.data.name) : null
      );

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
  },
  ///////////////////////////////////////////////////////////////////////////////
  //  COMPUTED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  computed: {
    // this is the data structure that is loaded into the graph
    // in the future, would be good to store the revision history
    // https://bl.ocks.org/feifang/664c0f16adfcb4dea31b923f74e897a0
    flare: function() {
      return {
        name: "Digital Life Collective",
        children: [
          {
            name: "Home",
            children: this.holons.diglife.concat({
              name: "Interest Groups",
              children: this.holons.topics
            })
          },
          { name: "Projects", children: this.holons.projects },
          { name: "Operations", children: this.holons.operations },
          { name: "Friends", children: this.holons.friends }
        ]
      };
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
