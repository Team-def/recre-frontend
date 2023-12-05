"use client";
import { Caesar_Dressing } from "next/font/google";
// import dat from "dat.gui";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import { Socket } from "socket.io-client";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import wait from "waait";

interface playerInfo {
  uuid : string,
  name: string,
  distance: number,
  state: state,
  endtime: string,
}

enum state {
  alive = 'ALIVE',
  dead = 'DEAD',
  finish = 'FINISH',
}

const YoungHee = ( {socket, length, go, setGo, isStart} : {socket:Socket, length : number, go : boolean, setGo : React.Dispatch<React.SetStateAction<boolean>>, isStart : boolean}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [cube, setCube] = useState<any>();
  const [camera, setCamera] = useState<THREE.PerspectiveCamera>();
  const [myMaterial, setMyMaterial] = useState<any>();
  const [mixers, setMixers] = useState<THREE.AnimationMixer[]>();
  const [scene, setScene] = useState<THREE.Scene>();
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer>();
  const [playerCount, setPlayerCount] = useState<number>(0);
  const playerMap = useRef(new Map<string, Player>());
  const [playerInfo, setPlayerInfo] = useState<playerInfo[]>([{
    uuid : '',
    name: '',
    distance: 0,
    state: state.alive,
    endtime: '',
  }]);

  class Player {
    plyerId: number;
    name: string;
    position: number;
    constructor(plyerId: number, name: string, position: number) {
      this.plyerId = plyerId;
      this.name = name;
      this.position = position;
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
    const controls = new OrbitControls(camera, renderer.domElement);

    const loader = new GLTFLoader();

    const geometry = new THREE.PlaneGeometry(1000, 700, 1, 1);
    //material을 투명으로
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });

    const ground = new THREE.TextureLoader().load("/youngHee/ground.jpg");
    const material = new THREE.MeshStandardMaterial({
      map: ground,
      side: THREE.DoubleSide,
      roughness: 0.5,
      metalness: 0.5,
    });
    setMyMaterial(material);
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = Math.PI * -0.499;
    plane.position.y = -4.7;
    plane.position.z = 0;
    scene.add(plane);
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

    var ambientLight = new THREE.AmbientLight(0xf0f0f0); // 색상 지정
    // ambientLight.
    // scene.add(ambientLight);

    const color = 0xe0e0e0;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    //light의 위치와 target의 위치를 지정한다
    light.position.set(10, 10, 10);
    light.castShadow = true;

    scene.add(light);
    scene.add(light.target);

    light.shadow.camera.top = 200;
    light.shadow.camera.right = 500;
    light.shadow.camera.bottom = -500;
    light.shadow.camera.left = -500;
    light.shadow.radius = 1;

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
    scene.background = bgTexture;

    // scene.background = new THREE.Color('green');

    // window.addEventListener("resize", onResize, false);

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    camera.position.z = 70;
    camera.position.y = 20;
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

    loader.load("/youngHee/youngHee.glb", (object) => {
      object.scene.scale.set(1, 1, 1);
      object.scene.position.set(0, 0, -50);
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
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    animate();
  }, [canvasRef]);

  useEffect(() => { 
    
    socket.on('pre_player_status', (res) => {
      if(res.pre_player_info){
        let players = res.pre_player_info
        setPlayerInfo(players);
      }
    });

    socket.on('players_status', (res) => {
      if(res.player_info){
        let alived = res.player_info.filter((player : playerInfo) => player.state === state.alive)
        alived.forEach((player : playerInfo) => {
          run(player.uuid as string, player.distance as number)
        })
      }
    });
    
  },[]);

  useEffect(() => {
    // alert('playerInfo')
    console.log(playerInfo)
    let count = 0;
    playerInfo.forEach((player : playerInfo) => {
      count++;
      addPlayer(count,player.uuid,player.name,player.distance)
    })
  },[playerInfo]);

  async function addPlayer(count : number,id : string, name : string, distance : number) {
    const loader = new GLTFLoader();
    loader.load("/blooper.glb", (object) => {
      object.scene.scale.set(1, 1, 1);
      const player = new Player(count, name, distance + 40);
      // setPlayerList([...playerList, player]);
      playerMap.current.set(id, player);

      // console.log(playerList.length);

      setPlayerCount((prev)=>prev+1);
      if (count % 2 === 0) {
        object.scene.position.set(-count * 1, 0, 40);
      } else {
        object.scene.position.set(count * 1, 0, 40);
      }
      scene?.add(object.scene);
      object.scene.rotateY(Math.PI);

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

      async function animate() {
        // await wait(1000);
        const playerNum: number = requestAnimationFrame(animate);

        if (object.scene.position.z < -40) {
          // scene?.remove(object.scene);
          cancelAnimationFrame(playerNum);
          return;
        } else {
          // console.log(playerList.length);
          // if (playerList.length === 0) return;
          // alert(playerList.length)
          // console.log(player.position, object.scene.position.z)
          if (player.position < object.scene.position.z) {
            object.scene.position.z -= 0.1;
            mixer?.update(1 / 15);
          }
          // if(camera)
          //   camera.position.z -= 0.1;
        }

        if (scene && camera && renderer) renderer?.render(scene, camera);
      }
      animate();
    });
  }

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.addEventListener("mousedown", turn);
      canvasRef.current.addEventListener("mouseup", turnFront);
      // canvasRef.current.addEventListener('mouseleave', exitPaint);
    }

    return () => {
      if (canvasRef.current) {
        // Unmount 시 이벤트 리스터 제거
        canvasRef.current.removeEventListener("mousedown", turn);
        canvasRef.current.removeEventListener("mouseup", turnFront);
        // canvasRef.current.removeEventListener('mouseleave', exitPaint);
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
    setGo(false);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function turn() {
    if (!mixers) return;
    for (let i = 0; i < 18; i++) {
      await wait(3);
      mixers[0].update(1 / 30);
      myMaterial?.color.setHex(0xff545a);
      setGo(true);
    }
  }

  //1번 오징어가 달림
  async function run(playerId: string, distance: number) {
    console.log(playerMap.current.size);
    let moveDistance = 90 / length * distance;
    if (playerMap.current.has(playerId)) {
      // Add your code here
      const player = playerMap.current.get(playerId);
      if (player) {
        player.position = -moveDistance + 40;
      }
    }
  }

  useEffect(() => {
    if(isStart){
      if(go){
        socket.emit('resume', {
          result : go
        });
      } else {
        socket.emit('stop', {
          result : go
        });
      }
    }
  },[go])


  async function test() {
    socket.emit('pre_player_status', {
    })
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

  return (
    <>
      <canvas
        ref={canvasRef}
        id="canvas"
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
      <div>
        {/* // 버튼 가로폭 100 */}
        <button onClick={() => addPlayer(1,'','test1',0)}>오징어 생성</button>
        <button onClick={() => run('',10)}>1번</button>
        <button onClick={() => run('',10)}>2번</button>
        {/* <button onClick={() => run(2)}>3번</button> */}
        <button onClick={() => test()}>test</button>
      </div>
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
