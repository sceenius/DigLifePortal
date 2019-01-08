<template>
  <svg width="100%" height="100%"></svg>
</template>

<script>
//import {scaleLinear} from "d3-scale";
import * as d3 from "d3"; //all
import db from "../firebase/init";
import { BASEURL, CHATURL } from "../constants.js";

export default {
  name: "Skills",
  components: {},
  data() {
    return {
      service: "Skills",
      channels: [],
      holons: [],
      width: "",
      height: "",
      color: "",
      drag: ""
    };
  },
  ///////////////////////////////////////////////////////////////////////////////
  //  CREATED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  created: function() {
    let usersRef = db.database().ref("portal_users");
    usersRef.on("child_added", user => {
      var data = user.val();
      this.users.push(data);
      this.nodes.push({ id: data.username, group: 1 });
    });
  },

  mounted: function() {
    //https://beta.observablehq.com/@mbostock/d3-force-directed-graph
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

    const links = this.graph.links.map(d => Object.create(d));
    const nodes = this.graph.nodes.map(d => Object.create(d));

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(this.width / 2, this.height / 2));

    const svg = d3
      .select("svg")
      .attr("preserveAspectRatio", "xMinYMin")
      .attr("viewBox", `${0} ${0} ${this.width} ${this.height}`)
      .style("display", "block");

    const link = svg
      .append("g")
      .attr("stroke", "#404040")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("fill", d => this.color(d.group))
      .call(drag(simulation));
    node.append("title").text(d => d.id);

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node.attr("cx", d => d.x).attr("cy", d => d.y);
    });

    //invalidation.then(() => simulation.stop());
    console.log(this.graph);
    return svg.node();
  },

  ///////////////////////////////////////////////////////////////////////////////
  //  COMPUTED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  computed: {
    graph: function() {
      return {
        nodes: [{ id: "Myriel", group: 4 }, { id: "Napoleon", group: 4 }],
        links: [{ source: "Napoleon", target: "Myriel", value: 1 }]
        // nodes: this.nodes,
        // links: this.links
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
