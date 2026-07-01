export const KYT_WIDTH_PX = 1280
export const KYT_HEIGHT_PX = 720
export const KYT_WIDTH_MM = 254
export const KYT_HEIGHT_MM = 143

export function mmToPx(mm: number): number {
  return (mm / KYT_WIDTH_MM) * KYT_WIDTH_PX
}

export function ptToPx(pt: number): number {
  return pt * (4 / 3)
}

export interface ElPos {
  xMm?: number; yMm?: number; rMm?: number; bMm?: number
  wMm: number; hMm: number; fontSizePt?: number
}

export const EL: Record<string, ElPos> = {
  team:        { xMm: 139.21, yMm: 1,     wMm: 105.17, hMm: 2,  fontSizePt: 22.5 },
  title:       { xMm: 9.92,  yMm: 15.88, wMm: 134.94, hMm: 9.92,  fontSizePt: 13 },
  image:       { xMm: 9.92,  yMm: 26.39, wMm: 134.94, hMm: 99.62 },
  date:        { rMm: 18.10, bMm: 1.59,  wMm: 95.25,  hMm: 11.91, fontSizePt: 36 },
  picLabel:    { xMm: 158.75,yMm: 19.84, wMm: 85.33,  hMm: 6.95,  fontSizePt: 21 },
  picValue:    { xMm: 158.75,yMm: 25.60, wMm: 85.33,  hMm: 7.94,  fontSizePt: 19 },
  potLabel:    { xMm: 158.75,yMm: 35.72, wMm: 85.33,  hMm: 6.95,  fontSizePt: 21 },
  potValue:    { xMm: 158.75,yMm: 42.27, wMm: 85.33,  hMm: 31.35, fontSizePt: 12 },
  penLabel:    { xMm: 158.75,yMm: 75.41, wMm: 85.33,  hMm: 6.95,  fontSizePt: 21 },
  penValue:    { xMm: 158.75,yMm: 81.95, wMm: 85.33,  hMm: 40.08, fontSizePt: 12 },
}

export function mmToIn(mm: number): number {
  return mm / 25.4
}

export interface ElPosIn extends ElPos {
}

export const PptEL: Record<string, ElPosIn> = {
  team:        { xMm: 139.21, yMm: 1,     wMm: 105.17, hMm: 8,    fontSizePt: 21 },
  title:       { xMm: 9.92,  yMm: 15.88, wMm: 134.94, hMm: 9.92, fontSizePt: 12 },
  image:       { xMm: 9.92,  yMm: 26.39, wMm: 134.94, hMm: 99.62 },
  date:        { rMm: 14.10, bMm: 1.59,  wMm: 95.25,  hMm: 11.91, fontSizePt: 28 },
  picLabel:    { xMm: 158.75,yMm: 19.84, wMm: 85.33,  hMm: 6.95,  fontSizePt: 16 },
  picValue:    { xMm: 158.75,yMm: 25.60, wMm: 85.33,  hMm: 7.94,  fontSizePt: 14 },
  potLabel:    { xMm: 158.75,yMm: 35.72, wMm: 85.33,  hMm: 6.95,  fontSizePt: 16 },
  potValue:    { xMm: 158.75,yMm: 42.27, wMm: 85.33,  hMm: 31.35, fontSizePt: 9 },
  penLabel:    { xMm: 158.75,yMm: 75.41, wMm: 85.33,  hMm: 6.95,  fontSizePt: 16 },
  penValue:    { xMm: 158.75,yMm: 81.95, wMm: 85.33,  hMm: 40.08, fontSizePt: 9 },
}

export function elInStyle(el: ElPosIn): Record<string, number | string> {
  const s: Record<string, number | string> = {}
  if (el.rMm !== undefined) s.x = mmToIn(KYT_WIDTH_MM - el.rMm - (el.wMm || 0))
  else if (el.xMm !== undefined) s.x = mmToIn(el.xMm)
  if (el.bMm !== undefined) s.y = mmToIn(KYT_HEIGHT_MM - el.bMm - (el.hMm || 0))
  else if (el.yMm !== undefined) s.y = mmToIn(el.yMm)
  if (el.wMm !== undefined) s.w = mmToIn(el.wMm)
  if (el.hMm !== undefined) s.h = mmToIn(el.hMm)
  return s
}

export function elPxStyle(el: ElPos): Record<string, string> {
  const s: Record<string, string> = {}
  if (el.xMm !== undefined) s.left = `${mmToPx(el.xMm)}px`
  if (el.yMm !== undefined) s.top = `${mmToPx(el.yMm)}px`
  if (el.rMm !== undefined) s.right = `${mmToPx(el.rMm)}px`
  if (el.bMm !== undefined) s.bottom = `${mmToPx(el.bMm)}px`
  if (el.wMm !== undefined) s.width = `${mmToPx(el.wMm)}px`
  if (el.hMm !== undefined) s.height = `${mmToPx(el.hMm)}px`
  if (el.fontSizePt !== undefined) s.fontSize = `${el.fontSizePt}pt`
  return s
}
