"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex justify-between">
      <button>
        <Link href={{ pathname: `/meeting/${123}` }}>Enter room</Link>
      </button>
    </main>
  );
}
