# RecRe

- \[WHY\] 우리 모두는 관중들의 이목을 집중시키고 분위기를 환기할 수 있는 힘을 가지고 있습니다.
- \[HOW\] Team-def는 별도의 지식 없이도 웹 브라우저만으로 쉽게 레크리에이션을 진행할 수 있는 서비스를 고안하였으며,
- \[WHAT\] 최대 100명의 관중들과 온/오프라인에서 실시간으로 소통할 수 있는 서비스 RecRe를 만들었습니다.

[지금 바로 체험해보세요!](https://treepark.shop)

[발표 및 시연영상](https://youtu.be/rO-1yWgtRfg?feature=shared)

## Screenshots

- 그림 맞추기

![delta crop](https://github.com/Team-def/recre-frontend/assets/18757823/85763a1c-68d9-4fa7-8b61-6f071158f35b)

- Red Light, Green Light

![redgreen](https://github.com/Team-def/recre-frontend/assets/18757823/d088280f-bcd4-4c8c-97d5-a7045435a5f8)

## Architectures

![최종(read_me 용)](https://github.com/Team-def/recre-frontend/assets/18757823/30481f49-b772-44fa-bdae-160b6b1fb198)

- Backend
  - 호스트 유저 정보 관리: PostgreSQL
  - 실시간 연결: Socket.io
  - 플레이어, 호스트, 게임룸 상태 관리: SQLite (In Memory)
  - 백엔드 업무로직: NestJS
- Frontend
  - 프레임워크: NextJS w/ ReactJS
  - 상태관리: Jotai
  - 캐치마인드 게임; Socket.io
  - 무궁화꽃이 피었습니다 게임: Three.JS, Socket.io

## Build With NextJS

먼저 필요한 의존성들을 설치해줍니다.

```
npm i
```

환경변수에 필요한 .env.production과 .env.development를 생성합니다. 아래는 필요한 환경변수들을 정의한 예제입니다.

```
NEXT_PUBLIC_RECRE_URL=프론트엔드 서버 URL
NEXT_PUBLIC_BACK_API=백엔드 서버 URL
NEXT_PUBLIC_SOCKET_API=웹소켓 게이트웨이 URL
```

그리고 다음 명령어를 통해 각각 개발용과 프로덕션용 모드로 실행할 수 있습니다.

```
npm run dev -- -p <port>
npm run start -- -p <port>
```

## 포스터

![최승현-RecRe-2](https://github.com/Team-def/recre-backend/assets/18757823/533ea910-79e2-47e5-9e44-edd4bfac73f8)

## Project Directory Structure

**app/**

```
app
├── catch ######################## Host page - 캐치마인드
│   └── page.tsx
├── catchAnswer ################## Host page - 캐치마인드 정답 설정하기
│   └── page.tsx
├── favicon.ico
├── gamePage ##################### Host page - 게임 실행 페이지
│   └── page.tsx
├── gameSelect ################### Host page - 게임 선택 페이지
│   └── page.tsx
├── globals.css
├── layout.tsx
├── modules ###################### 상태관리(jotai), API 관리 모듈
│   ├── answerAtom.tsx
│   ├── backApi.tsx
│   ├── catchStartAtom.tsx
│   ├── gameAtoms.tsx
│   ├── loginAtoms.tsx
│   ├── loginTryNumAtom.tsx
│   ├── popoverAtom.tsx
│   ├── redGreenAtoms.tsx
│   ├── redGreenStartAtom.tsx
│   ├── socketApi.tsx
│   ├── tokenAtoms.tsx
│   └── userInfoAtom.tsx
├── page.tsx ##################### Host page - 메인 페이지 
├── player ####################### Player page - 플레이어 페이지
│   └── page.tsx 
├── playerComponent ############## Player page - 선택한 게임에 따른 Component
│   ├── catchPlayer.tsx
│   └── redGreenPlayer.tsx
├── profile ###################### Host page - Login 한 Host의 개인정보를 관리하는 Component
│   └── profile.tsx
├── provider.tsx
├── redGreen ##################### Host page - 무궁화 꽃이 피었습니다
│   └── page.tsx
└── token ######################## Host page - token 관리
    └── page.tsx
```

**component/**

```
component ######################## 여러 Host page에서 사용되는 Component들 
├── MyModal.tsx
├── MyPopover.tsx
├── OauthButtons.tsx
├── Particle.tsx
├── QRpage.tsx
├── footer.tsx
├── header.tsx
├── oauthButtonsStyle.module.css
├── rankingBoard.tsx
├── snackBar.tsx
└── youngHee.tsx
```

## 기술적 챌린지

### 호스트와 플레이어 간 캔버스 동기화

> 호스트가 호스트 화면에서 캔버스에 그림을 그리면 플레이어의 화면에도 동시에 그림이 그려지게 하고 싶었다.

#### 첫번째 방법

처음에는 캔버스의 기능 중 하나인 그림을 이미지로 바꿔서 보내는 방법을 사용해보려 했었다.

- onmouseup 일 때 호스트의 그림을 이미지로 저장하여 canvasData에 담아 ‘draw’로 emit 하는 코드.

```tsx
useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          context.beginPath();
          // 서버에 그림 데이터 및 캔버스 정보 전송
          const canvasData = {
            data: context.getImageData(0, 0, canvas.width, canvas.height).data,
            width: canvas.width,
            height: canvas.height,
          };
          socket.emit('draw', canvasData);
        }
    }
  }, [isPainting]);
```

그러나 위와 같은 방식은 호스트가 마우스로 그림을 그리다가 마우스를 뗐을 때만 그림으로 저장되어 플레이어에게 보내지며, 플레이어는 실시간 그림이 아닌 마우스를 뗐을 때의 그림만 갱신되게 되어 실시간성이 떨어지게 된다.

#### 두번째 방법

useCallback을 사용하여 호스트가 onmousemove 일 때 실시간으로 그림의 시작 지점과 그려지는 좌표를 emit하게 하여 플레이어한테도 실시간으로 호스트의 그림이 그려지게 방법을 바꾸었다.

```tsx
const paint = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();   // drag 방지
      event.stopPropagation();  // drag 방지

      const newMousePosition = getCoordinates(event);
      if (isPainting) {
        if (mousePosition && newMousePosition) {
          drawLine(mousePosition, newMousePosition);
          setMousePosition(newMousePosition);
          socket.emit('draw', {
            room_id : userInfo.id,
            x : newMousePosition.x,
            y : newMousePosition.y,
            color : isEraser?'white':curColor,
            lineWidth : isEraser ? eraserWidth : lineWidth,
            first_x : mousePosition.x,
            first_y : mousePosition.y,
          });
        }
      } else {

      }
    },
    [isPainting, mousePosition]
  );
```

이렇게 수정하니 이전보다는 소켓의 emit 횟수는 늘었지만 이미지를 보내는게 아닌 좌표 정보면 보내는 것이므로 소켓에 큰 무리 없이 정보를 실시간으로 보낼 수 있었다.

또한 이런 방식으로 현재 100명까지 문제 없이 길지 않은 반응속도로 호스트의 그림이 플레이어의 화면에 동기화되는 것을 확인했으며 1000명까지도 문제 없이 소켓이 감당할 수 있는 것으로 보인다.

#### 고려해볼 부분

다만 네트워크 환경에서의 문제가 있을 수 있어 보인다.

예를 들어 100명의 플레이어와 1명의 호스트가 같은 와이파이 공유기에 접속하여 게임을 진행한다고 봤을 때, 그 네트워크가 과연 100명에게 무사히 그림 정보를 보낼 수 있을 지 고려해 봐야 할 것 같다.

### 핸드폰을 흔들어서 화면 속 캐릭터가 앞으로 나아가게 만드는 방법

#### 기본 원리와 문제사항
스마트폰의 웹브라우저에서 기기의 자이로센서를 통해 기기의 움직임을 확인하는 method로는 DeviceMotionEvent()가 있다. 이 method는 기기가 움직일 때, 매 순간마다 가속도를 측정하는 기능을 가지고 있다.
이를 통해서 핸드폰을 흔들때 마다 한 걸음씩 화면 속 캐릭터가 나아갈 수 있지만, 문제는 이 method는 단순히 가속도만을 0(멈춘 경우), 양의 실수(점점 빠르게 움직이는 경우), 음의 실수(점점 속도가 느려지는 경우)로 파악하기 때문에 이 method를 통해 측정한 값을 그대로 사용할 수 없다. 
기기가 크게, 빠르게 흔들리는 경우와 작게, 여리게 흔들리는 경우에 산출되는 값이 다르기 때문에 플레이어의 근력에 따라 유불리가 결정되는 게임이 되어버린다.

#### safari 13 이상 버전에서 requestPermission() 문제
여기에 더해, safari 13 이상에서는 DeviceMotionEvent() method를 통해서 기기의 움직임을 측정하기 위해 사용자로부터 requestPermission()을 통하여 자이로 센서 허가를 받을 것을 요구한다. 
게다가 이 requestPermission() method는 useEffect(() => {}, []) 같이 페이지가 로딩되었을 때 즉시 렌더링하는 방법으로는 불러올 수 없다. 반드시 사용자가 버튼을 클릭하거나, 스위치를 클릭하는 등의 활동을 통해서만 불러올 수 있다.
즉, 기기의 종류에 관계없이 실행시키기 위해선 우선 플레이어가 접속한 브라우저가 safari 13 이상인지 확인한 후, 맞다면 requestPermission()을 통하여 반드시 허가를 받아야 한다.

#### 해결한 방법
우선 접속한 player의 브라우저가 safari 13 이상 버전인지 확인한다.
DeviceMotionEvent.requestPermission() method는 유일하게 safari 13 이상 버전에서만 function으로 기능하기 때문에 이를 확인함으로써 player의 브라우저가 safari 13 이상 버전인지 확인할 수 있다.

```tsx
const isSafariOver13 = typeof window.DeviceMotionEvent.requestPermission === 'function';

const requestPermissionSafari = () => {
  //iOS
  if (isSafariOver13) {
    window.DeviceMotionEvent.requestPermission().then((permissionState) => {
      if (permissionState === 'denied') {
        //safari 브라우저를 종료하고 다시 접속하도록 안내하는 화면 필요
        alert('게임에 참여 하려면 센서 권한을 허용해주세요. Safari를 완전히 종료하고 다시 접속해주세요.');
        return;
      } else if (permissionState === 'granted') {
        window.addEventListener('devicemotion', handleDeviceMotion);
      };
    })
  //android         
  } else {
    alert('게임 참여를 위하여 모션 센서를 사용합니다.');
    window.addEventListener('devicemotion', handleDeviceMotion);
  };
}
```

이후 움직임을 측정할 때에는 다음과 같은 방법을 사용하였다.
1. 기기에 가속도가 가해졌을 때, 배열에 가속도를 기록한다.
2. 최대 3의 길이를 유지하는 가속도 기록 배열에서 가속도가 최고점에 도달했다가 감소하기 시작하는 순간을 detectPeak로 기록한다.
3. 만약 이 순간을 포착했다면 shakeCount 상태의 값을 1 늘린다.

```tsx
let accelerationData: number[] = [];
let lastAcceleration = 0;

const handleShake = () => {
  setShakeCount((prevCount) => prevCount + 1);
}

//device의 움직임을 읽어오는 함수
const handleDeviceMotion = (event: DeviceMotionEvent) => {
  const acceleration= event.acceleration;

  if (acceleration) {
    const accelerationMagnitude = (acceleration.y??0)
    const smoothedAcceleration = 0.2 * accelerationMagnitude + 0.8 * lastAcceleration;
    lastAcceleration = smoothedAcceleration;
    accelerationData.push(smoothedAcceleration);

    const maxDataLength = 3;
    if (accelerationData.length > maxDataLength) {
      accelerationData = accelerationData.slice(1);
    }

    const peakIndex = detectPeak(accelerationData);
    //음의 가속도인지 확인
    if (peakIndex !== -1) {
      handleShake();
    }
  }
};

const detectPeak = (data: number[]): number => {
  const threshold = 1.5; // Adjust this threshold based on testing

  for (let i = 1; i < data.length - 1; i++) {
    if (data[i] > data[i - 1] && data[i] > data[i + 1] && data[i] > threshold) {
      return i;
    }
  }
  return -1;
};
```

