// let edges = require('./edges')

let nodes = require('./nodes')

let init = (data) => {
  let g = nodes(data, {
    width: 960,
    height: 500,
    root: document.querySelector('body')
  })
}

fetch('graph.json')
  .then((res) => { return res.json((body) => {}) })
  .then((res) => {init(res.nodes)})


document.body.addEventListener('click',
                               () => {
                                 console.log(123)
                               }
                              )

// //fetch('/data/higgs-discovery/higgs-activity_time.txt')
