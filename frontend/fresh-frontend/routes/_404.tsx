import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Smart Choice Engine</title>
      </Head>
      <div class="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-6xl font-bold text-emerald-400 mb-4">404</h1>
          <h2 class="text-2xl font-light mb-6">Page Not Found</h2>
          <p class="text-zinc-400 mb-8">
            The recommendation you're looking for doesn't exist.
          </p>
          <a 
            href="/" 
            class="inline-block px-6 py-3 bg-emerald-400 text-zinc-900 font-semibold hover:bg-emerald-300 transition-colors"
          >
            Back to Smart Choice Engine
          </a>
        </div>
      </div>
    </>
  );
}
