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

const ROWS = 17;
const COLS = 58;

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
                if (c === 57) {
                    type = 'space'; // Remove all dots and rails in column 58
                } else if ((mCol === 0 || mCol === 18) && r === 9) {
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
                type = 'path';
            }
            // Rail Area at bottom (r === 16)
            else if (r >= 16) {
                const mCol = (c < 19) ? c : (c < 38) ? c - 19 : c - 38;
                if (r === 16 && (c <= 8 || (c < 19 && mCol >= 8 && mCol <= 17))) type = 'space';
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
                        rightConn = (r === 0); // Row 1 Corridor
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
            // Delete from here
            else if (type === 'h-rail') {
                const vertCols = [0, 18, 37, 56]; // Keep shafts 1, 19, 38, 57; remove 20, 39, 58
                let hasLeft = (c !== 0);
                let vType = 'full';
                if (c === 9 || c === 28 || c === 47) {
                    hasLeft = false; // Vẫn bắt đầu thanh rail từ Cột 10
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
    const shuttles = [
        { id: 'A1', mod: 'A', r: 9, c: 0 },
        { id: 'A2', mod: 'A', r: 9, c: 18 },
        { id: 'B1', mod: 'B', r: 9, c: 19 },
        { id: 'B2', mod: 'B', r: 9, c: 37 },
        { id: 'C1', mod: 'C', r: 9, c: 38 },
        { id: 'C2', mod: 'C', r: 9, c: 56 }
    ];

    function createShuttle(mod) {
        const wrapper = document.getElementById('new-layout-grid-scaler');
        const shuttle = document.createElement('div');
        shuttle.className = `shuttle-cargo shuttle-${mod}`;
        shuttle.innerHTML = SVG_SHUTTLE_LOADED_V;
        shuttle.style.position = 'absolute';
        shuttle.style.transition = 'all 1.5s linear';
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

    async function runShuttleAnimation(shuttleData) {
        const shuttle = createShuttle(shuttleData.mod);
        const { mod, r: startR, c: startC } = shuttleData;
        const moveDelay = 1500;
        
        // Define paths for each shuttle to follow rails
        let path = [];
        if (shuttleData.id.endsWith('1')) { // Left side shuttles
            path = [
                { r: startR, c: startC, v: true },
                { r: 2, c: startC, v: true },
                { r: 2, c: startC + 18, v: false },
                { r: 2, c: startC, v: false },
                { r: startR, c: startC, v: true }
            ];
        } else { // Right side shuttles
            path = [
                { r: startR, c: startC, v: true },
                { r: 14, c: startC, v: true },
                { r: 14, c: startC - 18, v: false },
                { r: 14, c: startC, v: false },
                { r: startR, c: startC, v: true }
            ];
        }

        // Initial check for visibility
        const modOption = multiselect?.querySelector(`.option-item[data-value="${mod}"]`);
        if (modOption && !modOption.classList.contains('active')) {
            shuttle.style.display = 'none';
        }

        while (true) {
            for (const step of path) {
                setPosition(shuttle, step.r, step.c, step.v);
                await new Promise(res => {
                    const t = setTimeout(res, moveDelay);
                    activeTimeouts.push(t);
                });
            }
            // Small pause at parking
            await new Promise(res => {
                const t = setTimeout(res, 3000);
                activeTimeouts.push(t);
            });
        }
    }

    // Start all shuttles
    shuttles.forEach(runShuttleAnimation);


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
    }

    // Register cleanup function
    window.destroyModule = function() {
        console.log('Cleaning up New Layout module...');
        activeTimeouts.forEach(t => clearTimeout(t));
        document.querySelectorAll('.shuttle-cargo').forEach(s => s.remove());
    };

    // Close all when clicking outside
    document.addEventListener('click', () => {
        levelSelect?.classList.remove('active');
        multiselect?.classList.remove('active');
    });
})();
