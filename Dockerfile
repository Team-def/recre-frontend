# Base image 선택
FROM node:20-slim AS base

# 컨테이너 내부 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 앱 빌드 (React의 경우 빌드 스크립트 실행)
RUN npm run build

# 컨테이너 실행 시 Nginx 실행
EXPOSE 80
CMD [ "sh", "-c", "npm next start"]
