import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
        Welcome to Next.js 13!
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400">
        This is a simple example of a Next.js 13 application.
      </p>
      <Image
        src="/nextjs-logo.png"
        alt="Next.js Logo"
        width={200}
        height={200}
      />
    </div>
  );
}
