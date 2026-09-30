# Exact Screenshot

Implement exactly the screenshot and nothing else

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/874f7e66-6d92-4f4d-9b0a-2b41d6921ff7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Real PLY reconstruction
The 3D Analysis point-cloud mode loads the supplied reconstruction at:
`public/data/pointcloud/sih_1.ply`.

The PLY is binary little-endian with 1,525,522 vertices and XYZ + RGBA color attributes. The viewer uses Three.js `PLYLoader`, preserves vertex colors, and recenters the cloud around its bounding-box center for rendering precision without changing inter-point distances.
