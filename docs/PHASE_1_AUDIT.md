# TrafficPulse AI — Phase 1 Codebase & Machine Learning Audit

**Document Status**: Complete  
**Date**: October 2026  
**Auditor**: Senior Full-Stack & ML Architect  
**Upstream Repository**: [Elly-su/traffic-congestion-prediction](https://github.com/Elly-su/traffic-congestion-prediction)  
**Preserved Upstream Commit SHA**: `312aa5206090e41c759665a322fa7812d12d5aec`  
**Destination Repository**: [TrafficPulse-AI](https://github.com/atleekumaar/TrafficPulse-AI) (`phase-1/foundation` branch)

---

## 1. Original Architecture & Entry Points

The upstream project is an end-to-end Python-based educational machine learning workflow consisting of data generation, feature engineering, model training/evaluation, and a Streamlit dashboard interface.

### Project Layout
- `app.py`: Streamlit entry point (1,443 lines). Provides an interactive multi-tab dashboard (Home, Make Prediction, Explore Data, Model Performance, Insights) using Plotly and custom CSS.
- `dashboard_utils.py`: Helper functions for `app.py` (330 lines) providing model deserialization, real-time feature vector assembly matching the training feature schema, threshold-based classification, and UI recommendations.
- `src/`: Core pipeline modules:
  - `data_collection.py`: Procedural generator for raw traffic, simulated weather, and synthetic event records.
  - `data_preprocessing.py`: Implements `TrafficDataPreprocessor` class for temporal feature extraction, rolling stats, one-hot encoding, and train/val/test splits.
  - `exploratory_analysis.py`: EDA script outputting statistical plots into `visualizations/`.
  - `model_training.py`: Implements `TrafficModelTrainer` training 5 regression models and 3 classification models, outputting serialized pickle artifacts to `models/`.
  - `model_evaluation.py`: Model evaluation script computing test metrics and error curves.
  - `utils.py`: Shared utility helpers for logging and filesystem management.
- `Datasets/`: CSV datasets containing raw data and processed train/val/test splits, plus `DATASETS_INFO.md`.
- `data/processed/`: Processed CSV splits and serialized `preprocessor.pkl`.
- `models/`: Trained model binaries (`.pkl`) and benchmark CSV files.
- `visualizations/`: Pre-rendered PNG charts documenting distributions, correlations, confusion matrices, and feature importance.
- `REPORT.md` & `REPORT_EXECUTIVE.md`: Academic/executive summaries documenting methodology, findings, and reported metrics.

---

## 2. Existing Regression & Classification Models

The system evaluates two primary machine learning tasks:
1. **Regression Task (Continuous Volume)**: Predicts hourly vehicle count (`traffic_volume`).
2. **Classification Task (Congestion Level)**: Classifies traffic state into 3 discrete classes: `Low` (<33rd percentile), `Medium` (33rd-67th percentile), and `High` (>67th percentile).

### Evaluated Model Algorithms

| Task | Model | Implementation | Upstream Test R² / Acc | Upstream Test MAE / F1 |
|---|---|---|---|---|
| **Regression** | Linear Regression | `sklearn.linear_model.LinearRegression` | R² = 0.9205 | MAE = 421.79 |
| **Regression** | Ridge Regression | `sklearn.linear_model.Ridge(alpha=1.0)` | R² = 0.9205 | MAE = 421.78 |
| **Regression** | Lasso Regression | `sklearn.linear_model.Lasso(alpha=1.0)` | R² = 0.9206 | MAE = 421.22 |
| **Regression** | Random Forest Regressor | `sklearn.ensemble.RandomForestRegressor(n_estimators=100, max_depth=20)` | R² = 0.9465 | MAE = 341.77 |
| **Regression** | Gradient Boosting Regressor | `sklearn.ensemble.GradientBoostingRegressor(n_estimators=100, max_depth=5)` | R² = 0.9447 | MAE = 347.84 |
| **Classification** | Logistic Regression | `sklearn.linear_model.LogisticRegression(max_iter=1000)` | Accuracy = 80.25% | Weighted F1 = 0.8032 |
| **Classification** | Random Forest Classifier | `sklearn.ensemble.RandomForestClassifier(n_estimators=100, max_depth=20)` | Accuracy = 81.13% | Weighted F1 = 0.8106 |
| **Classification** | Support Vector Machine (SVM) | `sklearn.svm.SVC(kernel='rbf', C=1.0)` | Accuracy = 79.99% | Weighted F1 = 0.7980 |

*Note on Reported Figures*: The upstream `REPORT_EXECUTIVE.md` claims "R² = 0.75" in its executive summary text, but the recorded metric files (`models/test_regression_results.csv`) and `REPORT.md` document R² = 0.9465 for Random Forest and R² = 0.9205 for Linear Regression. All metrics are preserved as upstream-reported numbers until independently validated.

---

## 3. Dataset Filenames, Schema, Provenance, Coverage & Licensing

### Dataset Files and Locations

| File | Path | Size | Rows | Schema Columns |
|---|---|---|---|---|
| Raw Traffic Data | `Datasets/traffic_data_raw.csv` | ~2.08 MB | 17,520 | 12 raw columns (`date_time`, `traffic_volume`, `temp`, `rain_1h`, `snow_1h`, `clouds_all`, `weather_main`, `holiday`, `event_type`, `event_size`, `expected_attendance`, etc.) |
| Train Split | `Datasets/train_data.csv` & `data/processed/train_data.csv` | ~7.87 MB | 12,264 | 47 columns (43 features + 4 target/metadata columns) |
| Validation Split | `Datasets/val_data.csv` & `data/processed/val_data.csv` | ~1.12 MB | 1,752 | 47 columns |
| Test Split | `Datasets/test_data.csv` & `data/processed/test_data.csv` | ~2.24 MB | 3,504 | 47 columns |

### Critical Provenance Finding: Synthetic Nature
Although inspired by the UCI Machine Learning Repository's *Metro Interstate Traffic Volume Dataset* (Minneapolis I-94), the actual data files were **programmatically synthesized** in `src/data_collection.py`:
- Hourly sequence spanning exactly two calendar years: `2020-01-01 00:00:00` to `2022-01-01 23:00:00` (17,520 records).
- Synthetic traffic curve generated using trigonometric sinusoidal components:
  $$\text{traffic\_volume} = 3000 + \text{rush\_hour\_boost} + \text{weekday\_boost} + 1000 \cdot \sin\left(\frac{(h-6)\pi}{12}\right) + \mathcal{N}(0, 500)$$
- Weather data contains simulated seasonal temperature curves and stochastic rain/snow events, or synthetic fallbacks from Open-Meteo.
- Event occurrences (350+ simulated events) were generated programmatically with weekend/evening bias.

**Compliance Requirement**: These observations MUST NOT be presented as genuine live highway sensor data or real-time IoT feeds. They are high-fidelity synthetic benchmark observations replicating Minneapolis traffic behavior.

### Licensing & Attribution
- Upstream declares educational use: `"This project is created for educational purposes."`
- Open-Meteo Weather data is governed by the Open-Meteo Non-Commercial / CC BY 4.0 license.
- UCI Metro Interstate Traffic Volume dataset original credit goes to John Hogue (Minnesota Department of Transportation).

---

## 4. Existing Feature Engineering & Preprocessing

The preprocessing pipeline in `src/data_preprocessing.py` and real-time inference builder in `dashboard_utils.py` produce 43 model features:

1. **Temporal Features**: `hour`, `day_of_week` (0=Mon), `day_of_month`, `month`, `year`, `week_of_year`, `is_weekend` (binary), `is_holiday` (binary), `is_rush_hour` (binary: 7-9 AM, 16-19 PM).
2. **Weather Features**: `temp`, `temp_celsius`, `rain_1h`, `snow_1h`, `clouds_all`, `temperature_2m`, `precipitation`, `windspeed_10m`, `cloudcover`, `total_precipitation`, `bad_weather` (binary indicator for precip > 2mm or snow > 1mm).
3. **Autoregressive / Lagged Features**:
   - `traffic_prev_hour` ($\text{traffic}_{t-1}$)
   - `traffic_prev_day` ($\text{traffic}_{t-24}$)
   - `traffic_prev_week` ($\text{traffic}_{t-168}$)
4. **Rolling Window Statistics**:
   - `traffic_rolling_mean_6h`, `traffic_rolling_std_6h` (6-hour moving window)
   - `traffic_rolling_mean_24h` (24-hour moving window)
5. **Event Attributes**: `expected_attendance` (integer: 0 to 50,000).
6. **Categorical Dummies (One-Hot Encoded)**:
   - Weather main: `weather_main_Clouds`, `weather_main_Partly Cloudy`, `weather_main_Rain`, `weather_main_Snow`
   - Time of Day: `time_of_day_Morning`, `time_of_day_Afternoon`, `time_of_day_Evening`
   - Season: `season_Spring`, `season_Summer`, `season_Fall`
   - Event Type: `event_type_Conference`, `event_type_Fair`, `event_type_Festival`, `event_type_Sports`
   - Event Size: `event_size_Medium`, `event_size_Small`
7. **Scaling**: `StandardScaler` applied to 27 continuous numerical columns (`preprocessor.scaler`).

---

## 5. Existing Model Evaluation Methodology

- **Splitting Strategy**: A chronological temporal split is applied:
  - **Train**: 70% (12,264 records; 2020-01-01 to 2021-06-15)
  - **Validation**: 10% (1,752 records; 2021-06-15 to 2021-09-15)
  - **Test**: 20% (3,504 records; 2021-09-15 to 2022-01-01)
- **Regression Evaluation Metrics**:
  - Root Mean Squared Error (RMSE)
  - Mean Absolute Error (MAE)
  - Coefficient of Determination ($R^2$)
  - Mean Absolute Percentage Error (MAPE)
- **Classification Evaluation Metrics**:
  - Accuracy
  - Weighted Precision
  - Weighted Recall
  - Weighted F1-Score

---

## 6. Potential Data Leakage & Time-Series Validation Risks

The audit revealed several subtle time-series validation issues and leakage risks:

1. **Global Quantile Boundary Leakage**:
   In `src/data_preprocessing.py:170`, the quantiles defining classification targets (`Low`, `Medium`, `High`) are computed over the **entire raw dataset** before temporal splitting:
   ```python
   q33 = df['traffic_volume'].quantile(0.33)
   q67 = df['traffic_volume'].quantile(0.67)
   ```
   *Risk*: The target definition incorporates future test-period distribution thresholds into the training classification labels.
2. **Global Backward-Fill on Lagged & Rolling Features**:
   In `src/data_preprocessing.py:149`, missing values created by `.shift(168)` (first week of data) are filled with `df.fillna(method='bfill')` across the full dataframe. This leaks future traffic values backwards into initial rows.
3. **Global Categorical One-Hot Encoding**:
   `pd.get_dummies` is executed before splitting, exposing the presence of all categories across the dataset rather than fitting on the training set alone.
4. **Absence of Rolling-Origin / Purged Cross-Validation**:
   The evaluation relies on a single fixed chronological split rather than walk-forward cross-validation (e.g. `TimeSeriesSplit`). Performance could vary if structural shifts occurred.
5. **Autoregressive Inference Reliance**:
   The high regression performance ($R^2 > 0.94$) is heavily dominated by `traffic_prev_hour` and rolling averages. In a multi-step forecast (15, 30, 60 minutes ahead), recursive predictions or direct multi-horizon models will be required, as ground-truth $t-1$ observations degrade with horizon length.

---

## 7. Existing Model Artifacts & Input-Feature Requirements

### Artifact Inventory & Storage (Git LFS)

| Artifact | Size | Format | Status | Notes |
|---|---|---|---|---|
| `models/random_forest_reg.pkl` | 38.2 MB | Pickle (Git LFS) | Recovered | Full Random Forest Regressor |
| `models/random_forest_clf.pkl` | 18.4 MB | Pickle (Git LFS) | Recovered | Full Random Forest Classifier |
| `models/svm_clf.pkl` | 2.24 MB | Pickle (Git LFS) | Recovered | Support Vector Classifier |
| `models/linear_regression_reg.pkl` | 1.97 KB | Pickle (Git LFS) | Recovered | Linear Regression |
| `models/ridge_regression_reg.pkl` | 1.65 KB | Pickle (Git LFS) | Recovered | Ridge Regression |
| `models/lasso_regression_reg.pkl` | 1.73 KB | Pickle (Git LFS) | Recovered | Lasso Regression |
| `models/logistic_regression_clf.pkl` | 2.64 KB | Pickle (Standard Git) | Intact | Logistic Regression Classifier |
| `models/lr_classification.pkl` | 2.64 KB | Pickle (Standard Git) | Intact | Duplicate of `logistic_regression_clf.pkl` |
| `models/gradient_boosting_reg.pkl` | 473 KB | Pickle (Standard Git) | **Version Incompatible** | Fails in scikit-learn $\ge$ 1.9 due to `_loss` module refactor |
| `models/gb_regression.pkl` | 473 KB | Pickle (Standard Git) | **Version Incompatible** | Duplicate of `gradient_boosting_reg.pkl` |
| `data/processed/preprocessor.pkl` | 1.85 KB | Pickle (Standard Git) | Intact | `TrafficDataPreprocessor` instance |

### Git LFS Resolution
The upstream repository originally stored large `.pkl` files in Git LFS, but had an empty `.gitattributes` file in git history, leaving 132-byte text pointer files in standard checkouts. During Phase 1, `git lfs track "*.pkl"` was configured and all binary objects were fetched from upstream and smudged into binary pickle files.

### Exact 43 Input Features Required for Inference
Any prediction call requires the exact 43-column ordered vector:
`temp`, `rain_1h`, `snow_1h`, `clouds_all`, `temperature_2m`, `precipitation`, `windspeed_10m`, `cloudcover`, `expected_attendance`, `hour`, `day_of_week`, `day_of_month`, `month`, `year`, `week_of_year`, `is_weekend`, `is_holiday`, `is_rush_hour`, `temp_celsius`, `total_precipitation`, `bad_weather`, `traffic_prev_hour`, `traffic_prev_day`, `traffic_prev_week`, `traffic_rolling_mean_6h`, `traffic_rolling_std_6h`, `traffic_rolling_mean_24h`, `weather_main_Clouds`, `weather_main_Partly Cloudy`, `weather_main_Rain`, `weather_main_Snow`, `time_of_day_Morning`, `time_of_day_Afternoon`, `time_of_day_Evening`, `season_Spring`, `season_Summer`, `season_Fall`, `event_type_Conference`, `event_type_Fair`, `event_type_Festival`, `event_type_Sports`, `event_size_Medium`, `event_size_Small`.

---

## 8. Dependencies & Known Compatibility Risks

### Upstream Python Dependencies (`requirements.txt`)
- `pandas>=1.5.0`
- `numpy>=1.23.0`
- `matplotlib>=3.6.0`
- `seaborn>=0.12.0`
- `scikit-learn>=1.2.0`
- `requests>=2.28.0`
- `jupyter>=1.0.0`
- `openpyxl>=3.0.0`
- `python-docx>=0.8.11`
- `streamlit>=1.28.0`
- `plotly>=5.17.0`

### Identified Compatibility Risks
1. **Scikit-Learn Version Serialization Drift**:
   The upstream models were trained and serialized on `scikit-learn 1.7.2`. In environments running `scikit-learn 1.9.0` (such as local Python 3.14):
   - `InconsistentVersionWarning` is raised for all estimators.
   - `GradientBoostingRegressor` raises `ModuleNotFoundError: No module named '_loss'` due to internal refactoring in scikit-learn.
   - *Mitigation*: Pin Python backend environment to `scikit-learn==1.7.2` (or retrain cleanly in Phase 2).
2. **Python 3.14+ C-Extension / Pickle Compatibility**:
   Running modern ML stacks on bleeding-edge Python 3.14 has ecosystem caveats. Recommended Python runtime for the forecasting service is Python 3.10–3.12.
3. **No FastAPI / Async Framework Present**:
   The upstream application is exclusively built for Streamlit. Streamlit is retained as a reference interface, but cannot serve as a high-throughput headless API for Next.js.

---

## 9. Reusable Components

The following components can be reused without architectural rewrites:

1. **Feature Transformation Logic**:
   The mathematical mappings in `dashboard_utils.py:create_temporal_features` and `dashboard_utils.py:create_weather_features` accurately align with the trained feature space and can be directly migrated to a FastAPI service.
2. **Processed Benchmark Datasets**:
   `test_data.csv` (3,504 hourly rows) provides a consistent ground-truth evaluation benchmark to power actual-vs-predicted historical visualizations.
3. **Model Weights for Random Forest & Linear Models**:
   `random_forest_reg.pkl`, `random_forest_clf.pkl`, and linear baselines are intact and can be loaded in an aligned runtime.
4. **Reference Streamlit Dashboard**:
   `app.py` serves as a baseline user-interface reference for domain features and exploratory data analysis.

---

## 10. Limitations & Planned Integration Boundaries

### Limitations of Original Upstream System
- **Single-Time Horizon**: The original models only predict single-step 1-hour traffic; there is no native multi-horizon (15, 30, 60 minutes) prediction logic.
- **No API Layer**: All inference logic is coupled inside the Streamlit user-interface session state.
- **No Road Network / Geospatial Granularity**: The dataset models a single aggregate corridor (I-94 Minneapolis cross-section). There are no GPS coordinates, latitude/longitude road segments, or citywide graph topologies.
- **Synthetic Data**: Traffic and event numbers are synthetic, not streaming sensor telemetry.

### Future Integration Boundary
```
[ Next.js 15+ App Router Frontend ]
             │  (REST / JSON)
             ▼
[ FastAPI High-Performance Backend Service ]
             │  (Python Internal Invocation)
             ▼
[ TrafficPulse Forecasting Engine & Model Registry ]
             │
      ┌──────┴──────────────────────┐
      ▼                             ▼
[ Validated Model Artifacts ]   [ Test/Historical Benchmarks ]
(RF, Linear, Multi-Horizon)     (Datasets/test_data.csv)
```
- In Phase 1, the Next.js frontend is initialized as an independent, typed application.
- In subsequent phases, a FastAPI microservice will wrap the Python inference engine, providing typed contracts for multi-horizon forecasts and evaluation comparisons.
