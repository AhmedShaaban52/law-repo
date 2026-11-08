"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Scene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // ---------- Text reveal animations ----------
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
    });

    // ---------- Three.js scene ----------
    const canvas = canvasRef.current;
    if (!canvas) return () => ctx.revert();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
    } catch (e) {
      console.error("WebGL unavailable", e);
      return () => ctx.revert();
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0.4, 11);

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const key = new THREE.DirectionalLight(0xfff0cf, 4);
    key.position.set(4, 6, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xc9a24b, 3);
    rim.position.set(-5, 2, -3);
    scene.add(rim);

    const gold = new THREE.MeshStandardMaterial({
      color: 0xc9a24b,
      metalness: 0.9,
      roughness: 0.3,
    });
    const dark = new THREE.MeshStandardMaterial({
      color: 0x2a2418,
      metalness: 0.6,
      roughness: 0.5,
    });
    const bowlMat = gold.clone();
    bowlMat.side = THREE.DoubleSide;

    const mesh = (
      g: THREE.BufferGeometry,
      m: THREE.Material,
      x = 0,
      y = 0,
      z = 0,
    ) => {
      const o = new THREE.Mesh(g, m);
      o.position.set(x, y, z);
      return o;
    };

    const rig = new THREE.Group();
    scene.add(rig);

    // base + column
    rig.add(
      mesh(new THREE.CylinderGeometry(1.5, 1.8, 0.3, 48), dark, 0, -3.2, 0),
    );
    rig.add(
      mesh(new THREE.CylinderGeometry(1.0, 1.3, 0.25, 48), gold, 0, -2.95, 0),
    );
    rig.add(
      mesh(new THREE.CylinderGeometry(0.12, 0.2, 5.2, 32), gold, 0, -0.3, 0),
    );
    rig.add(mesh(new THREE.SphereGeometry(0.28, 32, 32), gold, 0, 2.35, 0));

    // beam
    const beam = new THREE.Group();
    beam.position.y = 2.3;
    rig.add(beam);
    const bar = mesh(new THREE.CylinderGeometry(0.07, 0.07, 6, 24), gold);
    bar.rotation.z = Math.PI / 2;
    beam.add(bar);
    [-3, 3].forEach((x) =>
      beam.add(mesh(new THREE.SphereGeometry(0.14, 24, 24), gold, x, 0, 0)),
    );
    beam.add(
      mesh(new THREE.TorusGeometry(0.4, 0.04, 16, 48), gold, 0, 0.55, 0),
    );

    // pans
    const pans: THREE.Group[] = [];
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 12; i++) {
      const a = (i / 12) * (Math.PI / 2);
      pts.push(new THREE.Vector2(Math.sin(a) * 1.25, -Math.cos(a) * 0.4 + 0.4));
    }
    const bowl = new THREE.LatheGeometry(pts, 48);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xc9a24b });
    [-3, 3].forEach((x) => {
      const g = new THREE.Group();
      g.position.set(x, 0, 0);
      beam.add(g);
      g.add(mesh(bowl, bowlMat, 0, -2.6, 0));
      for (let k = 0; k < 3; k++) {
        const a = (k / 3) * Math.PI * 2;
        const geo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(Math.cos(a) * 1.2, -2.2, Math.sin(a) * 1.2),
        ]);
        g.add(new THREE.Line(geo, lineMat));
      }
      pans.push(g);
    });

    // gold dust particles
    const N = 420;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const dust = new THREE.Points(
      pg,
      new THREE.PointsMaterial({
        color: 0xc9a24b,
        size: 0.05,
        transparent: true,
        opacity: 0.7,
      }),
    );
    scene.add(dust);

    const isSmall = () => window.innerWidth < 700;
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = w < 700 ? 15 : 11;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    let mx = 0;
    let my = 0;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove);

    const state = { p: 0 };
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      onUpdate: (s) => {
        state.p = s.progress;
      },
    });

    const clock = new THREE.Clock();
    let cur = 0;
    let raf = 0;
    const tick = () => {
      const t = clock.getElapsedTime();
      cur += (state.p - cur) * 0.06;
      const p = cur;
      rig.rotation.y = p * Math.PI * 2 + mx * 0.5;
      rig.rotation.x = my * 0.12;
      rig.position.x = isSmall() ? 0 : Math.sin(p * Math.PI * 2) * -2.6;
      rig.position.y = (isSmall() ? 1.2 : 0) + Math.sin(t * 0.8) * 0.08;
      const s = isSmall() ? 0.62 : 1;
      rig.scale.setScalar(s * (1 + Math.sin(p * Math.PI) * 0.12));
      const ang = Math.sin(p * Math.PI * 3 + t * 0.5) * 0.14;
      beam.rotation.z = ang;
      pans.forEach((g) => {
        g.rotation.z = -ang;
      });
      dust.rotation.y = t * 0.02 + p * 1.5;
      dust.position.y = p * 2;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    // ---------- Cleanup ----------
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      st.kill();
      ctx.revert();
      pg.dispose();
      bowl.dispose();
      [gold, dark, bowlMat, lineMat].forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, []);

  return <canvas id="c" ref={canvasRef} />;
}
