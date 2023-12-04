"use client";
// import dat from "dat.gui";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import wait from "waait";

const YoungHee = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [cube, setCube] = useState<any>();
  const [camera, setCamera] = useState<THREE.PerspectiveCamera>();
  const [myMaterial, setMyMaterial] = useState<any>();
  const [mixer, setMixer] = useState<any>();  

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    setCamera(camera);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current?? new HTMLCanvasElement(),
        antialias: true,
        alpha: true,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.toneMappingExposure = 1;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setClearColor(0xffffff, 1);
    // renderer.setSize(500, 500);

    //================================================================================================
    //격자, 편의 도구

 

    // const axesHelper = new THREE.AxesHelper(5);
    // scene.add(axesHelper);

    // let gridHelper = new THREE.GridHelper(100, 100);
    // scene.add(gridHelper);

    // let gui = new dat.GUI();
    // // gui.add(camera.position, "y", -5, 5, 0.01).name("mesh.y 이동");
    // gui
    //   .add(camera.position, "y")
    //   .min(-5)
    //   .max(5)
    //   .step(0.01)
    //   .name("카메라.y 이동");
    // gui
    //   .add(camera.position, "x")
    //   .min(-5)
    //   .max(5)
    //   .step(0.01)
    //   .name("카메라.x 이동");


    //================================================================================================

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // renderer.setSize(500, 500);

    // 아래가 마우스 스크롤이나 클릭 후 돌리기
    // const controls = new OrbitControls(camera, renderer.domElement);

    const loader = new GLTFLoader();

    const geometry = new THREE.PlaneGeometry(120,60,1,1);
    //material을 투명으로
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });

    const ground = new THREE.TextureLoader().load('/youngHee/ground.jpg');
    const material = new THREE.MeshStandardMaterial({ map:ground, side: THREE.DoubleSide, roughness: 0.5, metalness: 0.5});
    setMyMaterial(material)
    const plane = new THREE.Mesh( geometry, material );
    plane.rotation.x = Math.PI * -0.49;
    plane.position.y = -4.7;
    plane.position.z = 0;
    scene.add( plane );
    plane.receiveShadow = true;

    // const planeGeometry = new THREE.PlaneGeometry(20, 20, 1, 1)
    // const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, side: THREE.DoubleSide, roughness: 0.5, metalness: 0.5 })
    // const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    // plane.receiveShadow = true
    // plane.rotation.x = -0.5 * Math.PI
    // plane.position.y = -0.2
    // scene.add(plane)
    
    //================================================================================================
    //광원
    // var ambientLight = new THREE.AmbientLight(0x404040);
    // scene.add(ambientLight);
    
    const color =0xe0e0e0;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    //light의 위치와 target의 위치를 지정한다
    light.position.set(15, 30, 20);
    light.castShadow = true
    
    scene.add(light);
    scene.add(light.target);
    
    light.shadow.camera.top = 30;
    light.shadow.camera.right = 100;
    light.shadow.camera.bottom = -100;
    light.shadow.camera.left = -100;
    light.shadow.radius = 1

    // light.shadow.mapSize.width = 256;
    // light.shadow.mapSize.height = 256;
    // light.shadow.camera.near = 1;
    // light.shadow.camera.far = 500;
    
    
    // const light = new THREE.DirectionalLight(0xffffff, 100);
    // // scene.add(cube);
    // scene.add(light);

    const bgTexture = new THREE.TextureLoader().load(
      "/youngHee/squid_game.png"
    );
    scene.background = bgTexture
    
    // scene.background = new THREE.Color('green');

    // window.addEventListener("resize", onResize, false);

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }

    camera.position.z = 35;
    camera.position.y = -0;

    // const myRobot;

    // loader.load("/penguin.gltf", (object) => {
    //   var texture = new THREE.TextureLoader().load(
    //     "./02_TEXTURE_MAP_penguin/Penguin_Albedo.png",
    //     function (texture) {
    //       // 텍스처를 모델에 적용
    //       object.scene.traverse(function (child) {
    //         if (child instanceof THREE.Mesh) {
    //           child.material.map = texture;
    //         }
    //       });
    //     }
    //   );
    
    loader.load("/youngHee/youngHee.glb", (object) => {
      object.scene.scale.set(1, 1, 1);
      scene.add(object.scene);

      // 그림자 생성
      object.scene.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      // renderer.render(scene, camera);
      setCube(object.scene);

      //애니메이션
      const mixer = new THREE.AnimationMixer(object.scene);
      const clips = object.animations;
      // alert(JSON.stringify(clips));
      const clip = THREE.AnimationClip.findByName(
        clips,
        "squidGameDoll_01_rambut_squidGameDoll_01_MAT_0Action"
      );
      // alert(clip);
      const action = mixer.clipAction(clip);
      action.play();
      setMixer(mixer);
    });



    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    animate();
  }, [canvasRef]);

  useEffect(() => {
    if(canvasRef.current){
        canvasRef.current.addEventListener('mousedown', turn);
        canvasRef.current.addEventListener('mouseup', turnFront);
        // canvasRef.current.addEventListener('mouseleave', exitPaint);
    }

    return () => {
        if(canvasRef.current){
      // Unmount 시 이벤트 리스터 제거
            canvasRef.current.removeEventListener('mousedown', turn);
            canvasRef.current.removeEventListener('mouseup', turnFront);
            // canvasRef.current.removeEventListener('mouseleave', exitPaint);
            };
        }
    }, [turn, turnFront]);


    // eslint-disable-next-line react-hooks/exhaustive-deps
  async function turnFront() {
    for (let i = 0; i < 20; i++) {
      await wait(3);
      mixer?.update(1/30);
    }
    mixer?.setTime(0);
    myMaterial?.color.setHex(0x6bff54);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function turn() {
    const clock = new THREE.Clock();
    for (let i = 0; i < 18; i++) {
      await wait(3);
      mixer?.update(1/30);
      myMaterial?.color.setHex(0xff545a);
    }
  }


  // async function turnFront() {
  //   console.log("turnFront");
  //   for (let i = 0; i < 32; i++) {
  //     await wait(3);
  //     setCube(cube?.rotateY(Math.PI / 32));

  //     //   setCamera(camera?.rotateY(Math.PI / 10));
  //   }
  //   // myScene.background = new THREE.Color('green');
  // }

  // async function turn() {
  //   console.log('turn')
  //   for (let i = 0; i < 32; i++) {
  //     await wait(3);
  //     setCube(cube?.rotateY(Math.PI / 32));

  //     //   setCamera(camera?.rotateY(Math.PI / 10));
  //   }
  //   // myScene.background = new THREE.Color('red');
  // }

  return (<>
      <canvas ref={canvasRef} id="canvas" width={window.innerWidth} height={window.innerHeight}></canvas>
      {/* <button onClick={() => turnFront()}>Click me</button> */}
      <style jsx>{`
        #canvas {
            width: 100vw;
            height: 100vh;
            display: block;
            background: url("/youngHee/squid_game.png") no-repeat center center;
            background-size: cover;
        }
      `}</style>
      </>
  );
};

export default YoungHee;