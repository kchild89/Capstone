import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome</h1>
      <p className="mb-8">Get started by logging in:</p>
      <Link
        href="/login"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Login
      </Link>
      <div className="mt-10">
        <Image src="/next.svg" alt="Next.js logo" width={180} height={38} />
      </div>
    </div>
  );
}
