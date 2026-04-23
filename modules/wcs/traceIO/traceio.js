(function initTraceIOMap() {
    const gridContainer = document.getElementById('mapGrid');
    if (!gridContainer) return;
    
    // 0 = Empty/Path, 1 = Wall, 2 = Shelf, 3 = Charging Shelf
    const CELL_SIZE = 30;
    let currentFloor = 1;
    const mapMatrix = [
        [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4]
    ];
    mapMatrix[2][0] = 8;     // A3 Parking
    mapMatrix[6][14] = 7;    // O7 Parking
    mapMatrix[10][0] = 9;    // A11 special corner
    mapMatrix[10][14] = 11;  // O11 special corner

    // Create wrapper for spacing rules
    const wrapper = document.createElement('div');
    wrapper.className = 'map-grid-wrapper';
    gridContainer.innerHTML = '';
    gridContainer.appendChild(wrapper);

    const mainGrid = document.createElement('div');
    mainGrid.id = 'map-main-grid';
    wrapper.appendChild(mainGrid);

    // --- Helper for shelf decoration ---
    function addShelfDecor(cell, r, c) {
        const decor = document.createElement('div');
        decor.className = 'shelf-decor';
        
        const isSpecialColumnA = (c === 0 && r >= 1 && r <= 9 && r !== 2);
        const isSpecialColumnT = (c === 14 && r >= 2 && r <= 9 && r !== 6);
        const isSpecialColumnT_Top = (c === 14 && r === 1);

        if (isSpecialColumnA) {
            decor.innerHTML = `<svg width="${CELL_SIZE}" height="${CELL_SIZE}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_4025_17050)">
<rect width="40" height="40" fill="#DFF0FF" fill-opacity="0.5"/>
<path d="M20 20H40" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M20 0V19.7531" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M20 19.7529V39.9998" stroke="#7C8DB5" stroke-opacity="0.7"/>
<ellipse cx="20" cy="19.7531" rx="2" ry="1.97531" fill="#677594"/>
</g>
<defs>
<clipPath id="clip0_4025_17050">
<rect width="40" height="40" fill="white"/>
</clipPath>
</defs>
</svg>`;
        } else if (isSpecialColumnT) {
            decor.innerHTML = `<svg width="${CELL_SIZE}" height="${CELL_SIZE}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_4025_17051)">
<rect width="40" height="40" fill="#DFF0FF" fill-opacity="0.5"/>
<path d="M20 20H0" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M20 0V19.7531" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M20 19.7529V39.9998" stroke="#7C8DB5" stroke-opacity="0.7"/>
<ellipse cx="20" cy="19.7531" rx="2" ry="1.97531" fill="#677594"/>
</g>
<defs>
<clipPath id="clip0_4025_17051">
<rect width="40" height="40" fill="white"/>
</clipPath>
</defs>
</svg>`;
        } else if (isSpecialColumnT_Top) {
            decor.innerHTML = `<svg width="${CELL_SIZE}" height="${CELL_SIZE}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_T_top)">
<rect width="40" height="40" fill="#DFF0FF" fill-opacity="0.5"/>
<path d="M20 20H0" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M20 19.7529V39.9998" stroke="#7C8DB5" stroke-opacity="0.7"/>
<ellipse cx="20" cy="19.7531" rx="2" ry="1.97531" fill="#677594"/>
</g>
<defs>
<clipPath id="clip0_T_top">
<rect width="40" height="40" fill="white"/>
</clipPath>
</defs>
</svg>`;
        } else {
            decor.innerHTML = `<svg width="${CELL_SIZE}" height="${CELL_SIZE}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_4025_16985)">
<rect width="40" height="40" fill="#DFF0FF80"/>
<path d="M0 20H12" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M40 20H28" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M23.4821 14.6838C23.1815 14.9844 22.6828 14.9844 22.3822 14.6838L19.9989 12.3005L17.6157 14.6838C17.3151 14.9844 16.8164 14.9844 16.5158 14.6838C16.2151 14.3831 16.2151 13.8845 16.5158 13.5838L19.449 10.6506C19.7496 10.35 20.2483 10.35 20.5489 10.6506L23.4821 13.5838C23.7828 13.8845 23.7828 14.3336 23.4821 14.6838Z" fill="#076EB8"/>
<path d="M23.4821 26.4162L20.5489 29.3494C20.2483 29.65 19.7496 29.65 19.449 29.3494L16.5158 26.4162C16.2151 26.1155 16.2151 25.6169 16.5158 25.3162C16.8164 25.0156 17.3151 25.0156 17.6157 25.3162L19.9989 27.6995L22.3822 25.3162C22.6828 25.0156 23.1815 25.0156 23.4821 25.3162C23.7828 25.6169 23.7828 26.1155 23.4821 26.4162Z" fill="#076EB8"/>
<path d="M14.6817 23.4832C14.3811 23.7838 13.8824 23.7838 13.5818 23.4832L10.6486 20.55C10.348 20.2493 10.348 19.7507 10.6486 19.45L13.5818 16.5168C13.8824 16.2162 14.3811 16.2162 14.6817 16.5168C14.9824 16.8175 14.9824 17.3161 14.6817 17.6168L12.2985 20L14.6817 22.3832C14.9824 22.6839 14.9824 23.1825 14.6817 23.4832Z" fill="#076EB8"/>
<path d="M29.3454 20.55L26.4122 23.4832C26.1115 23.7838 25.6129 23.7838 25.3123 23.4832C25.0116 23.1825 25.0116 22.6839 25.3123 22.3832L27.6955 20L25.3123 17.6168C25.0116 17.3161 25.0116 16.8175 25.3123 16.5168C25.6129 16.2162 26.1115 16.2162 26.4122 16.5168L29.3454 19.45C29.646 19.7507 29.646 20.2493 29.3454 20.55Z" fill="#076EB8"/>
</g>
<rect x="0.25" y="0.25" width="39.5" height="39.5" stroke="#D8D8D8" stroke-opacity="0.2" stroke-width="0.5"/>
<defs>
<clipPath id="clip0_4025_16985">
<rect width="40" height="40" fill="white"/>
</clipPath>
</defs>
</svg>`;
        }
        cell.appendChild(decor);
    }

    // Render the grid cells
    mapMatrix.forEach((row, rowIndex) => {
        row.forEach((cellType, colIndex) => {
            const cell = document.createElement('div');
            cell.className = `map-cell row-${rowIndex + 1}`;
            if (cellType === 0) {
                cell.classList.add('empty');
                if (rowIndex > 0 && rowIndex < 10) { // Skip dots for Row 1 and Row 11+
                    const dot = document.createElement('div');
                    dot.className = 'node-dot';
                    cell.appendChild(dot);
                }
            } else if (cellType === 1) {
                cell.classList.add('wall');
            } else if (cellType === 2) {
                cell.classList.add('shelf');
                addShelfDecor(cell, rowIndex, colIndex);
            } else if (cellType === 3) {
                cell.classList.add('shelf');
                cell.classList.add('charging');
                const icon = document.createElement('div');
                icon.className = 'charging-icon';
                icon.innerHTML = `<svg width="${CELL_SIZE}" height="${CELL_SIZE}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g clip-path="url(#clip0_4025_17542)">
<rect width="40" height="40" fill="#DFF0FF80" fill-opacity="0.4"/>
<path d="M0 20H12" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M40 20H28" stroke="#7C8DB5" stroke-opacity="0.7"/>
<circle cx="20" cy="20" r="13" fill="white"/>
<rect x="10.9004" y="10.8999" width="18.2" height="18.2" fill="url(#pattern0_4025_17542)"/>
</g>
<rect x="0.25" y="0.25" width="39.5" height="39.5" stroke="#D8D8D8" stroke-opacity="0.2" stroke-width="0.5"/>
<defs>
<pattern id="pattern0_4025_17542" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_4025_17542" transform="scale(0.00195312)"/>
</pattern>
<clipPath id="clip0_4025_17542">
<rect width="40" height="40" fill="white"/>
</clipPath>
<image id="image0_4025_17542" width="512" height="512" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/>
</defs>
</svg>

`

                cell.appendChild(icon);
            } else if (cellType === 4) {
                cell.classList.add('inbound');
                const icon = document.createElement('div');
                icon.className = 'inbound-icon';
                icon.innerHTML = `<svg width="${CELL_SIZE}" height="${CELL_SIZE}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_4305_21571)">
<rect width="40" height="40" fill="#A4D3FE" fill-opacity="0.4"/>
<path d="M20 0V12" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M20 40V28" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M28.5412 17.2831V22.7164C28.5412 26.8081 26.7912 28.5581 22.6996 28.5581H22.5912C18.8912 28.5581 17.1079 27.0998 16.7996 23.8331C16.7746 23.4998 17.0246 23.1831 17.3662 23.1498C17.7079 23.1164 18.0162 23.3664 18.0496 23.7164C18.2912 26.3331 19.5246 27.3081 22.5996 27.3081H22.7079C26.0996 27.3081 27.2996 26.1081 27.2996 22.7164V17.2831C27.2996 13.8914 26.0996 12.6914 22.7079 12.6914H22.5996C19.5079 12.6914 18.2746 13.6831 18.0496 16.3498C18.0162 16.6914 17.7162 16.9498 17.3746 16.9164C17.0329 16.8831 16.7746 16.5914 16.8079 16.2414C17.0912 12.9248 18.8829 11.4414 22.6079 11.4414H22.7162C26.7912 11.4414 28.5412 13.1914 28.5412 17.2831Z" fill="#076EB8"/>
<path d="M23.0253 20C23.0253 20.3417 22.742 20.625 22.4003 20.625H11.667C11.3253 20.625 11.042 20.3417 11.042 20C11.042 19.6583 11.3253 19.375 11.667 19.375H22.4003C22.7503 19.375 23.0253 19.6583 23.0253 20Z" fill="#076EB8"/>
<path d="M23.9585 20C23.9585 20.1583 23.9002 20.3166 23.7752 20.4416L20.9835 23.2333C20.7419 23.475 20.3419 23.475 20.1002 23.2333C19.8585 22.9916 19.8585 22.5916 20.1002 22.35L22.4502 20L20.1002 17.65C19.8585 17.4083 19.8585 17.0083 20.1002 16.7666C20.3419 16.525 20.7419 16.525 20.9835 16.7666L23.7752 19.5583C23.9002 19.6833 23.9585 19.8416 23.9585 20Z" fill="#076EB8"/>
</g>
<rect x="0.25" y="0.25" width="39.5" height="39.5" stroke="#D8D8D8" stroke-opacity="0.2" stroke-width="0.5"/>
<defs>
<clipPath id="clip0_4305_21571">
<rect width="40" height="40" fill="white"/>
</clipPath>
</defs>
</svg>
`;
                cell.appendChild(icon);
            } else if (cellType === 5) {
                cell.classList.add('outbound');
                const icon = document.createElement('div');
                icon.className = 'outbound-icon';
                icon.innerHTML = `<svg width="${CELL_SIZE}" height="${CELL_SIZE}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_4305_21146)">
<rect width="40" height="40" fill="#A4D3FE" fill-opacity="0.4"/>
<path d="M20 40V28" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M11.4588 22.7169V17.2836C11.4588 13.1919 13.2088 11.4419 17.3004 11.4419H17.4088C21.1088 11.4419 22.8921 12.9002 23.2004 16.1669C23.2254 16.5002 22.9754 16.8169 22.6338 16.8502C22.2921 16.8836 21.9838 16.6336 21.9504 16.2836C21.7088 13.6669 20.4754 12.6919 17.4004 12.6919H17.2921C13.9004 12.6919 12.7004 13.8919 12.7004 17.2836V22.7169C12.7004 26.1086 13.9004 27.3086 17.2921 27.3086H17.4004C20.4921 27.3086 21.7254 26.3169 21.9504 23.6502C21.9838 23.3086 22.2838 23.0502 22.6254 23.0836C22.9671 23.1169 23.2254 23.4086 23.1921 23.7586C22.9088 27.0752 21.1171 28.5586 17.3921 28.5586H17.2838C13.2088 28.5586 11.4588 26.8086 11.4588 22.7169Z" fill="#076EB8"/>
<path d="M16.8751 20C16.8751 19.6583 17.1584 19.375 17.5001 19.375L26.9834 19.375C27.3251 19.375 27.6084 19.6583 27.6084 20C27.6084 20.3417 27.3251 20.625 26.9834 20.625H17.5001C17.1584 20.625 16.8751 20.3417 16.8751 20Z" fill="#076EB8"/>
<path d="M24.5005 22.7917C24.5005 22.6334 24.5588 22.475 24.6838 22.35L27.0338 20L24.6838 17.65C24.4421 17.4084 24.4421 17.0084 24.6838 16.7667C24.9255 16.525 25.3255 16.525 25.5671 16.7667L28.3588 19.5584C28.6005 19.8 28.6005 20.2 28.3588 20.4417L25.5671 23.2334C25.3255 23.475 24.9255 23.475 24.6838 23.2334C24.5588 23.1167 24.5005 22.95 24.5005 22.7917Z" fill="#076EB8"/>
</g>
<rect x="0.25" y="0.25" width="39.5" height="39.5" stroke="#D8D8D8" stroke-opacity="0.2" stroke-width="0.5"/>
<defs>
<clipPath id="clip0_4305_21146">
<rect width="40" height="40" fill="white"/>
</clipPath>
</defs>
</svg>

               `;
                cell.appendChild(icon);
            } else if (cellType === 6) {
                cell.classList.add('pallet-pos');
                const icon = document.createElement('div');
                icon.className = 'pallet-icon';
                icon.innerHTML = `<svg width="${CELL_SIZE}" height="${CELL_SIZE}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_4025_17414)">
<path d="M0 20H8.1" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M40 20L31 20" stroke="#7C8DB5" stroke-opacity="0.7"/>
<g filter="url(#filter0_d_4025_17414)">
<path d="M22.037 8.01953L9.26853 9.9016C8.82754 9.9666 8.6856 10.5325 9.04371 10.7979L15.0409 15.243C15.1556 15.328 15.3011 15.3599 15.4409 15.3307L30.3319 12.2195C30.8174 12.1181 30.8749 11.4479 30.4138 11.2652L22.2941 8.04932C22.2125 8.01701 22.1238 8.00674 22.037 8.01953Z" fill="#38A0F0" fill-opacity="0.7"/>
<path d="M14.7693 15.5729L8.80567 11.0371C8.47594 10.7863 8.00176 11.0223 8.00298 11.4365L8.03598 22.6538C8.0363 22.7633 8.07256 22.8696 8.13918 22.9565L14.0698 30.6919C14.3605 31.0711 14.9666 30.8655 14.9666 30.3876V15.9709C14.9666 15.8147 14.8936 15.6675 14.7693 15.5729Z" fill="#1D8ADF"/>
<path d="M31.3891 12.4606L15.7934 15.8453C15.5634 15.8952 15.3994 16.0987 15.3994 16.334V31.2908C15.3994 31.6365 15.7419 31.8779 16.0675 31.7617L31.6632 26.1965C31.8623 26.1254 31.9952 25.9369 31.9952 25.7256V12.9493C31.9952 12.6304 31.7007 12.393 31.3891 12.4606Z" fill="#0F6EB8" stroke="#0F6EB8" stroke-width="0.1"/>
</g>
</g>
<defs>
<filter id="filter0_d_4025_17414" x="4.00293" y="8.01416" width="32.042" height="31.8271" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4025_17414"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4025_17414" result="shape"/>
</filter>
<clipPath id="clip0_4025_17414">
<rect width="40" height="40" fill="white"/>
</clipPath>
</defs>
</svg>

`;
                cell.appendChild(icon);

            } else if (cellType === 7) {
                cell.classList.add('parking-pos');
                const icon = document.createElement('div');
                icon.className = 'parking-icon';
                icon.innerHTML = `<svg width="${CELL_SIZE}" height="${CELL_SIZE}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_4305_21463)">
<path d="M20 0V11" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M20 40V29" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M0 20H10.7317" stroke="#7C8DB5" stroke-opacity="0.7"/>
<circle cx="20" cy="20" r="9.4" fill="white" stroke="#076EB8" stroke-width="1.2"/>
<path d="M18.0909 26C17.4945 26 17 25.5705 17 25.0526V14.9474C17 14.4295 17.4945 14 18.0909 14H21C23.2109 14 25 15.5537 25 17.4737C25 19.3937 23.2109 20.9474 21 20.9474H19.1818V25.0526C19.1818 25.5705 18.6873 26 18.0909 26ZM19.1818 19.0526H21C22.0036 19.0526 22.8182 18.3453 22.8182 17.4737C22.8182 16.6021 22.0036 15.8947 21 15.8947H19.1818V19.0526Z" fill="#076EB8"/>
</g>
<defs>
<clipPath id="clip0_4305_21463">
<rect width="40" height="40" fill="white"/>
</clipPath>
</defs>
</svg>
`;
                cell.appendChild(icon);
            } else if (cellType === 8) {
                cell.classList.add('parking-pos');
                const icon = document.createElement('div');
                icon.className = 'parking-icon';
                icon.innerHTML = `<svg width="${CELL_SIZE}" height="${CELL_SIZE}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_4305_21445)">
<path d="M20 0V11" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M20 40V29" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M40.0003 20L29.2686 20" stroke="#7C8DB5" stroke-opacity="0.7"/>
<circle cx="20" cy="20" r="9.4" fill="white" stroke="#076EB8" stroke-width="1.2"/>
<path d="M18.0909 26C17.4945 26 17 25.5705 17 25.0526V14.9474C17 14.4295 17.4945 14 18.0909 14H21C23.2109 14 25 15.5537 25 17.4737C25 19.3937 23.2109 20.9474 21 20.9474H19.1818V25.0526C19.1818 25.5705 18.6873 26 18.0909 26ZM19.1818 19.0526H21C22.0036 19.0526 22.8182 18.3453 22.8182 17.4737C22.8182 16.6021 22.0036 15.8947 21 15.8947H19.1818V19.0526Z" fill="#076EB8"/>
</g>
<defs>
<clipPath id="clip0_4305_21445">
<rect width="40" height="40" fill="white"/>
</clipPath>
</defs>
</svg>
`;
                cell.appendChild(icon);
            }
 else if (cellType === 9) {
                cell.classList.add('empty');
                const icon = document.createElement('div');
                icon.className = 'empty-icon';
                icon.innerHTML = `<svg width="${CELL_SIZE}" height="${CELL_SIZE}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 20H40" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M20 0V19.7531" stroke="#7C8DB5" stroke-opacity="0.7"/>
<ellipse cx="20" cy="19.7531" rx="2" ry="1.97531" fill="#677594"/>
</svg>`;
                cell.appendChild(icon);
            } else if (cellType === 10) {
                cell.classList.add('empty');
                const icon = document.createElement('div');
                icon.className = 'empty-icon';
                icon.innerHTML = `<svg width="${CELL_SIZE}" height="${CELL_SIZE}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 20H20" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M20 20H40" stroke="#7C8DB5" stroke-opacity="0.7"/>
<ellipse cx="20" cy="19.7531" rx="2" ry="1.97531" fill="#677594"/>
</svg>`;
                cell.appendChild(icon);
            } else if (cellType === 11) {
                cell.classList.add('empty');
                const icon = document.createElement('div');
                icon.className = 'empty-icon';
                icon.innerHTML = `<svg width="${CELL_SIZE}" height="${CELL_SIZE}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_4025_17043)">
<rect width="40" height="40" fill="#DFF0FF" fill-opacity="0.5"/>
<path d="M0 20H20" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M20 0V19.7531" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M20 19.7529V39.9998" stroke="#7C8DB5" stroke-opacity="0.7"/>
<ellipse cx="20" cy="19.7531" rx="2" ry="1.97531" fill="#677594"/>
</g>
<defs>
<clipPath id="clip0_4025_17043">
<rect width="40" height="40" fill="white"/>
</clipPath>
</defs>
</svg>`;
                cell.appendChild(icon);
            }
            mainGrid.appendChild(cell);
        });
    });

    // Add row and column labels
    function getColName(index) {
        let name = '';
        while (index >= 0) {
            name = String.fromCharCode(65 + (index % 26)) + name;
            index = Math.floor(index / 26) - 1;
        }
        return name;
    }

    const cols = 15;
    const rows = 11;

    for (let c = 0; c < cols; c++) {
        const label = document.createElement('div');
        label.className = 'label-col';
        label.innerText = getColName(c);
        label.style.left = (c * CELL_SIZE + CELL_SIZE / 2) + 'px';
        wrapper.appendChild(label);
    }
    for (let r = 0; r < rows; r++) {
        const label = document.createElement('div');
        label.className = `label-row row-label-${r + 1}`;
        label.innerText = r + 1;
        label.style.top = (r * CELL_SIZE + CELL_SIZE / 2) + 'px';
        wrapper.appendChild(label);
    }

    // --- Add Floor Selection Combobox ---
    const floorCombo = document.createElement('div');
    floorCombo.className = 'floor-combobox';
    floorCombo.innerHTML = `
        <div class="btn-content">
            <span class="btn-text">Tầng 1</span>
            <span class="btn-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.92 8.95019L13.4 15.4702C12.63 16.2402 11.37 16.2402 10.6 15.4702L4.07996 8.95019" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
        </div>
        <div class="floor-dropdown">
            <div class="dropdown-item active" data-floor="1">Tầng 1</div>
            <div class="dropdown-item" data-floor="2">Tầng 2</div>
        </div>
    `;

    // Dropdown toggle logic
    floorCombo.addEventListener('click', (e) => {
        e.stopPropagation();
        floorCombo.classList.toggle('open');
    });

    // Dropdown item selection
    floorCombo.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const floor = item.getAttribute('data-floor');
            floorCombo.querySelector('.btn-text').textContent = `Tầng ${floor}`;
            
            floorCombo.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            floorCombo.classList.remove('open');
            currentFloor = parseInt(floor);
            console.log(`Switched to Floor ${currentFloor}`);

            // Hide/Show row 16 based on floor
            document.querySelectorAll('.row-16, .row-label-16').forEach(el => {
                el.style.display = (currentFloor === 2) ? 'none' : '';
            });

            // Trigger success toast
            showToast(`Hiển thị bản đồ giám sát hoạt động của tầng ${currentFloor}`, 'success');

            // Show both shuttles on all floors
            shuttleEl1.style.display = 'block';
            shuttleEl2.style.display = 'block';
        });
    });

    // Close dropdown when clicking elsewhere
    document.addEventListener('click', () => {
        floorCombo.classList.remove('open');
    });

    wrapper.appendChild(floorCombo);

    // --- Shuttle implementation ---
    const getShuttleSVG = (loaded, isCharging, color = '#076EB8') => {
        const cargoSVG = loaded ? `
<g transform="translate(-2, -3) scale(0.85)">
    <path d="M14 12 L20 9 L26 12 L20 15 L14 12Z" fill="#0367CC"/>
    <path d="M14 12 V18 L20 21 V15 L14 12Z" fill="#0367CC"/>
    <path d="M20 15 V21 L26 18 V12 L20 15Z" fill="#0367CC"/>
</g>` : '';

        const chargingIcon = isCharging ? `<i class="fa-sharp fa-regular fa-bolt fa-beat charging-bolt" style="font-size: 11px;"></i>` : '';

        return `
<svg width="30" height="22" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_i_4025_17341)">
<path d="M0 10C0 4.47715 4.47715 0 10 0H32C36.4183 0 40 3.58172 40 8V22C40 26.4183 36.4183 30 32 30H10C4.47715 30 0 25.5228 0 20V10Z" fill="${color}"/>
<circle cx="20" cy="15" r="9.75" fill="white" stroke="#076EB8" stroke-width="0.5"/>
</g>
${cargoSVG}
<defs>
<filter id="filter0_i_4025_17341" x="0" y="0" width="40" height="34" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="7.5"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_4025_17341"/>
</filter>
</defs>
</svg>${chargingIcon}`;
    };

    function createShuttle() {
        const shuttle = document.createElement('div');
        shuttle.className = 'shuttle';
        shuttle.innerHTML = getShuttleSVG(false, false, '#F9F1E2'); // Start with parked color
        return shuttle;
    }

    const shuttleEl1 = createShuttle();
    const shuttleEl2 = createShuttle();
    shuttleEl2.id = 'shuttle-2'; // Add an ID to distinguish if needed
    mainGrid.appendChild(shuttleEl1);
    mainGrid.appendChild(shuttleEl2);



    // ─── Lifter bar at A14 (row 13, col 0) ───────────────────────────────────
    let lifterBar;
    let lifterTimeout1, lifterTimeout2;
    (function () {
        const cell = mainGrid.children[0 * cols + 14];
        if (!cell) return;
        lifterBar = document.createElement('div');
        lifterBar.className = 'lifter-bar';
        // starts hidden, icon injected dynamically
        cell.appendChild(lifterBar);
    })();

    // 'up'    → bar rises WITH pallet icon (lifter has cargo)
    // 'taken' → shuttle took cargo: remove icon, bar stays up 2 s then descends empty
  function setLifterPosition(state) {
    if (!lifterBar) return;

    // Clear any pending timeouts to avoid race conditions
    clearTimeout(lifterTimeout1);
    clearTimeout(lifterTimeout2);

    if (state === 'up') {
        // lifter nâng lên cùng pallet
        lifterBar.innerHTML =
        '<i class="fa-solid fa-pallet-box lifter-pallet"></i>';

        lifterBar.classList.add('active', 'up');
    }

    else if (state === 'taken') {
        // shuttle đã lấy pallet
        lifterBar.innerHTML = '';

        // Đảm bảo vẫn ở trạng thái 'up' khi vừa lấy xong
        lifterBar.classList.add('up', 'active');

        // đứng im 2s rồi hạ xuống
        lifterTimeout1 = setTimeout(() => {
            // hạ xuống (xóa class up)
            lifterBar.classList.remove('up');

            // Sau khi hạ xong (1.2s transition), mới ẩn hẳn (xóa class active)
            lifterTimeout2 = setTimeout(() => {
                lifterBar.classList.remove('active');
            }, 1200); 
        }, 2000);
    }
}


    // Track which shelf cells already have a pallet (occupied set)
    const occupiedCells = new Set();
    // Track which cells have already been visually rendered (separate from reservation)
    const renderedCells = new Set();

    // ── pallet SVG dropped on shelf cells ──
    function dropPallet(r, c) {
        if (mapMatrix[r][c] !== 2) return;
        const key = `${r},${c}`;
        if (renderedCells.has(key)) return;
        const cell = mainGrid.children[r * cols + c];
        if (!cell) return;
        
        renderedCells.add(key);
        occupiedCells.add(key);
        
        // Transform visually: replace shelf class with pallet-pos
        cell.classList.remove('shelf');
        cell.classList.add('pallet-pos');
        
        // Remove shelf decoration (crossed lines)
        const decor = cell.querySelector('.shelf-decor');
        if (decor) decor.remove();

        // Add pallet icon
        const icon = document.createElement('div');
        icon.className = 'pallet-icon';
        icon.innerHTML = `<svg width="${CELL_SIZE}" height="${CELL_SIZE}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="40" height="40" fill="#DFF0FF80" fill-opacity="0.2"/>
<path d="M0 20H8.1" stroke="#7C8DB5" stroke-opacity="0.3"/>
<path d="M40 20L31 20" stroke="#7C8DB5" stroke-opacity="0.3"/>
<g filter="url(#filter0_d_drop)">
<path d="M22.037 8.01953L9.26853 9.9016C8.82754 9.9666 8.6856 10.5325 9.04371 10.7979L15.0409 15.243C15.1556 15.328 15.3011 15.3599 15.4409 15.3307L30.3319 12.2195C30.8174 12.1181 30.8749 11.4479 30.4138 11.2652L22.2941 8.04932C22.2125 8.01701 22.1238 8.00674 22.037 8.01953Z" fill="#38A0F0" fill-opacity="0.9"/>
<path d="M14.7693 15.5729L8.80567 11.0371C8.47594 10.7863 8.00176 11.0223 8.00298 11.4365L8.03598 22.6538C8.0363 22.7633 8.07256 22.8696 8.13918 22.9565L14.0698 30.6919C14.3605 31.0711 14.9666 30.8655 14.9666 30.3876V15.9709C14.9666 15.8147 14.8936 15.6675 14.7693 15.5729Z" fill="#1D8ADF"/>
<path d="M31.3891 12.4606L15.7934 15.8453C15.5634 15.8952 15.3994 16.0987 15.3994 16.334V31.2908C15.3994 31.6365 15.7419 31.8779 16.0675 31.7617L31.6632 26.1965C31.8623 26.1254 31.9952 25.9369 31.9952 25.7256V12.9493C31.9952 12.6304 31.7007 12.393 31.3891 12.4606Z" fill="#0F6EB8" stroke="#0F6EB8" stroke-width="0.1"/>
</g>
<defs>
<filter id="filter0_d_drop" x="4.00293" y="8.01416" width="32.042" height="31.8271" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feOffset dy="2"/><feGaussianBlur stdDeviation="1"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
</filter>
</defs>
</svg>`;
        cell.appendChild(icon);
    }

    // 1. Initial Mocking (BEFORE generating paths)
    const mockAreas = [
        { rs: 1, re: 4, cs: 2, ce: 3, count: 4 },
        { rs: 1, re: 4, cs: 5, ce: 8, count: 8 },
        { rs: 1, re: 4, cs: 10, ce: 12, count: 6 },
        { rs: 6, re: 8, cs: 2, ce: 3, count: 3 },
        { rs: 6, re: 8, cs: 5, ce: 8, count: 6 },
        { rs: 6, re: 8, cs: 10, ce: 12, count: 4 }
    ];
    mockAreas.forEach(area => {
        let placed = 0;
        for (let r = area.rs; r <= area.re && placed < area.count; r++) {
            for (let c = area.cs; c <= area.ce && placed < area.count; c++) {
                if (mapMatrix[r][c] === 2) { dropPallet(r, c); placed++; }
            }
        }
    });

    function seg(r1, c1, r2, c2, act, currentAngle) {
        const steps = [];
        if (r1 !== r2 && c1 === c2) {
            const targetAngle = 90; // Vertical Orientation
            if (currentAngle !== undefined && currentAngle !== targetAngle) {
                // Direction change pause instead of rotation
                steps.push({ r: r1, c: c1, angle: targetAngle, duration: 250, action: 'switch' });
            }
            const dir = r2 > r1 ? 1 : -1;
            for (let r = r1 + dir; r !== r2 + dir; r += dir)
                steps.push({ r, c: c1, angle: targetAngle, action: r === r2 ? act : null });
            return { steps, lastAngle: targetAngle };
        } else if (c1 !== c2 && r1 === r2) {
            const targetAngle = 0; // Horizontal Orientation
            if (currentAngle !== undefined && currentAngle !== targetAngle) {
                // Direction change pause instead of rotation
                steps.push({ r: r1, c: c1, angle: targetAngle, duration: 250, action: 'switch' });
            }
            const dir = c2 > c1 ? 1 : -1;
            for (let c = c1 + dir; c !== c2 + dir; c += dir)
                steps.push({ r: r1, c, angle: targetAngle, action: c === c2 ? act : null });
            return { steps, lastAngle: targetAngle };
        }
        return { steps: [], lastAngle: currentAngle };
    }

    function findFreeShelfNear() {
        for (let r = 0; r < mapMatrix.length; r++) {
            for (let c = 0; c < mapMatrix[0].length; c++) {
                if (mapMatrix[r][c] === 2 && !occupiedCells.has(`${r},${c}`)) {
                    return { r, c };
                }
            }
        }
        return null;
    }

    const railColSet = new Set([0, 14]); // Vertically travel ONLY on columns A and O
    const shuttleStates = {}; // Global state to track all shuttle positions

    function missionPath(startR, startC, sourceR, sourceC, destR, destC, currentAngle = 0, role = 'inbound') {
        const path = [];
        let curR = startR, curC = startC;

        // 1. Exit parking spot if in column 14/0 or on a shelf
        if (curC === 0 || curC === 14 || mapMatrix[curR][curC] === 2) {
             const targetRail = (curC <= 7) ? 0 : 14;
             const approachC = (targetRail === 0) ? 1 : 13;
             if (curC !== approachC && curC !== targetRail) {
                 const s = seg(curR, curC, curR, approachC, null, currentAngle);
                 path.push(...s.steps); currentAngle = s.lastAngle; curC = approachC;
             }
        }

        // 2. Go to Source
        let targetRailC = (role === 'inbound') ? 14 : 0;
        let sourceRailC = (role === 'inbound') ? 14 : 0;

        // Move to vertical rail
        if (curC !== targetRailC) {
            const s = seg(curR, curC, curR, targetRailC, null, currentAngle);
            path.push(...s.steps); currentAngle = s.lastAngle; curC = targetRailC;
        }
        // Move vertically to source row
        if (curR !== sourceR) {
            const s = seg(curR, curC, sourceR, curC, null, currentAngle);
            path.push(...s.steps); currentAngle = s.lastAngle; curR = sourceR;
        }
        // Move horizontally to source column
        if (curC !== sourceC) {
            const s = seg(curR, curC, curR, sourceC, null, currentAngle);
            path.push(...s.steps); currentAngle = s.lastAngle; curC = sourceC;
        }

        // Load
        for (let i = 0; i < 3; i++) path.push({ r: sourceR, c: sourceC, angle: currentAngle, action: i === 0 ? 'load' : null });

        // 3. Go to Destination
        let destRailC = (role === 'inbound') ? 14 : 0;
        // Move back to vertical rail
        if (curC !== destRailC) {
            const s = seg(curR, curC, curR, destRailC, null, currentAngle);
            path.push(...s.steps); currentAngle = s.lastAngle; curC = destRailC;
        }
        // Move vertically to dest row
        if (curR !== destR) {
            const s = seg(curR, curC, destR, curC, null, currentAngle);
            path.push(...s.steps); currentAngle = s.lastAngle; curR = destR;
        }
        // Move horizontally to dest column
        if (curC !== destC) {
            const s = seg(curR, curC, curR, destC, null, currentAngle);
            path.push(...s.steps); currentAngle = s.lastAngle; curC = destC;
        }

        // Unload
        for (let i = 0; i < 3; i++) path.push({ r: destR, c: destC, angle: currentAngle, action: i === 0 ? 'unload' : null });

        // 4. Return to vertical rail
        if (curC !== destRailC) {
            const s = seg(curR, curC, curR, destRailC, null, currentAngle);
            path.push(...s.steps); currentAngle = s.lastAngle; curC = destRailC;
        }

        return { steps: path, lastR: curR, lastC: curC, lastAngle: currentAngle };
    }

    const reservedShelves = new Set();
    const activeTimeouts = [];

    function animateShuttle(shuttleEl, totalMissions, startPos, shuttleId, role, startDelay = 0) {
        let fullPath = [];
        let currR = startPos.r, currC = startPos.c, currAngle = 0;
        let missionsCompleted = 0;
        let idx = 0, isLoaded = false;
        const STEP = 500;

        // Sync visual position immediately
        shuttleStates[shuttleId] = { r: currR, c: currC };
        shuttleEl.style.transition = 'none';
        shuttleEl.style.top = (currR * CELL_SIZE + 4) + 'px';
        shuttleEl.style.left = (currC * CELL_SIZE) + 'px';
        shuttleEl.style.transform = `rotate(${currAngle}deg)`;
        shuttleEl.offsetHeight;

        function getNextTaskPath() {
            if (missionsCompleted >= totalMissions) {
                const pPath = [];
                const approachC = (startPos.c === 23) ? 22 : (startPos.c === 0 ? 1 : startPos.c);
                if (currC !== approachC) {
                    const toApproach = seg(currR, currC, currR, approachC, null, currAngle);
                    pPath.push(...toApproach.steps); currAngle = toApproach.lastAngle; currC = approachC;
                }
                if (currR !== startPos.r) {
                    const toRow = seg(currR, currC, startPos.r, currC, null, currAngle);
                    pPath.push(...toRow.steps); currAngle = toRow.lastAngle; currR = startPos.r;
                }
                const toFinal = seg(currR, currC, startPos.r, startPos.c, 'park', currAngle);
                pPath.push(...toFinal.steps);
                return pPath;
            }

            let mData;
            if (role === 'inbound') {
                // Flow: W15 (14,22) -> Empty Shelf
                let target = null;
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        if (mapMatrix[r][c] === 2 && !occupiedCells.has(`${r},${c}`) && !reservedShelves.has(`${r},${c}`)) {
                            target = { r, c }; break;
                        }
                    }
                    if (target) break;
                }
                if (!target) return null;
                const shelfKey = `${target.r},${target.c}`;
                reservedShelves.add(shelfKey);
                // Source is station T1 (0, 14)
                mData = missionPath(currR, currC, 0, 14, target.r, target.c, currAngle, 'inbound');
                mData.steps.forEach(s => {
                    if (s.action === 'unload') s.onComplete = () => {
                        reservedShelves.delete(shelfKey);
                        occupiedCells.add(shelfKey);
                    };
                });
            } else {
                // Flow: Occupied Shelf -> A1 (0, 0)
                let target = null;
                // Outbound only uses rows 1-15 (index 0-14)
                for (let r = 0; r <= 14; r++) {
                    for (let c = 0; c < cols; c++) {
                        if (mapMatrix[r][c] === 2 && occupiedCells.has(`${r},${c}`) && !reservedShelves.has(`${r},${c}`)) {
                            target = { r, c }; break;
                        }
                    }
                    if (target) break;
                }
                if (!target) return null;
                const shelfKey = `${target.r},${target.c}`;
                reservedShelves.add(shelfKey);
                // Destination is A1 (0, 0) via Column A
                mData = missionPath(currR, currC, target.r, target.c, 0, 0, currAngle, 'outbound');
                mData.steps.forEach(s => {
                    if (s.action === 'load') s.onComplete = () => {
                         reservedShelves.delete(shelfKey);
                         occupiedCells.delete(shelfKey);
                         // Visually remove pallet from cell and restore decoration
                         const cell = mainGrid.children[target.r * cols + target.c];
                         cell.classList.remove('pallet-pos');
                         cell.classList.add('shelf');
                         const icon = cell.querySelector('.pallet-icon');
                         if (icon) icon.remove();
                         addShelfDecor(cell, target.r, target.c);
                    };
                });
            }

            currR = mData.lastR; currC = mData.lastC; currAngle = mData.lastAngle;
            missionsCompleted++;
            return mData.steps;
        }

        function move() {
            if (idx >= fullPath.length) {
                const next = getNextTaskPath();
                if (!next || next.length === 0) return;
                fullPath = next; idx = 0;
                shuttleEl.style.transition = 'none';
            }

            const p = fullPath[idx];
            if (!p) return;

            // --- Robust Traffic Coordination ---
            const lookahead = fullPath.slice(idx, idx + 4); 
            const isBlocked = lookahead.some(step => 
                Object.entries(shuttleStates).some(([id, s]) => {
                    const otherEl = (id === 'shuttle-1' ? shuttleEl1 : shuttleEl2);
                    if (otherEl.style.display === 'none') return false; // Ignore hidden shuttles
                    return id !== shuttleId && s.r === step.r && s.c === step.c;
                })
            );

            if (isBlocked && p.action !== 'charge' && p.action !== 'park') {
                shuttleEl.style.transition = 'none';
                // SH-001 (Priority) waits less, SH-002 (Secondary) waits more to break deadlocks
                const baseWait = (shuttleId === 'shuttle-1' ? 400 : 1200);
                activeTimeouts.push(setTimeout(move, baseWait + Math.random() * 400));
                return;
            }

            shuttleStates[shuttleId] = { r: p.r, c: p.c };
            const duration = p.duration || STEP;
            shuttleEl.style.transition = `all ${duration}ms linear`;
            shuttleEl.style.top = (p.r * CELL_SIZE + 4) + 'px';
            shuttleEl.style.left = (p.c * CELL_SIZE) + 'px';
            shuttleEl.style.transform = `rotate(${p.angle}deg)`;

            if (p.lifterUp) setLifterPosition('up');
            if (p.action === 'load') { isLoaded = true; setLifterPosition('taken'); if (p.onComplete) p.onComplete(); }
            if (p.action === 'unload') { isLoaded = false; dropPallet(p.r, p.c); if (p.onComplete) p.onComplete(); }

            const color = (p.action === 'park' || p.action === 'charge') ? '#F9F1E2' : '#076EB8';
            shuttleEl.innerHTML = getShuttleSVG(isLoaded, p.action === 'charge', color);
            idx++;
            activeTimeouts.push(setTimeout(move, p.action === 'charge' ? 30000 : duration));
        }
        
        activeTimeouts.push(setTimeout(move, startDelay));
    }

    animateShuttle(shuttleEl1, 10, { r: 6, c: 14 }, 'shuttle-1', 'inbound');
    animateShuttle(shuttleEl2, 10, { r: 2, c: 0 }, 'shuttle-2', 'outbound', 5000);

    // Register cleanup function
    window.destroyModule = function() {
        console.log('Cleaning up TraceIO module...');
        activeTimeouts.forEach(t => clearTimeout(t));
        activeTimeouts.length = 0;
    };

})();

(function initPanels() {
    const commands = [
        { id: 'CMD-20240801', type: 'in',  product: 'Chuối Trung Quốc/ Chinese bananas - A456 - TROPICAL',  sku: 'MAT-001', pallet: 'PLT-00142', status: 'active' },
        { id: 'CMD-20240802', type: 'out', product: 'Chuối Trung Quốc/ Chinese bananas - A456 - SOFIA',    sku: 'MAT-002',   pallet: 'PLT-00098', status: 'active' },
        { id: 'CMD-20240803', type: 'in',  product: 'Chuối Trung Quốc/ Chinese bananas - A789 - TROPICAL',          sku: 'MAT-003',   pallet: 'PLT-00201', status: 'wait'   },
        { id: 'CMD-20240804', type: 'out', product: 'Chuối Nhật Bản/ Japanese bananas - 26CP - DEL MONTE',       sku: 'MAT-004',   pallet: 'PLT-00055', status: 'wait'   },
        { id: 'CMD-20240805', type: 'in',  product: 'Chuối Nhật Bản/ Japanese bananas - 16CP - SEIKA',  sku: 'MAT-005',   pallet: 'PLT-00310', status: 'wait'   },
    ];

    const logEntries = [
        { time: '09:14:22', type: 'amr',  msg: 'AMR-03 đã đưa pallet <span class="loc">PLT-00142</span> tới trạm nhập kho' },
        { time: '09:14:35', type: 'lift', msg: '<span class="device">Lifter L1</span> lấy pallet thành công' },
        { time: '09:14:48', type: 'lift', msg: '<span class="device">Lifter L1</span> đưa tới tầng <span class="loc">3</span> thành công' },
        { time: '09:14:55', type: 'shut', msg: '<span class="device">Shuttle S2</span> di chuyển tới vị trí Lifter để lấy hàng' },
        { time: '09:15:04', type: 'ok',   msg: '<span class="device">Shuttle S2</span> lấy pallet thành công' },
        { time: '09:15:12', type: 'shut', msg: '<span class="device">Shuttle S2</span> di chuyển tới vị trí đích' },
        { time: '09:15:21', type: 'ok',   msg: '<span class="device">Shuttle S2</span> bỏ pallet vào vị trí <span class="loc">3-D4</span> thành công' },
        { time: '09:16:03', type: 'amr',  msg: 'AMR-01 đã đưa pallet <span class="loc">PLT-00098</span> tới trạm nhập kho' },
        { time: '09:16:18', type: 'lift', msg: '<span class="device">Lifter L2</span> lấy pallet thành công' },
        { time: '09:16:29', type: 'lift', msg: '<span class="device">Lifter L2</span> đưa tới tầng <span class="loc">1</span> thành công' },
        { time: '09:16:37', type: 'shut', msg: '<span class="device">Shuttle S1</span> di chuyển tới vị trí Lifter để lấy hàng' },
        { time: '09:16:44', type: 'ok',   msg: '<span class="device">Shuttle S1</span> lấy pallet thành công' },
        { time: '09:16:52', type: 'shut', msg: '<span class="device">Shuttle S1</span> di chuyển tới vị trí đích' },
        { time: '09:17:01', type: 'ok',   msg: '<span class="device">Shuttle S1</span> bỏ pallet vào vị trí <span class="loc">1-B2</span> thành công' },
    ];

    const icons = {
        amr:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-4 0v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>`,
        lift: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`,
        shut: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 12 19 12"/><polyline points="13 6 19 12 13 18"/></svg>`,
        ok:   `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    };

    const cmdList  = document.getElementById('cmdList');
    const cmdBadge = document.getElementById('cmdBadge');
    if (cmdList) {
        commands.forEach(cmd => {
            const el = document.createElement('div');
            el.className = `cmd-item status-${cmd.status}`;
            el.innerHTML = `
                <div class="cmd-status-dot"></div>
                <div class="cmd-body">
                    <div class="cmd-top-row">
                        <span class="cmd-type-tag ${cmd.type === 'in' ? 'tag-in' : 'tag-out'}">${cmd.type === 'in' ? 'Nhập kho' : 'Xuất kho'}</span>
                        <span class="cmd-code">${cmd.id}</span>
                    </div>
                    <div class="cmd-product">${cmd.product}</div>
                    <div class="cmd-meta">
                        <span class="cmd-sku">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                            ${cmd.sku}
                        </span>
                    </div>
                </div>
                <span class="cmd-pallet">${cmd.pallet}</span>
            `;
            cmdList.appendChild(el);
        });
        if (cmdBadge) cmdBadge.textContent = `${commands.length} lệnh`;
    }

    // ═══ CARD 3 — DANH SÁCH THIẾT BỊ (REDESIGN) ═══
    const devices = [
        { id: 'SH-001', name: 'Shuttle 1',  cmd: 'CMD-20240801', type: 'in',   battery: 85, status: 'online'   },
        { id: 'SH-002', name: 'Shuttle 2',  cmd: 'CMD-20240802', type: 'out',  battery: 42, status: 'online'   },
        { id: 'LF-01',  name: 'Lifter 1',   cmd: '—',            type: 'none', battery: 98, status: 'charging' },
        { id: 'AMR-03', name: 'AMR 03',     cmd: 'CMD-20240801', type: 'in',   battery: 15, status: 'online'   },
    ];

    const deviceList  = document.getElementById('deviceList');
    const deviceBadge = document.getElementById('deviceBadge');
    if (deviceList) {
        deviceList.innerHTML = '';
        const arrowDown = `<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="12 5 12 19"/><polyline points="19 12 12 19 5 12"/></svg>`;
        const arrowUp   = `<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="12 19 12 5"/><polyline points="5 12 12 5 19 12"/></svg>`;
        const dotIcon   = `<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/></svg>`;

        devices.forEach(dev => {
            const bc = dev.battery > 70 ? 'high' : dev.battery > 30 ? 'mid' : 'low';
            const batColor = bc === 'high' ? '#059669' : bc === 'mid' ? '#d97706' : '#dc2626';
            const chipClass = dev.type === 'in' ? 'chip-in' : dev.type === 'out' ? 'chip-out' : 'chip-none';
            const chipIcon  = dev.type === 'in' ? arrowDown : dev.type === 'out' ? arrowUp : dotIcon;
            const chipLabel = dev.type === 'in' ? 'Nhập kho' : dev.type === 'out' ? 'Xuất kho' : 'Chờ';
            const statusLabel = dev.status === 'online' ? 'Online' : dev.status === 'charging' ? 'Sạc pin' : 'Offline';
            const batIcon = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${batColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="18" height="12" rx="2"/><path d="M23 13v-2" stroke-width="2.5"/></svg>`;

            const el = document.createElement('div');
            el.className = `device-item type-${dev.type}`;
            el.innerHTML = `
                <div class="device-row-top">
                    <span class="device-id-badge">${dev.id}</span>
                    <span class="device-name-text">${dev.name}</span>
                    <span class="device-status-tag status-${dev.status}">${statusLabel}</span>
                </div>
                <div class="device-mission-row">
                    <span class="mission-type-chip ${chipClass}">${chipIcon}${chipLabel}</span>
                    <span class="mission-cmd-text">${dev.cmd}</span>
                </div>
                <div class="device-battery-row">
                    <span class="battery-icon-wrap">${batIcon}</span>
                    <div class="battery-track">
                        <div class="battery-fill ${bc}" style="width:${dev.battery}%"></div>
                    </div>
                    <span class="battery-pct ${bc}">${dev.battery}%</span>
                </div>
            `;
            deviceList.appendChild(el);
        });
        if (deviceBadge) deviceBadge.textContent = `${devices.length} thiết bị`;
    }

    // ═══ CARD 4 — THỐNG KÊ LOẠI LỆNH (REDESIGN — SVG Donut) ═══
    const statsCard = document.querySelector('.stats-card');
    if (statsCard) {
        const inCount  = commands.filter(c => c.type === 'in').length;
        const outCount = commands.filter(c => c.type === 'out').length;
        const total    = inCount + outCount || 1;
        const inPct    = Math.round((inCount  / total) * 100);
        const outPct   = 100 - inPct;

        const R = 38, C = 2 * Math.PI * R, gap = 2;
        const inDashAdj  = Math.max(0, (inPct  / 100) * C - gap);
        const outDashAdj = Math.max(0, (outPct / 100) * C - gap);
        const outOffset  = C - (inPct / 100) * C + gap / 2;

        statsCard.innerHTML = `
            <div class="stats-donut-wrap">
                <div class="donut-chart-container">
                    <svg class="donut-svg" viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
                        <circle class="donut-track"   cx="55" cy="55" r="${R}"/>
                        <circle class="donut-seg-in"  cx="55" cy="55" r="${R}"
                            stroke-dasharray="${inDashAdj} ${C - inDashAdj}"
                            stroke-dashoffset="0"/>
                        <circle class="donut-seg-out" cx="55" cy="55" r="${R}"
                            stroke-dasharray="${outDashAdj} ${C - outDashAdj}"
                            stroke-dashoffset="${outOffset}"/>
                    </svg>
                    <div class="donut-center">
                        <span class="donut-total-num">${total}</span>
                        <span class="donut-total-label">Tổng lệnh</span>
                    </div>
                </div>
                <div class="donut-legend">
                    <div class="legend-row">
                        <div class="legend-top">
                            <span class="legend-swatch swatch-in"></span>
                            <span class="legend-name">Nhập kho</span>
                            <span class="legend-pct">${inPct}%</span>
                        </div>
                        <div class="legend-mini-bar-track">
                            <div class="legend-mini-bar mini-bar-in" style="width:${inPct}%"></div>
                        </div>
                        <span class="legend-count">${inCount} lệnh</span>
                    </div>
                    <div class="legend-row">
                        <div class="legend-top">
                            <span class="legend-swatch swatch-out"></span>
                            <span class="legend-name">Xuất kho</span>
                            <span class="legend-pct">${outPct}%</span>
                        </div>
                        <div class="legend-mini-bar-track">
                            <div class="legend-mini-bar mini-bar-out" style="width:${outPct}%"></div>
                        </div>
                        <span class="legend-count">${outCount} lệnh</span>
                    </div>
                </div>
            </div>
            <div class="stats-summary-grid">
                <div class="summary-tile">
                    <span class="summary-tile-label">Tổng lệnh</span>
                    <span class="summary-tile-val">${total}</span>
                    <span class="summary-tile-sub">hôm nay</span>
                </div>
                <div class="summary-tile">
                    <span class="summary-tile-label">Hiệu suất</span>
                    <span class="summary-tile-val">98.2%</span>
                    <span class="summary-tile-sub">hoàn thành</span>
                </div>
                <div class="summary-tile">
                    <span class="summary-tile-label">Thời gian TB</span>
                    <span class="summary-tile-val">2.4m</span>
                    <span class="summary-tile-sub">mỗi lệnh</span>
                </div>
                <div class="summary-tile">
                    <span class="summary-tile-label">Lỗi hệ thống</span>
                    <span class="summary-tile-val" style="color:#dc2626">0</span>
                    <span class="summary-tile-sub">sự cố</span>
                </div>
            </div>
        `;
    }

    const logList  = document.getElementById('logList');
    const logBadge = document.getElementById('logBadge');
    if (logList) {
        logEntries.forEach((entry, i) => {
            const row = document.createElement('div');
            row.className = `log-row log-${entry.type}`;
            row.style.animationDelay = `${i * 35}ms`;
            row.innerHTML = `
                <span class="log-time">${entry.time}</span>
                <span class="log-icon">${icons[entry.type]}</span>
                <span class="log-msg">${entry.msg}</span>
            `;
            logList.appendChild(row);
        });
        if (logBadge) logBadge.textContent = `${logEntries.length} sự kiện`;
        setTimeout(() => { logList.scrollTop = logList.scrollHeight; }, 100);
    }
})();


function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Add icon for success if needed, or keep it simple as in the existing global version
    const icon = type === 'success' ? 
        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>` : '';

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${message}</div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
