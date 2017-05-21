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

layout.orthogonal(init, (d, c) => { renderer.update(d, c) })
//layout.force(init, (parsed) => { renderer.update(parsed) })
