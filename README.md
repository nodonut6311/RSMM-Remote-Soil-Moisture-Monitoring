# RSMM – Remote Soil Moisture Monitoring (Mumbai Case Study)

![Region Split](https://raw.githubusercontent.com/nodonut6311/RSMM-Remote-Soil-Moisture-Monitoring/refs/heads/main/GEE%20Scripts/region_split.png?token=GHSAT0AAAAAADKRC4YQH7C7E5A75NUIR22K2GG62YQ)

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

## Repository Structure
```bash
RSMM-Remote-Soil-Moisture-Monitoring/
│
├── GEE/                  # Google Earth Engine scripts for data extraction
│   ├── region_split.js    # Script defining Mumbai’s 3 subregions
│   └── *.js               # Scripts for fetching MODIS NDVI & LST
│
├── region_split.png       # Visualization of study subregions
├── README.md              # Project documentation (this file)
└── (future additions)     # Soil moisture estimation code, results, notebooks


