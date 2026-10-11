# TrafficPulse AI — Smart-City Traffic Intelligence Platform

TrafficPulse AI is a predictive traffic forecasting and congestion intelligence platform designed to forecast corridor traffic volume across 15, 30, and 60-minute lookahead horizons, compare forecasts against observed telemetry, and identify rush-hour patterns.

---

## 📌 Project Status: Phase 1 (Foundation & ML Audit)

This repository currently implements **Phase 1** of a planned five-phase engineering roadmap:
- **Upstream Preservation**: Imported and preserved the complete Python ML codebase, trained model binaries, datasets, reports, and legacy Streamlit dashboard from the upstream project.
- **Git LFS Recovery**: Audited and restored all serialized model weights from Git LFS (Random Forest Regressor 38.2 MB, Random Forest Classifier 18.4 MB, SVM 2.24 MB).
- **Comprehensive ML Audit**: Documented in [`docs/PHASE_1_AUDIT.md`](docs/PHASE_1_AUDIT.md), detailing architecture, 43-feature schema, scikit-learn version drift, and data leakage risks.
- **Future Architecture & API Contract**: Specified in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), proposing typed contracts for the upcoming FastAPI microservice.
- **Modern Next.js 16+ Frontend Shell**: Built with Next.js App Router, React 19, TypeScript (strict mode), Tailwind CSS, Lucide icons, and Recharts.

---

## 🏛️ Upstream Attribution & Provenance

- **Original Upstream Project**: [Elly-su/traffic-congestion-prediction](https://github.com/Elly-su/traffic-congestion-prediction)
- **Original Upstream Commit SHA**: `312aa5206090e41c759665a322fa7812d12d5aec`
- **License / Terms**: Created for educational purposes.
- **Dataset Inspiration**: UCI Machine Learning Repository — *Metro Interstate Traffic Volume Dataset* (Minneapolis I-94).
- **Weather Source**: Open-Meteo Historical Weather API (CC BY 4.0).

### ⚠️ Data Provenance Disclosure & Limitations
The traffic observations in this project were **programmatically generated to replicate UCI Interstate Traffic Volume patterns** via `src/data_collection.py`. They represent a single aggregate highway corridor cross-section (Minneapolis I-94) and **MUST NOT be characterized as live highway sensor data or citywide GPS tracking**.

Reported model accuracies (e.g. Random Forest test $R^2 = 0.9465$, MAE = 341.77 veh/h) reflect performance on the synthetic test benchmark and remain upstream-reported figures until verified on real-world telemetry in later phases.

---

## 🗂️ Project Structure

```text
TrafficPulse-AI/
├── docs/
│   ├── PHASE_1_AUDIT.md         # Comprehensive audit of upstream ML pipeline & models
│   └── ARCHITECTURE.md          # Future Next.js → FastAPI target architecture & API schemas
├── frontend/                    # Modern Next.js 16+ TypeScript frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx       # Root dark-navy theme & shell layout
│   │   │   ├── page.tsx         # Overview dashboard
│   │   │   ├── traffic-forecast/    # Multi-horizon forecast view & scenario controls
│   │   │   ├── congestion-map/      # Corridor sensor topology view & GIS roadmap
│   │   │   ├── historical-analysis/ # 2-year diurnal, weather, & holiday analytics
│   │   │   ├── model-performance/   # Model registry, feature importance & audit findings
│   │   │   └── data-sources/        # Ingestion provenance & source status board
│   │   ├── components/
│   │   │   ├── charts/          # Recharts visualizations (Forecast, Heatmap, RushHour)
│   │   │   ├── dashboard/       # Overview dashboard composite component
│   │   │   ├── layout/          # Sidebar, Header, Shell
│   │   │   └── ui/              # MetricCard, StatusBadge
│   │   ├── lib/                 # Formatting utils & synthetic benchmark fixtures
│   │   └── types/               # TypeScript domain contracts
│   ├── package.json
│   └── tsconfig.json
├── Datasets/                    # Raw & processed CSV dataset splits (17,520 rows)
├── data/processed/              # Processed CSVs and preprocessor.pkl
├── models/                      # Serialized ML models (Random Forest, Linear, SVM, etc.)
├── src/                         # Original Python pipeline modules
│   ├── data_collection.py
│   ├── data_preprocessing.py
│   ├── exploratory_analysis.py
│   ├── model_training.py
│   ├── model_evaluation.py
│   └── utils.py
├── app.py                       # Reference legacy Streamlit application
├── dashboard_utils.py           # Feature transformer & inference helpers
├── requirements.txt             # Python dependencies
└── REPORT.md                    # Original upstream research report
```

---

## 🚀 Getting Started

### 1. Modern Next.js Frontend (Recommended)

#### Prerequisites
- Node.js `v20+`
- npm `v10+`

#### Installation & Launch
```powershell
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the TrafficPulse AI dashboard.

#### Verification Commands
```powershell
cd frontend
npm run lint         # Zero ESLint warnings / errors
npx tsc --noEmit     # Strict TypeScript type check
npm run build        # Production build verification
```

---

### 2. Legacy Streamlit Application (Reference)

The original Streamlit interface is preserved in place for reference and exploratory analysis:

#### Prerequisites
- Python `3.10`–`3.12` recommended (due to scikit-learn 1.7.2 pickle compatibility)

#### Installation & Launch
```powershell
# In project root
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
streamlit run app.py
```

The Streamlit app will start at [http://localhost:8501](http://localhost:8501).

---

## 🔍 Current Capabilities vs. Unimplemented Features

| Capability | Status | Implementation Details |
|---|---|---|
| Preserved ML Pipeline & Data Assets | ✅ Completed | All upstream assets intact; Git LFS binaries recovered |
| Codebase & ML Audit | ✅ Completed | Documented in `docs/PHASE_1_AUDIT.md` |
| System Architecture & API Contract | ✅ Completed | Documented in `docs/ARCHITECTURE.md` |
| Next.js Frontend Shell & Responsive UI | ✅ Completed | Dark navy theme, App Router, TypeScript, 6 page routes |
| Multi-Horizon Forecast Visualizer | ✅ Completed | 15m, 30m, 60m horizon controls with confidence bounds |
| Diurnal Heatmap & Rush Hour Breakdown | ✅ Completed | 24-hour congestion pattern analysis |
| Model Performance & Benchmark Registry | ✅ Completed | Evaluates all 8 models against test benchmark |
| Live Traffic / Sensor Ingestion | ⏳ Planned Phase 3 | Not yet implemented; unconfigured status displayed |
| Headless FastAPI Prediction Backend | ⏳ Planned Phase 2 | Proposed in `docs/ARCHITECTURE.md` |
| Automated SHAP Explainability | ⏳ Planned Phase 4 | Feature importances audited; SHAP planned for Phase 4 |
| Road-Level GIS Map Meshes | ⏳ Planned Phase 3 | Corridor topology visualized without fabricated street meshes |

---

## 🗺️ Five-Phase Development Roadmap

```
Phase 1: Repository Transfer, ML Audit & Next.js Foundation   [COMPLETE]
Phase 2: FastAPI Prediction Service & Multi-Horizon Serving    [NEXT]
Phase 3: Live Data Ingestion (DOT 511 & Open-Meteo Telemetry)
Phase 4: Advanced Modeling, Walk-Forward CV & SHAP Insights
Phase 5: Production Containerization, CI/CD & Cloud Deployment
```
