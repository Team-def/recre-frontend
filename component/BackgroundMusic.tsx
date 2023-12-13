import { useEffect } from 'react';
import { Howl } from 'howler';

const BackgroundMusic = () => {
  useEffect(() => {
    const sound = new Howl({
      src: ['/CatchMind1.mp3'], // mp3 파일의 경로를 public 폴더 기준으로 설정
      loop: true, // 반복 재생 설정
      volume: 0.5, // 볼륨 설정 (0.0에서 1.0 사이의 값)
    });
    // 컴포넌트가 마운트될 때 배경음악 재생 시작
    sound.play();
    // 컴포넌트가 언마운트될 때 배경음악 정지
    return () => {
      sound.stop();
    };
  }, []);
  return null;
};

export default BackgroundMusic;