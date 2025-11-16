export const title = "Debug Page - Microgrid Foundry";

import { PageProps } from "fresh";

export default function DebugPage(props: PageProps) {
  // Access control: only show if ENABLE_DEBUG_PAGE is not explicitly set to "false"
  const enableDebug = Deno.env.get("ENABLE_DEBUG_PAGE");
  if (enableDebug === "false") {
    return new Response("Not Found", { status: 404 });
  }

  // Detect environment
  const isProduction = Deno.env.get("DENO_DEPLOY") === "true";
  const environmentBadge = isProduction
    ? "🚀 PRODUCTION"
    : "💻 DEVELOPMENT";
  const badgeClasses = isProduction
    ? "px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-300"
    : "px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-300";

  // Runtime versions
  const versions = {
    "Deno Runtime": Deno.version.deno,
    "V8 Engine": Deno.version.v8,
    "TypeScript": Deno.version.typescript,
  };

  // Dependencies from deno.json
  const dependencies = {
    "Fresh": "jsr:@fresh/core@2.1.4",
    "Preact": "npm:preact@^10.27.0",
    "@preact/signals": "npm:@preact/signals@^2.2.1",
    "Tailwind CSS": "npm:tailwindcss@^4.1.10",
    "@fresh/plugin-tailwind": "jsr:@fresh/plugin-tailwind@1.0.0",
    "@tailwindcss/postcss": "npm:@tailwindcss/postcss@^4.1.10",
    "PostCSS": "npm:postcss@^8.5.6",
    "@std/dotenv": "jsr:@std/dotenv@^0.225.0",
    "@std/http": "jsr:@std/http@^1.0.0",
  };

  // Tailwind configuration
  const tailwindConfig = {
    "Version": "4.1.10+",
    "Content Paths": "{routes,islands,components}/**/*.{ts,tsx}",
    "Custom Colors - Primary": "#3b82f6 (blue-500), #2563eb (blue-600), #1d4ed8 (blue-700)",
    "Custom Colors - Accent": "#10b981 (green-500), #059669 (green-600)",
    "Plugins": "none",
  };

  // Deno Deploy environment variables
  const denoDeployVars = {
    "DENO_DEPLOY": Deno.env.get("DENO_DEPLOY") || "not set",
    "DENO_DEPLOYMENT_ID": Deno.env.get("DENO_DEPLOYMENT_ID") || "not set",
    "DENO_DEPLOY_ORG_SLUG": Deno.env.get("DENO_DEPLOY_ORG_SLUG") || "not set",
    "DENO_DEPLOY_APP_SLUG": Deno.env.get("DENO_DEPLOY_APP_SLUG") || "not set",
    "DENO_REGION": Deno.env.get("DENO_REGION") || "not set",
    "CI": Deno.env.get("CI") || "not set",
  };

  // All environment variables (masked for security)
  const allEnvVars: Record<string, string> = {};
  for (const [key, value] of Object.entries(Deno.env.toObject())) {
    // Mask all values for security
    allEnvVars[key] = value ? "*** (set)" : "not set";
  }

  // Sort alphabetically
  const sortedEnvVars = Object.entries(allEnvVars).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div class="max-w-6xl mx-auto">
        {/* Header with back link */}
        <div class="mb-8">
          <a
            href="/"
            class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            ← Back to Home
          </a>

          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 class="text-4xl font-bold text-gray-900">Debug Information</h1>
            <span class={badgeClasses}>
              {environmentBadge}
            </span>
          </div>
        </div>

        {/* Runtime Versions Section */}
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Runtime & Versions</h2>
          <div class="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
            <table class="w-full">
              <tbody>
                {Object.entries(versions).map(([key, value], idx) => (
                  <tr class={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td class="py-3 px-4 font-semibold text-gray-700 w-1/3">
                      {key}
                    </td>
                    <td class="py-3 px-4 font-mono text-sm text-gray-600">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Dependencies Section */}
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            Dependencies
            <span class="text-sm font-normal text-gray-600 ml-2">
              (from deno.json imports)
            </span>
          </h2>
          <div class="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
            <table class="w-full">
              <thead class="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th class="py-3 px-4 text-left font-semibold text-gray-700 text-sm w-1/3">
                    Package
                  </th>
                  <th class="py-3 px-4 text-left font-semibold text-gray-700 text-sm">
                    Version / Source
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(dependencies).map(([key, value], idx) => (
                  <tr class={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td class="py-3 px-4 font-semibold text-gray-700">
                      {key}
                    </td>
                    <td class="py-3 px-4 font-mono text-xs text-gray-600 break-all">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tailwind Configuration Section */}
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            Tailwind CSS Configuration
          </h2>
          <div class="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
            <table class="w-full">
              <tbody>
                {Object.entries(tailwindConfig).map(([key, value], idx) => (
                  <tr class={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td class="py-3 px-4 font-semibold text-gray-700 w-1/3">
                      {key}
                    </td>
                    <td class="py-3 px-4 font-mono text-xs text-gray-600">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Color Swatches */}
          <div class="mt-4 bg-white rounded-lg shadow-md border border-slate-200 p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Custom Theme Colors</h3>
            <div class="space-y-3">
              <div>
                <p class="text-sm font-semibold text-gray-700 mb-2">Primary (Blues)</p>
                <div class="flex gap-2 flex-wrap">
                  <div class="flex items-center">
                    <div class="w-12 h-12 bg-primary-50 border border-gray-300 rounded"></div>
                    <span class="ml-2 text-xs font-mono text-gray-600">50</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-12 h-12 bg-primary-100 border border-gray-300 rounded"></div>
                    <span class="ml-2 text-xs font-mono text-gray-600">100</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-12 h-12 bg-primary-500 border border-gray-300 rounded"></div>
                    <span class="ml-2 text-xs font-mono text-gray-600">500</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-12 h-12 bg-primary-600 border border-gray-300 rounded"></div>
                    <span class="ml-2 text-xs font-mono text-gray-600">600</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-12 h-12 bg-primary-700 border border-gray-300 rounded"></div>
                    <span class="ml-2 text-xs font-mono text-gray-600">700</span>
                  </div>
                </div>
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-700 mb-2">Accent (Greens)</p>
                <div class="flex gap-2 flex-wrap">
                  <div class="flex items-center">
                    <div class="w-12 h-12 bg-accent-500 border border-gray-300 rounded"></div>
                    <span class="ml-2 text-xs font-mono text-gray-600">500</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-12 h-12 bg-accent-600 border border-gray-300 rounded"></div>
                    <span class="ml-2 text-xs font-mono text-gray-600">600</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Deno Deploy Environment Section */}
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Deno Deploy Environment</h2>
          <div class="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
            <table class="w-full">
              <tbody>
                {Object.entries(denoDeployVars).map(([key, value], idx) => (
                  <tr class={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td class="py-3 px-4 font-mono text-xs text-gray-700 w-1/3 break-all">
                      {key}
                    </td>
                    <td class="py-3 px-4 font-mono text-xs text-gray-600 break-all">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* All Environment Variables Section */}
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            Environment Variables
            <span class="text-sm font-normal text-gray-600 ml-2">
              ({sortedEnvVars.length} total, values masked)
            </span>
          </h2>
          <div class="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th class="py-3 px-4 text-left font-semibold text-gray-700 text-sm">
                      Variable Name
                    </th>
                    <th class="py-3 px-4 text-left font-semibold text-gray-700 text-sm">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedEnvVars.map(([key, value], idx) => (
                    <tr class={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td class="py-2 px-4 font-mono text-xs text-gray-700 break-all">
                        {key}
                      </td>
                      <td class="py-2 px-4 font-mono text-xs text-gray-600">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer class="text-center text-sm text-gray-600 mt-12 pb-4">
          <p>Microgrid Foundry Debug Page</p>
          <p class="text-xs text-gray-500 mt-1">
            Generated at {new Date().toISOString()}
          </p>
        </footer>
      </div>
    </div>
  );
}
