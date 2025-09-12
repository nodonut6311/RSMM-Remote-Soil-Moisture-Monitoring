from osgeo import gdal
import numpy as np
import matplotlib.pyplot as plt


# tif_path = '/Users/Downloads/NDVI_Mean_2013_2024.tif'  
dataset = gdal.Open(tif_path)

if not dataset:
    raise FileNotFoundError("GeoTIFF file could not be opened. Check the path.")

band = dataset.GetRasterBand(1)
arr = band.ReadAsArray()

no_data_val = band.GetNoDataValue()
print(f"NoData value from metadata: {no_data_val}")

if no_data_val is not None:
    masked_arr = np.ma.masked_where(arr == no_data_val, arr)
else:
    masked_arr = np.ma.masked_invalid(arr)


print("Raw min:", masked_arr.min(), "Raw max:", masked_arr.max())

plt.figure(figsize=(10, 12), dpi=300)
plt.imshow(masked_arr, cmap='plasma')
plt.colorbar(label='Land Surface Temperature (°C)')
plt.axis('off')
plt.tight_layout()


# output_path = 
plt.savefig(output_path, format='jpeg', dpi=300)
plt.close()

print(f"High-resolution image saved to: {output_path}")


