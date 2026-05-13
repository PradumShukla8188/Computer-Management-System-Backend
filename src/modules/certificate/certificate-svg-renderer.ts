/**
 * certificate-svg-renderer.ts
 *
 * FINAL PERFECTION VERSION.
 * Strictly matches the gold-border design, alignment, and layering.
 */

import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import axios from 'axios';

export const SVG_CERT_WIDTH = 900;
export const SVG_CERT_HEIGHT = 1272; // Adjusted to A4 aspect ratio (1:1.414)

export interface CertificateData {
  certificateNo?: string;
  enrollmentNo?: string;
  studentName?: string;
  fatherName?: string;
  motherName?: string;
  dob?: string;
  courseName?: string;
  securedPercent?: string;
  grade?: string;
  session?: string;
  centerCode?: string;
  centerName?: string;
  centerAddress?: string;
  issueDate?: string;
  studentPhotoUrl?: string;
  qrCodeUrl?: string;
}


export async function renderCertificateAsPng(data: CertificateData): Promise<Buffer> {
  const svg = await buildCertificateSvg(data);
  return await sharp(Buffer.from(svg), { density: 300 }).png().toBuffer();
}

async function buildCertificateSvg(d: CertificateData): Promise<string> {
  const W = SVG_CERT_WIDTH;
  const H = SVG_CERT_HEIGHT;
  const CX = W / 2;

  const [msme, sst, qro, s1, s2, s3, s4, photo, qr, sig1, sig2] = await Promise.all([
    loadAsBase64('/images/logo/msme-logo.jpg'),
    loadAsBase64('/images/logo/SST-logo.png'),
    loadAsBase64('/images/SSSS/jaybalajieducation ro logo_20211101090204_20220203085108 (1)_20230819225226.png'),
    loadAsBase64('/images/SSSS/ISO_9001-2015-jbce6_20210920091101_20220203085121_20230819225005.jpg'),
    loadAsBase64('/images/SSSS/download_20220928221937_20221025212704.png'),
    loadAsBase64('/images/SSSS/swachh-bharat-abhiyan  jbce 5_20210920091019_20220203085200.png'),
    loadAsBase64('/images/SSSS/digital india_20231001222002.png'),
    loadAsBase64(d.studentPhotoUrl || ''),
    loadAsBase64(d.qrCodeUrl || ''),
    loadAsBase64('/images/sign/amit-tam-sig.png'),
    loadAsBase64('/images/sign/dheeraj.png'),
  ]);

  const WM_Y = 660; // Adjusted for new height
  const centerName = (d.centerName || 'SST COMPUTER & WELL KNOWLEDGE INSTITUTE').toUpperCase();
  const slogan = "Master the Computer, Shape the Future";

  const renderCurvedChars = (chars: string[], radius: number, startAngle: number, endAngle: number, reverse: boolean) => {
    const totalAngle = endAngle - startAngle;
    const step = totalAngle / (chars.length - 1 || 1);
    return chars.map((char, i) => {
      const angle = startAngle + step * i;
      const angleRad = (angle * Math.PI) / 180;
      const x = CX + radius * Math.cos(angleRad);
      const y = WM_Y + radius * Math.sin(angleRad);
      const rotation = angle + 90 + (reverse ? 180 : 0);
      return `<text x="${x}" y="${y}" transform="rotate(${rotation}, ${x}, ${y})" fill="#ffffff" font-size="20" font-family="sans-serif" font-weight="950" text-anchor="middle">${esc(char)}</text>`;
    }).join('\n');
  };

  const watermarkTopText = renderCurvedChars(centerName.split(''), 200, 195, 345, false);
  const watermarkBottomText = renderCurvedChars(slogan.split(''), 200, 20, 160, true);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#BF953F" />
      <stop offset="25%" style="stop-color:#FCF6BA" />
      <stop offset="50%" style="stop-color:#B38728" />
      <stop offset="75%" style="stop-color:#FBF5B7" />
      <stop offset="100%" style="stop-color:#AA771C" />
    </linearGradient>
  </defs>

  <!-- MULTI-LAYER PREMIUM GOLD BORDER -->
  <rect width="${W}" height="${H}" fill="url(#goldGradient)"/>
  <rect x="12" y="12" width="${W - 24}" height="${H - 24}" fill="#fff9e6"/>
  <rect x="22" y="22" width="${W - 44}" height="${H - 44}" fill="none" stroke="url(#goldGradient)" stroke-width="4"/>
  <rect x="28" y="28" width="${W - 56}" height="${H - 56}" fill="none" stroke="#c0993d" stroke-width="1"/>

  <!-- WATERMARK LAYER -->
  <g opacity="0.2">
    <circle cx="${CX}" cy="${WM_Y}" r="220" fill="none" stroke="#d4af37" stroke-width="10" />
    <circle cx="${CX}" cy="${WM_Y}" r="180" fill="none" stroke="#1e3a8a" stroke-width="58" />
    <circle cx="${CX}" cy="${WM_Y}" r="210" fill="none" stroke="#1e3a8a" stroke-width="3" />
    <circle cx="${CX}" cy="${WM_Y}" r="150" fill="none" stroke="#1e3a8a" stroke-width="3" />
    <circle cx="${CX}" cy="${WM_Y}" r="142" fill="none" stroke="#d4af37" stroke-width="5" />
    ${watermarkTopText}
    ${watermarkBottomText}
    <g transform="translate(${CX - 100}, ${WM_Y - 100}) scale(1.4)">
      <rect x="30" y="45" width="90" height="65" rx="4" fill="none" stroke="#1e3a8a" stroke-width="7" />
      <path d="M 55 110 L 95 110 L 110 135 L 40 135 Z" fill="#1e3a8a" />
      <path d="M 40 135 L 110 135 L 110 142 L 40 142 Z" fill="#d4af37" />
      <path d="M 75 5 L 130 25 L 75 45 L 20 25 Z" fill="#1e3a8a" />
      <path d="M 45 32 L 45 45 C 45 60, 105 60, 105 45 L 105 32 Z" fill="#1e3a8a" />
      <circle cx="125" cy="60" r="4" fill="#d4af37" />
    </g>
  </g>

  <!-- CONTENT LAYER -->
  <g transform="translate(0, 70)">
    <g font-family="sans-serif" font-size="16" font-weight="950" fill="#92400e">
      <text x="70" y="0">Certificate No: <tspan fill="#000">${esc(d.certificateNo || 'Pending')}</tspan></text>
      <text x="${W - 70}" y="0" text-anchor="end">Enrollment No: <tspan fill="#000">${esc(d.enrollmentNo || 'Pending')}</tspan></text>
    </g>

    <g transform="translate(0, 65)">
      ${msme ? `<image href="${msme}" x="70"  y="-35" width="85" height="85"/>` : ''}
      ${sst ? `<image href="${sst}"  x="${CX - 50}" y="-55" width="100" height="100"/>` : ''}
      ${qro ? `<image href="${qro}"  x="${W - 70 - 85}" y="-35" width="85" height="85"/>` : ''}
    </g>

    <g transform="translate(${CX}, 190)" text-anchor="middle">
      <text font-family="sans-serif" font-size="34" font-weight="950" fill="#900000" textLength="760" lengthAdjust="spacingAndGlyphs">${esc(centerName)}</text>
    </g>

    <g transform="translate(${CX}, 245)" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold" fill="#000">
      <text y="0">An ISO 9001:2026 Certified Institute</text>
      <text y="18">Registered Under Ministry of Corporate Affairs (Govt. of India)</text>
      <text y="36" font-weight="950" font-size="14">Udyam Registration No.: UDYAM-UP-35-0054566</text>
      <text y="54">Registered under the Societies Registration Act, 1860 (Act No. 21).</text>
      <text y="72" font-weight="950" font-size="14">Society Registration No.:HAR/05025/2025-2026</text>
      <text y="92" font-size="10.5">(An Autonomous Institute Registered Under the Micro, Small or Medium Enterprise MSME Regd. with Govt. of India)</text>
      <text y="106" font-size="10.5">(A National Programme Of I.T Education &amp; Computer Literacy)</text>
    </g>

    <g transform="translate(0, 410)">
      <text x="${CX}" y="50" text-anchor="middle" font-family="Brush Script MT, cursive" font-size="115" fill="#dc2626">Certificate</text>
      <text x="${CX}" y="100" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="950" fill="#1e3a8a">This is Certified That</text>
      <g transform="translate(70, -35)">
        <rect width="116" height="116" fill="#fff" stroke="#d1d5db" stroke-width="2"/>
        ${qr ? `<image href="${qr}" x="3" y="3" width="110" height="110"/>` : ''}
      </g>
      <g transform="translate(${W - 70 - 110}, -35)">
        <rect width="116" height="146" fill="#fff" stroke="#d1d5db" stroke-width="3"/>
        ${photo ? `<image href="${photo}" x="3" y="3" width="110" height="140" preserveAspectRatio="xMidYMid slice"/>` : ''}
      </g>
    </g>

    <g transform="translate(70, 580)" font-family="sans-serif" font-weight="950" fill="#000">
      <text x="0" y="0" fill="#374151" font-size="23">Mr./Mrs/Miss:</text>
      <text x="175" y="0" font-size="23">${esc((d.studentName || '').toUpperCase())}</text>
      <text x="440" y="0" fill="#374151" font-size="23">Father's Name:</text>
      <text x="625" y="0" font-size="23">${esc((d.fatherName || '').toUpperCase())}</text>
      <text x="0" y="60" fill="#374151" font-size="23">Mother's Name:</text>
      <text x="185" y="60" font-size="23">${esc((d.motherName || '').toUpperCase())}</text>
      <text x="440" y="60" fill="#374151" font-size="23">Date Of Birth:</text>
      <text x="625" y="60" font-size="23">${esc((d.dob || '').toUpperCase())}</text>
    </g>
 
    <g transform="translate(${CX}, 740)" text-anchor="middle">
      <text font-family="sans-serif" font-size="23" font-weight="950" fill="#900000">Has Successfully Completed the Course:</text>
      <text y="50" font-family="sans-serif" font-size="34" font-weight="950" fill="#000">${esc(d.courseName || '')}</text>
    </g>

    <g transform="translate(70, 850)" font-family="sans-serif" font-size="18" font-weight="950" fill="#000">
      <text x="0" y="0" fill="#374151">And Secured:</text>
      <text x="135" y="0">
        <tspan>${esc((d.securedPercent || '').replace(/%/g, ''))}</tspan>
        <tspan dx="6">%</tspan>
      </text>
      <text x="420" y="0" fill="#374151">In the Grade:</text>
      <text x="560" y="0">${esc(d.grade || '')}</text>
      <text x="0" y="45" fill="#374151">Session:</text>
      <text x="135" y="45">${esc(d.session || '')}</text>
      <text x="420" y="45" fill="#374151">Center Code:</text>
      <text x="560" y="45">${esc(d.centerCode || '')}</text>
    </g>

    <g transform="translate(90, 935)">
      ${s1 ? `<image href="${s1}" x="0"   y="0" width="70" height="70"/>` : ''}
      ${s2 ? `<image href="${s2}" x="160" y="5" width="80" height="60"/>` : ''}
      ${s3 ? `<image href="${s3}" x="320" y="0" width="80" height="70"/>` : ''}
      ${s4 ? `<image href="${s4}" x="480" y="0" width="110" height="70"/>` : ''}
    </g>

    <g transform="translate(70, 1070)">
      <g transform="translate(0, 45)">
        ${sig1 ? `<image href="${sig1}" x="50" y="-30" width="100" height="55" />` : ''}
        <line x1="0" y1="0" x2="200" y2="0" stroke="#000" stroke-width="2"/>
        <text x="100" y="25" font-family="sans-serif" font-size="16" font-weight="950" text-anchor="middle">Controller of Exam</text>
      </g>
      <g transform="translate(${CX - 70}, -10)" text-anchor="middle">
        <text font-family="sans-serif" font-size="22" font-weight="950" fill="#900000">ISSUE DATE: ${esc(d.issueDate || '')}</text>
        <rect x="-225" y="15" width="450" height="45" rx="22" fill="#f3f4f6" />
        <text y="35" font-family="sans-serif" font-size="11" font-weight="950" fill="#900000">90% &amp; Above 'A+' Grade, 80% &amp; Above 'A' Grade, 70% &amp; Above 'B' Grade,</text>
        <text y="50" font-family="sans-serif" font-size="11" font-weight="950" fill="#374151">60% &amp; Above 'C' Grade, 50% &amp; Above 'D' Grade, Below 40% 'Fail'</text>
      </g>
      <g transform="translate(${W - 140 - 200}, 45)">
        ${sig2 ? `<image href="${sig2}" x="40" y="-35" width="120" height="65" />` : ''}
        <line x1="0" y1="0" x2="200" y2="0" stroke="#000" stroke-width="2"/>
        <text x="100" y="25" font-family="sans-serif" font-size="16" font-weight="950" text-anchor="middle">Authorized Signatory</text>
      </g>
      <g transform="translate(${CX - 70}, 145)" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="950" fill="#374151">
        <text>Head Office: ${esc(d.centerAddress || 'Dhikunni Chauraha, Sai Nath Road, Bharawan, Sandila,Hardoi, Uttar Pradesh 241203')}</text>
        <text y="20" fill="#1e40af" font-size="11">Visit On US : https://sstci-student-panel-cms.vercel.app/ | Verify Tab in ${process.env.NEXT_PUBLIC_BACKEND_API_URL}verify-certificate | info@sstci.in</text>
      </g>
    </g>
  </g>
</svg>`;
}

async function loadAsBase64(src: string): Promise<string | null> {
  if (!src) return null;
  if (src.startsWith('data:')) return src;

  // 1. Try local file resolution first (fastest)
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
    path.join(process.cwd(), '..', '..', 'Computer-Management-System', 'public', cleaned),
    path.join(process.cwd(), '..', '..', 'student-staff-panel', 'public', cleaned),
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

  // 2. Fallback to HTTP fetch if local failed (necessary for Render/Ephemeral storage)
  if (src.startsWith('http')) {
    try {
      const response = await axios.get(src, { responseType: 'arraybuffer', timeout: 5000 });
      const buf = Buffer.from(response.data as any);
      const mime = response.headers['content-type'] || 'image/png';
      return `data:${mime};base64,${buf.toString('base64')}`;
    } catch (e) {
      console.error(`Failed remote fetch for PDF generation: ${src}`);
      return null;
    }
  }

  return null;
}

function esc(s: string): string {
  if (!s) return '';
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
