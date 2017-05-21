let _ = require('underscore')

let renderer

let nodes = require('./edges')
let layout = require('./layout')

let width = innerWidth, height = innerHeight
let init = (data) => {
  console.log(data)
  renderer = nodes(data, {
    width: width,
    height: height,
    root: document.querySelector('body')
  })
}

//layout.orthogonal(init, (parsed) => { renderer.update(parsed) })
layout.force(init, (parsed) => { renderer.update(parsed) })
