/**
 * marksheet-svg-renderer.ts — pixel-perfect, zero-overlap layout
 */
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import axios from 'axios';
import * as QRCode from 'qrcode';

export const SVG_MARKSHEET_WIDTH = 900;
export const SVG_MARKSHEET_HEIGHT = 1850;

export interface MarksheetData {
  marksheetNo?: string; rollNo?: string; studentName?: string; fatherName?: string;
  motherName?: string; dob?: string; courseName?: string; session?: string;
  centerCode?: string; centerName?: string; centerAddress?: string;
  issueDate?: string; studentPhotoUrl?: string; qrCodeUrl?: string;
  subjects: Array<{ title: string; totalMarks: number; obtainedMarks: number }>;
  totalObtained: number; totalMaximum: number; percentage: string; grade: string; result: string;
}

export async function renderMarksheetAsPng(data: MarksheetData): Promise<Buffer> {
  const svg = await buildSvg(data);
  return sharp(Buffer.from(svg), { density: 150 }).png().toBuffer();
}

async function buildSvg(d: MarksheetData): Promise<string> {
  // ── images ──────────────────────────────────────────────────
  const [sst, photo, s1, s2, msme, qro, iso, iaf, swachh, digitalIndia] = await Promise.all([
    img('/images/logo/SST-logo.png'),
    img(d.studentPhotoUrl || ''),
    img('/images/sign/amit-tam-sig.png'),
    img('/images/sign/dheeraj.png'),
    img('/images/logo/msme-logo.jpg'),
    img('/images/SSSS/jaybalajieducation ro logo_20211101090204_20220203085108 (1)_20230819225226.png'),
    img('/images/SSSS/ISO_9001-2015-jbce6_20210920091101_20220203085121_20230819225005.jpg'),
    img('/images/SSSS/download_20220928221937_20221025212704.png'),
    img('/images/SSSS/swachh-bharat-abhiyan  jbce 5_20210920091019_20220203085200.png'),
    img('/images/SSSS/digital india_20231001222002.png'),
  ]);

  const qr = await QRCode.toDataURL(`https://sstci.in/verify?rollNo=${d.rollNo || ''}`,
    { margin: 1, width: 120, color: { dark: '#1a3470', light: '#ffffff' } });

  const W = 900;
  const H = 1850;
  const CX = W / 2;
  const LX = 40;
  const CW = W - 80;
  const cn = (d.centerName || 'SST COMPUTER & WELL KNOWLEDGE INSTITUTE').toUpperCase();

  // ── Layout Config ──────────────────────────────────────────
  const Y_TOP = 40;
  const Y_LOGOS = 100;
  const Y_NAME = 230;
  const Y_INFO = 310;
  const Y_TIT = 480;
  const Y_GRD = 660;
  const Y_TBL = 850;
  const ROW_H = 38;
  const NR = Math.max(d.subjects.length, 1);
  const TBL_H = 40 + NR * ROW_H + 40;
  const Y_SUM = Y_TBL + TBL_H + 50;
  const Y_BLOGOS = Y_SUM + 110;
  const Y_SIG = Y_BLOGOS + 140;
  const Y_FTR = Y_SIG + 200;

  // Split name for two-line header
  let name1 = cn;
  let name2 = "";
  if (cn.includes("INSTITUTE")) {
    name1 = cn.split("INSTITUTE")[0].trim();
    name2 = "INSTITUTE";
  } else if (cn.length > 25) {
    const words = cn.split(" ");
    const mid = Math.floor(words.length / 2);
    name1 = words.slice(0, mid + 1).join(" ");
    name2 = words.slice(mid + 1).join(" ");
  }

  // Watermark helpers
  const WM_Y = 850;
  const renderCurvedChars = (chars: string[], radius: number, startAngle: number, endAngle: number, reverse: boolean) => {
    const totalAngle = endAngle - startAngle;
    const step = totalAngle / (chars.length - 1 || 1);
    return chars.map((char, i) => {
      const angle = startAngle + step * i;
      const angleRad = (angle * Math.PI) / 180;
      const x = CX + radius * Math.cos(angleRad);
      const y = WM_Y + radius * Math.sin(angleRad);
      const rotation = reverse ? angle - 90 : angle + 90;
      return `<text x="${x}" y="${y}" transform="rotate(${rotation}, ${x}, ${y})" fill="#ffffff" font-size="22" font-family="Arial, sans-serif" font-weight="900" text-anchor="middle">${esc(char)}</text>`;
    }).join('\n');
  };
  const watermarkTopText = renderCurvedChars(cn.split(''), 191, 185, 355, false);
  const watermarkBottomText = renderCurvedChars("Master the Computer, Shape the Future".split(''), 191, 175, 5, true);

  // ── Pre-rendered components ─────────────────────────────────
  const ornaments = [
    { x: 25, y: 25, r: 0 }, { x: W - 25, y: 25, r: 90 },
    { x: 25, y: H - 25, r: -90 }, { x: W - 25, y: H - 25, r: 180 }
  ].map(c => `
    <g transform="translate(${c.x}, ${c.y}) rotate(${c.r})">
      <path d="M 0 40 L 0 0 L 40 0" fill="none" stroke="#c0993d" stroke-width="2.5" />
      <circle cx="4" cy="4" r="3.5" fill="#c0993d" />
    </g>`).join('');

  const gridHtml = [
    { l: 'Student Name:', v: d.studentName },
    { l: "Father's Name:", v: d.fatherName },
    { l: "Mother's Name :", v: d.motherName },
    { l: 'Date Of Birth:', v: d.dob }
  ].map((f, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = LX + 35 + col * (CW / 2);
    const y = row * 55; // increased row height for larger text
    return `
      <text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="20" font-weight="900" fill="#374151">${esc(f.l)}</text>
      <text x="${x + 165}" y="${y}" font-family="Arial, sans-serif" font-size="20" font-weight="900" fill="#1e40af">${esc((f.v || '').toUpperCase())}</text>
    `;
  }).join('');

  const tableRows = d.subjects.map((s, i) => {
    const y = 40 + i * ROW_H;
    const bg = i % 2 === 0 ? 'rgba(0,0,0,0)' : 'rgba(30,58,138,0.04)';
    return `
      <rect x="${LX + 20}" y="${y}" width="${CW - 40}" height="${ROW_H}" fill="${bg}" />
      <line x1="${LX + 20}" y1="${y + ROW_H}" x2="${LX + CW - 20}" y2="${y + ROW_H}" stroke="#eee" stroke-width="0.5" />
      <text x="${LX + 40}" y="${y + 24}" font-family="Arial, sans-serif" font-size="14.5" font-weight="900" fill="#000">${esc(s.title.toUpperCase())}</text>
      <text x="${LX + CW - 250}" y="${y + 24}" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="900" fill="#000">${s.totalMarks}</text>
      <text x="${LX + CW - 160}" y="${y + 24}" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="900" fill="#000">${Math.round(s.totalMarks * 0.4)}</text>
      <text x="${LX + CW - 70}" y="${y + 24}" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="900" fill="#dc2626">${s.obtainedMarks}</text>
    `;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="gf" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ead58d"/><stop offset="50%" stop-color="#c8a541"/><stop offset="100%" stop-color="#ead58d"/>
    </linearGradient>
    <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#gf)"/>
  <rect x="8" y="8" width="${W - 16}" height="${H - 16}" fill="#fff" stroke="#c0993d" stroke-width="5"/>
  <rect x="20" y="20" width="${W - 40}" height="${H - 40}" fill="none" stroke="#c0993d" stroke-width="1.5"/>
  ${ornaments}

  <!-- WATERMARK LAYER -->
  <g opacity="0.3">
    <circle cx="${CX}" cy="${WM_Y}" r="235" fill="none" stroke="#d4af37" stroke-width="12" />
    <circle cx="${CX}" cy="${WM_Y}" r="191" fill="none" stroke="#1e3a8a" stroke-width="62" />
    <circle cx="${CX}" cy="${WM_Y}" r="222" fill="none" stroke="#1e3a8a" stroke-width="4" />
    <circle cx="${CX}" cy="${WM_Y}" r="160" fill="none" stroke="#1e3a8a" stroke-width="4" />
    <circle cx="${CX}" cy="${WM_Y}" r="150" fill="none" stroke="#d4af37" stroke-width="6" />
    ${watermarkTopText}
    ${watermarkBottomText}
    <g transform="translate(${CX - 120}, ${WM_Y - 120}) scale(1.6)">
      <rect x="30" y="45" width="90" height="65" rx="4" fill="none" stroke="#1e3a8a" stroke-width="7" />
      <path d="M 55 110 L 95 110 L 110 135 L 40 135 Z" fill="#1e3a8a" />
      <path d="M 40 135 L 110 135 L 110 142 L 40 142 Z" fill="#d4af37" />
      <path d="M 75 5 L 130 25 L 75 45 L 20 25 Z" fill="#1e3a8a" />
      <path d="M 45 32 L 45 45 C 45 60, 105 60, 105 45 L 105 32 Z" fill="#1e3a8a" />
      <path d="M 125 25 L 125 55" stroke="#d4af37" stroke-width="4" />
      <circle cx="125" cy="60" r="4" fill="#d4af37" />
    </g>
  </g>

  <!-- CONTENT -->
  <g transform="translate(0, ${Y_TOP + 10})">
    <text x="${LX + 30}" y="0" font-family="Arial, sans-serif" font-size="16" font-weight="900" fill="#78350f">Marksheet No: <tspan fill="#000">${esc(d.marksheetNo || 'Pending')}</tspan></text>
    <text x="${LX + CW - 30}" y="0" text-anchor="end" font-family="Arial, sans-serif" font-size="16" font-weight="900" fill="#78350f">Roll No: <tspan fill="#000">${esc(d.rollNo || 'Pending')}</tspan></text>
  </g>

  <g transform="translate(0, ${Y_LOGOS})">
    ${msme ? `<image href="${msme}" x="${LX + 50}" y="-35" width="95" height="95" />` : ''}
    ${sst ? `<image href="${sst}" x="${CX - 65}" y="-55" width="130" height="130" />` : ''}
    ${qro ? `<image href="${qro}" x="${LX + CW - 145}" y="-35" width="95" height="95" />` : ''}
  </g>

  <g transform="translate(${CX}, ${Y_NAME})" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" fill="#900000">
    <text font-size="38">${esc(name1)}</text>
    <text y="42" font-size="36">${esc(name2)}</text>
  </g>

  <g transform="translate(${CX}, ${Y_INFO})" text-anchor="middle" font-family="Arial, sans-serif" font-size="13.5" font-weight="900" fill="#111827">
    <text y="0">An ISO 9001:2026 Certified Institute</text>
    <text y="20">Registered Under Ministry of Corporate Affairs (Govt. of India)</text>
    <text y="40" font-weight="900" font-size="15" fill="#1e3a8a">Udyam Registration No.: UDYAM-UP-35-0054566</text>
    <text y="60">Registered under the Societies Registration Act, 1860 (Act No. 21).</text>
    <text y="80" font-weight="900" font-size="15" fill="#1e3a8a">Society Registration No.:HAR/05025/2025-2026</text>
    <text y="105" font-size="12" fill="#4b5563">(An Autonomous Institute Registered Under MSME Regd. with Govt. of India)</text>
    <text y="122" font-size="12" fill="#4b5563">(A National Programme Of I.T Education &amp; Computer Literacy)</text>
  </g>

  <g transform="translate(0, ${Y_TIT})">
    <rect x="${LX + 45}" y="10" width="120" height="120" fill="#fff" stroke="#eee" stroke-width="1.5"/>
    ${qr ? `<image href="${qr}" x="${LX + 50}" y="15" width="110" height="110" />` : ''}
    <text x="${CX}" y="65" text-anchor="middle" font-family="Brush Script MT, cursive, serif" font-size="110" fill="#dc2626" font-style="italic">Marksheet</text>
    <text x="${CX}" y="105" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="900" fill="#1e3a8a">STATEMENT OF MARKS</text>
    <rect x="${LX + CW - 165}" y="0" width="120" height="150" fill="#fff" stroke="#ccc" stroke-width="3"/>
    ${photo ? `<image href="${photo}" x="${LX + CW - 162}" y="3" width="114" height="144" preserveAspectRatio="xMidYMid slice" />` : ''}
  </g>

  <g transform="translate(0, ${Y_GRD})">
    ${gridHtml}
    <g transform="translate(${CX}, 135)" text-anchor="middle">
      <text font-family="Arial, sans-serif" font-size="18" font-weight="900" fill="#900000">Course Examination:</text>
      <text y="40" font-family="Arial, sans-serif" font-size="30" font-weight="900" fill="#000">${esc(d.courseName || '')}</text>
    </g>
  </g>

  <g transform="translate(0, ${Y_TBL})">
    <!-- Glass Background for Table -->
    <rect x="${LX + 20}" y="0" width="${CW - 40}" height="${TBL_H}" rx="12" fill="rgba(255, 255, 255, 0.7)" stroke="#1e3a8a" stroke-width="2"/>
    
    <!-- Table Header with Gradient and Rounded Top -->
    <path d="M ${LX + 32} 0 H ${LX + CW - 32} Q ${LX + CW - 20} 0 ${LX + CW - 20} 12 V 40 H ${LX + 20} V 12 Q ${LX + 20} 0 ${LX + 32} 0 Z" fill="url(#hg)"/>
    
    <text x="${LX + 40}" y="26" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#fff">SUBJECT / PAPER</text>
    <text x="${LX + CW - 250}" y="26" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#fff">MAX MARKS</text>
    <text x="${LX + CW - 160}" y="26" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#fff">MIN MARKS</text>
    <text x="${LX + CW - 70}" y="26" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#fff">OBTAINED MARKS</text>
    ${tableRows}
    <g transform="translate(0, ${40 + NR * ROW_H})">
      <rect x="${LX + 20}" y="0" width="${CW - 40}" height="40" fill="rgba(30, 58, 138, 0.08)"/>
      <text x="${LX + CW - 320}" y="26" text-anchor="end" font-family="Arial, sans-serif" font-size="16" font-weight="900" fill="#000">Grand Total</text>
      <text x="${LX + CW - 250}" y="26" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="900" fill="#000">${d.totalMaximum}</text>
      <text x="${LX + CW - 160}" y="26" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="900" fill="#000">${Math.round(d.totalMaximum * 0.4)}</text>
      <text x="${LX + CW - 70}" y="26" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="900" fill="#dc2626">${d.totalObtained}</text>
    </g>
  </g>

  <g transform="translate(${LX + 20}, ${Y_SUM})">
    <rect width="${CW - 40}" height="85" rx="15" fill="rgba(255, 255, 255, 0.8)" stroke="#1e3a8a" stroke-width="1.5"/>
    <g transform="translate(${(CW - 40) / 8}, 30)" text-anchor="middle">
      <text font-family="Arial, sans-serif" font-size="14" fill="#666" font-weight="900">Percentage</text>
      <text y="30" font-family="Arial, sans-serif" font-size="22" font-weight="900" fill="#000">${d.percentage}%</text>
    </g>
    <g transform="translate(${(CW - 40) * 3 / 8}, 30)" text-anchor="middle">
      <text font-family="Arial, sans-serif" font-size="14" fill="#666" font-weight="900">Grade</text>
      <text y="30" font-family="Arial, sans-serif" font-size="26" font-weight="900" fill="#1e3a8a">${esc(d.grade || '')}</text>
    </g>
    <g transform="translate(${(CW - 40) * 5 / 8}, 30)" text-anchor="middle">
      <text font-family="Arial, sans-serif" font-size="14" fill="#666" font-weight="900">Result</text>
      <text y="30" font-family="Arial, sans-serif" font-size="22" font-weight="900" fill="${d.result.includes('PASS') ? '#16a34a' : '#dc2626'}">${esc(d.result || '')}</text>
    </g>
    <g transform="translate(${(CW - 40) * 7 / 8}, 30)" text-anchor="middle">
      <text font-family="Arial, sans-serif" font-size="14" fill="#666" font-weight="900">Session</text>
      <text y="30" font-family="Arial, sans-serif" font-size="22" font-weight="900" fill="#000">${esc(d.session || '')}</text>
    </g>
  </g>

  <g transform="translate(0, ${Y_BLOGOS})">
    ${iso ? `<image href="${iso}" x="${LX + 70}" y="0" width="70" height="70" />` : ''}
    ${iaf ? `<image href="${iaf}" x="${LX + 220}" y="8" width="80" height="60" />` : ''}
    ${swachh ? `<image href="${swachh}" x="${LX + 370}" y="0" width="80" height="70" />` : ''}
    ${digitalIndia ? `<image href="${digitalIndia}" x="${LX + 530}" y="0" width="110" height="70" />` : ''}
  </g>

  <g transform="translate(0, ${Y_SIG})">
    <g transform="translate(${LX + 60}, 80)">
      ${s1 ? `<image href="${s1}" x="-20" y="-40" width="140" height="60" />` : ''}
      <line x1="-30" y1="5" x2="150" y2="5" stroke="#000" stroke-width="2"/>
      <text x="60" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" font-weight="900">Controller of Exam</text>
    </g>
    <g transform="translate(${CX}, -20)" text-anchor="middle">
      <text font-family="Arial, sans-serif" font-size="20" font-weight="950" fill="#900000">ISSUE DATE: ${esc(d.issueDate || '')}</text>
      <rect x="-250" y="15" width="500" height="42" rx="21" fill="#f3f4f6" stroke="#ddd" stroke-width="1"/>
      <text y="32" font-family="Arial, sans-serif" font-size="10" font-weight="950" fill="#900000">90% &amp; Above 'A+' Grade, 80% &amp; Above 'A' Grade, 70% &amp; Above 'B' Grade,</text>
      <text y="48" font-family="Arial, sans-serif" font-size="10" font-weight="950" fill="#374151">60% &amp; Above 'C' Grade, 50% &amp; Above 'D' Grade, Below 40% 'Fail'</text>
    </g>
    <g transform="translate(${LX + CW - 180}, 80)">
      ${s2 ? `<image href="${s2}" x="-10" y="-40" width="150" height="60" />` : ''}
      <line x1="-20" y1="5" x2="160" y2="5" stroke="#000" stroke-width="2"/>
      <text x="70" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-size="17" font-weight="900">Authorized Signatory</text>
    </g>
  </g>

  <g transform="translate(${CX}, ${Y_FTR})" text-anchor="middle" font-family="Arial, sans-serif" font-size="12.5" font-weight="900" fill="#1f2937">
    <text y="0">Head Office: Dhikunni Chauraha, Sai Nath Road, Bharawan, Sandila, Hardoi, U.P. 241203</text>
    <g transform="translate(0, 22)" font-size="11" fill="#900000">
      <text x="-210">Visit On US : <tspan fill="#1e40af">https://sstci-student-panel-cms.vercel.app/</tspan></text>
      <text x="70">Verify Tab in <tspan fill="#1e40af">https://sstci.in/verify-marksheet</tspan></text>
      <text x="245" fill="#1e40af">info@sstci.in</text>
    </g>
  </g>
</svg>`;
}

async function img(src: string): Promise<string | null> {
  if (!src) return null;
  if (src.startsWith('data:')) return src;
  let localPath = src;
  if (src.startsWith('http')) {
    const m = src.match(/\/uploads\/(.+)$/);
    if (m) localPath = path.join(process.cwd(), 'uploads', m[1]);
    const im = src.match(/\/images\/(.+)$/);
    if (im) localPath = path.join(process.cwd(), 'public', 'images', im[1]);
  }
  const cleaned = localPath.replace(/^\/+/, '');
  const bn = path.basename(cleaned);
  const candidates = [
    localPath,
    path.join(process.cwd(), 'uploads', bn),
    path.join(process.cwd(), 'public', 'images', bn),
    path.join(process.cwd(), 'public', cleaned),
    path.join(process.cwd(), cleaned),
    path.join(__dirname, '..', '..', '..', 'uploads', bn),
    path.join(__dirname, '..', '..', '..', 'public', cleaned),
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p) && fs.statSync(p).isFile()) {
        const buf = fs.readFileSync(p);
        const ext = path.extname(p).toLowerCase();
        const mime = (ext === '.jpg' || ext === '.jpeg') ? 'image/jpeg' : ext === '.svg' ? 'image/svg+xml' : 'image/png';
        return `data:${mime};base64,${buf.toString('base64')}`;
      }
    } catch { /* skip */ }
  }
  if (src.startsWith('http')) {
    try {
      const res = await axios.get(src, { responseType: 'arraybuffer', timeout: 5000 });
      return `data:${res.headers['content-type'] || 'image/png'};base64,${Buffer.from(res.data as ArrayBuffer).toString('base64')}`;
    } catch { return null; }
  }
  return null;
}

function esc(s?: string): string {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
