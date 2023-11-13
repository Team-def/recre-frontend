import Image from 'next/image'

export default function Home() {
  return (
    <div>
      <Image
        src="/vercel.svg"
        alt="Picture of the author"
        width={500}
        height={500}
      />
    </div>
  )
}
