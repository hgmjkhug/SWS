function getPathSVG(top = true, bottom = true, left = true, right = true) {
    return `<svg width="40" height="40" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" transform="matrix(-1 0 0 1 30 0)" fill="#DFF0FF" fill-opacity="0.5"/>
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
    return `<svg width="40" height="40" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" fill="#DFF0FF" fill-opacity="0.3"/>
    <path d="M${xStart} 15H${xEnd}" stroke="#7C8DB5" stroke-opacity="0.8" stroke-width="1"/>
    ${hasVertical ? '<path d="M15 0V30" stroke="#7C8DB5" stroke-opacity="0.7"/>' : ''}
    <circle cx="15" cy="15" r="1.5" fill="#677594"/>
    </svg>`;
}

const SVG_EMPTY = `<svg width="40" height="40" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="40" height="40" transform="matrix(-1 0 0 1 30 0)" fill="#DFF0FF" fill-opacity="0.5"/>
<ellipse cx="2" cy="1.97531" rx="2" ry="1.97531" transform="matrix(-1 0 0 1 17 13)" fill="#677594"/>
</svg>`;

const SVG_WALL_V = `<svg width="40" height="40" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="40" height="40" transform="matrix(-1 0 0 1 30 0)" fill="#DFF0FF" fill-opacity="0.5"/>
<path d="M15 0L15 30" stroke="#7C8DB5" stroke-opacity="0.7"/>
</svg>`;

const SVG_WALL_H = `<svg width="40" height="40" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="40" height="40" transform="matrix(-1 0 0 1 30 0)" fill="#DFF0FF" fill-opacity="0.5"/>
<path d="M0 15H30" stroke="#7C8DB5" stroke-opacity="0.7"/>
</svg>`;

const SVG_WALL_CORNER_TL = `<svg width="40" height="40" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="40" height="40" transform="matrix(-1 0 0 1 30 0)" fill="#DFF0FF" fill-opacity="0.5"/>
<path d="M15 15H30" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M15 15V30" stroke="#7C8DB5" stroke-opacity="0.7"/>
</svg>`;

const SVG_WALL_CORNER_TR = `<svg width="40" height="40" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="40" height="40" transform="matrix(-1 0 0 1 30 0)" fill="#DFF0FF" fill-opacity="0.5"/>
<path d="M0 15H15" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M15 15V30" stroke="#7C8DB5" stroke-opacity="0.7"/>
</svg>`;

const SVG_WALL_CORNER_BL = `<svg width="40" height="40" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="40" height="40" transform="matrix(-1 0 0 1 30 0)" fill="#DFF0FF" fill-opacity="0.5"/>
<path d="M15 0V15" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M15 15H30" stroke="#7C8DB5" stroke-opacity="0.7"/>
</svg>`;

const SVG_WALL_CORNER_BR = `<svg width="40" height="40" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="40" height="40" transform="matrix(-1 0 0 1 30 0)" fill="#DFF0FF" fill-opacity="0.5"/>
<path d="M15 0V15" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M0 15H15" stroke="#7C8DB5" stroke-opacity="0.7"/>
</svg>`;

const SVG_WALL_T_TOP = `<svg width="40" height="40" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="40" height="40" transform="matrix(-1 0 0 1 30 0)" fill="#DFF0FF" fill-opacity="0.5"/>
<path d="M0 15H30" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M15 15V30" stroke="#7C8DB5" stroke-opacity="0.7"/>
</svg>`;

const SVG_WALL_T_BOTTOM = `<svg width="40" height="40" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="40" height="40" transform="matrix(-1 0 0 1 30 0)" fill="#DFF0FF" fill-opacity="0.5"/>
<path d="M0 15H30" stroke="#7C8DB5" stroke-opacity="0.7"/>
<path d="M15 0V15" stroke="#7C8DB5" stroke-opacity="0.7"/>
</svg>`;

const SVG_SHELF = `<svg width="40" height="40" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="40" height="40" fill="#A4D3FE" fill-opacity="0.4"/>
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

const SVG_DOOR = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="30" height="30" fill="#DFF0FF" fill-opacity="0.4"/>
<path d="M15.0667 5.60001C15.0667 11.804 15.0667 18.008 15.0667 24.4C12.8226 24.1507 10.6162 23.6324 8.40002 23.2C8.40002 17.92 8.40002 12.64 8.40002 7.20001C9.74987 6.75006 9.74987 6.75006 10.4146 6.60001C10.5593 6.56701 10.704 6.53401 10.8531 6.50001C11.0006 6.46701 11.1481 6.43401 11.3 6.40001C11.4454 6.36701 11.5908 6.33401 11.7406 6.30001C12.0334 6.23357 12.3262 6.16742 12.619 6.10157C13.2325 5.96239 13.8447 5.8181 14.4569 5.67344C14.8 5.60001 14.8 5.60001 15.0667 5.60001Z" fill="#FBFBFB"/>
<path d="M16.875 3.375C16.875 10.811 16.8 18.6053 16.8 26.2667C15.4766 26.2667 14.3943 26.2445 13.1349 25.9844C12.987 25.9554 12.8391 25.9265 12.6867 25.8966C12.2213 25.8051 11.7565 25.7109 11.2917 25.6167C10.9781 25.5545 10.6644 25.4925 10.3508 25.4307C9.65911 25.2941 8.96779 25.1558 8.27676 25.016C7.69575 24.8989 7.11451 24.7829 6.53333 24.6667C6.53333 18.4187 6.53333 12.1707 6.53333 5.73334C8.67407 5.1217 8.67407 5.1217 9.58072 4.92865C9.68114 4.90668 9.78156 4.88471 9.88503 4.86207C10.1982 4.7936 10.5116 4.72589 10.825 4.65834C11.2409 4.56836 11.6567 4.47782 12.0724 4.38699C12.1723 4.36545 12.2722 4.34392 12.3751 4.32173C12.9095 4.20475 13.4268 4.06663 13.9484 3.90053C14.6667 3.73334 14.625 3.75 16.875 3.375ZM13.8432 5.81928C13.7471 5.842 13.651 5.86473 13.5519 5.88815C13.2429 5.96127 12.9339 6.03479 12.625 6.10834C12.3222 6.18015 12.0194 6.25188 11.7166 6.32357C11.5183 6.37056 11.3201 6.41764 11.1218 6.46482C10.6608 6.57436 10.1996 6.68245 9.7373 6.78614C9.5801 6.82148 9.42289 6.85682 9.26093 6.89324C9.12288 6.92378 8.98483 6.95432 8.8426 6.98578C8.5406 7.03695 8.5406 7.03695 8.39999 7.20001C8.38721 7.4075 8.38374 7.61558 8.38396 7.82346C8.38377 7.95827 8.38359 8.09308 8.3834 8.23198C8.38388 8.38111 8.38436 8.53024 8.38485 8.68389C8.38484 8.83997 8.38482 8.99605 8.3848 9.15685C8.38487 9.58603 8.38554 10.0152 8.38647 10.4444C8.3873 10.8925 8.38738 11.3405 8.38754 11.7886C8.38796 12.6377 8.38905 13.4867 8.39039 14.3357C8.39188 15.3021 8.39261 16.2685 8.39328 17.2348C8.39468 19.2232 8.39702 21.2116 8.39999 23.2C9.26357 23.3716 10.1273 23.5424 10.9911 23.7127C11.285 23.7707 11.5788 23.8289 11.8726 23.8873C12.2949 23.9712 12.7172 24.0544 13.1396 24.1375C13.271 24.1638 13.4024 24.19 13.5378 24.217C13.6605 24.2411 13.7833 24.2651 13.9098 24.2899C14.0714 24.3218 14.0714 24.3218 14.2363 24.3545C14.5711 24.4135 14.5711 24.4135 15.0667 24.4C15.0667 18.196 15.0667 11.992 15.0667 5.60001C14.6471 5.60001 14.2494 5.72217 13.8432 5.81928Z" fill="#0F6EB8"/>
<path d="M18.8 5.60001C20.34 5.60001 21.88 5.60001 23.4667 5.60001C23.4667 11.804 23.4667 18.008 23.4667 24.4C21.9267 24.4 20.3867 24.4 18.8 24.4C18.8 23.784 18.8 23.168 18.8 22.5333C19.724 22.5333 20.648 22.5333 21.6 22.5333C21.6 17.5613 21.6 12.5893 21.6 7.46667C20.676 7.46667 19.752 7.46667 18.8 7.46667C18.8 6.85067 18.8 6.23467 18.8 5.60001Z" fill="#0F6EB8"/>
<path d="M14.1524 15.01C14.1524 15.4242 13.8166 15.76 13.4024 15.76C12.9882 15.76 12.6524 15.4242 12.6524 15.01C12.6524 14.5958 12.9882 14.26 13.4024 14.26C13.8166 14.26 14.1524 14.5958 14.1524 15.01Z" fill="#0F6EB8"/>
</svg>`;


const SVG_CLSDOOR = `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="30" height="30" fill="#DFF0FF" fill-opacity="0.4"/>
<path d="M18.75 5.25C18.75 11.9325 18.75 18.615 18.75 25.5C16.2254 25.2314 13.7432 24.6732 11.25 24.2074C11.25 18.5202 11.25 12.833 11.25 6.9734C12.7686 6.48875 12.7686 6.48875 13.5164 6.32713C13.6792 6.29158 13.842 6.25604 14.0098 6.21941C14.1757 6.18387 14.3416 6.14832 14.5125 6.1117C14.6761 6.07616 14.8397 6.04061 15.0082 6.00399C15.3375 5.93243 15.6669 5.86118 15.9964 5.79025C16.6865 5.64033 17.3753 5.48491 18.064 5.3291C18.45 5.25 18.45 5.25 18.75 5.25Z" fill="#FBFBFB"/>
<path d="M9.90834 26.25C9.90834 18.814 9.98333 11.0197 9.98333 3.35833C11.3067 3.35833 12.389 3.38048 13.6484 3.64062C13.7963 3.66958 13.9442 3.69854 14.0966 3.72838C14.562 3.81993 15.0268 3.91407 15.4917 4.00833C15.8053 4.07048 16.1189 4.13246 16.4326 4.19426C17.1242 4.33093 17.8155 4.4692 18.5066 4.60897C19.0876 4.72612 19.6688 4.84209 20.25 4.95833C20.25 11.2063 20.25 17.4543 20.25 23.8917C18.1093 24.5033 18.1093 24.5033 17.2026 24.6963C17.1022 24.7183 17.0018 24.7403 16.8983 24.7629C16.5851 24.8314 16.2717 24.8991 15.9583 24.9667C15.5424 25.0566 15.1267 25.1472 14.7109 25.238C14.611 25.2595 14.5111 25.2811 14.4082 25.3033C13.8738 25.4202 13.3566 25.5584 12.8349 25.7245C12.1167 25.8917 12.1583 25.875 9.90834 26.25ZM12.9401 23.8057C13.0362 23.783 13.1324 23.7603 13.2314 23.7369C13.5405 23.6637 13.8494 23.5902 14.1583 23.5167C14.4611 23.4448 14.7639 23.3731 15.0667 23.3014C15.265 23.2544 15.4633 23.2074 15.6615 23.1602C16.1225 23.0506 16.5837 22.9426 17.046 22.8389C17.2032 22.8035 17.3604 22.7682 17.5224 22.7318C17.6604 22.7012 17.7985 22.6707 17.9407 22.6392C18.2427 22.588 18.2427 22.588 18.3833 22.425C18.3961 22.2175 18.3996 22.0094 18.3994 21.8015C18.3996 21.6667 18.3997 21.5319 18.3999 21.393C18.3994 21.2439 18.399 21.0948 18.3985 20.9411C18.3985 20.785 18.3985 20.629 18.3985 20.4681C18.3985 20.039 18.3978 19.6098 18.3969 19.1806C18.396 18.7325 18.3959 18.2845 18.3958 17.8364C18.3954 16.9873 18.3943 16.1383 18.3929 15.2893C18.3914 14.3229 18.3907 13.3565 18.39 12.3902C18.3886 10.4018 18.3863 8.41338 18.3833 6.42499C17.5198 6.25339 16.656 6.08257 15.7922 5.9123C15.4983 5.85428 15.2045 5.79607 14.9107 5.73769C14.4885 5.65382 14.0661 5.57059 13.6438 5.48749C13.5123 5.46124 13.3809 5.435 13.2455 5.40795C13.1228 5.38393 13 5.3599 12.8736 5.33515C12.7119 5.30317 12.7119 5.30317 12.547 5.27055C12.2122 5.21151 12.2122 5.21152 11.7167 5.22499C11.7167 11.429 11.7167 17.633 11.7167 24.025C12.1363 24.025 12.5339 23.9028 12.9401 23.8057Z" fill="#0F6EB8"/>
<path d="M17.25 15C17.25 15.4142 16.9142 15.75 16.5 15.75C16.0858 15.75 15.75 15.4142 15.75 15C15.75 14.5858 16.0858 14.25 16.5 14.25C16.9142 14.25 17.25 14.5858 17.25 15Z" fill="#0F6EB8"/>
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
            
            cell.innerHTML = svgContent;
            grid.appendChild(cell);
        });
    });

    // Shuttle Animation Logic
    function createShuttle() {
        const wrapper = document.querySelector('.map-wrapper');
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
        const cellSize = 40;
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
        setTimeout(animateShuttle, 1000);
        shuttle.remove();
    }

    setTimeout(animateShuttle, 2000);
})();


