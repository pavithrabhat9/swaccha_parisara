import React from 'react';

/**
 * ContributionIllustration — Hand-authored 480×360 Line-interior SVG card
 * for the Home Contribution hero card.
 */
export default function ContributionIllustration({ className = 'w-full h-full' }) {
  return (
    <svg viewBox="0 0 480 360" className={className} aria-hidden="true">
      <rect id="sp4-card" width="480" height="360" fill="#ffffff" stroke="none"/>
      <g id="sp4-bg" fill="none" stroke="#cfc9e0" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <g id="sp4-bricks-a">
          <rect x="48" y="74" width="14" height="6" rx="0.6"/>
          <rect x="63" y="74" width="14" height="6" rx="0.6"/>
          <rect x="55" y="81" width="14" height="6" rx="0.6"/>
        </g>
        <g id="sp4-bricks-b">
          <rect x="408" y="146" width="14" height="6" rx="0.6"/>
          <rect x="423" y="146" width="14" height="6" rx="0.6"/>
          <rect x="415" y="153" width="14" height="6" rx="0.6"/>
        </g>
        <g id="sp4-lamp-a">
          <path d="M176 0V38"/>
          <path d="M164 50C164 42.5 169.5 38 176 38S188 42.5 188 50Z"/>
          <path d="M173 50.5a3 3 0 0 0 6 0"/>
          <path d="M176 57v5M168 55.5l-2.5 4M184 55.5l2.5 4"/>
        </g>
        <g id="sp4-lamp-b">
          <path d="M392 0V54"/>
          <path d="M388 54h8l6 12h-20Z"/>
          <path d="M389 66.5a3 3 0 0 0 6 0"/>
          <path d="M392 73v5M384 71.5l-2.5 4M400 71.5l2.5 4"/>
        </g>
        <g id="sp4-poster">
          <path d="M355 64L339 74M355 64L371 74"/>
          <rect x="332" y="74" width="46" height="56" rx="1"/>
          <rect x="336" y="78" width="38" height="48"/>
          <g transform="translate(332 74)">
            <rect x="8" y="10" width="30" height="16"/>
            <path d="M11 22l7-8 5 5 4-3 7 6"/>
            <path d="M8 33h24M8 38h16M8 43h12"/>
          </g>
        </g>
      </g>
      <g id="sp4-fg" stroke="#3a2d66" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path id="sp4-floor" d="M56 308H424M40 308h10M430 308h10" fill="none"/>
        <g id="sp4-plant-l">
          <path d="M78 272C76 250 71 232 64 216M78 272C79 238 78 202 76 170M78 272C80 250 85 232 91 214" fill="none"/>
          <path id="sp4-leaf-1" d="M64 217C68.93 210.03 63.59 198.9 58.05 191.53C53.4 185.55 48.24 181.2 46 180C45 182.77 43.69 190.28 44.29 198.22C46.59 207.17 54.36 217.11 64 217Z" fill="#8cc79b"/>
          <path d="M63.05 215.63Q53.2 199.37 47.24 183.97M56.72 205.9L59.15 200.14M55.49 203.75L49.11 202.28M52.15 197.14L55 191.18M51.17 194.87L45.2 193.2" fill="none" strokeWidth="1"/>
          <path id="sp4-leaf-2" d="M76 172C84.85 166.98 86.65 153.59 84.05 144.04C80.46 136.33 75.36 130.05 73 128C71.57 130.31 69.09 137.11 67.94 145.14C66.75 154.95 67.79 168.14 76 172Z" fill="#5fae7a"/>
          <path d="M76.13 170.22Q76.5 149.86 73.92 132.36M76.72 157.81L81.89 153.03M76.72 155.15L71.34 151.1M76.28 147.23L80.98 142.49M76 144.59L70.16 140.57" fill="none" strokeWidth="1"/>
          <path id="sp4-leaf-3" d="M91 215C100.45 215.69 107.89 207 109.99 198.89C110.45 191.61 109.03 184.62 108 182C105.83 182.97 100.84 186.67 96.39 191.89C91.09 198.34 86.05 208.27 91 215Z" fill="#5fae7a"/>
          <path d="M91.9 213.79Q101.28 199.42 106.85 185.58M97.94 205.21L104.26 204.29M99.11 203.31L96.53 197.81M102.27 197.42L108.18 196.29M103.19 195.39L100.21 189.68" fill="none" strokeWidth="1"/>
          <path d="M64 277H92L88.5 308H67.5Z" fill="#ffffff"/>
          <rect x="61.5" y="270.5" width="33" height="6.5" rx="1.5" fill="#ffffff"/>
          <path d="M71.5 287.5l3 3M74.5 287.5l-3 3M80.5 296.5l3 3M83.5 296.5l-3 3" fill="none" strokeWidth="1"/>
        </g>
        <g id="sp4-desk">
          <rect x="232" y="215" width="5" height="93" fill="#ffffff"/>
          <rect x="333" y="215" width="5" height="93" fill="#ffffff"/>
          <rect x="292" y="215" width="46" height="16" fill="#ffffff"/>
          <path d="M310 223h10" fill="none"/>
          <rect x="226" y="209.5" width="118" height="5.5" rx="1.5" fill="#ffffff"/>
          <rect x="272" y="195.5" width="7" height="9" fill="#ffffff"/>
          <path d="M263 209.5l2.5-5h20l2.5 5Z" fill="#ffffff"/>
          <rect x="246" y="154" width="60" height="41.5" rx="2.5" fill="#ffffff"/>
          <rect x="249" y="157" width="54" height="32" rx="0.8" fill="#ffffff" strokeWidth="1"/>
          <path d="M249 162h54" fill="none" strokeWidth="1"/>
          <circle cx="252.5" cy="159.5" r="0.9" fill="#ef5b5b" stroke="none"/>
          <circle cx="255.5" cy="159.5" r="0.9" fill="#f5c35a" stroke="none"/>
          <circle cx="258.5" cy="159.5" r="0.9" fill="#3fa58a" stroke="none"/>
          <g fill="none" strokeWidth="1.8">
            <path d="M254 167h10M267 167h14" stroke="#3fa58a"/>
            <path d="M254 172h16M273 172h9" stroke="#7f6cc4"/>
            <path d="M254 177h8M265 177h18" stroke="#ef5b5b"/>
            <path d="M254 182h14" stroke="#f6a85e"/>
          </g>
          <rect x="246" y="278" width="38" height="30" rx="1.2" fill="#f9c99a"/>
          <rect x="250" y="282" width="30" height="22" rx="0.6" fill="#ffffff"/>
          <rect x="254" y="289" width="22" height="8" rx="0.6" fill="#3fa58a" strokeWidth="1"/>
          <text x="265" y="294.8" fontFamily="ui-monospace, monospace" fontSize="4.6" fontWeight="700" textAnchor="middle" fill="#ffffff" stroke="none">52K</text>
        </g>
        <path d="M173.8 135.57L164.84 166.29Q166.13 166.75 164.62 166.36Q160.36 180.83 154.96 194.93L152.64 197.13L149.68 196.19L149.04 193.07L147.74 197.2L165.51 133.27Z" fill="#e2a57c"/>
        <g id="sp4-hand-far" transform="translate(152 194) rotate(84) scale(1.05 1.05)" strokeWidth="1.33">
          <path d="M0 -3.4C3 -4 6.2 -4.2 9.2 -3.8C11.8 -3.4 13.6 -2 14.4 0.2C15 1.8 15 3.8 14.4 5.6C14 6.8 12.6 6.8 12.4 5.6C12.6 6.8 11.6 7.6 10.6 7.2C10.6 8 9.6 8.6 8.6 8.1C8.4 8.8 7.2 9.2 6.4 8.4C5.6 7.4 5.4 5.6 4.8 4.4C3.6 3.8 2 3.6 0 3.4Z" fill="#e2a57c" stroke="none"/>
          <path d="M0 -3.4C3 -4 6.2 -4.2 9.2 -3.8C11.8 -3.4 13.6 -2 14.4 0.2C15 1.8 15 3.8 14.4 5.6C14 6.8 12.6 6.8 12.4 5.6C12.6 6.8 11.6 7.6 10.6 7.2C10.6 8 9.6 8.6 8.6 8.1C8.4 8.8 7.2 9.2 6.4 8.4C5.6 7.4 5.4 5.6 4.8 4.4C3.6 3.8 2 3.6 0 3.4" fill="none"/>
          <path d="M12.4 5.6C12.4 4.6 12.2 3.6 11.8 2.8M10.6 7.2C10.6 6 10.4 4.8 10 4M8.6 8.1C8.6 6.8 8.2 5.6 7.6 4.6" fill="none" strokeWidth="0.86"/>
          <path d="M7.4 -3.6C9.6 -3.8 12 -3.2 13.6 -1.8C14.4 -1.1 13.8 0 12.8 -0.4C11.2 -1 9.6 -1.2 8.2 -1Z" fill="#e2a57c"/>
        </g>
        <path d="M162.6 281.28L158.55 294.86L150.5 292.46L154.55 278.88Z" fill="#e2a57c"/>
        <g transform="translate(145.16 297.83) rotate(24)">
          <path d="M0 0V-7.5C0 -9.6 1.8 -10.6 4.6 -10.6H9C12 -10.2 14 -8.6 16.4 -7.4C19.6 -6 23.4 -5.4 25 -3.2C25.6 -2 25.6 -0.8 25 0Z" fill="#ef5b5b"/>
          <path d="M0 -3V0H25C25.5 -1 25.6 -2 25.4 -3Z" fill="#ffffff"/>
          <path d="M13.6 -8.6l-1.6 2.4M17 -7.2l-1.6 2.4" fill="none" strokeWidth="1"/>
        </g>
        <path d="M157.43 187.24C157.3 194.24 157.1 216.89 156.64 229.21C156.18 241.53 155.39 252.49 154.66 261.15C153.93 269.8 152.66 277.81 152.26 281.14L163.74 282.86C164.34 279.53 165.74 271.53 167.34 262.85C168.95 254.18 171.49 243.14 173.36 230.79C175.23 218.44 177.7 195.76 178.57 188.76A10.6 10.6 0 0 0 157.43 187.24Z" fill="#7f9fdc"/>
        <path d="M165.2 277.82L164.63 282.99L151.37 281.01L152.34 275.89Z" fill="#7f9fdc"/>
        <path d="M188.3 289.23L187.69 300.62L179.3 300.17L179.91 288.78Z" fill="#e2a57c"/>
        <g transform="translate(177 308)">
          <path d="M0 0V-7.5C0 -9.6 1.8 -10.6 4.6 -10.6H9C12 -10.2 14 -8.6 16.4 -7.4C19.6 -6 23.4 -5.4 25 -3.2C25.6 -2 25.6 -0.8 25 0Z" fill="#ef5b5b"/>
          <path d="M0 -3V0H25C25.5 -1 25.6 -2 25.4 -3Z" fill="#ffffff"/>
          <path d="M13.6 -8.6l-1.6 2.4M17 -7.2l-1.6 2.4" fill="none" strokeWidth="1"/>
        </g>
        <path d="M168.03 188.71C168.86 195.67 171.55 216.89 173.01 230.49C174.48 244.09 175.94 260.17 176.81 270.3C177.67 280.44 177.97 287.78 178.21 291.28L189.79 290.72C189.69 287.22 189.33 279.9 189.19 269.7C189.06 259.49 189.19 243.25 188.99 229.51C188.78 215.78 188.14 194.33 187.97 187.29A10 10 0 0 0 168.03 188.71Z" fill="#7f9fdc"/>
        <path d="M190.25 285.5L190.69 290.68L177.31 291.32L177.26 286.12Z" fill="#7f9fdc"/>
        <rect x="159" y="186" width="33" height="5" rx="0.8" fill="#7f9fdc"/>
        <g transform="rotate(5 174 188)">
          <g transform="translate(176 102)">
            <path d="M-6 12L-7 27L-1 33L5.4 26.6L4 12Z" fill="#e2a57c"/>
            <path d="M-8 25C-14 27 -18 32 -19 39C-20 48 -18 58 -17 68C-16.4 74 -17 80 -18 85C-9 87.4 2 87.6 13 86C13 80 12 74 11.6 68C11.4 61 14.6 53 14.6 45C14.6 36 11 29 5 26.6L-1 32Z" fill="#ab9ee6"/>
            <path d="M-8 25L-1 32L-4.4 34.6L-9.4 27.4ZM5 26.6L-1 32L2.6 34.6L7 28.6Z" fill="#ab9ee6"/>
            <path d="M-15 72c3 3.4 7.4 5.6 12.6 6.4M7 54c1 2.6 1.6 5.2 1.6 8" fill="none" strokeWidth="1"/>
          </g>
          <g transform="translate(176 102) rotate(4)">
            <circle cx="-8.4" cy="-19" r="6.4" fill="#3a2d66"/>
            <path d="M-11.6 -21.2c1.4-1.6 3.4-2.2 5.4-1.8" fill="none" stroke="#7f6cc4" strokeWidth="1"/>
            <path d="M-4 15C-9 13 -12.6 8 -13 1C-13.4 -9 -8 -18.6 1 -19.4C7 -19.8 11.6 -16.6 12.6 -11.8L-1 8Z" fill="#3a2d66"/>
            <path d="M-3 -16.5C5 -16.5 10.5 -11.5 11 -4.5C11.2 -2.5 11.6 -0.6 12.6 1.4C13.4 3 13.4 4.4 12.4 5C11.8 5.4 11.4 5.6 11 6C11.6 7 11.6 8.2 11 9C10.8 10.5 10.2 12 8.6 13.8C6 16.4 2 17 -1.5 15.5C-5 14 -8 9.5 -9 4C-10 -4 -9 -16.5 -3 -16.5Z" fill="#e2a57c"/>
            <path d="M-13 1C-13.4 -9 -8 -18.6 1 -19.4C7.4 -19.8 12 -16.4 12.8 -11.4C13 -9.6 12.4 -8.4 11.4 -8.4C10.2 -11.2 7.4 -13.4 3.6 -13.6C1.6 -11.2 -1 -9.6 -3.6 -8.8C-3.2 -6.4 -3.6 -4 -4.6 -2.4C-6.8 -3.2 -8.6 -1.8 -8.8 0.6C-9 2.6 -8.6 4.6 -7.8 6.4C-10.8 6 -12.8 4.2 -13 1Z" fill="#3a2d66"/>
            <path d="M-5 -15.6c2.6-1.8 6-2.4 9-1.8M7.6 -15.4c1.4.6 2.6 1.6 3.4 2.8" fill="none" stroke="#7f6cc4" strokeWidth="1"/>
            <path d="M-3.6 -2.6C-6.1 -3.8 -7.9 -1.8 -7.6 0.7C-7.3 3.1 -5.7 4.4 -3.7 4Z" fill="#e2a57c"/>
            <path d="M-4.9 -0.8c-.9.3-1.1 1.6-.4 2.6" fill="none" strokeWidth="1"/>
            <circle cx="-5.2" cy="6.2" r="1.3" fill="#f5c35a" strokeWidth="1"/>
            <circle cx="4.6" cy="-1.4" r="1.15" fill="#3a2d66" stroke="none"/>
            <circle cx="9.5" cy="-1.5" r="1" fill="#3a2d66" stroke="none"/>
            <path d="M2.6 -5.2c1.1-.6 2.6-.7 3.8-.3M8.4 -5c.7-.4 1.5-.5 2.2-.3" fill="none" strokeWidth="1"/>
            <path d="M11.9 5.2c-.7.5-1.5.6-2.3.2" fill="none" strokeWidth="1"/>
            <path d="M10.1 9.3c-.9.6-2 .6-2.8 0" fill="none" strokeWidth="1"/>
          </g>
        </g>
        <path d="M174.5 137.24L190.39 168.43Q190.08 170.51 192.27 170.08Q205.38 177.38 219.06 183.61L222.46 183.56L224.01 180.64L222.17 177.79L198.61 165.21L182.74 133.16Z" fill="#e2a57c"/>
        <path d="M198.61 165.21l-1.33 -2.69" fill="none" strokeWidth="1"/>
        <path d="M178.2 127.6C182.68 125.38 185.79 131.65 185.06 134.24L189.59 144.28Q185.01 148.11 179.19 149.43L173.51 138.85C171.73 135.27 172.82 130.26 178.2 127.6Z" fill="#ab9ee6"/>
        <g id="sp4-hand-near" transform="translate(220.61 180.7) rotate(-8) scale(1.1 1.1)" strokeWidth="1.27">
          <path d="M0 -3.6C3 -4.4 6 -4.8 9 -4.6L19.6 -4.4C21 -4.3 21 -2.1 19.6 -2L11.2 -1.8C12.6 -1.2 13 0.4 12 1.1C12.8 1.8 12.6 3.4 11.4 3.7C11.9 4.4 11.5 5.8 10.2 5.9C8.2 6 5.6 5.4 3.6 4.4C2.4 3.9 1.2 3.6 0 3.5Z" fill="#e2a57c" stroke="none"/>
          <path d="M0 -3.6C3 -4.4 6 -4.8 9 -4.6L19.6 -4.4C21 -4.3 21 -2.1 19.6 -2L11.2 -1.8C12.6 -1.2 13 0.4 12 1.1C12.8 1.8 12.6 3.4 11.4 3.7C11.9 4.4 11.5 5.8 10.2 5.9C8.2 6 5.6 5.4 3.6 4.4C2.4 3.9 1.2 3.6 0 3.5" fill="none"/>
          <path d="M12 1.1C10.8 0.9 9.8 1 8.8 1.3M11.4 3.7C10.4 3.5 9.4 3.6 8.4 3.9" fill="none" strokeWidth="0.82"/>
          <path d="M4.4 -3.4C6.4 -3.2 8.6 -2.4 10.2 -1.2C11 -0.6 10.4 0.6 9.4 0.2C8 -0.4 6.4 -0.8 5 -0.8Z" fill="#e2a57c"/>
        </g>
        <g id="sp4-plant-r">
          <path d="M394.2 284C392.2 265.1 392 250.4 394 242C395.6 254.6 403.2 267.2 401.8 284Z" fill="#3fa58a"/>
          <path d="M401.8 284C399.8 259.7 405 240.8 407 230C408.6 246.2 411.6 262.4 410.2 284Z" fill="#5fae7a"/>
          <path d="M409.4 284C407.4 267.8 416 255.2 418 248C419.6 258.8 418 269.6 416.6 284Z" fill="#8cc79b"/>
          <path d="M392 284H420L417 308H395Z" fill="#f6a85e"/>
          <path d="M394.7 296H417.3" fill="none" strokeWidth="1"/>
        </g>
      </g>
    </svg>
  );
}
