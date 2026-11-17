import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-32 text-center sm:px-6">
      <p className="label text-cobalt">404</p>
      <h1 className="display mt-4 text-5xl md:text-7xl">Lost the crowd.</h1>
      <p className="mt-4 max-w-sm text-ink-2">
        This page doesn&rsquo;t exist — or it sold out and left no forwarding address.
      </p>
      <Link href="/" className="btn btn-ink mt-8">
        Back to the noise
      </Link>
    </div>
  );
}
