export type ButtonStyle = 'solid' | 'glass' | 'outline'
export type ButtonRoundness = 'square' | 'round' | 'rounder' | 'full'
export type ButtonShadow = 'none' | 'soft' | 'strong' | 'hard'
export type HeaderLayout = 'classic' | 'hero'

export interface Template {
  id: string
  name: string
  description: string
  defaultColors: {
    bg: string
    button: string
    text: string
  }
  fontFamily: string
  buttonStyle: ButtonStyle
  buttonRoundness: ButtonRoundness
  buttonShadow: ButtonShadow
  headerLayout: HeaderLayout
}

export const TEMPLATES: Template[] = [
  {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Limpo e elegante',
    defaultColors: { bg: '#ffffff', button: '#000000', text: '#ffffff' },
    fontFamily: 'Inter',
    buttonStyle: 'solid',
    buttonRoundness: 'round',
    buttonShadow: 'soft',
    headerLayout: 'classic',
  },
  {
    id: 'dark',
    name: 'Escuro',
    description: 'Fundo escuro, botões vibrantes',
    defaultColors: { bg: '#111827', button: '#6366f1', text: '#ffffff' },
    fontFamily: 'Inter',
    buttonStyle: 'solid',
    buttonRoundness: 'full',
    buttonShadow: 'strong',
    headerLayout: 'classic',
  },
  {
    id: 'gradient',
    name: 'Gradiente',
    description: 'Colorido e vibrante',
    defaultColors: { bg: '#9333ea', button: '#ffffff', text: '#7c3aed' },
    fontFamily: 'Outfit',
    buttonStyle: 'glass',
    buttonRoundness: 'round',
    buttonShadow: 'strong',
    headerLayout: 'classic',
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Cyberpunk com brilho',
    defaultColors: { bg: '#0a0a0a', button: '#22d3ee', text: '#0a0a0a' },
    fontFamily: 'Space Grotesk',
    buttonStyle: 'outline',
    buttonRoundness: 'round',
    buttonShadow: 'hard',
    headerLayout: 'classic',
  },
  {
    id: 'pastel',
    name: 'Pastel',
    description: 'Suave e acolhedor',
    defaultColors: { bg: '#fdf2f8', button: '#ec4899', text: '#ffffff' },
    fontFamily: 'Nunito',
    buttonStyle: 'solid',
    buttonRoundness: 'rounder',
    buttonShadow: 'soft',
    headerLayout: 'classic',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Azul profundo e sereno',
    defaultColors: { bg: '#0c1926', button: '#38bdf8', text: '#0c1926' },
    fontFamily: 'Inter',
    buttonStyle: 'solid',
    buttonRoundness: 'full',
    buttonShadow: 'strong',
    headerLayout: 'hero',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Quente e envolvente',
    defaultColors: { bg: '#1a0a0e', button: '#f97316', text: '#1a0a0e' },
    fontFamily: 'Outfit',
    buttonStyle: 'solid',
    buttonRoundness: 'round',
    buttonShadow: 'strong',
    headerLayout: 'hero',
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natural e orgânico',
    defaultColors: { bg: '#0a1f0a', button: '#4ade80', text: '#0a1f0a' },
    fontFamily: 'Inter',
    buttonStyle: 'solid',
    buttonRoundness: 'round',
    buttonShadow: 'strong',
    headerLayout: 'classic',
  },
  {
    id: 'candy',
    name: 'Candy',
    description: 'Divertido e colorido',
    defaultColors: { bg: '#fef3c7', button: '#e11d48', text: '#ffffff' },
    fontFamily: 'Nunito',
    buttonStyle: 'solid',
    buttonRoundness: 'full',
    buttonShadow: 'soft',
    headerLayout: 'classic',
  },
  {
    id: 'mono',
    name: 'Mono',
    description: 'Preto e branco clássico',
    defaultColors: { bg: '#18181b', button: '#e4e4e7', text: '#18181b' },
    fontFamily: 'Space Grotesk',
    buttonStyle: 'solid',
    buttonRoundness: 'square',
    buttonShadow: 'none',
    headerLayout: 'classic',
  },
  {
    id: 'coral',
    name: 'Coral',
    description: 'Quente e feminino',
    defaultColors: { bg: '#fff5f0', button: '#ff6b6b', text: '#ffffff' },
    fontFamily: 'Outfit',
    buttonStyle: 'solid',
    buttonRoundness: 'rounder',
    buttonShadow: 'soft',
    headerLayout: 'classic',
  },
  {
    id: 'lavanda',
    name: 'Lavanda',
    description: 'Suave e sofisticado',
    defaultColors: { bg: '#f5f3ff', button: '#8b5cf6', text: '#ffffff' },
    fontFamily: 'Nunito',
    buttonStyle: 'solid',
    buttonRoundness: 'round',
    buttonShadow: 'soft',
    headerLayout: 'classic',
  },
  {
    id: 'slate',
    name: 'Slate',
    description: 'Corporativo e minimalista',
    defaultColors: { bg: '#0f172a', button: '#94a3b8', text: '#0f172a' },
    fontFamily: 'Inter',
    buttonStyle: 'outline',
    buttonRoundness: 'square',
    buttonShadow: 'none',
    headerLayout: 'classic',
  },
  {
    id: 'carnaval',
    name: 'Carnaval',
    description: 'Vibrante e brasileiro',
    defaultColors: { bg: '#16213e', button: '#f2c94c', text: '#16213e' },
    fontFamily: 'Outfit',
    buttonStyle: 'solid',
    buttonRoundness: 'full',
    buttonShadow: 'strong',
    headerLayout: 'hero',
  },
]

export function getTemplate(id: string): Template {
  return TEMPLATES.find(t => t.id === id) ?? TEMPLATES[0]
}

/* ─── Style derivation helpers ─────────────────────────────────────
 * Used by mobile-preview, public-page e mini-card pra derivar CSS dos
 * campos persistidos no user (ou de um template, no caso do mini-card).
 */

export function getRoundnessRadius(roundness: ButtonRoundness): string {
  switch (roundness) {
    case 'square':  return '4px'
    case 'round':   return '12px'
    case 'rounder': return '20px'
    case 'full':    return '999px'
  }
}

export function getShadowCss(
  shadow: ButtonShadow,
  buttonColor: string,
): string | undefined {
  switch (shadow) {
    case 'none':   return undefined
    case 'soft':   return `0 1px 2px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.06)`
    case 'strong': return `0 4px 12px rgba(0,0,0,0.18), 0 8px 24px ${buttonColor}25`
    case 'hard':   return `0 0 0 1px ${buttonColor}30, 0 6px 0 ${buttonColor}40`
  }
}
