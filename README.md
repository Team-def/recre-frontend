## RecRe

- \[WHY\] 우리 모두는 관중들의 이목을 집중시키고 분위기를 환기할 수 있는 힘을 가지고 있습니다.
- \[HOW\] Team-def는 별도의 지식 없이도 웹 브라우저만으로 쉽게 레크리에이션을 진행할 수 있는 서비스를 고안하였으며,
- \[WHAT\] 최대 100명의 관중들과 온/오프라인에서 실시간으로 소통할 수 있는 서비스 RecRe를 만들었습니다.

## Screenshots

- Catch My Mind

![나만무_중간발표_최승현](https://github.com/Team-def/recre-backend/assets/18757823/087356a6-d506-4a86-94b3-c4fd178cbf31)

- Red Light, Green Light

![나만무_중간발표_최승현](https://github.com/Team-def/recre-backend/assets/18757823/884b6614-6648-4cd7-920e-9b80771537ce)

## Architectures

![image](https://github.com/Team-def/recre-backend/assets/18757823/c158d24b-fb93-453e-bdff-614b42069145)

- Backend
  - 호스트 유저 정보 관리: PostgreSQL
  - 실시간 연결: Socket.io
  - 플레이어 상태 관리: SQLite (In Memory)
  - 백엔드 업무로직: NestJS
- Frontend
  - 프레임워크: NextJS w/ ReactJS
  - 상태관리: Jotai
  - 무궁화꽃이 피었습니다 게임: Three.JS

## Build with NestJS

먼저 필요한 의존성들을 설치합니다.

```
npm i
```

다음으로 환경변수들을 `.env.development`와 `.env.production` 파일에 정의합니다. 각각 개발자 모드와 프로덕션 모드(또는 빌드) 실행시 사용할 파일입니다. 다음 변수들이 필요합니다:

```
NEXT_PUBLIC_RECRE_URL= # NextJS 서버로 이어지는 주소입니다.
NEXT_PUBLIC_BACK_API= # 백엔드 서버로 이어지는 주소입니다.
NEXT_PUBLIC_SOCKET_API= # 백엔드 서버의 웹 소켓으로 이어지는 주소입니다.
```
