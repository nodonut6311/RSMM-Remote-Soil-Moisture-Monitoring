import rasterio
import pandas as pd
import numpy as np

with rasterio.open('/Users/Downloads/NDVI_Mean_2023.tif') as src:
    band = src.read(1)  
    rows, cols = np.where(band != src.nodata) 
    ndvi_values = band[rows, cols]

    lats, lons = [], []
    for row, col in zip(rows, cols):
        lon, lat = src.xy(row, col)
        lats.append(lat)
        lons.append(lon)

ndvi_df = pd.DataFrame({
    'latitude': lats,
    'longitude': lons,
    'ndvi': ndvi_values
})

ndvi_df.to_csv('/Users/Desktop/UHI/NDVI_csv/N_2023.csv', index=False)
