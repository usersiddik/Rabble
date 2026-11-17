import Link from "next/link";
import IntentLink from "@/components/IntentLink";
import { NoiseBars } from "@/components/Noise";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-32 text-center sm:px-6">
      <NoiseBars seed={404} count={20} aspect={0.4} className="h-6 w-14 text-terracotta" />
      <p className="label mt-6 text-terracotta">404</p>
      <h1 className="display display-xl mt-4">Lost the crowd.</h1>
      <p className="prose-editorial mt-4 max-w-sm">This page doesn&rsquo;t exist — or it sold out and left no forwarding address.</p>
      <div className="mt-8 flex gap-3">
        <IntentLink href="/" className="btn btn-carbon">
          Back to the noise
        </IntentLink>
        <Link href="/new-arrivals" className="btn btn-ghost">
          Shop Drop 01
        </Link>
      </div>
    </div>
  );
}
