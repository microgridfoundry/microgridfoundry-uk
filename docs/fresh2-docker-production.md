# Fresh v2 Docker Production Deployment Guide

## Key Learnings from Deploying Fresh v2 with Docker

### Overview
Fresh v2 introduces significant architectural changes compared to v1:
- New Builder API for development
- App-based architecture for main.ts  
- JSR imports instead of deno.land/x
- Simplified handler signatures
- Updated head management
- Required build step for production deployments

### Why Docker Over Buildpacks
**Use Docker, not buildpacks.** While Fly.io supports buildpack auto-detection, buildpacks frequently fail due to availability and permission issues. Docker provides:
- Reliable, repeatable deployments
- Full control over the environment
- Consistent behavior between local and production
- Better debugging when issues arise

### Migration Tool
Fresh provides an official update tool to help migrate from v1.x to v2.0:
```bash
deno run -A -r jsr:@fresh/update .
```
This tool automatically updates import mappings, dev.ts/main.ts structure, and route file imports.

## Migration from Fresh v1 to v2

### Import Mapping Changes
**Fresh v1.x:**
```json
{
  "imports": {
    "$fresh/": "https://deno.land/x/fresh@1.7.3/",
    "preact": "https://esm.sh/preact@10.22.0",
    "@preact/signals": "https://esm.sh/*@preact/signals@1.2.2"
  }
}
```

**Fresh v2:**
```json
{
  "imports": {
    "fresh": "jsr:@fresh/core@^2.0.0-alpha.58",
    "preact": "npm:preact@^10.27.0",
    "@preact/signals": "npm:@preact/signals@^2.2.1"
  }
}
```

### main.ts Structure Changes
**Fresh v1.x:**
```typescript
import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
await start(manifest, config);
```

**Fresh v2:**
```typescript
import { App, staticFiles } from "fresh";
export const app = new App();
app.use(staticFiles());
app.fsRoutes();
```

## Critical Discoveries

### 1. Fresh v2 Production Requires a Build Step
Unlike development mode, Fresh v2 in production cannot dynamically load routes using `app.fsRoutes()`. The framework needs to compile routes and assets into an optimized bundle.

**Why this matters:**
- `app.fsRoutes()` works in dev mode but returns 404s in production
- Routes must be pre-compiled for production deployment
- The build process generates optimized JavaScript files in `_fresh/`
- ESM.sh imports cause issues; use npm: imports instead

### 2. The Build Process

Fresh v2 uses a `Builder` API that:
- Compiles all routes and components
- Generates `_fresh/server.js` (not `main.js`)
- Creates optimized static assets
- Produces a fetch-based handler for `deno serve`

```bash
# Build command
deno run -A dev.ts build

# Generated files in _fresh/:
- server.js        # Main server entry point
- snapshot.js      # Route manifest
- compiled-entry.js # Client-side entry
- static/          # Optimized static assets
```

### 3. Deno Serve vs Deno Run

Fresh v2's built output is designed for `deno serve`, not `deno run`:

**Wrong approach:**
```dockerfile
CMD ["run", "-A", "main.ts"]  # Works in dev, fails in production
CMD ["run", "-A", "_fresh/server.js"]  # Gives warning about fetch handler
```

**Correct approach:**
```dockerfile
CMD ["serve", "-A", "--port=8000", "_fresh/server.js"]
```

The built server exports a fetch handler: `export default { fetch }`, which `deno serve` expects.

### 4. Working Dockerfile Pattern

```dockerfile
FROM denoland/deno:2.4.4

WORKDIR /app

# Copy source code
COPY . .

# Cache all dependencies
RUN deno cache --reload main.ts dev.ts routes/*.tsx components/*.tsx fresh.config.ts

# Build the Fresh app for production
RUN deno run -A dev.ts build

# Set port
ENV PORT=8000
EXPOSE 8000

# Run the built app with deno serve
CMD ["serve", "-A", "--port=8000", "_fresh/server.js"]
```

## Common Pitfalls and Solutions

### Problem 1: Routes Return 404 in Docker
**Cause:** `app.fsRoutes()` doesn't work in production without a build step.
**Solution:** Always run `deno run -A dev.ts build` before serving.

### Problem 2: "Module not found" Errors
**Cause:** Looking for wrong file names or not building first.
**Solution:** The build creates `_fresh/server.js`, not `main.js`.

### Problem 3: "Expected a Response instance" Errors
**Cause:** Trying to register Fresh routes manually without proper handling.
**Solution:** Use the build system; don't try to manually wire routes.

### Problem 4: Port Configuration Issues  
**Cause:** Fresh v2 has different port configuration in dev vs production, and port mismatches between Docker and application.

**Common Issues:**
- Docker exposes one port (e.g., 8000) but app listens on another
- `deno serve` defaults to 8000 if not specified
- Environment variables not being read correctly
- Fly.io expects specific port configuration

**Solution:** 
- For development: Configure port in `dev.ts` with `Builder.listen()` options
- For production: Always explicitly specify port with `--port=8000` flag in `deno serve`
- Ensure consistency across:
  - Dockerfile EXPOSE directive
  - CMD port specification  
  - fly.toml internal_port setting
  - Environment variable PORT
- Avoid configuring port in `main.ts` or `fresh.config.ts` as they're ignored in production

**Correct Configuration:**
```dockerfile
# Dockerfile
ENV PORT=8000
EXPOSE 8000
CMD ["serve", "-A", "--port=8000", "_fresh/server.js"]
```

```toml
# fly.toml
[env]
  PORT = "8000"

[http_service]
  internal_port = 8000
```

### Problem 5: Head Component Removed
**Cause:** Fresh v2 removes the `<Head>` component.
**Solution:** Use exported constants instead:
```typescript
// Fresh v1
import { Head } from "$fresh/runtime.ts";
export default function Page() {
  return (
    <>
      <Head><title>My Page</title></Head>
      <div>Content</div>
    </>
  );
}

// Fresh v2
export const title = "My Page";
export default function Page() {
  return <div>Content</div>;
}
```

### Problem 6: API Handler Signature Changes
**Cause:** Fresh v2 API handlers only accept one argument.
**Solution:**
```typescript
// Fresh v1
export const handler = (req: Request, ctx: FreshContext): Response => {
  return new Response("OK");
};

// Fresh v2
export const handler = (req: Request): Response => {
  return new Response("OK");
};
```

### Problem 7: Route Import Path Changes
**Cause:** Route files still using Fresh v1 import paths.
**Solution:**
```typescript
// Fresh v1
import { PageProps } from "$fresh/server.ts";

// Fresh v2
import { PageProps } from "fresh";
```

## Development vs Production

### Development Mode
```typescript
// dev.ts
const builder = new Builder();
await builder.listen(() => import("./main.ts"), { port, hostname });
```
- Hot reloading
- Dynamic route loading
- Runs directly from source

### Production Mode
```bash
# Build first
deno run -A dev.ts build

# Then serve
deno serve -A --port=8000 _fresh/server.js
```
- Pre-compiled routes
- Optimized assets
- No dynamic loading

## Request Logging in Production

To add request logging in Fresh v2:

```typescript
// main.ts
app.use(async (ctx) => {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] ${ctx.req.method} ${ctx.req.url}`);
  const res = await ctx.next();
  const ms = Date.now() - start;
  console.log(`[${new Date().toISOString()}] ${ctx.req.method} ${ctx.req.url} - ${res.status} ${ms}ms`);
  return res;
});
```

Note: Middleware signature changed from v1 - `next` is now `ctx.next()` and returns a Response.

## Docker Commands for Local Testing

```bash
# Build the image
docker build -t microgridfoundry-uk-test .

# Run with port mapping (8001 external -> 8000 internal)
docker run -p 8001:8000 --rm --name mgf-test microgridfoundry-uk-test

# View logs
docker logs -f mgf-test

# Stop container
docker stop mgf-test
```

## Migration Checklist

When migrating from Fresh v1 to v2:
- [ ] Update deno.json imports to Fresh v2 + npm packages
- [ ] Convert dev.ts to use Builder API
- [ ] Convert main.ts to use App pattern  
- [ ] Update fresh.config.ts imports
- [ ] Update all route file imports ($fresh/server.ts → fresh)
- [ ] Replace Head components with exported title/description constants
- [ ] Update API handler signatures (remove FreshContext parameter)
- [ ] Fix any trailing commas in JSON files
- [ ] Add workspace exclusions for conflicting package.json files
- [ ] Configure port in dev.ts with Builder.listen() options
- [ ] Add `"nodeModulesDir": "auto"` to deno.json
- [ ] Consider JSX precompile configuration for better performance
- [ ] Test all routes and API endpoints
- [ ] Verify plugins still work with Fresh v2

## Key Takeaways

1. **Always build for production** - Fresh v2 requires compilation for production deployments
2. **Use deno serve** - The built output is designed for `deno serve`, not `deno run`
3. **Correct file paths** - Build outputs to `_fresh/server.js`, not `main.js`
4. **Port configuration** - Use `--port` flag with `deno serve` in production
5. **Middleware changes** - Fresh v2 has different middleware signatures than v1
6. **Use npm: imports** - Avoid ESM.sh for better compatibility
7. **JSR packages** - Fresh v2 uses JSR for core packages instead of deno.land/x

## Fly.io Deployment

Once Docker works locally, deploying to Fly.io is straightforward:

```toml
# fly.toml
app = "microgridfoundry-uk"
primary_region = "lhr"

[build]
  dockerfile = "Dockerfile"

[env]
  PORT = "8000"

[http_service]
  internal_port = 8000
  force_https = true
```

```bash
fly deploy
```

The same Dockerfile that works locally will work on Fly.io.