const CERTIFICATE_WIDTH = 1123;
const CERTIFICATE_HEIGHT = 794;

const createCertificateBackgroundSvg = () => `
  <svg xmlns="http://www.w3.org/2000/svg" width="${CERTIFICATE_WIDTH}" height="${CERTIFICATE_HEIGHT}" viewBox="0 0 ${CERTIFICATE_WIDTH} ${CERTIFICATE_HEIGHT}">
    <defs>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f5d56a"/>
        <stop offset="100%" stop-color="#c88a16"/>
      </linearGradient>
      <linearGradient id="brown" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#5e2c12"/>
        <stop offset="100%" stop-color="#3a1508"/>
      </linearGradient>
      <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fffef8"/>
        <stop offset="100%" stop-color="#fff7db"/>
      </linearGradient>
    </defs>
    <rect width="${CERTIFICATE_WIDTH}" height="${CERTIFICATE_HEIGHT}" fill="#fff7df"/>
    <rect x="24" y="24" width="${CERTIFICATE_WIDTH - 48}" height="${CERTIFICATE_HEIGHT - 48}" rx="22" fill="url(#brown)"/>
    <rect x="48" y="48" width="${CERTIFICATE_WIDTH - 96}" height="${CERTIFICATE_HEIGHT - 96}" rx="18" fill="url(#paper)"/>
    <rect x="72" y="72" width="${CERTIFICATE_WIDTH - 144}" height="108" rx="14" fill="#ffffff" stroke="#7b2e14" stroke-width="6"/>
    <path d="M70 ${CERTIFICATE_HEIGHT - 210} C 260 ${CERTIFICATE_HEIGHT - 330}, 470 ${CERTIFICATE_HEIGHT - 60}, ${CERTIFICATE_WIDTH - 70} ${CERTIFICATE_HEIGHT - 190} L ${CERTIFICATE_WIDTH - 70} ${CERTIFICATE_HEIGHT - 60} L 70 ${CERTIFICATE_HEIGHT - 60} Z" fill="#4f1f0e"/>
    <path d="M110 ${CERTIFICATE_HEIGHT - 185} C 300 ${CERTIFICATE_HEIGHT - 300}, 500 ${CERTIFICATE_HEIGHT - 120}, ${CERTIFICATE_WIDTH - 110} ${CERTIFICATE_HEIGHT - 178}" fill="none" stroke="url(#gold)" stroke-width="14" stroke-linecap="round"/>
    <circle cx="${CERTIFICATE_WIDTH - 125}" cy="${CERTIFICATE_HEIGHT - 118}" r="54" fill="#f2d45f" stroke="#9d6a0b" stroke-width="6"/>
    <circle cx="${CERTIFICATE_WIDTH - 125}" cy="${CERTIFICATE_HEIGHT - 118}" r="39" fill="#fff7cf" stroke="#d7a316" stroke-width="3"/>
    <text x="${CERTIFICATE_WIDTH - 125}" y="${CERTIFICATE_HEIGHT - 126}" text-anchor="middle" font-size="16" font-weight="700" font-family="Arial" fill="#8a5a00">ISO</text>
    <text x="${CERTIFICATE_WIDTH - 125}" y="${CERTIFICATE_HEIGHT - 103}" text-anchor="middle" font-size="12" font-family="Arial" fill="#8a5a00">Certified</text>
    <rect x="110" y="${CERTIFICATE_HEIGHT - 62}" width="${CERTIFICATE_WIDTH - 220}" height="18" rx="9" fill="#f4cf26"/>
  </svg>
`;

const createDirectorSignatureSvg = () => `
  <svg xmlns="http://www.w3.org/2000/svg" width="260" height="90" viewBox="0 0 260 90">
    <rect width="260" height="90" fill="transparent"/>
    <text
      x="8"
      y="60"
      font-family="Segoe Script, Brush Script MT, Lucida Handwriting, cursive"
      font-size="44"
      fill="#1f2937"
    >
      Dheeraj
    </text>
    <path d="M8 70 L220 70" stroke="#1f2937" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
  </svg>
`;

const DEFAULT_SST_DIRECTOR_SIGNATURE = `data:image/svg+xml;base64,${Buffer.from(
  createDirectorSignatureSvg(),
).toString('base64')}`;

export const DEFAULT_SST_CERTIFICATE_TEMPLATE_NAME = 'SST Default Certificate';
export const DEFAULT_SST_CERTIFICATE_SIGNATURE_TEMPLATE_NAME = 'SST Default Certificate (Dheeraj Signature)';

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
    { id: 'student-name', type: 'text', x: 145, y: 352, text: '{{student_full_name}}', fontSize: 34, fill: '#111827', fontWeight: 'bold' },
    { id: 'father-line', type: 'text', x: 145, y: 395, text: 'S/o, D/o {{father_name}}', fontSize: 19, fill: '#43362d' },
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
    {
      id: 'director-signature',
      type: 'image',
      src: DEFAULT_SST_DIRECTOR_SIGNATURE,
      x: 730,
      y: 560,
      width: 170,
      height: 60,
    },
  ],
};
