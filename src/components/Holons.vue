<template>
  <svg width="100%" height="100%"></svg>
</template>

<script>
//import {scaleLinear} from "d3-scale";
import * as d3 from "d3"; //all
import hierachy from "d3-hierarchy";
import db from "../firebase/init";

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
      height: ""
    };
  },
  ///////////////////////////////////////////////////////////////////////////////
  //  CREATED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  created: function() {
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
          name: data.display_name,
          size: data.total_msg_count
        });
      } else if (
        data.team === "diglife" &&
        data.display_name.charAt(0) !== "#"
      ) {
        this.holons.diglife.push({
          name: data.display_name,
          size: data.total_msg_count
        });
      } else if (
        data.team === "diglife" &&
        data.display_name.charAt(0) === "#"
      ) {
        this.holons.topics.push({
          name: data.display_name,
          size: data.total_msg_count
        });
      } else if (data.team === "ops") {
        this.holons.operations.push({
          name: data.display_name,
          size: data.total_msg_count
        });
      } else if (data.team === "friends") {
        this.holons.friends.push({
          name: data.display_name,
          size: data.total_msg_count
        });
      }
    });
  },

  mounted: function() {
    this.color = d3
      .scaleLinear()
      .domain([0, 5])
      .range(["#00e8d2", "#00554d"])
      // .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
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

    const svg = d3
      .select("svg") //this.$el
      // .attr("width", this.width)
      // .attr("height", this.height)
      //     .attr("width", '100%')
      // .attr("height", '100%')
      // .attr('viewBox','0 0 '+Math.min(this.width,this.height)+' '+Math.min(this.width,this.height))
      .attr("preserveAspectRatio", "xMinYMin")
      .attr(
        "viewBox",
        `-${this.width / 2} -${this.height / 2} ${this.width} ${this.height}`
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
      .selectAll("circle")
      .data(root.descendants().slice(1))
      .enter()
      .append("circle")
      .attr("fill", d => (d.children ? this.color(d.depth) : "white"))
      .attr("pointer-events", d => (!d.children ? "none" : null))
      .on("mouseover", function() {
        d3.select(this).attr("stroke", "#fff");
      })
      .on("mouseout", function() {
        d3.select(this).attr("stroke", null);
      })
      .on("click", d => focus !== d && (zoom(d), d3.event.stopPropagation()));

    const label = svg
      .append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(root.descendants())
      .enter()
      .append("text")
      .style("fill-opacity", d => (d.parent === root ? 1 : 0))
      .style("display", d => (d.parent === root ? "inline" : "none"))
      .text(d => d.data.name)
      .style("font", d => 10 - d.depth + 10 + "px sans-serif");
    // .style("font-weight", "bold")

    zoomTo([root.x, root.y, root.r * 2]);

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
          if (d.parent !== focus) this.style.display = "none";
        });
    }
    console.log(svg.node());
    return svg.node();
  },
  ///////////////////////////////////////////////////////////////////////////////
  //  COMPUTED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  computed: {
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
