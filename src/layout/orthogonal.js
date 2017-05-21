let d3 = require('d3')

module.exports = force
function force (init, update) {
  let particlesData = [], particlePositions = [], colors = [], positions= new Array(3e4)

  positions = positions.fill(0)
  particlesData.fill(0)
  particlePositions.fill(0)
  colors.fill(0)

  window.p = positions
  window.pd = particlesData
  window.pp = particlePositions

  init(positions);
  //console.log('ortho', positions.length)

  //animate(particlesData, particlePositions, colors, positions);
  d3.timer(() => {
    animate(particlesData, particlePositions, colors, positions);
    update(positions)
  })
}

function animate(particlesData, particlePositions, colors, positions) {
	var vertexpos = 0;
	var colorpos = 0;
	var numConnected = 0;

  let particleCount = 10
  let rHalf = 1
  let minDistance  = 100
  let maxConnections = 5

  let width = 960, height = 500

	for ( var i = 0; i < particleCount; i++ ) {
    if (! particlesData[i]) particlesData[i] = {
      velocity: [1, 2, 1].map(
        () => {return Math.random() * .01 * (Math.random() > .5 ? -1 : 1)}
      )
    }
		particlesData[ i ].numConnections = 0;
  }

	for ( var i = 0; i < particleCount * 3; i++ )
    if (! particlePositions[i]) particlePositions[i] = 0

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
        //console.log(alpha)

        positions[vertexpos + 0] = particlePositions[ i * 3     ]
				positions[vertexpos + 1] = particlePositions[ i * 3 + 1 ]
				positions[vertexpos + 2] = particlePositions[ i * 3 + 2 ]


        positions[ vertexpos+3] =  particlePositions[ j * 3     ]
        positions[ vertexpos+4] = particlePositions[ j * 3 + 1 ]
        positions[ vertexpos+5] = particlePositions[ j * 3 + 2 ]

        vertexpos +=6

				colors[ colorpos + 0] = alpha;
				colors[ colorpos + 1] = alpha;

        colors += 2
				numConnected++;
			}
		}
	}
}


