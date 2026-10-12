/**
 * Resolves a path into /public (e.g. "/logo-left.png") against Vite's
 * configured base URL.
 *
 * This matters once `base` in vite.config.ts is anything other than "/" —
 * which it is for this project, since GitHub Pages serves it from
 * /OttoTHON-main-event-tracker/ rather than the domain root. A hardcoded
 * "/logo-left.png" always points at the domain root and 404s once deployed;
 * import.meta.env.BASE_URL always reflects the actual base Vite is using
 * (locally that's still "/", so nothing changes in dev).
 */
export function publicAsset(path: string): string {
  const base = import.meta.env.BASE_URL
  return `${base}${path.replace(/^\//, '')}`
}
