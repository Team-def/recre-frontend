/* eslint-disable react-hooks/exhaustive-deps */
"use client";
// import dat from "dat.gui";
import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  CSS2DObject,
  CSS2DRenderer,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

import wait from "waait";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import CancelIcon from "@mui/icons-material/Cancel";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

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
  leaveGame,
  stopGame,
}: {
  socket: Socket;
  length: number;
  go: boolean;
  setGo: React.Dispatch<React.SetStateAction<boolean>>;
  isStart: boolean;
  leaveGame: () => void;
  stopGame: () => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mixers, setMixers] = useState<THREE.AnimationMixer[]>();
  const [playerInfo, setPlayerInfo] = useState<playerInfo[]>();
  const [currentAliveNum, setCurrentAliveNum] = useState<number>(0);
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const labelRenderer = useRef<CSS2DRenderer>(new CSS2DRenderer());
  const playerMap = useRef(new Map<string, Player>());
  const myCamera = useRef<THREE.PerspectiveCamera>();
  const animationId = useRef<number>(0);
  const isRed = useRef<boolean>(false);
  const lightList = useRef<THREE.DirectionalLight[]>([]);
  const useRefScene = useRef<THREE.Scene>();
  const finishCountText = useRef<THREE.Mesh>();
  const finishCountTextBack = useRef<THREE.Mesh>();
  const aliveNumRef = useRef<number>(0);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const actions = [
    { icon: <CancelIcon />, name: "우승자 마감", onclick: stopGame },
    { icon: <ExitToAppIcon />, name: "게임 나가기", onclick: leaveGame },
    { icon: <CameraAltIcon />, name: "카메라-항공", onclick: cameraMove4 },
    { icon: <CameraAltIcon />, name: "카메라-측면", onclick: cameraMove3 },
    { icon: <CameraAltIcon />, name: "카메라-후면", onclick: cameraMove2 },
    { icon: <CameraAltIcon />, name: "카메라-정면", onclick: cameraMove1 },
  ];

  class Player {
    plyerId: number;
    name: string;
    position: number;
    isAlive: number;
    mixer: THREE.AnimationMixer;
    object: GLTF;
    deadCnt: number = 0;
    constructor(plyerId: number, name: string, position: number) {
      this.plyerId = plyerId;
      this.name = name;
      this.position = position;
      this.isAlive = 0;
      this.mixer = undefined as any;
      this.object = undefined as any;
    }
  }

  // 스페이바 스코를 이벤트 비활성화
  const handleSpacebarPress = (event: {
    code: string;
    preventDefault: () => void;
  }) => {
    // 스페이스바 눌림 이벤트 처리
    if (event.code === "Space") {
      event.preventDefault(); // 스크롤 기본 동작 막기
      // 추가로 필요한 로직을 여기에 추가할 수 있습니다.
    }
  };

  function onWindowResize(this: Window, ev: UIEvent) {
    if (myCamera.current) {
      myCamera.current.aspect = window.innerWidth / window.innerHeight;
      myCamera.current.updateProjectionMatrix();
    }
    if (rendererRef.current) {
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      rendererRef.current.render(
        useRefScene.current as THREE.Scene,
        myCamera.current as THREE.Camera
      );
    }
    labelRenderer.current.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.current.render(
      useRefScene.current as THREE.Scene,
      myCamera.current as THREE.Camera
    );
  }

  useEffect(() => {
    // 스페이바 스코를 이벤트 비활성화
    window.addEventListener("keydown", handleSpacebarPress);
    window.addEventListener("resize", onWindowResize);
    const scene = new THREE.Scene();
    // setScene(scene);
    useRefScene.current = scene;
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 20, 70);
    myCamera.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current ?? new HTMLCanvasElement(),
      antialias: true,
      alpha: true,
    });
    rendererRef.current = renderer;
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

    // 라벨 렌더러 설정
    labelRenderer.current.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.current.domElement.style.position = "absolute";
    labelRenderer.current.domElement.style.top = "0px";
    document.body.appendChild(labelRenderer.current.domElement);

    //================================================================================================
    // 폰트 로드

    // const fontLoader = new FontLoader();

    // fontLoader.load("Hakgyoansim Bombanghak R_Regular.json", (font) => {
    //   let textGeometry = new TextGeometry("무궁화 꽃이 0", {
    //     font: font,
    //     size: 5,
    //     height: 0.2,
    //     curveSegments: 12,
    //     bevelEnabled: true,
    //     bevelThickness: 0.1,
    //     bevelSize: 0.02,
    //     bevelOffset: 0,
    //     bevelSegments: 5,
    //   });
    //   const textMaterial = new THREE.MeshStandardMaterial({
    //     color: 0x437185,
    //   });
    //   const text = new THREE.Mesh(textGeometry, textMaterial);
    //   text.geometry.center();
    //   text.castShadow = true;
    //   text.position.set(0, 30, -100);
    //   // text.rotateY(Math.PI);
    //   scene.add(text);
    //   finishCountText.current = textGeometry;
    // });

    // const font = fontLoader.parse(
    //   require("three/examples/fonts/droid/droid_sans_bold.typeface.json")
    // );
    // const textGeometry = new TextGeometry(winNum.toString(), {
    //   font: font,
    //   size: 10,
    //   height: 0.2,
    //   curveSegments: 12,
    //   bevelEnabled: true,
    //   bevelThickness: 0.1,
    //   bevelSize: 0.02,
    //   bevelOffset: 0,
    //   bevelSegments: 5,
    // });
    // const textMaterial = new THREE.MeshStandardMaterial({
    //   color: 0xdd2222,
    // });
    // let text = new THREE.Mesh(textGeometry, textMaterial);
    // text.geometry.center();
    // text.castShadow = true;
    // text.position.set(0, 50, -100);
    // // text.rotateY(Math.PI);
    // scene.add(text);
    // finishCountText.current = textGeometry;

    //================================================================================================
    // 격자, 편의 도구

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

    // 아래가 마우스 스크롤이나 클릭 후 돌리기
    // const controls = new OrbitControls(camera, renderer.domElement);

    //================================================================================================
    // 게임 필드 오브잭트 생성
    const loader = new GLTFLoader();
    loader.load("/playground.glb", (object) => {
      object.scene.scale.set(1, 1, 1);
      object.scene.rotateY(Math.PI);
      object.scene.position.set(0, -3.8, 100);
      scene.add(object.scene);

      //그림자 생성, 바깥에서 벽면 투명화
      object.scene.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.receiveShadow = true;
          const material = child.material;
          if (material instanceof THREE.MeshStandardMaterial) {
            // Set to Single Faced
            material.side = THREE.BackSide;
          }
        }
      });
    });

    // 결승선
    const touchdownGeometry = new THREE.BoxGeometry(250, 10, 5);
    const touchdownMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const touchdown = new THREE.Mesh(touchdownGeometry, touchdownMaterial);
    touchdown.position.set(0, -3.8, -80);
    scene.add(touchdown);

    //================================================================================================
    //광원

    var ambientLight = new THREE.AmbientLight(0x606060, 0.1); // 색상 지정
    scene.add(ambientLight);

    const color = 0xe0e0e0;
    const intensity = 2.2;
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

    // 광원 방향표시 헬퍼
    // var directionalLightHelper = new THREE.DirectionalLightHelper(light1, 5);

    // var directionalLightHelper2 = new THREE.DirectionalLightHelper(light2, 5);

    // var directionalLightHelper3 = new THREE.DirectionalLightHelper(light3, 5);

    // scene.add(directionalLightHelper);
    // scene.add(directionalLightHelper2);
    // scene.add(directionalLightHelper3);

    lightList.current.push(light1);
    lightList.current.push(light2);
    lightList.current.push(light3);

    //================================================================================================
    // 배경색
    const bgTexture = new THREE.Color(0x437185);
    scene.background = bgTexture;

    //================================================================================================
    // 고정 오브젝트 렌더링

    loader.load("/semo.glb", (object) => {
      object.scene.scale.set(40, 40, 40);
      object.scene.position.set(23, 2.5, -115);
      scene.add(object.scene);

      // 그림자 생성
      object.scene.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      const semo_1 = object.scene.clone();
      semo_1.position.set(-17, 2.5, -115);
      scene.add(semo_1);

      const semo_2 = object.scene.clone();
      semo_2.position.set(43, 2.5, -115);
      scene.add(semo_2);

      const semo_3 = object.scene.clone();
      semo_3.position.set(-37, 2.5, -115);
      scene.add(semo_3);
    });

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

      //애니메이션
      const mixer = new THREE.AnimationMixer(object.scene);
      const clips = object.animations;
      const clip = THREE.AnimationClip.findByName(
        clips,
        "squidGameDoll_01_rambut_squidGameDoll_01_MAT_0Action"
      );
      // alert(clip);
      const action = mixer.clipAction(clip);
      action.play();
      setMixers([mixer]);
    });

    //================================================================================================
    function animate() {
      // wait(1000);
      // console.log(
      //   myCamera.current?.position.x,
      //   myCamera.current?.position.y,
      //   myCamera.current?.position.z
      // );
      // console.log("실행중");

      animationId.current = requestAnimationFrame(animate);

      // if (finishCountText.current) finishCountText.current.rotateY(0.01);

      playerMap.current.forEach((player: Player) => {
        const object: GLTF = player.object;
        const mixer: THREE.AnimationMixer = player.mixer;
        if (!object || !mixer) return;
        if (object.scene.position.z < -90) {
          return;
        } else {
          if (player.position < object.scene.position.z) {
            //오징어 이동 속도 조절
            object.scene.position.z -= 0.6;
          }
          if (player.isAlive === 0) {
            // 오징어 애니메이션 속도 조절
            mixer.update(1 / 30);
          } else if (player.isAlive === 1) {
            mixer.setTime(0);
            player.deadCnt++;
            if (player.deadCnt === 30) {
              player.isAlive = 2;
            } else {
              object.scene.rotateX(Math.PI / 2 / 30);
              object.scene.position.y -= 0.1;
            }
          } else {
          }
        }
      });

      renderer.render(scene, camera);
      labelRenderer.current.render(scene, camera);
    }

    animate();
  }, [canvasRef]);

  useEffect(() => {
    socket.on("pre_player_status", (res) => {
      if (res.pre_player_info) {
        let players = res.pre_player_info;
        setPlayerInfo(players);

        aliveNumRef.current = players.length;
        setCurrentAliveNum(aliveNumRef.current);
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
            if (player)
              if (curPlayer && curPlayer.isAlive === 0) curPlayer.isAlive = 1;
          }
        });
      }
    });

    socket.on("touchdown", (res) => {
      aliveNumRef.current--;
      setCurrentAliveNum(aliveNumRef.current);
    });

    socket.on("youdie", (res) => {
      aliveNumRef.current--;
      setCurrentAliveNum(aliveNumRef.current);
    });

    return () => {
      //애니메이션 프레임 제거
      cancelAnimationFrame(animationId.current);

      //애니메이션 제거
      mixers?.forEach((mixer) => {
        mixer.stopAllAction();
      });
      setMixers([]);

      //플레이어 제거
      playerMap.current.forEach((player: Player) => {
        player.object.scene.clear();
        if (useRefScene.current) {
          useRefScene.current.remove(player.object.scene);
        }
      });
      playerMap.current.clear();
      setPlayerInfo([]);

      //빛 제거
      lightList.current.forEach((light) => {
        if (useRefScene.current) {
          useRefScene.current.remove(light);
        }
      });
      lightList.current = [];

      //카메라 제거
      myCamera.current = undefined as any;

      //3D 렌더러 제거
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      //씬 제거
      useRefScene.current?.clear();
      useRefScene.current = undefined as any;
      window.location.reload();
    };
  }, []);

  useEffect(() => {
    let count = 0;
    if (!playerInfo) return;
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
      object.scene.scale.set(1.6, 1.6, 1.6);
      const player = new Player(count, name, distance + 40);
      // setPlayerList([...playerList, player]);
      playerMap.current.set(id, player);

      if (count % 2 === 0) {
        object.scene.position.set(-count * 2, -0.5, 40);
      } else {
        object.scene.position.set(count * 2, -0.5, 40);
      }
      if (useRefScene.current) {
        useRefScene.current.add(object.scene);
      }
      object.scene.rotateY(Math.PI);

      // 플레이어 이름
      const div = document.createElement("div");

      div.className = "squidlabel";
      div.style.color = "black";
      div.style.width = "100px";
      div.style.height = "30px";
      div.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
      div.style.borderRadius = "5px";
      div.style.padding = "5px";
      div.style.textAlign = "center";
      div.style.color = "black";
      div.style.fontSize = "20px";
      div.style.textShadow = "1px 1px 1px rgb(0,0,0,0.5)";
      div.textContent = name;

      const label = new CSS2DObject(div);
      label.position.set(0, 4.5, 0);
      object.scene.add(label);

      //그림자 생성
      object.scene.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      //애니메이션
      const mixer = new THREE.AnimationMixer(object.scene);
      const clips = object.animations;
      const clip = THREE.AnimationClip.findByName(clips, "BlooperAction");
      const action = mixer.clipAction(clip);
      action.play();

      player.mixer = mixer;
      player.object = object;
    });
  }

  useEffect(() => {
    labelRenderer.current.domElement.addEventListener("mousedown", turnBack);
    labelRenderer.current.domElement.addEventListener("mouseup", turnFront);

    return () => {
      // Unmount 시 이벤트 리스터 제거
      labelRenderer.current.domElement.removeEventListener(
        "mousedown",
        turnBack
      );
      labelRenderer.current.domElement.removeEventListener(
        "mouseup",
        turnFront
      );
    };
  }, [turnBack, turnFront]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function turnFront() {
    if (!mixers) return;

    for (let i = 0; i < 20; i++) {
      await wait(3);
      mixers[0].update(1 / 30);
    }
    mixers[0].setTime(0);
    lightList.current.forEach((light) => {
      light.color.setHex(0xe0e0e0);
    });
    setGo(true);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function turnBack() {
    if (!mixers) return;
    for (let i = 0; i < 18; i++) {
      await wait(3);
      mixers[0].update(1 / 30);
      lightList.current.forEach((light) => {
        light.color.setHex(0xff545a);
      });
      setGo(false);
    }
    mixers[0].setTime(18 / 30);
  }

  //오징어가 달림
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
          access_token: localStorage.getItem("access_token") ?? ("" as string),
          result: go,
        });
      } else {
        socket.emit("stop", {
          access_token: localStorage.getItem("access_token") ?? ("" as string),
          result: go,
        });
      }
    }
  }, [go]);

  // currentWinNum이 바뀔 때마다 실행
  useEffect(() => {
    console.log(currentAliveNum);
    if (finishCountText.current) {
      useRefScene.current?.remove(finishCountText.current);
      finishCountText.current.clear();
    }
    const fontLoader = new FontLoader();
    const font = fontLoader.parse(
      require("three/examples/fonts/droid/droid_sans_bold.typeface.json")
    );
    const textGeometry = new TextGeometry(currentAliveNum.toString(), {
      font: font,
      size: 10,
      height: 1,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });
    const textMaterial = new THREE.MeshStandardMaterial({
      color: 0xdd2222,
    });
    let text = new THREE.Mesh(textGeometry, textMaterial);
    text.geometry.center();
    text.castShadow = true;
    text.position.set(0, 50, -100);
    useRefScene.current?.add(text);
    finishCountText.current = text;

    if (finishCountTextBack.current) {
      useRefScene.current?.remove(finishCountTextBack.current);
      finishCountTextBack.current.clear();
    }
    const backText = text.clone();
    backText.geometry.scale(1.4, 1.4, 1.4);
    finishCountTextBack.current = backText;
    backText.position.set(0, 50, 160);
    backText.rotateY(Math.PI);
    useRefScene.current?.add(backText);
  }, [currentAliveNum]);

  useEffect(() => {
    function handleKeyDown(event: { key: any }) {
      const { key } = event;
      // 키보드 이벤트 처리 로직 작성

      var moveDistance = 2;

      var orbitSpeed = Math.PI / 180; // 회전 속도 (1도)

      // 현재 카메라의 전진 방향 벡터를 얻습니다.
      var cameraDirection = new THREE.Vector3(0, 0, -1);
      if (!myCamera.current) return;
      myCamera.current.getWorldDirection(cameraDirection);

      // 이동 벡터를 초기화합니다.
      var moveVector = new THREE.Vector3(0, 0, 0);

      // console.log(key);
      switch (key) {
        case "1":
          cameraMove1();
          return;
        case "2":
          cameraMove2();
          return;
        case "3":
          cameraMove3();
          return;
        case "4":
          cameraMove4();
          return;
        case "0":
          stopGame();
          return;
        case "a":
          moveVector.add(
            cameraDirection
              .clone()
              .applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2)
          );
          break;
        case "s":
          moveVector.add(cameraDirection.clone().negate());
          break;
        case "d":
          moveVector.add(
            cameraDirection
              .clone()
              .applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2)
          );
          break;
        case "w":
          moveVector.add(cameraDirection.clone());

          break;
        case "q":
          // var euler = new THREE.Euler(
          //   myCamera.current.rotation.x,
          //   myCamera.current.rotation.y + orbitSpeed,
          //   myCamera.current.rotation.z,
          //   "YZX"
          // );
          // myCamera.current.rotation.set(euler.x, euler.y, euler.z);
          var axis = new THREE.Vector3(0, 1, 0); // Y 축을 기준으로 회전
          var quaternion = new THREE.Quaternion().setFromAxisAngle(
            axis,
            orbitSpeed
          );
          myCamera.current.quaternion.multiply(quaternion);
          break;
        case "e":
          // var euler = new THREE.Euler(
          //   myCamera.current.rotation.x,
          //   myCamera.current.rotation.y - orbitSpeed,
          //   myCamera.current.rotation.z,
          //   "YZX"
          // );
          // myCamera.current.rotation.set(euler.x, euler.y, euler.z);
          var axis = new THREE.Vector3(0, 1, 0); // Y 축을 기준으로 회전
          var quaternion = new THREE.Quaternion().setFromAxisAngle(
            axis,
            -orbitSpeed
          );
          myCamera.current.quaternion.multiply(quaternion);
          break;
        case " ":
          if (!isRed.current) {
            turnBack();
            isRed.current = true;
          }
          break;

        default:
          console.log("다른 키 눌림");
          break;
      }
      // var newCameraPosition = myCamera.current.position.clone().add(moveVector);
      // myCamera.current.lookAt(newCameraPosition);
      moveVector.setY(0);
      moveVector.normalize().multiplyScalar(moveDistance);
      myCamera.current.position.add(moveVector);
    }

    function handleKeyUp(event: { key: any }) {
      const { key } = event;
      switch (key) {
        case " ":
          isRed.current = false;
          turnFront();
          break;
        default:
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [turnBack, turnFront]); // 의존성 배열이 비어있으므로 컴포넌트가 로드될 때에만 실행됩니다.

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

  async function cameraMove4() {
    myCamera.current?.position.set(0, 173, -20);
    myCamera.current?.rotation.set(0, 0, 0);
    myCamera.current?.lookAt(0, 0, -20);
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        id="canvas"
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
      <Box sx={{ height: 330, flexGrow: 1, zIndex: 100 }}>
        <Backdrop open={open} />
        <SpeedDial
          ariaLabel="SpeedDial tooltip example"
          sx={{ position: "absolute", bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen
              onClick={() => action.onclick()}
            />
          ))}
        </SpeedDial>
      </Box>
      <style jsx>{`
        body {
          overflow: hidden;
        }
        #canvas {
          width: 100vw;
          height: 100vh;
          display: block;
          background-color: #437185;
        }
      `}</style>
    </>
  );
};

export default YoungHee;
