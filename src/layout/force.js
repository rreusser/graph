let d3 = require('d3')

let clipspace = (d) => {
  return [
    (d[0] / innerWidth) * 2 -1 ,
    1. - (d[1] / innerHeight) * 2.
  ]
}

let width = 960, height = 500

let layout = {
  threeDee: threeDee,
  force
}


function threeDee () {

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

    graph.nodes = node_set.values().map(function(d) {
      return {
        id: d
      };
    });

    graph.links = pairs.map(function(d) {
      return {
        source: d[0],
        target: d[1]
      }
    })
      .filter(function(d) {
        return d.source !== d.target;
      });

    simulation.nodes(graph.nodes)

    simulation.force("link").links(graph.links);

    d3.range(10).forEach(simulation.tick);

    simulation
      .on("tick", ticked);

    let data = window.g = graph.links
    let parsed = data.map((link) => {
      return [
        clipspace([link.source.x, link.source.y]),
        clipspace([link.target.x, link.target.y])
      ]
    })

    window.p = parsed

    init(parsed)

    function ticked() {
      data.forEach((link, i) => {
        let d = parsed[i]

        d[0][0] = 2. * (link.source.x / innerWidth) - 1.;
        d[0][1] = 1. - (link.source.y / innerHeight * 2.)

        d[1][0] = (link.target.x / innerWidth) * 2 - 1.;
        d[1][1] = 1. - (link.target.y / innerHeight * 2.)

        window.g = d
        //clipspace([link.source.x, link.source.y])
        //parsed[i] = clipspace([link.target.x, link.target.y])
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
