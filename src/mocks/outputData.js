// Synthetic output inventory for UI development only.
// These are demonstration records and are not actual generated mission files.

export const demoProducts = [
  { id: 'pc-las', product: 'Point Cloud', format: 'LAS 1.4', size: '1.2 GB', status: 'completed', description: 'Classified georeferenced point cloud' },
  { id: 'pc-ply', product: 'Point Cloud', format: 'PLY', size: '980 MB', status: 'completed', description: 'Portable point cloud' },
  { id: 'mesh-glb', product: '3D Model (Textured)', format: 'GLB', size: '450 MB', status: 'completed', description: 'Web-ready textured mesh' },
  { id: 'mesh-obj', product: 'Mesh', format: 'OBJ', size: '520 MB', status: 'completed', description: 'Textured mesh with material package' },
  { id: 'dsm', product: 'DSM (Elevation)', format: 'GeoTIFF', size: '380 MB', status: 'completed', description: 'Digital surface model' },
  { id: 'dtm', product: 'DTM (Ground)', format: 'GeoTIFF', size: '360 MB', status: 'completed', description: 'Digital terrain model' },
  { id: 'ortho', product: 'Orthomosaic', format: 'GeoTIFF', size: '420 MB', status: 'completed', description: 'True orthomosaic' },
  { id: 'trajectory', product: 'Trajectory', format: 'GeoJSON', size: '5 MB', status: 'completed', description: 'Georeferenced UAV trajectory' },
  { id: 'report', product: 'Accuracy Report', format: 'PDF', size: '12 MB', status: 'completed', description: 'Accuracy, QA and provenance report' },
];

export const demoQa = {
  warnings: [
    { severity: 'warning', message: 'East facade partially occluded' },
    { severity: 'warning', message: 'GNSS dropout detected (12 sec)' },
    { severity: 'ok', message: 'Time synchronization within tolerance' },
  ],
  gnssResiduals: {
    rms: '0.38 m',
    max: '0.92 m',
    samples: 1284,
  },
  timing: {
    timeOffset: '0.012 s',
    totalProcessing: '13m 24s',
  },
};
