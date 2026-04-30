/**
 * marksheet-svg-renderer.ts
 *
 * Renders a high-fidelity Marksheet SVG matching the ModernMarksheet UI design.
 */

import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import axios from 'axios';
import * as QRCode from 'qrcode';

export const SVG_MARKSHEET_WIDTH = 900;
export const SVG_MARKSHEET_HEIGHT = 1200;

export interface MarksheetData {
  marksheetNo?: string;
  rollNo?: string;
  studentName?: string;
  fatherName?: string;
  motherName?: string;
  dob?: string;
  courseName?: string;
  session?: string;
  centerCode?: string;
  centerName?: string;
  centerAddress?: string;
  issueDate?: string;
  studentPhotoUrl?: string;
  qrCodeUrl?: string;
  subjects: Array<{
    title: string;
    totalMarks: number;
    obtainedMarks: number;
  }>;
  totalObtained: number;
  totalMaximum: number;
  percentage: string;
  grade: string;
  result: string;
}

export async function renderMarksheetAsPng(data: MarksheetData): Promise<Buffer> {
  const svg = await buildMarksheetSvg(data);
  return await sharp(Buffer.from(svg), { density: 300 }).png().toBuffer();
}

async function buildMarksheetSvg(d: MarksheetData): Promise<string> {
  const W = SVG_MARKSHEET_WIDTH;
  const H = SVG_MARKSHEET_HEIGHT;
  const CX = W / 2;

  const [sst, photo, qr, sig1, sig2] = await Promise.all([
    loadAsBase64('/images/logo/SST-logo.png'),
    loadAsBase64(d.studentPhotoUrl || ''),
    d.qrCodeUrl ? QRCode.toDataURL(d.qrCodeUrl, { margin: 1, width: 200 }) : Promise.resolve(null),
    loadAsBase64('/images/sign/amit-tam-sig.png'),
    loadAsBase64('/images/sign/dheeraj.png'),
  ]);

  const centerName = (d.centerName && d.centerName !== 'MAIN CENTER') ? d.centerName.toUpperCase() : 'SST COMPUTER & WELL KNOWLEDGE INSTITUTE';
  const centerAddress = (d.centerAddress || 'Dhikunni Chauraha, Sai Nath Road, Bharawan, Sandila, Hardoi, U.P. 241203').toUpperCase();

  // Marks table rows
  const tableTop = 500;
  const rowHeight = 40;
  const maxRows = Math.max(8, d.subjects.length);
  
  const rowsHtml = d.subjects.map((sub, i) => {
    const y = tableTop + 40 + (i * rowHeight);
    return `
      <g transform="translate(60, ${y})">
        <rect width="780" height="${rowHeight}" fill="${i % 2 === 0 ? '#ffffff' : '#f8faff'}" stroke="#e2e8f0" stroke-width="1"/>
        <line x1="60" y1="0" x2="60" y2="${rowHeight}" stroke="#e2e8f0" stroke-width="1"/>
        <line x1="560" y1="0" x2="560" y2="${rowHeight}" stroke="#e2e8f0" stroke-width="1"/>
        <line x1="670" y1="0" x2="670" y2="${rowHeight}" stroke="#e2e8f0" stroke-width="1"/>
        
        <text x="30" y="25" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e3a8a">${i + 1}</text>
        <text x="75" y="25" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1f2937">${esc(sub.title.toUpperCase())}</text>
        <text x="615" y="25" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="900" fill="#1f2937">${sub.totalMarks}</text>
        <text x="725" y="25" text-anchor="middle" font-family="sans-serif" font-size="14" font-weight="900" fill="#21418c">${sub.obtainedMarks}</text>
      </g>
    `;
  }).join('');

  const fillerHtml = Array.from({ length: Math.max(0, 8 - d.subjects.length) }).map((_, i) => {
    const y = tableTop + 40 + ((d.subjects.length + i) * rowHeight);
    return `
      <g transform="translate(60, ${y})">
        <rect width="780" height="${rowHeight}" fill="${(d.subjects.length + i) % 2 === 0 ? '#ffffff' : '#f8faff'}" stroke="#e2e8f0" stroke-width="1"/>
        <line x1="60" y1="0" x2="60" y2="${rowHeight}" stroke="#e2e8f0" stroke-width="1"/>
        <line x1="560" y1="0" x2="560" y2="${rowHeight}" stroke="#e2e8f0" stroke-width="1"/>
        <line x1="670" y1="0" x2="670" y2="${rowHeight}" stroke="#e2e8f0" stroke-width="1"/>
      </g>
    `;
  }).join('');

  const tableBottomY = tableTop + 40 + (maxRows * rowHeight);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#d4af37" />
      <stop offset="50%" style="stop-color:#f1c40f" />
      <stop offset="100%" style="stop-color:#d4af37" />
    </linearGradient>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#1e3a8a" />
      <stop offset="100%" style="stop-color:#3b82f6" />
    </linearGradient>
    <filter id="shadow" x="0" y="0" width="200%" height="200%">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.2"/>
    </filter>
  </defs>

  <!-- Outer Border -->
  <rect width="${W}" height="${H}" fill="url(#goldGrad)"/>
  <rect x="12" y="12" width="${W - 24}" height="${H - 24}" fill="#ffffff"/>
  
  <!-- Decorative Inner Border -->
  <rect x="25" y="25" width="${W - 50}" height="${H - 50}" fill="none" stroke="#21418c" stroke-width="4"/>
  
  <!-- Decorative Corners -->
  <path d="M 25 80 L 25 25 L 80 25" fill="none" stroke="#21418c" stroke-width="8"/>
  <path d="M ${W - 80} 25 L ${W - 25} 25 L ${W - 25} 80" fill="none" stroke="#21418c" stroke-width="8"/>
  <path d="M 25 ${H - 80} L 25 ${H - 25} L 80 ${H - 25}" fill="none" stroke="#21418c" stroke-width="8"/>
  <path d="M ${W - 80} ${H - 25} L ${W - 25} ${H - 25} L ${W - 25} ${H - 80}" fill="none" stroke="#21418c" stroke-width="8"/>

  <!-- Watermark Logo -->
  <g opacity="0.04">
    ${sst ? `<image href="${sst}" x="${CX - 250}" y="${H / 2 - 250}" width="500" height="500"/>` : ''}
  </g>

  <!-- Header Section -->
  <g transform="translate(60, 60)">
    <g>
       ${sst ? `<image href="${sst}" width="90" height="90"/>` : ''}
    </g>
    <g transform="translate(${CX - 60}, 20)" text-anchor="middle">
      <text font-family="sans-serif" font-size="32" font-weight="900" fill="#1e3a8a" letter-spacing="-1">${esc(centerName)}</text>
      <line x1="-300" y1="12" x2="300" y2="12" stroke="url(#goldGrad)" stroke-width="2"/>
      <text y="34" font-family="sans-serif" font-size="12" font-weight="bold" fill="#4b5563">ISO 9001:2026 Certified | Regd. Under MCA, Govt. of India</text>
      <text y="50" font-family="sans-serif" font-size="11" font-weight="bold" fill="#4b5563">${esc(centerAddress)}</text>
    </g>
    <g transform="translate(${W - 120 - 60}, 0)">
       <rect width="90" height="115" fill="#fff" stroke="#1e3a8a" stroke-width="2"/>
       ${photo ? `<image href="${photo}" x="2" y="2" width="86" height="111" preserveAspectRatio="xMidYMid slice"/>` : ''}
    </g>
  </g>

  <!-- Title Ribbon -->
  <g transform="translate(100, 190)">
    <path d="M 0 0 L ${W - 200} 0 L ${W - 180} 25 L ${W - 200} 50 L 0 50 L 20 25 Z" fill="#21418c" filter="url(#shadow)"/>
    <text x="${CX - 100}" y="34" text-anchor="middle" font-family="sans-serif" font-size="26" font-weight="950" fill="#ffffff" letter-spacing="4">STATEMENT OF MARKS</text>
  </g>

  <!-- Student Info Card -->
  <g transform="translate(60, 275)">
    <rect width="780" height="180" rx="15" fill="#f8faff" stroke="#e2e8f0" stroke-width="1"/>
    
    <g transform="translate(35, 40)" font-family="sans-serif">
      <!-- Row 1 -->
      <text font-size="10" font-weight="950" fill="#1e3a8a" opacity="0.7">STUDENT NAME</text>
      <text y="22" font-size="16" font-weight="bold" fill="#111827">${esc(d.studentName?.toUpperCase())}</text>
      
      <text x="400" font-size="10" font-weight="950" fill="#1e3a8a" opacity="0.7">FATHER'S NAME</text>
      <text x="400" y="22" font-size="16" font-weight="bold" fill="#111827">${esc(d.fatherName?.toUpperCase())}</text>
      
      <!-- Row 2 -->
      <g transform="translate(0, 65)">
        <text font-size="10" font-weight="950" fill="#1e3a8a" opacity="0.7">ROLL NUMBER</text>
        <text y="22" font-size="16" font-weight="bold" fill="#111827">${esc(d.rollNo)}</text>
        
        <text x="400" font-size="10" font-weight="950" fill="#1e3a8a" opacity="0.7">COURSE NAME</text>
        <text x="400" y="22" font-size="16" font-weight="bold" fill="#111827">${esc(d.courseName?.toUpperCase())}</text>
      </g>
      
      <!-- Row 3 -->
      <g transform="translate(0, 130)">
        <text font-size="10" font-weight="950" fill="#1e3a8a" opacity="0.7">DATE OF BIRTH</text>
        <text y="20" font-size="14" font-weight="bold" fill="#111827">${esc(d.dob)}</text>
        
        <text x="400" font-size="10" font-weight="950" fill="#1e3a8a" opacity="0.7">ISSUE DATE</text>
        <text x="400" y="20" font-size="14" font-weight="bold" fill="#111827">${esc(d.issueDate)}</text>
      </g>
    </g>
  </g>

  <!-- Marks Table -->
  <g transform="translate(60, ${tableTop})">
    <rect width="780" height="40" rx="10" fill="#21418c" />
    <text x="30" y="26" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="950" fill="#fff">#</text>
    <text x="75" y="26" font-family="sans-serif" font-size="13" font-weight="950" fill="#fff">SUBJECT DESCRIPTION</text>
    <text x="500" y="26" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="950" fill="#fff">MAX</text>
    <text x="615" y="26" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="950" fill="#fff">OBTAINED</text>
    <text x="730" y="26" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="950" fill="#fff">GRADE</text>
  </g>

  ${rowsHtml}
  ${fillerHtml}

  <!-- Grand Total Row -->
  <g transform="translate(60, ${tableBottomY})">
    <rect width="780" height="45" rx="8" fill="#1e3a8a" />
    <text x="40" y="28" font-family="sans-serif" font-size="16" font-weight="950" fill="#fff" letter-spacing="1">AGGREGATE TOTAL</text>
    <text x="500" y="28" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="950" fill="#fff">${d.totalMaximum}</text>
    <text x="615" y="28" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="950" fill="#ffde59">${d.totalObtained}</text>
    <text x="730" y="28" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="950" fill="#fff">${d.percentage}%</text>
  </g>

  <!-- Summary Cards Section -->
  <g transform="translate(60, ${tableBottomY + 65})">
    <!-- Final Result Card -->
    <g>
      <rect width="250" height="85" rx="12" fill="#fff" stroke="#1e3a8a" stroke-width="3" filter="url(#shadow)"/>
      <text x="125" y="22" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="950" fill="#6b7280" letter-spacing="1">FINAL RESULT</text>
      <text x="125" y="65" text-anchor="middle" font-family="sans-serif" font-size="32" font-weight="950" fill="${d.result === 'PASS' || d.result === 'PASSED' ? '#dc2626' : '#991b1b'}">${d.result}</text>
    </g>

    <!-- Performance Grade Card with QR -->
    <g transform="translate(265, 0)">
      <rect width="515" height="85" rx="12" fill="#fff" stroke="#1e3a8a" stroke-width="3" filter="url(#shadow)"/>
      
      <g transform="translate(40, 0)">
        <text x="80" y="22" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="950" fill="#6b7280" letter-spacing="1">PERFORMANCE GRADE</text>
        <text x="80" y="65" text-anchor="middle" font-family="sans-serif" font-size="36" font-weight="950" fill="#1f2937">${d.grade}</text>
      </g>
      
      <line x1="240" y1="15" x2="240" y2="70" stroke="#f1f5f9" stroke-width="2"/>
      
      <g transform="translate(250, 5)">
         <text x="60" y="32" font-family="sans-serif" font-size="8" font-weight="950" fill="#94a3b8">VERIFY</text>
         <text x="60" y="45" font-family="sans-serif" font-size="8" font-weight="950" fill="#94a3b8">AUTHENTICITY</text>
         <g transform="translate(140, 2)">
           ${qr ? `<image href="${qr}" width="70" height="70"/>` : ''}
         </g>
      </g>
    </g>
  </g>

  <!-- Signature Section -->
  <g transform="translate(80, ${H - 160})">
    <!-- Exam Controller -->
    <g>
      ${sig1 ? `<image href="${sig1}" x="30" y="-75" width="110" height="55" />` : ''}
      <line x1="0" y1="0" x2="180" y2="0" stroke="#1f2937" stroke-width="2"/>
      <text x="90" y="20" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="950" fill="#4b5563">EXAM CONTROLLER</text>
    </g>

    <!-- Official Seal Ribbon -->
    <g transform="translate(${CX - 80 - 100}, -10)">
       <rect width="160" height="35" rx="17.5" fill="#1e3a8a" filter="url(#shadow)"/>
       <text x="80" y="22" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="950" fill="#fff" letter-spacing="1">OFFICIAL SEAL</text>
    </g>

    <!-- Authorized Signatory -->
    <g transform="translate(${W - 160 - 240}, 0)">
      ${sig2 ? `<image href="${sig2}" x="35" y="-75" width="130" height="55" />` : ''}
      <line x1="0" y1="0" x2="200" y2="0" stroke="#1f2937" stroke-width="2"/>
      <text x="100" y="20" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="950" fill="#4b5563">AUTHORIZED SIGNATORY</text>
    </g>
  </g>

  <!-- Footer Section -->
  <g transform="translate(${CX}, ${H - 60})" text-anchor="middle">
    <text font-family="sans-serif" font-size="9" font-weight="950" fill="#9ca3af" letter-spacing="3">COMPUTER GENERATED DOCUMENT - SECURE ACADEMIC RECORD</text>
    <g transform="translate(0, 15)">
      <rect x="-380" y="0" width="760" height="30" rx="8" fill="#1e3a8a"/>
      <text y="19" font-family="sans-serif" font-size="11" font-weight="bold" fill="#fff">
        Head Office: ${esc(centerAddress)} | Web: www.sstci.in
      </text>
    </g>
  </g>

</svg>`;
}

async function loadAsBase64(src: string): Promise<string | null> {
  if (!src) return null;
  if (src.startsWith('data:')) return src;

  let localPath = src;
  if (src.startsWith('http')) {
    const uploadsMatch = src.match(/\/uploads\/(.+)$/);
    if (uploadsMatch) {
      localPath = path.join(process.cwd(), 'uploads', uploadsMatch[1]);
    }
  }

  const cleaned = localPath.replace(/^\/+/, '');
  const basename = path.basename(cleaned);
  const candidates = [
    localPath,
    path.join(process.cwd(), 'uploads', basename),
    path.join(process.cwd(), cleaned),
    path.join(process.cwd(), '..', 'Computer-Management-System', 'public', cleaned),
    path.join(process.cwd(), '..', 'Student-Panel-CMS', 'public', cleaned),
  ];

  for (const p of candidates) {
    try {
      if (fs.existsSync(p) && fs.statSync(p).isFile()) {
        const buf = fs.readFileSync(p);
        const ext = path.extname(p).toLowerCase();
        const mime = (ext === '.jpg' || ext === '.jpeg') ? 'image/jpeg' : 'image/png';
        return `data:${mime};base64,${buf.toString('base64')}`;
      }
    } catch { /* skip */ }
  }

  if (src.startsWith('http')) {
    try {
      const response = await axios.get(src, { responseType: 'arraybuffer', timeout: 5000 });
      const buf = Buffer.from(response.data as any);
      const mime = response.headers['content-type'] || 'image/png';
      return `data:${mime};base64,${buf.toString('base64')}`;
    } catch (e) {
      return null;
    }
  }

  return null;
}

function esc(s?: string): string {
  if (!s) return '';
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}


