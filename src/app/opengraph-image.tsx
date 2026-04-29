import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'PáginaBio â€” Sua pÃ¡gina de links profissional'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Subtle glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(76, 110, 245, 0.15) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Logo icon */}
        <div
          style={{
            width: '96px',
            height: '96px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #748ffc, #4263eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '32px',
            boxShadow: '0 20px 60px rgba(76, 110, 245, 0.3)',
          }}
        >
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #748ffc, #4c6ef5)',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: '16px',
          }}
        >
          PáginaBio
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '24px',
            color: '#71717a',
            maxWidth: '600px',
            textAlign: 'center',
            lineHeight: '1.4',
          }}
        >
          Sua pÃ¡gina de links profissional. PIX nativo, analytics e WhatsApp.
        </div>

        {/* Badge */}
        <div
          style={{
            marginTop: '32px',
            padding: '8px 20px',
            borderRadius: '999px',
            background: 'rgba(76, 110, 245, 0.1)',
            border: '1px solid rgba(76, 110, 245, 0.2)',
            color: '#748ffc',
            fontSize: '16px',
            fontWeight: 500,
          }}
        >
          GrÃ¡tis para sempre â€¢ 100% brasileiro
        </div>
      </div>
    ),
    { ...size }
  )
}
