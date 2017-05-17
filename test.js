let _ = require('underscore')

let renderer

let nodes = require('./edges')
let layout = require('./layout')

let width = 960, height = 500
let init = (data) => {
  //console.log(data)
  renderer = nodes(data, {
    width: width,
    height: height,
    root: document.querySelector('body')
  })
}

layout.orthogonal(init, (parsed) => { renderer.update(parsed) })
