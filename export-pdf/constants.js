/**
 * Export PDF constants
 */
import { DPR } from './utils'

export const PRINT_FORMATS = [
  { name: 'a0', width: 2383.94, height: 3370.39 },
  { name: 'a1', width: 1683.78, height: 2383.94 },
  { name: 'a2', width: 1190.55, height: 1683.78 },
  { name: 'a3', width: 841.89, height: 1190.55 },
  { name: 'a4', width: 595.28, height: 841.89 },
  { name: 'a5', width: 419.53, height: 595.28 },
  { name: 'a6', width: 297.64, height: 419.53 },
  { name: 'a7', width: 209.76, height: 297.64 },
  { name: 'a8', width: 147.4, height: 209.76 },
  { name: 'a9', width: 104.88, height: 147.4 },
  { name: 'a10', width: 73.7, height: 104.88 },
  { name: 'b0', width: 2834.65, height: 4008.19 },
  { name: 'b1', width: 2004.09, height: 2834.65 },
  { name: 'b2', width: 1417.32, height: 2004.09 },
  { name: 'b3', width: 1000.63, height: 1417.32 },
  { name: 'b4', width: 708.66, height: 1000.63 },
  { name: 'b5', width: 498.9, height: 708.66 },
  { name: 'b6', width: 354.33, height: 498.9 },
  { name: 'b7', width: 249.45, height: 354.33 },
  { name: 'b8', width: 175.75, height: 249.45 },
  { name: 'b9', width: 124.72, height: 175.75 },
  { name: 'b10', width: 87.87, height: 124.72 },
  { name: 'c0', width: 2599.37, height: 3676.54 },
  { name: 'c1', width: 1836.85, height: 2599.37 },
  { name: 'c2', width: 1298.27, height: 1836.85 },
  { name: 'c3', width: 918.43, height: 1298.27 },
  { name: 'c4', width: 649.13, height: 918.43 },
  { name: 'c5', width: 459.21, height: 649.13 },
  { name: 'c6', width: 323.15, height: 459.21 },
  { name: 'c7', width: 229.61, height: 323.15 },
  { name: 'c8', width: 161.57, height: 229.61 },
  { name: 'c9', width: 113.39, height: 161.57 },
  { name: 'c10', width: 79.37, height: 113.39 },
  { name: 'dl', width: 311.81, height: 623.62 },
  { name: 'letter', width: 612, height: 792 },
  { name: 'government-letter', width: 576, height: 756 },
  { name: 'legal', width: 612, height: 1008 },
  { name: 'junior-legal', width: 576, height: 360 },
  { name: 'ledger', width: 1224, height: 792 },
  { name: 'tabloid', width: 792, height: 1224 },
  { name: 'credit-card', width: 153, height: 243 },
]

export const DEFAULT_MARGIN = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
}

export const DEFAULT_OPTIONS = {
  jsPDF: {
    unit: 'px',
    orientation: 'p',  // portrait or landscape orientation
    compress: true // Whether to enable compression function to reduce the pdf size
  },
  pdfContentWidth: 1600,
  html2canvas: {
    scale: DPR(),
    useCORS: true,
    imageTimeout: 30000,
    backgroundColor: '#FFFFFF'
  },
  imageType: 'jpeg', // Image type: 'image/png'(default), 'image/jpeg', 'image/webp'(chrome)
  imageQuality: 1, // Image quality [0, 1], default => 0.92
  margin: DEFAULT_MARGIN
}

export const IMAGE_TYPES = {
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'image/webp': 'WEBP'
}

export const IGNORE_ATTRIBUTE = 'data-html2canvas-ignore'

export const DISPLAY_CLASS_NAME = 'export-pdf-display-block'

export const BREAK_BEFORE_CLASS_NAME = 'export-pdf-break-before'

export const CONTAINER_POSITION_TOP = '10000'
