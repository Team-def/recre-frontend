"use client";
// import dat from "dat.gui";
import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  CSS2DObject,
  CSS2DRenderer,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

import wait from "waait";

interface playerInfo {
  uuid: string;
  name: string;
  distance: number;
  state: state;
  endtime: string;
}

enum state {
  alive = "ALIVE",
  dead = "DEAD",
  finish = "FINISH",
}

const YoungHee = ({
  socket,
  length,
  go,
  setGo,
  isStart,
}: {
  socket: Socket;
  length: number;
  go: boolean;
  setGo: React.Dispatch<React.SetStateAction<boolean>>;
  isStart: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [cube, setCube] = useState<any>();
  const [camera, setCamera] = useState<THREE.PerspectiveCamera>();
  const [myMaterial, setMyMaterial] = useState<any>();
  const [mixers, setMixers] = useState<THREE.AnimationMixer[]>();
  const [scene, setScene] = useState<THREE.Scene>();
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer>();
  const [labelRenderer, setLabelRenderer] = useState<CSS2DRenderer>(new CSS2DRenderer());
  const [playerCount, setPlayerCount] = useState<number>(0);
  const playerMap = useRef(new Map<string, Player>());
  const myCamera = useRef<THREE.PerspectiveCamera>();
  const [fieldColor, setFieldColor] = useState<string>("0xe0e0e0");
  const lightList = useRef<THREE.DirectionalLight[]>([]);
  const [playerInfo, setPlayerInfo] = useState<playerInfo[]>([
    {
      uuid: "",
      name: "",
      distance: 0,
      state: state.alive,
      endtime: "",
    },
  ]);

  class Player {
    plyerId: number;
    name: string;
    position: number;
    isAlive: number;
    constructor(plyerId: number, name: string, position: number) {
      this.plyerId = plyerId;
      this.name = name;
      this.position = position;
      this.isAlive = 0;
    }
  }

  useEffect(() => {
    const scene = new THREE.Scene();
    setScene(scene);
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 20, 70);
    myCamera.current = camera;
    setCamera(camera);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current ?? new HTMLCanvasElement(),
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
    // document.body.appendChild(renderer.domElement);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0px";
    document.body.appendChild(labelRenderer.domElement);

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

    //================================================================================================
    //바닥 오브잭트
    // const geometry = new THREE.PlaneGeometry(1000, 700, 1, 1);
    // //material을 투명으로
    // // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });

    // const ground = new THREE.TextureLoader().load("/youngHee/ground.jpg");
    // const material = new THREE.MeshStandardMaterial({
    //   map: ground,
    //   side: THREE.DoubleSide,
    //   roughness: 0.5,
    //   metalness: 0.5,
    // });
    // material.color.setHex(0x6bff54);
    // setMyMaterial(material);
    // const plane = new THREE.Mesh(geometry, material);
    // plane.rotation.x = Math.PI * -0.499;
    // plane.position.y = -4.7;
    // plane.position.z = 0;
    // scene.add(plane);
    // plane.receiveShadow = true;

    // const planeGeometry = new THREE.PlaneGeometry(20, 20, 1, 1)
    // const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, side: THREE.DoubleSide, roughness: 0.5, metalness: 0.5 })
    // const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    // plane.receiveShadow = true
    // plane.rotation.x = -0.5 * Math.PI
    // plane.position.y = -0.2
    // scene.add(plane)
    //================================================================================================

    //게임 필드
    loader.load("/playground.glb", (object) => {
      object.scene.scale.set(1, 1, 1);
      object.scene.rotateY(Math.PI);
      object.scene.position.set(0, -3.8, 100);
      scene.add(object.scene);

      //그림자 생성
      object.scene.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.receiveShadow = true;
        }
      });
    });

    //================================================================================================
    //광원

    var ambientLight = new THREE.AmbientLight(0xf0f0f0, 0.5); // 색상 지정
    scene.add(ambientLight);

    const color = 0xe0e0e0;
    const intensity = 2.5;
    const light1 = new THREE.DirectionalLight(color, intensity);
    //light의 위치와 target의 위치를 지정한다
    light1.position.set(40, 30, 40);
    light1.castShadow = true;

    scene.add(light1);
    scene.add(light1.target);

    light1.shadow.camera.top = 200;
    light1.shadow.camera.right = 200;
    light1.shadow.camera.bottom = -200;
    light1.shadow.camera.left = -200;
    light1.shadow.radius = 1;

    // light.shadow.mapSize.width = 256;
    // light.shadow.mapSize.height = 256;
    // light.shadow.camera.near = 1;
    // light.shadow.camera.far = 500;

    // const light = new THREE.DirectionalLight(0xffffff, 100);
    // // scene.add(cube);
    // scene.add(light);

    const light2 = new THREE.DirectionalLight(color, intensity);
    light2.position.set(-40, 30, 40);
    // light2.castShadow = true;
    scene.add(light2);
    scene.add(light2.target);

    const light3 = new THREE.DirectionalLight(color, intensity);
    light3.position.set(0, 30, 100);
    light3.rotateY(Math.PI);
    scene.add(light3);
    light3.target.position.set(0, 0, 140);
    scene.add(light3.target);

    // const light3 = new THREE.SpotLight(color, 100, 100, Math.PI / 10, 0);
    // light3.position.set(90, 30, -40);
    // light3.rotateY(Math.PI / 2);
    // light3.castShadow = true;
    // scene.add(light3);
    // scene.add(light3.target);

    var directionalLightHelper = new THREE.DirectionalLightHelper(light1, 5);

    var directionalLightHelper2 = new THREE.DirectionalLightHelper(light2, 5);

    var directionalLightHelper3 = new THREE.DirectionalLightHelper(light3, 5);

    // var directionalLightHelper3 = new THREE.SpotLightHelper(light3, 5);
    scene.add(directionalLightHelper);
    scene.add(directionalLightHelper2);
    scene.add(directionalLightHelper3);
    // scene.add(directionalLightHelper3);

    lightList.current.push(light1);
    lightList.current.push(light2);
    lightList.current.push(light3);

    //================================================================================================

    const bgTexture = new THREE.Color(0x000000)
    scene.background = bgTexture;

    // scene.background = new THREE.Color('green');

    window.addEventListener("resize", onResize, false);

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // camera.rotateX(Math.PI/2);

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

    //================================================================================================

    loader.load("/youngHee/youngHee.glb", (object) => {
      object.scene.scale.set(1.5, 1.5, 1.5);
      object.scene.position.set(0, 2.5, -100);
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
      setMixers([mixer]);
    });

    function animate() {
      // wait(1000);
      // console.log(myCamera.current?.position.x, myCamera.current?.position.y, myCamera.current?.position.z);

      requestAnimationFrame(animate);

      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    }

    animate();
  }, [canvasRef]);

  useEffect(() => {
    socket.on("pre_player_status", (res) => {
      if (res.pre_player_info) {
        let players = res.pre_player_info;
        setPlayerInfo(players);
      }
    });

    socket.on("players_status", (res) => {
      if (res.player_info) {
        let alived = res.player_info.filter(
          (player: playerInfo) => player.state === state.alive
        );
        alived.forEach((player: playerInfo) => {
          run(player.uuid as string, player.distance as number);
        });

        let dead = res.player_info.filter(
          (player: playerInfo) => player.state === state.dead
        );
        dead.forEach((player: playerInfo) => {
          if (playerMap.current.has(player.uuid)) {
            const curPlayer = playerMap.current.get(player.uuid);
            if (player) {
              if (curPlayer && curPlayer.isAlive === 0) curPlayer.isAlive = 1;
            }
          }
        });
        // if (myCamera.current) {
        //   // const player = res.player_info[res.player_info.length - 1];
        //   // if (player) myCamera.current.position.z = -player.distance + 70;
        //   // console.log("aaaaaa", player.distance, myCamera.current.position.z);
        // }
      }
    });
  }, []);

  useEffect(() => {
    // alert('playerInfo')
    // console.log(playerInfo);
    let count = 0;
    playerInfo.forEach((player: playerInfo) => {
      count++;
      addPlayer(count, player.uuid, player.name, player.distance);
    });
  }, [playerInfo]);

  async function addPlayer(
    count: number,
    id: string,
    name: string,
    distance: number
  ) {
    const loader = new GLTFLoader();

    loader.load("/blooper.glb", (object) => {
      object.scene.scale.set(1.3, 1.3, 1.3);
      const player = new Player(count, name, distance + 40);
      // setPlayerList([...playerList, player]);
      playerMap.current.set(id, player);

      // console.log(playerList.length);

      setPlayerCount((prev) => prev + 1);
      if (count % 2 === 0) {
        object.scene.position.set(-count * 1.3, -0.5, 40);
      } else {
        object.scene.position.set(count * 1.3, -0.5, 40);
      }
      scene?.add(object.scene);
      object.scene.rotateY(Math.PI);

      // 플레이어 이름
      const div = document.createElement("div");
      div.className = "label";
      div.textContent = name;
      div.setAttribute("ref", "labelRef");
      const label = new CSS2DObject(div);
      label.position.set(0, 1, 0);
      object.scene.add(label);

      //그림자 생성
      object.scene.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      setCube(object.scene);

      //애니메이션
      const mixer = new THREE.AnimationMixer(object.scene);
      const clips = object.animations;
      const clip = THREE.AnimationClip.findByName(clips, "BlooperAction");
      const action = mixer.clipAction(clip);
      action.play();
      let deadCnt = 0;

      async function animate() {
        // await wait(1000);
        const playerNum: number = requestAnimationFrame(animate);

        if (object.scene.position.z < -90) {
          // scene?.remove(object.scene);
          cancelAnimationFrame(playerNum);
          return;
        } else {
          // console.log(playerList.length);
          // if (playerList.length === 0) return;
          // alert(playerList.length)
          // console.log(player.position, object.scene.position.z)
          if (player.position < object.scene.position.z) {
            //오징어 이동 속도 조절
            object.scene.position.z -= 0.6;
          }
          // 오징어 애니메이션 속도 조절
          if (player.isAlive === 0) {
            mixer.update(1 / 30);
          } else if (player.isAlive === 1) {
            mixer.setTime(0);
            deadCnt++;
            if (deadCnt === 30) {
              player.isAlive = 2;
            } else {
              object.scene.rotateX(Math.PI / 2 / 30);
              object.scene.position.y -= 0.1;
            }
          } else {
          }
          // if(camera)
          //   camera.position.z -= 0.1;
        }

        if (scene && camera && renderer) {
          if (object.scene.position.z + 40 > camera?.position.z)
            camera.position.z -= 0.4;
          renderer.render(scene, camera);
          labelRenderer.render(scene, camera);
        }
      }
      animate();
    });
  }

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.addEventListener("mousedown", turn);
      canvasRef.current.addEventListener("mouseup", turnFront);
      // canvasRef.current.addEventListener('mouseleave', exitPaint);
      labelRef.current.addEventListener("mousedown", turn);
      labelRef.current.addEventListener("mouseup", turnFront);
    }

    return () => {
      if (canvasRef.current) {
        // Unmount 시 이벤트 리스터 제거
        canvasRef.current.removeEventListener("mousedown", turn);
        canvasRef.current.removeEventListener("mouseup", turnFront);
        // canvasRef.current.removeEventListener('mouseleave', exitPaint);
        labelRef.current.removeEventListener("mousedown", turn);
        labelRef.current.removeEventListener("mouseup", turnFront);
      }
    };
  }, [turn, turnFront]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function turnFront() {
    if (!mixers) return;

    for (let i = 0; i < 20; i++) {
      await wait(3);
      mixers[0].update(1 / 30);
    }
    mixers[0].setTime(0);
    myMaterial?.color.setHex(0x6bff54);
    lightList.current.forEach((light) => {
      light.color.setHex(0xe0e0e0);
    });
    setGo(true);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function turn() {
    if (!mixers) return;
    for (let i = 0; i < 18; i++) {
      await wait(3);
      mixers[0].update(1 / 30);
      myMaterial?.color.setHex(0xff545a);
      lightList.current.forEach((light) => {
        light.color.setHex(0xff545a);
      });
      setGo(false);
    }
    mixers[0].setTime(18 / 30);
  }

  //1번 오징어가 달림
  async function run(playerId: string, distance: number) {
    // console.log(playerMap.current.size);
    let moveDistance = (120 / length) * distance;
    if (playerMap.current.has(playerId)) {
      // Add your code here
      const player = playerMap.current.get(playerId);
      if (player) {
        player.position = -moveDistance + 40;
      }
    }
  }

  useEffect(() => {
    if (isStart) {
      if (go) {
        socket.emit("resume", {
          result: go,
        });
      } else {
        socket.emit("stop", {
          result: go,
        });
      }
    }
  }, [go]);

  async function test() {
    socket.emit("pre_player_status", {});
  }

  async function cameraMove1() {
    myCamera.current?.position.set(0, 20, 70);
    myCamera.current?.lookAt(0, 20, 0);
  }

  async function cameraMove2() {
    myCamera.current?.position.set(7.4, 18.4, -107.12);
    myCamera.current?.lookAt(0, 0, 0);
  }

  async function cameraMove3() {
    myCamera.current?.position.set(-112, 35, -3);
    myCamera.current?.lookAt(0, 0, 0);
  }

  async function cameraMove4() {}

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

  return (
    <>
      <canvas
        ref={canvasRef}
        id="canvas"
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
      <div>
        <button onClick={cameraMove1}>camera1</button>
        <button onClick={cameraMove2}>camera2</button>
        <button onClick={cameraMove3}>camera3</button>
      </div>
      <style jsx>{`
        #canvas {
          z-index: 50;
          width: 100vw;
          height: 100vh;
          display: block;
          background-color: transparent;
        }
      `}</style>
    </>
  );
};

export default YoungHee;
