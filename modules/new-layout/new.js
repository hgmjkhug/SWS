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
                
                if (isBoundaryRow) {
                    if (warehouseR === 0) {
                        const mCol = (c < 19) ? c : (c < 38) ? c - 19 : c - 38;
                        if (mCol === 0) type = 'outbound';
                        else type = 'path';
                    } else type = 'space';
                } else if (isBoundaryCol) {
                    if (warehouseR === 12 && c > 0) type = 'inbound';
                    else if (c === 56 && warehouseR >= 1 && warehouseR <= 11) type = 'space';
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
                if (r === 16 && c <= 8) type = 'space';
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
                labelCol.innerText = c + 1;
                cell.appendChild(labelCol);
            }

            let svgContent = '';
            if (r === 15 && (c === 19 || c === 38 || c === 57)) {
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
                        leftConn = (modCol > -1);
                        rightConn = (modCol < 17); 
                        topConn = (modCol === -1 || modCol === 0 || modCol === 16 || modCol === 17); 
                        bottomConn = (modCol === 17); 
                    }
                } else if (r < 2) { // New extension rows (Full Path)
                    // Row 2: Remove horizontal rails as requested by user
                    if (r === 1) {
                        leftConn = false;
                        rightConn = false;
                    } else {
                        const isBorder = (c === 0 || c === 19 || c === 38 || c === 57);
                        leftConn = (c > 0 && !isBorder);
                        rightConn = (c < COLS - 1);
                    }
                    // Only connect vertically at boundary corridors
                    const isBoundaryCol = (c === 0 || c === 19 || c === 38 || c === 57);
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
                const vertCols = [0, 18, 19, 37, 38, 56, 57]; // Chuyển Junction từ 9 sang 18 (Cột 19)
                let hasLeft = (c !== 0);
                let vType = 'full';
                if (c === 9 || c === 28 || c === 47) {
                    hasLeft = false; // Vẫn bắt đầu thanh rail từ Cột 10
                }
                if (c === 18 || c === 37 || c === 56) {
                    if (r === 14) vType = 'top'; // Nối lên tại Cột 19
                }
                const hasRight = (c !== COLS - 1);
                svgContent = getRailSVG(vertCols.includes(c), hasLeft, hasRight, vType);
            }

            // Shaft boundaries as manually set by user
            const isShaftCol = (c === 19 || c === 38 || c === 57);

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
            if (c <= 19) modA.appendChild(cell);
            else if (c <= 38) modB.appendChild(cell);
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
        const startR = 14;
        const axisC = 18; // Vertical axis at Column 19
        const inboundC = 17; // Inner path column (Label 18)
        const inboundR = 11;
        const moveDelay = 2000; 

        // Position at start (Vertical)
        setPosition(shuttle, startR, axisC, true);
        await new Promise(r => setTimeout(r, moveDelay));

        // Move to r=13 (Vertical Junction)
        setPosition(shuttle, 13, axisC, true);
        await new Promise(r => setTimeout(r, moveDelay));

        // Move to path (r=12) (Vertical)
        setPosition(shuttle, 12, axisC, true);
        await new Promise(r => setTimeout(r, moveDelay));

        // Move horizontally to inbound col (c=17) (Horizontal)
        setPosition(shuttle, 12, inboundC, false);
        await new Promise(r => setTimeout(r, moveDelay));

        // Move to inbound (r=11) (Vertical)
        setPosition(shuttle, inboundR, inboundC, true);
        await new Promise(r => setTimeout(r, 3000)); // Stay at inbound for 3s

        // Return: reverse the path
        setPosition(shuttle, 12, inboundC, true);
        await new Promise(r => setTimeout(r, moveDelay));

        // Move horizontally back to axis col (c=18) (Horizontal)
        setPosition(shuttle, 12, axisC, false);
        await new Promise(r => setTimeout(r, moveDelay));

        // Move down axis (r=13) (Vertical)
        setPosition(shuttle, 13, axisC, true);
        await new Promise(r => setTimeout(r, moveDelay));

        // Back to start row (r=14) (Vertical)
        setPosition(shuttle, 14, axisC, true);
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
