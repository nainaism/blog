import { loadDefaultJapaneseParser } from 'budoux'
import satori from 'satori'
import sharp from 'sharp'

const parser = loadDefaultJapaneseParser()

// Split Japanese text into semantic chunks using budoux
function splitWithBudoux(text: string): string[] {
  return parser.parse(text)
}

// Fetch Noto Sans JP font from Google Fonts (cached per build)
// Satori requires TTF/OTF fonts (not woff2), so we omit the browser User-Agent
// to get the truetype version from Google Fonts.
let fontCache: ArrayBuffer | null = null
async function getFont(): Promise<ArrayBuffer> {
  if (fontCache) return fontCache
  const res = await fetch(
    'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&display=swap'
  )
  if (!res.ok) {
    throw new Error(`Failed to fetch Google Fonts CSS: ${res.status} ${res.statusText}`)
  }
  const css = await res.text()
  const fontUrlMatch = css.match(/src:\s*url\(([^)]+)\)\s*format\(['"]truetype['"]\)/)
  if (!fontUrlMatch) {
    throw new Error('Failed to extract font URL from Google Fonts CSS')
  }
  const fontRes = await fetch(fontUrlMatch[1])
  if (!fontRes.ok) {
    throw new Error(`Failed to fetch font file: ${fontRes.status} ${fontRes.statusText}`)
  }
  fontCache = await fontRes.arrayBuffer()
  return fontCache
}

export async function generateOgImage(title: string, siteTitle: string): Promise<Uint8Array> {
  const fontData = await getFont()
  const chunks = splitWithBudoux(title)

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          fontFamily: 'Noto Sans JP',
          color: '#ffffff',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexWrap: 'wrap',
                fontSize: '56px',
                fontWeight: 700,
                lineHeight: 1.4,
                letterSpacing: '-0.02em',
              },
              children: chunks.map((chunk) => ({
                type: 'span',
                props: {
                  children: chunk,
                },
              })),
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                marginTop: '40px',
                fontSize: '28px',
                color: '#94a3b8',
              },
              children: siteTitle,
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Noto Sans JP',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  )

  return new Uint8Array(await sharp(Buffer.from(svg)).png().toBuffer())
}
