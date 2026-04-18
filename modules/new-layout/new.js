function getPathSVG(top = true, bottom = true, left = true, right = true, showNode = true) {
    return `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="30" transform="matrix(-1 0 0 1 30 0)" fill="#DFF0FF" fill-opacity="0.5"/>
    ${top ? '<path d="M15 0V15" stroke="#7C8DB5" stroke-opacity="0.7"/>' : ''}
    ${bottom ? '<path d="M15 15V30" stroke="#7C8DB5" stroke-opacity="0.7"/>' : ''}
    ${left ? '<path d="M0 15H15" stroke="#7C8DB5" stroke-opacity="0.7"/>' : ''}
    ${right ? '<path d="M15 15H30" stroke="#7C8DB5" stroke-opacity="0.7"/>' : ''}
    ${showNode ? '<ellipse cx="2" cy="1.97531" rx="2" ry="1.97531" transform="matrix(-1 0 0 1 17 13)" fill="#677594"/>' : ''}
    </svg>`;
}

function getRailSVG(hasVertical = false, hasLeft = true, hasRight = true, vertType = 'full') {
    const xStart = hasLeft ? 0 : 15;
    const xEnd = hasRight ? 30 : 15;
    const vLine = hasVertical ? (vertType === 'top' ? '<path d="M15 0V15" stroke="#7C8DB5" stroke-opacity="0.7"/>' : '<path d="M15 0V30" stroke="#7C8DB5" stroke-opacity="0.7"/>') : '';
    return `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="30" fill="#DFF0FF" fill-opacity="0.5"/>
    <path d="M${xStart} 15H${xEnd}" stroke="#7C8DB5" stroke-opacity="0.7" stroke-width="1"/>
    ${vLine}
    <circle cx="15" cy="15" r="1.5" fill="#677594"/>
    </svg>`;
}

const SVG_RAIL_CROSS = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="30" transform="matrix(-1 0 0 1 30 0)" fill="#DFF0FF" fill-opacity="0.5"/>
    <path d="M0 14.9999H15" stroke="#7C8DB5" stroke-opacity="0.7"/>
    <path d="M15 14.9999H30" stroke="#7C8DB5" stroke-opacity="0.7"/>
    <path d="M15 0V14.8148" stroke="#7C8DB5" stroke-opacity="0.7"/>
    <path d="M15 14.8148V30" stroke="#7C8DB5" stroke-opacity="0.7"/>
    <ellipse cx="15" cy="14.8148" rx="1.5" ry="1.48148" fill="#677594"/>
    </svg>`;

const SVG_CORNER_TOP_RIGHT_DOT = `
<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_86_427)">
<rect width="30" height="30" fill="#EFF7FF"/>
<path d="M0 15H15" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M15 15V30" stroke="#7C8DB5" stroke-opacity="0.7"/>
<ellipse cx="15" cy="14.7531" rx="2" ry="1.97531" fill="#677594"/>
</g>
<rect x="0.25" y="0.25" width="29.5" height="29.5" stroke="#D8D8D8" stroke-opacity="0.2" stroke-width="0.5"/>
<defs>
<clipPath id="clip0_86_427">
<rect width="30" height="30"/>
</clipPath>
</defs>
</svg>

`;

const SVG_EMPTY = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="30" transform="matrix(-1 0 0 1 30 0)" fill="#DFF0FF" fill-opacity="0.5"/>
    <ellipse cx="2" cy="1.97531" rx="2" ry="1.97531" transform="matrix(-1 0 0 1 17 13)" fill="#677594"/>
    </svg>`;

const SVG_SPACE = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="30" transform="matrix(-1 0 0 1 30 0)" fill="#DFF0FF" fill-opacity="0.5"/>
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
<g clip-path="url(#clip0_86_962)">
<rect width="30" height="30" fill="#A4D3FE" fill-opacity="0.4"/>
<path d="M15 0V10" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M15 20V30" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M2.38419e-07 15L9 15" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M20.9792 13.0983V16.9017C20.9792 19.7658 19.7542 20.9908 16.89 20.9908H16.8142C14.2242 20.9908 12.9758 19.97 12.76 17.6833C12.7425 17.45 12.9175 17.2283 13.1567 17.205C13.3958 17.1817 13.6117 17.3567 13.635 17.6017C13.8042 19.4333 14.6675 20.1158 16.82 20.1158H16.8958C19.27 20.1158 20.11 19.2758 20.11 16.9017V13.0983C20.11 10.7242 19.27 9.88418 16.8958 9.88418H16.82C14.6558 9.88418 13.7925 10.5783 13.635 12.445C13.6117 12.6842 13.4017 12.865 13.1625 12.8417C12.9233 12.8183 12.7425 12.6142 12.7658 12.3692C12.9642 10.0475 14.2183 9.00918 16.8258 9.00918H16.9017C19.7542 9.00918 20.9792 10.2342 20.9792 13.0983Z" fill="#076EB8"/>
<path d="M17.1175 15C17.1175 15.2392 16.9191 15.4375 16.68 15.4375H9.16663C8.92746 15.4375 8.72913 15.2392 8.72913 15C8.72913 14.7608 8.92746 14.5625 9.16663 14.5625H16.68C16.925 14.5625 17.1175 14.7608 17.1175 15Z" fill="#076EB8"/>
<path d="M17.7708 15C17.7708 15.1108 17.73 15.2217 17.6425 15.3092L15.6883 17.2633C15.5192 17.4325 15.2392 17.4325 15.07 17.2633C14.9008 17.0942 14.9008 16.8142 15.07 16.645L16.715 15L15.07 13.355C14.9008 13.1858 14.9008 12.9058 15.07 12.7367C15.2392 12.5675 15.5192 12.5675 15.6883 12.7367L17.6425 14.6908C17.73 14.7783 17.7708 14.8892 17.7708 15Z" fill="#076EB8"/>
</g>
<rect x="0.25" y="0.25" width="29.5" height="29.5" stroke="#D8D8D8" stroke-opacity="0.2" stroke-width="0.5"/>
<defs>
<clipPath id="clip0_86_962">
<rect width="30" height="30"/>
</clipPath>
</defs>
</svg>
`;

const SVG_OUTBOUND = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_86_1067)">
<rect width="30" height="30" fill="#A4D3FE" fill-opacity="0.4"/>
<path d="M15 30V20" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M15 10V-1" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M20 15H30.5" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M9.02084 16.9017V13.0983C9.02084 10.2342 10.2458 9.00916 13.11 9.00916H13.1858C15.7758 9.00916 17.0242 10.03 17.24 12.3167C17.2575 12.55 17.0825 12.7717 16.8433 12.795C16.6042 12.8183 16.3883 12.6433 16.365 12.3983C16.1958 10.5667 15.3325 9.88416 13.18 9.88416H13.1042C10.73 9.88416 9.89001 10.7242 9.89001 13.0983V16.9017C9.89001 19.2758 10.73 20.1158 13.1042 20.1158H13.18C15.3442 20.1158 16.2075 19.4217 16.365 17.555C16.3883 17.3158 16.5983 17.135 16.8375 17.1583C17.0767 17.1817 17.2575 17.3858 17.2342 17.6308C17.0358 19.9525 15.7817 20.9908 13.1742 20.9908H13.0983C10.2458 20.9908 9.02084 19.7658 9.02084 16.9017Z" fill="#076EB8"/>
<path d="M12.8125 15C12.8125 14.7608 13.0108 14.5625 13.25 14.5625L19.8883 14.5625C20.1275 14.5625 20.3258 14.7608 20.3258 15C20.3258 15.2392 20.1275 15.4375 19.8883 15.4375L13.25 15.4375C13.0108 15.4375 12.8125 15.2392 12.8125 15Z" fill="#076EB8"/>
<path d="M18.15 16.9542C18.15 16.8433 18.1908 16.7325 18.2783 16.645L19.9233 15L18.2783 13.355C18.1091 13.1858 18.1091 12.9058 18.2783 12.7367C18.4475 12.5675 18.7275 12.5675 18.8966 12.7367L20.8508 14.6908C21.02 14.86 21.02 15.14 20.8508 15.3092L18.8966 17.2633C18.7275 17.4325 18.4475 17.4325 18.2783 17.2633C18.1908 17.1817 18.15 17.065 18.15 16.9542Z" fill="#076EB8"/>
</g>
<rect x="0.25" y="0.25" width="29.5" height="29.5" stroke="#D8D8D8" stroke-opacity="0.2" stroke-width="0.5"/>
<defs>
<clipPath id="clip0_86_1067">
<rect width="30" height="30"/>
</clipPath>
</defs>
</svg>
`;

const SVG_P_PORT_LEFT = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_86_962)">
<rect width="30" height="30" fill="#A4D3FE" fill-opacity="0.4"/>
<path d="M15 0V10" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M15 20V30" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M2.38419e-07 15L9 15" stroke="#7C8DB5" stroke-opacity="0.7"/>
<circle cx="15.5" cy="14.5" r="6.9" stroke="#076EB8" stroke-width="1.2"/>
<path d="M14.0682 19C13.6209 19 13.25 18.6779 13.25 18.2895V10.7105C13.25 10.3221 13.6209 10 14.0682 10H16.25C17.9082 10 19.25 11.1653 19.25 12.6053C19.25 14.0453 17.9082 15.2105 16.25 15.2105H14.8864V18.2895C14.8864 18.6779 14.5155 19 14.0682 19ZM14.8864 13.7895H16.25C17.0027 13.7895 17.6136 13.2589 17.6136 12.6053C17.6136 11.9516 17.0027 11.4211 16.25 11.4211H14.8864V13.7895Z" fill="#076EB8"/>
</g>
<rect x="0.25" y="0.25" width="29.5" height="29.5" stroke="#D8D8D8" stroke-opacity="0.2" stroke-width="0.5"/>
<defs>
<clipPath id="clip0_86_962">
<rect width="30" height="30"/>
</clipPath>
</defs>
</svg>`;

const SVG_P_PORT_RIGHT = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_86_1213)">
<rect width="30" height="30" fill="#A4D3FE" fill-opacity="0.4"/>
<path d="M15.0004 0V8.25" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M15.0004 30V21.75" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M23 15H31.25" stroke="#7C8DB5" stroke-opacity="0.7"/>
<circle cx="15.5" cy="14.5" r="6.9" stroke="#076EB8" stroke-width="1.2"/>
<path d="M14.0682 19C13.6209 19 13.25 18.6779 13.25 18.2895V10.7105C13.25 10.3221 13.6209 10 14.0682 10H16.25C17.9082 10 19.25 11.1653 19.25 12.6053C19.25 14.0453 17.9082 15.2105 16.25 15.2105H14.8864V18.2895C14.8864 18.6779 14.5155 19 14.0682 19ZM14.8864 13.7895H16.25C17.0027 13.7895 17.6136 13.2589 17.6136 12.6053C17.6136 11.9516 17.0027 11.4211 16.25 11.4211H14.8864V13.7895Z" fill="#076EB8"/>
</g>
<rect x="0.25" y="0.25" width="29.5" height="29.5" stroke="#D8D8D8" stroke-opacity="0.2" stroke-width="0.5"/>
<defs>
<clipPath id="clip0_86_1213">
<rect width="30" height="30"/>
</clipPath>
</defs>
</svg>`;

const SVG_WAITING_LEFT = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="30" height="30" fill="#A4D3FE" fill-opacity="0.4"/>
<path d="M15.0004 0V8.25" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M15.0004 30V21.75" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M0 15H8.25" stroke="#7C8DB5" stroke-opacity="0.7"/>
<g clip-path="url(#clip1_130_214)">
<path d="M21.5938 14.5C21.5938 16.1162 20.9517 17.6661 19.8089 18.8089C18.6661 19.9517 17.1162 20.5938 15.5 20.5938C13.8838 20.5938 12.3339 19.9517 11.1911 18.8089C10.0483 17.6661 9.40625 16.1162 9.40625 14.5C9.40625 12.8838 10.0483 11.3339 11.1911 10.1911C12.3339 9.04827 13.8838 8.40625 15.5 8.40625C17.1162 8.40625 18.6661 9.04827 19.8089 10.1911C20.9517 11.3339 21.5938 12.8838 21.5938 14.5ZM8 14.5C8 16.4891 8.79018 18.3968 10.1967 19.8033C11.6032 21.2098 13.5109 22 15.5 22C17.4891 22 19.3968 21.2098 20.8033 19.8033C22.2098 18.3968 23 16.4891 23 14.5C23 12.5109 22.2098 10.6032 20.8033 9.1967C19.3968 7.79018 17.4891 7 15.5 7C13.5109 7 11.6032 7.79018 10.1967 9.1967C8.79018 10.6032 8 12.5109 8 14.5ZM14.7969 10.5156V14.5C14.7969 14.7344 14.9141 14.9541 15.1104 15.0859L17.9229 16.9609C18.2451 17.1777 18.6816 17.0898 18.8984 16.7646C19.1152 16.4395 19.0273 16.0059 18.7021 15.7891L16.2031 14.125V10.5156C16.2031 10.126 15.8896 9.8125 15.5 9.8125C15.1104 9.8125 14.7969 10.126 14.7969 10.5156Z" fill="#076EB8"/>
</g>
<rect x="0.25" y="0.25" width="29.5" height="29.5" stroke="#D8D8D8" stroke-opacity="0.2" stroke-width="0.5"/>
<defs>
<clipPath id="clip1_130_214">
<rect width="15" height="15" transform="translate(8 7)"/>
</clipPath>
</defs>
</svg>`;

const SVG_WAITING_RIGHT = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="30" height="30" fill="#A4D3FE" fill-opacity="0.4"/>
<path d="M15.0004 0V8.25" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M15.0004 30V21.75" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M22 15H30.25" stroke="#7C8DB5" stroke-opacity="0.7"/>
<g clip-path="url(#clip1_130_214_r)">
<path d="M21.5938 14.5C21.5938 16.1162 20.9517 17.6661 19.8089 18.8089C18.6661 19.9517 17.1162 20.5938 15.5 20.5938C13.8838 20.5938 12.3339 19.9517 11.1911 18.8089C10.0483 17.6661 9.40625 16.1162 9.40625 14.5C9.40625 12.8838 10.0483 11.3339 11.1911 10.1911C12.3339 9.04827 13.8838 8.40625 15.5 8.40625C17.1162 8.40625 18.6661 9.04827 19.8089 10.1911C20.9517 11.3339 21.5938 12.8838 21.5938 14.5ZM8 14.5C8 16.4891 8.79018 18.3968 10.1967 19.8033C11.6032 21.2098 13.5109 22 15.5 22C17.4891 22 19.3968 21.2098 20.8033 19.8033C22.2098 18.3968 23 16.4891 23 14.5C23 12.5109 22.2098 10.6032 20.8033 9.1967C19.3968 7.79018 17.4891 7 15.5 7C13.5109 7 11.6032 7.79018 10.1967 9.1967C8.79018 10.6032 8 12.5109 8 14.5ZM14.7969 10.5156V14.5C14.7969 14.7344 14.9141 14.9541 15.1104 15.0859L17.9229 16.9609C18.2451 17.1777 18.6816 17.0898 18.8984 16.7646C19.1152 16.4395 19.0273 16.0059 18.7021 15.7891L16.2031 14.125V10.5156C16.2031 10.126 15.8896 9.8125 15.5 9.8125C15.1104 9.8125 14.7969 10.126 14.7969 10.5156Z" fill="#076EB8"/>
</g>
<rect x="0.25" y="0.25" width="29.5" height="29.5" stroke="#D8D8D8" stroke-opacity="0.2" stroke-width="0.5"/>
<defs>
<clipPath id="clip1_130_214_r">
<rect width="15" height="15" transform="translate(8 7)"/>
</clipPath>
</defs>
</svg>

`;

const SVG_PARKING = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_86_1213)">
<rect width="30" height="30" fill="#A4D3FE" fill-opacity="0.4"/>
<path d="M15.0004 0V8.25" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M15.0004 30V21.75" stroke="#7C8DB5" stroke-opacity="0.7"/>
<circle cx="15.5" cy="14.5" r="6.9" fill="white" stroke="#076EB8" stroke-width="1.2"/>
<path d="M14.0682 19C13.6209 19 13.25 18.6779 13.25 18.2895V10.7105C13.25 10.3221 13.6209 10 14.0682 10H16.25C17.9082 10 19.25 11.1653 19.25 12.6053C19.25 14.0453 17.9082 15.2105 16.25 15.2105H14.8864V18.2895C14.8864 18.6779 14.5155 19 14.0682 19ZM14.8864 13.7895H16.25C17.0027 13.7895 17.6136 13.2589 17.6136 12.6053C17.6136 11.9516 17.0027 11.4211 16.25 11.4211H14.8864V13.7895Z" fill="#076EB8"/>
</g>
<rect x="0.25" y="0.25" width="29.5" height="29.5" stroke="#D8D8D8" stroke-opacity="0.2" stroke-width="0.5"/>
<defs>
<clipPath id="clip0_86_1213">
<rect width="30" height="30" fill="white"/>
</clipPath>
</defs>
</svg>
`;

const SVG_CHARGING = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="40" height="40" fill="#A4D3FE" fill-opacity="0.4"/>
<rect x="0.25" y="0.25" width="39.5" height="39.5" stroke="#D8D8D8" stroke-opacity="0.2" stroke-width="0.5"/>
<path d="M20 0V12" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M20 40V28" stroke="#7C8DB5" stroke-opacity="0.7"/>
<circle cx="20.5" cy="19.5" r="9.5" fill="white"/>
<rect x="13.85" y="12.85" width="13.3" height="13.3" fill="url(#pattern0_86_877)"/>
<defs>
<pattern id="pattern0_86_877" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_86_877" transform="scale(0.00195312)"/>
</pattern>
<image id="image0_86_877" width="512" height="512" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/>
</defs>
</svg>
`;

const SVG_WAITING_BOTTOM_T = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="30" height="30" fill="#A4D3FE" fill-opacity="0.4"/>
<path d="M15.0004 0V8.25" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M0 15H8.25" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M22 15H30.25" stroke="#7C8DB5" stroke-opacity="0.7"/>
<g clip-path="url(#clip_waiting_btm_t)">
<path d="M21.5938 14.5C21.5938 16.1162 20.9517 17.6661 19.8089 18.8089C18.6661 19.9517 17.1162 20.5938 15.5 20.5938C13.8838 20.5938 12.3339 19.9517 11.1911 18.8089C10.0483 17.6661 9.40625 16.1162 9.40625 14.5C9.40625 12.8838 10.0483 11.3339 11.1911 10.1911C12.3339 9.04827 13.8838 8.40625 15.5 8.40625C17.1162 8.40625 18.6661 9.04827 19.8089 10.1911C20.9517 11.3339 21.5938 12.8838 21.5938 14.5ZM8 14.5C8 16.4891 8.79018 18.3968 10.1967 19.8033C11.6032 21.2098 13.5109 22 15.5 22C17.4891 22 19.3968 21.2098 20.8033 19.8033C22.2098 18.3968 23 16.4891 23 14.5C23 12.5109 22.2098 10.6032 20.8033 9.1967C19.3968 7.79018 17.4891 7 15.5 7C13.5109 7 11.6032 7.79018 10.1967 9.1967C8.79018 10.6032 8 12.5109 8 14.5ZM14.7969 10.5156V14.5C14.7969 14.7344 14.9141 14.9541 15.1104 15.0859L17.9229 16.9609C18.2451 17.1777 18.6816 17.0898 18.8984 16.7646C19.1152 16.4395 19.0273 16.0059 18.7021 15.7891L16.2031 14.125V10.5156C16.2031 10.126 15.8896 9.8125 15.5 9.8125C15.1104 9.8125 14.7969 10.126 14.7969 10.5156Z" fill="#076EB8"/>
</g>
<rect x="0.25" y="0.25" width="29.5" height="29.5" stroke="#D8D8D8" stroke-opacity="0.2" stroke-width="0.5"/>
<defs>
<clipPath id="clip_waiting_btm_t">
<rect width="15" height="15" transform="translate(8 7)"/>
</clipPath>
</defs>
</svg>`;

const SVG_WAITING_TOP_T = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="30" height="30" fill="#A4D3FE" fill-opacity="0.4"/>
<path d="M15 21L15 30" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M0 15H8.25" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M22 15H30.25" stroke="#7C8DB5" stroke-opacity="0.7"/>
<g clip-path="url(#clip_waiting_top_t)">
<path d="M21.5938 14.5C21.5938 16.1162 20.9517 17.6661 19.8089 18.8089C18.6661 19.9517 17.1162 20.5938 15.5 20.5938C13.8838 20.5938 12.3339 19.9517 11.1911 18.8089C10.0483 17.6661 9.40625 16.1162 9.40625 14.5C9.40625 12.8838 10.0483 11.3339 11.1911 10.1911C12.3339 9.04827 13.8838 8.40625 15.5 8.40625C17.1162 8.40625 18.6661 9.04827 19.8089 10.1911C20.9517 11.3339 21.5938 12.8838 21.5938 14.5ZM8 14.5C8 16.4891 8.79018 18.3968 10.1967 19.8033C11.6032 21.2098 13.5109 22 15.5 22C17.4891 22 19.3968 21.2098 20.8033 19.8033C22.2098 18.3968 23 16.4891 23 14.5C23 12.5109 22.2098 10.6032 20.8033 9.1967C19.3968 7.79018 17.4891 7 15.5 7C13.5109 7 11.6032 7.79018 10.1967 9.1967C8.79018 10.6032 8 12.5109 8 14.5ZM14.7969 10.5156V14.5C14.7969 14.7344 14.9141 14.9541 15.1104 15.0859L17.9229 16.9609C18.2451 17.1777 18.6816 17.0898 18.8984 16.7646C19.1152 16.4395 19.0273 16.0059 18.7021 15.7891L16.2031 14.125V10.5156C16.2031 10.126 15.8896 9.8125 15.5 9.8125C15.1104 9.8125 14.7969 10.126 14.7969 10.5156Z" fill="#076EB8"/>
</g>
<rect x="0.25" y="0.25" width="29.5" height="29.5" stroke="#D8D8D8" stroke-opacity="0.2" stroke-width="0.5"/>
<defs>
<clipPath id="clip_waiting_top_t">
<rect width="15" height="15" transform="translate(8 7)"/>
</clipPath>
</defs>
</svg>`;

const SVG_VERTICAL_PATH = `
<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_206_237)">
<rect width="30" height="30" fill="#EFF7FF"/>
<path d="M15 16V31" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M15 15V-4.2084e-07" stroke="#7C8DB5" stroke-opacity="0.7"/>
<ellipse cx="15" cy="14.7531" rx="2" ry="1.97531" fill="#677594"/>
</g>
<defs>
<clipPath id="clip0_206_237">
<rect width="30" height="30"/>
</clipPath>
</defs>
</svg>
`;

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

const SVG_BE17 = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="40" height="40" fill="#A4D3FE" fill-opacity="0.4"/>
<rect x="0.25" y="0.25" width="39.5" height="39.5" stroke="#D8D8D8" stroke-opacity="0.2" stroke-width="0.5"/>
<path d="M11 20H0" stroke="#7C8DB5" stroke-opacity="0.7"/>
<circle cx="20.5" cy="19.5" r="9.5" fill="white"/>
<rect x="11" y="11" width="18" height="18" fill="url(#pattern0_234_201)"/>
<defs>
<pattern id="pattern0_234_201" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_234_201" transform="scale(0.0015625)"/>
</pattern>
<image id="image0_234_201" width="640" height="640" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAKACAYAAAAMzckjAABcwklEQVR4Ae3AA6AkWZbG8f937o3IzKdyS2Oubdu2bdu2bdu2bWmMnpZKr54yMyLu+Xa3anqmhztr1U9cddVVV1111VVXXfX/CeKqq6666qqrrrrqqv9PEFddddVVV1111VVX/X+CuOqqq6666qqrrrrq/xPEVVddddVVV1111VX/nyCuuuqqq6666qqrrvr/BHHVVVddddVVV1111f8niKuuuuqqq6666qqr/j9BXHXVVVddddVVV131/wniqquuuuqqq6666qr/TxBXXXXVVVddddVVV/1/grjqqquuuuqqq6666v8TxFVXXXXVVVddddVV/58grrrqqquuuuqqq676/wRx1VVXXXXVVVddddX/J4irrrrqqquuuuqqq/4/QVx11VVXXXXVVVdd9f8J4qqrrrrqqquuuuqq/08QV1111VVXXXXVVVf9f4K46qqrrrrqqquuuur/E8RVV1111VVXXXXVVf+fIK666qqrrrrqqquu+v8EcdVVV1111VVXXXXV/yeIq6666qqrrrrqqqv+P0FcddVVV1111VVXXfX/CeKqq6666qqrrrrqqv9PEFddddVVV1111VVX/X+CuOqqq6666qqrrrrq/xPEVVddddVVV1111VX/nyCuuuqqq6666qqrrvr/BHHVVVddddVVV1111f8niKuuuuqqq6666qqr/j9BXHXVVVddddVVV131/wniqquuuuqqq6666qr/TxBXXXXVVVddddVVV/1/grjqqquuuuqqq6666v8TxFVXXXXVVVddddVV/58grrrqqquuuuqqq676/wRx1VVXXXXVVVddddX/J4irrrrqqquuuuqqq/4/QVx11VVXXXXVVVdd9f8J4qqrrrrqqquuuuqq/08QV1111VVXXXXVVVf9f4K46qqrrrrqqquuuur/E8RVV1111VVXXXXVVf+fIK666qqrrrrqqquu+v8EcdVVV1111VVXXXXV/yeIq6666qqrrrrqqqv+P0FcddVVV1111VVXXfX/CeKqq6666qqrrrrqqv9PEFddddVVV1111VVX/X+CuOqqq6666qqrrrrq/xPEVVddddVVV1111VX/nyCuuuqqq6666qqrrvr/BHHVVVddddVVV1111f8niKuuuuqqq6666qqr/j9BXHXVVVddddVVV131/wniqquuuuqqq6666qr/TxBXXXXVVVddddVVV/1/grjqqquuuuqqq6666v8TxFVXXXXVVVddddVV/58grrrqqquuuuqqq676/wRx1VVXXXXVVVddddX/J4irrrrqqquuuuqqq/4/QVx11VVXXXXVVVdd9f8J4qqrrrrqqquuuuqq/08QV1111VVXXXXVVVf9f4K46qqrrrrqqquuuur/E8RVV1111VVXXXXVVf+fIK666qqrrrrqqquu+v8EcdVVV1111VVXXXXV/yeIq6666qqrrrrqqqv+P0FcddVVV1111VVXXfX/CeKqq6666qqrrrrqqv9PEFddddVVV1111VVX/X+CuOqqq6666qqrrrrq/xPEVVddddVVV1111VX/nyCuuuqqq6666qqrrvr/BHHVVVddddVVV1111f8niKuuuuqqq6666qqr/j9BXHXVVVddddVVV131/wniqquuuuqqq6666qr/TxBXXXXVVVddddVVV/1/grjqqquuuuqqq6666v8TxFVXXXXVVVddddVV/58grrrqqquuuuqqq676/wRx1VVXXXXVVVddddX/J4irrrrqqquuuuqqq/4/QVx11VVXXXXVVVdd9f8J4qqrrrrqqquuuuqq/08QV1111VVXXXXVVVf9f4K46qqrrrrqqquuuur/E8RVV1111VVXXXXVVf+fIK666qqrrrrqqquu+v8EcdVVV1111VVXXXXV/yeIq6666qqrrrrqqqv+P0FcddVVV1111X+C4x/9W8eHXL9Wope2/NKC45gHGx7MVc+XxG/zTIa/lrUrvOsSf13MpcOvfsO/5qqr/v0QV1111VVXXfUfZPOjf/WlJ+d7YV4beGmu+s+wK/HXWL8N3ErRrauvesPf4aqrXnSIq6666qqrrvp3OP7Rv3V8nev3Mny04cFc9d9C4rcNf13Mb/cx+53dr36dXa666vlDXHXVVVddddW/wfGP/q3jqxw+yvijgeNc9T/NXyN+WxE/vfqqN/wdrrrq2RBXXXXVVVdd9a+0+Mhf/qiEzwaOc9X/BruI35b10/Pof2b3q19nl6v+P0NcddVVV1111Yto86N/9aWb86tsXpur/vcSPy3rp+fR/8zuV7/OLlf9f4O46qqrrrrqqhfB/KN/6b2d+irgOFf9X7Er8dNF8TWHX/2Gf81V/18g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f4K46qqrrrrqqquuuur/E8RVV1111VVXXXXVVf+fIK666qqrrrrqqquu+v8EcdVVV1111VVXXXXV/yeIq6666qqrrrrqqqv+P0FcddVVV1111VVXXfX/CeKqq6666qqrrrrqqv9PEFddddVVV1111VVX/X+CuOqqq6666qqrrrrq/xPEVVddddVVV1111VX/nyCuuuqqq6666qqrrvr/BHHVVVddddVVV1111f8niKuuuuqqq6666qqr/j9BXHXVVVddddVVV131/wniqquuuuqqq6666qr/TxBXXXXVVVddddVVV/1/grjqqquuuuqqq6666v8TxFVXXXXVVVddddVV/58grrrqqquuuuqqq676/wRx1VVXXXXVVVddddX/J4irrrrqqquuuuqqq/4/QVx11VVXXXXVVVdd9f8J4qqrrrrqqquuuuqq/08QV1111VVXXXXVVVf9f4K46qqrrrrqqquuuur/E8RVV1111VVXXXXVVf+fIK666qqrrrrqqquu+v8EcdVVV1111VVXXXXV/yeIq6666qqrrrrqqqv+P0FcddVVV1111VVXXfX/CeKqq6666qqrrrrqqv9PEFddddVVV1111VVX/X+CuOqqq6666qqrrrrq/xPEVVddddVVV1111VX/nyCuuuqqq6666qqrrvr/BHHVVVddddVVV1111f8niKuuuuqqq6666qqr/j9BXHXVVVddddVVV131/wniqquuuuqqq6666qr/TxBXXXXVVVddddVVV/1/grjqqquuuuqqq6666v8TxFVXXXXVVVddddVV/58grrrqqquuuuqqq676/wRx1VVXXXXVVVddddX/J4irrrrqqquuuuqqq/4/QVx11VVXXXXVVVdd9f8J4qqrrrrqqquuuuqq/08QV1111VVXXXXVVVf9f4K46qqrrrrqqquuuur/E8RVV1111VVXXXXVVf+fIK666qqrrrrqqquu+v8EcdVVV1111VVXXXXV/yeIq6666qqrrrrqqqv+P0FcddVVV1111VVXXfX/CeKqq6666qqrrrrqqv9PEFddddVVV1111VVX/X+CuOqqq6666qqrrrrq/xPEVVddddVVV1111VX/nyCuuuqqq6666qqrrvr/BHHVVVddddVVV1111f8niKuuuuqqq6666qqr/j9BXHXVVVddddVVV131/wniqquuuuqqq6666qr/TxBXXXXVVVddddVVV/1/grjqqquuuuqqq6666v8TxFVXXXXVVVddddVV/58grrrqqquuuuqqq676/wRx1VVXXXXVVVddddX/J4irrrrqqquuuuqqq/4/QVx11VVXXXXVVVdd9f8J4qqrrrrqqquuuuqq/08QV1111VVXXXXVVVf9f4K46qqrrrrqqquuuur/E8RVV1111VVXXXXVVf+fIK666qqrrrrqqquu+v8EcdVVV1111VVXXXXV/yeIq6666qqrrrrqqqv+P0FcddVVV1111VVXXfX/CeKqq6666qqrrrrqqv9PEFddddVVV1111VVX/X+CuOqqq6666qqrrrrq/xPEVVddddVVV1111VX/nyCuuuqqq6666qqrrvr/BHHVVVddddVVV1111f8niKuuuuqqq6666qqr/j9BXHXVVVddddVVV131/wniqquuuuqqq6666qr/TxBXXXXVVVddddVVV/1/grjqqquuuuqqq6666v8T/hFEwbOtZTCQiwAAAABJRU5ErkJggg=="/>
</defs>
</svg>
`;

const SVG_BE1 = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="30" height="30" fill="#A4D3FE" fill-opacity="0.4"/>
<rect x="0.25" y="0.25" width="29.5" height="29.5" stroke="#D8D8D8" stroke-opacity="0.2" stroke-width="0.5"/>
<path d="M11 15H0" stroke="#7C8DB5" stroke-opacity="0.7"/>
<circle cx="15.5" cy="14.5" r="9.5" fill="white"/>
<rect x="6" y="6" width="18" height="18" fill="url(#pattern0_234_200)"/>
<defs>
<pattern id="pattern0_234_200" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_234_200" transform="scale(0.0015625)"/>
</pattern>
<image id="image0_234_200" width="640" height="640" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAKACAYAAAAMzckjAABck0lEQVR4Ae3AA6AkWZbG8f937o3IzKdyS2Oubdu2bdu2bdu2bWmMnpZKr54yMyLu+Xa3anqmhztr1U9cddVVV1111VVXXfX/CeKqq6666qqrrrrqqv9PEFddddVVV1111VVX/X+CuOqqq6666qqrrrrq/xPEVVddddVVV1111VX/nyCuuuqqq6666qqrrvr/BHHVVVddddVVV1111f8niKuuuuqqq6666qqr/j9BXHXVVVddddVVV131/wniqquuuuqqq6666qr/TxBXXXXVVVddddVVV/1/grjqqquuuuqqq6666v8TxFVXXXXVVVddddVV/58grrrqqquuuuqqq676/wRx1VVXXXXVVVddddX/J4irrrrqqquuuuqqq/4/QVx11VVXXXXVVVdd9f8J4qqrrrrqqquuuuqq/08QV1111VVXXXXVVVf9f4K46qqrrrrqqquuuur/E8RVV1111VVXXXXVVf+fIK666qqrrrrqqquu+v8EcdVVV1111VVXXXXV/yeIq6666qqrrrrqqqv+P0FcddVVV1111VVXXfX/CeKqq6666qqrrrrqqv9PEFddddVVV1111VVX/X+CuOqqq6666qqrrrrq/xPEVVddddVVV1111VX/nyCuuuqqq6666qqrrvr/BHHVVVddddVVV1111f8niKuuuuqqq6666qqr/j9BXHXVVVddddVVV131/wniqquuuuqqq6666qr/TxBXXXXVVVddddVVV/1/grjqqquuuuqqq6666v8TxFVXXXXVVVddddVV/58grrrqqquuuuqqq676/wRx1VVXXXXVVVddddX/J4irrrrqqquuuuqqq/4/QVx11VVXXXXVVVdd9f8J4qqrrrrqqquuuuqq/08QV1111VVXXXXVVVf9f4K46qqrrrrqqquuuur/E8RVV1111VVXXXXVVf+fIK666qqrrrrqqquu+v8EcdVVV1111VVXXXXV/yeIq6666qqrrrrqqqv+P0FcddVVV1111VVXXfX/CeKqq6666qqrrrrqqv9PEFddddVVV1111VVX/X+CuOqqq6666qqrrrrq/xPEVVddddVVV1111VX/nyCuuuqqq6666qqrrvr/BHHVVVddddVVV1111f8niKuuuuqqq6666qqr/j9BXHXVVVddddVVV131/wniqquuuuqqq6666qr/TxBXXXXVVVddddVVV/1/grjqqquuuuqqq6666v8TxFVXXXXVVVddddVV/58grrrqqquuuuqqq676/wRx1VVXXXXVVVddddX/J4irrrrqqquuuuqqq/4/QVx11VVXXXXVVVdd9f8J4qqrrrrqqquuuuqq/08QV1111VVXXXXVVVf9f4K46qqrrrrqqquuuur/E8RVV1111VVXXXXVVf+fIK666qqrrrrqqquu+v8EcdVVV1111VVXXXXV/yeIq6666qqrrrrqqqv+P0FcddVVV1111VVXXfX/CeKqq6666qqrrrrqqv9PEFddddVVV1111VVX/X+CuOqqq6666qqrrrrq/xPEVVddddVVV1111VX/nyCuuuqqq6666qqrrvr/BHHVVVddddVVV1111f8niKuuuuqqq6666qqr/j9BXHXVVVddddVVV131/wniqquuuuqqq6666qr/TxBXXXXVVVddddVVV/1/grjqqquuuuqqq6666v8TxFVXXXXVVVddddVV/58grrrqqquuuuqqq676/wRx1VVXXXXVVVddddX/J4irrrrqqquuuuqqq/4/QVx11VVXXXXVVVdd9f8J4qqrrrrqqquuuuqq/08QV1111VVXXXXVVVf9f4K46qqrrrrqqquuuur/E8RVV1111VVXXXXVVf+fIK666qqrrrrqqquu+v8EcdVVV1111VVXXXXV/yeIq6666qqrrrrqqqv+P0FcddV/kM2P/tWXbuKYWr600XHLxwUvzTPZvDZXPV+CWxG3GnZl/XXgv+5j9ju7X/06u1x11VVXXXXVfyzEVVf9K80/5ldfi+YHW35pwUvbvDRwnKv+M/w14rer4nsOv/oN/5qrrrrqqquu+vdDXHXVC3H8o3/r+JDr12ritQUvbfPaXPXfQnCr4KtnMfue3a9+nV2uuuqqq6666t8GcdVVz2X+Mb/6Ws58a8xrAy/NVf/T7Ap99Tz6r9n96tfZ5aqrrrrqqqv+dRBX/b93/KN/6/gqh7ey/NaY1waOc9X/BrtCH7362jf6Hq666qqrrrrqRYe46v+l4x/9W8dXObyV5bfGvDVX/a8l8dtF8TGHX/2Gf81VV1111VVX/csQV/2/svnRv/rSzflRNm8NHOeq/yt2Ff6Y1Ve/yXdz1VVXXXXVVS8c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EZcWmj1496tfZ5errrrqqqv+v0Jc9T/axkf/yls3+7sxx7jqqn8n4c9Zfe2bfDZXXXXVVVf9f4a46n+84x/9W8dXufppo9fiqqv+rcSlhWYP3v3q19nlqquuuuqq/88QV/2vsfHRv/LWzf5uzDGuuupfSeH3WX31m3w3V1111VVX/X+HuOp/leMf/VvHV7n6aqP34qqrXkTCv7P62jd5ba666qqrrroKEFf9rzT/6F96bae+GngprrrqhRGXJL/06qvf5Fauuuqqq666ChBX/a82/+hfem9bX405xlVXPR8l9DZHX/1GP81VV1111VVXXYG46n+94x/9W8dXufpoSx+NOcZVVz2T8PesvvZN3purrrrqqquuejbEVf9nHP/o3zq+zPVnAx/FVf/vCX/P6mvf5L256qqrrrrqqueEuOr/nPlH/9KDST7b0ltjjnHV/0c/s/7aN35rrrrqqquuuup5Ia76P+v4R//W8VWuPtrSR2OOcdX/C8Lfs/raN3lvrrrqqquuuur5Q1z1/8L8o3/pvZ36aOCluOr/LOHvWX3tm7w3V1111VVXXfWCIa76f2Xzo3/1pVu2j7b01phjXPV/g7hUpPc++uo3+mmuuuqqq6666oVDXPX/1vyjf+m9nXpr4K246n8t4d8heO/VV7/JrVx11VVXXXXVvwxx1f97xz/6t46vWL21U2+NeG3MMa76n09ckvzRq69+k+/mqquuuuqqq150iKuuei7zj/6l13bqrYHXBl6Kq/5nEZdkf/U85l+9+9Wvs8tVV1111VVX/esgrrrqhTj+0b91fGB47ZZ+beGXNnotrvpvIfwMhb56xuy7d7/6dXa56qqrrrrqqn8bxFVX/SvNP/qXXht4MMmDgde29NKYY1z1n+FvgN+uEd99+NVv+NdcddVVV1111b8f4qqr/oNsfvSvvnSjHRd6aaePGx0Xfmmeyei1uOr5En4GcKvRrvBfR8Rf9/S/vfvVr7PLVVddddVVV/3HQlx11VVXXXXVVVdd9f8J4qqrrrrqqquuuuqq/08QV1111VVXXXXVVVf9f4K46qqrrrrqqquuuur/E8RVV1111VVXXXXVVf+fIK666qqrrrrqqquu+v8EcdVVV1111VVXXXXV/yeIq6666qqrrrrqqqv+P0FcddVVV1111VVXXfX/CeKqq6666qqrrrrqqv9PEFddddVVV1111VVX/X+CuOqqq6666qqrrrrq/xPEVVddddVVV1111VX/nyCuuuqqq6666qqrrvr/BHHVVVddddVVV1111f8niKuuuuqqq6666qqr/j9BXHXVVVddddVVV131/wniqquuuuqqq6666qr/TxBXXXXVVVddddVVV/1/grjqqquuuuqqq6666v8TxFVXXXXVVVddddVV/58grrrqqquuuuqqq676/wRx1VVXXXXVVVddddX/J4irrrrqqquuuuqqq/4/QVx11VVXXXXVVVdd9f8J4qqrrrrqqquuuuqq/08QV1111VVXXXXVVVf9f4K46qqrrrrqqquuuur/E8RVV1111VVXXXXVVf+fIK666qqrrrrqqquu+v8EcdVVV1111VVXXXXV/yeIq6666qqrrrrqqqv+P0FcddVVV1111VVXXfX/CeKqq6666qqrrrrqqv9PEFddddVVV1111VVX/X+CuOqqq6666qqrrrrq/xPEVVddddVVV1111VX/nyCuuuqqq6666qqrrvr/BHHVVVddddVVV1111f8niKuuuuqqq6666qqr/j9BXHXVVVddddVVV131/wniqquuuuqqq6666qr/TxBXXXXVVVddddVVV/1/grjqqquuuuqqq6666v8TxFVXXXXVVVddddVV/58grrrqqquuuuqqq676/wRx1VVXXXXVVVddddX/J4irrrrqqquuuuqqq/4/QVx11VVXXXXVVVdd9f8J4qqrrrrqqquuuuqq/08QV1111VVXXXXVVVf9f4K46qqrrrrqqquuuur/E8RVV1111VVXXXXVVf+fIK666qqrrrrqqquu+v8EcdVVV1111VVXXXXV/yeIq6666qqrrrrqqqv+P0FcddVVV1111VVXXfX/CeKqq6666qqrrrrqqv9PEFddddVVV1111VVX/X+CuOqqq6666qqrrrrq/xPEVVddddVVV1111VX/nyCuuuqqq6666qqrrvr/BHHVVVddddVVV1111f8niKuuuuqqq6666qqr/j9BXHXVVVddddVVV131/wniqquuuuqqq6666qr/TxBXXXXVVVddddVVV/1/grjqqquuuuqqq6666v8TxFVXXXXVVVddddVV/58grrrqqquuuuqqq676/wRx1VVXXXXVVVddddX/J4irrrrqqquuuuqqq/4/QVx11VVXXXXVVVdd9f8J4qqrrrrqqquuuuqq/08QV1111VVXXXXVVVf9f4K46qqrrrrqqquuuur/E8RVV1111VVXXXXVVf+fIK666qqrrrrqqquu+v8EcdVVV1111VVXXXXV/yeIq6666qqrrrrqqqv+P0FcddVVV1111VVXXfX/CeKqq6666qqrrrrqqv9PEFddddVVV1111VVX/X+CuOqqq6666qqrrrrq/xPEVVddddVVV1111VX/nyCuuuqqq6666qqrrvr/BHHVVVddddVVV1111f8niKuuuuqqq6666qqr/j9BXHXVVVddddVVV131/wniqquuuuqqq6666qr/TxBXXXXVVVddddVVV/1/grjqqquuuuqqq6666v8TxFVXXXXVVVddddVV/58grrrqqquuuuqqq676/wRx1VVXXXXVVVddddX/J4irrrrqqquuuuqqq/4/4R8BVrvEreTAux4AAAAASUVORK5CYII="/>
</defs>
</svg>
`;

const ROWS = 17;
const COLS = 57;


(function initNewLayout() {
    const grid = document.getElementById('new-layout-grid');
    if (!grid) return;

    // Helper to get column name (A, B, C... AA, AB...)
    const getColumnName = (index) => {
        let name = '';
        while (index >= 0) {
            name = String.fromCharCode(65 + (index % 26)) + name;
            index = Math.floor(index / 26) - 1;
        }
        return name;
    };
    
    // Generate the Map Matrix
    const mapMatrix = [];
    for (let r = 0; r < ROWS; r++) {
        const row = [];
        for (let c = 0; c < COLS; c++) {
            let type = 'path';
            
            // Warehouse Area (Now shifted by 2: Rows 2 to 15)
            if (r >= 2 && r <= 15) {
                const warehouseR = r - 2; // Map back to 0-13 warehouse logic
                const isBoundaryCol = (c === 0 || c === 18 || c === 37 || c === 56);
                const isBoundaryRow = (warehouseR === 0 || warehouseR === 13);
                
                const mCol = (c < 19) ? c : (c < 38) ? c - 19 : c - 38;
                if ((mCol === 0 || mCol === 18) && r === 9) {
                    type = 'parking'; // Row 10
                } else if ((mCol === 0 || mCol === 18) && r === 7) {
                    type = 'charging'; // Row 8
                } else if (isBoundaryRow) {
                    if (warehouseR === 0) {
                        const mCol = (c < 19) ? c : (c < 38) ? c - 19 : c - 38;
                        if (mCol === 0) type = 'outbound';
                        else type = 'path';
                    } else type = 'space';
                } else if (isBoundaryCol) {
                    if (warehouseR === 12 && c > 0) type = 'inbound';
                    else type = 'path';
                } else {
                    const mCol = (c < 19) ? c : (c < 38) ? c - 19 : c - 38;
                    if (warehouseR === 12) {
                        if (mCol === 18) type = 'inbound';
                        else type = 'path';
                    } else if (warehouseR >= 1 && warehouseR <= 11) {
                        if (mCol >= 2 && mCol <= 16) type = 'shelf';
                        else type = 'path';
                    } else {
                        type = 'empty';
                    }
                }
            } 
            // New extension rows (r < 2) - Full horizontal paths
            else if (r < 2) {
                if (r === 0 && c === 56) type = 'be1';
                else type = 'path';
            }
            else if (r === 16) {
                if (r === 16 && c === 56) type = 'be17';
                else if (c < 18) type = 'space';
                else type = 'h-rail';
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

    let colCounter = 0;

    // Render the grid
    mapMatrix.forEach((row, r) => {
        row.forEach((type, c) => {
            const cell = document.createElement('div');
            cell.className = `map-cell cell-${type} r-${r} c-${c}`;
            
            // Add Row Labels (only for first column in modA)
            if (c === 0) {
                const labelRow = document.createElement('div');
                labelRow.className = 'label-row';
                labelRow.innerText = r + 1;
                cell.appendChild(labelRow);
            }

            // Add Column Labels (only for first row)
            if (r === 0) {
                const labelCol = document.createElement('div');
                labelCol.className = 'label-col';
                labelCol.innerText = getColumnName(c);
                cell.appendChild(labelCol);
            }

            let svgContent = '';
            if (r === 15 && (c === 18 || c === 37 || c === 56)) {
                svgContent = SVG_VERTICAL_PATH;
            }
            else if (type === 'path') {
                const modCol = (c < 19) ? c : (c < 38) ? c - 19 : c - 38;
                
                // Red Line Specific Logic
                let topConn = false, bottomConn = false, leftConn = false, rightConn = false;

                // Shifted logic: Warehouse rows are now 2 to 15
                if (r === 2) { // Top horizontal horizontal
                    if (modCol >= -1 && modCol <= 17) {
                        leftConn = (modCol > -1);
                        rightConn = (modCol < 17);
                        bottomConn = (modCol === -1 || modCol === 0 || modCol === 16 || modCol === 17); 
                        topConn = (modCol === -1 || modCol === 0 || modCol === 16 || modCol === 17); // Connect UP to new rows
                    }
                } else if (r === 14) { // Bottom horizontal
                    if (modCol >= -1 && modCol <= 17) {
                        leftConn = (modCol > 0);
                        rightConn = (modCol < 17); 
                        topConn = (modCol === -1 || modCol === 0 || modCol === 1 || modCol === 2 || modCol === 16 || modCol === 17); 
                        bottomConn = (modCol === 17); 
                    }
                } else if (r < 2) { // New extension rows (Full Path)
                    // Row 2: Remove horizontal rails as requested by user
                    if (r === 1) {
                        leftConn = false;
                        rightConn = false;
                    } else {
                        const isBorder = (c === 0 || c === 18 || c === 37 || c === 56);
                        leftConn = (c > 0);
                        rightConn = (c < COLS - 1);
                    }
                    // Only connect vertically at boundary corridors
                    const isBoundaryCol = (c === 0 || c === 18 || c === 19 || c === 37 || c === 38 || c === 56);
                    bottomConn = isBoundaryCol;
                    topConn = (r === 1 && isBoundaryCol); // Row 2 connects to Row 1 only at boundaries
                }

                else if (modCol === 0) { // Label 1
                    if (r >= 0 && r <= 14) {
                        topConn = (r > 0); 
                        bottomConn = (r < 14);
                        rightConn = true;
                        leftConn = (r === 0 && c > 0); // Allow left connection only on Row 1 for index > 0
                    }
                } else if (modCol === 1) { // Column 2
                    if (r >= 3 && r <= 14) {
                        topConn = (r >= 3); // Now true at r=3 (Row 4) to connect up
                        bottomConn = (r < 15); 
                        if (r >= 3 && r <= 13) {
                            leftConn = true;
                            rightConn = true;
                        }
                    }
                }
                // Label 18 & 19 (Shaft Area) Consolidate
                if (modCol === 17) { // Column 18
                    if (r === 0) {
                        rightConn = true; // Row 1 Corridor
                        leftConn = true;
                    }
                    if (r >= 2 && r <= 14) {
                        topConn = (r > 2); 
                        bottomConn = (r < 14);
                        leftConn = true;
                        rightConn = true; // Force connect to shaft
                    }
                    if (r === 2) topConn = false; // Cleanup Row 3 top
                }

                if (modCol === 18) { // Column 19 (Main Shaft)
                    if (r >= 0 && r <= 16) { 
                        topConn = (r > 2); 
                        bottomConn = (r < 16 && r !== 0 && r !== 1);
                        leftConn = (r >= 2 && r <= 13 || r === 0); 
                        rightConn = (r === 0 && c < COLS - 1); // Row 1 Corridor
                    }
                    if (r === 15 && (c === 18 || c === 37 || c === 56)) {
                        topConn = true;
                    }
                }

                // Final Overrides for Row 3/Shaft boundaries
                if (r === 2) {
                    if (modCol === 16) { topConn = false; bottomConn = false; }
                    if (modCol === 17) { rightConn = true; topConn = false; }
                    if (modCol === 18) { leftConn = true; topConn = false; }
                }

                // Final Overrides for Row 17 (Bottom Row)
                if (r === 16) {
                    bottomConn = false;
                }

                if (modCol === 16 && r >= 3 && r <= 13) {
                    svgContent = SVG_RAIL_CROSS;
                } else {
                    // Hide nodes (dots) for Row 2 except for Column 1
                    const showNode = !(r === 1 && c !== 0);
                    svgContent = getPathSVG(topConn, bottomConn, leftConn, rightConn, showNode);
                }
            }
            else if (type === 'empty') svgContent = SVG_EMPTY;
            else if (type === 'space') {
                const modCol = (c < 19) ? c : (c < 38) ? c - 19 : c - 38;
                if (modCol === 17 && r === 0) {
                    svgContent = SVG_CORNER_TOP_RIGHT_DOT;
                } else {
                    svgContent = SVG_SPACE;
                }
            }
            else if (type === 'shelf') {
                svgContent = SVG_SHELF;
                const mCol = (c < 19) ? c : (c < 38) ? c - 19 : c - 38;
                if (mCol === 0 && r >= 0 && r <= 12) {
                    const overlay = getPathSVG(r > 0, r < 12, false, (r === 0 || r === 12));
                    const pureRail = overlay.replace('<rect width="30" height="30" transform="matrix(-1 0 0 1 30 0)" fill="#DFF0FF" fill-opacity="0.5"/>', '');
                    svgContent = `<div style="position:relative; width:30px; height:30px;">
                        ${SVG_SHELF}
                        <div style="position:absolute; top:0; left:0;">${pureRail}</div>
                    </div>`;
                }
            }
            else if (type === 'inbound') svgContent = SVG_INBOUND;
            else if (type === 'outbound') svgContent = SVG_OUTBOUND;
            else if (type === 'parking') svgContent = SVG_PARKING;
            else if (type === 'charging') svgContent = SVG_CHARGING;
            else if (type === 'wall-v') svgContent = SVG_WALL_V;
            else if (type === 'wall-h') svgContent = SVG_WALL_H;
            else if (type === 'wall-tl') svgContent = SVG_WALL_CORNER_TL;
            else if (type === 'wall-tr') svgContent = SVG_WALL_CORNER_TR;
            else if (type === 'wall-bl') svgContent = SVG_WALL_CORNER_BL;
            else if (type === 'wall-br') svgContent = SVG_WALL_CORNER_BR;
            else if (type === 'wall-t-top') svgContent = SVG_WALL_T_TOP;
            else if (type === 'wall-t-bottom') svgContent = SVG_WALL_T_BOTTOM;
            else if (type === 'door') svgContent = SVG_CLSDOOR; // Default to closed
            else if (type === 'be1') svgContent = SVG_BE1;
            else if (type === 'be17') svgContent = SVG_BE17;
            // Delete from here
            else if (type === 'h-rail') {
                const vertCols = [0, 18, 37, 56]; // Keep shafts 1, 19, 38, 57; remove 20, 39, 58
                let hasLeft = (c !== 0);
                if (r === 16 && c === 18) hasLeft = false;
                let vType = 'full';
                if (c === 9) {
                    hasLeft = false; // Bắt đầu đường ray chính ở các tầng trên
                }
                if (c === 18 || c === 37 || c === 56) {
                    if (r === 14 || r === 16) vType = 'top'; // Nối lên tại các tầng biên
                }
                if (r === 16) vType = 'top'; // Đảm bảo dòng cuối cùng không có rail down
                const hasRight = (c !== COLS - 1);
                svgContent = getRailSVG(vertCols.includes(c), hasLeft, hasRight, vType);
            }

            // Shaft boundaries as manually set by user
            const isShaftCol = (c === 18 || c === 37 || c === 56);

            const waitingPositions = [
                // Module 1 (Col 1-19)
                { r: 2, c: 1 }, { r: 3, c: 0 }, { r: 13, c: 18 }, { r: 14, c: 17 },
                // Module 2 (Col 20-38)
                { r: 2, c: 20 }, { r: 3, c: 19 }, { r: 13, c: 37 }, { r: 14, c: 36 },
                // Module 3 (Col 39-57)
                { r: 2, c: 39 }, { r: 3, c: 38 }, { r: 13, c: 56 }, { r: 14, c: 55 }
            ];

            const isWaitingPos = waitingPositions.some(pos => pos.r === r && pos.c === c);
            if (isWaitingPos) {
                 if (r === 2 && (c === 1 || c === 19 || c === 38)) {
                    svgContent = SVG_WAITING_TOP_T;
                }
                else {
                    const needsRight = (r === 3 && c === 0) || (r === 14 && (c === 18 || c === 37 || c === 56));
                    if (needsRight) {
                        svgContent = SVG_WAITING_RIGHT;
                    } else {
                        svgContent = SVG_WAITING_LEFT;
                    }
                }
            } else if (type === 'inbound') {
                 svgContent = SVG_INBOUND;
            } else if (type === 'outbound') {
                svgContent = SVG_OUTBOUND;
            }
            
            cell.innerHTML += svgContent;
            
            // Append to appropriate module block
            if (c < 19) modA.appendChild(cell);
            else if (c < 38) modB.appendChild(cell);
            else modC.appendChild(cell);
        });
    });
    
    grid.appendChild(modA);
    grid.appendChild(modB);
    grid.appendChild(modC);

    // Shuttle Management
    const activeTimeouts = [];
    const CELL_SIZE = 30;
    const MOVE_STEP_MS = 350; // Time per cell step
    const PAUSE_AT_PARKING_MS = 2000;

    // Each module's 2 shuttles: 
    //   Shuttle 1: left parking (modCol=0), Shuttle 2: right parking (modCol=18)
    const shuttles = [
        { id: 'A1', mod: 'A', parkR: 9, parkC: 0,  leftC: 0,  rightC: 18 },
        { id: 'A2', mod: 'A', parkR: 9, parkC: 18, leftC: 0,  rightC: 18 },
        { id: 'B1', mod: 'B', parkR: 9, parkC: 19, leftC: 19, rightC: 37 },
        { id: 'B2', mod: 'B', parkR: 9, parkC: 37, leftC: 19, rightC: 37 },
        { id: 'C1', mod: 'C', parkR: 9, parkC: 38, leftC: 38, rightC: 56 },
        { id: 'C2', mod: 'C', parkR: 9, parkC: 56, leftC: 38, rightC: 56 }
    ];

    function createShuttle(mod) {
        const wrapper = document.getElementById('new-layout-grid-scaler');
        const shuttle = document.createElement('div');
        shuttle.className = `shuttle-cargo shuttle-${mod}`;
        shuttle.innerHTML = SVG_SHUTTLE_LOADED_V;
        shuttle.style.position = 'absolute';
        shuttle.style.transition = 'none';
        shuttle.style.width = '22px';
        shuttle.style.height = '30px';
        shuttle.style.zIndex = '100';
        wrapper.appendChild(shuttle);
        return shuttle;
    }

    function setShuttlePos(shuttle, r, c, vertical = true) {
        const w = vertical ? 22 : 30;
        const h = vertical ? 30 : 22;
        
        shuttle.innerHTML = vertical ? SVG_SHUTTLE_LOADED_V : SVG_SHUTTLE_LOADED;
        shuttle.style.width = `${w}px`;
        shuttle.style.height = `${h}px`;
        
        const x = c * CELL_SIZE + (CELL_SIZE - w) / 2;
        const y = r * CELL_SIZE + (CELL_SIZE - h) / 2;
        shuttle.style.left = `${x}px`;
        shuttle.style.top = `${y}px`;
    }

    // Build a cell-by-cell path that follows the rails
    function buildShuttlePath(shuttleData) {
        const { id, parkR, parkC, leftC, rightC } = shuttleData;
        const path = [];
        const isLeft = id.endsWith('1'); // Left parking shuttle

        if (isLeft) {
            // Shuttle 1 (left parking): 
            // 1. From parking (r9, leftC) go UP along left corridor to r2
            // 2. Turn right, go horizontal along row 2 from leftC to rightC
            // 3. Turn down, go DOWN along right corridor from r2 to r14
            // 4. Turn left, go horizontal along row 14 from rightC back to leftC
            // 5. Go UP along left corridor from r14 back to parking r9

            // Step 1: Up from parking to row 2
            for (let r = parkR; r >= 2; r--) {
                path.push({ r, c: leftC, v: true });
            }
            // Step 2: Right along row 2
            for (let c = leftC + 1; c <= rightC; c++) {
                path.push({ r: 2, c, v: false });
            }
            // Step 3: Down along right corridor to row 14
            for (let r = 3; r <= 14; r++) {
                path.push({ r, c: rightC, v: true });
            }
            // Step 4: Left along row 14 back to leftC
            for (let c = rightC - 1; c >= leftC; c--) {
                path.push({ r: 14, c, v: false });
            }
            // Step 5: Up from row 14 back to parking
            for (let r = 13; r >= parkR; r--) {
                path.push({ r, c: leftC, v: true });
            }
        } else {
            // Shuttle 2 (right parking):
            // 1. From parking (r9, rightC) go DOWN along right corridor to r14
            // 2. Turn left, go horizontal along row 14 from rightC to leftC
            // 3. Turn up, go UP along left corridor from r14 to r2
            // 4. Turn right, go horizontal along row 2 from leftC to rightC
            // 5. Go DOWN along right corridor from r2 back to parking r9

            // Step 1: Down from parking to row 14
            for (let r = parkR; r <= 14; r++) {
                path.push({ r, c: rightC, v: true });
            }
            // Step 2: Left along row 14
            for (let c = rightC - 1; c >= leftC; c--) {
                path.push({ r: 14, c, v: false });
            }
            // Step 3: Up along left corridor to row 2
            for (let r = 13; r >= 2; r--) {
                path.push({ r, c: leftC, v: true });
            }
            // Step 4: Right along row 2
            for (let c = leftC + 1; c <= rightC; c++) {
                path.push({ r: 2, c, v: false });
            }
            // Step 5: Down from row 2 back to parking
            for (let r = 3; r <= parkR; r++) {
                path.push({ r, c: rightC, v: true });
            }
        }

        return path;
    }

    async function sleep(ms) {
        return new Promise(res => {
            const t = setTimeout(res, ms);
            activeTimeouts.push(t);
        });
    }

    async function runShuttleAnimation(shuttleData) {
        const shuttle = createShuttle(shuttleData.mod);
        const { mod } = shuttleData;
        const path = buildShuttlePath(shuttleData);

        // Initial position
        setShuttlePos(shuttle, shuttleData.parkR, shuttleData.parkC, true);

        // Initial check for visibility
        const modOption = multiselect?.querySelector(`.option-item[data-value="${mod}"]`);
        if (modOption && !modOption.classList.contains('active')) {
            shuttle.style.display = 'none';
        }

        // Enable smooth transition for movement
        shuttle.style.transition = `left ${MOVE_STEP_MS}ms linear, top ${MOVE_STEP_MS}ms linear`;

        while (true) {
            // Animate along each path step
            for (const step of path) {
                setShuttlePos(shuttle, step.r, step.c, step.v);
                await sleep(MOVE_STEP_MS);
            }
            // Pause at parking spot
            await sleep(PAUSE_AT_PARKING_MS);
        }
    }



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
                    showToast(`Hiển thị thông tin của ${selectedText}`, 'success');
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
                    showToast(`Hiển thị thông tin  của ${opt.querySelector('.label-text').innerText}`, 'success');
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
                        showToast('Hiển thị thông tin  của Tất cả module', 'success');
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
                
                const isVisible = selectedModules.includes(modId);
                if (isVisible) {
                    block.classList.remove('hidden-module');
                } else {
                    block.classList.add('hidden-module');
                }

                // Update shuttles for this module
                const modShuttles = document.querySelectorAll(`.shuttle-${modId}`);
                modShuttles.forEach(s => {
                    s.style.display = isVisible ? 'block' : 'none';
                });
            });
        }
        
        // Initial sync
        updateMapVisibility();

        // Start all shuttles (must be after multiselect is declared)
        shuttles.forEach(runShuttleAnimation);

        // ═══════════════════════════════════════════════════
        //  FULLSCREEN LOGIC
        // ═══════════════════════════════════════════════════
        const btnFs = document.getElementById('btn-fullscreen');
        if (btnFs) {
            btnFs.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(err => {
                        console.error(`Erroring fullscreen: ${err.message}`);
                    });
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    }
                }
            });

            // Update icon when fullscreen state changes (handles Esc key too)
            document.addEventListener('fullscreenchange', () => {
                if (document.fullscreenElement) {
                    btnFs.innerHTML = '<i class="fa-solid fa-compress"></i>';
                } else {
                    btnFs.innerHTML = '<i class="fa-solid fa-expand"></i>';
                }
            });
        }

    }

    // ═══════════════════════════════════════════════════
    //  POPULATE 4 DASHBOARD CARDS (reused from traceIO)
    // ═══════════════════════════════════════════════════
    (function populateDashboardCards() {
        // --- Helper: Render Tabs ---
        function renderTabs(containerId, tabs, onTabClick) {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            // Generate HTML
            container.innerHTML = tabs.map((tab, i) => `
                <div class="nl-tab-item ${tab.active ? 'active' : ''}" data-status="${tab.status}">
                    <span class="nl-tab-label">${tab.label}</span>
                </div>
            `).join('');

            // Add Events
            container.querySelectorAll('.nl-tab-item').forEach(item => {
                item.addEventListener('click', () => {
                    container.querySelectorAll('.nl-tab-item').forEach(t => t.classList.remove('active'));
                    item.classList.add('active');
                    onTabClick(item.dataset.status);
                });
            });
        }

        // ── Helper: Format time as HH:MM:SS ──
        function fmtTime(d) {
            return d.toLocaleTimeString('vi-VN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }

        // ═══════════════════════════════════════════════════
        // Card 1: Danh sách lệnh – 8 shuttle (6 riêng + 2 chung)
        // ═══════════════════════════════════════════════════
        const cmdCard = document.querySelector('.nl-panel-card:nth-child(1)');
        const cmdList = document.getElementById('nlCmdList');
        if (cmdCard && cmdList) {
            const products = [
                'Chuối Trung Quốc/ Chinese bananas - A456 - TROPICAL',
                'Chuối Trung Quốc/ Chinese bananas - A456 - SOFIA',
                'Chuối Nhật Bản/ Japanese bananas - 26CP - DEL MONTE',
                'Chuối Nhật Bản/ Japanese bananas - 16CP - SEIKA',
                'Chuối Trung Quốc/ Chinese bananas - CL - DASANG',
                'Chuối Trung Quốc/ Chinese bananas - A789 - TROPICAL',
                'Chuối Nhật Bản/ Japanese bananas - 28CP - RCL',
                'Chuối Trung Quốc/ Chinese bananas - 16CP - TROPICAL'
            ];
            // 6 Shuttle riêng (2 per module) + 2 Shuttle chung (nhập/xuất)
            const commands = [
                { shuttle: 'Shuttle riêng A1', status: 'active', type: 'in', code: `CMD-${new Date().getFullYear()}0401`, product: products[0], pallet: 'PLT-00142' },
                { shuttle: 'Shuttle riêng A2', status: 'active', type: 'out', code: `CMD-${new Date().getFullYear()}0402`, product: products[1], pallet: 'PLT-00098' },
                { shuttle: 'Shuttle riêng B1', status: 'active', type: 'in', code: `CMD-${new Date().getFullYear()}0403`, product: products[2], pallet: 'PLT-00261' },
                { shuttle: 'Shuttle riêng B2', status: 'waiting', type: 'out', code: `CMD-${new Date().getFullYear()}0404`, product: products[3], pallet: 'PLT-00055' },
                { shuttle: 'Shuttle riêng C1', status: 'active', type: 'in', code: `CMD-${new Date().getFullYear()}0405`, product: products[4], pallet: 'PLT-00318' },
                { shuttle: 'Shuttle riêng C2', status: 'active', type: 'out', code: `CMD-${new Date().getFullYear()}0406`, product: products[5], pallet: 'PLT-00450' },
                { shuttle: 'Shuttle chung nhập', status: 'active', type: 'in', code: `CMD-${new Date().getFullYear()}0407`, product: products[6], pallet: 'PLT-00512' },
                { shuttle: 'Shuttle chung xuất', status: 'active', type: 'out', code: `CMD-${new Date().getFullYear()}0408`, product: products[7], pallet: 'PLT-00635' },
            ];

            const cmdBadge = document.getElementById('nlCmdBadge');
            if (cmdBadge) cmdBadge.textContent = `${commands.length} lệnh`;

            let tabsContainer = document.getElementById('nlCmdTabs');
            if (!tabsContainer) {
                tabsContainer = document.createElement('div');
                tabsContainer.id = 'nlCmdTabs';
                tabsContainer.className = 'nl-card-tabs';
                cmdList.parentNode.insertBefore(tabsContainer, cmdList);
            }

            const updateCmdList = (status) => {
                const filtered = status === 'all' ? commands : commands.filter(c => c.status === status);
                cmdList.innerHTML = filtered.map(cmd => `
                    <div class="nl-cmd-item ${cmd.status === 'active' ? 'active' : ''}">
                        <div class="nl-cmd-dot" style="background: ${cmd.status === 'error' ? '#ef4444' : cmd.status === 'done' ? '#10b981' : cmd.status === 'waiting' ? '#f59e0b' : '#3b82f6'}"></div>
                        <div class="nl-cmd-body">
                            <div class="nl-cmd-top-row">
                                <span class="nl-cmd-tag ${cmd.type === 'in' ? 'nl-tag-in' : 'nl-tag-out'}">${cmd.type === 'in' ? 'Nhập kho' : 'Xuất kho'}</span>
                                <span class="nl-cmd-code">${cmd.code}</span>
                            </div>
                            <div class="nl-cmd-product">${cmd.product}</div>
                        </div>
                        <span class="nl-cmd-pallet">${cmd.pallet}</span>
                    </div>
                `).join('');
            };

            const cmdTabs = [
                { label: `Tất cả (${commands.length})`, status: 'all', active: true },
                { label: `Đang chờ (${commands.filter(c => c.status === 'waiting').length})`, status: 'waiting' },
                { label: `Đang thực hiện (${commands.filter(c => c.status === 'active').length})`, status: 'active' },
                { label: `Hoàn thành (${commands.filter(c => c.status === 'done').length})`, status: 'done' },
                { label: `Lỗi (${commands.filter(c => c.status === 'error').length})`, status: 'error' },
            ];

            renderTabs('nlCmdTabs', cmdTabs, updateCmdList);
            updateCmdList('all');
        }

        // ═══════════════════════════════════════════════════
        // Card 2: Log hệ thống – REAL-TIME theo quy trình nhập/xuất kho
        //   Nhập: Shuttle chung nhập → Lifter nhập → Shuttle riêng
        //   Xuất: Shuttle riêng → Lifter xuất → Shuttle chung xuất
        // ═══════════════════════════════════════════════════
        const logList = document.getElementById('nlLogList');
        const logBadge = document.getElementById('nlLogBadge');
        if (logList) {
            const modules = ['A','B','C'];
            const positions = ['1-B3','1-C5','1-D7','1-E4','1-F6','1-A2','1-C8','1-G3','1-H5','1-B7'];
            const floors = ['1','2','3'];

            // ─── QUY TRÌNH NHẬP KHO (các bước tự động) ───
            const inboundSteps = [
                { icon: '📦', tpl: 'WCS gửi tín hiệu → Shuttle chung nhập di chuyển từ vị trí cổng nhập đến lấy Pallet <span class="loc">PLT-{pallet}</span>' },
                { icon: '→', tpl: 'Shuttle chung nhập di chuyển đến vị trí Lifter nhập <span class="loc">Kho mát {mod}</span>' },
                { icon: '⬇', tpl: 'Shuttle chung nhập bỏ Pallet vào Lifter nhập <span class="loc">Kho mát {mod}</span>, di chuyển về cổng nhập' },
                { icon: '✓', tpl: 'Shuttle chung nhập gửi tín hiệu về WCS – hoàn tất giao Pallet' },
                { icon: '⚙', tpl: 'WCS nhận tín hiệu và thực hiện điều phối' },
                { icon: '⬆', tpl: 'WCS → PLC điều khiển Lifter nhập <span class="loc">Kho mát {mod}</span> nâng Pallet lên tầng <span class="loc">{floor}</span>' },
                { icon: '✓', tpl: 'Lifter nhập <span class="loc">Kho mát {mod}</span> gửi tín hiệu hoàn tất về WCS' },
                { icon: '⚙', tpl: 'WCS nhận tín hiệu và thực hiện điều phối' },
                { icon: '→', tpl: 'WCS → PLC điều khiển Shuttle riêng <span class="loc">{mod}1</span> di chuyển từ vị trí chờ đến Lifter nhập' },
                { icon: '📦', tpl: 'Shuttle riêng <span class="loc">{mod}1</span> lấy Pallet từ Lifter nhập thành công' },
                { icon: '→', tpl: 'Shuttle riêng <span class="loc">{mod}1</span> di chuyển Pallet đến vị trí lưu trữ <span class="loc">{pos}</span>' },
                { icon: '✓', tpl: 'Shuttle riêng <span class="loc">{mod}1</span> bỏ Pallet tại vị trí <span class="loc">{pos}</span> – gửi tín hiệu WCS' },
                { icon: '⚙', tpl: 'WCS → PLC: Lifter nhập <span class="loc">Kho mát {mod}</span> hạ xuống tầng 1, Shuttle riêng <span class="loc">{mod}1</span> về vị trí chờ' },
                { icon: '✓', tpl: 'Lifter và Shuttle riêng gửi tín hiệu hoàn tất về WCS' },
                { icon: '✅', tpl: 'WCS gửi tín hiệu đến WMS – Lệnh nhập kho <span class="loc">CMD-{cmd}</span> hoàn thành' },
            ];

            // ─── QUY TRÌNH XUẤT KHO (các bước tự động) ───
            const outboundSteps = [
                { icon: '⚙', tpl: 'WCS → PLC điều khiển Shuttle riêng <span class="loc">{mod}2</span> di chuyển từ vị trí chờ đến <span class="loc">{pos}</span>' },
                { icon: '📦', tpl: 'Shuttle riêng <span class="loc">{mod}2</span> lấy Pallet tại vị trí <span class="loc">{pos}</span> thành công' },
                { icon: '→', tpl: 'Shuttle riêng <span class="loc">{mod}2</span> di chuyển Pallet đến ô chờ trước Lifter xuất' },
                { icon: '✓', tpl: 'Shuttle riêng <span class="loc">{mod}2</span> đứng chờ – gửi tín hiệu về WCS' },
                { icon: '⚙', tpl: 'WCS nhận tín hiệu và thực hiện điều phối' },
                { icon: '⬆', tpl: 'WCS → PLC điều khiển Lifter xuất <span class="loc">Kho mát {mod}</span> nâng lên tầng <span class="loc">{floor}</span>' },
                { icon: '→', tpl: 'Shuttle riêng <span class="loc">{mod}2</span> di chuyển vào vị trí Lifter xuất, bỏ Pallet' },
                { icon: '✓', tpl: 'Shuttle riêng <span class="loc">{mod}2</span> rời Lifter xuất – gửi tín hiệu WCS' },
                { icon: '⚙', tpl: 'WCS → PLC: Lifter xuất <span class="loc">Kho mát {mod}</span> hạ xuống tầng 1, Shuttle riêng <span class="loc">{mod}2</span> về vị trí chờ' },
                { icon: '✓', tpl: 'Lifter xuất và Shuttle riêng <span class="loc">{mod}2</span> gửi tín hiệu hoàn tất về WCS' },
                { icon: '⚙', tpl: 'WCS nhận tín hiệu và thực hiện điều phối' },
                { icon: '→', tpl: 'WCS → PLC điều khiển Shuttle chung xuất di chuyển từ cổng xuất đến Lifter xuất <span class="loc">Kho mát {mod}</span>' },
                { icon: '📦', tpl: 'Shuttle chung xuất lấy Pallet từ Lifter xuất <span class="loc">Kho mát {mod}</span> thành công' },
                { icon: '→', tpl: 'Shuttle chung xuất di chuyển Pallet về vị trí cổng xuất' },
                { icon: '✓', tpl: 'Shuttle chung xuất gửi tín hiệu hoàn tất về WCS' },
                { icon: '✅', tpl: 'WCS gửi tín hiệu đến WMS – Lệnh xuất kho <span class="loc">CMD-{cmd}</span> hoàn thành' },
            ];

            let currentLogs = [];
            let logCounter = 0;
            const MAX_LOGS = 50;

            // Biến theo dõi chuỗi log (mô phỏng quy trình tuần tự)
            let activeFlows = []; // Mỗi flow = { steps, stepIdx, mod, pos, floor, pallet, cmd }

            function startNewFlow() {
                const isInbound = Math.random() > 0.4; // 60% nhập, 40% xuất
                const mod = modules[Math.floor(Math.random() * modules.length)];
                const pos = positions[Math.floor(Math.random() * positions.length)];
                const floor = floors[Math.floor(Math.random() * floors.length)];
                const pallet = String(Math.floor(Math.random() * 900) + 100).padStart(5,'0');
                const cmd = String(Math.floor(Math.random() * 9000) + 1000);
                activeFlows.push({
                    steps: isInbound ? inboundSteps : outboundSteps,
                    stepIdx: 0,
                    mod, pos, floor, pallet, cmd,
                    type: isInbound ? 'in' : 'out'
                });
            }

            function processMsg(tpl, flow) {
                return tpl
                    .replace(/\{mod\}/g, flow.mod)
                    .replace(/\{pos\}/g, flow.pos)
                    .replace(/\{floor\}/g, flow.floor)
                    .replace(/\{pallet\}/g, flow.pallet)
                    .replace(/\{cmd\}/g, flow.cmd);
            }

            function tickLogs() {
                const now = new Date();
                // Bắt đầu flow mới nếu cần (tối đa 3 flow đồng thời)
                if (activeFlows.length < 3 && Math.random() > 0.4) {
                    startNewFlow();
                }

                // Xử lý mỗi flow: lấy 1 bước tiếp theo
                const newEntries = [];
                activeFlows = activeFlows.filter(flow => {
                    if (flow.stepIdx < flow.steps.length) {
                        const step = flow.steps[flow.stepIdx];
                        const msg = processMsg(step.tpl, flow);
                        logCounter++;
                        newEntries.push({
                            time: fmtTime(now),
                            icon: step.icon,
                            msg,
                            type: flow.type,
                            id: logCounter
                        });
                        flow.stepIdx++;
                        return true;
                    }
                    return false; // flow hoàn thành → loại bỏ
                });

                // Thêm vào đầu danh sách (mới nhất trước)
                currentLogs = [...newEntries.reverse(), ...currentLogs];
                if (currentLogs.length > MAX_LOGS) currentLogs = currentLogs.slice(0, MAX_LOGS);
                renderLogList();
            }

            function renderLogList() {
                logList.innerHTML = currentLogs.map((log, i) => `
                    <div class="nl-log-row ${i === 0 ? 'nl-log-new' : ''}">
                        <span class="nl-log-time">${log.time}</span>
                        <span class="nl-log-icon">${log.icon}</span>
                        <span class="nl-log-msg">${log.msg}</span>
                    </div>
                    ${i < currentLogs.length - 1 ? '<div class="nl-log-divider"></div>' : ''}
                `).join('');
                if (logBadge) logBadge.textContent = `${currentLogs.length} sự kiện`;
            }

            // Khởi tạo ban đầu: chạy nhanh 2 flow hoàn chỉnh để có log sẵn
            for (let f = 0; f < 2; f++) startNewFlow();
            const initTime = new Date();
            let initStep = 0;
            activeFlows.forEach(flow => {
                while (flow.stepIdx < flow.steps.length) {
                    const step = flow.steps[flow.stepIdx];
                    const pastTime = new Date(initTime.getTime() - (30 - initStep) * 2000);
                    const msg = processMsg(step.tpl, flow);
                    logCounter++;
                    currentLogs.push({
                        time: fmtTime(pastTime),
                        icon: step.icon,
                        msg,
                        type: flow.type,
                        id: logCounter
                    });
                    flow.stepIdx++;
                    initStep++;
                }
            });
            activeFlows = []; // Reset sau init
            renderLogList();

            // Auto-refresh: mỗi 3 giây xử lý 1 step từ mỗi flow đang chạy
            const logInterval = setInterval(tickLogs, 3000);
            activeTimeouts.push(logInterval);
        }

        // ═══════════════════════════════════════════════════
        // Card 3: Danh sách hoạt động – 8 Shuttle + 6 Lifter = 14 thiết bị
        //   8 Shuttle = 6 riêng (2/module) + 2 chung (1 nhập + 1 xuất)
        //   6 Lifter  = 2/module (1 nhập + 1 xuất)
        // ═══════════════════════════════════════════════════
        const activityList = document.getElementById('nlActivityList');
        if (activityList) {
            const activities = [];

            // ─── 6 Shuttle riêng (2 per module) ───
            const shuttleRieng = [
                { name: 'Shuttle riêng A1', module: 'Kho mát A', status: 'active', mission: 'Di chuyển Pallet từ Lifter nhập đến vị trí lưu trữ 1-D4', battery: 82 },
                { name: 'Shuttle riêng A2', module: 'Kho mát A', status: 'active', mission: 'Lấy Pallet tại 1-C6, di chuyển đến Lifter xuất', battery: 75 },
                { name: 'Shuttle riêng B1', module: 'Kho mát B', status: 'active', mission: 'Chờ tại vị trí Lifter nhập – chờ Lifter nâng Pallet lên', battery: 68 },
                { name: 'Shuttle riêng B2', module: 'Kho mát B', status: 'inactive', mission: 'Đang chờ lệnh tại vị trí mặc định', battery: 90 },
                { name: 'Shuttle riêng C1', module: 'Kho mát C', status: 'active', mission: 'Di chuyển Pallet đến vị trí lưu trữ 1-G3', battery: 55 },
                { name: 'Shuttle riêng C2', module: 'Kho mát C', status: 'error', mission: 'Lỗi cảm biến hành trình – cần kiểm tra', battery: 15 }
            ];
            shuttleRieng.forEach(s => {
                activities.push({ name: s.name, type: 'shuttle', mission: `Nhiệm vụ: ${s.mission}`, battery: s.battery, status: s.status, module: s.module });
            });

            // ─── 2 Shuttle chung (nhập + xuất) ───
            const shuttleChung = [
                { name: 'Shuttle chung nhập', module: 'Tầng 1', status: 'active', mission: 'Di chuyển từ cổng nhập đến Lifter nhập Kho mát B', battery: 78 },
                { name: 'Shuttle chung xuất', module: 'Tầng 1', status: 'active', mission: 'Lấy Pallet từ Lifter xuất Kho mát A, về cổng xuất', battery: 65 }
            ];
            shuttleChung.forEach(s => {
                activities.push({ name: s.name, type: 'shuttle', mission: `Nhiệm vụ: ${s.mission}`, battery: s.battery, status: s.status, module: s.module });
            });

            // ─── 6 Lifter (2 per module: 1 nhập + 1 xuất) ───
            const lifterMissions = [
                { name: 'Lifter nhập A', module: 'Kho mát A', status: 'active', mission: 'Đang nâng Pallet lên tầng 2', battery: 95 },
                { name: 'Lifter xuất A', module: 'Kho mát A', status: 'active', mission: 'Đang hạ xuống tầng 1 sau khi nhận Pallet', battery: 92 },
                { name: 'Lifter nhập B', module: 'Kho mát B', status: 'active', mission: 'Chờ Shuttle chung nhập bỏ Pallet', battery: 88 },
                { name: 'Lifter xuất B', module: 'Kho mát B', status: 'active', mission: 'Đang nâng lên tầng 1 để nhận Pallet từ Shuttle riêng', battery: 90 },
                { name: 'Lifter nhập C', module: 'Kho mát C', status: 'error', mission: 'Lỗi phanh khẩn cấp – dừng hoạt động', battery: 78 },
                { name: 'Lifter xuất C', module: 'Kho mát C', status: 'active', mission: 'Đang hoạt động bình thường – chờ lệnh', battery: 95 }
            ];
            lifterMissions.forEach(l => {
                activities.push({ name: l.name, type: 'lifter', mission: `Nhiệm vụ: ${l.mission}`, battery: l.battery, status: l.status, module: l.module });
            });

            const actBadge = document.getElementById('nlActivityBadge');
            if (actBadge) actBadge.textContent = `${activities.length} thiết bị`;

            let tabsContainer = document.getElementById('nlActTabs');
            if (!tabsContainer) {
                tabsContainer = document.createElement('div');
                tabsContainer.id = 'nlActTabs';
                tabsContainer.className = 'nl-card-tabs';
                activityList.parentNode.insertBefore(tabsContainer, activityList);
            }

            const updateActList = (status) => {
                const filtered = status === 'all' ? activities : activities.filter(a => a.status === status);
                activityList.innerHTML = filtered.map(act => {
                    const statusClass = act.status === 'error' ? 'nl-status-warning' : (act.status === 'inactive' ? '' : 'nl-status-success');
                    const batIcon = act.battery < 20 ? 'fa-solid fa-battery-quarter' : 'fa-solid fa-battery-full';
                    const icon = act.type === 'shuttle' ? 'fa-solid fa-shuttle-space' : 'fa-solid fa-elevator';
                    
                    return `
                    <div class="nl-act-item ${statusClass}" style="${act.status === 'inactive' ? 'opacity: 0.6; background: #f1f5f9; border-left: 4px solid #94a3b8;' : ''}">
                        <div class="nl-act-icon-box" style="${act.status === 'inactive' ? 'border-color: #94a3b8;' : ''}">
                            <i class="${icon}" style="${act.status === 'inactive' ? 'color: #94a3b8;' : ''}"></i>
                        </div>
                        <div class="nl-act-content">
                            <div class="nl-act-top">
                                <span class="nl-act-name" style="${act.status === 'inactive' ? 'color: #64748b;' : ''}">${act.name}</span>
                                <div class="nl-act-battery-badge" style="${act.status === 'inactive' ? 'border-color: #94a3b8;' : ''}">
                                    <i class="${batIcon}" style="${act.status === 'inactive' ? 'color: #94a3b8;' : ''}"></i>
                                    <span class="nl-act-battery-text" style="${act.status === 'inactive' ? 'color: #64748b;' : ''}">${act.battery}%</span>
                                </div>
                            </div>
                            <div class="nl-act-mission">
                                <i class="fa-solid fa-bullhorn"></i>
                                <span class="nl-act-mission-text">${act.mission}</span>
                            </div>
                        </div>
                    </div>`;
                }).join('');
            };

            const actTabs = [
                { label: `Tất cả (${activities.length})`, status: 'all', active: true },
                { label: `Hoạt động (${activities.filter(a => a.status === 'active').length})`, status: 'active' },
                { label: `Không hoạt động (${activities.filter(a => a.status === 'inactive').length})`, status: 'inactive' },
                { label: `Lỗi (${activities.filter(a => a.status === 'error').length})`, status: 'error' },
            ];

            renderTabs('nlActTabs', actTabs, updateActList);
            updateActList('all');
        }

        // ═══════════════════════════════════════════════════
        // Card 4: Stats (V2 Design) – giữ nguyên
        // ═══════════════════════════════════════════════════
        const statsCard = document.getElementById('nlStatsCard');
        if (statsCard) {
            statsCard.innerHTML = `
                <div class="nl-stats-v3">
                    <div class="nl-pie-and-acc-row">
                        <!-- Left: Smaller Pie Chart -->
                        <div class="nl-pie-side">
                            <div class="nl-pie-small">
                                <div class="nl-pie-small-fill"></div>
                                <div class="nl-pie-small-center">
                                    <span class="nl-pie-val">80</span>
                                </div>
                            </div>
                        </div>

                        <!-- Right: Accordions -->
                        <div class="nl-acc-side">
                            <!-- Inbound Accordion -->
                            <div class="nl-acc-item active" id="acc-inbound">
                                <div class="nl-acc-header">
                                    <div class="nl-acc-dot dot-in"></div>
                                    <span class="nl-acc-title">Nhập hàng</span>
                                    <span class="nl-acc-count">40</span>
                                </div>
                                <div class="nl-acc-content">
                                    <div class="nl-acc-inner">
                                        <div class="nl-tree-line-wrapper">
                                            <div class="nl-tree-line-v"></div>
                                            <div class="nl-tree-items">
                                                ${[
                                                    { name: 'Khu vực chứa chuối TQ A456', val: '04' },
                                                    { name: 'Khu vực chứa chuối TQ CP', val: '04' },
                                                    { name: 'Khu vực chứa chuối TQ A789', val: '04' },
                                                    { name: 'Khu vực chứa chuối Nhật RCL', val: '04' },
                                                    { name: 'Khu vực chứa chuối Nhật 28LY', val: '04' },
                                                    { name: 'Khu vực chứa chuối Nhật 33CP', val: '04' },
                                                    { name: 'Khu vực chứa chuối Nhật 35CP', val: '04' },
                                                    { name: 'Khu vực chứa chuối Nhật 38CP', val: '04' },
                                                    { name: 'Khu vực chứa chuối Nhật 40CP', val: '04' },
                                                    { name: 'Khu vực chứa chuối Nhật 35CLD', val: '04' }
                                                ].map((item, idx) => `
                                                <div class="nl-tree-item ${idx === 1 ? 'active' : ''}">
                                                    <div class="nl-tree-line-h"></div>
                                                    <span class="nl-tree-name">${item.name}</span>
                                                    <span class="nl-tree-val">${item.val}</span>
                                                </div>`).join('')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Outbound Accordion -->
                            <div class="nl-acc-item" id="acc-outbound">
                                <div class="nl-acc-header">
                                    <div class="nl-acc-dot dot-out"></div>
                                    <span class="nl-acc-title">Xuất hàng</span>
                                    <span class="nl-acc-count">40</span>
                                </div>
                                <div class="nl-acc-content">
                                    <div class="nl-acc-inner">
                                        <div class="nl-tree-line-wrapper">
                                            <div class="nl-tree-line-v"></div>
                                            <div class="nl-tree-items">
                                                ${[
                                                    { name: 'Khu vực chứa chuối Nhật 28CP', val: '05' },
                                                    { name: 'Khu vực chứa chuối Nhật 36CP', val: '05' },
                                                    { name: 'Khu vực chứa chuối Nhật 30CP', val: '05' },
                                                    { name: 'Khu vực chứa chuối Nhật 38CP', val: '05' },
                                                    { name: 'Khu vực chứa chuối Nhật B5', val: '04' },
                                                    { name: 'Khu vực chứa chuối Nhật B6', val: '04' },
                                                    { name: 'Khu vực chứa chuối Nhật 33CP', val: '04' },
                                                    { name: 'Khu vực chứa chuối Nhật 28H', val: '04' },
                                                    { name: 'Khu vực chứa chuối Nhật 43 CP', val: '04' }
                                                ].map((item, idx) => `
                                                <div class="nl-tree-item">
                                                    <div class="nl-tree-line-h"></div>
                                                    <span class="nl-tree-name">${item.name}</span>
                                                    <span class="nl-tree-val">${item.val}</span>
                                                </div>`).join('')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Accordion Logic
            const headers = statsCard.querySelectorAll('.nl-acc-header');
            headers.forEach(header => {
                header.addEventListener('click', () => {
                    const item = header.parentElement;
                    const isActive = item.classList.contains('active');
                    
                    // Close others
                    statsCard.querySelectorAll('.nl-acc-item').forEach(acc => {
                        acc.classList.remove('active');
                    });

                    // Toggle current
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            });
        }

        // Shuttle Animations Logic (External Transfer Shuttles)
        const startShuttleAnimations = () => {
            const scaler = document.getElementById('new-layout-grid-scaler');
            if (!scaler) return;

            const createShuttleEl = (className) => {
            const el = document.createElement('div');
            el.className = `shuttle ${className}`;
            el.innerHTML = SVG_SHUTTLE_LOADED;
            scaler.appendChild(el);
            return el;
        };

        const shuttle1 = createShuttleEl('shuttle-inbound');
        const shuttle2 = createShuttleEl('shuttle-outbound');

        const setPos = (el, r, c) => {
            el.style.left = `${c * 30}px`;
            el.style.top = `${r * 30}px`;
            el.dataset.r = r;
            el.dataset.c = c;
        };

        const getPath = (start, end, verticalFirst = false) => {
            const path = [];
            let currR = start.r;
            let currC = start.c;
            
            if (verticalFirst) {
                // Move vertically first
                while (currR !== end.r) {
                    currR += (end.r > currR ? 1 : -1);
                    path.push({ r: currR, c: currC });
                }
                // Then horizontally
                while (currC !== end.c) {
                    currC += (end.c > currC ? 1 : -1);
                    path.push({ r: currR, c: currC });
                }
            } else {
                // Move horizontally first
                while (currC !== end.c) {
                    currC += (end.c > currC ? 1 : -1);
                    path.push({ r: currR, c: currC });
                }
                // Then vertically
                while (currR !== end.r) {
                    currR += (end.r > currR ? 1 : -1);
                    path.push({ r: currR, c: currC });
                }
            }
            return path;
        };

        const runAnimation = (el, targets, dock) => {
            let targetIdx = 0;

            const nextTrip = () => {
                const targetPos = targets[targetIdx];
                const startPos = { r: parseInt(el.dataset.r), c: parseInt(el.dataset.c) };
                
                // Outward: Horizontal then Vertical
                const toTargetPath = getPath(startPos, targetPos, false);
                
                let step = 0;
                const doStep = () => {
                    if (step < toTargetPath.length) {
                        setPos(el, toTargetPath[step].r, toTargetPath[step].c);
                        step++;
                        activeTimeouts.push(setTimeout(doStep, MOVE_STEP_MS));
                    } else {
                        // At target, perform drop-off (wait 2.5s)
                        activeTimeouts.push(setTimeout(() => {
                            const currentPos = { r: parseInt(el.dataset.r), c: parseInt(el.dataset.c) };
                            
                            // Return: Vertical then Horizontal to stay on rail
                            const toDockPath = getPath(currentPos, dock, true);
                            
                            let backStep = 0;
                            const doBackStep = () => {
                                if (backStep < toDockPath.length) {
                                    setPos(el, toDockPath[backStep].r, toDockPath[backStep].c);
                                    backStep++;
                                    activeTimeouts.push(setTimeout(doBackStep, MOVE_STEP_MS));
                                } else {
                                    // Back at dock, wait 1.5s, next target
                                    targetIdx = (targetIdx + 1) % targets.length;
                                    activeTimeouts.push(setTimeout(nextTrip, 1500));
                                }
                            };
                            doBackStep();
                        }, 2500));
                    }
                };
                doStep();
            };
            nextTrip();
        };

        // Coordinates: S1 stays on Row 17 (index 16) and Row 16 (index 15)
        // Coordinates: S2 stays on Row 1 (index 0) and Row 2 (index 1)
        const s1Dock = { r: 16, c: 56 };
        const s1Targets = [
            { r: 14, c: 18 }, // Module A Inbound
            { r: 14, c: 37 }, // Module B Inbound
            { r: 14, c: 56 }  // Module C Inbound
        ];

        const s2Dock = { r: 0, c: 56 };
        const s2Targets = [
            { r: 2, c: 0 },  // Module A Outbound
            { r: 2, c: 19 }, // Module B Outbound
            { r: 2, c: 38 }  // Module C Outbound
        ];

        setPos(shuttle1, s1Dock.r, s1Dock.c);
        setPos(shuttle2, s2Dock.r, s2Dock.c);

        runAnimation(shuttle1, s1Targets, s1Dock);
        runAnimation(shuttle2, s2Targets, s2Dock);
    };

    startShuttleAnimations();
    })();

    // Register cleanup function
    window.destroyModule = function() {
        console.log('Cleaning up New Layout module...');
        activeTimeouts.forEach(t => clearTimeout(t));
        document.querySelectorAll('.shuttle, .shuttle-cargo').forEach(s => s.remove());
    };

    // Close all when clicking outside
    document.addEventListener('click', () => {
        levelSelect?.classList.remove('active');
        multiselect?.classList.remove('active');
    });
})();
