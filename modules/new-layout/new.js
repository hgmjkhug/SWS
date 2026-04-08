function getPathSVG(top = true, bottom = true, left = true, right = true) {
    return `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="30" transform="matrix(-1 0 0 1 30 0)" fill="#DFF0FF" fill-opacity="0.5"/>
    ${top ? '<path d="M15 0V15" stroke="#7C8DB5" stroke-opacity="0.7"/>' : ''}
    ${bottom ? '<path d="M15 15V30" stroke="#7C8DB5" stroke-opacity="0.7"/>' : ''}
    ${left ? '<path d="M0 15H15" stroke="#7C8DB5" stroke-opacity="0.7"/>' : ''}
    ${right ? '<path d="M15 15H30" stroke="#7C8DB5" stroke-opacity="0.7"/>' : ''}
    <ellipse cx="2" cy="1.97531" rx="2" ry="1.97531" transform="matrix(-1 0 0 1 17 13)" fill="#677594"/>
    </svg>`;
}

function getRailSVG(hasVertical = false, hasLeft = true, hasRight = true) {
    const xStart = hasLeft ? 0 : 15;
    const xEnd = hasRight ? 30 : 15;
    return `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="30" fill="#DFF0FF" fill-opacity="0.3"/>
    <path d="M${xStart} 15H${xEnd}" stroke="#7C8DB5" stroke-opacity="0.8" stroke-width="1"/>
    ${hasVertical ? '<path d="M15 0V30" stroke="#7C8DB5" stroke-opacity="0.7"/>' : ''}
    <circle cx="15" cy="15" r="1.5" fill="#677594"/>
    </svg>`;
}

const SVG_EMPTY = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="30" transform="matrix(-1 0 0 1 30 0)" fill="#DFF0FF" fill-opacity="0.5"/>
    <ellipse cx="2" cy="1.97531" rx="2" ry="1.97531" transform="matrix(-1 0 0 1 17 13)" fill="#677594"/>
    </svg>`;

const SVG_WALL_V = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="30" height="30" fill="#DFF0FF" fill-opacity="0.5"/>
<path d="M15 0L15 15" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M15 15L15 30" stroke="#7C8DB5" stroke-opacity="0.7"/>
</svg>`;

const SVG_WALL_H = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="30" height="30" transform="matrix(0 -1 1 0 0 30)" fill="#DFF0FF" fill-opacity="0.5"/>
<path d="M0 15L15 15" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M15 15L30 15" stroke="#7C8DB5" stroke-opacity="0.7"/>
</svg>`;

const SVG_WALL_CORNER_TL = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="30" height="30" transform="matrix(-1 0 0 1 30 0)" fill="#DFF0FF" fill-opacity="0.5"/>
<path d="M15 15H30" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M15 15V30" stroke="#7C8DB5" stroke-opacity="0.7"/>
</svg>`;

const SVG_WALL_CORNER_TR = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="30" height="30" transform="matrix(-1 0 0 1 30 0)" fill="#DFF0FF" fill-opacity="0.5"/>
<path d="M0 15H15" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M15 15V30" stroke="#7C8DB5" stroke-opacity="0.7"/>
</svg>`;

const SVG_WALL_CORNER_BL = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="30" height="30" transform="matrix(-1 0 0 1 30 0)" fill="#DFF0FF" fill-opacity="0.5"/>
<path d="M15 0V15" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M15 15H30" stroke="#7C8DB5" stroke-opacity="0.7"/>
</svg>`;

const SVG_WALL_CORNER_BR = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="30" height="30" transform="matrix(-1 0 0 1 30 0)" fill="#DFF0FF" fill-opacity="0.5"/>
<path d="M15 0V15" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M0 15H15" stroke="#7C8DB5" stroke-opacity="0.7"/>
</svg>`;

const SVG_WALL_T_TOP = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="30" height="30" transform="matrix(-1 0 0 1 30 0)" fill="#DFF0FF" fill-opacity="0.5"/>
<path d="M0 15H30" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M15 15V30" stroke="#7C8DB5" stroke-opacity="0.7"/>
</svg>`;

const SVG_WALL_T_BOTTOM = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="30" height="30" transform="matrix(-1 0 0 1 30 0)" fill="#DFF0FF" fill-opacity="0.5"/>
<path d="M0 15H30" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M15 0V15" stroke="#7C8DB5" stroke-opacity="0.7"/>
</svg>`;

const SVG_SHELF = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="30" height="30" fill="#A4D3FE" fill-opacity="0.4"/>
<path d="M0 15H9" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M30 15H21" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M17.6113 11.0128C17.3858 11.2383 17.0119 11.2383 16.7864 11.0128L14.999 9.22541L13.2116 11.0128C12.9861 11.2383 12.6121 11.2383 12.3866 11.0128C12.1611 10.7873 12.1611 10.4134 12.3866 10.1879L14.5865 7.98798C14.812 7.76249 15.186 7.76249 15.4114 7.98798L17.6113 10.1879C17.8368 10.4134 17.8368 10.7873 17.6113 11.0128Z" fill="#076EB8"/>
<path d="M17.6113 19.8121L15.4114 22.012C15.186 22.2375 14.812 22.2375 14.5865 22.012L12.3866 19.8121C12.1611 19.5866 12.1611 19.2127 12.3866 18.9872C12.6121 18.7617 12.9861 18.7617 13.2116 18.9872L14.999 20.7746L16.7864 18.9872C17.0119 18.7617 17.3858 18.7617 17.6113 18.9872C17.8368 19.2127 17.8368 19.5866 17.6113 19.8121Z" fill="#076EB8"/>
<path d="M11.0111 17.6124C10.7856 17.8379 10.4116 17.8379 10.1861 17.6124L7.98621 15.4125C7.76072 15.187 7.76072 14.813 7.98621 14.5875L10.1861 12.3876C10.4116 12.1621 10.7856 12.1621 11.0111 12.3876C11.2365 12.6131 11.2365 12.9871 11.0111 13.2126L9.22365 15L11.0111 16.7874C11.2365 17.0129 11.2365 17.3869 11.0111 17.6124Z" fill="#076EB8"/>
<path d="M22.0088 15.4125L19.8089 17.6124C19.5834 17.8379 19.2094 17.8379 18.9839 17.6124C18.7585 17.3869 18.7585 17.0129 18.9839 16.7874L20.7714 15L18.9839 13.2126C18.7585 12.9871 18.7585 12.6131 18.9839 12.3876C19.2094 12.1621 19.5834 12.1621 19.8089 12.3876L22.0088 14.5875C22.2343 14.813 22.2343 15.187 22.0088 15.4125Z" fill="#076EB8"/>
<rect x="0.25" y="0.25" width="29.5" height="29.5" stroke="#D8D8D8" stroke-opacity="0.2" stroke-width="0.5"/>
</svg>`;

const SVG_INBOUND = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="30" height="30" fill="#A4D3FE" fill-opacity="0.4"/>
<path d="M15 0V10" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M15 30V20" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M0 15H10" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M8.97198 16.4757L8.97198 12.8543C8.97198 10.1273 10.1384 8.96088 12.8655 8.96088H12.9377C15.4037 8.96088 16.5923 9.93286 16.7978 12.1101C16.8145 12.3323 16.6478 12.5433 16.4201 12.5655C16.1924 12.5877 15.9869 12.4211 15.9647 12.1878C15.8036 10.4438 14.9816 9.794 12.9321 9.794H12.8599C10.5994 9.794 9.79955 10.5938 9.79955 12.8543L9.79955 16.4757C9.79955 18.7362 10.5994 19.536 12.8599 19.536H12.9321C14.9927 19.536 15.8147 18.8751 15.9647 17.0977C15.9869 16.87 16.1868 16.6978 16.4146 16.72C16.6423 16.7423 16.8145 16.9367 16.7922 17.1699C16.6034 19.3805 15.4093 20.3691 12.9265 20.3691H12.8543C10.1384 20.3691 8.97198 19.2028 8.97198 16.4757Z" fill="#076EB8"/>
<path d="M12.5822 14.665C12.5822 14.4373 12.771 14.2484 12.9988 14.2484L19.3194 14.2484C19.5471 14.2484 19.736 14.4373 19.736 14.665C19.736 14.8927 19.5471 15.0816 19.3194 15.0816L12.9988 15.0816C12.771 15.0816 12.5822 14.8927 12.5822 14.665Z" fill="#076EB8"/>
<path d="M17.6642 16.5257C17.6642 16.4201 17.7031 16.3146 17.7864 16.2313L19.3527 14.665L17.7864 13.0987C17.6253 12.9377 17.6253 12.6711 17.7864 12.51C17.9474 12.3489 18.214 12.3489 18.3751 12.51L20.2358 14.3706C20.3968 14.5317 20.3968 14.7983 20.2358 14.9594L18.3751 16.82C18.214 16.9811 17.9474 16.9811 17.7864 16.82C17.7031 16.7423 17.6642 16.6312 17.6642 16.5257Z" fill="#076EB8"/>
<rect x="0.25" y="0.25" width="29.5" height="29.5" stroke="#D8D8D8" stroke-opacity="0.2" stroke-width="0.5"/>
</svg>`;

const SVG_OUTBOUND = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="30" height="30" fill="#A4D3FE" fill-opacity="0.4"/>
<path d="M15 30V20" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M20 15H30" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M20.358 12.8543V16.4756C20.358 19.2027 19.1916 20.3691 16.4645 20.3691H16.3923C13.9262 20.3691 12.7377 19.3971 12.5322 17.2199C12.5155 16.9977 12.6821 16.7867 12.9098 16.7645C13.1376 16.7422 13.3431 16.9089 13.3653 17.1421C13.5263 18.8861 14.3484 19.536 16.3979 19.536H16.4701C18.7306 19.536 19.5304 18.7362 19.5304 16.4756V12.8543C19.5304 10.5938 18.7306 9.79398 16.4701 9.79398H16.3979C14.3373 9.79398 13.5152 10.4549 13.3653 12.2323C13.3431 12.46 13.1431 12.6322 12.9154 12.6099C12.6877 12.5877 12.5155 12.3933 12.5377 12.1601C12.7265 9.94949 13.9207 8.96085 16.4034 8.96085H16.4756C19.1916 8.96085 20.358 10.1272 20.358 12.8543Z" fill="#076EB8"/>
<path d="M16.6811 14.665C16.6811 14.8927 16.4923 15.0815 16.2645 15.0815H9.11078C8.88306 15.0815 8.69421 14.8927 8.69421 14.665C8.69421 14.4373 8.88306 14.2484 9.11078 14.2484H16.2645C16.4978 14.2484 16.6811 14.4373 16.6811 14.665Z" fill="#076EB8"/>
<path d="M17.3032 14.665C17.3032 14.7705 17.2643 14.876 17.181 14.9593L15.3204 16.82C15.1593 16.9811 14.8927 16.9811 14.7316 16.82C14.5706 16.6589 14.5706 16.3923 14.7316 16.2313L16.2979 14.665L14.7316 13.0987C14.5706 12.9376 14.5706 12.671 14.7316 12.51C14.8927 12.3489 15.1593 12.3489 15.3204 12.51L17.181 14.3706C17.2643 14.4539 17.3032 14.5594 17.3032 14.665Z" fill="#076EB8"/>
<rect x="0.25" y="0.25" width="29.5" height="29.5" stroke="#D8D8D8" stroke-opacity="0.2" stroke-width="0.5"/>
</svg>`;

const SVG_DOOR = `
<svg width="90" height="30" viewBox="0 0 90 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_128_188)">
<rect width="90" height="30" fill="#A4D3FE" fill-opacity="0.4"/>
<path d="M0 15H12.5H25" stroke="#076EB8" stroke-opacity="0.7" stroke-width="2"/>
<path d="M65 15H90" stroke="#076EB8" stroke-opacity="0.7" stroke-width="2"/>
<path d="M26 8V16" stroke="#076EB8" stroke-opacity="0.7" stroke-width="2"/>
<path d="M64 8V16" stroke="#076EB8" stroke-opacity="0.7" stroke-width="2"/>
<path d="M45 0V30" stroke="#7C8DB5" stroke-opacity="0.7"/>
</g>
<rect x="0.25" y="0.25" width="89.5" height="29.5" stroke="#D8D8D8" stroke-opacity="0.2" stroke-width="0.5"/>
<defs>
<clipPath id="clip0_128_188">
<rect width="90" height="30" fill="white"/>
</clipPath>
</defs>
</svg>
`;


const SVG_CLSDOOR = `
<svg width="90" height="30" viewBox="0 0 90 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_128_188)">
<rect width="90" height="30" fill="#A4D3FE" fill-opacity="0.4"/>
<path d="M0 15H12.5H25" stroke="#076EB8" stroke-opacity="0.7" stroke-width="2"/>
<path d="M65 15H90" stroke="#076EB8" stroke-opacity="0.7" stroke-width="2"/>
<path d="M26 8V16" stroke="#076EB8" stroke-opacity="0.7" stroke-width="2"/>
<path d="M64 8V16" stroke="#076EB8" stroke-opacity="0.7" stroke-width="2"/>
<path d="M45 0V30" stroke="#7C8DB5" stroke-opacity="0.7"/>
</g>
<rect x="0.25" y="0.25" width="89.5" height="29.5" stroke="#D8D8D8" stroke-opacity="0.2" stroke-width="0.5"/>
<defs>
<clipPath id="clip0_128_188">
<rect width="90" height="30" fill="white"/>
</clipPath>
</defs>
</svg>
`;

const SVG_WAITING = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="30" height="30" fill="#A4D3FE" fill-opacity="0.4"/>
<rect x="0.25" y="0.25" width="29.5" height="29.5" stroke="#D8D8D8" stroke-opacity="0.2" stroke-width="0.5"/>
<path d="M15.0004 0V8.25" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M15.0004 30V21.75" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M0 15H8.25" stroke="#7C8DB5" stroke-opacity="0.7"/>
<g clip-path="url(#clip0_130_214)">
<path d="M21.5938 14.5C21.5937 16.1162 20.9517 17.6661 19.8089 18.8089C18.6661 19.9517 17.1162 20.5938 15.5 20.5938C13.8838 20.5938 12.3339 19.9517 11.1911 18.8089C10.0483 17.6661 9.40625 16.1162 9.40625 14.5C9.40625 12.8838 10.0483 11.3339 11.1911 10.1911C12.3339 9.04827 13.8838 8.40625 15.5 8.40625C17.1162 8.40625 18.6661 9.04827 19.8089 10.1911C20.9517 11.3339 21.5938 12.8838 21.5938 14.5ZM8 14.5C8 16.4891 8.79018 18.3968 10.1967 19.8033C11.6032 21.2098 13.5109 22 15.5 22C17.4891 22 19.3968 21.2098 20.8033 19.8033C22.2098 18.3968 23 16.4891 23 14.5C23 12.5109 22.2098 10.6032 20.8033 9.1967C19.3968 7.79018 17.4891 7 15.5 7C13.5109 7 11.6032 7.79018 10.1967 9.1967C8.79018 10.6032 8 12.5109 8 14.5ZM14.7969 10.5156V14.5C14.7969 14.7344 14.9141 14.9541 15.1104 15.0859L17.9229 16.9609C18.2451 17.1777 18.6816 17.0898 18.8984 16.7646C19.1152 16.4395 19.0273 16.0059 18.7021 15.7891L16.2031 14.125V10.5156C16.2031 10.126 15.8896 9.8125 15.5 9.8125C15.1104 9.8125 14.7969 10.126 14.7969 10.5156Z" fill="#076EB8"/>
</g>
<defs>
<clipPath id="clip0_130_214">
<rect width="15" height="15" fill="white" transform="translate(8 7)"/>
</clipPath>
</defs>
</svg>`;

const SVG_P_PORT = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="30" height="30" fill="#A4D3FE" fill-opacity="0.4"/>
<rect x="0.25" y="0.25" width="29.5" height="29.5" stroke="#D8D8D8" stroke-opacity="0.2" stroke-width="0.5"/>
<path d="M15.0004 0V8.25" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M15.0004 30V21.75" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M0 15H8.25" stroke="#7C8DB5" stroke-opacity="0.7"/>
<circle cx="15.5" cy="14.5" r="6.9" fill="white" stroke="#076EB8" stroke-width="1.2"/>
<path d="M14.0682 19C13.6209 19 13.25 18.6779 13.25 18.2895V10.7105C13.25 10.3221 13.6209 10 14.0682 10H16.25C17.9082 10 19.25 11.1653 19.25 12.6053C19.25 14.0453 17.9082 15.2105 16.25 15.2105H14.8864V18.2895C14.8864 18.6779 14.5155 19 14.0682 19ZM14.8864 13.7895H16.25C17.0027 13.7895 17.6136 13.2589 17.6136 12.6053C17.6136 11.9516 17.0027 11.4211 16.25 11.4211H14.8864V13.7895Z" fill="#076EB8"/>
</svg>`;

const SVG_SHUTTLE_LOADED = `<svg width="30" height="22" viewBox="0 0 30 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_i_112_208)">
<g clip-path="url(#clip0_112_208)">
<path d="M0 7.5C0 3.35786 3.35786 0 7.5 0H24C27.3137 0 30 2.68629 30 6V16C30 19.3137 27.3137 22 24 22H7.5C3.35786 22 0 18.6421 0 14.5V7.5Z" fill="#396BE0"/>
<circle cx="14.665" cy="10.665" r="6.415" fill="white" stroke="#076EB8" stroke-width="0.5"/>
<circle cx="14.665" cy="10.665" r="6.415" fill="white" stroke="#076EB8" stroke-width="0.5"/>
<g filter="url(#filter1_d_112_208)">
<path d="M15.3861 6.66599L10.6882 7.35845L13.0706 9.12425L18.6498 7.95859L15.3861 6.66599Z" fill="#38A0F0" fill-opacity="0.7"/>
<path d="M12.9876 9.23964L10.666 7.47385L10.6782 11.6056L12.9876 14.6178V9.23964Z" fill="#1D8ADF"/>
<path d="M18.6625 8.10858L13.132 9.30886V14.6639L18.6625 12.6904V8.10858Z" fill="#0F6EB8" stroke="#0F6EB8" stroke-width="0.1"/>
</g>
</g>
</g>
<defs>
<filter id="filter0_i_112_208" x="0" y="0" width="30" height="26" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="7.5"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_112_208"/>
</filter>
<filter id="filter1_d_112_208" x="6.66602" y="6.66599" width="16.0465" height="16.0689" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_112_208"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_112_208" result="shape"/>
</filter>
<clipPath id="clip0_112_208">
<path d="M0 7.5C0 3.35786 3.35786 0 7.5 0H24C27.3137 0 30 2.68629 30 6V16C30 19.3137 27.3137 22 24 22H7.5C3.35786 22 0 18.6421 0 14.5V7.5Z" fill="white"/>
</clipPath>
</defs>
</svg>`;

const SVG_SHUTTLE_LOADED_V = `<svg width="22" height="30" viewBox="0 0 22 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_i_112_230)">
<path d="M7.5 30C3.35786 30 0 26.6421 0 22.5V6C0 2.68629 2.68629 0 6 0H16C19.3137 0 22 2.68629 22 6V22.5C22 26.6421 18.6421 30 14.5 30H7.5Z" fill="#396BE0"/>
<circle cx="10.665" cy="15.335" r="6.415" transform="rotate(-90 10.665 15.335)" fill="white" stroke="#076EB8" stroke-width="0.5"/>
<g filter="url(#filter1_d_112_230)">
<path d="M11.7201 11L7.02222 11.6925L9.4046 13.4583L14.9838 12.2926L11.7201 11Z" fill="#38A0F0" fill-opacity="0.7"/>
<path d="M9.32161 13.5737L7 11.8079L7.01216 15.9396L9.32161 18.9518V13.5737Z" fill="#1D8ADF"/>
<path d="M14.9965 12.4426L9.46594 13.6429V18.998L14.9965 17.0244V12.4426Z" fill="#0F6EB8" stroke="#0F6EB8" stroke-width="0.1"/>
</g>
</g>
<defs>
<filter id="filter0_i_112_230" x="0" y="0" width="22" height="34" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="7.5"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_112_230"/>
</filter>
<filter id="filter1_d_112_230" x="3" y="11" width="16.0465" height="16.0689" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_112_230"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_112_230" result="shape"/>
</filter>
</defs>
</svg>`;

const ROWS = 17;
const COLS = 55;

(function initNewLayout() {
    const grid = document.getElementById('new-layout-grid');
    if (!grid) return;
    
    // Generate the Map Matrix
    const mapMatrix = [];
    for (let r = 0; r < ROWS; r++) {
        const row = [];
        for (let c = 0; c < COLS; c++) {
            let type = 'path'; // Default to empty path
            
            if (r >= 0 && r <= 13) {
                const isWallCol = (c === 0 || c === 18 || c === 36 || c === 54);
                const isWallRow = (r === 0 || r === 13);
                
                if (isWallCol && isWallRow) {
                    if (r === 0) {
                        if (c === 0) type = 'wall-tl';
                        else if (c === 54) type = 'wall-tr';
                        else type = 'wall-t-top';
                    } else { // r === 13
                        if (c === 0) type = 'wall-bl';
                        else if (c === 54) type = 'wall-br';
                        else type = 'wall-t-bottom';
                    }
                } else if (isWallCol) {
                    type = 'wall-v';
                } else if (isWallRow) {
                    if (r === 13 && (c === 9 || c === 27 || c === 45)) type = 'door';
                    else type = 'wall-h';
                } else {
                    // Inside the module frame
                    const modCol = (c < 18) ? c - 1 : (c < 36) ? c - 19 : c - 37;
                    if (r === 12) {
                        type = 'path';
                    } else if (r === 1 || r === 11) {
                        if (modCol === 0 && r === 1) type = 'outbound';
                        else if (modCol === 16 && r === 11) type = 'inbound';
                        else if (modCol === 0 || modCol === 16) type = 'path'; 
                        else if (modCol >= 0 && modCol <= 16) type = 'shelf'; 
                        else type = 'path';
                    } else if (r >= 2 && r <= 10) {
                        if (modCol === 0 || modCol === 16) type = 'path';
                        else if (modCol >= 0 && modCol <= 16) type = 'shelf';
                        else type = 'empty';
                    } else {
                        type = 'empty';
                    }
                }
            } else if (r >= 14) {
                type = 'h-rail';
            }

            row.push(type);
        }
        mapMatrix.push(row);
    }
    
    // Prepare Module Containers
    const modA = document.createElement('div');
    modA.className = 'module-block mod-A';
    const modB = document.createElement('div');
    modB.className = 'module-block mod-B';
    const modC = document.createElement('div');
    modC.className = 'module-block mod-C';

    // Render the grid
    mapMatrix.forEach((row, r) => {
        row.forEach((type, c) => {
            const cell = document.createElement('div');
            cell.className = `map-cell cell-${type} r-${r} c-${c}`;
            
            let svgContent = '';
            if (type === 'path') {
                const modCol = (c < 18) ? c - 1 : (c < 36) ? c - 19 : c - 37;
                let top = (r !== 1);
                let bottom = (r !== 12 || (c === 9 || c === 27 || c === 45));
                let left = (modCol !== 0);
                let right = (modCol !== 16);

                if (r === 12) {
                    if (modCol !== 0 && modCol !== 16) top = false;
                }
                svgContent = getPathSVG(top, bottom, left, right);
            }
            else if (type === 'empty') svgContent = SVG_EMPTY;
            else if (type === 'shelf') svgContent = SVG_SHELF;
            else if (type === 'inbound') svgContent = SVG_INBOUND;
            else if (type === 'outbound') svgContent = SVG_OUTBOUND;
            else if (type === 'wall-v') svgContent = SVG_WALL_V;
            else if (type === 'wall-h') svgContent = SVG_WALL_H;
            else if (type === 'wall-tl') svgContent = SVG_WALL_CORNER_TL;
            else if (type === 'wall-tr') svgContent = SVG_WALL_CORNER_TR;
            else if (type === 'wall-bl') svgContent = SVG_WALL_CORNER_BL;
            else if (type === 'wall-br') svgContent = SVG_WALL_CORNER_BR;
            else if (type === 'wall-t-top') svgContent = SVG_WALL_T_TOP;
            else if (type === 'wall-t-bottom') svgContent = SVG_WALL_T_BOTTOM;
            else if (type === 'door') svgContent = SVG_CLSDOOR; // Default to closed
            else if (type === 'h-rail') {
                const vertCols = [0, 9, 18, 27, 36, 45, 54];
                const hasLeft = (c !== 0);
                const hasRight = (c !== COLS - 1);
                svgContent = getRailSVG(vertCols.includes(c), hasLeft, hasRight);
            }

            if (c === 17 && (r === 4 || r === 6)) {
                svgContent = SVG_P_PORT;
            }

            if (c === 17 && r === 8) {
                svgContent = SVG_WAITING;
            }
            
            cell.innerHTML = svgContent;
            
            // Append to appropriate module block
            if (c <= 18) modA.appendChild(cell);
            else if (c <= 36) modB.appendChild(cell);
            else modC.appendChild(cell);
        });
    });
    
    grid.appendChild(modA);
    grid.appendChild(modB);
    grid.appendChild(modC);

    let activeAnimationTimeout;

    // Shuttle Animation Logic
    function createShuttle() {
        const wrapper = document.getElementById('new-layout-grid-scaler');
        const shuttle = document.createElement('div');
        shuttle.className = 'shuttle-cargo';
        shuttle.innerHTML = SVG_SHUTTLE_LOADED_V; // Initial vertical
        shuttle.style.position = 'absolute';
        shuttle.style.transition = 'all 2s linear'; // Slower transition (2s)
        shuttle.style.width = '22px';
        shuttle.style.height = '30px';
        shuttle.style.zIndex = '100';
        wrapper.appendChild(shuttle);
        return shuttle;
    }

    function setPosition(shuttle, r, c, vertical = true) {
        const cellSize = 30;
        const w = vertical ? 22 : 30;
        const h = vertical ? 30 : 22;
        
        shuttle.innerHTML = vertical ? SVG_SHUTTLE_LOADED_V : SVG_SHUTTLE_LOADED;
        shuttle.style.width = `${w}px`;
        shuttle.style.height = `${h}px`;
        
        const x = c * cellSize + (cellSize - w) / 2;
        const y = r * cellSize + (cellSize - h) / 2;
        shuttle.style.left = `${x}px`;
        shuttle.style.top = `${y}px`;
    }

    async function animateShuttle() {
        const shuttle = createShuttle();
        const startR = 15;
        const doorC = 9;
        const inboundC = 17; // Corrected inbound column
        const inboundR = 11;
        const moveDelay = 2000; // Delay matching the 2s transition

        // Position at start (Vertical)
        setPosition(shuttle, startR, doorC, true);
        
        await new Promise(r => setTimeout(r, moveDelay));

        // Move to door area (r=14) (Vertical)
        setPosition(shuttle, 14, doorC, true);
        await new Promise(r => setTimeout(r, moveDelay));

        // Open door
        const doorCell = document.querySelector(`.r-13.c-${doorC}`);
        if (doorCell) {
            doorCell.innerHTML = SVG_DOOR;
        }
        await new Promise(r => setTimeout(r, 1000));

        // Move through door (r=13) (Vertical)
        setPosition(shuttle, 13, doorC, true);
        await new Promise(r => setTimeout(r, moveDelay));

        // Move to path (r=12) (Vertical)
        setPosition(shuttle, 12, doorC, true);
        await new Promise(r => setTimeout(r, moveDelay));

        // Move horizontally to inbound col (c=17) (Horizontal)
        setPosition(shuttle, 12, inboundC, false);
        await new Promise(r => setTimeout(r, moveDelay));

        // Move to inbound (r=11) (Vertical)
        setPosition(shuttle, inboundR, inboundC, true);
        await new Promise(r => setTimeout(r, 3000)); // Stay at inbound for 3s

        // Return: reverse the path
        // From inbound (11, 17) to rail (12, 17) (Vertical)
        setPosition(shuttle, 12, inboundC, true);
        await new Promise(r => setTimeout(r, moveDelay));

        // Move horizontally back to door col (c=9) (Horizontal)
        setPosition(shuttle, 12, doorC, false);
        await new Promise(r => setTimeout(r, moveDelay));

        // Move down through door (r=13) (Vertical)
        setPosition(shuttle, 13, doorC, true);
        await new Promise(r => setTimeout(r, moveDelay));

        // Outside door (r=14) (Vertical)
        setPosition(shuttle, 14, doorC, true);
        await new Promise(r => setTimeout(r, moveDelay));
        
        // Close door
        if (doorCell) {
            doorCell.innerHTML = SVG_CLSDOOR;
        }

        // Back to start (r=15) (Vertical)
        setPosition(shuttle, startR, doorC, true);
        await new Promise(r => setTimeout(r, moveDelay));

        // Repeat animation
        activeAnimationTimeout = setTimeout(animateShuttle, 1000);
        shuttle.remove();
    }

    activeAnimationTimeout = setTimeout(animateShuttle, 2000);

    // Zoom Logic
    let currentScale = 1;
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomResetBtn = document.getElementById('zoom-reset');
    const gridScaler = document.getElementById('new-layout-grid-scaler');

    if (zoomInBtn && zoomOutBtn && zoomResetBtn && gridScaler) {
        zoomInBtn.addEventListener('click', () => {
            currentScale = Math.min(currentScale + 0.05, 2);
            applyZoom();
        });

        zoomOutBtn.addEventListener('click', () => {
            currentScale = Math.max(currentScale - 0.05, 0.5);
            applyZoom();
        });

        zoomResetBtn.addEventListener('click', () => {
            currentScale = 1;
            applyZoom();
        });

        function applyZoom() {
            gridScaler.style.transform = `scale(${currentScale})`;
        }
    }

    // Custom Level Selector logic (Single Select)
    const levelSelect = document.getElementById('level-select-custom');
    const levelHeader = levelSelect?.querySelector('.select-header');
    const levelText = levelSelect?.querySelector('.selected-text');
    const levelOptions = levelSelect?.querySelectorAll('.option-item');

    if (levelHeader && levelSelect) {
        levelHeader.addEventListener('click', (e) => {
            e.stopPropagation();
            levelSelect.classList.toggle('active');
            multiselect?.classList.remove('active');
        });

        levelOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                levelOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                const selectedText = opt.querySelector('.label-text').innerText;
                levelText.innerText = selectedText;
                levelSelect.classList.remove('active');
                
                // Show success toast
                if (typeof showToast === 'function') {
                    showToast(`Hiển thị thông tin dữ liệu của ${selectedText}`, 'success');
                }
                
                console.log('Level Selected:', opt.dataset.value);
            });
        });
    }

    // Custom Multiselect logic for Modules
    const multiselect = document.getElementById('module-multiselect');
    const multiHeader = multiselect?.querySelector('.multiselect-header');
    const multiText = multiselect?.querySelector('.selected-text');
    const multiOptions = multiselect?.querySelectorAll('.option-item:not(.all-option)');
    const allOption = multiselect?.querySelector('.all-option');

    if (multiHeader && multiselect) {
        multiHeader.addEventListener('click', (e) => {
            e.stopPropagation();
            multiselect.classList.toggle('active');
            levelSelect?.classList.remove('active');
        });

        multiOptions.forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                opt.classList.toggle('active');
                
                // Show success toast if becoming active
                if (opt.classList.contains('active') && typeof showToast === 'function') {
                    showToast(`Hiển thị thông tin dữ liệu của ${opt.querySelector('.label-text').innerText}`, 'success');
                }

                updateAllOptionState();
                updateMultiselectText();
                updateMapVisibility();
            });
        });

        if (allOption) {
            allOption.addEventListener('click', (e) => {
                e.stopPropagation();
                const isAllActive = allOption.classList.contains('active');
                if (isAllActive) {
                    allOption.classList.remove('active');
                    multiOptions.forEach(o => o.classList.remove('active'));
                } else {
                    allOption.classList.add('active');
                    multiOptions.forEach(o => o.classList.add('active'));
                    
                    // Show success toast for "All"
                    if (typeof showToast === 'function') {
                        showToast('Hiển thị thông tin dữ liệu của Tất cả module', 'success');
                    }
                }
                updateMultiselectText();
                updateMapVisibility(); // Added missing update call for All option toggle
            });
        }

        function updateAllOptionState() {
            const allActive = Array.from(multiOptions).every(o => o.classList.contains('active'));
            if (allActive) allOption.classList.add('active');
            else allOption.classList.remove('active');
        }

        function updateMultiselectText() {
            const selected = Array.from(multiOptions)
                .filter(o => o.classList.contains('active'))
                .map(o => o.querySelector('.label-text').innerText);
            
            if (selected.length === 0) {
                multiText.innerText = 'Chọn module';
            } else if (selected.length === multiOptions.length) {
                multiText.innerText = 'Tất cả module';
            } else {
                multiText.innerText = selected.join(', ');
            }
        }

        function updateMapVisibility() {
            const selectedModules = Array.from(multiOptions)
                .filter(o => o.classList.contains('active'))
                .map(o => o.dataset.value);

            const blocks = {
                'A': document.querySelector('.mod-A'),
                'B': document.querySelector('.mod-B'),
                'C': document.querySelector('.mod-C')
            };

            ['A', 'B', 'C'].forEach(modId => {
                const block = blocks[modId];
                if (!block) return;
                
                if (selectedModules.includes(modId)) {
                    block.classList.remove('hidden-module');
                } else {
                    block.classList.add('hidden-module');
                }
            });
        }
        
        // Initial sync
        updateMapVisibility();
    }

    // Register cleanup function
    window.destroyModule = function() {
        console.log('Cleaning up New Layout module...');
        if (activeAnimationTimeout) clearTimeout(activeAnimationTimeout);
    };

    // Close all when clicking outside
    document.addEventListener('click', () => {
        levelSelect?.classList.remove('active');
        multiselect?.classList.remove('active');
    });
})();
