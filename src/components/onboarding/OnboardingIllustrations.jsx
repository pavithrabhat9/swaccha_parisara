import React from 'react';

/**
 * OnboardingIllustrations — Hand-authored 480×360 Line-interior SVG cards.
 * Built with realistic 1:7 adult human proportions, uniform 1.4px indigo linework (#3a2d66),
 * airy white surfaces (~85% of card), pale lavender 1px room/terrace context (#cfc9e0),
 * and sparse flat coastal accents (teal #3fa58a, sage #8cc79b, leaf #5fae7a, mustard #f5c35a,
 * coral #ef5b5b, peach wood #f9c99a).
 */

export function ReportIllustration({ className = 'w-full h-full' }) {
  return (
    <svg viewBox="0 0 480 360" className={className} aria-hidden="true">
      <rect id="sp1-card" width="480" height="360" fill="#ffffff" stroke="none"/>
      <g id="sp1-bg" fill="none" stroke="#cfc9e0" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <g id="sp1-clouds">
          <path d="M42 74h50.4c5.4 0 7.2 -7.2 1.8 -9c-0.9 -8.1 -10.8 -10.8 -15.3 -5.4c-2.7 -9.9 -18 -10.8 -21.6 -0.9c-5.4 -2.7 -11.7 0.9 -10.8 6.3c-5.4 0.9 -6.3 9 -4.5 9Z"/>
          <path d="M254 46h36.4c3.9 0 5.2 -5.2 1.3 -6.5c-0.65 -5.85 -7.8 -7.8 -11.05 -3.9c-1.95 -7.15 -13 -7.8 -15.6 -0.65c-3.9 -1.95 -8.45 0.65 -7.8 4.55c-3.9 0.65 -4.55 6.5 -3.25 6.5Z"/>
          <path d="M384 96h44.8c4.8 0 6.4 -6.4 1.6 -8c-0.8 -7.2 -9.6 -9.6 -13.6 -4.8c-2.4 -8.8 -16 -9.6 -19.2 -0.8c-4.8 -2.4 -10.4 0.8 -9.6 5.6c-4.8 0.8 -5.6 8 -4 8Z"/>
        </g>
        <g id="sp1-birds">
          <path d="M176 48q4 -4.4 8 0q4 -4.4 8 0"/>
          <path d="M194 40q3.2 -3.52 6.4 0q3.2 -3.52 6.4 0"/>
          <path d="M334 62q3.6 -3.96 7.2 0q3.6 -3.96 7.2 0"/>
        </g>
        <g id="sp1-promenade">
          <path d="M58 236V192h28v44M64 192v-6h16v6M92 236V204l16-12 16 12v32M344 236V184h36v52M352 184v-8h20v8M386 236V206h30v30"/>
          <rect x="52" y="236" width="376" height="4" rx="1.5"/>
          <path d="M68 240V308"/>
          <path d="M84 240V308"/>
          <path d="M100 240V308"/>
          <path d="M116 240V308"/>
          <path d="M132 240V308"/>
          <path d="M148 240V308"/>
          <path d="M164 240V308"/>
          <path d="M180 240V308"/>
          <path d="M196 240V308"/>
          <path d="M212 240V308"/>
          <path d="M228 240V308"/>
          <path d="M244 240V308"/>
          <path d="M260 240V308"/>
          <path d="M276 240V308"/>
          <path d="M292 240V308"/>
          <path d="M308 240V308"/>
          <path d="M324 240V308"/>
          <path d="M340 240V308"/>
          <path d="M356 240V308"/>
          <path d="M372 240V308"/>
          <path d="M388 240V308"/>
          <path d="M404 240V308"/>
        </g>
      </g>
      <g id="sp1-fg" stroke="#3a2d66" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path id="sp1-floor" d="M56 308H424M40 308h10M430 308h10" fill="none"/>
        <g id="sp1-plant-l">
          <path d="M78 272C76 250 71 232 64 216M78 272C79 238 78 202 76 170M78 272C80 250 85 232 91 214M77 272C74 262 69 256 62 252M79 272C82 263 87 259 94 255" fill="none"/>
          <path id="sp1-leaf-1" d="M64 217C68.93 210.03 63.59 198.9 58.05 191.53C53.4 185.55 48.24 181.2 46 180C45 182.77 43.69 190.28 44.29 198.22C46.59 207.17 54.36 217.11 64 217Z" fill="#8cc79b"/>
          <path d="M63.05 215.63Q53.2 199.37 47.24 183.97M56.72 205.9L59.15 200.14M55.49 203.75L49.11 202.28M52.15 197.14L55 191.18M51.17 194.87L45.2 193.2" fill="none" strokeWidth="1"/>
          <path id="sp1-leaf-2" d="M76 172C84.85 166.98 86.65 153.59 84.05 144.04C80.46 136.33 75.36 130.05 73 128C71.57 130.31 69.09 137.11 67.94 145.14C66.75 154.95 67.79 168.14 76 172Z" fill="#5fae7a"/>
          <path d="M76.13 170.22Q76.5 149.86 73.92 132.36M76.72 157.81L81.89 153.03M76.72 155.15L71.34 151.1M76.28 147.23L80.98 142.49M76 144.59L70.16 140.57" fill="none" strokeWidth="1"/>
          <path id="sp1-leaf-3" d="M91 215C100.45 215.69 107.89 207 109.99 198.89C110.45 191.61 109.03 184.62 108 182C105.83 182.97 100.84 186.67 96.39 191.89C91.09 198.34 86.05 208.27 91 215Z" fill="#5fae7a"/>
          <path d="M91.9 213.79Q101.28 199.42 106.85 185.58M97.94 205.21L104.26 204.29M99.11 203.31L96.53 197.81M102.27 197.42L108.18 196.29M103.19 195.39L100.21 189.68" fill="none" strokeWidth="1"/>
          <path id="sp1-leaf-4" d="M62 253C64.39 247.24 59.65 242.68 55.2 240.38C51.47 238.58 47.6 237.9 46 238C45.68 239.94 45.72 244.71 47.06 249.06C49.6 253.4 55.77 256.43 62 253Z" fill="#5fae7a"/>
          <path d="M61.23 252.54Q52.97 246.59 47.28 239.84M56.01 249.12L56.92 244.95M54.97 248.32L50.66 249.7M52.03 245.67L53.17 241.25M51.13 244.72L47.06 245.85" fill="none" strokeWidth="1"/>
          <path id="sp1-leaf-5" d="M94 256C100 259.82 106.38 257.17 109.21 252.99C110.83 248.72 111.19 243.96 111 242C109.41 241.8 105.49 242.24 101.64 243.8C97.03 245.83 91.99 250.09 94 256Z" fill="#8cc79b"/>
          <path d="M94.8 255.59Q103.45 250.16 109.59 243.76M100.25 252.5L104.51 254.21M101.35 251.76L100.66 247.46M104.46 249.3L108.5 250.75M105.43 248.4L104.53 243.84" fill="none" strokeWidth="1"/>
          <path d="M64 277H92L88.5 308H67.5Z" fill="#ffffff"/>
          <rect x="61.5" y="270.5" width="33" height="6.5" rx="1.5" fill="#ffffff"/>
          <path d="M71.5 287.5l3 3M74.5 287.5l-3 3M80.5 296.5l3 3M83.5 296.5l-3 3" fill="none" strokeWidth="1"/>
        </g>
        <g id="sp1-map-board">
          <rect x="136" y="182" width="6" height="120" fill="#f9c99a"/>
          <rect x="234" y="182" width="6" height="120" fill="#f9c99a"/>
          <rect x="130" y="302" width="18" height="6" rx="1.2" fill="#ffffff"/>
          <rect x="228" y="302" width="18" height="6" rx="1.2" fill="#ffffff"/>
          <rect x="142" y="254" width="92" height="4.5" fill="#f9c99a"/>
          <rect x="122" y="84" width="132" height="102" rx="2.5" fill="#ffffff"/>
          <rect x="127" y="89" width="122" height="92" rx="1" fill="#ffffff" strokeWidth="1"/>
          <path d="M127 148C156 142 178 124 202 108C218 98 234 94 249 92" fill="none" stroke="#3fa58a" strokeWidth="1.8"/>
          <path d="M127 122H249M164 89V181M214 89V181" fill="none" stroke="#ab9ee6" strokeWidth="1"/>
          <circle cx="204" cy="126" r="7.5" fill="#ffffff" stroke="#ef5b5b" strokeWidth="1.2"/>
          <circle cx="204" cy="126" r="3.2" fill="#ef5b5b" stroke="none"/>
          <circle cx="154" cy="154" r="5.5" fill="#ffffff" stroke="#3fa58a" strokeWidth="1.2"/>
          <circle cx="154" cy="154" r="2.2" fill="#3fa58a" stroke="none"/>
          <rect x="133" y="95" width="24" height="9" rx="0.8" fill="#f5c35a" strokeWidth="1"/>
          <text x="145" y="101.4" fontFamily="ui-monospace, monospace" fontSize="5" fontWeight="700" textAnchor="middle" fill="#3a2d66" stroke="none">MAP</text>
        </g>
        <path d="M307.61 135.03L300.58 166.25Q301 168.58 298.56 168.69Q287.32 175.23 275.5 180.71L272.31 180.7L270.81 177.99L272.5 175.29L292.64 164.18L299.19 133.25Z" fill="#e2a57c"/>
        <g id="sp1-phone" transform="translate(256 164) rotate(-10)">
          <rect x="0" y="0" width="12" height="20" rx="1.4" fill="#ffffff"/>
          <path d="M2.5 5h7M2.5 8.5h4.5" fill="none" stroke="#3fa58a" strokeWidth="1.4"/>
          <circle cx="6" cy="14" r="1.4" fill="#ef5b5b" stroke="none"/>
        </g>
        <g id="sp1-hand-far" transform="translate(274 178) rotate(174) scale(1.05 1.05)" strokeWidth="1.33">
          <path d="M0 4.2C2.4 4.7 4.8 4.9 7 4.8H12.6C13.9 4.8 14.5 3.6 13.6 2.8C15 3 16.3 2 15.6 0.7C16.8 0.5 17.1 -1 16 -1.4C16.9 -1.8 16.7 -3.3 15.4 -3.4H8.6C5.8 -3.4 2.8 -3.3 0 -3.2Z" fill="#e2a57c" stroke="none"/>
          <path d="M0 4.2C2.4 4.7 4.8 4.9 7 4.8H12.6C13.9 4.8 14.5 3.6 13.6 2.8C15 3 16.3 2 15.6 0.7C16.8 0.5 17.1 -1 16 -1.4C16.9 -1.8 16.7 -3.3 15.4 -3.4H8.6C5.8 -3.4 2.8 -3.3 0 -3.2" fill="none"/>
          <path d="M13.6 2.8H7.1M15.6 0.7H7.4M16 -1.4H7.8" fill="none" strokeWidth="0.86"/>
        </g>
        <path d="M318 279.62L319.27 293.35L310.91 294.13L309.63 280.4Z" fill="#e2a57c"/>
        <g transform="translate(324.84 297.83) rotate(-24) scale(-1 1)">
          <path d="M0 0V-7.5C0 -9.6 1.8 -10.6 4.6 -10.6H9C12 -10.2 14 -8.6 16.4 -7.4C19.6 -6 23.4 -5.4 25 -3.2C25.6 -2 25.6 -0.8 25 0Z" fill="#3fa58a"/>
          <path d="M0 -3V0H25C25.5 -1 25.6 -2 25.4 -3Z" fill="#ffffff"/>
          <path d="M13.6 -8.6l-1.6 2.4M17 -7.2l-1.6 2.4" fill="none" strokeWidth="1"/>
        </g>
        <path d="M293.43 188.76C294.3 195.76 296.77 218.44 298.64 230.79C300.51 243.14 303.05 254.18 304.66 262.85C306.26 271.53 307.66 279.53 308.26 282.86L319.74 281.14C319.34 277.81 318.07 269.8 317.34 261.15C316.61 252.49 315.82 241.53 315.36 229.21C314.9 216.89 314.7 194.24 314.57 187.24A10.6 10.6 0 0 0 293.43 188.76Z" fill="#7f9fdc"/>
        <path d="M319.66 275.89L320.63 281.01L307.37 282.99L306.8 277.82Z" fill="#7f9fdc"/>
        <path d="M292.09 288.78L292.7 300.17L284.31 300.62L283.7 289.23Z" fill="#e2a57c"/>
        <g transform="translate(295 308) scale(-1 1)">
          <path d="M0 0V-7.5C0 -9.6 1.8 -10.6 4.6 -10.6H9C12 -10.2 14 -8.6 16.4 -7.4C19.6 -6 23.4 -5.4 25 -3.2C25.6 -2 25.6 -0.8 25 0Z" fill="#3fa58a"/>
          <path d="M0 -3V0H25C25.5 -1 25.6 -2 25.4 -3Z" fill="#ffffff"/>
          <path d="M13.6 -8.6l-1.6 2.4M17 -7.2l-1.6 2.4" fill="none" strokeWidth="1"/>
        </g>
        <path d="M284.03 187.29C283.86 194.33 283.22 215.78 283.01 229.51C282.81 243.25 282.94 259.49 282.81 269.7C282.67 279.9 282.31 287.22 282.21 290.72L293.79 291.28C294.03 287.78 294.33 280.44 295.19 270.3C296.06 260.17 297.52 244.09 298.99 230.49C300.45 216.89 303.14 195.67 303.97 188.71A10 10 0 0 0 284.03 187.29Z" fill="#7f9fdc"/>
        <path d="M294.74 286.12L294.69 291.32L281.31 290.68L281.75 285.5Z" fill="#7f9fdc"/>
        <rect x="282" y="186" width="33" height="5" rx="0.8" fill="#7f9fdc"/>
        <g transform="rotate(-6 298 188)">
          <g transform="translate(298 102) scale(-1 1)">
            <path d="M-6 12L-7 27L-1 33L5.4 26.6L4 12Z" fill="#e2a57c"/>
            <path d="M-8 25C-14 27 -18 32 -19 39C-20 48 -18 58 -17 68C-16.4 74 -17 80 -18 85C-9 87.4 2 87.6 13 86C13 80 12 74 11.6 68C11.4 61 14.6 53 14.6 45C14.6 36 11 29 5 26.6L-1 32Z" fill="#ffffff"/>
            <path d="M-8 25L-1 32L-4.4 34.6L-9.4 27.4ZM5 26.6L-1 32L2.6 34.6L7 28.6Z" fill="#ffffff"/>
            <path d="M-15 72c3 3.4 7.4 5.6 12.6 6.4M7 54c1 2.6 1.6 5.2 1.6 8" fill="none" strokeWidth="1"/>
          </g>
          <g transform="translate(298 102) rotate(-5) scale(-1 1)">
            <circle cx="-8.4" cy="-19" r="6.4" fill="#7b4b3a"/>
            <path d="M-11.6 -21.2c1.4-1.6 3.4-2.2 5.4-1.8" fill="none" stroke="#f6a85e" strokeWidth="1"/>
            <path d="M-4 15C-9 13 -12.6 8 -13 1C-13.4 -9 -8 -18.6 1 -19.4C7 -19.8 11.6 -16.6 12.6 -11.8L-1 8Z" fill="#7b4b3a"/>
            <path d="M-3 -16.5C5 -16.5 10.5 -11.5 11 -4.5C11.2 -2.5 11.6 -0.6 12.6 1.4C13.4 3 13.4 4.4 12.4 5C11.8 5.4 11.4 5.6 11 6C11.6 7 11.6 8.2 11 9C10.8 10.5 10.2 12 8.6 13.8C6 16.4 2 17 -1.5 15.5C-5 14 -8 9.5 -9 4C-10 -4 -9 -16.5 -3 -16.5Z" fill="#e2a57c"/>
            <path d="M-13 1C-13.4 -9 -8 -18.6 1 -19.4C7.4 -19.8 12 -16.4 12.8 -11.4C13 -9.6 12.4 -8.4 11.4 -8.4C10.2 -11.2 7.4 -13.4 3.6 -13.6C1.6 -11.2 -1 -9.6 -3.6 -8.8C-3.2 -6.4 -3.6 -4 -4.6 -2.4C-6.8 -3.2 -8.6 -1.8 -8.8 0.6C-9 2.6 -8.6 4.6 -7.8 6.4C-10.8 6 -12.8 4.2 -13 1Z" fill="#7b4b3a"/>
            <path d="M-5 -15.6c2.6-1.8 6-2.4 9-1.8M7.6 -15.4c1.4.6 2.6 1.6 3.4 2.8" fill="none" stroke="#f6a85e" strokeWidth="1"/>
            <path d="M-3.6 -2.6C-6.1 -3.8 -7.9 -1.8 -7.6 0.7C-7.3 3.1 -5.7 4.4 -3.7 4Z" fill="#e2a57c"/>
            <path d="M-4.9 -0.8c-.9.3-1.1 1.6-.4 2.6" fill="none" strokeWidth="1"/>
            <circle cx="-5.2" cy="6.2" r="1.3" fill="#f5c35a" strokeWidth="1"/>
            <circle cx="4.6" cy="-1.4" r="1.15" fill="#3a2d66" stroke="none"/>
            <circle cx="9.5" cy="-1.5" r="1" fill="#3a2d66" stroke="none"/>
            <path d="M2.6 -5.2c1.1-.6 2.6-.7 3.8-.3M8.4 -5c.7-.4 1.5-.5 2.2-.3M3 -1.8l-1.2-.8" fill="none" strokeWidth="1"/>
            <path d="M11.9 5.2c-.7.5-1.5.6-2.3.2" fill="none" strokeWidth="1"/>
            <path d="M10.1 9.3c-.9.6-2 .6-2.8 0" fill="none" strokeWidth="1"/>
          </g>
        </g>
        <path d="M296.01 139.41L262.02 151.26Q260.13 152.96 258.65 150.79Q245.42 143.71 232.78 135.58L230.99 132.7L232.59 129.81L235.99 129.82L259.38 142.85L292.89 130.75Z" fill="#e2a57c"/>
        <path d="M259.38 142.85l2.82 -1.02" fill="none" strokeWidth="1"/>
        <path d="M302.05 135.53C303.75 140.23 297.17 142.61 294.67 141.59L284.19 144.95Q280.9 139.97 280.25 134.04L291.4 129.59C295.17 128.23 300.01 129.88 302.05 135.53Z" fill="#ffffff"/>
        <g id="sp1-hand-near" transform="translate(234.39 132.7) rotate(188) scale(1.1 -1.1)" strokeWidth="1.27">
          <path d="M0 -3.6C3 -4.4 6 -4.8 9 -4.6L19.6 -4.4C21 -4.3 21 -2.1 19.6 -2L11.2 -1.8C12.6 -1.2 13 0.4 12 1.1C12.8 1.8 12.6 3.4 11.4 3.7C11.9 4.4 11.5 5.8 10.2 5.9C8.2 6 5.6 5.4 3.6 4.4C2.4 3.9 1.2 3.6 0 3.5Z" fill="#e2a57c" stroke="none"/>
          <path d="M0 -3.6C3 -4.4 6 -4.8 9 -4.6L19.6 -4.4C21 -4.3 21 -2.1 19.6 -2L11.2 -1.8C12.6 -1.2 13 0.4 12 1.1C12.8 1.8 12.6 3.4 11.4 3.7C11.9 4.4 11.5 5.8 10.2 5.9C8.2 6 5.6 5.4 3.6 4.4C2.4 3.9 1.2 3.6 0 3.5" fill="none"/>
          <path d="M12 1.1C10.8 0.9 9.8 1 8.8 1.3M11.4 3.7C10.4 3.5 9.4 3.6 8.4 3.9" fill="none" strokeWidth="0.82"/>
          <path d="M4.4 -3.4C6.4 -3.2 8.6 -2.4 10.2 -1.2C11 -0.6 10.4 0.6 9.4 0.2C8 -0.4 6.4 -0.8 5 -0.8Z" fill="#e2a57c"/>
        </g>
        <g id="sp1-bin-r">
          <rect x="356" y="242" width="38" height="66" rx="2" fill="#ffffff"/>
          <rect x="353" y="236" width="44" height="6" rx="1.5" fill="#3fa58a"/>
          <rect x="364" y="258" width="22" height="11" rx="1" fill="#ffffff" strokeWidth="1"/>
          <text x="375" y="265.5" fontFamily="ui-monospace, monospace" fontSize="4.8" fontWeight="700" textAnchor="middle" fill="#3a2d66" stroke="none">PET</text>
          <path d="M408.2 284C406.2 266.9 406 253.6 408 246C409.6 257.4 417.2 268.8 415.8 284Z" fill="#3fa58a"/>
          <path d="M414.8 284C412.8 261.5 418 244 420 234C421.6 249 424.6 264 423.2 284Z" fill="#5fae7a"/>
          <path d="M422.4 284C420.4 268.7 429 256.8 431 250C432.6 260.2 431 270.4 429.6 284Z" fill="#8cc79b"/>
          <path d="M405 284H433L430 308H408Z" fill="#f6a85e"/>
          <path d="M407.7 296H430.3" fill="none" strokeWidth="1"/>
        </g>
      </g>
    </svg>
  );
}

export function PickupIllustration({ className = 'w-full h-full' }) {
  return (
    <svg viewBox="0 0 480 360" className={className} aria-hidden="true">
      <rect id="sp2-card" width="480" height="360" fill="#ffffff" stroke="none"/>
      <g id="sp2-bg" fill="none" stroke="#cfc9e0" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <g id="sp2-bricks-a">
          <rect x="44" y="72" width="14" height="6" rx="0.6"/>
          <rect x="59" y="72" width="14" height="6" rx="0.6"/>
          <rect x="51" y="79" width="14" height="6" rx="0.6"/>
          <rect x="66" y="79" width="14" height="6" rx="0.6"/>
        </g>
        <g id="sp2-bricks-b">
          <rect x="412" y="152" width="14" height="6" rx="0.6"/>
          <rect x="404" y="159" width="14" height="6" rx="0.6"/>
          <rect x="419" y="159" width="14" height="6" rx="0.6"/>
          <rect x="427" y="166" width="14" height="6" rx="0.6"/>
        </g>
        <g id="sp2-bricks-c">
          <rect x="252" y="66" width="14" height="6" rx="0.6"/>
          <rect x="267" y="66" width="14" height="6" rx="0.6"/>
          <rect x="259" y="73" width="14" height="6" rx="0.6"/>
        </g>
        <g id="sp2-lamp-a">
          <path d="M116 0V36"/>
          <path d="M104 48C104 40.5 109.5 36 116 36S128 40.5 128 48Z"/>
          <path d="M113 48.5a3 3 0 0 0 6 0"/>
          <path d="M116 55v5M108 53.5l-2.5 4M124 53.5l2.5 4"/>
        </g>
        <g id="sp2-lamp-b">
          <path d="M396 0V52"/>
          <path d="M392 52h8l6 12h-20Z"/>
          <path d="M393 64.5a3 3 0 0 0 6 0"/>
          <path d="M396 71v5M388 69.5l-2.5 4M404 69.5l2.5 4"/>
        </g>
        <g id="sp2-poster">
          <path d="M358 68L342 78M358 68L374 78"/>
          <rect x="336" y="78" width="44" height="54" rx="1"/>
          <rect x="340" y="82" width="36" height="46"/>
          <g transform="translate(336 78)">
            <rect x="8" y="10" width="28" height="16"/>
            <path d="M12 22l6-7 5 5 4-3 5 5"/>
            <path d="M8 32h22M8 37h15M8 42h18"/>
          </g>
        </g>
      </g>
      <g id="sp2-fg" stroke="#3a2d66" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path id="sp2-floor" d="M56 308H424M40 308h10M430 308h10" fill="none"/>
        <g id="sp2-plant-l">
          <path d="M68 278C68 250 67 214 69 164" fill="none"/>
          <path d="M68 238l-8 -6M68 214l8 -5M68.4 192l-7 -5" fill="none" strokeWidth="1"/>
          <path id="sp2-fig-1" d="M69 174C71.91 168.17 71.51 159.14 69.37 151.77C66.75 146.75 60.68 146.25 58 148C54.88 148.71 51.01 153.41 52.79 158.79C56.59 165.46 62.79 172.03 69 174Z" fill="#5fae7a"/>
          <path d="M68.56 172.96L59.54 151.64M64.6 163.6L67.81 157.34M62.18 157.88L55.67 156.34" fill="none" strokeWidth="1"/>
          <path id="sp2-fig-2" d="M69 188C75.75 188.78 84.35 185.19 90.67 180.48C94.54 176.14 92.71 170.01 90 168C88.13 165.19 82.1 163.06 77.57 166.72C72.55 172.81 68.55 181.22 69 188Z" fill="#8cc79b"/>
          <path d="M69.84 187.2L87.06 170.8M77.4 180L84.69 180.93M82.02 175.6L81.03 168.67" fill="none" strokeWidth="1"/>
          <path id="sp2-fig-3" d="M61 190C61.74 183.59 58.32 175.42 53.84 169.4C49.72 165.71 43.9 167.43 42 170C39.34 171.77 37.32 177.49 40.8 181.8C46.58 186.58 54.56 190.41 61 190Z" fill="#5fae7a"/>
          <path d="M60.24 189.2L44.66 172.8M53.4 182L54.27 175.08M49.22 177.6L42.65 178.52" fill="none" strokeWidth="1"/>
          <path id="sp2-fig-4" d="M75 210C80.9 212.02 88.94 210.44 95.11 207.41C99.06 204.23 98.17 198.34 96 196C94.67 193.1 89.58 190.01 85.13 192.43C79.96 196.96 75.4 203.78 75 210Z" fill="#5fae7a"/>
          <path d="M75.84 209.44L93.06 197.96M83.4 204.4L89.76 206.65M88.02 201.32L87.96 194.87" fill="none" strokeWidth="1"/>
          <path id="sp2-fig-5" d="M60 232C59.65 226.25 55.54 220.13 50.86 216.17C46.83 214.13 42.21 217.24 41 220C39.03 222.28 38.21 227.79 41.78 230.55C47.36 233.07 54.65 234.15 60 232Z" fill="#8cc79b"/>
          <path d="M59.24 231.52L43.66 221.68M52.4 227.2L52.08 220.97M48.22 224.56L42.84 227.19" fill="none" strokeWidth="1"/>
          <path id="sp2-fig-6" d="M68 252C72.63 254.89 79.67 255.09 85.37 253.67C89.22 251.7 89.44 246.44 88 244C87.36 241.24 83.58 237.58 79.43 238.81C74.33 241.71 69.37 246.71 68 252Z" fill="#8cc79b"/>
          <path d="M68.8 251.68L85.2 245.12M76 248.8L80.98 251.98M80.4 247.04L81.42 241.46" fill="none" strokeWidth="1"/>
          <path d="M53 278H83L80 308H56Z" fill="#f9c99a"/>
          <path d="M55.2 288H80.8" fill="none" strokeWidth="1"/>
          <path d="M56.2 298H79.8" fill="none" strokeWidth="1"/>
        </g>
        <g id="sp2-sorting-shelf">
          <path d="M216 308L228 114Q229.8 111.5 231.6 114L219.6 308Z" fill="#f9c99a"/>
          <path d="M308.4 308L296.4 114Q298.2 111.5 300 114L312 308Z" fill="#f9c99a"/>
          <rect x="234" y="130" width="28" height="22" rx="1.2" fill="#ffffff"/>
          <rect x="238" y="136" width="20" height="8" rx="0.8" fill="#3fa58a" strokeWidth="1"/>
          <text x="248" y="141.8" fontFamily="ui-monospace, monospace" fontSize="4.6" fontWeight="700" textAnchor="middle" fill="#ffffff" stroke="none">PET</text>
          <rect x="268" y="124" width="11" height="28" rx="1.5" fill="#ffffff"/>
          <rect x="270.5" y="119" width="6" height="5" rx="0.8" fill="#ef5b5b" strokeWidth="1"/>
          <rect x="282" y="128" width="10" height="24" rx="1.5" fill="#ffffff"/>
          <rect x="228" y="180" width="44" height="26" rx="1.5" fill="#ffffff"/>
          <path d="M236 186h28M240 194l3 3M243 194l-3 3M258 194l3 3M261 194l-3 3" fill="none" strokeWidth="1"/>
          <rect x="276" y="184" width="22" height="22" rx="1.2" fill="#ffffff"/>
          <rect x="279" y="190" width="16" height="7.5" rx="0.6" fill="#f5c35a" strokeWidth="1"/>
          <text x="287" y="195.4" fontFamily="ui-monospace, monospace" fontSize="4.4" fontWeight="700" textAnchor="middle" fill="#3a2d66" stroke="none">BAG</text>
          <rect x="228" y="250" width="36" height="8" rx="0.8" fill="#ab9ee6"/>
          <rect x="230" y="243" width="32" height="7" rx="0.8" fill="#ffffff"/>
          <rect x="268" y="236" width="32" height="22" rx="1.2" fill="#ffffff"/>
          <path d="M276 244h16M276 249h10" fill="none" strokeWidth="1"/>
          <rect x="224" y="152" width="80" height="3.5" rx="1" fill="#f9c99a"/>
          <rect x="221" y="206" width="86" height="3.5" rx="1" fill="#f9c99a"/>
          <rect x="218" y="258" width="92" height="3.5" rx="1" fill="#f9c99a"/>
        </g>
        <path d="M156.61 134.57L146.5 164.94Q147.78 165.44 146.28 165Q141.16 180.22 134.92 195.04L132.52 197.15L129.6 196.11L129.08 192.96L127.91 196.24L148.42 131.96Z" fill="#b47852"/>
        <g id="sp2-hand-far" transform="translate(132 194) rotate(84) scale(1.05 1.05)" strokeWidth="1.33">
          <path d="M0 -3.4C3 -4 6.2 -4.2 9.2 -3.8C11.8 -3.4 13.6 -2 14.4 0.2C15 1.8 15 3.8 14.4 5.6C14 6.8 12.6 6.8 12.4 5.6C12.6 6.8 11.6 7.6 10.6 7.2C10.6 8 9.6 8.6 8.6 8.1C8.4 8.8 7.2 9.2 6.4 8.4C5.6 7.4 5.4 5.6 4.8 4.4C3.6 3.8 2 3.6 0 3.4Z" fill="#b47852" stroke="none"/>
          <path d="M0 -3.4C3 -4 6.2 -4.2 9.2 -3.8C11.8 -3.4 13.6 -2 14.4 0.2C15 1.8 15 3.8 14.4 5.6C14 6.8 12.6 6.8 12.4 5.6C12.6 6.8 11.6 7.6 10.6 7.2C10.6 8 9.6 8.6 8.6 8.1C8.4 8.8 7.2 9.2 6.4 8.4C5.6 7.4 5.4 5.6 4.8 4.4C3.6 3.8 2 3.6 0 3.4" fill="none"/>
          <path d="M12.4 5.6C12.4 4.6 12.2 3.6 11.8 2.8M10.6 7.2C10.6 6 10.4 4.8 10 4M8.6 8.1C8.6 6.8 8.2 5.6 7.6 4.6" fill="none" strokeWidth="0.86"/>
          <path d="M7.4 -3.6C9.6 -3.8 12 -3.2 13.6 -1.8C14.4 -1.1 13.8 0 12.8 -0.4C11.2 -1 9.6 -1.2 8.2 -1Z" fill="#b47852"/>
        </g>
        <path d="M140.6 281.28L136.55 294.86L128.5 292.46L132.55 278.88Z" fill="#b47852"/>
        <g transform="translate(123.16 297.83) rotate(24)">
          <path d="M0 0V-7.5C0 -9.6 1.8 -10.6 4.6 -10.6H9C12 -10.2 14 -8.6 16.4 -7.4C19.6 -6 23.4 -5.4 25 -3.2C25.6 -2 25.6 -0.8 25 0Z" fill="#ef5b5b"/>
          <path d="M0 -3V0H25C25.5 -1 25.6 -2 25.4 -3Z" fill="#ffffff"/>
          <path d="M13.6 -8.6l-1.6 2.4M17 -7.2l-1.6 2.4" fill="none" strokeWidth="1"/>
        </g>
        <path d="M135.63 185.26C135.49 192.25 135.33 214.91 134.84 227.23C134.34 239.55 133.42 250.18 132.65 259.18C131.89 268.18 130.65 277.54 130.25 281.22L141.75 282.78C142.35 279.12 143.78 269.82 145.35 260.82C146.92 251.82 149.33 241.12 151.16 228.77C153 216.43 155.51 193.75 156.37 186.74A10.4 10.4 0 0 0 135.63 185.26Z" fill="#7f9fdc"/>
        <path d="M143.14 277.73L142.64 282.91L129.36 281.09L130.26 275.97Z" fill="#7f9fdc"/>
        <path d="M168.3 289.23L167.69 300.62L159.3 300.17L159.91 288.78Z" fill="#b47852"/>
        <g transform="translate(157 308)">
          <path d="M0 0V-7.5C0 -9.6 1.8 -10.6 4.6 -10.6H9C12 -10.2 14 -8.6 16.4 -7.4C19.6 -6 23.4 -5.4 25 -3.2C25.6 -2 25.6 -0.8 25 0Z" fill="#ef5b5b"/>
          <path d="M0 -3V0H25C25.5 -1 25.6 -2 25.4 -3Z" fill="#ffffff"/>
          <path d="M13.6 -8.6l-1.6 2.4M17 -7.2l-1.6 2.4" fill="none" strokeWidth="1"/>
        </g>
        <path d="M148.03 186.71C148.86 193.67 151.55 214.89 153.01 228.49C154.48 242.08 155.94 257.83 156.81 268.29C157.67 278.76 157.97 287.43 158.21 291.25L169.79 290.75C169.69 286.91 169.33 278.24 169.19 267.71C169.06 257.17 169.19 241.25 168.99 227.51C168.78 213.78 168.14 192.33 167.97 185.29A10 10 0 0 0 148.03 186.71Z" fill="#7f9fdc"/>
        <path d="M170.27 285.52L170.69 290.71L157.31 291.29L157.28 286.09Z" fill="#7f9fdc"/>
        <rect x="136" y="181.9" width="33" height="5" rx="0.8" fill="#7f9fdc"/>
        <g transform="rotate(6 152 186)">
          <g transform="translate(154 102)">
            <path d="M-6 7.5 L-6.4 22.5 L-0.6 28.5 L5 22.5 L4.6 7.5Z" fill="#b47852"/>
            <path d="M-8 21.1 C-13.6 22.9 -17 27.9 -17.6 35.1 C-18.2 44.1 -16.6 54.1 -16.2 63.9 C-15.9 70.9 -16.4 77.1 -16.8 83.7 H14.2 C14.5 76.9 13.7 70.1 13.6 63.3 C13.4 55.1 15.8 47.1 15.6 38.9 C15.4 31.1 12.4 25.1 6.4 22.7 C3.6 26.3 -4.4 25.9 -8 21.1Z" fill="#f5c35a"/>
            <path d="M-13.4 74.1c3 2.4 7 3.6 11.4 3.8M9.4 68.5c.8 2.2 1 4.4.8 6.6" fill="none" strokeWidth="1"/>
          </g>
          <g transform="translate(154 102) rotate(5)">
            <path d="M-7 12C-11.6 8 -13.2 1 -12.6 -6C-12 -14 -6 -19.6 2 -19.6L-2 6Z" fill="#3a2d66"/>
            <path d="M-3 -16.5C5 -16.5 10.5 -11.5 11 -4.5C11.2 -2.5 11.6 -0.6 12.6 1.4C13.4 3 13.4 4.4 12.4 5C11.8 5.4 11.4 5.6 11 6C11.6 7 11.6 8.2 11 9C10.8 10.5 10.2 12 8.6 13.8C6 16.4 2 17 -1.5 15.5C-5 14 -8 9.5 -9 4C-10 -4 -9 -16.5 -3 -16.5Z" fill="#b47852"/>
            <path d="M-12.6 -6C-12 -14.6 -5 -20.6 3.4 -20.4C9.2 -20.2 13.6 -17.4 14.6 -13.2C15 -11.6 14.4 -10.4 13.2 -10.6C12 -12.4 9.8 -13.2 7.4 -12.8C5 -12.4 2.6 -11.8 0.6 -10.4C-0.6 -9.6 -1.6 -8 -2.2 -6C-2.6 -4.2 -3.4 -2.8 -4.4 -2.4C-5.4 -4 -7 -4.4 -8.4 -3.6C-9.2 -1.6 -9.4 0.6 -9.2 3C-11.8 1.6 -12.8 -2.2 -12.6 -6Z" fill="#3a2d66"/>
            <path d="M-4 -16.4c3-1.8 7-2.2 10.4-1.2M8.6 -16c1.6.6 2.8 1.6 3.6 2.8" fill="none" stroke="#7f6cc4" strokeWidth="1"/>
            <path d="M-3.6 -2.6C-6.1 -3.8 -7.9 -1.8 -7.6 0.7C-7.3 3.1 -5.7 4.4 -3.7 4Z" fill="#b47852"/>
            <path d="M-4.9 -0.8c-.9.3-1.1 1.6-.4 2.6" fill="none" strokeWidth="1"/>
            <circle cx="4.6" cy="-1.4" r="1.15" fill="#3a2d66" stroke="none"/>
            <circle cx="9.5" cy="-1.5" r="1" fill="#3a2d66" stroke="none"/>
            <path d="M2.6 -5.2c1.1-.6 2.6-.7 3.8-.3M8.4 -5c.7-.4 1.5-.5 2.2-.3" fill="none" strokeWidth="1"/>
            <circle cx="4.6" cy="-1.4" r="3.8" fill="none" strokeWidth="1"/>
            <path d="M8.4 -1.8c.6-.2 1.2-.2 1.8 0M11.6 -4.2c.9 1.5.9 3.4.2 5M0.8 -1.6L-4.4 -2.4" fill="none" strokeWidth="1"/>
            <path d="M11.9 5.2c-.7.5-1.5.6-2.3.2" fill="none" strokeWidth="1"/>
            <path d="M10.1 9.3c-.9.6-2 .6-2.8 0" fill="none" strokeWidth="1"/>
          </g>
        </g>
        <g id="sp2-bottle-held">
          <rect x="205" y="152" width="12" height="24" rx="1.5" fill="#ffffff"/>
          <rect x="205" y="160" width="12" height="5" fill="#3fa58a" strokeWidth="1"/>
          <rect x="208" y="148" width="6" height="4" rx="0.8" fill="#ef5b5b" strokeWidth="1"/>
        </g>
        <path d="M157.45 134.31L162.04 169.01Q162.7 172.96 166.67 172.47Q181.6 170.97 196.39 168.28L199.14 166.29L198.76 163.01L195.61 161.72L170.38 164.69L166.58 133.21Z" fill="#b47852"/>
        <path d="M170.38 164.69l-0.36 -2.98" fill="none" strokeWidth="1"/>
        <path d="M164.16 126.45C169.12 125.85 169.96 132.8 168.81 134.96L169.85 146.92Q163.86 149.05 157.54 148.4L155.58 135.54C155.1 131.57 158.2 127.17 164.16 126.45Z" fill="#f5c35a"/>
        <g id="sp2-hand-near" transform="translate(196 165) rotate(-8) scale(1.08 1.08)" strokeWidth="1.3">
          <path d="M0 -4C2.6 -4.6 5.6 -4.8 8.6 -4.8H14.6C15.8 -4.8 16.4 -3.6 15.6 -2.8C16.6 -2.6 16.8 -1 15.8 -0.6C16.8 -0.3 16.8 1.3 15.8 1.6C16.6 2 16.4 3.4 15.2 3.6H8.4C5.2 3.6 2.4 3.6 0 3.8Z" fill="#b47852" stroke="none"/>
          <path d="M0 -4C2.6 -4.6 5.6 -4.8 8.6 -4.8H14.6C15.8 -4.8 16.4 -3.6 15.6 -2.8C16.6 -2.6 16.8 -1 15.8 -0.6C16.8 -0.3 16.8 1.3 15.8 1.6C16.6 2 16.4 3.4 15.2 3.6H8.4C5.2 3.6 2.4 3.6 0 3.8" fill="none"/>
          <path d="M15.6 -2.8H7.6M15.8 -0.6H7.4M15.8 1.6H7.8" fill="none" strokeWidth="0.83"/>
          <path d="M6.4 -4.4C8.4 -6 10.8 -7.4 13 -8C14.2 -8.3 14.7 -7 13.8 -6.4C12 -5.2 10.4 -4.6 9.4 -4.2Z" fill="#b47852"/>
        </g>
        <g id="sp2-trolley">
          <rect x="346" y="292" width="76" height="4.5" rx="1.5" fill="#ffffff"/>
          <circle cx="356" cy="303.5" r="4.5" fill="#ffffff"/>
          <circle cx="356" cy="303.5" r="1.2" fill="#3a2d66" stroke="none"/>
          <circle cx="412" cy="303.5" r="4.5" fill="#ffffff"/>
          <circle cx="412" cy="303.5" r="1.2" fill="#3a2d66" stroke="none"/>
          <rect x="350" y="236" width="68" height="56" rx="2" fill="#ffffff"/>
          <rect x="347" y="230" width="74" height="6" rx="1.5" fill="#3fa58a"/>
          <path d="M376 258l5 5 11-11" fill="none" stroke="#3fa58a" strokeWidth="1.8"/>
          <path d="M362 276h44M370 282h28" fill="none" strokeWidth="1"/>
        </g>
      </g>
    </svg>
  );
}

export function RewardsIllustration({ className = 'w-full h-full' }) {
  return (
    <svg viewBox="0 0 480 360" className={className} aria-hidden="true">
      <rect id="sp3-card" width="480" height="360" fill="#ffffff" stroke="none"/>
      <g id="sp3-bg" fill="none" stroke="#cfc9e0" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <g id="sp3-bricks-a">
          <rect x="42" y="146" width="14" height="6" rx="0.6"/>
          <rect x="57" y="146" width="14" height="6" rx="0.6"/>
          <rect x="49" y="153" width="14" height="6" rx="0.6"/>
          <rect x="64" y="153" width="14" height="6" rx="0.6"/>
        </g>
        <g id="sp3-bricks-b">
          <rect x="414" y="132" width="14" height="6" rx="0.6"/>
          <rect x="406" y="139" width="14" height="6" rx="0.6"/>
          <rect x="421" y="139" width="14" height="6" rx="0.6"/>
        </g>
        <g id="sp3-bricks-c">
          <rect x="266" y="234" width="14" height="6" rx="0.6"/>
          <rect x="281" y="234" width="14" height="6" rx="0.6"/>
          <rect x="273" y="241" width="14" height="6" rx="0.6"/>
        </g>
        <g id="sp3-lamp-a">
          <path d="M112 0V36"/>
          <path d="M108 36h8l6 12h-20Z"/>
          <path d="M109 48.5a3 3 0 0 0 6 0"/>
          <path d="M112 55v5M104 53.5l-2.5 4M120 53.5l2.5 4"/>
        </g>
        <g id="sp3-lamp-b">
          <path d="M388 0V44"/>
          <path d="M376 56C376 48.5 381.5 44 388 44S400 48.5 400 56Z"/>
          <path d="M385 56.5a3 3 0 0 0 6 0"/>
          <path d="M388 63v5M380 61.5l-2.5 4M396 61.5l2.5 4"/>
        </g>
        <g id="sp3-poster">
          <path d="M64 54L48 64M64 54L80 64"/>
          <rect x="44" y="64" width="40" height="50" rx="1"/>
          <rect x="48" y="68" width="32" height="42"/>
          <g transform="translate(44 64)">
            <path d="M20 14l6 4v8l-6 4-6-4v-8Z"/>
            <path d="M10 36h20M10 41h13"/>
          </g>
        </g>
      </g>
      <g id="sp3-fg" stroke="#3a2d66" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path id="sp3-floor" d="M56 308H424M40 308h10M430 308h10" fill="none"/>
        <g id="sp3-plant-l">
          <path d="M76 271C74 250 69 232 62 216M76 271C77 238 76 200 74 168M76 271C78 250 83 232 89 213M75 271C72 262 67 256 60 252M77 271C80 263 85 259 92 255" fill="none"/>
          <path id="sp3-leaf-1" d="M62 217C66.93 210.03 61.59 198.9 56.05 191.53C51.4 185.55 46.24 181.2 44 180C43 182.77 41.69 190.28 42.29 198.22C44.59 207.17 52.36 217.11 62 217Z" fill="#8cc79b"/>
          <path d="M61.05 215.63Q51.2 199.37 45.24 183.97M54.72 205.9L57.15 200.14M53.49 203.75L47.11 202.28M50.15 197.14L53 191.18M49.17 194.87L43.2 193.2" fill="none" strokeWidth="1"/>
          <path id="sp3-leaf-2" d="M74 170C82.85 164.98 84.65 151.59 82.05 142.04C78.46 134.33 73.36 128.05 71 126C69.57 128.31 67.09 135.11 65.94 143.14C64.75 152.95 65.79 166.14 74 170Z" fill="#5fae7a"/>
          <path d="M74.13 168.22Q74.5 147.86 71.92 130.36M74.72 155.81L79.89 151.03M74.72 153.15L69.34 149.1M74.28 145.23L78.98 140.49M74 142.59L68.16 138.57" fill="none" strokeWidth="1"/>
          <path id="sp3-leaf-3" d="M89 214C98.5 214.5 105.95 205.48 108.05 197.17C108.48 189.74 107.04 182.64 106 180C103.82 181.03 98.82 184.91 94.36 190.33C89.05 197.02 84.01 207.25 89 214Z" fill="#5fae7a"/>
          <path d="M89.9 212.75Q99.29 197.89 104.85 183.68M95.95 203.88L102.3 202.8M97.12 201.91L94.52 196.36M100.28 195.84L106.21 194.56M101.2 193.75L98.19 188" fill="none" strokeWidth="1"/>
          <path id="sp3-leaf-4" d="M60 252C62.53 246.27 57.79 241.41 53.3 238.86C49.55 236.85 45.62 235.98 44 236C43.64 237.96 43.61 242.79 44.89 247.27C47.39 251.81 53.62 255.18 60 252Z" fill="#5fae7a"/>
          <path d="M59.23 251.49Q50.94 245.06 45.27 237.93M53.98 247.78L54.98 243.58M52.93 246.91L48.54 248.1M50 244.08L51.23 239.65M49.09 243.07L44.94 244.02" fill="none" strokeWidth="1"/>
          <path id="sp3-leaf-5" d="M92 255C98.05 258.69 104.18 256.01 106.76 251.85C108.15 247.62 108.28 242.93 108 241C106.43 240.82 102.61 241.3 98.92 242.89C94.5 244.94 89.76 249.21 92 255Z" fill="#8cc79b"/>
          <path d="M92.76 254.58Q100.99 249.13 106.71 242.75M97.95 251.47L102.21 253.11M99 250.73L98.13 246.51M101.93 248.27L105.96 249.65M102.84 247.37L101.75 242.89" fill="none" strokeWidth="1"/>
          <path d="M62 277H90L86.5 308H65.5Z" fill="#ffffff"/>
          <rect x="59.5" y="270.5" width="33" height="6.5" rx="1.5" fill="#ffffff"/>
          <path d="M69.5 287.5l3 3M72.5 287.5l-3 3M78.5 296.5l3 3M81.5 296.5l-3 3" fill="none" strokeWidth="1"/>
        </g>
        <g id="sp3-rewards-board">
          <rect x="148" y="182" width="6" height="110" fill="#ffffff"/>
          <rect x="246" y="182" width="6" height="110" fill="#ffffff"/>
          <rect x="154" y="258" width="92" height="5" fill="#ffffff"/>
          <rect x="138" y="292" width="26" height="4.5" rx="1.5" fill="#ffffff"/>
          <circle cx="142" cy="303.5" r="4.5" fill="#ffffff"/>
          <circle cx="142" cy="303.5" r="1.2" fill="#3a2d66" stroke="none"/>
          <circle cx="160" cy="303.5" r="4.5" fill="#ffffff"/>
          <circle cx="160" cy="303.5" r="1.2" fill="#3a2d66" stroke="none"/>
          <rect x="236" y="292" width="26" height="4.5" rx="1.5" fill="#ffffff"/>
          <circle cx="240" cy="303.5" r="4.5" fill="#ffffff"/>
          <circle cx="240" cy="303.5" r="1.2" fill="#3a2d66" stroke="none"/>
          <circle cx="258" cy="303.5" r="4.5" fill="#ffffff"/>
          <circle cx="258" cy="303.5" r="1.2" fill="#3a2d66" stroke="none"/>
          <rect x="126" y="56" width="150" height="128" rx="2.5" fill="#ffffff"/>
          <rect x="130" y="60" width="142" height="120" rx="1" fill="#ffffff" strokeWidth="1"/>
          <rect x="146" y="138" width="14" height="26" rx="0.8" fill="#ffffff" strokeWidth="1.2"/>
          <rect x="168" y="120" width="14" height="44" rx="0.8" fill="#8cc79b" strokeWidth="1.2"/>
          <rect x="190" y="98" width="14" height="66" rx="0.8" fill="#3fa58a" strokeWidth="1.2"/>
          <path d="M146 122l22-16 24-18 24-10" fill="none" stroke="#ef5b5b" strokeWidth="1.8"/>
          <circle cx="238" cy="96" r="14" fill="#f5c35a" strokeWidth="1.2"/>
          <path d="M233 96l3.5 3.5 7-7" fill="none" stroke="#3a2d66" strokeWidth="1.4"/>
          <rect x="224" y="126" width="32" height="10" rx="1" fill="#ab9ee6" strokeWidth="1"/>
          <text x="240" y="133" fontFamily="ui-monospace, monospace" fontSize="5.2" fontWeight="700" textAnchor="middle" fill="#3a2d66" stroke="none">PTS</text>
          <path d="M222 148h34M222 155h24M222 162h28" fill="none" stroke="#ab9ee6" strokeWidth="1.2"/>
        </g>
        <g transform="rotate(-5 322 186)">
          <g transform="translate(322 100) rotate(-4) scale(-1 1)">
            <path d="M8.51 -18.37A2.8 2.8 0 0 0 4.21 -20.91A2.8 2.8 0 0 0 -0.59 -22.28A2.8 2.8 0 0 0 -5.59 -22.39A2.8 2.8 0 0 0 -10.44 -21.22A2.8 2.8 0 0 0 -14.84 -18.86A2.8 2.8 0 0 0 -18.5 -15.46A2.8 2.8 0 0 0 -21.17 -11.24A2.8 2.8 0 0 0 -22.69 -6.48A2.8 2.8 0 0 0 -22.94 -1.49A2.8 2.8 0 0 0 -21.92 3.39A2.8 2.8 0 0 0 -19.69 7.86A2.8 2.8 0 0 0 -16.4 11.62A2.8 2.8 0 0 0 -12.27 14.42A2.8 2.8 0 0 0 -7.55 16.07L-2 12L8 -10Z" fill="#3a2d66"/>
          </g>
        </g>
        <path d="M324.13 133.1L330.9 164.38Q329.58 164.74 331.12 164.46Q334.47 179.73 338.99 194.72L341.14 197.07L344.16 196.35L345.01 193.28L345.91 197.03L332.55 131.39Z" fill="#f3cdb0"/>
        <g id="sp3-hand-far" transform="translate(342 194) rotate(74) scale(1.05 1.05)" strokeWidth="1.33">
          <path d="M0 -3.4C3 -4 6.2 -4.2 9.2 -3.8C11.8 -3.4 13.6 -2 14.4 0.2C15 1.8 15 3.8 14.4 5.6C14 6.8 12.6 6.8 12.4 5.6C12.6 6.8 11.6 7.6 10.6 7.2C10.6 8 9.6 8.6 8.6 8.1C8.4 8.8 7.2 9.2 6.4 8.4C5.6 7.4 5.4 5.6 4.8 4.4C3.6 3.8 2 3.6 0 3.4Z" fill="#f3cdb0" stroke="none"/>
          <path d="M0 -3.4C3 -4 6.2 -4.2 9.2 -3.8C11.8 -3.4 13.6 -2 14.4 0.2C15 1.8 15 3.8 14.4 5.6C14 6.8 12.6 6.8 12.4 5.6C12.6 6.8 11.6 7.6 10.6 7.2C10.6 8 9.6 8.6 8.6 8.1C8.4 8.8 7.2 9.2 6.4 8.4C5.6 7.4 5.4 5.6 4.8 4.4C3.6 3.8 2 3.6 0 3.4" fill="none"/>
          <path d="M12.4 5.6C12.4 4.6 12.2 3.6 11.8 2.8M10.6 7.2C10.6 6 10.4 4.8 10 4M8.6 8.1C8.6 6.8 8.2 5.6 7.6 4.6" fill="none" strokeWidth="0.86"/>
          <path d="M7.4 -3.6C9.6 -3.8 12 -3.2 13.6 -1.8C14.4 -1.1 13.8 0 12.8 -0.4C11.2 -1 9.6 -1.2 8.2 -1Z" fill="#f3cdb0"/>
        </g>
        <path d="M342.4 280.48L340.85 294.2L332.51 293.26L334.05 279.54Z" fill="#f3cdb0"/>
        <g transform="translate(346.84 297.83) rotate(-24) scale(-1 1)">
          <path d="M0 0V-7.5C0 -9.6 1.8 -10.6 4.6 -10.6H9C12 -10.2 14 -8.6 16.4 -7.4C19.6 -6 23.4 -5.4 25 -3.2C25.6 -2 25.6 -0.8 25 0Z" fill="#f5c35a"/>
          <path d="M0 -3V0H25C25.5 -1 25.6 -2 25.4 -3Z" fill="#ffffff"/>
          <path d="M13.6 -8.6l-1.6 2.4M17 -7.2l-1.6 2.4" fill="none" strokeWidth="1"/>
        </g>
        <path d="M317.43 186.76C318.3 193.76 320.77 216.45 322.64 228.79C324.51 241.14 327.05 251.82 328.65 260.82C330.26 269.82 331.65 279.12 332.25 282.78L343.75 281.22C343.35 277.54 342.08 268.18 341.35 259.18C340.62 250.18 339.82 239.53 339.36 227.21C338.9 214.89 338.7 192.24 338.57 185.24A10.6 10.6 0 0 0 317.43 186.76Z" fill="#7f9fdc"/>
        <path d="M343.74 275.97L344.64 281.09L331.36 282.91L330.86 277.73Z" fill="#7f9fdc"/>
        <path d="M316.09 288.78L316.7 300.17L308.31 300.62L307.7 289.23Z" fill="#f3cdb0"/>
        <g transform="translate(319 308) scale(-1 1)">
          <path d="M0 0V-7.5C0 -9.6 1.8 -10.6 4.6 -10.6H9C12 -10.2 14 -8.6 16.4 -7.4C19.6 -6 23.4 -5.4 25 -3.2C25.6 -2 25.6 -0.8 25 0Z" fill="#f5c35a"/>
          <path d="M0 -3V0H25C25.5 -1 25.6 -2 25.4 -3Z" fill="#ffffff"/>
          <path d="M13.6 -8.6l-1.6 2.4M17 -7.2l-1.6 2.4" fill="none" strokeWidth="1"/>
        </g>
        <path d="M308.03 185.29C307.86 192.33 307.22 213.78 307.01 227.51C306.81 241.25 306.94 257.17 306.81 267.71C306.67 278.24 306.31 286.91 306.21 290.75L317.79 291.25C318.03 287.43 318.33 278.76 319.19 268.29C320.06 257.83 321.52 242.08 322.99 228.49C324.45 214.89 327.14 193.67 327.97 186.71A10 10 0 0 0 308.03 185.29Z" fill="#7f9fdc"/>
        <path d="M318.72 286.09L318.69 291.29L305.31 290.71L305.73 285.52Z" fill="#7f9fdc"/>
        <rect x="306" y="184" width="33" height="5" rx="0.8" fill="#7f9fdc"/>
        <g transform="rotate(-5 322 186)">
          <g transform="translate(322 100) scale(-1 1)">
            <path d="M-6 12L-7 27L-1 33L5.4 26.6L4 12Z" fill="#f3cdb0"/>
            <path d="M-8 25C-14 27 -18 32 -19 39C-20 48 -18 58 -17 68C-16.4 74 -17 80 -18 85C-9 87.4 2 87.6 13 86C13 80 12 74 11.6 68C11.4 61 14.6 53 14.6 45C14.6 36 11 29 5 26.6L-1 32Z" fill="#3fa58a"/>
            <path d="M-8 25L-1 32L-4.4 34.6L-9.4 27.4ZM5 26.6L-1 32L2.6 34.6L7 28.6Z" fill="#3fa58a"/>
            <path d="M-15 72c3 3.4 7.4 5.6 12.6 6.4M7 54c1 2.6 1.6 5.2 1.6 8" fill="none" strokeWidth="1"/>
          </g>
          <g transform="translate(322 100) rotate(-4) scale(-1 1)">
            <path d="M-3 -16.5C5 -16.5 10.5 -11.5 11 -4.5C11.2 -2.5 11.6 -0.6 12.6 1.4C13.4 3 13.4 4.4 12.4 5C11.8 5.4 11.4 5.6 11 6C11.6 7 11.6 8.2 11 9C10.8 10.5 10.2 12 8.6 13.8C6 16.4 2 17 -1.5 15.5C-5 14 -8 9.5 -9 4C-10 -4 -9 -16.5 -3 -16.5Z" fill="#f3cdb0"/>
            <path d="M-9 3C-12 -8 -6 -19.2 3 -19C8 -18.8 11.6 -14.6 11.6 -9.6A2.07 2.07 0 0 1 8 -10.4A2.03 2.03 0 0 1 4.4 -10A2.1 2.1 0 0 1 1 -8.4A2.24 2.24 0 0 1 -2.2 -6A2.3 2.3 0 0 1 -5 -3A2.64 2.64 0 0 1 -7.5 1Z" fill="#3a2d66"/>
            <path d="M1 -14.5a3 3 0 0 0 -4.6 -1.6M-8.5 -10a3 3 0 0 0 -4.4 0.8M-12.5 -1a3 3 0 0 0 -3.4 3M-3.5 -19a3 3 0 0 0 -4.6 0" fill="none" stroke="#7f6cc4" strokeWidth="1"/>
            <path d="M-3.6 -2.6C-6.1 -3.8 -7.9 -1.8 -7.6 0.7C-7.3 3.1 -5.7 4.4 -3.7 4Z" fill="#f3cdb0"/>
            <path d="M-4.9 -0.8c-.9.3-1.1 1.6-.4 2.6" fill="none" strokeWidth="1"/>
            <circle cx="-5.2" cy="6.2" r="1.3" fill="#f5c35a" strokeWidth="1"/>
            <circle cx="4.6" cy="-1.4" r="1.15" fill="#3a2d66" stroke="none"/>
            <circle cx="9.5" cy="-1.5" r="1" fill="#3a2d66" stroke="none"/>
            <path d="M2.6 -5.2c1.1-.6 2.6-.7 3.8-.3M8.4 -5c.7-.4 1.5-.5 2.2-.3" fill="none" strokeWidth="1"/>
            <path d="M11.9 5.2c-.7.5-1.5.6-2.3.2" fill="none" strokeWidth="1"/>
            <path d="M10.1 9.3c-.9.6-2 .6-2.8 0" fill="none" strokeWidth="1"/>
          </g>
        </g>
        <path d="M320.12 137.57L284.53 143.01Q280.88 143.7 280.04 140.06Q275.31 125.83 271.71 111.23L272.4 107.91L275.55 106.92L278.01 109.26L285.75 133.89L318.63 128.49Z" fill="#f3cdb0"/>
        <path d="M285.75 133.89l2.96 -0.49" fill="none" strokeWidth="1"/>
        <path d="M326.77 134.85C327.58 139.79 320.67 140.92 318.41 139.47L307.49 140.86Q305.16 135.36 305.6 129.41L317.38 127.07C321.33 126.42 325.79 128.93 326.77 134.85Z" fill="#3fa58a"/>
        <g id="sp3-hand-near" transform="translate(274.86 110.25) rotate(192) scale(1.1 -1.1)" strokeWidth="1.27">
          <path d="M0 -3.6C3 -4.4 6 -4.8 9 -4.6L19.6 -4.4C21 -4.3 21 -2.1 19.6 -2L11.2 -1.8C12.6 -1.2 13 0.4 12 1.1C12.8 1.8 12.6 3.4 11.4 3.7C11.9 4.4 11.5 5.8 10.2 5.9C8.2 6 5.6 5.4 3.6 4.4C2.4 3.9 1.2 3.6 0 3.5Z" fill="#f3cdb0" stroke="none"/>
          <path d="M0 -3.6C3 -4.4 6 -4.8 9 -4.6L19.6 -4.4C21 -4.3 21 -2.1 19.6 -2L11.2 -1.8C12.6 -1.2 13 0.4 12 1.1C12.8 1.8 12.6 3.4 11.4 3.7C11.9 4.4 11.5 5.8 10.2 5.9C8.2 6 5.6 5.4 3.6 4.4C2.4 3.9 1.2 3.6 0 3.5" fill="none"/>
          <path d="M12 1.1C10.8 0.9 9.8 1 8.8 1.3M11.4 3.7C10.4 3.5 9.4 3.6 8.4 3.9" fill="none" strokeWidth="0.82"/>
          <path d="M4.4 -3.4C6.4 -3.2 8.6 -2.4 10.2 -1.2C11 -0.6 10.4 0.6 9.4 0.2C8 -0.4 6.4 -0.8 5 -0.8Z" fill="#f3cdb0"/>
        </g>
        <g id="sp3-desk-r">
          <rect x="364" y="216" width="5" height="92" fill="#ffffff"/>
          <rect x="427" y="216" width="5" height="92" fill="#ffffff"/>
          <rect x="394" y="216" width="38" height="15" fill="#ffffff"/>
          <path d="M408 223.5h10" fill="none"/>
          <rect x="358" y="210.5" width="80" height="5.5" rx="1.5" fill="#ffffff"/>
          <rect x="366" y="205.5" width="28" height="5" rx="0.8" fill="#ab9ee6"/>
          <rect x="368" y="200.5" width="24" height="5" rx="0.8" fill="#ffffff"/>
          <g id="sp3-mug">
            <path d="M419 199.5h1.4a4.4 4.4 0 0 1 0 8.8H419v-2.4h1.4a2 2 0 0 0 0-4H419Z" fill="#ffffff"/>
            <path d="M408 197h11.5v13.5h-11.5Z" fill="#ffffff"/>
            <path d="M408 202h11.5" fill="none" stroke="#ef5b5b" strokeWidth="1.6"/>
            <path d="M411.5 193c-1.5-2 1.5-3 0-5.5M416 193c-1.5-2 1.5-3 0-5.5" fill="none" strokeWidth="1"/>
          </g>
        </g>
      </g>
    </svg>
  );
}

export function EmptyStateIllustration({ className = 'w-full h-full' }) {
  return (
    <svg viewBox="0 0 480 360" className={className} aria-hidden="true">
      <rect id="sp5-card" width="480" height="360" fill="#ffffff" stroke="none"/>
      <g id="sp5-bg" fill="none" stroke="#cfc9e0" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <g id="sp5-bricks-a">
          <rect x="44" y="72" width="14" height="6" rx="0.6"/>
          <rect x="59" y="72" width="14" height="6" rx="0.6"/>
          <rect x="51" y="79" width="14" height="6" rx="0.6"/>
        </g>
        <g id="sp5-bricks-b">
          <rect x="408" y="138" width="14" height="6" rx="0.6"/>
          <rect x="400" y="145" width="14" height="6" rx="0.6"/>
          <rect x="415" y="145" width="14" height="6" rx="0.6"/>
        </g>
        <g id="sp5-lamp-a">
          <path d="M116 0V40"/>
          <path d="M112 40h8l6 12h-20Z"/>
          <path d="M113 52.5a3 3 0 0 0 6 0"/>
          <path d="M116 59v5M108 57.5l-2.5 4M124 57.5l2.5 4"/>
        </g>
        <g id="sp5-lamp-b">
          <path d="M378 0V46"/>
          <path d="M366 58C366 50.5 371.5 46 378 46S390 50.5 390 58Z"/>
          <path d="M375 58.5a3 3 0 0 0 6 0"/>
          <path d="M378 65v5M370 63.5l-2.5 4M386 63.5l2.5 4"/>
        </g>
        <g id="sp5-poster">
          <path d="M65 104L49 114M65 104L81 114"/>
          <rect x="44" y="114" width="42" height="52" rx="1"/>
          <rect x="48" y="118" width="34" height="44"/>
          <g transform="translate(44 114)">
            <rect x="8" y="10" width="26" height="16"/>
            <path d="M12 22l5-6 4 4 4-3 5 5"/>
            <path d="M8 33h20M8 38h13"/>
          </g>
        </g>
      </g>
      <g id="sp5-fg" stroke="#3a2d66" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path id="sp5-floor" d="M56 308H424M40 308h10M430 308h10" fill="none"/>
        <g id="sp5-plant-l">
          <path d="M78 272C76 250 71 232 64 216M78 272C79 238 78 202 76 170M78 272C80 250 85 232 91 214" fill="none"/>
          <path id="sp5-leaf-1" d="M64 217C68.93 210.03 63.59 198.9 58.05 191.53C53.4 185.55 48.24 181.2 46 180C45 182.77 43.69 190.28 44.29 198.22C46.59 207.17 54.36 217.11 64 217Z" fill="#8cc79b"/>
          <path d="M63.05 215.63Q53.2 199.37 47.24 183.97M56.72 205.9L59.15 200.14M55.49 203.75L49.11 202.28M52.15 197.14L55 191.18M51.17 194.87L45.2 193.2" fill="none" strokeWidth="1"/>
          <path id="sp5-leaf-2" d="M76 172C84.85 166.98 86.65 153.59 84.05 144.04C80.46 136.33 75.36 130.05 73 128C71.57 130.31 69.09 137.11 67.94 145.14C66.75 154.95 67.79 168.14 76 172Z" fill="#5fae7a"/>
          <path d="M76.13 170.22Q76.5 149.86 73.92 132.36M76.72 157.81L81.89 153.03M76.72 155.15L71.34 151.1M76.28 147.23L80.98 142.49M76 144.59L70.16 140.57" fill="none" strokeWidth="1"/>
          <path id="sp5-leaf-3" d="M91 215C100.45 215.69 107.89 207 109.99 198.89C110.45 191.61 109.03 184.62 108 182C105.83 182.97 100.84 186.67 96.39 191.89C91.09 198.34 86.05 208.27 91 215Z" fill="#5fae7a"/>
          <path d="M91.9 213.79Q101.28 199.42 106.85 185.58M97.94 205.21L104.26 204.29M99.11 203.31L96.53 197.81M102.27 197.42L108.18 196.29M103.19 195.39L100.21 189.68" fill="none" strokeWidth="1"/>
          <path d="M64 277H92L88.5 308H67.5Z" fill="#ffffff"/>
          <rect x="61.5" y="270.5" width="33" height="6.5" rx="1.5" fill="#ffffff"/>
          <path d="M71.5 287.5l3 3M74.5 287.5l-3 3M80.5 296.5l3 3M83.5 296.5l-3 3" fill="none" strokeWidth="1"/>
        </g>
        <g id="sp5-desk">
          <rect x="148" y="215" width="5" height="93" fill="#ffffff"/>
          <rect x="251" y="215" width="5" height="93" fill="#ffffff"/>
          <rect x="210" y="215" width="46" height="16" fill="#ffffff"/>
          <path d="M228 223h10" fill="none"/>
          <rect x="142" y="209.5" width="122" height="5.5" rx="1.5" fill="#ffffff"/>
          <rect x="160" y="160" width="42" height="49.5" rx="2" fill="#ffffff"/>
          <rect x="172" y="156" width="18" height="6" rx="1" fill="#f9c99a"/>
          <circle cx="181" cy="176" r="8.5" fill="#3fa58a" strokeWidth="1.2"/>
          <path d="M177.5 176l2.5 2.5 5-5" fill="none" stroke="#ffffff" strokeWidth="1.4"/>
          <path d="M168 192h26M168 198h18" fill="none" stroke="#ab9ee6" strokeWidth="1.2"/>
          <g id="sp5-mug">
            <path d="M235 198.5h1.4a4.4 4.4 0 0 1 0 8.8H235v-2.4h1.4a2 2 0 0 0 0-4H235Z" fill="#ffffff"/>
            <path d="M224 196h11.5v13.5h-11.5Z" fill="#ffffff"/>
            <path d="M224 201h11.5" fill="none" stroke="#f5c35a" strokeWidth="1.6"/>
            <path d="M227.5 192c-1.5-2 1.5-3 0-5.5M232 192c-1.5-2 1.5-3 0-5.5" fill="none" strokeWidth="1"/>
          </g>
        </g>
        <path d="M308.11 134.36L317.86 164.84Q316.58 165.32 318.09 164.9Q323.01 180.15 329.07 195.01L331.44 197.14L334.37 196.14L334.93 192.99L336.07 196.32L316.34 131.84Z" fill="#f3cdb0"/>
        <g id="sp5-hand-far" transform="translate(332 194) rotate(74) scale(1.05 1.05)" strokeWidth="1.33">
          <path d="M0 -3.4C3 -4 6.2 -4.2 9.2 -3.8C11.8 -3.4 13.6 -2 14.4 0.2C15 1.8 15 3.8 14.4 5.6C14 6.8 12.6 6.8 12.4 5.6C12.6 6.8 11.6 7.6 10.6 7.2C10.6 8 9.6 8.6 8.6 8.1C8.4 8.8 7.2 9.2 6.4 8.4C5.6 7.4 5.4 5.6 4.8 4.4C3.6 3.8 2 3.6 0 3.4Z" fill="#f3cdb0" stroke="none"/>
          <path d="M0 -3.4C3 -4 6.2 -4.2 9.2 -3.8C11.8 -3.4 13.6 -2 14.4 0.2C15 1.8 15 3.8 14.4 5.6C14 6.8 12.6 6.8 12.4 5.6C12.6 6.8 11.6 7.6 10.6 7.2C10.6 8 9.6 8.6 8.6 8.1C8.4 8.8 7.2 9.2 6.4 8.4C5.6 7.4 5.4 5.6 4.8 4.4C3.6 3.8 2 3.6 0 3.4" fill="none"/>
          <path d="M12.4 5.6C12.4 4.6 12.2 3.6 11.8 2.8M10.6 7.2C10.6 6 10.4 4.8 10 4M8.6 8.1C8.6 6.8 8.2 5.6 7.6 4.6" fill="none" strokeWidth="0.86"/>
          <path d="M7.4 -3.6C9.6 -3.8 12 -3.2 13.6 -1.8C14.4 -1.1 13.8 0 12.8 -0.4C11.2 -1 9.6 -1.2 8.2 -1Z" fill="#f3cdb0"/>
        </g>
        <path d="M330 279.62L331.27 293.35L322.91 294.13L321.63 280.4Z" fill="#f3cdb0"/>
        <g transform="translate(336.84 297.83) rotate(-24) scale(-1 1)">
          <path d="M0 0V-7.5C0 -9.6 1.8 -10.6 4.6 -10.6H9C12 -10.2 14 -8.6 16.4 -7.4C19.6 -6 23.4 -5.4 25 -3.2C25.6 -2 25.6 -0.8 25 0Z" fill="#3fa58a"/>
          <path d="M0 -3V0H25C25.5 -1 25.6 -2 25.4 -3Z" fill="#ffffff"/>
          <path d="M13.6 -8.6l-1.6 2.4M17 -7.2l-1.6 2.4" fill="none" strokeWidth="1"/>
        </g>
        <path d="M305.43 188.76C306.3 195.76 308.77 218.44 310.64 230.79C312.51 243.14 315.05 254.18 316.66 262.85C318.26 271.53 319.66 279.53 320.26 282.86L331.74 281.14C331.34 277.81 330.07 269.8 329.34 261.15C328.61 252.49 327.82 241.53 327.36 229.21C326.9 216.89 326.7 194.24 326.57 187.24A10.6 10.6 0 0 0 305.43 188.76Z" fill="#7f9fdc"/>
        <path d="M331.66 275.89L332.63 281.01L319.37 282.99L318.8 277.82Z" fill="#7f9fdc"/>
        <path d="M304.09 288.78L304.7 300.17L296.31 300.62L295.7 289.23Z" fill="#f3cdb0"/>
        <g transform="translate(307 308) scale(-1 1)">
          <path d="M0 0V-7.5C0 -9.6 1.8 -10.6 4.6 -10.6H9C12 -10.2 14 -8.6 16.4 -7.4C19.6 -6 23.4 -5.4 25 -3.2C25.6 -2 25.6 -0.8 25 0Z" fill="#3fa58a"/>
          <path d="M0 -3V0H25C25.5 -1 25.6 -2 25.4 -3Z" fill="#ffffff"/>
          <path d="M13.6 -8.6l-1.6 2.4M17 -7.2l-1.6 2.4" fill="none" strokeWidth="1"/>
        </g>
        <path d="M296.03 187.29C295.86 194.33 295.22 215.78 295.01 229.51C294.81 243.25 294.94 259.49 294.81 269.7C294.67 279.9 294.31 287.22 294.21 290.72L305.79 291.28C306.03 287.78 306.33 280.44 307.19 270.3C308.06 260.17 309.52 244.09 310.99 230.49C312.45 216.89 315.14 195.67 315.97 188.71A10 10 0 0 0 296.03 187.29Z" fill="#7f9fdc"/>
        <path d="M306.74 286.12L306.69 291.32L293.31 290.68L293.75 285.5Z" fill="#7f9fdc"/>
        <rect x="294" y="181.9" width="33" height="5" rx="0.8" fill="#7f9fdc"/>
        <g transform="rotate(-5 310 188)">
          <g transform="translate(310 102) scale(-1 1)">
            <path d="M-6 7.5 L-6.4 22.5 L-0.6 28.5 L5 22.5 L4.6 7.5Z" fill="#f3cdb0"/>
            <path d="M-8 21.1 C-13.6 22.9 -17 27.9 -17.6 35.1 C-18.2 44.1 -16.6 54.1 -16.2 63.9 C-15.9 70.9 -16.4 77.1 -16.8 83.7 H14.2 C14.5 76.9 13.7 70.1 13.6 63.3 C13.4 55.1 15.8 47.1 15.6 38.9 C15.4 31.1 12.4 25.1 6.4 22.7 C3.6 26.3 -4.4 25.9 -8 21.1Z" fill="#ffffff"/>
            <path d="M-13.4 74.1c3 2.4 7 3.6 11.4 3.8M9.4 68.5c.8 2.2 1 4.4.8 6.6" fill="none" strokeWidth="1"/>
          </g>
          <g transform="translate(310 102) rotate(-4) scale(-1 1)">
            <path d="M-7 12C-11.6 8 -13.2 1 -12.6 -6C-12 -14 -6 -19.6 2 -19.6L-2 6Z" fill="#7b4b3a"/>
            <path d="M-3 -16.5C5 -16.5 10.5 -11.5 11 -4.5C11.2 -2.5 11.6 -0.6 12.6 1.4C13.4 3 13.4 4.4 12.4 5C11.8 5.4 11.4 5.6 11 6C11.6 7 11.6 8.2 11 9C10.8 10.5 10.2 12 8.6 13.8C6 16.4 2 17 -1.5 15.5C-5 14 -8 9.5 -9 4C-10 -4 -9 -16.5 -3 -16.5Z" fill="#f3cdb0"/>
            <path d="M-12.6 -6C-12 -14.6 -5 -20.6 3.4 -20.4C9.2 -20.2 13.6 -17.4 14.6 -13.2C15 -11.6 14.4 -10.4 13.2 -10.6C12 -12.4 9.8 -13.2 7.4 -12.8C5 -12.4 2.6 -11.8 0.6 -10.4C-0.6 -9.6 -1.6 -8 -2.2 -6C-2.6 -4.2 -3.4 -2.8 -4.4 -2.4C-5.4 -4 -7 -4.4 -8.4 -3.6C-9.2 -1.6 -9.4 0.6 -9.2 3C-11.8 1.6 -12.8 -2.2 -12.6 -6Z" fill="#7b4b3a"/>
            <path d="M-4 -16.4c3-1.8 7-2.2 10.4-1.2M8.6 -16c1.6.6 2.8 1.6 3.6 2.8" fill="none" stroke="#f6a85e" strokeWidth="1"/>
            <path d="M-3.6 -2.6C-6.1 -3.8 -7.9 -1.8 -7.6 0.7C-7.3 3.1 -5.7 4.4 -3.7 4Z" fill="#f3cdb0"/>
            <path d="M-4.9 -0.8c-.9.3-1.1 1.6-.4 2.6" fill="none" strokeWidth="1"/>
            <circle cx="4.6" cy="-1.4" r="1.15" fill="#3a2d66" stroke="none"/>
            <circle cx="9.5" cy="-1.5" r="1" fill="#3a2d66" stroke="none"/>
            <path d="M2.6 -5.2c1.1-.6 2.6-.7 3.8-.3M8.4 -5c.7-.4 1.5-.5 2.2-.3" fill="none" strokeWidth="1"/>
            <circle cx="4.6" cy="-1.4" r="3.8" fill="none" strokeWidth="1"/>
            <path d="M8.4 -1.8c.6-.2 1.2-.2 1.8 0M11.6 -4.2c.9 1.5.9 3.4.2 5M0.8 -1.6L-4.4 -2.4" fill="none" strokeWidth="1"/>
            <path d="M11.9 5.2c-.7.5-1.5.6-2.3.2" fill="none" strokeWidth="1"/>
            <path d="M10.1 9.3c-.9.6-2 .6-2.8 0" fill="none" strokeWidth="1"/>
          </g>
        </g>
        <path d="M305.42 137.15L276.89 157.42Q277.69 158.65 276.67 157.31Q257.91 170.47 238.47 182.64L235.09 182.95L233.22 180.23L234.74 177.19L235.06 176.97L300.01 129.71Z" fill="#f3cdb0"/>
        <path d="M235.06 176.97l2.43 -1.77" fill="none" strokeWidth="1"/>
        <path d="M310.14 131.73C313.08 135.78 307.42 139.9 304.98 139.94L295.04 146.68Q290.26 142.49 287.75 136.65L298.02 128.68C301.26 126.33 306.61 126.88 310.14 131.73Z" fill="#ffffff"/>
        <g id="sp5-hand-near" transform="translate(236.61 179.92) rotate(186) scale(1.1 -1.1)" strokeWidth="1.27">
          <path d="M0 -3.6C3 -4.4 6 -4.8 9 -4.6L19.6 -4.4C21 -4.3 21 -2.1 19.6 -2L11.2 -1.8C12.6 -1.2 13 0.4 12 1.1C12.8 1.8 12.6 3.4 11.4 3.7C11.9 4.4 11.5 5.8 10.2 5.9C8.2 6 5.6 5.4 3.6 4.4C2.4 3.9 1.2 3.6 0 3.5Z" fill="#f3cdb0" stroke="none"/>
          <path d="M0 -3.6C3 -4.4 6 -4.8 9 -4.6L19.6 -4.4C21 -4.3 21 -2.1 19.6 -2L11.2 -1.8C12.6 -1.2 13 0.4 12 1.1C12.8 1.8 12.6 3.4 11.4 3.7C11.9 4.4 11.5 5.8 10.2 5.9C8.2 6 5.6 5.4 3.6 4.4C2.4 3.9 1.2 3.6 0 3.5" fill="none"/>
          <path d="M12 1.1C10.8 0.9 9.8 1 8.8 1.3M11.4 3.7C10.4 3.5 9.4 3.6 8.4 3.9" fill="none" strokeWidth="0.82"/>
          <path d="M4.4 -3.4C6.4 -3.2 8.6 -2.4 10.2 -1.2C11 -0.6 10.4 0.6 9.4 0.2C8 -0.4 6.4 -0.8 5 -0.8Z" fill="#f3cdb0"/>
        </g>
        <g id="sp5-plant-r">
          <path d="M394.2 284C392.2 265.1 392 250.4 394 242C395.6 254.6 403.2 267.2 401.8 284Z" fill="#3fa58a"/>
          <path d="M401.8 284C399.8 259.7 405 240.8 407 230C408.6 246.2 411.6 262.4 410.2 284Z" fill="#5fae7a"/>
          <path d="M409.4 284C407.4 267.8 416 255.2 418 248C419.6 258.8 418 269.6 416.6 284Z" fill="#8cc79b"/>
          <path d="M392 284H420L417 308H395Z" fill="#f9c99a"/>
          <path d="M394.7 296H417.3" fill="none" strokeWidth="1"/>
        </g>
      </g>
    </svg>
  );
}

export function SuccessStateIllustration({ className = 'w-full h-full' }) {
  return (
    <svg viewBox="0 0 480 360" className={className} aria-hidden="true">
      <rect id="sp6-card" width="480" height="360" fill="#ffffff" stroke="none"/>
      <g id="sp6-bg" fill="none" stroke="#cfc9e0" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <g id="sp6-clouds">
          <path d="M44 72h47.6c5.1 0 6.8 -6.8 1.7 -8.5c-0.85 -7.65 -10.2 -10.2 -14.45 -5.1c-2.55 -9.35 -17 -10.2 -20.4 -0.85c-5.1 -2.55 -11.05 0.85 -10.2 5.95c-5.1 0.85 -5.95 8.5 -4.25 8.5Z"/>
          <path d="M374 84h44.8c4.8 0 6.4 -6.4 1.6 -8c-0.8 -7.2 -9.6 -9.6 -13.6 -4.8c-2.4 -8.8 -16 -9.6 -19.2 -0.8c-4.8 -2.4 -10.4 0.8 -9.6 5.6c-4.8 0.8 -5.6 8 -4 8Z"/>
        </g>
        <g id="sp6-birds">
          <path d="M184 46q4 -4.4 8 0q4 -4.4 8 0"/>
          <path d="M202 38q3.2 -3.52 6.4 0q3.2 -3.52 6.4 0"/>
        </g>
        <g id="sp6-lamp-a">
          <path d="M286 0V36"/>
          <path d="M274 48C274 40.5 279.5 36 286 36S298 40.5 298 48Z"/>
          <path d="M283 48.5a3 3 0 0 0 6 0"/>
          <path d="M286 55v5M278 53.5l-2.5 4M294 53.5l2.5 4"/>
        </g>
      </g>
      <g id="sp6-fg" stroke="#3a2d66" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path id="sp6-floor" d="M56 308H424M40 308h10M430 308h10" fill="none"/>
        <g id="sp6-plant-l">
          <path d="M78 272C76 250 71 232 64 216M78 272C79 238 78 202 76 170M78 272C80 250 85 232 91 214" fill="none"/>
          <path id="sp6-leaf-1" d="M64 217C68.93 210.03 63.59 198.9 58.05 191.53C53.4 185.55 48.24 181.2 46 180C45 182.77 43.69 190.28 44.29 198.22C46.59 207.17 54.36 217.11 64 217Z" fill="#8cc79b"/>
          <path d="M63.05 215.63Q53.2 199.37 47.24 183.97M56.72 205.9L59.15 200.14M55.49 203.75L49.11 202.28M52.15 197.14L55 191.18M51.17 194.87L45.2 193.2" fill="none" strokeWidth="1"/>
          <path id="sp6-leaf-2" d="M76 172C84.85 166.98 86.65 153.59 84.05 144.04C80.46 136.33 75.36 130.05 73 128C71.57 130.31 69.09 137.11 67.94 145.14C66.75 154.95 67.79 168.14 76 172Z" fill="#5fae7a"/>
          <path d="M76.13 170.22Q76.5 149.86 73.92 132.36M76.72 157.81L81.89 153.03M76.72 155.15L71.34 151.1M76.28 147.23L80.98 142.49M76 144.59L70.16 140.57" fill="none" strokeWidth="1"/>
          <path id="sp6-leaf-3" d="M91 215C100.45 215.69 107.89 207 109.99 198.89C110.45 191.61 109.03 184.62 108 182C105.83 182.97 100.84 186.67 96.39 191.89C91.09 198.34 86.05 208.27 91 215Z" fill="#5fae7a"/>
          <path d="M91.9 213.79Q101.28 199.42 106.85 185.58M97.94 205.21L104.26 204.29M99.11 203.31L96.53 197.81M102.27 197.42L108.18 196.29M103.19 195.39L100.21 189.68" fill="none" strokeWidth="1"/>
          <path d="M64 277H92L88.5 308H67.5Z" fill="#ffffff"/>
          <rect x="61.5" y="270.5" width="33" height="6.5" rx="1.5" fill="#ffffff"/>
          <path d="M71.5 287.5l3 3M74.5 287.5l-3 3M80.5 296.5l3 3M83.5 296.5l-3 3" fill="none" strokeWidth="1"/>
        </g>
        <g id="sp6-confirm-board">
          <rect x="256" y="182" width="6" height="120" fill="#f9c99a"/>
          <rect x="338" y="182" width="6" height="120" fill="#f9c99a"/>
          <rect x="250" y="302" width="18" height="6" rx="1.2" fill="#ffffff"/>
          <rect x="332" y="302" width="18" height="6" rx="1.2" fill="#ffffff"/>
          <rect x="262" y="254" width="76" height="4.5" fill="#f9c99a"/>
          <rect x="238" y="76" width="124" height="110" rx="2.5" fill="#ffffff"/>
          <rect x="243" y="81" width="114" height="100" rx="1" fill="#ffffff" strokeWidth="1"/>
          <circle cx="300" cy="118" r="18" fill="#3fa58a" strokeWidth="1.2"/>
          <path d="M293 118l5 5 10-10" fill="none" stroke="#ffffff" strokeWidth="1.8"/>
          <rect x="276" y="146" width="48" height="10" rx="1" fill="#f5c35a" strokeWidth="1"/>
          <text x="300" y="153" fontFamily="ui-monospace, monospace" fontSize="5" fontWeight="700" textAnchor="middle" fill="#3a2d66" stroke="none">LOGGED</text>
          <path d="M268 166h64M278 172h44" fill="none" stroke="#ab9ee6" strokeWidth="1.2"/>
        </g>
        <path d="M165.8 135.57L156.84 166.29Q158.13 166.75 156.62 166.36Q152.36 180.83 146.96 194.93L144.64 197.13L141.68 196.19L141.04 193.07L139.74 197.2L157.51 133.27Z" fill="#b47852"/>
        <g id="sp6-hand-far" transform="translate(144 194) rotate(84) scale(1.05 1.05)" strokeWidth="1.33">
          <path d="M0 -3.4C3 -4 6.2 -4.2 9.2 -3.8C11.8 -3.4 13.6 -2 14.4 0.2C15 1.8 15 3.8 14.4 5.6C14 6.8 12.6 6.8 12.4 5.6C12.6 6.8 11.6 7.6 10.6 7.2C10.6 8 9.6 8.6 8.6 8.1C8.4 8.8 7.2 9.2 6.4 8.4C5.6 7.4 5.4 5.6 4.8 4.4C3.6 3.8 2 3.6 0 3.4Z" fill="#b47852" stroke="none"/>
          <path d="M0 -3.4C3 -4 6.2 -4.2 9.2 -3.8C11.8 -3.4 13.6 -2 14.4 0.2C15 1.8 15 3.8 14.4 5.6C14 6.8 12.6 6.8 12.4 5.6C12.6 6.8 11.6 7.6 10.6 7.2C10.6 8 9.6 8.6 8.6 8.1C8.4 8.8 7.2 9.2 6.4 8.4C5.6 7.4 5.4 5.6 4.8 4.4C3.6 3.8 2 3.6 0 3.4" fill="none"/>
          <path d="M12.4 5.6C12.4 4.6 12.2 3.6 11.8 2.8M10.6 7.2C10.6 6 10.4 4.8 10 4M8.6 8.1C8.6 6.8 8.2 5.6 7.6 4.6" fill="none" strokeWidth="0.86"/>
          <path d="M7.4 -3.6C9.6 -3.8 12 -3.2 13.6 -1.8C14.4 -1.1 13.8 0 12.8 -0.4C11.2 -1 9.6 -1.2 8.2 -1Z" fill="#b47852"/>
        </g>
        <path d="M154.6 281.28L150.55 294.86L142.5 292.46L146.55 278.88Z" fill="#b47852"/>
        <g transform="translate(137.16 297.83) rotate(24)">
          <path d="M0 0V-7.5C0 -9.6 1.8 -10.6 4.6 -10.6H9C12 -10.2 14 -8.6 16.4 -7.4C19.6 -6 23.4 -5.4 25 -3.2C25.6 -2 25.6 -0.8 25 0Z" fill="#f5c35a"/>
          <path d="M0 -3V0H25C25.5 -1 25.6 -2 25.4 -3Z" fill="#ffffff"/>
          <path d="M13.6 -8.6l-1.6 2.4M17 -7.2l-1.6 2.4" fill="none" strokeWidth="1"/>
        </g>
        <path d="M149.43 187.24C149.3 194.24 149.1 216.89 148.64 229.21C148.18 241.53 147.39 252.49 146.66 261.15C145.93 269.8 144.66 277.81 144.26 281.14L155.74 282.86C156.34 279.53 157.74 271.53 159.34 262.85C160.95 254.18 163.49 243.14 165.36 230.79C167.23 218.44 169.7 195.76 170.57 188.76A10.6 10.6 0 0 0 149.43 187.24Z" fill="#7f9fdc"/>
        <path d="M157.2 277.82L156.63 282.99L143.37 281.01L144.34 275.89Z" fill="#7f9fdc"/>
        <path d="M180.3 289.23L179.69 300.62L171.3 300.17L171.91 288.78Z" fill="#b47852"/>
        <g transform="translate(169 308)">
          <path d="M0 0V-7.5C0 -9.6 1.8 -10.6 4.6 -10.6H9C12 -10.2 14 -8.6 16.4 -7.4C19.6 -6 23.4 -5.4 25 -3.2C25.6 -2 25.6 -0.8 25 0Z" fill="#f5c35a"/>
          <path d="M0 -3V0H25C25.5 -1 25.6 -2 25.4 -3Z" fill="#ffffff"/>
          <path d="M13.6 -8.6l-1.6 2.4M17 -7.2l-1.6 2.4" fill="none" strokeWidth="1"/>
        </g>
        <path d="M160.03 188.71C160.86 195.67 163.55 216.89 165.01 230.49C166.48 244.09 167.94 260.17 168.81 270.3C169.67 280.44 169.97 287.78 170.21 291.28L181.79 290.72C181.69 287.22 181.33 279.9 181.19 269.7C181.06 259.49 181.19 243.25 180.99 229.51C180.78 215.78 180.14 194.33 179.97 187.29A10 10 0 0 0 160.03 188.71Z" fill="#7f9fdc"/>
        <path d="M182.25 285.5L182.69 290.68L169.31 291.32L169.26 286.12Z" fill="#7f9fdc"/>
        <rect x="151" y="186" width="33" height="5" rx="0.8" fill="#7f9fdc"/>
        <g transform="rotate(5 166 188)">
          <g transform="translate(168 102)">
            <path d="M-6 12L-7 27L-1 33L5.4 26.6L4 12Z" fill="#b47852"/>
            <path d="M-8 25C-14 27 -18 32 -19 39C-20 48 -18 58 -17 68C-16.4 74 -17 80 -18 85C-9 87.4 2 87.6 13 86C13 80 12 74 11.6 68C11.4 61 14.6 53 14.6 45C14.6 36 11 29 5 26.6L-1 32Z" fill="#3fa58a"/>
            <path d="M-8 25L-1 32L-4.4 34.6L-9.4 27.4ZM5 26.6L-1 32L2.6 34.6L7 28.6Z" fill="#3fa58a"/>
            <path d="M-15 72c3 3.4 7.4 5.6 12.6 6.4M7 54c1 2.6 1.6 5.2 1.6 8" fill="none" strokeWidth="1"/>
          </g>
          <g transform="translate(168 102) rotate(4)">
            <circle cx="-8.4" cy="-19" r="6.4" fill="#3a2d66"/>
            <path d="M-11.6 -21.2c1.4-1.6 3.4-2.2 5.4-1.8" fill="none" stroke="#7f6cc4" strokeWidth="1"/>
            <path d="M-4 15C-9 13 -12.6 8 -13 1C-13.4 -9 -8 -18.6 1 -19.4C7 -19.8 11.6 -16.6 12.6 -11.8L-1 8Z" fill="#3a2d66"/>
            <path d="M-3 -16.5C5 -16.5 10.5 -11.5 11 -4.5C11.2 -2.5 11.6 -0.6 12.6 1.4C13.4 3 13.4 4.4 12.4 5C11.8 5.4 11.4 5.6 11 6C11.6 7 11.6 8.2 11 9C10.8 10.5 10.2 12 8.6 13.8C6 16.4 2 17 -1.5 15.5C-5 14 -8 9.5 -9 4C-10 -4 -9 -16.5 -3 -16.5Z" fill="#b47852"/>
            <path d="M-13 1C-13.4 -9 -8 -18.6 1 -19.4C7.4 -19.8 12 -16.4 12.8 -11.4C13 -9.6 12.4 -8.4 11.4 -8.4C10.2 -11.2 7.4 -13.4 3.6 -13.6C1.6 -11.2 -1 -9.6 -3.6 -8.8C-3.2 -6.4 -3.6 -4 -4.6 -2.4C-6.8 -3.2 -8.6 -1.8 -8.8 0.6C-9 2.6 -8.6 4.6 -7.8 6.4C-10.8 6 -12.8 4.2 -13 1Z" fill="#3a2d66"/>
            <path d="M-5 -15.6c2.6-1.8 6-2.4 9-1.8M7.6 -15.4c1.4.6 2.6 1.6 3.4 2.8" fill="none" stroke="#7f6cc4" strokeWidth="1"/>
            <path d="M-3.6 -2.6C-6.1 -3.8 -7.9 -1.8 -7.6 0.7C-7.3 3.1 -5.7 4.4 -3.7 4Z" fill="#b47852"/>
            <path d="M-4.9 -0.8c-.9.3-1.1 1.6-.4 2.6" fill="none" strokeWidth="1"/>
            <circle cx="-5.2" cy="6.2" r="1.3" fill="#f5c35a" strokeWidth="1"/>
            <circle cx="4.6" cy="-1.4" r="1.15" fill="#3a2d66" stroke="none"/>
            <circle cx="9.5" cy="-1.5" r="1" fill="#3a2d66" stroke="none"/>
            <path d="M2.6 -5.2c1.1-.6 2.6-.7 3.8-.3M8.4 -5c.7-.4 1.5-.5 2.2-.3" fill="none" strokeWidth="1"/>
            <path d="M11.9 5.2c-.7.5-1.5.6-2.3.2" fill="none" strokeWidth="1"/>
            <path d="M10.1 9.3c-.9.6-2 .6-2.8 0" fill="none" strokeWidth="1"/>
          </g>
        </g>
        <path d="M167.49 138.57L193.39 162.11Q196.88 164.67 199.54 161.29Q208.2 149.03 215.86 136.1L216.17 132.72L213.45 130.86L210.41 132.39L196.42 152.92L173.75 131.83Z" fill="#b47852"/>
        <path d="M196.42 152.92l-2.2 -2.04" fill="none" strokeWidth="1"/>
        <path d="M167.54 128.24C170.94 124.58 176.07 129.34 176.31 132.02L184.09 139.81Q181.16 145.01 176.19 148.3L167.13 140.42C164.2 137.7 163.45 132.63 167.54 128.24Z" fill="#3fa58a"/>
        <g id="sp6-hand-near" transform="translate(213.14 134.25) rotate(-12) scale(1.1 1.1)" strokeWidth="1.27">
          <path d="M0 -3.6C3 -4.4 6 -4.8 9 -4.6L19.6 -4.4C21 -4.3 21 -2.1 19.6 -2L11.2 -1.8C12.6 -1.2 13 0.4 12 1.1C12.8 1.8 12.6 3.4 11.4 3.7C11.9 4.4 11.5 5.8 10.2 5.9C8.2 6 5.6 5.4 3.6 4.4C2.4 3.9 1.2 3.6 0 3.5Z" fill="#b47852" stroke="none"/>
          <path d="M0 -3.6C3 -4.4 6 -4.8 9 -4.6L19.6 -4.4C21 -4.3 21 -2.1 19.6 -2L11.2 -1.8C12.6 -1.2 13 0.4 12 1.1C12.8 1.8 12.6 3.4 11.4 3.7C11.9 4.4 11.5 5.8 10.2 5.9C8.2 6 5.6 5.4 3.6 4.4C2.4 3.9 1.2 3.6 0 3.5" fill="none"/>
          <path d="M12 1.1C10.8 0.9 9.8 1 8.8 1.3M11.4 3.7C10.4 3.5 9.4 3.6 8.4 3.9" fill="none" strokeWidth="0.82"/>
          <path d="M4.4 -3.4C6.4 -3.2 8.6 -2.4 10.2 -1.2C11 -0.6 10.4 0.6 9.4 0.2C8 -0.4 6.4 -0.8 5 -0.8Z" fill="#b47852"/>
        </g>
        <g id="sp6-plant-r">
          <path d="M396.2 284C394.2 265.1 394 250.4 396 242C397.6 254.6 405.2 267.2 403.8 284Z" fill="#3fa58a"/>
          <path d="M403.8 284C401.8 259.7 407 240.8 409 230C410.6 246.2 413.6 262.4 412.2 284Z" fill="#5fae7a"/>
          <path d="M411.4 284C409.4 267.8 418 255.2 420 248C421.6 258.8 420 269.6 418.6 284Z" fill="#8cc79b"/>
          <path d="M394 284H422L419 308H397Z" fill="#f6a85e"/>
          <path d="M396.7 296H419.3" fill="none" strokeWidth="1"/>
        </g>
      </g>
    </svg>
  );
}
