# RSMM – Remote Soil Moisture Monitoring (Mumbai Case Study)

![Region Split](https://raw.githubusercontent.com/nodonut6311/RSMM-Remote-Soil-Moisture-Monitoring/refs/heads/main/GEE%20Scripts/region_split.png)
---

## Status
🚧 **Work in Progress** – Methodology development and validation ongoing.  

---
## Overview
This repository hosts work-in-progress code and resources for a research study being co-authored by Rohan Amudhala and the Indian Institute of Tropical Meteorology (IITM), Pune, focusing on remote sensing of soil moisture content in the urban region of Mumbai, India.

The study leverages **MODIS satellite products**:
- **MOD13Q1** → Normalized Difference Vegetation Index (NDVI)  
- **MOD11A2** → Land Surface Temperature (LST)  

The aim is to **estimate soil moisture using the "triangle method"** (Carlson et al.) at a **1 km resolution**—a spatial scale highly relevant for heterogeneous cities like Mumbai. This study is generalizable and can be replicated for other regions.  

---

## Objectives
- Remotely sense soil moisture variations over Mumbai using MODIS data.  
- Split Mumbai into **three sub-regions (districts)** for analysis (see [region_split.js](https://github.com/nodonut6311/RSMM-Remote-Soil-Moisture-Monitoring/blob/main/GEE%20Scripts/region_split.js)).  
- Apply the **Triangle Method** to estimate soil moisture via the NDVI–LST feature space.  
- Validate soil moisture estimates against **rainfall datasets sourced from IITM, Pune**.  

---

## Study Area
Mumbai is divided into **three subregions** based on coordinate splits defined in `region_split.js`.  
The figure below highlights the spatial division:

 ```bash
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
   ```

---

## Methodology

### 1. Data Sources
- **MODIS MOD13Q1 (NDVI)** – Biweekly vegetation index data.  
- **MODIS MOD11A2 (LST)** – 8-day composite land surface temperature.  
- **Rainfall data from IITM, Pune** – Used for validation.  
- Data was extracted via **Google Earth Engine (GEE)** scripts located in the [`GEE`](https://github.com/nodonut6311/RSMM-Remote-Soil-Moisture-Monitoring/tree/main/GEE%20Scripts) folder.

---

### 2. Triangle Method
The **Triangle Method** (Carlson et al.) exploits the relationship between **NDVI** and **LST** to estimate soil moisture.  

- The NDVI–LST scatterplot forms a **triangular feature space**.  
- **Wet edge**: Represents conditions with high NDVI (dense vegetation) and low LST (cool canopy, well-watered).  
- **Dry edge**: Represents conditions with low NDVI (sparse vegetation) and high LST (hot, dry surfaces).  
- Each point inside the triangle corresponds to an intermediate soil moisture condition.  

Soil moisture is derived by locating a pixel’s **relative position between the wet and dry edges** in the NDVI–LST space.

![Triangle Method Illustration](https://www.mdpi.com/sensors/sensors-16-01308/article_deploy/html/images/sensors-16-01308-g002-1024.png)

---

### 3. Edge Fitting with Gradient Descent
- Wet and dry edges are approximated using **linear regression fits**.  
- To improve accuracy, the study employs **gradient descent** to minimize the residuals between observed and estimated boundaries.
  ```bash
  def gradient_descent_regression(filename, color_points, color_line, label_points, label_line):
    df = pd.read_csv(filename)
    df.columns = df.columns.str.strip()

    x = df["NDVI"].values
    y = df["LST (°C)"].values

    x_mean, x_std = np.mean(x), np.std(x)
    x_norm = (x - x_mean) / x_std

    m, b = 0.0, 0.0
    alpha, epochs = 0.01, 1000
    n = len(x_norm)

    for epoch in range(epochs):
        y_pred = m * x_norm + b
        error = y_pred - y
        dm = (2/n) * np.dot(error, x_norm)
        db = (2/n) * np.sum(error)
        m -= alpha * dm
        b -= alpha * db

    x_line = np.linspace(0, 0.6, 100)
    x_line_norm = (x_line - x_mean) / x_std
    y_line = m * x_line_norm + b

    plt.scatter(x, y, color=color_points, label=label_points)
    plt.plot(x_line, y_line, color=color_line, linewidth=2, label=label_line)

    slope_original = m / x_std
    intercept_original = b - (m * x_mean / x_std)
    return slope_original, intercept_original
  ```
- This ensures robust estimation of soil moisture across varying land cover and climatic conditions.  

---

### 4. Validation
- Soil moisture estimates are validated against **ground-truth rainfall datasets from IITM, Pune**.  
- The comparison helps establish the **temporal correlation between soil moisture and rainfall events**.  

---

## Novelty
- Use of **MODIS 1 km resolution data** for urban-scale soil moisture mapping.  
- Mumbai, with its heterogeneous land cover (urban sprawl, green patches, coastal influence), requires high-resolution satellite products for meaningful analysis.  
- The methodology is **scalable and replicable** to other urban regions facing water resource management challenges.  

---
## How to Run

### 1. Prerequisites
- A [Google Earth Engine (GEE)](https://earthengine.google.com/) account.  
- Basic familiarity with JavaScript (for running the scripts in the GEE Code Editor).  
- Python ≥ 3.8 (for soil moisture analysis code).  

For Data Viz and Analysis:
- `numpy`, `pandas`, `matplotlib`, `scikit-learn`

---

### 2. Running GEE Scripts
1. Open [Google Earth Engine Code Editor](https://code.earthengine.google.com/).  
2. Copy the contents of any script from the [`GEE`](https://github.com/nodonut6311/RSMM-Remote-Soil-Moisture-Monitoring/tree/main/GEE%20Scripts) folder.  
   - Example: `region_split.js` defines the three subregions of Mumbai.  
   - Example: Other scripts fetch MODIS NDVI (MOD13Q1) and LST (MOD11A2).  
3. Paste the script into the GEE editor.  
4. Modify the **date range** and **export options** as required.  
5. Run the script to visualize outputs and export data (GeoTIFF/CSV).  

---

### 3. Local Analysis
Once the soil moisture estimation notebooks are added, you can clone this repository and run:

```bash
git clone https://github.com/nodonut6311/RSMM-Remote-Soil-Moisture-Monitoring.git
cd RSMM-Remote-Soil-Moisture-Monitoring
```
---
## Author
This project is developed and maintained by **Rohan Amudhala** as part of a research collaboration.  

---

## Acknowledgements
This study is conducted in collaboration with the **Indian Institute of Tropical Meteorology (IITM), Pune**.  

We also acknowledge the foundational work of **Carlson, T.N., et al. (1994)** on the NDVI–LST Triangle Method, which underpins the methodology applied in this study.  

Special thanks to the MODIS data providers and the Google Earth Engine platform for enabling large-scale data access and processing.



