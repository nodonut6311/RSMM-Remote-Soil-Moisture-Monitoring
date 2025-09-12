import rasterio
import pandas as pd
import numpy as np


with rasterio.open('/Users/Downloads/LST_Mean_2024.tif') as src:
    band = src.read(1)  
    rows, cols = np.where(band != src.nodata)  
    values = band[rows, cols]

    lats, lons = [], []
    for row, col in zip(rows, cols):
        lon, lat = src.xy(row, col)
        lats.append(lat)
        lons.append(lon)

df = pd.DataFrame({
    'latitude': lats,
    'longitude': lons,
    'value': values
})

df.to_csv('/Users/Desktop/UHI/M_2024.csv', index=False)
