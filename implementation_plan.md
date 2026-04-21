# Replicate Certificate Design Perfectly

The user has provided a screenshot of the desired certificate and is unhappy with the current design. We will rewrite the SVG generation logic in `certificate-svg-renderer.ts` to exactly match the screenshot's layout, colors, and typography.

## User Review Required

> [!IMPORTANT]
> To achieve the "exact" look of the script font "Certificate", we will use "Brush Script MT" as a high-fidelity fallback available in most font-rendering engines (like Sharp). If the user specifically requires the "Great Vibes" Google Font, we would need to load the .ttf file, which is more complex in a backend environment.

## Proposed Changes

### Certificate Module

#### [MODIFY] [certificate-svg-renderer.ts](file:///d:/Work/NEXT.js/Pradumn/backend-Computer-Management-System/Computer-Management-System-Backend/src/modules/certificate/certificate-svg-renderer.ts)
- **Dimensions**: Set to a standard portrait aspect ratio (900x1270).
- **Frame**: Implement the gold border with precise inner and outer strokes as seen in the image.
- **Watermark**:
  - Re-center at exactly `W/2`.
  - Re-calculate curved text paths for the 900px scale.
  - Implement the monitor/shield icon group with correct proportions.
- **Logos**:
  - Center the SST logo at `W/2`.
  - Place MSME and QRO logos at equal distant margins.
- **Typography**:
  - Use `text-anchor="middle"` for all centered text.
  - Set the Institute name to `font-weight: 900` and dark red.
  - Increase the "Certificate" font size to 110px and use a expressive script font family.
- **Grid Alignment**:
  - Align labels ("Mr./Mrs/Miss:", etc.) and values to fixed columns rather than relative spacing to ensure "same alignment".
- **Footer**:
  - Ensure the "Head Office" and links are styled correctly at the bottom.

## Verification Plan

### Manual Verification
1. I will generate the certificate using the updated service.
2. I will visually compare the resulting PDF/PNG with the user-provided screenshot.
3. I will adjust coordinates by 1-2 pixels iteratively if any misalignment is detected.
