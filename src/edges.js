var isnumber = require('isnumber')

var Regl = require('regl')

const mat4 = require('gl-mat4')

let bunny = require('bunny')

function convertToRGB(data) { return data.map(Math.random) }

function Graph(positions, opts) {
  if (!(this instanceof Graph)) return new Graph(positions, opts)

  var self = this

  opts = opts || {}

  opts.background = opts.background || [0,0,0,1]
  opts.size = isnumber(opts.size) ? opts.size : 10

  var canvas = document.createElement('canvas')
  canvas.width = opts.width || 960
  canvas.height = opts.height || 500

  if (opts.root) opts.root.appendChild(canvas)
  console.log(opts.root, canvas)
  var regl = Regl(canvas);

  // this.camera = require('./camera')(regl, {
  //   center: [0, 2.5, 0]
  // })
  var mp = require('mouse-position')(canvas)
  var mb = require('mouse-pressed')(canvas)

  var colors = convertToRGB(positions);
  window.col = colors
  window.pos = positions

  var buffer = {
    position: regl.buffer(positions.length),
    color: regl.buffer(colors.length)
  }

  var lines = regl({
    vert: `
    precision mediump float;
    attribute vec3 position;
    uniform mat4 projection, view;
    attribute vec3 color;
    varying vec3 vcolor;
    void main() {
      //projection * view *  vec4(position.x, position.y , position.z, 1.);
        gl_Position  = vec4(position.x, position.y , position.z, 1.);
      vcolor = color;
    }
    `,

    frag: `
    precision mediump float;
    varying vec3 vcolor;
    void main() {
      gl_FragColor = vec4(vcolor, .01);
    }
    `,

    attributes: {
      position: regl.prop('position'),
      color: regl.prop('color')
    },

    primitive: 'lines',

    count: 1e4,

    uniforms: {
      projection: ({viewportWidth, viewportHeight}) => mat4.perspective([],
                                                                        Math.PI / 4,
                                                                        viewportWidth / viewportHeight,
                                                                        0.01,
                                                                        1000),
      view: ({tick}) => {
        let t = tick * .01;
        return mat4.lookAt([],
                           [20 * Math.cos(t), 10, 20 * Math.sin(t)],
                           [0, 2.5, 0],
                           [0, 1, 0])
      }
    }
  })


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


  var draw = function (positions, colors) {
    regl.clear({
      color: opts.background.concat([1])
    })

    lines({
      position: positions,
      color: colors
    })
  }

  //this.camera(() => {
    draw(buffer.position, buffer.color)
  //})

  self._buffer = buffer
  self._draw = draw
  self._formatted = opts.formatted
  self.canvas = canvas
  self.frame = regl.frame

  regl.frame(({tick}) => {
    regl.clear({
      depth: 1,
      color: [0, 0, 0, 1]
    })

    //this.camera((tick) => {
      draw(buffer.position, buffer.color)
    //})
  })
}

Graph.prototype.update = function (positions, colors) {
  this._buffer.position(positions)

  // if (colors)
  //   this._buffer.color(colors)

  // window.c = colors
  // window.p = positions
  // this.camera(() => {
  //   self._draw(self._buffer.position(bunny.positions), self._buffer.color)
  // })
}


module.exports = Graph

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
