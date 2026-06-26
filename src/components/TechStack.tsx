import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

const textureLoader = new THREE.TextureLoader();
const staticImages = [
  "/images/react2.webp",
  "/images/mongo.webp",
  "/images/mysql.webp",
  "/images/typescript.webp",
  "/images/javascript.webp",
];
const webpTextures = staticImages.map((url) => textureLoader.load(url));

function createTextTexture(text: string, bgColor: string, textColor: string = "#ffffff"): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#0b080c";
    ctx.fillRect(0, 0, 128, 128);

    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.arc(64, 64, 55, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.font = "bold 20px Geist, Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (text.length > 8) {
      ctx.font = "bold 14px Geist, Outfit, sans-serif";
    }
    if (text.length > 12) {
      ctx.font = "bold 10px Geist, Outfit, sans-serif";
    }
    ctx.fillText(text, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);

const spheres = [...Array(18)].map(() => ({
  scale: [0.7, 1, 0.8, 1, 1][Math.floor(Math.random() * 5)],
}));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshStandardMaterial;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    api.current?.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const threshold = document
        .getElementById("work")!
        .getBoundingClientRect().top;
      setIsActive(scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const materials = useMemo(() => {
    const canvasTextures = [
      createTextTexture("Vue.js", "#41B883"),
      createTextTexture("Angular", "#DD0031"),
      createTextTexture("Python", "#3776AB"),
      createTextTexture("Java", "#007396"),
      createTextTexture("AWS", "#FF9900", "#000000"),
      createTextTexture("Azure", "#0089D6"),
      createTextTexture("GCP", "#4285F4"),
      createTextTexture("Linux", "#333333"),
      createTextTexture("CI/CD", "#1E293B"),
      createTextTexture("IaC", "#7B1FA2"),
      createTextTexture("HTML5", "#E34F26"),
      createTextTexture("CSS3", "#1572B6"),
    ];

    const allTextures = [...webpTextures, ...canvasTextures];

    return allTextures.map(
      (texture) =>
        new THREE.MeshStandardMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.1,
          metalness: 0.1,
          roughness: 0.9,
        })
    );
  }, []);

  return (
    <div className="techstack">
      <h2> My Techstack</h2>

      <Canvas
        dpr={[1, 1]}
        gl={{ alpha: true, stencil: false, depth: true, antialias: false }}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        className="tech-canvas"
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[0, 5, -4]} intensity={1.5} />
        <Physics gravity={[0, 0, 0]} timeStep="vary">
          <Pointer isActive={isActive} />
          {spheres.map((props, i) => (
            <SphereGeo
              key={i}
              {...props}
              material={materials[i % materials.length]}
              isActive={isActive}
            />
          ))}
        </Physics>
        <Environment
          files="/models/char_enviorment.hdr"
          environmentIntensity={0.5}
        />
      </Canvas>
    </div>
  );
};

export default TechStack;
