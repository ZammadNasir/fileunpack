"use client";

import { ViewerError } from "@/components/viewer/ViewerError";
import { ViewerLoading } from "@/components/viewer/ViewerLoading";
import { ViewerToolbar } from "@/components/viewer/ViewerToolbar";
import type { SupportedExtension } from "@/src/lib/formats";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

type ThreeViewerProps = {
  file: File;
  extension: SupportedExtension;
};

type ModelInfo = {
  objects: number;
  triangles: number;
};

export function ThreeViewer({ file, extension }: ThreeViewerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [error, setError] = useState("");
  const [wireframe, setWireframe] = useState(false);
  const [modelInfo, setModelInfo] = useState<ModelInfo>({
    objects: 0,
    triangles: 0,
  });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let animationFrame = 0;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.setClearColor(0xf8f4ec, 1);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      host.clientWidth / host.clientHeight,
      0.01,
      100000,
    );
    camera.position.set(4, 3, 5);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    scene.add(new THREE.HemisphereLight(0xffffff, 0x7c6f64, 2.5));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);
    const grid = new THREE.GridHelper(10, 10, 0x9b8b7a, 0xd8cebf);
    grid.position.y = -0.01;
    scene.add(grid);

    const resizeObserver = new ResizeObserver(() => {
      if (!host.clientWidth || !host.clientHeight) return;
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    });
    resizeObserver.observe(host);

    async function load() {
      try {
        setStatus("loading");
        const model = await loadModel(file, extension);
        if (disposed) return;
        modelRef.current = model;
        scene.add(model);
        applyWireframe(model, false);
        const info = inspectModel(model);
        setModelInfo(info);
        fitCameraToObject(model, camera, controls);
        setStatus("ready");
      } catch {
        if (!disposed) {
          setError(
            "The file may be corrupted, incomplete, or use an unsupported variant.",
          );
          setStatus("error");
        }
      }
    }

    function animate() {
      controls.update();
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    }

    load();
    animate();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      controls.dispose();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose?.();
        const material = mesh.material;
        if (Array.isArray(material)) material.forEach((item) => item.dispose());
        else material?.dispose?.();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [file, extension]);

  useEffect(() => {
    if (modelRef.current) applyWireframe(modelRef.current, wireframe);
  }, [wireframe]);

  function resetCamera() {
    const model = modelRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (model && camera && controls) fitCameraToObject(model, camera, controls);
  }

  return (
    <div className="viewer-block">
      <div
        className="canvas-frame"
        ref={hostRef}
        aria-label="3D model preview"
      />
      {status === "loading" && <ViewerLoading />}
      {status === "error" && <ViewerError message={error} />}
      <ViewerToolbar>
        <button type="button" onClick={resetCamera}>
          Reset
        </button>
        <button type="button" onClick={resetCamera}>
          Fit
        </button>
        <label className="toggle-control">
          <input
            type="checkbox"
            checked={wireframe}
            onChange={(event) => setWireframe(event.currentTarget.checked)}
          />
          Wireframe
        </label>
      </ViewerToolbar>
      {status === "ready" && (
        <p className="viewer-note">
          {modelInfo.objects} object{modelInfo.objects === 1 ? "" : "s"} · about{" "}
          {modelInfo.triangles.toLocaleString()} triangle
          {modelInfo.triangles === 1 ? "" : "s"}
        </p>
      )}
    </div>
  );
}

async function loadModel(file: File, extension: SupportedExtension) {
  const buffer = await file.arrayBuffer();

  if (extension === "stl") {
    const geometry = new STLLoader().parse(buffer);
    geometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      color: 0xbe4f32,
      roughness: 0.6,
      metalness: 0.05,
    });
    return new THREE.Mesh(geometry, material);
  }

  if (extension === "obj") {
    const text = new TextDecoder().decode(buffer);
    const model = new OBJLoader().parse(text);
    model.traverse((object) => {
      if ((object as THREE.Mesh).isMesh) {
        (object as THREE.Mesh).material = new THREE.MeshStandardMaterial({
          color: 0xbe4f32,
          roughness: 0.72,
        });
      }
    });
    return model;
  }

  if (extension === "glb" || extension === "gltf") {
    const loader = new GLTFLoader();
    if (extension === "glb") {
      const gltf = await loader.parseAsync(buffer, "");
      return gltf.scene;
    }
    const text = new TextDecoder().decode(buffer);
    const gltf = await loader.parseAsync(text, "");
    return gltf.scene;
  }

  throw new Error("Unsupported 3D format");
}

function fitCameraToObject(
  object: THREE.Object3D,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxSize = Math.max(size.x, size.y, size.z) || 1;
  const distance = maxSize / (2 * Math.tan((camera.fov * Math.PI) / 360));
  const direction = new THREE.Vector3(1, 0.8, 1).normalize();

  camera.near = Math.max(distance / 100, 0.01);
  camera.far = Math.max(distance * 100, 1000);
  camera.position.copy(center).add(direction.multiplyScalar(distance * 1.7));
  camera.updateProjectionMatrix();
  controls.target.copy(center);
  controls.update();
}

function applyWireframe(object: THREE.Object3D, enabled: boolean) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    const material = mesh.material;
    if (!material) return;
    const materials = Array.isArray(material) ? material : [material];
    materials.forEach((item) => {
      if ("wireframe" in item) {
        (item as THREE.MeshStandardMaterial).wireframe = enabled;
        item.needsUpdate = true;
      }
    });
  });
}

function inspectModel(object: THREE.Object3D): ModelInfo {
  let objects = 0;
  let triangles = 0;
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry) return;
    objects += 1;
    const geometry = mesh.geometry as THREE.BufferGeometry;
    if (geometry.index) triangles += geometry.index.count / 3;
    else triangles += (geometry.attributes.position?.count ?? 0) / 3;
  });
  return { objects, triangles: Math.round(triangles) };
}
