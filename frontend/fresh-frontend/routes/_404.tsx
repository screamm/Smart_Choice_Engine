import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Smart Choice</title>
      </Head>
      <div class="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div class="text-center">
          <div class="text-8xl font-mono font-light text-zinc-700 mb-4">404</div>
          <h1 class="text-2xl font-mono uppercase tracking-wider text-zinc-400 mb-4">
            PAGE NOT FOUND
          </h1>
          <p class="text-zinc-500 font-mono text-sm mb-8">
            THE REQUESTED RESOURCE DOES NOT EXIST
          </p>
          <a 
            href="/" 
            class="px-6 py-3 bg-zinc-800 border border-zinc-700 text-zinc-100 font-mono text-sm hover:border-emerald-400 hover:text-emerald-400 transition-all duration-200"
          >
            RETURN TO DASHBOARD
          </a>
        </div>
      </div>
    </>
  );
}
