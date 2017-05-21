let _ = require('underscore')

let renderer

let nodes = require('./edges')
let layout = require('./layout')


let init = (data) => {
  let width = innerWidth, height = innerHeight
  renderer = nodes(data, {
    width: width,
    height: height,
    root: document.querySelector('body')
  })
}

//layout.orthogonal(init, (parsed) => { renderer.update(parsed) })
layout.force(init, (parsed) => { renderer.update(parsed) })
