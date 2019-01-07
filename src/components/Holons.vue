<template>
  <svg width="100%" height="100%"></svg>
</template>

<script>
//import {scaleLinear} from "d3-scale";
import * as d3 from "d3"; //all
import hierachy from "d3-hierarchy";
import db from "../firebase/init";
import { BASEURL, CHATURL } from "../constants.js";

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
          size: data.total_msg_count,
          link: CHATURL + data.team + "/channels/" + data.name
        });
      } else if (
        data.team === "diglife" &&
        data.display_name.charAt(0) !== "#"
      ) {
        this.holons.diglife.push({
          name: data.display_name,
          size: data.total_msg_count,
          link: CHATURL + data.team + "/channels/" + data.name
        });
      } else if (
        data.team === "diglife" &&
        data.display_name.charAt(0) === "#"
      ) {
        this.holons.topics.push({
          name: data.display_name,
          size: data.total_msg_count,
          link: CHATURL + data.team + "/channels/" + data.name
        });
      } else if (data.team === "ops") {
        this.holons.operations.push({
          name: data.display_name,
          size: data.total_msg_count,
          link: CHATURL + data.team + "/channels/" + data.name
        });
      } else if (data.team === "friends") {
        this.holons.friends.push({
          name: data.display_name,
          size: data.total_msg_count,
          link: CHATURL + data.team + "/channels/" + data.name
        });
      }
    });
  },

  mounted: function() {
    this.color = d3
      .scaleLinear()
      .domain([0, 5])
      .range(["rgba(0, 176, 160,0.4)", "rgba(0, 176, 160,1)"])
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
      //.attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(root.descendants())
      .enter()
      .append("text")
      .attr("class", "label")
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
    //      .on("click", d => window.open(d.link, "_blank"))

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

    //Adjusted from: http://blog.graphicsgen.com/2015/03/html5-canvas-rounded-text.html
    function drawCircularText(
      ctx,
      text,
      fontSize,
      titleFont,
      centerX,
      centerY,
      radius,
      startAngle,
      kerning
    ) {
      // startAngle:   In degrees, Where the text will be shown. 0 degrees if the top of the circle
      // kearning:     0 for normal gap between letters. Positive or negative number to expand/compact gap in pixels

      //Setup letters and positioning
      ctx.textBaseline = "alphabetic";
      ctx.textAlign = "center"; // Ensure we draw in exact center
      ctx.font = fontSize + "px " + titleFont;

      startAngle = startAngle * (Math.PI / 180); // convert to radians
      text = text
        .split("")
        .reverse()
        .join(""); // Reverse letters
      text = text.replace("-", " ").toUpperCase(); // MOD JS

      //Rotate 50% of total angle for center alignment
      for (var j = 0; j < text.length; j++) {
        var charWid = ctx.measureText(text[j]).width;
        startAngle +=
          (charWid + (j == text.length - 1 ? 0 : kerning)) / radius / 2;
      } //for j

      ctx.save(); //Save the default state before doing any transformations
      ctx.translate(centerX, centerY); // Move to center
      ctx.rotate(startAngle); //Rotate into final start position

      //Now for the fun bit: draw, rotate, and repeat
      for (var j = 0; j < text.length; j++) {
        var charWid = ctx.measureText(text[j]).width / 2; // half letter
        //Rotate half letter
        ctx.rotate(-charWid / radius);
        //Draw the character at "top" or "bottom" depending on inward or outward facing
        ctx.fillText(text[j], 0, -radius);
        //Rotate half letter
        ctx.rotate(-(charWid + kerning) / radius);
      } //for j

      ctx.restore(); //Restore to state as it was before transformations
    } //function drawCircularText

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

<style>
.label {
  font: 16px "Roboto", Helvetica, Arial, sans-serif;
  font-weight: 700;
  text-anchor: middle;
  text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff, 0 -1px 0 #fff;
}
</style>
