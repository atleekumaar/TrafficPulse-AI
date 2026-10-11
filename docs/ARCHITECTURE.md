# TrafficPulse AI — Future System Architecture & API Integration Contract

**Document Status**: Proposal & Contract Specification (Phase 1 Foundation)  
**System**: TrafficPulse AI  
**Scope**: Target Architecture, Subsystem Boundaries, Data Contracts, and Evaluation Schemas  

---

## 1. System Architecture Overview

TrafficPulse AI is structured into decoupled layers, separating the high-performance TypeScript web client from the machine learning forecasting service:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Next.js 15+ Frontend (Client Layer)                   │
│         React 19 / App Router / TypeScript / Tailwind / Recharts        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON REST
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   FastAPI Backend Gateway (Service Layer)              │
│       Pydantic v2 Schemas / CORS Middleware / OpenAPI Documentation     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ In-Process Python Async Invocation
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 Forecasting Engine & Feature Pipeline                  │
│       Feature Transformation / Temporal Lags / Rolling Statistics       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
┌───────────────────────────────────┐ ┌───────────────────────────────────┐
│     Validated Model Registry      │ │   Historical Benchmark Pipeline   │
│ Random Forest, Linear, Multi-Step │ │  Synthesized UCI Corridor Bench   │
└───────────────────────────────────┘ └───────────────────────────────────┘
```

---

## 2. Subsystem Boundaries & Responsibilities

### 2.1 Next.js 15+ Frontend (`frontend/`)
- Renders the responsive operator dashboard.
- Manages state for forecast horizons (15, 30, 60 minutes), scenario simulation controls, and view modes.
- Visualizes actual vs. predicted volume trends, rush-hour peak distributions, and model performance metrics.
- Explicitly flags mock, synthetic, or disconnected states with transparent UI notices.
- Strictly decoupled from Python runtimes and model binaries.

### 2.2 FastAPI Backend Gateway (Planned Phase 2/3)
- Exposes typed REST endpoints adhering to the OpenAPI 3.1 specification.
- Validates request payloads and query parameters using Pydantic models.
- Handles error boundaries, latency tracking, and request correlation IDs.
- Caches model artifacts in memory to avoid per-request deserialization overhead.

### 2.3 Python Forecasting Service (`src/` & model runners)
- Implements the feature transformer (converting timestamp + weather conditions into the 43 model features).
- Handles multi-step recursive forecasting for 15-minute, 30-minute, and 60-minute horizons.
- Evaluates regression predictions and assigns categorical congestion ratings (`Low`, `Medium`, `High`).

---

## 3. Proposed Future API Data Contracts

> [!NOTE]
> The contracts below represent the design specifications for future phases. In Phase 1, no live backend server is deployed; the frontend displays transparent unconfigured/synthetic states.

### 3.1 Traffic Forecast Request Schema

```json
{
  "reference_timestamp": "2026-10-11T08:00:00Z",
  "horizon_minutes": 30,
  "corridor_id": "I-94-METRO-CORRIDOR",
  "weather_override": {
    "temperature_celsius": 16.5,
    "precipitation_mm": 0.0,
    "weather_main": "Clear"
  },
  "event_override": {
    "has_event": false,
    "event_type": "None",
    "expected_attendance": 0
  }
}
```

### 3.2 Typed Traffic Forecast Response Schema

```json
{
  "forecast_id": "fc-20261011-0800-30m-a8f9",
  "reference_timestamp": "2026-10-11T08:00:00Z",
  "forecast_timestamp": "2026-10-11T08:30:00Z",
  "forecast_horizon_minutes": 30,
  "predicted_traffic_volume": 4820,
  "confidence_interval": {
    "lower_bound": 4510,
    "upper_bound": 5130,
    "confidence_level": 0.95
  },
  "congestion_category": "High",
  "congestion_level_probability": {
    "low": 0.04,
    "medium": 0.18,
    "high": 0.78
  },
  "corridor_id": "I-94-METRO-CORRIDOR",
  "model_identifier": "random_forest_reg_v1.0",
  "model_version": "1.0.0",
  "data_provenance": "synthetic_uci_benchmark",
  "prediction_generated_at": "2026-10-11T08:00:01.214Z",
  "inference_latency_ms": 14.2
}
```

### 3.3 Observation Comparison & Evaluation Record Schema

Used for model evaluation, historical replays, and drift monitoring:

```json
{
  "record_id": "eval-20261011-0830",
  "timestamp": "2026-10-11T08:30:00Z",
  "corridor_id": "I-94-METRO-CORRIDOR",
  "forecast_horizon_minutes": 30,
  "predicted_volume": 4820,
  "actual_observed_volume": 4750,
  "absolute_error": 70,
  "percentage_error": 1.47,
  "predicted_congestion_category": "High",
  "actual_congestion_category": "High",
  "classification_match": true,
  "weather_observed": {
    "temperature_celsius": 16.2,
    "precipitation_mm": 0.0,
    "weather_main": "Clear"
  },
  "model_identifier": "random_forest_reg_v1.0",
  "data_provenance": "synthetic_uci_benchmark"
}
```

---

## 4. Geospatial Data Boundary Note

The underlying dataset models aggregate hourly vehicle volume on an interstate corridor inspired by Minneapolis I-94. **It does not contain road-network GIS layers, sub-segment GPS coordinates, or lane-level sensor topology.**

To maintain engineering integrity:
- The system will NOT fabricate fake street-level GPS coordinates.
- Map representations in the application illustrate corridor-level aggregation and sensor nodes rather than fabricated citywide street meshes.

---

## 5. Development Roadmap

| Phase | Milestone | Deliverable |
|---|---|---|
| **Phase 1 (Current)** | Foundation & Audit | Repository transfer, ML audit, architecture contract, Next.js dashboard shell |
| **Phase 2** | FastAPI Prediction Service | Headless backend, typed Pydantic endpoints, model loading, multi-horizon inference |
| **Phase 3** | Data Ingestion & Validation | Real-world API integration (Open-Meteo, DOT telemetry), drift monitoring |
| **Phase 4** | Advanced ML & Explainability | Walk-forward cross validation, multi-step direct forecasting, SHAP explainability |
| **Phase 5** | Production Hardening | Containerization, automated CI/CD, production deployment, end-to-end telemetry |
