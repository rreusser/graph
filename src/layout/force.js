let d3 = require('d3')
let _ = require('underscore')

let clipX = (d) =>  (d / innerWidth) * 2 -1
let clipY = (d) => 1. - (d / innerHeight) * 2

let width = 960, height = 500

let layout = {
  force
}

function force (init, update) {

  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(0.3).strength(1.6))
      .force("charge", d3.forceManyBody().strength(-0.35).distanceMax(220))
      .force("center", d3.forceCenter(width / 2, height / 2))
  //    .force("vertical", d3.forceY().strength(0.0001))
  //    .force("horizontal", d3.forceX().strength(0.0001))
      .alphaDecay(0.002);

  let graph = {}
  d3.text("./data/commanche_dual.mtx", function(error, raw) {
    if (error) throw error;

    var node_set = d3.set();

    var lines = raw.split("\n")
        .slice(15);

    var pairs = lines.map(function(d) { return d.split(" "); });

    pairs.forEach(function(d) {
      node_set.add(d[0]);
      node_set.add(d[1]);
    });

    graph.nodes = node_set.values().map((d) => {return {id: d } });

    graph.links = pairs.map((d) => { return { source: d[0], target: d[1] } })
      .filter((d) => { return d.source !== d.target; });

    simulation.on("tick", ticked)
      .nodes(graph.nodes)
    simulation.force("link").links(graph.links)
    d3.range(10).forEach(simulation.tick);


    let data = graph.links
    let parsed = data.map((link) => {
      return [clipX(link.source.x), clipY(link.source.y) ]
    })
    parsed = _.flatten(parsed)

    init(parsed)

    function ticked() {
      data.forEach((link, i) => {
        let d = graph.links[i]
        i *= 2
        parsed[i+0] = clipX(d.source.x)
        parsed[i+1] = clipY(d.source.y)
      })

      update(parsed)
    }

    function dragsubject() {
      return simulation.find(d3.event.x, d3.event.y);
    }
  });

  function dragstarted() {
    if (!d3.event.active) simulation.alphaTarget(0.8).restart();
    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;
  }

  function dragged() {
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
  }

  function dragended() {
    if (!d3.event.active) simulation.alphaTarget(0);
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
  }



}

module.exports = force
