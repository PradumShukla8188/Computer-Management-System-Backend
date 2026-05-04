// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT SST CERTIFICATE  (landscape 1123 × 794 – original design)
// ─────────────────────────────────────────────────────────────────────────────

const CERTIFICATE_WIDTH = 1123;
const CERTIFICATE_HEIGHT = 794;

const createCertificateBackgroundSvg = () => `
  <svg xmlns="http://www.w3.org/2000/svg" width="${CERTIFICATE_WIDTH}" height="${CERTIFICATE_HEIGHT}" viewBox="0 0 ${CERTIFICATE_WIDTH} ${CERTIFICATE_HEIGHT}">
    <defs>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f5d56a"/>
        <stop offset="100%" stop-color="#c88a16"/>
      </linearGradient>
      <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fffef8"/>
        <stop offset="100%" stop-color="#fff7db"/>
      </linearGradient>
    </defs>
    <rect width="${CERTIFICATE_WIDTH}" height="${CERTIFICATE_HEIGHT}" fill="#fff7df"/>
    <rect x="24" y="24" width="${CERTIFICATE_WIDTH - 48}" height="${CERTIFICATE_HEIGHT - 48}" rx="22" fill="#3a1508"/>
    <rect x="48" y="48" width="${CERTIFICATE_WIDTH - 96}" height="${CERTIFICATE_HEIGHT - 96}" rx="18" fill="url(#paper)"/>
    <rect x="72" y="72" width="${CERTIFICATE_WIDTH - 144}" height="108" rx="14" fill="#ffffff" stroke="#7b2e14" stroke-width="6"/>
  </svg>
`;

const createDirectorSignatureSvg = () => `
  <svg xmlns="http://www.w3.org/2000/svg" width="260" height="90" viewBox="0 0 260 90">
    <rect width="260" height="90" fill="transparent"/>
    <text x="8" y="60"
      font-family="Segoe Script, Brush Script MT, Lucida Handwriting, cursive"
      font-size="44" fill="#1f2937">Dheeraj</text>
    <path d="M8 70 L220 70" stroke="#1f2937" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
  </svg>
`;

const DEFAULT_SST_DIRECTOR_SIGNATURE = `data:image/svg+xml;base64,${Buffer.from(
  createDirectorSignatureSvg(),
).toString('base64')}`;

export const DEFAULT_SST_CERTIFICATE_TEMPLATE_NAME = 'SST Default Certificate';
export const DEFAULT_SST_CERTIFICATE_SIGNATURE_TEMPLATE_NAME =
  'SST Default Certificate (Dheeraj Signature)';

export const DEFAULT_SST_CERTIFICATE_TEMPLATE = {
  name: DEFAULT_SST_CERTIFICATE_TEMPLATE_NAME,
  dimensions: { width: CERTIFICATE_WIDTH, height: CERTIFICATE_HEIGHT },
  backgroundImage: `data:image/svg+xml;base64,${Buffer.from(createCertificateBackgroundSvg()).toString('base64')}`,
  design: [
    { id: 'logo', type: 'image', src: '/images/logo/SST-logo.png', x: 88, y: 84, width: 66, height: 66 },
    { id: 'header-title', type: 'text', x: 182, y: 88, text: 'SST COMPUTER & WELL KNOWLEDGE INSTITUTE', fontSize: 28, fill: '#7a1f14', fontWeight: 'bold' },
    { id: 'header-subline', type: 'text', x: 182, y: 124, text: 'Dikunni Dhikunni, Uttar Pradesh 241203 | 9519222486, 7376486686', fontSize: 13, fill: '#5f4631' },
    { id: 'header-email', type: 'text', x: 182, y: 145, text: 'Email: SSTCOMPUTER115@GMAIL.COM', fontSize: 13, fill: '#5f4631' },
    { id: 'title', type: 'text', x: 450, y: 210, text: 'Certificate', fontSize: 48, fill: '#203d8c', fontWeight: 'bold' },
    { id: 'subtitle', type: 'text', x: 392, y: 258, text: 'OF COURSE COMPLETION', fontSize: 18, fill: '#8b5e1d', fontWeight: 'bold' },
    { id: 'student-photo', type: 'image', src: '{{student_photo}}', x: 915, y: 210, width: 86, height: 102 },
    { id: 'certify-line', type: 'text', x: 145, y: 318, text: 'This is to certify that Mr./Ms.', fontSize: 20, fill: '#43362d' },
    { id: 'student-name', type: 'text', x: 145, y: 352, text: '{{student_full_name}}', fontSize: 40, fill: '#111827', fontWeight: 'bold' },
    { id: 'father-line', type: 'text', x: 145, y: 395, text: 'S/o, D/o {{father_name}}', fontSize: 24, fill: '#43362d' },
    { id: 'course-line', type: 'text', x: 145, y: 438, text: 'has successfully completed the course {{course_name}}', fontSize: 20, fill: '#43362d' },
    { id: 'duration-line', type: 'text', x: 145, y: 472, text: 'Duration: {{duration}}', fontSize: 19, fill: '#43362d' },
    { id: 'roll-line', type: 'text', x: 145, y: 528, text: 'Roll No.: {{roll_no}}', fontSize: 18, fill: '#111827', fontWeight: 'bold' },
    { id: 'reg-line', type: 'text', x: 355, y: 528, text: 'Reg. No.: {{registration_number}}', fontSize: 18, fill: '#111827', fontWeight: 'bold' },
    { id: 'issue-line', type: 'text', x: 640, y: 528, text: 'Date: {{issue_date}}', fontSize: 18, fill: '#111827', fontWeight: 'bold' },
    { id: 'director-label', type: 'text', x: 790, y: 610, text: 'Director', fontSize: 20, fill: '#0f172a', fontWeight: 'bold' },
    { id: 'qr-code', type: 'image', src: '{{qr_code}}', x: 860, y: 560, width: 118, height: 118 },
    { id: 'qr-label', type: 'text', x: 855, y: 686, text: 'Scan to view certificate details', fontSize: 15, fill: '#7a4c16', fontWeight: 'bold', width: 180 },
    { id: 'verify-line', type: 'text', x: 300, y: 714, text: 'Certificate details are available inside the QR code for quick verification.', fontSize: 16, fill: '#7a4c16', fontWeight: 'bold' },
  ],
};

export const DEFAULT_SST_CERTIFICATE_SIGNATURE_TEMPLATE = {
  ...DEFAULT_SST_CERTIFICATE_TEMPLATE,
  name: DEFAULT_SST_CERTIFICATE_SIGNATURE_TEMPLATE_NAME,
  design: [
    ...DEFAULT_SST_CERTIFICATE_TEMPLATE.design.map((item: any) => ({ ...item })),
    { id: 'director-signature', type: 'image', src: DEFAULT_SST_DIRECTOR_SIGNATURE, x: 730, y: 560, width: 170, height: 60 },
  ],
};


// ─────────────────────────────────────────────────────────────────────────────
// ADVANCED SST CERTIFICATE  (portrait 800 × 1100)
//
// All drawing is done via PDFKit native primitives (rect / circle / line)
// so the design renders correctly without requiring SVG support.
//
// Coordinate reference (top-left origin):
//   Content margins: left/right 20 px   → usable width 760 px
//   Centre X = 400
// ─────────────────────────────────────────────────────────────────────────────

const ADV_W = 900;
const ADV_H = 1420;

// Watermark seal is centred around (450, 540)
const WM_CX = 450;
const WM_CY = 540;

export const ADVANCED_SST_CERTIFICATE_TEMPLATE_NAME = 'SST Advanced Certificate';

export const ADVANCED_SST_CERTIFICATE_TEMPLATE = {
  name: ADVANCED_SST_CERTIFICATE_TEMPLATE_NAME,
  dimensions: { width: ADV_W, height: ADV_H },
  backgroundImage: '',          // no SVG – frame is drawn via rect elements below

  design: [

    // ══════════════════════════════════════════════════════════════
    //  FRAME
    // ══════════════════════════════════════════════════════════════

    // ══════════════════════════════════════════════════════════════
    //  WATERMARK SEAL  (opacity 0.14)
    //  Rings: outer gold, blue ribbon band, two guide rings, gold inner
    // ══════════════════════════════════════════════════════════════

    { id: 'wm-outer',  type: 'circle', cx: WM_CX, cy: WM_CY, r: 190, fill: null, stroke: '#d4af37', strokeWidth: 10, opacity: 0.12 },
    { id: 'wm-band',   type: 'circle', cx: WM_CX, cy: WM_CY, r: 155, fill: null, stroke: '#1e3a8a', strokeWidth: 48, opacity: 0.12 },
    { id: 'wm-ring1',  type: 'circle', cx: WM_CX, cy: WM_CY, r: 179, fill: null, stroke: '#1e3a8a', strokeWidth: 3,  opacity: 0.12 },
    { id: 'wm-ring2',  type: 'circle', cx: WM_CX, cy: WM_CY, r: 130, fill: null, stroke: '#1e3a8a', strokeWidth: 3,  opacity: 0.12 },
    { id: 'wm-ring3',  type: 'circle', cx: WM_CX, cy: WM_CY, r: 122, fill: null, stroke: '#d4af37', strokeWidth: 5,  opacity: 0.12 },

    // Monitor screen (inside watermark)
    { id: 'wm-monitor', type: 'rect', x: WM_CX - 52, y: WM_CY - 22, width: 72, height: 50, fill: null, stroke: '#1e3a8a', strokeWidth: 5, opacity: 0.12, radius: 3 },

    // Monitor base
    { id: 'wm-base-l', type: 'line', x1: WM_CX - 28, y1: WM_CY + 28, x2: WM_CX - 36, y2: WM_CY + 46, stroke: '#1e3a8a', strokeWidth: 5 },
    { id: 'wm-base-r', type: 'line', x1: WM_CX + 20, y1: WM_CY + 28, x2: WM_CX + 28, y2: WM_CY + 46, stroke: '#1e3a8a', strokeWidth: 5 },
    { id: 'wm-base-h', type: 'line', x1: WM_CX - 40, y1: WM_CY + 46, x2: WM_CX + 32, y2: WM_CY + 46, stroke: '#1e3a8a', strokeWidth: 5 },


    // ══════════════════════════════════════════════════════════════
    //  HEADER ROW  –  Certificate No / Enrollment No
    // ══════════════════════════════════════════════════════════════

    {
      id: 'cert-no', type: 'text',
      x: 22, y: 22,
      text: 'Certificate No: {{certificate_no}}',
      fontSize: 10, fontWeight: 'bold', fill: '#92400e',
    },
    {
      id: 'enroll-no', type: 'text',
      x: 480, y: 22,
      text: 'Enrollment No: {{enrollment_no}}',
      fontSize: 10, fontWeight: 'bold', fill: '#92400e',
    },


    // ══════════════════════════════════════════════════════════════
    //  LOGO ROW  –  MSME | SST (circle) | QRO
    // ══════════════════════════════════════════════════════════════

    {
      id: 'msme-logo', type: 'image',
      src: '/images/logo/msme-logo.jpg',
      x: 22, y: 42, width: 72, height: 72,
    },
    {
      id: 'sst-logo', type: 'image',
      src: '/images/logo/SST-logo.png',
      x: 352, y: 30, width: 96, height: 96,
    },
    {
      id: 'qro-logo', type: 'image',
      src: '/images/SSSS/jaybalajieducation ro logo_20211101090204_20220203085108 (1)_20230819225226.png',
      x: 706, y: 42, width: 72, height: 72,
    },


    // ══════════════════════════════════════════════════════════════
    //  INSTITUTE NAME  (2 lines, centred, dark red bold)
    // ══════════════════════════════════════════════════════════════

    {
      id: 'inst-name-1', type: 'text',
      x: 20, y: 140,
      text: 'SST COMPUTER & WELL KNOWLEDGE',
      fontSize: 32, fontWeight: 'bold', fill: '#900000',
      width: 760, align: 'center',
    },
    {
      id: 'inst-name-2', type: 'text',
      x: 20, y: 180,
      text: 'INSTITUTE',
      fontSize: 32, fontWeight: 'bold', fill: '#900000',
      width: 760, align: 'center',
    },


    // ══════════════════════════════════════════════════════════════
    //  SUBTITLE / CREDENTIAL LINES  (centred, small, bold)
    // ══════════════════════════════════════════════════════════════

    {
      id: 'sub-iso', type: 'text',
      x: 20, y: 204,
      text: 'An ISO 9001:2026 Certified Institute',
      fontSize: 10, fontWeight: 'bold', fill: '#111827',
      width: 760, align: 'center',
    },
    {
      id: 'sub-mca', type: 'text',
      x: 20, y: 217,
      text: 'Registered Under Ministry of Corporate Affairs (Govt. of India)',
      fontSize: 10, fontWeight: 'bold', fill: '#111827',
      width: 760, align: 'center',
    },
    {
      id: 'sub-udyam', type: 'text',
      x: 20, y: 230,
      text: 'Udyam Registration No.: UDYAM-UP-35-0054566',
      fontSize: 10, fontWeight: 'bold', fill: '#111827',
      width: 760, align: 'center',
    },
    {
      id: 'sub-soc', type: 'text',
      x: 20, y: 243,
      text: 'Registered under the Societies Registration Act, 1860 (Act No. 21).',
      fontSize: 10, fontWeight: 'bold', fill: '#111827',
      width: 760, align: 'center',
    },
    {
      id: 'sub-socno', type: 'text',
      x: 20, y: 256,
      text: 'Society Registration No.: HAR/05025/2025-2026',
      fontSize: 10, fontWeight: 'bold', fill: '#111827',
      width: 760, align: 'center',
    },
    {
      id: 'sub-msme', type: 'text',
      x: 20, y: 268,
      text: '(An Autonomous Institute Registered Under the Micro, Small or Medium Enterprise MSME Regd. with Govt. of India)',
      fontSize: 9, fontWeight: 'bold', fill: '#111827',
      width: 760, align: 'center',
    },
    {
      id: 'sub-it', type: 'text',
      x: 20, y: 280,
      text: '(A National Programme Of I.T Education & Computer Literacy)',
      fontSize: 9, fontWeight: 'bold', fill: '#111827',
      width: 760, align: 'center',
    },


    // ══════════════════════════════════════════════════════════════
    //  "Certificate" TITLE + "This is Certified That"
    //  Occupies left ~78 % of the row; photo sits on the right.
    // ══════════════════════════════════════════════════════════════

    {
      id: 'cert-title', type: 'text',
      x: 18, y: 335,
      text: 'Certificate',
      fontSize: 100, fontFamily: 'Times-BoldItalic', fill: '#dc2626',
      width: 590, align: 'center',
    },
    {
      id: 'certified-line', type: 'text',
      x: 18, y: 440,
      text: 'This is Certified That',
      fontSize: 24, fontWeight: 'bold', fill: '#1e3a8a',
      width: 590, align: 'center',
    },


    // ══════════════════════════════════════════════════════════════
    //  STUDENT PHOTO BOX  (right side, same row as title)
    // ══════════════════════════════════════════════════════════════

    // Outer border rect
    {
      id: 'photo-border', type: 'rect',
      x: 626, y: 308, width: 120, height: 150,
      fill: '#ffffff', stroke: '#9ca3af', strokeWidth: 2,
    },
    // Photo image
    {
      id: 'student-photo', type: 'image',
      src: '{{student_photo}}',
      x: 629, y: 311, width: 114, height: 144,
    },


    // ══════════════════════════════════════════════════════════════
    //  STUDENT DETAILS  (4-column: label | value | label | value)
    // ══════════════════════════════════════════════════════════════

    // Row 1
    { id: 'lbl-name',    type: 'text', x: 22,  y: 490, text: 'Mr./Mrs/Miss:',   fontSize: 22, fontWeight: 'bold', fill: '#111827' },
    { id: 'val-name',    type: 'text', x: 170, y: 490, text: '{{student_name}}', fontSize: 36, fontWeight: 'bold', fill: '#000000' },
    { id: 'lbl-father',  type: 'text', x: 440, y: 490, text: "Father's Name:",  fontSize: 22, fontWeight: 'bold', fill: '#111827' },
    { id: 'val-father',  type: 'text', x: 600, y: 490, text: '{{father_name}}',  fontSize: 32, fontWeight: 'bold', fill: '#000000' },

    // Row 2
    { id: 'lbl-mother',  type: 'text', x: 22,  y: 560, text: "Mother's Name :", fontSize: 22, fontWeight: 'bold', fill: '#111827' },
    { id: 'val-mother',  type: 'text', x: 190, y: 560, text: '{{mother_name}}',  fontSize: 32, fontWeight: 'bold', fill: '#000000' },
    { id: 'lbl-dob',     type: 'text', x: 440, y: 560, text: 'Date Of Birth:',   fontSize: 22, fontWeight: 'bold', fill: '#111827' },
    { id: 'val-dob',     type: 'text', x: 600, y: 560, text: '{{dob}}',           fontSize: 32, fontWeight: 'bold', fill: '#000000' },


    // ══════════════════════════════════════════════════════════════
    //  COURSE COMPLETION
    // ══════════════════════════════════════════════════════════════

    {
      id: 'course-header', type: 'text',
      x: 20, y: 620,
      text: 'Has Successfully Completed the Course:',
      fontSize: 22, fontWeight: 'bold', fill: '#900000',
      width: 760, align: 'center',
    },
    {
      id: 'course-name', type: 'text',
      x: 20, y: 660,
      text: '{{course_name}}',
      fontSize: 42, fontWeight: 'bold', fill: '#000000',
      width: 760, align: 'center',
    },


    // ══════════════════════════════════════════════════════════════
    //  RESULT ROWS
    // ══════════════════════════════════════════════════════════════

    // Row 1 – Secured % | Grade
    { id: 'lbl-secured',  type: 'text', x: 22,  y: 550, text: 'And Secured:',   fontSize: 12, fontWeight: 'bold', fill: '#111827' },
    { id: 'val-secured',  type: 'text', x: 118, y: 550, text: '{{secured_percent}}', fontSize: 12, fontWeight: 'bold', fill: '#111827' },
    { id: 'lbl-grade',    type: 'text', x: 390, y: 550, text: 'In the Grade:',  fontSize: 12, fontWeight: 'bold', fill: '#111827' },
    { id: 'val-grade',    type: 'text', x: 488, y: 550, text: '{{grade}}',        fontSize: 12, fontWeight: 'bold', fill: '#111827' },

    // Row 2 – Session | Center Code
    { id: 'lbl-session',  type: 'text', x: 22,  y: 568, text: 'Session:',       fontSize: 12, fontWeight: 'bold', fill: '#111827' },
    { id: 'val-session',  type: 'text', x: 118, y: 568, text: '{{session}}',     fontSize: 12, fontWeight: 'bold', fill: '#111827' },
    { id: 'lbl-cc',       type: 'text', x: 390, y: 568, text: 'Center Code:',   fontSize: 12, fontWeight: 'bold', fill: '#111827' },
    { id: 'val-cc',       type: 'text', x: 488, y: 568, text: '{{center_code}}', fontSize: 12, fontWeight: 'bold', fill: '#111827' },


    // ══════════════════════════════════════════════════════════════
    //  BOTTOM LOGO ROW  (ISO | IAF | Swachh Bharat | Digital India)
    // ══════════════════════════════════════════════════════════════

    {
      id: 'iso-logo', type: 'image',
      src: '/images/SSSS/ISO_9001-2015-jbce6_20210920091101_20220203085121_20230819225005.jpg',
      x: 22, y: 592, width: 48, height: 48,
    },
    {
      id: 'iaf-logo', type: 'image',
      src: '/images/SSSS/download_20220928221937_20221025212704.png',
      x: 84, y: 592, width: 60, height: 48,
    },
    {
      id: 'swachh-logo', type: 'image',
      src: '/images/SSSS/swachh-bharat-abhiyan  jbce 5_20210920091019_20220203085200.png',
      x: 158, y: 592, width: 60, height: 48,
    },
    {
      id: 'digital-logo', type: 'image',
      src: '/images/SSSS/digital india_20231001222002.png',
      x: 232, y: 592, width: 82, height: 48,
    },


    // ══════════════════════════════════════════════════════════════
    //  ISSUE DATE  (centred, bold red)
    // ══════════════════════════════════════════════════════════════

    {
      id: 'issue-date', type: 'text',
      x: 20, y: 662,
      text: 'ISSUE DATE: {{issue_date}}',
      fontSize: 15, fontWeight: 'bold', fill: '#900000',
      width: 760, align: 'center',
    },


    // ══════════════════════════════════════════════════════════════
    //  GRADE SCALE LEGEND  (centred, very small)
    // ══════════════════════════════════════════════════════════════

    {
      id: 'grade-scale-1', type: 'text',
      x: 20, y: 682,
      text: "90% & Above 'A+' Grade,   80% & Above 'A' Grade,   70% & Above 'B' Grade,",
      fontSize: 8, fontWeight: 'bold', fill: '#900000',
      width: 760, align: 'center',
    },
    {
      id: 'grade-scale-2', type: 'text',
      x: 20, y: 694,
      text: "60% & Above 'C' Grade,   50% & Above 'D' Grade,   Below 40% 'Fail'",
      fontSize: 8, fill: '#374151',
      width: 760, align: 'center',
    },


    // ══════════════════════════════════════════════════════════════
    //  QR CODE  (centred between the two signature blocks)
    // ══════════════════════════════════════════════════════════════

    {
      id: 'qr-code', type: 'image',
      src: '{{qr_code}}',
      x: 360, y: 716, width: 80, height: 80,
    },


    // ══════════════════════════════════════════════════════════════
    //  SIGNATURE LINES
    // ══════════════════════════════════════════════════════════════

    // Controller of Exam (left)
    { id: 'ctrl-line',  type: 'line', x1: 22,  y1: 826, x2: 200, y2: 826, stroke: '#111827', strokeWidth: 1 },
    { id: 'ctrl-label', type: 'text', x: 22,  y: 832, text: 'Controller of Exam',  fontSize: 12, fontWeight: 'bold', fill: '#111827' },

    // Authorized Signatory (right)
    { id: 'auth-line',  type: 'line', x1: 600, y1: 826, x2: 778, y2: 826, stroke: '#111827', strokeWidth: 1 },
    { id: 'auth-label', type: 'text', x: 600, y: 832, text: 'Authorized Signatory', fontSize: 12, fontWeight: 'bold', fill: '#111827' },


    // ══════════════════════════════════════════════════════════════
    //  FOOTER  (address + website / verify / email)
    // ══════════════════════════════════════════════════════════════

    {
      id: 'footer-addr', type: 'text',
      x: 20, y: 862,
      text: 'Head Office: {{center_address}}',
      fontSize: 9, fontWeight: 'bold', fill: '#1f2937',
      width: 760, align: 'center',
    },
    {
      id: 'footer-links', type: 'text',
      x: 20, y: 876,
      text: 'Visit On US: www.sstci.in     |     Verify: www.sstci.in/certificate-verify     |     info@sstci.in',
      fontSize: 8, fill: '#1e40af',
      width: 760, align: 'center',
    },

  ],
};


// ─────────────────────────────────────────────────────────────────────────────
// ADVANCED SST CERTIFICATE — WITH DIRECTOR SIGNATURE
// ─────────────────────────────────────────────────────────────────────────────

export const ADVANCED_SST_CERTIFICATE_SIGNATURE_TEMPLATE_NAME =
  'SST Advanced Certificate (With Signature)';

export const ADVANCED_SST_CERTIFICATE_SIGNATURE_TEMPLATE = {
  ...ADVANCED_SST_CERTIFICATE_TEMPLATE,
  name: ADVANCED_SST_CERTIFICATE_SIGNATURE_TEMPLATE_NAME,
  design: [
    ...ADVANCED_SST_CERTIFICATE_TEMPLATE.design.map((item: any) => ({ ...item })),
    // Director signature image placed above the right signatory line
    {
      id: 'director-signature',
      type: 'image',
      src: DEFAULT_SST_DIRECTOR_SIGNATURE,
      x: 600,
      y: 776,
      width: 160,
      height: 48,
    },
  ],
};
