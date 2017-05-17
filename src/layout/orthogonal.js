//https://threejs.org/examples/webgl_buffergeometry_drawcalls.html
let d3 = require('d3')

function set(arr, fn, n) {
  n = n || 1000
  for(var i= 0; i < n; i++)
    arr[i] = fn(arr[i], i)
}


let width = 960, height = 500

function force (init, update) {
  let particlesData = [], particlePositions = [], colors = [], positions= []

  set(positions, (d) => { return Math.random() });
  set(particlesData, (d) => { return 0 });
  set(particlePositions, (d) => { return 0 });

  animate(particlesData, particlePositions, colors, positions);
  window.p = positions
  window.pd = particlesData
  window.pp = particlePositions

  //console.log(positions, pd , particlePositions)

  init(positions)
  d3.timer(() => {
    animate(particlesData, particlePositions, colors, positions);
    update(positions)
  })
}

function animate(particlesData, particlePositions, colors, positions) {

	var vertexpos = 0;
	var colorpos = 0;
	var numConnected = 0;

  let particleCount = 500
  let rHalf = 400
  let minDistance  = 150
  let maxConnections = 20

	for ( var i = 0; i < particleCount; i++ ) {
    if (! particlesData[i]) particlesData[i] = {
      velocity: [1, 2, 1].map(
        () => {
            return -1 + Math.random() * 2 
        }
      )
    }
		particlesData[ i ].numConnections = 0;
  }
  
	for ( var i = 0; i < particleCount; i++ ) {
		var particleData = particlesData[i];
    
		particlePositions[ i * 3     ] += particleData.velocity[0];
		particlePositions[ i * 3 + 1 ] += particleData.velocity[1];
		particlePositions[ i * 3 + 2 ] += particleData.velocity[2];

    
		if ( particlePositions[ i * 3 + 1 ] < -rHalf || particlePositions[ i * 3 + 1 ] > rHalf )
			particleData.velocity[1] = -particleData.velocity[1];

		if ( particlePositions[ i * 3 ] < -rHalf || particlePositions[ i * 3 ] > rHalf )
			particleData.velocity[0] = -particleData.velocity[0];

		if ( particlePositions[ i * 3 + 2 ] < -rHalf || particlePositions[ i * 3 + 2 ] > rHalf )
			particleData.velocity[2] = -particleData.velocity[2];

    
		// Check collision
		for ( var j = i + 1; j < particleCount; j++ ) {

			var particleDataB = particlesData[ j ];

			var dx = particlePositions[ i * 3     ] - particlePositions[ j * 3     ];
			var dy = particlePositions[ i * 3 + 1 ] - particlePositions[ j * 3 + 1 ];
			var dz = particlePositions[ i * 3 + 2 ] - particlePositions[ j * 3 + 2 ];
			var dist = Math.sqrt( dx * dx + dy * dy + dz * dz );

			if ( dist < minDistance ) {

				particleData.numConnections++;
				particleDataB.numConnections++;

				var alpha = 1.0 - dist;

				positions[ vertexpos] = [  particlePositions[ i * 3     ],
				                           particlePositions[ i * 3 + 1 ],
				                           particlePositions[ i * 3 + 2 ]
                                ]

				positions[ vertexpos+1] = [ particlePositions[ j * 3     ],
				                           particlePositions[ j * 3 + 1 ],
				                           particlePositions[ j * 3 + 2 ]
                                 ]
        vertexpos+=2
				colors[ colorpos++ ] = alpha;
				colors[ colorpos++ ] = alpha;
				colors[ colorpos++ ] = alpha;

				colors[ colorpos++ ] = alpha;
				colors[ colorpos++ ] = alpha;
				colors[ colorpos++ ] = alpha;

				numConnected++;
			}
		}
	}
}

module.exports = force
