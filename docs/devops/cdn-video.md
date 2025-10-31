# CDN & Video Delivery

## Options

- Managed streaming (recommended): Cloudflare Stream, Bunny Stream, or Mux (HLS/DASH, analytics, DRM options)
- Simple storage: Supabase Storage with signed URLs and CDN caching

## Recommended approach

- Start with Supabase Storage + signed URLs
- Add CDN caching (Cloudflare or Vercel Edge) for common regions
- If scale or advanced features needed, migrate to a managed streaming provider

## Player considerations

- Use adaptive bitrate streaming (HLS) if using managed providers
- Always include captions/subtitles
- Track watch time via `/api/progress/video`

## Security

- Prefer signed URLs and short-lived tokens
- Avoid embedding raw public URLs where possible
