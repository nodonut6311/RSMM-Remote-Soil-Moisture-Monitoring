//Region Definition
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
  
  // MODIS LST collection
  function getLST(start, end) {
    return ee.ImageCollection('MODIS/061/MOD11A2')
      .filterDate(start, end)
      .select('LST_Day_1km')
      .map(function(img) {
        return img.multiply(0.02).subtract(273.15) // Scale & K to °C
                  .copyProperties(img, ['system:time_start']);
      });
  }
  
  // Years and months 
  var startYear = 2013;
  var endYear   = 2015;
  var years  = ee.List.sequence(startYear, endYear);
  var months = ee.List.sequence(1, 12);
  
  // Looping over regions
  for (var key in regions) {
    var geometry = regions[key];
  
    var results = ee.FeatureCollection(
      years.map(function(year) {
        var yearStr = ee.Number(year).format();
  
        return ee.FeatureCollection(
          months.map(function(month) {
            var m = ee.Number(month);
            var start = ee.Date.fromYMD(year, m, 1);
            var end   = start.advance(1, 'month');
  
            // Computing mean LST (month-wise)
            var lst = getLST(start, end).mean()
              .reduceRegion({
                reducer: ee.Reducer.mean(),
                geometry: geometry,
                scale: 1000,
                maxPixels: 1e13
              });
  
            return ee.Feature(null, {
              'Region': key,
              'Year': yearStr,
              'Month': m,
              'LST_Celsius': lst.get('LST_Day_1km')
            });
          })
        );
      })
    ).flatten();
  
    // Export
    Export.table.toDrive({
      collection: results,
      description: key + '_LST_Monthly_' + startYear + '-' + endYear,
      folder: 'TS_NDVI_LST',
      fileFormat: 'CSV'
    });
  }
  
