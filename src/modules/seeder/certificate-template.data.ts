export const defaultCertificateTemplates = [
  {
    name: 'Standard Excellence Award',
    isDefault: true,
    dimensions: { width: 1123, height: 794 },
    placeholders: ['student_name', 'course_name', 'date', 'institute_name'],
    design: {
      elements: [
        { id: '1', type: 'text', x: 400, y: 150, text: 'CERTIFICATE', fontSize: 40, fontFamily: 'Arial', fill: '#000', fontWeight: 'bold' },
        { id: '2', type: 'text', x: 380, y: 220, text: 'OF APPRECIATION', fontSize: 20, fontFamily: 'Arial', fill: '#666' },
        { id: '3', type: 'text', x: 300, y: 350, text: 'This is to certify that', fontSize: 18, fontFamily: 'serif', fill: '#333' },
        { id: '4', type: 'text', x: 350, y: 420, text: '{{student_name}}', fontSize: 36, fontFamily: 'serif', fill: '#c00', isPlaceholder: true, fontWeight: 'bold' },
        { id: '5', type: 'text', x: 250, y: 500, text: 'has successfully completed the course of {{course_name}}', fontSize: 18, fontFamily: 'serif', fill: '#333' }
      ]
    }
  }
];
