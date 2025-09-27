// Region 1: Govandi East / Cheeta Camp Area
var region1 = ee.Geometry.Polygon([
    [72.88690699257768, 18.997442224334065],
    [72.95728815712846, 18.997442224334065],
    [72.95728815712846, 19.10801802264542],
    [72.88690699257768, 19.10801802264542],
    [72.88690699257768, 18.997442224334065]
  ]);
  
  // Region 2: Kandivali East / Malad East Area
  var region2 = ee.Geometry.Polygon([  
    [72.81128250675029, 19.156843569935948],
    [72.90741287784404, 19.156843569935948],
    [72.90741287784404, 19.265775960068403],
    [72.81128250675029, 19.265775960068403],
    [72.81128250675029, 19.156843569935948]
  ]);
  
  // Region 3: Thane / Kasarvadavli Belt
  var region3 = ee.Geometry.Polygon([
    [72.95067154483623, 19.150032901517505],
    [73.00045334415263, 19.150032901517505],
    [73.00045334415263, 19.285220570195737],
    [72.95067154483623, 19.285220570195737],
    [72.95067154483623, 19.150032901517505]
  ]);
  
  
  Map.centerObject(region2, 11);
  Map.addLayer(region1, {color: 'red'}, 'Region 1 - Govandi');
  Map.addLayer(region2, {color: 'blue'}, 'Region 2 - Kandivali');
  Map.addLayer(region3, {color: 'green'}, 'Region 3 - Thane');
  
