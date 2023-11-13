"use client";
import { useState } from "react";
import LoginModal from "../component/login_modal";

import Image from 'next/image'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      {/* 비로그인시에 보이는 메뉴 */}
      <div className='no-login'>
          <button>회원가입</button>
          <button onClick ={ openModal }>로그인</button>

          {isModalOpen && <LoginModal onClose={closeModal} />}
      </div>
      {/* 로그인시에만 보이는 문구 */}
      <div className="login">
          username님! 안녕하세요!
      </div>
      <Image
        src="/vercel.svg"
        alt="Picture of the author"
        width={500}
        height={500}
      />
    </div>
  )
}
