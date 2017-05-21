
function loadWeatherData() {
  return new Promise(function (resolve, reject) {
    (0, _d3Request.request)('data/weather.bin').responseType('arraybuffer').on('load', function (req) {
      resolve(parseData(req.response));
    }).on('error', reject).get();
  });
}


function parseData(buffer) {
  var bufferData = new Uint16Array(buffer);
  var hours = 72;
  var components = 3;
  var l = bufferData.length / (hours * components);
  var hourlyData = Array(hours);

  for (var i = 0; i < hours; ++i) {
    hourlyData[i] = createHourlyData(bufferData, i, l, hours, components);
  }

  return hourlyData;
}
