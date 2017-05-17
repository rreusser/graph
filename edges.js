var isnumber = require('isnumber')

var Regl = require('regl')

function randomColor () {
  return [ .3,.3, 1]
}

function convertToRGB(data) {
  return data.map(randomColor)
}

function Graph(positions, opts) {
  if (!(this instanceof Graph)) return new Graph(positions, opts)

  var self = this

  opts = opts || {}
  console.log(positions[0])
  opts.background = opts.background || [0,0,0,1]
  opts.size = isnumber(opts.size) ? opts.size : 10

  var canvas = document.createElement('canvas')
  canvas.width = opts.width || 960
  canvas.height = opts.height || 500

  if (opts.root) opts.root.appendChild(canvas)
  var regl = Regl(canvas);

  this.camera = require('./camera')(regl, {
    center: [0, 2.5, 0]
  })

  var mp = require('mouse-position')(canvas)
  var mb = require('mouse-pressed')(canvas)

  var colors = convertToRGB(positions);

  var lines = regl({
    vert: `
    precision mediump float;
    attribute vec3 position;
    uniform mat4 projection, view;
    attribute vec3 color;
    varying vec3 vcolor;
    void main() {
      gl_Position = vec4(position.x, position.y , position.z, 1.);
      vcolor = color;
    }
    `,

    frag: `
    precision mediump float;
    varying vec3 vcolor;
    void main() {
      gl_FragColor = vec4(vcolor, .5);
    }
    `,

    attributes: {
      position: regl.prop('position'),
      color: regl.prop('color')
    },

    primitive: 'lines',

    count: colors.length
  })

//   var squares = regl({
//     vert: `
//     precision mediump float;
//     attribute vec2 position;
//     attribute vec3 color;
//     varying vec3 vcolor;
//     void main() {
//       gl_PointSize = float(${opts.size});
//       gl_Position = vec4(position.x, position.y, 0.0, 1.0);
//       vcolor = color;
// //if (distance(gl_PointCoord, gl_Position) > .1) discard;
//     }
//     `,

//     frag: `
//     precision mediump float;
//     varying vec3 vcolor;
//     void main() {
//       gl_FragColor = vec4(vcolor, 1.0);
//     }
//     `,

//     attributes: {
//       position: regl.prop('position'),
//       color: regl.prop('color')
//     },

//     primitive: 'points',

//     count: colors.length
//   })

  regl({

    blend: {
      enable: true,
      func: {
        srcRGB: 'src alpha',
        srcAlpha: 1,
        dstRGB: 'one minus src alpha',
        dstAlpha: 1
      },
      equation: {
        rgb: 'add',
        alpha: 'add'
      },
      color: [0, 0, 0, 0]
    },

  })

  var buffer = {
    position: regl.buffer(positions),
    color: regl.buffer(colors)
  }

  var draw = function (positions, colors) {
    regl.clear({
      color: opts.background.concat([1])
    })

    lines({
      position: positions,
      color: colors
    })

    // squares({
    //   position: positions,
    //   color: colors
    // })

  }

  this.camera(() => {
    draw(buffer.position, buffer.color)
  })

  self._buffer = buffer
  self._draw = draw
  self._formatted = opts.formatted
  self.canvas = canvas
  self.frame = regl.frame
}

Graph.prototype.update = function (positions) {
  let self = this;
  //let color = convertToRGB(positions)

  
  this.camera(() => {
    self._draw(self._buffer.position(positions), self._buffer.color)
  })
}

module.exports = Graph
