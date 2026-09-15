// Bundle entry for the vendored graph libraries. Built by `npm run vendor`
// into graph.iife.min.js: a single self-contained script exposing
// window.AICD = { ForceGraph3D, THREE } with exactly one copy of three.js
// (the previous UMD setup shipped two copies and warned about it).
import ForceGraph3D from "3d-force-graph";
import * as THREE from "three";

export { ForceGraph3D, THREE };
