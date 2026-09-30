// Synthetic demonstration data for UI development only.
// These are NOT measured mission results.

const stage = (elapsed_seconds) => ({
  status: "completed",
  progress: 100,
  elapsed_seconds,
});

export const mockMissionState = {
  mission: {
    mission_id: "VIRRS-2026-001",
    status: "completed",

    video: {
      filename: "mission_001.mp4",
      resolution: "4K",
      fps: 30,
      duration_seconds: 600,
      size_mb: 2150,
    },

    sensors: {
      gnss: true,
      imu: true,
      barometer: true,
      gimbal: true,
      attitude: true,
      rtk_ppk: true,
    },

    coordinate_system: {
      epsg: 32643,
      vertical_datum: "WGS84",
    },
  },

  processing: {
    status: "completed",
    current_stage: "M7",
    overall_progress: 100,
    elapsed_seconds: 804,
    estimated_remaining_seconds: 0,

    stages: {
      M0: stage(42),
      M1: stage(78),
      M2: stage(131),
      M3: stage(146),
      M4: stage(97),
      M5: stage(238),
      M6: stage(51),
      M7: stage(21),
    },

    frames_total: 18000,
    frames_processed: 18000,
    keyframes_selected: 1250,
  },

  reconstruction: {},
  products: {},

  qa: {
    accuracy: {
      relative_m: 0.42,
      ce90_m: 0.63,
      le90_m: 0.71,
      target_m: 1.0,
    },

    coverage: {
      reconstructed_percent: 94.2,
      observed_percent: 88.5,
      inferred_percent: 5.7,
      uncovered_percent: 5.8,
    },

    warnings: [],

    gnss: {
      residuals_url: "",
      dropout_intervals: [],
      time_offset_seconds: 0.012,
    },

    provenance: {
      pipeline_version: "v0.1.0",
      mission_id: "VIRRS-2026-001",
      input_file_hashes: [],
    },
  },
};

export const DEMO_MISSION_ID = "VIRRS-2026-001";
