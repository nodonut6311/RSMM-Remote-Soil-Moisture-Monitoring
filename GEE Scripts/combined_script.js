// Regions
var regions = {
    'Region_1': ee.Geometry.Polygon([
      [[72.88690699257768,18.997442224334065],
       [72.95728815712846,18.997442224334065],
       [72.95728815712846,19.108101802264542],
       [72.88690699257768,19.108101802264542],
       [72.88690699257768,18.997442224334065]]
    ]),
    'Region_2': ee.Geometry.Polygon([
      [[72.81128250675029,19.156843569935948],
       [72.90741287784404,19.156843569935948],
       [72.90741287784404,19.265775960068403],
       [72.81128250675029,19.265775960068403],
       [72.81128250675029,19.156843569935948]]
    ]),
    'Region_3': ee.Geometry.Polygon([
      [[72.95067154483623,19.150032901517505],
       [73.00045334415263,19.150032901517505],
       [73.00045334415263,19.285220570195737],
       [72.95067154483623,19.285220570195737],
       [72.95067154483623,19.150032901517505]]
    ])
  };
  
  // MODIS NDVI
  function getNDVI(start, end) {
    return ee.ImageCollection('MODIS/061/MOD13Q1')
      .filterDate(start, end)
      .select('NDVI')
      .map(function(img) {
        return img.multiply(0.0001).copyProperties(img, ['system:time_start']);
      })
      .mean(); // monthly mean
  }
  
  // MODIS LST
  function getLST(start, end) {
    return ee.ImageCollection('MODIS/061/MOD11A2')
      .filterDate(start, end)
      .select('LST_Day_1km')
      .map(function(img) {
        return img.multiply(0.02).subtract(273.15).copyProperties(img, ['system:time_start']);
      })
      .mean(); // monthly mean
  }
  
  // Years and months
  var startYear = 2013;
  var endYear = 2015;
  var years = ee.List.sequence(startYear, endYear);
  var months = ee.List.sequence(1, 12);
  
  // Function to compute regional monthly mean
  function computeRegional(regionName, geometry) {
    var features = ee.FeatureCollection(
      years.map(function(y) {
        var yearStr = ee.Number(y).format();
        return months.map(function(m) {
          var monthNum = ee.Number(m);
          var start = ee.Date.fromYMD(y, m, 1);
          var end = start.advance(1, 'month');
  
          var ndvi = getNDVI(start, end);
          var lst  = getLST(start, end);
  
          // Reduce over the region to get mean values
          var ndviMean = ndvi.reduceRegion({
            reducer: ee.Reducer.mean(),
            geometry: geometry,
            scale: 1000,
            maxPixels: 1e13
          }).get('NDVI');
  
          var lstMean = lst.reduceRegion({
            reducer: ee.Reducer.mean(),
            geometry: geometry,
            scale: 1000,
            maxPixels: 1e13
          }).get('LST_Day_1km');
  
          return ee.Feature(null, {
            'Region': regionName,
            'Year': yearStr,
            'Month': monthNum,
            'NDVI': ndviMean,
            'LST_Celsius': lstMean
          });
        });
      }).flatten()
    );
  
    // Export the CSV
    Export.table.toDrive({
      collection: features,
      description: regionName + '_MonthlyMean_LST_NDVI_' + startYear + '-' + endYear,
      folder: 'TS_NDVI_LST',
      fileFormat: 'CSV'
    });
  }
  
  // Loop through regions
  for (var key in regions) {
    computeRegional(key, regions[key]);
  }
  
