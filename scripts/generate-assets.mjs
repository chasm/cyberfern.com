import { readFileSync, writeFileSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")
const publicDir = resolve(root, "public")

const faviconSvg = readFileSync(resolve(publicDir, "favicon.svg"))

// --- 1. apple-touch-icon.png (180x180) ---
await sharp(faviconSvg)
	.resize(180, 180)
	.png()
	.toFile(resolve(publicDir, "apple-touch-icon.png"))
console.log("Created public/apple-touch-icon.png (180x180)")

// --- 2. favicon.ico (32x32 PNG wrapped in ICO) ---
const png32 = await sharp(faviconSvg).resize(32, 32).png().toBuffer()

function pngToIco(pngBuffer) {
	const dir = Buffer.alloc(16)
	dir.writeUInt8(32, 0) // width (0 = 256)
	dir.writeUInt8(32, 1) // height
	dir.writeUInt8(0, 2) // palette
	dir.writeUInt8(0, 3) // reserved
	dir.writeUInt16LE(1, 4) // color planes
	dir.writeUInt16LE(32, 6) // bits per pixel
	dir.writeUInt32LE(pngBuffer.length, 8) // image size
	dir.writeUInt32LE(22, 12) // offset (6 header + 16 dir entry)

	const header = Buffer.alloc(6)
	header.writeUInt16LE(0, 0) // reserved
	header.writeUInt16LE(1, 2) // ICO type
	header.writeUInt16LE(1, 4) // 1 image

	return Buffer.concat([header, dir, pngBuffer])
}

writeFileSync(resolve(publicDir, "favicon.ico"), pngToIco(png32))
console.log("Created public/favicon.ico (32x32)")

// --- 3. PWA icons ---
await sharp(faviconSvg)
	.resize(192, 192)
	.png()
	.toFile(resolve(publicDir, "pwa-192x192.png"))
console.log("Created public/pwa-192x192.png (192x192)")

await sharp(faviconSvg)
	.resize(512, 512)
	.png()
	.toFile(resolve(publicDir, "pwa-512x512.png"))
console.log("Created public/pwa-512x512.png (512x512)")

// --- 4. og-image.png (1200x630) ---
const fernSvg = readFileSync(resolve(publicDir, "favicon.svg"), "utf8")
const fernGroup = fernSvg.match(/<g[^>]*>[\s\S]*?<\/g>/)?.[0] ?? ""

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#134e31"/>
  <g transform="translate(100, 65) scale(0.65)">
    ${fernGroup}
  </g>
  <text x="480" y="280" font-family="system-ui, sans-serif" font-size="96" font-weight="700" fill="#ffe900">CyberFern</text>
  <text x="480" y="370" font-family="system-ui, sans-serif" font-size="32" fill="#fcfbf0">Cybersecurity made practical,</text>
  <text x="480" y="415" font-family="system-ui, sans-serif" font-size="32" fill="#fcfbf0">proportionate, and human.</text>
</svg>`

await sharp(Buffer.from(ogSvg))
	.resize(1200, 630)
	.png()
	.toFile(resolve(publicDir, "og-image.png"))
console.log("Created public/og-image.png (1200x630)")
