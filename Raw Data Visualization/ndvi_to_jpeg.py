from osgeo import gdal
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap

tif_path = '/Users/Downloads/NDVI_Mean_2024.tif'
ds = gdal.Open(tif_path)
if not ds:
    raise FileNotFoundError("Could not open GeoTIFF")

arr = ds.GetRasterBand(1).ReadAsArray()
no_data = ds.GetRasterBand(1).GetNoDataValue()
masked = np.ma.masked_where(arr == no_data, arr) if no_data is not None else np.ma.masked_invalid(arr)
print("NDVI range:", masked.min(), masked.max())

gee_palette = [
    '#ffffff','#ce7e45','#df923d','#f1b555','#fcd163',
    '#99b718','#74a901','#66a000','#529400','#3e8601',
    '#207401','#056201','#004c00','#023b01','#012e01',
    '#011d01','#011301'
]
gee_cmap = LinearSegmentedColormap.from_list('gee_ndvi', gee_palette, N=256)

fig, ax = plt.subplots(figsize=(10, 12), dpi=300)
im = ax.imshow(masked, cmap=gee_cmap, vmin=0, vmax=1, interpolation='nearest')
ax.set_title('Mean NDVI (2013)', fontsize=14)
ax.axis('off')

cbar = fig.colorbar(im, ax=ax, fraction=0.03, pad=0.04)
cbar.set_label('NDVI (Normalized Difference Vegetation Index)')

output_path = '/Users/Desktop/UHI/NDVI_2024.jpeg'
plt.savefig(output_path, format='jpeg', dpi=300, bbox_inches='tight', pad_inches=0.1)
plt.close()

print(f"Centered NDVI image saved to: {output_path}")

