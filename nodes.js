var isnumber = require('isnumber')

var Regl = require('regl')

let stub = () => {
  return [
    Math.random() * 2 - 1., Math.random() * 2 -1
  ]
}
var layout = function layout(data) {
  return data.map((item)=> {
    return item.pos || stub()
  })
}

function randomColor () {
  return [ .7, .2, .9 ]
}

function convertToRGB(data) {
  return data.map(randomColor)
}

function Graph(data, opts) {
  if (!(this instanceof Graph)) return new Graph(data, opts)

  var self = this

  opts = opts || {}

  window.d = data
  
  opts.background = opts.background || [0.9, 0.9, 0.9]
  opts.size = isnumber(opts.size) ? opts.size : 10

  var canvas = document.createElement('canvas')
  canvas.width = opts.width || 960
  canvas.height = opts.height || 500

  if (opts.root) opts.root.appendChild(canvas)
  var regl = Regl(canvas);

  var colors = convertToRGB(data);
  var positions = layout(data)

  var squares = regl({
    vert: `
    precision mediump float;
    attribute vec2 position;
    attribute vec3 color;
    varying vec3 vcolor;
    void main() {
      gl_PointSize = float(${opts.size});
      gl_Position = vec4(position.x, position.y, 0.0, 1.0);
      vcolor = color;
    }
    `,

    frag: `
    precision mediump float;
    varying vec3 vcolor;
    void main() {
      gl_FragColor = vec4(vcolor, 1.0);
    }
    `,

    attributes: {
      position: regl.prop('position'),
      color: regl.prop('color')
    },

    primitive: 'points',

    count: colors.length
  })
  var lines = regl({
    vert: `
    precision mediump float;
    attribute vec2 position;
    attribute vec3 color;
    varying vec3 vcolor;
    void main() {
      gl_PointSize = float(${opts.size});
      gl_Position = vec4(position.x, position.y, 0.0, 1.0);
      vcolor = color;
      //if (distance(gl_PointCoord, gl_Position) > .1) discard;
    }
    `,

    frag: `
    precision mediump float;
    varying vec3 vcolor;
    void main() {
      gl_FragColor = vec4(vcolor, 1.0);
    }
    `,

    attributes: {
      position: regl.prop('position'),
      color: regl.prop('color')
    },

    primitive: 'lines',

    count: colors.length
  })


  var buffer = {
    position: regl.buffer(positions),
    color: regl.buffer(colors)
  }

  var draw = function (positions, colors) {
    regl.clear({
      color: opts.background.concat([1])
    })
    squares({
      position: positions,
      color: colors
    })

    lines({
      position: positions,
      color: colors
    })

  }

  draw(buffer.position, buffer.color)

  self._buffer = buffer
  self._draw = draw
  self._formatted = opts.formatted
  self.canvas = canvas
  self.frame = regl.frame
}

Graph.prototype.update = function (data) {
  let self = this;
  console.log(50)
  let color = convertToRGB(data)
  self._draw(self._buffer.position, self._buffer.color(color))
}

module.exports = Graph
