// FROZEN frontend schemas. Do not rename, remove, or repurpose fields.

export const frontendMissionSchema = {
  mission_id: "",
  status: "",

  video: {
    filename: "",
    resolution: "",
    fps: 0,
    duration_seconds: 0,
    size_mb: 0,
  },

  sensors: {
    gnss: false,
    imu: false,
    barometer: false,
    gimbal: false,
    attitude: false,
    rtk_ppk: false,
  },

  coordinate_system: {
    epsg: null,
    vertical_datum: "",
  },
};

const emptyStage = { status: "", progress: 0, elapsed_seconds: 0 };

export const frontendProcessingSchema = {
  status: "",
  current_stage: null,
  overall_progress: 0,
  elapsed_seconds: 0,
  estimated_remaining_seconds: null,

  stages: {
    M0: { ...emptyStage },
    M1: { ...emptyStage },
    M2: { ...emptyStage },
    M3: { ...emptyStage },
    M4: { ...emptyStage },
    M5: { ...emptyStage },
    M6: { ...emptyStage },
    M7: { ...emptyStage },
  },

  frames_total: 0,
  frames_processed: 0,
  keyframes_selected: 0,
};

export const frontendReconstructionSchema = {};

export const frontendProductsSchema = {};

export const frontendQASchema = {
  accuracy: {
    relative_m: null,
    ce90_m: null,
    le90_m: null,
    target_m: 1.0,
  },

  coverage: {
    reconstructed_percent: 0,
    observed_percent: 0,
    inferred_percent: 0,
    uncovered_percent: 0,
  },

  warnings: [],

  gnss: {
    residuals_url: "",
    dropout_intervals: [],
    time_offset_seconds: null,
  },

  provenance: {
    pipeline_version: "",
    mission_id: "",
    input_file_hashes: [],
  },
};

export const frontendMissionStateSchema = {
  mission: frontendMissionSchema,
  processing: frontendProcessingSchema,
  reconstruction: frontendReconstructionSchema,
  products: frontendProductsSchema,
  qa: frontendQASchema,
};

// Canonical pipeline stage ordering and display names (M0 -> M7).
export const PIPELINE_STAGES = [
  { id: "M0", name: "Ingest & Time Sync" },
  { id: "M1", name: "Frame Curation" },
  { id: "M2", name: "Perception" },
  { id: "M3", name: "Visual Tracking" },
  { id: "M4", name: "Metric Factor Graph" },
  { id: "M5", name: "Dense Reconstruction" },
  { id: "M6", name: "Product Builder" },
  { id: "M7", name: "QA & Trust" },
];

export const SENSOR_FIELDS = [
  { key: "gnss", label: "GNSS" },
  { key: "imu", label: "IMU" },
  { key: "barometer", label: "Barometer" },
  { key: "gimbal", label: "Gimbal" },
  { key: "attitude", label: "Attitude" },
  { key: "rtk_ppk", label: "RTK / PPK" },
];
