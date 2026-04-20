// ============================================================
// INBOUND.JS - Optimized
// ============================================================

// ── State ───────────────────────────────────────────────────
let currentMaterialPage = 1;
const materialPageSize = 20;
let materialSearchQuery = '';
let selectedMaterials = [];
let selectSearchQuery = '';
let selectPage = 1;
let createSearchQuery = '';
let createSearchPage = 1;
let selectedStartDate = null;
let selectedEndDate = null;
let currentViewLeft = new Date();
let currentViewRight = new Date();
currentViewRight.setMonth(currentViewRight.getMonth() + 1);
let activeStartDate = null;
let activeEndDate = null;
let activeDateFilterType = 'all'; // 'all' | 'createdAt' | 'expiryDate'
let filterPriorityOnly = false;
let timeSortOrder = null; // null | 'asc' | 'desc'
let openStatusDropdownId = null;
let selectedCreatorId = null;
let selectedDestinationId = '';
let selectedProcessId = null;
let currentTabMode = 'normal';
let mainCurrentPage = 1;
const mainPageSize = 20;
let selectedPage = 1;

// ── Persistence ─────────────────────────────────────────────
const STORAGE_KEY = 'SWS_INBOUND_ORDERS_V4';

function saveInboundOrders() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_INBOUND_ORDERS)); }
    catch (e) { console.error('Error saving to localStorage:', e); }
}

function loadInboundOrders() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved).map(o => {
                if (o.createdAt) o.createdAt = new Date(o.createdAt);
                if (o.completedAt) o.completedAt = new Date(o.completedAt);
                return o;
            });
        }
    } catch (e) { console.error('Error loading from localStorage:', e); }
    return null;
}

// ── Master Data ──────────────────────────────────────────────
const MASTER_MATERIALS_NAMES = [
    'Chuối Trung Quốc/ Chinese bananas - A456 - TROPICAL', 
    'Chuối Trung Quốc/ Chinese bananas - A456 - SOFIA',
    'Chuối Trung Quốc/ Chinese bananas - A456 - FRUIT WHARF',
    'Chuối Trung Quốc/ Chinese bananas - A456 - DASANG',
    'Chuối Trung Quốc/ Chinese bananas - A789 - TROPICAL', 
    'Chuối Trung Quốc/ Chinese bananas - A789 - SOFIA',
    'Chuối Trung Quốc/ Chinese bananas - B456 - TROPICAL',
    'Chuối Trung Quốc/ Chinese bananas - B456 - SOFIA',
    'Chuối Trung Quốc/ Chinese bananas - B789 - TROPICAL', 
    'Chuối Trung Quốc/ Chinese bananas - B789 - SOFIA',
    'Chuối Trung Quốc/ Chinese bananas - CL - DASANG',
    'Chuối Nhật Bản/ Japanese bananas - 26CP - DEL MONTE',
    'Chuối Nhật Bản/ Japanese bananas - 16CP - SEIKA',
    'Chuối Nhật Bản/ Japanese bananas - 38CP - SHIMIZU',
    'Chuối Nhật Bản/ Japanese bananas - B6 - SEIKA 13KG',
    'Chuối Nhật Bản/ Japanese bananas - 40CP - TAITO',
    'Chuối Nhật Bản/ Japanese bananas - 43CP - MAINICHI',
];

const MASTER_MATERIALS = Array.from({ length: 35 }, (_, i) => {
    const fullName = MASTER_MATERIALS_NAMES[i % MASTER_MATERIALS_NAMES.length];
    const codeMatch = fullName.split(' - ');
    const code = codeMatch.length > 1 ? codeMatch.slice(1).join(' - ') : `MAT-${i + 1}`;
    
    return {
        code: code,
        name: fullName,
        specs: `Tiêu chuẩn banana Group ${Math.floor(i / 5) + 1}`,
        unit: 'thùng',
        weight: 13,
        weightPerUnit: 13,
        expiryDate: i % 4 === 0 ? null : `2026-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
        dimensions: {
            length: 400,
            width: 300,
            height: 200
        }
    };
});

const STAFF_LIST = [
    { id: 'ST01', name: 'Nguyễn Văn A', position: 'Quản kho' },
    { id: 'ST02', name: 'Trần Thị B', position: 'Nhân viên vận hành' },
    { id: 'ST03', name: 'Lê Văn C', position: 'Kỹ thuật viên' },
];

const MOCK_PALLET_DATA = {
    'P-001': {
        material: { code: 'A456 - TROPICAL', name: 'Chuối Trung Quốc/ Chinese bananas - A456 - TROPICAL', totalQty: 1000 },
        maxCapacity: 2000,
        history: [{ code: 'P-011_A456-TROP_200_251120', exported: 200, total: 1000, time: '2025-11-20 08:30' }]
    },
    'P-002': {
        material: { code: 'A789 - TROPICAL', name: 'Chuối Nhật Bản/ Japanese bananas - 26CP - DEL MONTE', totalQty: 500 }
    }
};

const MOCK_DESTINATIONS = [
    { id: 'DEST-001', code: 'N01', name: 'Kho Chuối Nhật Bản 01' },
    { id: 'DEST-002', code: 'N02', name: 'Kho Chuối Trung Quốc 01' },
    { id: 'DEST-003', code: 'N03', name: 'Kho Lạnh Phân Loại' },
    { id: 'DEST-004', code: 'N04', name: 'Kho Chuối Quốc Tế A' },
    { id: 'DEST-005', code: 'N05', name: 'Kho Chuối Quốc Tế B' }
];

const MOCK_PROCESS_DATA = [
    { id: 1, code: 'WF-1000', name: 'Quy trình Nhập - Kho Chuối' },
    { id: 2, code: 'WF-1001', name: 'Quy trình Xuất - Kho Chuối' },
    { id: 3, code: 'WF-1002', name: 'Quy trình Kiểm kê - Kho Lạnh' },
    { id: 4, code: 'WF-1003', name: 'Quy trình Phân cấp - Đóng thùng' },
    { id: 5, code: 'WF-1004', name: 'Quy trình Xuất khẩu' },
    { id: 6, code: 'WF-1005', name: 'Quy trình Nhập nội địa' }
];

const MOCK_USER_DATA = {
    'US01': { username: 'user001', fullname: 'Nguyễn Văn An' },
    'US02': { username: 'user002', fullname: 'Trần Thị Bình' },
    'US03': { username: 'user003', fullname: 'Lê Văn Cường' },
    'US04': { username: 'user004', fullname: 'Phạm Minh Dũng' },
    'US05': { username: 'user005', fullname: 'Hoàng Tuấn Em' },
    'US06': { username: 'user006', fullname: 'Vũ Thị Giang' },
    'US07': { username: 'user007', fullname: 'Đặng Ngọc Hải' },
    'US08': { username: 'user008', fullname: 'Bùi Thị Kim' },
    'US09': { username: 'user009', fullname: 'Đỗ Văn Long' },
    'US10': { username: 'user010', fullname: 'Ngô Thị Mai' },
    'US11': { username: 'user011', fullname: 'Dương Văn Nam' },
    'US12': { username: 'user012', fullname: 'Lý Thị Oanh' },
    'US13': { username: 'user013', fullname: 'Vương Văn Phú' },
    'US14': { username: 'user014', fullname: 'Trịnh Thị Quyên' },
    'US15': { username: 'user015', fullname: 'Đinh Văn Rồng' }
};

// ── Shared Batch Initialization (Mirroring batch.js) ──────────
function ensureBatchDataInitialized() {
    const BATCH_STORAGE_KEY = 'SWS_BATCH_DATA_v4';
    if (!localStorage.getItem(BATCH_STORAGE_KEY)) {
        console.log('Inbound: Initializing Batch Master Data...');
        const STAFF_LIST = [
            { id: 'NV001', name: 'Nguyễn Văn An' },
            { id: 'NV002', name: 'Trần Thị Bình' },
            { id: 'NV003', name: 'Lê Văn Cường' },
            { id: 'NV004', name: 'Phạm Minh Dũng' }
        ];
        const statusList = ['NEW', 'CHECKED', 'PROCESSING', 'COMPLETED'];
        const codes = ['CN-BN', 'JP-BN'];
        const productTypes = ['Chuối Trung Quốc/ Chinese bananas', 'Chuối Nhật Bản/ Japanese bananas'];
        
        const mockBatches = Array.from({ length: 50 }, function(_, i) {
            const status = (i < 10) ? 'CHECKED' : statusList[i % 4];
            const typeIndex = i % 2;
            const createdAt = new Date();
            createdAt.setDate(createdAt.getDate() - (i < 30 ? 0 : (i % 30)));
            
            return {
                id: Date.now() + i,
                code: codes[typeIndex] + '-' + String(1060 - i).padStart(4, '0'),
                name: (i < 10 ? 'Lô kiểm tồn - ' : 'Lô ') + productTypes[typeIndex] + ' - Đợt ' + (Math.floor(i / 5) + 1),
                productType: productTypes[typeIndex],
                status: status,
                batchType: (i % 2 === 0) ? 'EXPORT' : 'IMPORT',
                totalQty: (i < 10) ? 1200 : ((status === 'NEW') ? 0 : 500),
                executedQty: (status === 'COMPLETED') ? 500 : 0,
                creator: STAFF_LIST[i % STAFF_LIST.length],
                createdAt: createdAt
            };
        });
        localStorage.setItem(BATCH_STORAGE_KEY, JSON.stringify(mockBatches));
    }
}

// ── Mock Orders ──────────────────────────────────────────────
let MOCK_INBOUND_ORDERS = loadInboundOrders();

// ── FORCE MIGRATION: Clear legacy mechanical data ─────────────
if (MOCK_INBOUND_ORDERS && MOCK_INBOUND_ORDERS.some(o => 
    o.materials?.some(m => m.name.includes('Thép') || m.name.includes('Xi măng') || m.name.includes('Linh kiện'))
)) {
    console.warn('Legacy mechanical data detected in Inbound module. Resetting to Banana Warehouse data...');
    MOCK_INBOUND_ORDERS = null;
    localStorage.removeItem(STORAGE_KEY);
}
// ─────────────────────────────────────────────────────────────

if (!MOCK_INBOUND_ORDERS) {
    MOCK_INBOUND_ORDERS = [
        { id: 1, type: 'NEW', code: 'P-A01-L3_A456-TROPICAL_500_25102025', materials: [{ code: 'A456 - TROPICAL', name: 'Chuối Trung Quốc/ Chinese bananas - A456 - TROPICAL', qty: 500, unit: 'thùng', specs: 'Thùng 13kg tiêu chuẩn', weight: 6500, expiryDate: '2025-10-25' }], batch: { code: 'LOT-2510-01', name: 'Lô hàng Chuối tháng 10 - Đợt 1' }, pallets: ['P-A01-L3'], bin: 'T1-F1-P1-A1', status: 'COMPLETED', priority: true, creator: { id: 'US01', name: 'Nguyễn Văn An' }, createdAt: new Date('2025-10-25T08:30:00'), process: 'Quy trình Nhập - Kho Chuối' },
        { id: 2, type: 'REENTRY', code: 'P-B01-L1_A456-SOFIA_1000_26102025', materials: [{ code: 'A456 - SOFIA', name: 'Chuối Trung Quốc/ Chinese bananas - A456 - SOFIA', qty: 1000, unit: 'thùng', specs: 'Thùng 15kg tiêu chuẩn', weight: 15000, expiryDate: '2025-06-15' }], batch: { code: 'LOT-2510-02', name: 'Lô Sofia 02' }, pallets: ['P-B01-L1'], bin: 'T1-F1-P2-A5', status: 'COMPLETED', priority: false, creator: { id: 'US02', name: 'Trần Thị Bình' }, createdAt: new Date('2025-10-26T09:15:00'), process: 'Quy trình Nhập - Kho Chuối' },
        { id: 3, type: 'TRANSFER', code: 'P-C01-L2_A789-TROPICAL_200_27102025', materials: [{ code: 'A789 - TROPICAL', name: 'Chuối Trung Quốc/ Chinese bananas - A789 - TROPICAL', qty: 200, unit: 'thùng', specs: 'Thùng 13kg tiêu chuẩn', weight: 2600, expiryDate: '2025-12-27' }], batch: { code: 'LOT-2510-03', name: 'Lô TROPICAL' }, pallets: ['P-C01-L2'], bin: 'T2-F3-P1-A2', status: 'PROCESSING', creator: { id: 'US03', name: 'Lê Văn Cường' }, createdAt: new Date('2025-10-27T14:00:00'), process: 'Quy trình Phân cấp - Đóng thùng' },
        { id: 4, type: 'NEW', code: 'P-A05-L1_26CP-DELMONTE_50_05112025', materials: [{ code: '26CP - DEL MONTE', name: 'Chuối Nhật Bản/ Japanese bananas - 26CP - DEL MONTE', qty: 50, unit: 'thùng', specs: 'Thùng 13kg tiêu chuẩn', weight: 650, expiryDate: '2026-03-20' }], pallets: ['P-A05-L1'], bin: 'T1-F8-P3-A2', status: 'COMPLETED', creator: { id: 'US01', name: 'Nguyễn Văn An' }, createdAt: new Date('2025-11-05T10:30:00'), process: 'Quy trình Nhập - Kho Chuối' },
        { id: 5, type: 'NEW', code: 'P-D01-L2_16CP-SEIKA_500_12112025', materials: [{ code: '16CP - SEIKA', name: 'Chuối Nhật Bản/ Japanese bananas - 16CP - SEIKA', qty: 500, unit: 'thùng', specs: 'Thùng 12kg tiêu chuẩn', weight: 6000, expiryDate: '2026-11-12' }], pallets: ['P-D01-L2'], bin: 'T3-F2-P5-A1', status: 'PENDING', creator: { id: 'US04', name: 'Phạm Minh Dũng' }, createdAt: new Date('2025-11-12T16:45:00'), process: 'Quy trình Nhập - Kho Chuối' },
        { id: 31, type: 'NEW', code: 'P-N01-L1_A456-TROPICAL_100_TDAY', materials: [{ code: 'A456 - TROPICAL', name: 'Chuối Trung Quốc/ Chinese bananas - A456 - TROPICAL', qty: 100, unit: 'thùng', specs: 'Thùng 13kg tiêu chuẩn', weight: 1300, expiryDate: '2026-08-15' }], pallets: ['P-N01-L1'], bin: 'T1-F1-P1-A1', status: 'COMPLETED', priority: true, creator: { id: 'US01', name: 'Nguyễn Văn An' }, createdAt: (() => { const d = new Date(); d.setHours(8, 30, 0, 0); return d; })(), process: 'Quy trình Nhập - Kho Chuối' },
        { id: 32, type: 'NEW', code: 'P-N02-L2_A456-SOFIA_200_TDAY', materials: [{ code: 'A456 - SOFIA', name: 'Chuối Trung Quốc/ Chinese bananas - A456 - SOFIA', qty: 200, unit: 'thùng', specs: 'Thùng 15kg tiêu chuẩn', weight: 3000, expiryDate: '2026-10-10' }], pallets: ['P-N02-L2'], bin: 'T1-F2-P2-A2', status: 'PROCESSING', priority: false, creator: { id: 'US02', name: 'Trần Thị Bình' }, createdAt: (() => { const d = new Date(); d.setHours(9, 15, 0, 0); return d; })(), process: 'Quy trình Nhập - Kho Chuối' },
        { id: 33, type: 'NEW', code: 'P-N03-L3_A789-TROPICAL_50_TDAY', materials: [{ code: 'A789 - TROPICAL', name: 'Chuối Trung Quốc/ Chinese bananas - A789 - TROPICAL', qty: 50, unit: 'thùng', specs: 'Thùng 13kg tiêu chuẩn', weight: 650, expiryDate: '2027-01-01' }], pallets: ['P-N03-L3'], bin: 'T1-F3-P3-A3', status: 'PENDING', priority: false, creator: { id: 'US03', name: 'Lê Văn Cường' }, createdAt: (() => { const d = new Date(); d.setHours(14, 45, 0, 0); return d; })(), process: 'Quy trình Nhập - Kho Chuối' }
    ];

    MOCK_INBOUND_ORDERS.forEach((o, i) => {
        if (!o.exportMethod) o.exportMethod = ['FIFO', 'FEFO'][Math.floor(Math.random() * 2)];
        if (!o.completedAt && o.status === 'COMPLETED') {
            const addMinutes = Math.floor(Math.random() * 9) + 1;
            const addSeconds = Math.floor(Math.random() * 60);
            o.completedAt = new Date(o.createdAt.getTime() + addMinutes * 60000 + addSeconds * 1000);
        }
        if (!o.batch) o.batch = { code: 'LOT-GEN', name: 'Lô hàng mặc định' };
    });
    saveInboundOrders();
}

// Ensure all orders have batch (repair for existing data)
MOCK_INBOUND_ORDERS.forEach(o => {
    if (!o.batch) o.batch = { code: 'LOT-GEN', name: 'Lô hàng mặc định' };
});

// ── Utilities ────────────────────────────────────────────────
function formatDateTime(date) {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const mo = String(date.getMonth() + 1).padStart(2, '0');
    return `${h}:${m} - ${d}/${mo}/${date.getFullYear()}`;
}

function formatBinLocation(binInfo) {
    if (!binInfo) return '';
    const parts = binInfo.split('-');
    if (parts.length === 4) {
        const floor = parseInt(parts[0].replace('T', ''));
        const colNum = parseInt(parts[1].replace('F', ''));
        const cell = parseInt(parts[3].replace('A', ''));
        let colLetter = '';
        let temp = colNum;
        while (temp > 0) {
            colLetter = String.fromCharCode(65 + (temp - 1) % 26) + colLetter;
            temp = Math.floor((temp - 1) / 26);
        }

        // Xác định khu vực dựa trên tầng và cột (Demo)
        const zone = colNum <= 5 ? 'A' : (colNum <= 10 ? 'B' : 'C');
        
        return `Kho mát ${zone} - ${floor}-${colLetter}${cell}`;
    }
    return binInfo;
}

// ── Today Data Initialization ────────────────────────────────
function ensureTodayDataInbound() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const hasTodayData = MOCK_INBOUND_ORDERS.some(o => {
        const d = new Date(o.createdAt);
        const nameMatch = o.materials?.some(m => m.name.includes('Thép') || m.name.includes('Xi măng'));
        return d >= today && d < tomorrow && !nameMatch;
    });

    if (!hasTodayData) {
        // If there's today data but it's legacy mechanical data, remove it from the array
        const initialLen = MOCK_INBOUND_ORDERS.length;
        MOCK_INBOUND_ORDERS = MOCK_INBOUND_ORDERS.filter(o => {
            const d = new Date(o.createdAt);
            const isToday = d >= today && d < tomorrow;
            const isLegacy = o.materials?.some(m => m.name.includes('Thép') || m.name.includes('Xi măng'));
            return !(isToday && isLegacy);
        });

        const todayData = [
            { id: Date.now() + 1, code: 'P-T01-A1_A456-TROPICAL_50_T' + today.getTime().toString().slice(-4), materials: [{ code: 'A456 - TROPICAL', name: 'Chuối Trung Quốc/ Chinese bananas - A456 - TROPICAL', qty: 50, unit: 'thùng', specs: 'Thùng 13kg tiêu chuẩn', expiryDate: new Date(today.getFullYear(), today.getMonth() + 6, today.getDate()).toISOString().split('T')[0] }], pallets: ['P-T01-A1'], bin: 'T1-F1-P1-A1', status: 'PENDING', priority: true, type: 'NEW', creator: { id: 'US01', name: 'Nguyễn Văn An' }, createdAt: new Date(today.getTime() + 8 * 3600000 + 30 * 60000) },
            { id: Date.now() + 2, code: 'P-T02-B2_A456-SOFIA_120_T' + today.getTime().toString().slice(-4), materials: [{ code: 'A456 - SOFIA', name: 'Chuối Trung Quốc/ Chinese bananas - A456 - SOFIA', qty: 120, unit: 'thùng', specs: 'Thùng 15kg tiêu chuẩn', expiryDate: new Date(today.getFullYear(), today.getMonth() + 12, today.getDate()).toISOString().split('T')[0] }], pallets: ['P-T02-B2'], bin: 'T2-F3-P1-B2', status: 'PROCESSING', priority: false, type: 'REENTRY', creator: { id: 'US14', name: 'Trịnh Thị Quyên' }, createdAt: new Date(today.getTime() + 10 * 3600000 + 15 * 60000) }
        ];
        MOCK_INBOUND_ORDERS.unshift(...todayData);
        saveInboundOrders();
    }
}

// ── Filter & Data ────────────────────────────────────────────
function getFilteredMainData() {
    const filterStatus = document.getElementById('filter-status')?.value || 'ALL';
    const filterEntryType = document.getElementById('filter-entry-type')?.value || 'ALL';
    const search = (document.getElementById('search-input')?.value || '').toLowerCase();

    let filtered = MOCK_INBOUND_ORDERS.filter(o => {
        if (filterStatus !== 'ALL' && o.status !== filterStatus) return false;
        if (filterEntryType !== 'ALL' && o.type !== filterEntryType) return false;
        if (selectedCreatorId && o.creator.id !== selectedCreatorId) return false;
        if (search) {
            const codeMatch = o.code.toLowerCase().includes(search);
            const materialMatch = o.materials.some(m => m.name.toLowerCase().includes(search) || m.code.toLowerCase().includes(search));
            if (!codeMatch && !materialMatch) return false;
        }
        if (filterPriorityOnly && !o.priority) return false;
        if (activeStartDate && activeEndDate) {
            const s = new Date(activeStartDate).setHours(0, 0, 0, 0);
            const e = new Date(activeEndDate).setHours(23, 59, 59, 999);
            if (activeDateFilterType === 'all') {
                const createMatch = o.createdAt && o.createdAt.getTime() >= s && o.createdAt.getTime() <= e;
                const expiryMatch = o.materials[0]?.expiryDate && (() => { const t = new Date(o.materials[0].expiryDate).getTime(); return t >= s && t <= e; })();
                if (!createMatch && !expiryMatch) return false;
            } else {
                const targetDate = activeDateFilterType === 'createdAt' ? o.createdAt : (o.materials[0]?.expiryDate ? new Date(o.materials[0].expiryDate) : null);
                if (!targetDate || targetDate.getTime() < s || targetDate.getTime() > e) return false;
            }
        }
        return true;
    });

    if (timeSortOrder === 'asc') filtered.sort((a, b) => a.createdAt - b.createdAt);
    else if (timeSortOrder === 'desc') filtered.sort((a, b) => b.createdAt - a.createdAt);

    return filtered;
}

// ── Table Rendering ──────────────────────────────────────────
function renderTableBody() {
    const tbody = document.getElementById('inbound-table-body');
    if (!tbody) return;

    const filtered = getFilteredMainData();
    const totalPages = Math.max(1, Math.ceil(filtered.length / mainPageSize));
    mainCurrentPage = Math.min(Math.max(1, mainCurrentPage), totalPages);

    const startIdx = (mainCurrentPage - 1) * mainPageSize;
    const pageItems = filtered.slice(startIdx, startIdx + mainPageSize);

    const statusConfig = {
        'COMPLETED': { label: 'Hoàn thành', color: '#22C55E' },
        'PROCESSING': { label: 'Đang xử lý', color: '#1c92e1' },
        'PENDING': { label: 'Đang chờ', color: '#64748b' },
        'CANCELLED': { label: 'Lỗi', color: '#991b1b' },
    };
    const entryTypeConfig = {
        'NEW': { label: 'Nhập mới', color: '#3b82f6', bg: '#eff6ff' },
        'REENTRY': { label: 'Nhập lại', color: '#f59e0b', bg: '#fffbeb' },
        // 'TRANSFER': { label: 'Nhập chuyền thẳng', color: '#10b981', bg: '#f0fdf4' }
    };

    const getStatusBadge = (status) => {
        const c = statusConfig[status] || { label: status, color: '#64748b' };
        return `<span style="display:inline-block;width:fit-content;min-width:80px;text-align:center;background:transparent;color:${c.color};border:1px solid ${c.color};padding:4px 8px;border-radius:8px;font-size:13px;font-weight:500;white-space:nowrap;">${c.label}</span>`;
    };
    const getEntryTypeBadge = (type) => {
        const c = entryTypeConfig[type] || { label: type, color: '#64748b', bg: '#f1f5f9' };
        return `<span style="display:inline-block;width:130px;text-align:center;background:${c.bg};color:${c.color};border:1px solid ${c.color}44;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:500;white-space:nowrap;">${c.label}</span>`;
    };

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="11" style="text-align:center;color:#64748b;padding:30px;">Không có Lệnh nhập nào phù hợp</td></tr>`;
    } else {
        tbody.innerHTML = pageItems.map((o, i) => {
            const u = MOCK_USER_DATA[o.creator.id];
            const creatorDisplay = u ? `${u.fullname} (${u.username})` : o.creator.name;
            return `
            <tr>
                <td class="text-center">${startIdx + i + 1}</td>
                <td>
                    <div style="display:flex;align-items:center;gap:6px;">
                        <a href="javascript:void(0)" class="text-link code-link-truncate" title="${o.pallets[0] || o.code}" onclick="openOrderDetailModal('${o.id}')">${o.pallets[0] || o.code}</a>
                        <i class="fa-regular fa-copy btn-copy" onclick="copyToClipboard('${o.pallets[0] || o.code}', this)" title="Sao chép"></i>
                    </div>
                </td>
                <td>
                    <div class="product-list">
                        ${o.materials.map(m => {
                            const master = MASTER_MATERIALS.find(mm => mm.code === m.code);
                            const displayName = master ? master.name : m.name;
                            return `
                            <div class="product-item" style="max-width:100%;overflow:hidden;">
                                <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%;">
                                    <span class="prod-code" style="font-weight:500;color:#0284c7;font-size:13px;">${m.code}</span>
                                </div>
                                <div style="font-weight:600;color:#334155;font-size:14px;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${displayName}</div>
                            </div>`;
                        }).join('')}
                    </div>
                </td>
                <td class="text-center">
                    ${o.materials.map(m => `<div style="font-weight:700;color:#334155;font-size:14px;height:36px;display:flex;align-items:center;justify-content:center;">${m.qty} ${m.unit}</div>`).join('')}
                </td>
                <td>
                    <div class="product-item" style="border-bottom:none;min-height:fit-content;">
                        <div style="font-size:13px;color:#334155;"><span style="font-weight:600;color:#0284c7;">${o.batch ? o.batch.code : 'LOT-GENERAL'}</span></div>
                        <div style="font-size:12px;color:#64748b;margin-top:2px;">${o.batch ? o.batch.name : 'Lô hàng mặc định'}</div>
                    </div>
                </td>
                <td class="text-center">
                    <div class="product-item no-indicator" style="border-bottom:none;min-height:52px;padding:0;display:flex;align-items:center;justify-content:center;text-align:center;">
                        ${(o.status === 'COMPLETED' || o.status === 'PROCESSING') && o.bin ? `
                            <span style="font-size:13px;font-weight:600;color:#0D6BB9;">
                                ${formatBinLocation(o.bin)}
                            </span>
                        ` : `
                            <span style="color:#94a3b8;font-style:italic;font-size:12px;">
                                Đang chờ gán vị trí
                            </span>
                        `}
                    </div>
                </td>
                <td class="text-center">${getEntryTypeBadge(o.type)}</td>
                <td style="text-align:center;">${getStatusBadge(o.status)}</td>
                <td class="text-center">
                    <label class="priority-toggle-switch">
                        <input type="checkbox" ${o.priority ? 'checked' : ''} disabled>
                        <span class="priority-toggle-slider"></span>
                    </label>
                </td>
                <td style="text-align:left;">
                    <div class="product-item" style="border-bottom:none;min-height:fit-content;padding-left:18px;">
                        <div style="font-size:13px;color:#334155;"><span style="font-weight:600;">Thời gian:</span> ${formatDateTime(o.createdAt).replace(' - ', ' ')}</div>
                        <div style="font-size:13px;color:#334155;margin-top:2px;"><span style="font-weight:600;">Người tạo:</span> ${creatorDisplay}</div>
                    </div>
                </td>
                <td class="text-center">
                    <div style="display:flex;align-items:center;justify-content:center;gap:8px;">
                        <button class="btn-icon btn-view" onclick="openOrderDetailModal('${o.id}')" title="Xem chi tiết"><i class="fas fa-eye"></i></button>
                        <button class="btn-icon btn-delete"
                            ${o.status === 'PENDING' ? '' : 'disabled style="opacity:0.3;cursor:not-allowed"'}
                            onclick="deleteInboundOrder('${o.id}')"
                            title="${o.status === 'PENDING' ? 'Xóa' : 'Chỉ có thể xóa lệnh đang chờ'}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>`;
        }).join('');
    }

    const startRange = filtered.length > 0 ? startIdx + 1 : 0;
    const endRange = Math.min(startIdx + mainPageSize, filtered.length);
    const mainInfo = document.getElementById('main-info');
    if (mainInfo) mainInfo.innerText = `Hiển thị ${startRange} - ${endRange} trong ${filtered.length}`;

    renderMainPagination(totalPages, filtered.length);
}

function renderMainPagination(totalPages, totalItems) {
    const container = document.getElementById('main-pagination');
    if (!container) return;
    if (totalItems === 0) { container.innerHTML = ''; return; }

    let html = `<button class="btn-page" ${mainCurrentPage === 1 ? 'disabled' : ''} onclick="goToMainPage(${mainCurrentPage - 1})" style="padding:6px 10px;border:1px solid #e2e8f0;border-radius:6px;background:#fff;cursor:pointer;"><i class="fas fa-chevron-left"></i></button>`;
    for (let i = 1; i <= totalPages; i++) {
        if (i <= 2 || i > totalPages - 2 || (i >= mainCurrentPage - 1 && i <= mainCurrentPage + 1)) {
            const isActive = i === mainCurrentPage;
            html += `<button class="btn-page ${isActive ? 'active' : ''}" onclick="goToMainPage(${i})" style="padding:6px 12px;border:1px solid ${isActive ? '#0D6BB9' : '#e2e8f0'};border-radius:6px;background:#fff;color:${isActive ? '#0D6BB9' : '#334155'};cursor:pointer;font-weight:${isActive ? '600' : '400'};">${i}</button>`;
        } else if (i === 3 && mainCurrentPage > 4) {
            html += `<span style="padding:0 6px;color:#64748b;">...</span>`;
        } else if (i === totalPages - 2 && mainCurrentPage < totalPages - 3) {
            html += `<span style="padding:0 6px;color:#64748b;">...</span>`;
        }
    }
    html += `<button class="btn-page" ${mainCurrentPage === totalPages ? 'disabled' : ''} onclick="goToMainPage(${mainCurrentPage + 1})" style="padding:6px 10px;border:1px solid #e2e8f0;border-radius:6px;background:#fff;cursor:pointer;"><i class="fas fa-chevron-right"></i></button>`;
    container.innerHTML = html;

    const goPageInput = document.getElementById('main-go-page');
    if (goPageInput) goPageInput.value = '';
}

function goToMainPage(page) {
    const filtered = getFilteredMainData();
    const totalPages = Math.max(1, Math.ceil(filtered.length / mainPageSize));
    if (page < 1 || page > totalPages) return;
    mainCurrentPage = page;
    renderTableBody();
}

function goToMainPageFromInput() {
    const page = parseInt(document.getElementById('main-go-page')?.value);
    if (!page || isNaN(page)) return;
    goToMainPage(page);
}

// ── Actions ──────────────────────────────────────────────────
function deleteInboundOrder(id) {
    const order = MOCK_INBOUND_ORDERS.find(o => String(o.id) === String(id) || o.code === id);
    if (!order) return;

    if (order.status !== 'PENDING') {
        showToast('Chỉ có thể xóa các lệnh ở trạng thái "Đang chờ"', 'error');
        return;
    }

    showCustomConfirm(`Bạn có chắc chắn muốn xóa lệnh <span style="color: #1378C0; font-weight: 600;"> ${order.code} </span> không?`, () => {
        const idx = MOCK_INBOUND_ORDERS.findIndex(o => String(o.id) === String(id) || o.code === id);
        if (idx !== -1) {
            MOCK_INBOUND_ORDERS.splice(idx, 1);
            saveInboundOrders();
            renderTableBody();
            showToast('Đã xóa lệnh nhập kho thành công!', 'success');
        }
    });
}

function copyToClipboard(text, el) {
    if (!navigator.clipboard) {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.focus(); ta.select();
        try { document.execCommand('copy'); showCopyPopover(el); } catch (e) { }
        document.body.removeChild(ta);
    } else {
        navigator.clipboard.writeText(text).then(() => showCopyPopover(el));
    }
}

function showCopyPopover(el) {
    if (!el) return;
    document.querySelector('.copy-popover')?.remove();
    const rect = el.getBoundingClientRect();
    const popover = document.createElement('div');
    popover.className = 'copy-popover';
    popover.innerText = 'Copied!';
    document.body.appendChild(popover);
    popover.style.left = (rect.left + rect.width / 2) + 'px';
    popover.style.top = (rect.top - 8) + 'px';
    setTimeout(() => popover.remove(), 1500);
}

// ── Scroll Sync ──────────────────────────────────────────────
function syncTableScroll() {
    const headerScroll = document.getElementById('headerScroll');
    const bodyScroll = document.getElementById('bodyScroll');
    const customScroll = document.getElementById('customScroll');
    if (!bodyScroll || !headerScroll || !customScroll) return;

    customScroll.addEventListener('scroll', () => {
        headerScroll.scrollLeft = customScroll.scrollLeft;
        bodyScroll.scrollLeft = customScroll.scrollLeft;
    });
    bodyScroll.addEventListener('scroll', () => {
        headerScroll.scrollLeft = bodyScroll.scrollLeft;
        customScroll.scrollLeft = bodyScroll.scrollLeft;
    });
}

// ── Sort ─────────────────────────────────────────────────────
function toggleTimeSort() {
    timeSortOrder = timeSortOrder === null ? 'desc' : timeSortOrder === 'desc' ? 'asc' : null;
    const icon = document.getElementById('time-sort-icon');
    if (icon) {
        icon.className = timeSortOrder === null ? 'fas fa-sort' : timeSortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
        icon.style.color = timeSortOrder === null ? '#cbd5e1' : '#334155';
    }
    mainCurrentPage = 1;
    renderTableBody();
}

function togglePriorityFilter() {
    filterPriorityOnly = !filterPriorityOnly;
    const btn = document.getElementById('btn-filter-priority');
    if (btn) btn.classList.toggle('active', filterPriorityOnly);
    mainCurrentPage = 1;
    renderTableBody();
}

// ── Search & Filter ──────────────────────────────────────────
function handleMainSearchKeyup() {
    mainCurrentPage = 1;
    renderTableBody();
}

function selectStatus(value, label) {
    const input = document.getElementById('filter-status');
    if (input) { input.value = value; mainCurrentPage = 1; renderTableBody(); }
    const labelEl = document.getElementById('status-selected-label');
    if (labelEl) labelEl.textContent = label;
    const dropdown = document.getElementById('status-dropdown');
    if (dropdown) {
        dropdown.querySelectorAll('.dropdown-option').forEach(opt => opt.classList.toggle('active', opt.getAttribute('data-value') === value));
        dropdown.classList.remove('open');
        openStatusDropdownId = null;
    }
}

function selectEntryType(val, label) {
    const hidden = document.getElementById('filter-entry-type');
    const display = document.getElementById('entry-type-selected-label');
    if (hidden) hidden.value = val;
    if (display) display.innerText = label;
    document.querySelectorAll('#entry-type-dropdown .dropdown-option').forEach(opt => opt.classList.toggle('active', opt.getAttribute('data-value') === val));
    const dropdown = document.getElementById('entry-type-dropdown');
    if (dropdown) { dropdown.classList.remove('open'); openStatusDropdownId = null; }
    mainCurrentPage = 1;
    renderTableBody();
}

function toggleStatusDropdown(id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (openStatusDropdownId && openStatusDropdownId !== id) {
        document.getElementById(openStatusDropdownId)?.classList.remove('open');
    }
    el.classList.toggle('open');
    openStatusDropdownId = el.classList.contains('open') ? id : null;
}

document.addEventListener('click', function (e) {
    const statusDd = document.getElementById('status-dropdown');
    if (statusDd && !statusDd.contains(e.target)) {
        statusDd.classList.remove('open');
        if (openStatusDropdownId === 'status-dropdown') openStatusDropdownId = null;
    }
    const excelCont = document.getElementById('excel-dropdown-container');
    if (excelCont && !excelCont.contains(e.target)) excelCont.classList.remove('active');
});

function setDateFilterMode(mode) {
    activeDateFilterType = mode;
    document.querySelectorAll('.filter-mode-item').forEach(item => item.classList.remove('active'));
    const targetId = mode === 'all' ? 'mode-all' : mode === 'createdAt' ? 'mode-inbound' : 'mode-expiry';
    document.getElementById(targetId)?.classList.add('active');
}

// ── Creator Combobox ─────────────────────────────────────────
function initCreatorCombobox() {
    renderCreatorOptions();
    document.addEventListener('click', (e) => {
        const wrapper = document.getElementById('creator-combobox-wrapper');
        const dropdown = document.getElementById('creator-combobox-dropdown');
        if (wrapper && !wrapper.contains(e.target)) dropdown?.classList.remove('show');
    });
}

function renderCreatorOptions(filterText = '') {
    const list = document.getElementById('creator-combobox-list');
    if (!list) return;
    const term = filterText.toLowerCase();
    let html = '';
    if (!term || 'tất cả'.includes(term)) {
        html += `<li class="combobox-option ${selectedCreatorId === null ? 'selected' : ''}" onclick="selectCreator(null, 'Tất cả')"><span>Tất cả</span></li>`;
    }
    Object.entries(MOCK_USER_DATA).forEach(([id, u]) => {
        if (!term || `${u.username} ${u.fullname}`.toLowerCase().includes(term)) {
            html += `<li class="combobox-option ${selectedCreatorId === id ? 'selected' : ''}" onclick="selectCreator('${id}', '${u.fullname}')"><span>${u.fullname}</span><span class="sub-text">(${u.username})</span></li>`;
        }
    });
    if (!html) html = `<li class="combobox-option no-results">Không tìm thấy kết quả</li>`;
    list.innerHTML = html;
}

function toggleCreatorCombobox() {
    const dropdown = document.getElementById('creator-combobox-dropdown');
    const arrow = document.querySelector('.combobox-arrow');
    const input = document.getElementById('creator-combobox-input');
    if (!dropdown) return;
    const isShow = dropdown.classList.contains('show');
    if (!isShow) {
        dropdown.classList.add('show');
        arrow?.classList.add('active');
        input?.focus();
        renderCreatorOptions(input?.value.trim() === 'Tất cả' ? '' : input?.value);
    } else {
        dropdown.classList.remove('show');
        arrow?.classList.remove('active');
    }
}

function handleCreatorComboboxSearch(input) {
    const dropdown = document.getElementById('creator-combobox-dropdown');
    if (!dropdown?.classList.contains('show')) {
        dropdown?.classList.add('show');
        document.querySelector('.combobox-arrow')?.classList.add('active');
    }
    renderCreatorOptions(input.value);
}

function selectCreator(id, text) {
    selectedCreatorId = id;
    const input = document.getElementById('creator-combobox-input');
    if (input) input.value = text;
    mainCurrentPage = 1;
    renderTableBody();
    const dropdown = document.getElementById('creator-combobox-dropdown');
    dropdown?.classList.remove('show');
    document.querySelector('.combobox-arrow')?.classList.remove('active');
}

// ── Modal: Create ────────────────────────────────────────────
let selectedBatchForCreate = null;
let currentCreateType = 'NEW';

let tempAddedProducts = [];

function openCreateModal() {
    const modal = document.getElementById('modal-create');
    if (!modal) return;

    // Reset fields
    ['inputPallet', 'inputVatTu', 'inputSoLuong', 'inputExpiry', 'inputBatch'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.value = '';
            el.readOnly = false;
            el.style.backgroundColor = '';
            el.style.cursor = '';
        }
    });

    tempAddedProducts = [];
    renderTempProductsList();

    document.getElementById('inputPriority').checked = false;
    selectedBatchForCreate = null;

    const clearBtn = document.getElementById('clear-batch-btn');
    if (clearBtn) clearBtn.style.display = 'none';

    modal.classList.add('show');
    modal.style.display = 'flex';
    modal.style.opacity = '1';

    const pri = document.getElementById('inputPriority');
    if (pri) pri.checked = false;

    document.getElementById('result-box')?.style.setProperty('display', 'none');
    
    // Clear dynamic states
    const historySection = document.getElementById('pallet-history-section');
    if (historySection) { historySection.style.display = 'none'; document.getElementById('pallet-history-body').innerHTML = ''; }
    
    document.getElementById('pallet-capacity-info').style.display = 'none';
    document.getElementById('material-weight-info').style.display = 'none';
    document.getElementById('total-weight-info').style.display = 'none';

    initPDAFormListeners();
    
    // Auto focus pallet input
    setTimeout(() => {
        const p = document.getElementById('inputPallet');
        if (p) { p.focus(); p.select(); }
    }, 100);
}

// ── Searchable Batch Select Logic ────────────────────────────
function handleBatchSearch(query) {
    const clearBtn = document.getElementById('clear-batch-btn');
    if (clearBtn) {
        clearBtn.style.display = (query && query.length > 0) ? 'flex' : 'none';
    }

    const dropdown = document.getElementById('batch-search-dropdown');
    if (!dropdown) return;

    const term = (query || '').toLowerCase().trim();
    
    let batches = [];
    try {
        const saved = localStorage.getItem('SWS_BATCH_DATA_v4');
        if (saved) batches = JSON.parse(saved);
    } catch (e) { console.error(e); }

    // Filter by status CHECKED (Đã kiểm kê) or NEW (if relevant) and search query
    // In this context, usually we import into a batch that is being processed or newly checked
    const filtered = batches.filter(b => 
        (b.status === 'CHECKED' || b.status === "Đã kiểm kê" || b.status === 'NEW') && 
        (b.code.toLowerCase().includes(term) || b.name.toLowerCase().includes(term))
    );

    if (filtered.length === 0) {
        dropdown.innerHTML = `<div style="padding: 12px; text-align: center; color: #94a3b8; font-size: 13px;">Không tìm thấy lô hàng nào</div>`;
    } else {
        dropdown.innerHTML = filtered.map(b => `
            <div class="batch-option" onclick="selectBatchInModal('${b.id}')" style="padding: 10px 12px; cursor: pointer; border-bottom: 1px solid #f1f5f9; hover: background: #f8fafc;">
                <div style="font-weight: 700; color: #076EB8; font-size: 13px;">${b.code}</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 2px;">${b.name}</div>
            </div>
        `).join('');
    }
    dropdown.style.display = 'block';
}

function selectBatchInModal(id) {
    let batches = [];
    try {
        const saved = localStorage.getItem('SWS_BATCH_DATA_v4');
        if (saved) batches = JSON.parse(saved);
    } catch (e) { }
    
    const batch = batches.find(b => String(b.id) === String(id));
    if (batch) {
        selectedBatchForCreate = batch;
        const input = document.getElementById('inputBatch');
        if (input) input.value = `${batch.code} - ${batch.name}`;
        
        const clearBtn = document.getElementById('clear-batch-btn');
        if (clearBtn) clearBtn.style.display = 'flex';

        validatePDAForm();
    }
    document.getElementById('batch-search-dropdown').style.display = 'none';
}

function clearBatchSelection() {
    selectedBatchForCreate = null;
    const input = document.getElementById('inputBatch');
    if (input) input.value = '';
    
    const clearBtn = document.getElementById('clear-batch-btn');
    if (clearBtn) clearBtn.style.display = 'none';
    
    validatePDAForm();
}

function toggleBatchDropdown() {
    const dropdown = document.getElementById('batch-search-dropdown');
    if (dropdown.style.display === 'none') {
        handleBatchSearch(document.getElementById('inputBatch').value);
    } else {
        dropdown.style.display = 'none';
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const wrapper = document.getElementById('batch-select-wrapper');
    const dropdown = document.getElementById('batch-search-dropdown');
    if (wrapper && dropdown && !wrapper.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});
// ── Multi-Product Management ────────────────────────────────
function addProductToList() {
    const vattu = document.getElementById('inputVatTu')?.value.trim();
    const soluong = document.getElementById('inputSoLuong')?.value;
    const expiry = document.getElementById('inputExpiry')?.value;
    const batch = selectedBatchForCreate;

    if (!vattu) return showToast('Vui lòng nhập/quét mã sản phẩm', 'warning');
    if (!soluong || parseInt(soluong) <= 0) return showToast('Số lượng không hợp lệ', 'warning');
    if (!batch) return showToast('Vui lòng chọn lô hàng', 'warning');
    if (!expiry) return showToast('Vui lòng chọn ngày hết hạn', 'warning');

    const product = {
        code: vattu,
        name: vattu === 'VT-XXX' ? 'Sản phẩm PDA' : vattu, // Simplified name fallback
        qty: parseInt(soluong),
        expiryDate: expiry,
        batch: { id: batch.id, code: batch.code, name: batch.name }
    };

    tempAddedProducts.push(product);
    
    // Clear sub-inputs
    ['inputVatTu', 'inputSoLuong', 'inputExpiry', 'inputBatch'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    selectedBatchForCreate = null;
    document.getElementById('clear-batch-btn').style.display = 'none';

    renderTempProductsList();
    validatePDAForm();
    showToast(`Đã thêm ${vattu} vào danh sách`, 'success');

    // Refocus product input for next item
    setTimeout(() => {
        const vt = document.getElementById('inputVatTu');
        if (vt) { vt.focus(); vt.select(); }
    }, 100);
}

function renderTempProductsList() {
    const container = document.getElementById('temp-products-container');
    const listEl = document.getElementById('temp-products-list');
    const countEl = document.getElementById('temp-products-count');

    if (!container || !listEl || !countEl) return;

    if (tempAddedProducts.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    countEl.textContent = tempAddedProducts.length;

    listEl.innerHTML = `
        <table class="temp-products-table" style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tbody style="display: table-row-group;">
                ${tempAddedProducts.map((p, idx) => `
                    <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.2s;">
                        <td style="padding: 12px 10px; text-align: center; width: 40px; color: #94a3b8; font-weight: 700;">${idx + 1}</td>
                        <td style="padding: 12px 10px; width: 140px;">
                            <div style="font-weight: 700; color: #0f172a;">${p.code}</div>
                        </td>
                        <td style="padding: 12px 10px;">
                            <div style="color: #64748b; font-size: 12px; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${p.name}">
                                ${p.name === p.code ? 'Vật tư nhập khẩu' : p.name}
                            </div>
                        </td>
                        <td style="padding: 12px 10px; width: 80px; text-align: center;">
                            <span style="background: #eff6ff; color: #1d4ed8; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-family: 'Roboto Mono', monospace;">
                                x${p.qty}
                            </span>
                        </td>
                        <td style="padding: 12px 10px; width: 220px;">
                            <div style="display: flex; align-items: flex-start; gap: 8px;">
                                <div style="width: 24px; height: 24px; background: #f0f7ff; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px;">
                                    <i class="fas fa-layer-group" style="font-size: 11px; color: #076EB8;"></i>
                                </div>
                                <div style="display: flex; flex-direction: column; gap: 2px; min-width: 0;">
                                    <div style="font-weight: 700; color: #076EB8; font-size: 13px; line-height: 1.2;">${p.batch.code}</div>
                                    <div style="color: #64748b; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 170px;" title="${p.batch.name}">
                                        ${p.batch.name}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td style="padding: 12px 10px; width: 120px;">
                            <div style="display: flex; align-items: center; gap: 6px; color: #475569;">
                                <i class="fas fa-calendar-check" style="font-size: 10px; color: #076EB8; width: 12px;"></i>
                                <span>${p.expiryDate}</span>
                            </div>
                        </td>
                        <td style="padding: 12px 10px; text-align: right; width: 50px;">
                            <button onclick="removeTempProduct(${idx})" style="width: 28px; height: 28px; border: none; background: #fff1f2; color: #e11d48; border-radius: 6px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-trash-alt" style="font-size: 11px;"></i>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function removeTempProduct(index) {
    tempAddedProducts.splice(index, 1);
    renderTempProductsList();
    validatePDAForm();
}

function closeCreateModal() {
    const modal = document.getElementById('modal-create');
    if (modal) { modal.classList.remove('show'); modal.style.display = 'none'; }
}



// ── Weight Tracking ──────────────────────────────────────────
let currentPalletMaxCapacity = null;
let currentMaterialWeightPerUnit = null;

function handlePalletScan(code) {
    code = (code || '').trim();
    const data = MOCK_PALLET_DATA[code];
    const vatTuInput = document.getElementById('inputVatTu');
    const soLuongInput = document.getElementById('inputSoLuong');
    const historySection = document.getElementById('pallet-history-section');
    const historyBody = document.getElementById('pallet-history-body');
    const capacityInfo = document.getElementById('pallet-capacity-info');
    const capacityText = document.getElementById('pallet-max-capacity-text');
    const isValidPalletCode = code.length >= 3;

    if (isValidPalletCode) {
        let capacity = data?.maxCapacity || null;
        if (!capacity) {
            let hash = 0;
            for (let i = 0; i < code.length; i++) hash = (hash * 31 + code.charCodeAt(i)) & 0xffff;
            capacity = [500, 800, 1000, 1200, 1500, 2000, 2500, 3000][hash % 8];
        }
        currentPalletMaxCapacity = capacity;
        if (capacityInfo && capacityText) { capacityText.textContent = capacity.toLocaleString() + ' kg'; capacityInfo.style.display = 'block'; }
    }

    if (data) {
        const totalExported = data.history.reduce((sum, item) => sum + item.exported, 0);
        const remaining = (data.material?.totalQty || 0) - totalExported;

        if (vatTuInput) {
            vatTuInput.value = data.material.code;
            vatTuInput.readOnly = true;
            vatTuInput.style.backgroundColor = '#f1f5f9';
            vatTuInput.style.cursor = 'not-allowed';
            handleVatTuInput(data.material.code);
        }
        if (soLuongInput) {
            soLuongInput.value = remaining > 0 ? remaining : 0;
            soLuongInput.setAttribute('data-min', remaining);
            if (!soLuongInput.dataset.valListener) {
                soLuongInput.addEventListener('change', function () {
                    const min = parseFloat(this.getAttribute('data-min'));
                    const val = parseFloat(this.value);
                    if (!isNaN(min) && val < min) {
                        showToast('Số lượng không được nhỏ hơn số lượng còn lại của pallet (' + min + ')', 'error');
                        this.value = min; this.style.borderColor = 'red';
                    } else { this.style.borderColor = ''; }
                });
                soLuongInput.dataset.valListener = 'true';
            }
            handleSoLuongInput(soLuongInput.value);
        }
        document.getElementById('btnScanVatTu') && (document.getElementById('btnScanVatTu').disabled = true);

        if (historySection && historyBody) {
            historySection.style.display = 'block';
            historyBody.innerHTML = data.history.map(item => `
                <tr>
                    <td style="padding:10px;border-bottom:1px solid #f1f5f9;">${item.code}</td>
                    <td class="text-center" style="padding:10px;border-bottom:1px solid #f1f5f9;"><span style="color:#3b82f6;font-weight:600;">${item.exported}</span> / <span style="color:#64748b;">${item.total}</span></td>
                    <td style="padding:10px;border-bottom:1px solid #f1f5f9;">${item.time}</td>
                </tr>`).join('');
        }
        currentCreateType = 'REENTRY';
    } else {
        currentCreateType = 'NEW';
        if (!isValidPalletCode) { currentPalletMaxCapacity = null; if (capacityInfo) capacityInfo.style.display = 'none'; }
        if (vatTuInput?.readOnly) { vatTuInput.value = ''; vatTuInput.readOnly = false; vatTuInput.style.backgroundColor = ''; vatTuInput.style.cursor = ''; }
        if (soLuongInput?.readOnly) { soLuongInput.value = ''; soLuongInput.readOnly = false; soLuongInput.style.backgroundColor = ''; }
        const btnScan = document.getElementById('btnScanVatTu');
        if (btnScan) btnScan.disabled = false;
        if (historySection) historySection.style.display = 'none';
    }
}

function handleVatTuInput(code) {
    code = (code || '').trim().toUpperCase();
    const matWeightInfo = document.getElementById('material-weight-info');
    const matWeightText = document.getElementById('material-weight-text');

    if (!code) {
        currentMaterialWeightPerUnit = null;
        if (matWeightInfo) matWeightInfo.style.display = 'none';
        updateTotalWeightDisplay();
        return;
    }

    let mat = MASTER_MATERIALS.find(m => m.code.toUpperCase() === code);
    if (!mat) {
        const numericMatch = code.match(/(\d+)$/);
        if (numericMatch) mat = MASTER_MATERIALS.find(m => m.code.toUpperCase() === 'MAT-' + String(parseInt(numericMatch[1], 10)).padStart(3, '0'));
    }

    if (mat) {
        currentMaterialWeightPerUnit = mat.weightPerUnit || mat.weight || 0;
        if (matWeightInfo && matWeightText) { matWeightText.textContent = currentMaterialWeightPerUnit + ' kg/' + mat.unit; matWeightInfo.style.display = 'block'; }
    } else {
        let hash = 0;
        for (let i = 0; i < code.length; i++) hash = (hash * 31 + code.charCodeAt(i)) & 0xffff;
        const weightOptions = [0.5, 1, 1.5, 2, 2.5, 5, 8, 10, 12, 15, 20, 25, 30, 50];
        const unitOptions = ['kg', 'cái', 'thùng', 'kg', 'cái'];
        currentMaterialWeightPerUnit = weightOptions[hash % weightOptions.length];
        if (matWeightInfo && matWeightText) { matWeightText.textContent = currentMaterialWeightPerUnit + ' kg/' + unitOptions[(hash >> 4) % unitOptions.length]; matWeightInfo.style.display = 'block'; }
    }

    updateTotalWeightDisplay();
    validatePDAForm();
}

function handleSoLuongInput() { updateTotalWeightDisplay(); }

function updateTotalWeightDisplay() {
    const totalWeightInfo = document.getElementById('total-weight-info');
    const totalWeightText = document.getElementById('total-weight-text');
    const soLuongInput = document.getElementById('inputSoLuong');
    if (!totalWeightInfo || !totalWeightText) return;

    const qty = parseFloat(soLuongInput?.value) || 0;
    if (!currentMaterialWeightPerUnit || !qty) { totalWeightInfo.style.display = 'none'; return; }

    const totalWeight = currentMaterialWeightPerUnit * qty;
    totalWeightText.textContent = `${totalWeight.toLocaleString()} kg`;
    totalWeightInfo.style.display = 'block';

    if (currentPalletMaxCapacity && totalWeight > currentPalletMaxCapacity) {
        Object.assign(totalWeightInfo.style, { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' });
        if (soLuongInput) soLuongInput.style.borderColor = '#ef4444';
        totalWeightText.innerHTML = `${totalWeight.toLocaleString()} kg <span style="font-size:11px;margin-left:6px;">⚠️ Vượt sức chứa (${currentPalletMaxCapacity.toLocaleString()} kg)</span>`;
    } else {
        Object.assign(totalWeightInfo.style, { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#22C55E' });
        if (soLuongInput) soLuongInput.style.borderColor = '';
    }
}



// ── Confirm Modal ─────────────────────────────────────────────
function showCustomConfirm(message, onConfirm) {
    let modal = document.getElementById('js-inbound-confirm');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'js-inbound-confirm';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.6);display:none;justify-content:center;align-items:center;z-index:999999;font-family:sans-serif;';
        modal.innerHTML = `
            <div style="max-width:750px; width:90%; text-align:center; background:white; border-radius:12px; padding:30px 24px; box-shadow:0 20px 50px rgba(0,0,0,0.3); position:relative;">
                <div style="width:60px; height:60px; background:#fef2f2; color:#dc2626; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 20px; font-size:30px;">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3 style="margin-bottom:12px; font-size:18px; color:#1e293b; margin-top:0;">Xác nhận xóa</h3>
                <p id="js-confirm-msg" style="color:#64748b; font-size:14px; margin-bottom:24px; line-height:1.5;">${message}</p>
                <div style="display:flex; justify-content:center; gap:12px;">
                    <button id="js-confirm-cancel" style="width:100px; padding:10px; border:1px solid #e2e8f0; border-radius:6px; cursor:pointer; background:white; color:#475569; font-weight:500;">Hủy</button>
                    <button id="js-confirm-ok" style="background:#dc2626; border:none; width:100px; color:white; border-radius:6px; cursor:pointer; font-weight:500; padding:10px;">Xác nhận</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    const msgEl = modal.querySelector('#js-confirm-msg');
    const okBtn = modal.querySelector('#js-confirm-ok');
    const cancelBtn = modal.querySelector('#js-confirm-cancel');
    
    if (msgEl) msgEl.innerHTML = message;
    modal.style.display = 'flex';
    
    okBtn.onclick = () => {
        modal.style.display = 'none';
        if (onConfirm) onConfirm();
    };
    
    cancelBtn.onclick = () => {
        modal.style.display = 'none';
    };
}

function closeCustomConfirm() { document.getElementById('js-inbound-confirm')?.style.setProperty('display', 'none'); }

// ── PDA Form Validation ──────────────────────────────────────
function validatePDAForm() {
    const pallet = document.getElementById('inputPallet')?.value.trim();
    const btn = document.getElementById('btnNext');
    if (!btn) return;

    // Is current set of inputs valid to add? (for UI feedback on add button if needed)
    // But validation for Confirm button: Must have Pallet and at least one item in tempProducts
    const hasPallet = !!pallet;
    const hasItems = tempAddedProducts.length > 0;
    const isValid = hasPallet && hasItems;
    
    if (btn) btn.disabled = !isValid;
    
    const btnContinue = document.getElementById('btnContinue');
    if (btnContinue) btnContinue.disabled = !isValid;
}

function initPDAFormListeners() {
    ['inputPallet', 'inputVatTu', 'inputSoLuong', 'inputBatch'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', validatePDAForm);
    });
    const slInput = document.getElementById('inputSoLuong');
    if (slInput && !slInput.dataset.initDone) {
        slInput.addEventListener('input', function (e) {
            let val = e.target.value.replace(/[^0-9]/g, '');
            if (val.length > 1) val = val.replace(/^0+/, '') || '0';
            e.target.value = val;
            validatePDAForm();
        });
        slInput.addEventListener('keydown', function (e) {
            if (['.', '-', 'e', 'E'].includes(e.key)) e.preventDefault();
        });
        slInput.dataset.initDone = 'true';
    }
}

function generateReceipt(shouldStay = false) {
    const pallet = document.getElementById('inputPallet')?.value.trim() || 'P-XXX';
    
    if (tempAddedProducts.length === 0) return alert('Vui lòng thêm sản phẩm vào danh sách');

    const now = new Date();
    // Use first product info for order code generation or generic
    const firstP = tempAddedProducts[0];
    const dateStr = String(now.getDate()).padStart(2, '0') + String(now.getMonth() + 1).padStart(2, '0') + now.getFullYear();
    const code = `${pallet}_MIX_${dateStr}`;

    // Map temp products to materials array
    const materials = tempAddedProducts.map(p => ({
        code: p.code,
        name: p.name,
        qty: p.qty,
        unit: 'Cái',
        expiryDate: p.expiryDate,
        batch: p.batch
    }));

    const newOrder = {
        id: Date.now(), 
        code,
        supplier: 'PDA Import', 
        status: 'PENDING',
        priority: document.getElementById('inputPriority')?.checked || false,
        type: currentCreateType,
        creator: { id: 'US_PDA', name: 'admin' },
        createdAt: now, 
        pallets: [pallet],
        materials: materials,
        batch: tempAddedProducts[0].batch, // Primary batch reference
        process: 'Quy trình mặc định', 
        bin: ''
    };

    MOCK_INBOUND_ORDERS.unshift(newOrder);
    saveInboundOrders();

    if (shouldStay) {
        // Clear all except pallet if they want to reuse pallet? 
        // Actually usually they want a new pallet.
        openCreateModal(); // Reset everything
        showToast('Đã tạo lệnh nhập kho thành công cho pallet này.', 'success');
        
        // Refocus for next entry
        setTimeout(() => document.getElementById('inputPallet')?.focus(), 100);
    } else {
        closeCreateModal();
        showToast('Thêm lệnh nhập kho thành công!', 'success');
    }
    
    if (typeof renderTableBody === 'function') renderTableBody();
}

// ── Print ────────────────────────────────────────────────────
function printInboundOrder(orderId) {
    const order = MOCK_INBOUND_ORDERS.find(o => o.id == orderId || o.code === orderId);
    if (!order) return alert('Không tìm thấy Lệnh nhập');

    const printWindow = window.open('', '_blank');
    let htmlContent = `<html><head><title>In QR Code mã Lệnh - ${order.code}</title><style>body{font-family:'Times New Roman',serif;padding:20px;}.label-container{width:600px;border:1px solid #000;margin-bottom:20px;page-break-inside:avoid;}table{width:100%;border-collapse:collapse;}td,th{border:1px solid #000;padding:5px 8px;vertical-align:middle;font-size:14px;}.label-header{font-weight:bold;width:120px;white-space:nowrap;}.qr-cell{text-align:center;vertical-align:middle;padding:10px;}@media print{@page{margin:0;}body{margin:1cm;}}</style></head><body>`;

    order.materials.forEach(m => {
        const dims = m.dimensions || { length: 50, width: 30, height: 10 };
        const weight = m.weight || 5000;
        const expiry = m.expiryDate ? new Date(m.expiryDate).toLocaleDateString('en-GB') : '-';
        const qrData = encodeURIComponent(`${order.code}|${m.code}`);
        htmlContent += `<div class="label-container"><table>
            <tr><td class="label-header">Mã Lệnh nhập</td><td><b>${order.pallets[0]}</b></td><td class="label-header">Tên Lệnh nhập</td><td>-</td></tr>
            <tr><td class="label-header">Mã sản phẩm</td><td><b>${m.code}</b></td><td rowspan="7" colspan="2" class="qr-cell"><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}" width="120" height="120"></td></tr>
            <tr><td class="label-header">Tên sản phẩm</td><td>${m.name}</td></tr>
            <tr><td class="label-header">Trọng lượng</td><td>${weight}kg</td></tr>
            <tr><td class="label-header">HSD</td><td>${expiry}</td></tr>
            <tr><td class="label-header">Dài (cm)</td><td>${dims.length}</td></tr>
            <tr><td class="label-header">Rộng (cm)</td><td>${dims.width}</td></tr>
            <tr><td class="label-header">Cao (cm)</td><td>${dims.height}</td></tr>
        </table></div>`;
    });

    htmlContent += `</body></html>`;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
}

// ── Date Range Picker ────────────────────────────────────────
function initDefaultDateRange() {
    const today = new Date();
    activeStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    activeEndDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    selectedStartDate = new Date(activeStartDate);
    selectedEndDate = new Date(activeEndDate);

    const fmt = d => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    const display = document.getElementById('dateRangeDisplay');
    if (display) display.textContent = fmt(activeStartDate) + ' - ' + fmt(activeEndDate);

    setTimeout(() => {
        document.querySelectorAll('.sidebar-item[data-range]').forEach(i => {
            i.classList.toggle('active', i.getAttribute('data-range') === 'today');
        });
    }, 100);
}

function initDatePicker() {
    const trigger = document.getElementById('dateRangeTrigger');
    const picker = document.getElementById('analyticsPicker');
    const applyBtn = document.getElementById('applyPicker');
    const cancelBtn = document.getElementById('cancelPicker');
    const clearBtn = document.getElementById('clearPicker');
    const rangeItems = document.querySelectorAll('.sidebar-item[data-range]');
    if (!trigger || !picker) return;

    const fmt = d => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

    trigger.onclick = e => {
        e.stopPropagation();
        picker.classList.toggle('active');
        if (picker.classList.contains('active')) { initPickerDropdowns(); renderCalendars(); }
    };
    picker.onclick = e => e.stopPropagation();

    applyBtn?.addEventListener('click', () => {
        if (selectedStartDate && selectedEndDate) {
            activeStartDate = selectedStartDate;
            activeEndDate = selectedEndDate;
            document.getElementById('dateRangeDisplay').textContent = fmt(activeStartDate) + ' - ' + fmt(activeEndDate);
            picker.classList.remove('active');
            mainCurrentPage = 1;
            renderTableBody();
        } else if (!selectedStartDate && !selectedEndDate) {
            // Case "All" (Tất cả)
            activeStartDate = null;
            activeEndDate = null;
            document.getElementById('dateRangeDisplay').textContent = 'Tất cả thời gian';
            picker.classList.remove('active');
            mainCurrentPage = 1;
            renderTableBody();
        }
    });

    cancelBtn?.addEventListener('click', () => {
        selectedStartDate = activeStartDate;
        selectedEndDate = activeEndDate;
        picker.classList.remove('active');
    });

    clearBtn?.addEventListener('click', () => {
        selectedStartDate = null; selectedEndDate = null; activeEndDate = null;
        document.getElementById('dateRangeDisplay').textContent = 'dd/mm/yyyy - dd/mm/yyyy';
        rangeItems.forEach(i => i.classList.remove('active'));
        renderCalendars();
        mainCurrentPage = 1;
        renderTableBody();
    });

    rangeItems.forEach(item => {
        item.onclick = e => {
            e.stopPropagation();
            rangeItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const range = item.getAttribute('data-range');
            const today = new Date();
            let start = new Date(), end = new Date();
            switch (range) {
                case 'all': start = null; end = null; break;
                case 'today': start = today; end = today; break;
                case 'last3': start.setDate(today.getDate() - 3); break;
                case 'thisweek': { const dow = today.getDay(); start.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1)); break; }
                case 'last7': start.setDate(today.getDate() - 7); break;
                case 'last30': start.setDate(today.getDate() - 30); break;
                case 'last3mo': start.setMonth(today.getMonth() - 3); break;
                case 'last6mo': start.setMonth(today.getMonth() - 6); break;
                case 'last1yr': start.setFullYear(today.getFullYear() - 1); break;
            }
            selectedStartDate = start; selectedEndDate = end;
            if (start && end) {
                currentViewLeft = new Date(start); currentViewRight = new Date(end);
                if (currentViewLeft.getMonth() === currentViewRight.getMonth() && currentViewLeft.getFullYear() === currentViewRight.getFullYear()) {
                    currentViewRight.setMonth(currentViewRight.getMonth() + 1);
                }
            }
            renderCalendars(); updateTempDisplay();
        };
    });

    document.addEventListener('click', e => {
        if (!picker.contains(e.target) && !trigger.contains(e.target)) picker.classList.remove('active');
    });
}

function initPickerDropdowns() {
    const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    const shortMonths = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 8 }, (_, i) => currentYear - 5 + i);

    const populate = (listId, selectedId, opts, isMonth, isLeft) => {
        const listEl = document.getElementById(listId);
        const selectedEl = document.getElementById(selectedId);
        if (!listEl || !selectedEl) return;
        listEl.innerHTML = opts.map((opt, idx) => `<div class="dropdown-item" data-value="${isMonth ? idx : opt}">${opt}</div>`).join('');
        listEl.querySelectorAll('.dropdown-item').forEach(item => {
            item.onclick = e => {
                e.stopPropagation();
                const val = parseInt(item.getAttribute('data-value'));
                if (isMonth) { if (isLeft) currentViewLeft.setMonth(val); else currentViewRight.setMonth(val); selectedEl.textContent = months[val]; }
                else { if (isLeft) currentViewLeft.setFullYear(val); else currentViewRight.setFullYear(val); selectedEl.textContent = val; }
                listEl.parentElement.classList.remove('active');
                renderCalendars();
            };
        });
    };

    populate('leftMonthList', 'leftMonthSelected', shortMonths, true, true);
    populate('rightMonthList', 'rightMonthSelected', shortMonths, true, false);
    populate('leftYearList', 'leftYearSelected', years, false, true);
    populate('rightYearList', 'rightYearSelected', years, false, false);

    ['leftMonthList', 'rightMonthList'].forEach(id => document.getElementById(id)?.classList.add('month-grid'));
    ['leftYearList', 'rightYearList'].forEach(id => document.getElementById(id)?.classList.add('year-grid'));

    document.getElementById('leftMonthSelected').textContent = months[currentViewLeft.getMonth()];
    document.getElementById('leftYearSelected').textContent = currentViewLeft.getFullYear();
    document.getElementById('rightMonthSelected').textContent = months[currentViewRight.getMonth()];
    document.getElementById('rightYearSelected').textContent = currentViewRight.getFullYear();

    ['leftMonthDropdown', 'leftYearDropdown', 'rightMonthDropdown', 'rightYearDropdown'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.onclick = e => {
            e.stopPropagation();
            const isActive = el.classList.contains('active');
            document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('active'));
            if (!isActive) el.classList.add('active');
        };
    });
}

function renderCalendars() {
    const leftContainer = document.querySelector('#leftCalendar .days-container');
    const rightContainer = document.querySelector('#rightCalendar .days-container');
    if (!leftContainer || !rightContainer) return;

    const render = (container, viewDate) => {
        container.innerHTML = '';
        const year = viewDate.getFullYear(), month = viewDate.getMonth();
        const firstDayRaw = new Date(year, month, 1).getDay();
        const firstDay = firstDayRaw === 0 ? 6 : firstDayRaw - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        for (let i = 0; i < firstDay; i++) container.insertAdjacentHTML('beforeend', '<div class="calendar-day empty"></div>');
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            let cls = 'calendar-day';
            if (selectedStartDate && date.toDateString() === selectedStartDate.toDateString()) cls += ' selected range-start';
            if (selectedEndDate && date.toDateString() === selectedEndDate.toDateString()) cls += ' selected range-end';
            if (selectedStartDate && selectedEndDate && date > selectedStartDate && date < selectedEndDate) cls += ' in-range';
            if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) cls += ' today';
            const dayEl = document.createElement('div');
            dayEl.className = cls; dayEl.textContent = d;
            dayEl.onclick = e => { e.stopPropagation(); handleDateClick(date); };
            container.appendChild(dayEl);
        }
    };

    render(leftContainer, currentViewLeft);
    render(rightContainer, currentViewRight);
    updateTempDisplay();
}

function handleDateClick(date) {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
        selectedStartDate = date; selectedEndDate = null;
    } else if (date < selectedStartDate) {
        selectedEndDate = selectedStartDate; selectedStartDate = date;
    } else {
        selectedEndDate = date;
    }
    renderCalendars();
}

function updateTempDisplay() {
    const el = document.getElementById('tempRangeDisplay');
    if (!el) return;
    const fmt = d => d ? d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }) : '...';
    el.textContent = fmt(selectedStartDate) + ' — ' + fmt(selectedEndDate);
}

// ── PDA Custom Calendar ──────────────────────────────────────
let pdaCalCurrentMonth = new Date().getMonth();
let pdaCalCurrentYear = new Date().getFullYear();
let pdaSelectedDate = null;
let tempCalSelectedDate = null;

function setExpiryDate(date) {
    const input = document.getElementById('inputExpiry');
    if (input) {
        input.value = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        pdaSelectedDate = new Date(date);
    }
    validatePDAForm();
}

function addQuickDays(days) {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + days);
    pdaCalCurrentMonth = d.getMonth(); pdaCalCurrentYear = d.getFullYear(); tempCalSelectedDate = new Date(d);
    renderPdaCalendar();
    document.querySelectorAll('.pda-cal-option').forEach(opt => opt.classList.toggle('active', opt.textContent.includes(days + ' Ngày')));
}

function addQuickYears(years) {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setFullYear(d.getFullYear() + years);
    pdaCalCurrentMonth = d.getMonth(); pdaCalCurrentYear = d.getFullYear(); tempCalSelectedDate = new Date(d);
    renderPdaCalendar();
    document.querySelectorAll('.pda-cal-option').forEach(opt => opt.classList.toggle('active', opt.textContent.includes(years + ' Năm')));
}

function togglePdaCalendar() {
    const dropdown = document.getElementById('pda-calendar-dropdown');
    if (!dropdown) return;
    if (dropdown.classList.contains('active')) {
        closePdaCalendar();
    } else {
        tempCalSelectedDate = pdaSelectedDate ? new Date(pdaSelectedDate) : null;
        pdaCalCurrentMonth = (tempCalSelectedDate || new Date()).getMonth();
        pdaCalCurrentYear = (tempCalSelectedDate || new Date()).getFullYear();
        document.querySelectorAll('.pda-cal-option').forEach(opt => opt.classList.remove('active'));
        dropdown.classList.add('active');
        renderPdaCalendar();
    }
}

function closePdaCalendar() { document.getElementById('pda-calendar-dropdown')?.classList.remove('active'); }
function pdaCalPrevMonth() { pdaCalCurrentMonth--; if (pdaCalCurrentMonth < 0) { pdaCalCurrentMonth = 11; pdaCalCurrentYear--; } renderPdaCalendar(); }
function pdaCalNextMonth() { pdaCalCurrentMonth++; if (pdaCalCurrentMonth > 11) { pdaCalCurrentMonth = 0; pdaCalCurrentYear++; } renderPdaCalendar(); }

function renderPdaCalendar() {
    const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    const shortMonths = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];

    const monthDropdown = document.getElementById('pdaMonthDropdown');
    const monthSelected = document.getElementById('pdaMonthSelected');
    const monthList = document.getElementById('pdaMonthList');
    const yearDropdown = document.getElementById('pdaYearDropdown');
    const yearSelected = document.getElementById('pdaYearSelected');
    const yearList = document.getElementById('pdaYearList');

    if (monthList && monthList.children.length === 0) {
        monthList.innerHTML = shortMonths.map((m, i) => `<div class="dropdown-item" data-value="${i}">${m}</div>`).join('');
        monthList.querySelectorAll('.dropdown-item').forEach(item => {
            item.onclick = e => { e.stopPropagation(); pdaCalCurrentMonth = parseInt(item.getAttribute('data-value')); renderPdaCalendar(); monthDropdown.classList.remove('active'); };
        });
    }

    if (yearList) {
        yearList.innerHTML = '';
        for (let y = pdaCalCurrentYear - 5; y <= pdaCalCurrentYear + 6; y++) {
            const item = document.createElement('div');
            item.className = 'dropdown-item'; item.setAttribute('data-value', y); item.textContent = y;
            if (y === pdaCalCurrentYear) item.classList.add('selected');
            item.onclick = e => { e.stopPropagation(); pdaCalCurrentYear = parseInt(item.getAttribute('data-value')); renderPdaCalendar(); yearDropdown.classList.remove('active'); };
            yearList.appendChild(item);
        }
    }

    if (monthSelected) monthSelected.textContent = monthNames[pdaCalCurrentMonth];
    if (yearSelected) yearSelected.textContent = pdaCalCurrentYear;
    monthList?.querySelectorAll('.dropdown-item').forEach(i => i.classList.toggle('selected', parseInt(i.getAttribute('data-value')) === pdaCalCurrentMonth));

    if (monthDropdown && !monthDropdown.hasAttribute('data-init')) {
        monthDropdown.setAttribute('data-init', 'true');
        monthDropdown.onclick = e => { e.stopPropagation(); const isActive = monthDropdown.classList.contains('active'); yearDropdown?.classList.remove('active'); monthDropdown.classList.toggle('active', !isActive); };
    }
    if (yearDropdown && !yearDropdown.hasAttribute('data-init')) {
        yearDropdown.setAttribute('data-init', 'true');
        yearDropdown.onclick = e => { e.stopPropagation(); const isActive = yearDropdown.classList.contains('active'); monthDropdown?.classList.remove('active'); yearDropdown.classList.toggle('active', !isActive); };
    }

    const daysContainer = document.getElementById('pda-cal-days');
    if (!daysContainer) return;
    daysContainer.innerHTML = '';

    const firstDay = new Date(pdaCalCurrentYear, pdaCalCurrentMonth, 1);
    const lastDay = new Date(pdaCalCurrentYear, pdaCalCurrentMonth + 1, 0);
    const startDayOfWeek = (firstDay.getDay() + 6) % 7;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const prevMonthLastDay = new Date(pdaCalCurrentYear, pdaCalCurrentMonth, 0).getDate();

    for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'pda-cal-day other-month'; btn.textContent = prevMonthLastDay - i;
        const d = new Date(pdaCalCurrentYear, pdaCalCurrentMonth - 1, prevMonthLastDay - i);
        btn.onclick = () => { tempCalSelectedDate = new Date(d); renderPdaCalendar(); };
        daysContainer.appendChild(btn);
    }
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'pda-cal-day'; btn.textContent = day;
        const d = new Date(pdaCalCurrentYear, pdaCalCurrentMonth, day);
        if (d.getTime() === today.getTime()) btn.classList.add('today');
        if (tempCalSelectedDate && d.getTime() === tempCalSelectedDate.getTime()) btn.classList.add('selected');
        btn.onclick = () => { tempCalSelectedDate = new Date(d); document.querySelectorAll('.pda-cal-option').forEach(opt => opt.classList.remove('active')); renderPdaCalendar(); };
        daysContainer.appendChild(btn);
    }
    const remaining = 42 - daysContainer.children.length;
    for (let i = 1; i <= remaining; i++) {
        const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'pda-cal-day other-month'; btn.textContent = i;
        const d = new Date(pdaCalCurrentYear, pdaCalCurrentMonth + 1, i);
        btn.onclick = () => { tempCalSelectedDate = new Date(d); renderPdaCalendar(); };
        daysContainer.appendChild(btn);
    }
}

function pdaCalApply() { if (tempCalSelectedDate) setExpiryDate(tempCalSelectedDate); closePdaCalendar(); }

document.addEventListener('click', function (e) {
    const wrapper = document.querySelector('.pda-datepicker-wrapper');
    const dropdown = document.getElementById('pda-calendar-dropdown');
    if (wrapper && dropdown && !wrapper.contains(e.target)) dropdown.classList.remove('active');
});

// ── QR Scanner ────────────────────────────────────────────────
let html5QrCode = null;
let currentScanField = '';

function openQRScanner(fieldId) {
    currentScanField = fieldId;
    const overlay = document.getElementById('qr-scanner-overlay');
    if (overlay) { overlay.classList.add('active'); overlay.style.display = 'flex'; }
    switchScannerTab('camera');
    if (!html5QrCode) html5QrCode = new Html5Qrcode('qr-reader');

    html5QrCode.start({ facingMode: 'environment' }, { fps: 15, qrbox: { width: 250, height: 250 } },
        decodedText => {
            const targetField = document.getElementById(currentScanField);
            if (targetField) targetField.value = decodedText;
            closeQRScanner();
            if (currentScanField === 'inputPallet') handlePalletScan(decodedText);
            else if (currentScanField === 'inputVatTu') handleVatTuInput(decodedText);
            validatePDAForm();
            setTimeout(() => {
                const nextId = currentScanField === 'inputPallet' ? 'inputVatTu' : currentScanField === 'inputVatTu' ? 'inputSoLuong' : null;
                const nextField = nextId && document.getElementById(nextId);
                if (nextField) { nextField.focus(); if (nextId === 'inputSoLuong') nextField.select(); }
            }, 100);
        },
        () => { }
    ).catch(() => switchScannerTab('upload'));
}

function closeQRScanner() {
    const overlay = document.getElementById('qr-scanner-overlay');
    if (overlay) { overlay.classList.remove('active'); overlay.style.display = 'none'; }
    if (html5QrCode?.isScanning) html5QrCode.stop().catch(() => { });
    switchScannerTab('camera');
    const fileInput = document.getElementById('qr-file-input');
    if (fileInput) fileInput.value = '';
}

function switchScannerTab(tab) {
    const cameraTab = document.getElementById('tab-camera');
    const uploadTab = document.getElementById('tab-upload');
    const cameraView = document.getElementById('scanner-camera-view');
    const uploadView = document.getElementById('scanner-upload-view');
    if (tab === 'camera') {
        cameraTab?.classList.add('active'); uploadTab?.classList.remove('active');
        if (cameraView) cameraView.style.display = 'block'; if (uploadView) uploadView.style.display = 'none';
    } else {
        cameraTab?.classList.remove('active'); uploadTab?.classList.add('active');
        if (cameraView) cameraView.style.display = 'none'; if (uploadView) uploadView.style.display = 'block';
        if (html5QrCode?.isScanning) html5QrCode.stop().catch(() => { });
    }
}

function scanImageFile(input) {
    if (!input.files?.[0]) return;
    if (!html5QrCode) html5QrCode = new Html5Qrcode('qr-reader');
    if (!window._savedAlert) { window._savedAlert = window.alert; window.alert = () => { }; }

    html5QrCode.scanFile(input.files[0], true)
        .then(decodedText => {
            if (window._savedAlert) { window.alert = window._savedAlert; delete window._savedAlert; }
            const targetField = document.getElementById(currentScanField);
            if (targetField) targetField.value = decodedText;
            closeQRScanner();
            if (currentScanField === 'inputPallet') handlePalletScan(decodedText);
            else if (currentScanField === 'inputVatTu') handleVatTuInput(decodedText);
            validatePDAForm();
            setTimeout(() => {
                const nextId = currentScanField === 'inputPallet' ? 'inputVatTu' : currentScanField === 'inputVatTu' ? 'inputSoLuong' : null;
                const nextField = nextId && document.getElementById(nextId);
                if (nextField) { nextField.focus(); if (nextId === 'inputSoLuong') nextField.select(); }
            }, 100);
        })
        .catch(() => { if (window._savedAlert) { window.alert = window._savedAlert; delete window._savedAlert; } input.value = ''; });
}

// ── Process Combobox ─────────────────────────────────────────
function initProcessCombobox() {
    renderProcessOptions();
    document.addEventListener('click', e => {
        const wrapper = document.getElementById('inputProcess')?.closest('.pda-input-box');
        const dropdown = document.getElementById('process-combobox-list');
        if (wrapper && dropdown && !wrapper.contains(e.target) && dropdown.style.display === 'block') dropdown.style.display = 'none';
    });
}

function renderProcessOptions(filterText = '') {
    const list = document.getElementById('process-combobox-list');
    if (!list) return;
    const term = filterText.toLowerCase();
    const filtered = MOCK_PROCESS_DATA.filter(p => !term || p.name.toLowerCase().includes(term) || p.code.toLowerCase().includes(term));
    list.innerHTML = filtered.length === 0
        ? `<div class="combobox-option no-results" style="padding:10px;color:#64748b;text-align:center;">Không tìm thấy kết quả</div>`
        : `<ul class="combobox-list" style="list-style:none;padding:0;margin:0;">${filtered.map(p => `<li class="combobox-option ${selectedProcessId == p.id ? 'selected' : ''}" onclick="selectProcess('${p.id}', '${p.name}')" style="padding:10px 12px;cursor:pointer;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;gap:8px;"><span style="font-size:11px;color:#64748b;font-weight:600;min-width:60px;">${p.code}</span><span style="font-weight:500;color:#334155;">${p.name}</span></li>`).join('')}</ul>`;
}

function toggleProcessCombobox() {
    const list = document.getElementById('process-combobox-list');
    if (list) { list.style.display = list.style.display === 'block' ? 'none' : 'block'; if (list.style.display === 'block') renderProcessOptions(document.getElementById('inputProcess')?.value); }
}

function handleProcessSearch(val) {
    const list = document.getElementById('process-combobox-list');
    if (list) { list.style.display = 'block'; renderProcessOptions(val); }
}

function selectProcess(id, name) {
    selectedProcessId = id;
    const input = document.getElementById('inputProcess');
    const hidden = document.getElementById('selectedProcessId');
    if (input) input.value = name; if (hidden) hidden.value = id;
    document.getElementById('process-combobox-list').style.display = 'none';
    validatePDAForm();
}

// ── Destination Combobox ──────────────────────────────────────
function initDestinationCombobox() {
    document.addEventListener('click', e => {
        const wrapper = document.getElementById('inputNextDestination')?.parentElement;
        const dropdown = document.getElementById('destination-combobox-list');
        if (wrapper && dropdown && !wrapper.contains(e.target) && dropdown.style.display === 'block') dropdown.style.display = 'none';
    });
}

function renderDestinationOptions(filterText = '') {
    const list = document.getElementById('destination-combobox-list');
    if (!list) return;
    const term = filterText.toLowerCase();
    const filtered = MOCK_DESTINATIONS.filter(p => !term || p.name.toLowerCase().includes(term) || p.code.toLowerCase().includes(term));
    list.innerHTML = filtered.length === 0
        ? `<div class="combobox-option no-results" style="padding:10px;color:#64748b;text-align:center;">Không tìm thấy kết quả</div>`
        : `<ul class="combobox-list" style="list-style:none;padding:0;margin:0;">${filtered.map(p => `<li class="combobox-option ${selectedDestinationId == p.id ? 'selected' : ''}" onclick="selectDestination('${p.id}', '${p.name}')" style="padding:10px 12px;cursor:pointer;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;gap:8px;"><span style="font-size:11px;color:#64748b;font-weight:600;min-width:60px;">${p.code}</span><span style="font-weight:500;color:#334155;">${p.name}</span></li>`).join('')}</ul>`;
}

function toggleDestinationCombobox() {
    const list = document.getElementById('destination-combobox-list');
    if (list) { list.style.display = list.style.display === 'block' ? 'none' : 'block'; if (list.style.display === 'block') renderDestinationOptions(document.getElementById('inputNextDestination')?.value); }
}

function handleDestinationSearch(val) {
    const list = document.getElementById('destination-combobox-list');
    if (list) { list.style.display = 'block'; renderDestinationOptions(val); }
}

function selectDestination(id, name) {
    selectedDestinationId = id;
    const input = document.getElementById('inputNextDestination');
    const hidden = document.getElementById('selectedDestinationId');
    if (input) input.value = name; if (hidden) hidden.value = id;
    document.getElementById('destination-combobox-list').style.display = 'none';
    validatePDAForm();
}

// ── Order Detail Modal ────────────────────────────────────────
function openOrderDetailModal(orderId) {
    const order = MOCK_INBOUND_ORDERS.find(o => o.id == orderId || o.code === orderId);
    if (!order) return;

    const title = document.getElementById('order-detail-title');
    if (title) title.innerText = `Thông tin vật chứa ${order.pallets[0] || order.code}`;

    const formatDate = dateObj => {
        if (!dateObj) return '-';
        const d = new Date(dateObj);
        return d.toLocaleDateString('en-GB') + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };
    const statusMap = {
        'COMPLETED': '<span style="color:#22C55E;background:#f0fdf4;padding:2px 8px;border-radius:4px;font-weight:500;">Hoàn thành</span>',
        'PROCESSING': '<span style="color:#0369a1;background:#e0f2fe;padding:2px 8px;border-radius:4px;font-weight:500;">Đang xử lý</span>',
        'PENDING': '<span style="color:#475569;background:#f1f5f9;padding:2px 8px;border-radius:4px;font-weight:500;">Đang chờ</span>',
        'CANCELLED': '<span style="color:#9f1239;background:#ffe4e6;padding:2px 8px;border-radius:4px;font-weight:500;">Lỗi</span>',
    };
    const typeMap = {
        'NEW': { label: 'Nhập mới', color: '#3b82f6', bg: '#eff6ff' },
        'REENTRY': { label: 'Nhập lại', color: '#f59e0b', bg: '#fffbeb' },
        // 'TRANSFER': { label: 'Nhập chuyền thẳng', color: '#10b981', bg: '#f0fdf4' }
    };
    const getTypeLabel = type => { const c = typeMap[type] || { label: type, color: '#64748b', bg: '#f1f5f9' }; return `<span style="display:inline-block;width:130px;text-align:center;background:${c.bg};color:${c.color};border:1px solid ${c.color}44;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:500;">${c.label}</span>`; };
    const renderRow = (label, value) => `<tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:12px 0;font-weight:500;color:#64748b;width:40%;">${label}</td><td style="padding:12px 0;color:#1e293b;font-weight:500;">${value}</td></tr>`;

    let executionTimeStr = '-';
    if (order.createdAt && order.completedAt) {
        const diffMs = Math.max(0, order.completedAt.getTime() - order.createdAt.getTime());
        const minutes = Math.floor(diffMs / 60000), seconds = Math.floor((diffMs % 60000) / 1000);
        executionTimeStr = minutes > 0 ? `${minutes} phút ${seconds} giây` : `${seconds} giây`;
    }

    const creatorUser = MOCK_USER_DATA[order.creator.id];
    const creatorName = creatorUser ? `${creatorUser.fullname} (${creatorUser.username})` : order.creator.name;
    const mat = order.materials?.[0] || null;

    let coreHtml = renderRow('Loại lệnh nhập', getTypeLabel(order.type))
        + renderRow('Trạng thái', statusMap[order.status] || order.status)
        + renderRow('Ưu tiên', order.priority ? `<i class="fas fa-star" style="color:#f59e0b;margin-right:4px;"></i> Có` : '-')
        + renderRow('Thời gian tạo', formatDate(order.createdAt))
        + renderRow('Thời gian hoàn thành', order.completedAt ? formatDate(order.completedAt) : '-')
        + renderRow('Thời gian thực hiện', executionTimeStr)
        + renderRow('Người tạo', creatorName);

    let matHtml = renderRow('Container', order.pallets?.length ? order.pallets.join(', ') : '-')
        + renderRow('Vị trí lưu', order.bin ? formatBinLocation(order.bin) : '-')
        + renderRow('Mã sản phẩm', mat ? mat.code : '-')
        + renderRow('Tên sản phẩm', mat ? (() => { 
            const master = MASTER_MATERIALS.find(mm => mm.code === mat.code);
            return master ? master.name : mat.name;
        })() : '-')
        + renderRow('Số lượng', mat ? `${mat.qty} ${mat.unit}` : '-')
        + renderRow('Quy cách', order.exportMethod || 'FIFO')
        + renderRow('Ngày hết hạn', mat?.expiryDate ? new Date(mat.expiryDate).toLocaleDateString('en-GB') : '-');

    document.getElementById('order-detail-core-tbody').innerHTML = coreHtml;
    document.getElementById('order-detail-mat-tbody').innerHTML = matHtml;

    const modal = document.getElementById('modal-order-detail');
    if (modal) { modal.style.display = 'flex'; setTimeout(() => modal.classList.add('show'), 10); }
}

function closeOrderDetailModal() {
    const modal = document.getElementById('modal-order-detail');
    if (modal) { modal.classList.remove('show'); setTimeout(() => modal.style.display = 'none', 300); }
}

// ── Excel ────────────────────────────────────────────────────
function toggleInboundExcelDropdown(e) {
    e.stopPropagation();
    document.getElementById('excel-dropdown-container')?.classList.toggle('active');
}

function exportInboundExcel() {
    document.getElementById('excel-dropdown-container')?.classList.remove('active');
    const allData = getFilteredMainData();
    if (allData.length === 0) { showToast('Không có dữ liệu để xuất', 'error'); return; }

    const dataToExport = allData.map((order, index) => ({
        'STT': index + 1,
        'Mã vật chứa': order.pallets[0] || order.code,
        'Sản phẩm': order.materials.map(m => `${m.name} (${m.code})`).join(', '),
        'Số lượng': order.materials.reduce((sum, m) => sum + (m.qty || 0), 0),
        'Đơn vị': order.materials[0]?.unit || '',
        'Loại lệnh nhập': order.type === 'NEW' ? 'Nhập mới' : (order.type === 'REENTRY' ? 'Nhập lại' : order.type),
        'Trạng thái': order.status === 'PENDING' ? 'Đang chờ' : order.status === 'PROCESSING' ? 'Đang xử lý' : 'Hoàn thành',
        'Người tạo': order.creator.name,
        'Thời gian tạo': formatDateTime(order.createdAt)
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inbound Orders');

    let filename = 'Danh_sach_nhap_kho';
    if (activeStartDate && activeEndDate) {
        const fmt = d => { const date = new Date(d); return `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`; };
        filename += `_${fmt(activeStartDate)}_den_${fmt(activeEndDate)}`;
    }
    XLSX.writeFile(workbook, filename + '.xlsx');
    showToast('Xuất file Excel thành công!', 'success');
}

// ── Import ───────────────────────────────────────────────────
function openImportModal() {
    const modal = document.getElementById('modal-import');
    if (modal) { modal.classList.add('show'); modal.style.display = 'flex'; initImportDragAndDrop(); }
}

function closeImportModal() {
    // Close both possible import modals
    ['modal-import', 'modal-import-excel'].forEach(id => {
        const modal = document.getElementById(id);
        if (modal) { modal.classList.remove('show'); setTimeout(() => modal.style.display = 'none', 300); }
    });
    const fileInput = document.getElementById('import-file-input');
    if (fileInput) fileInput.value = '';
}

function initImportDragAndDrop() {
    const dropZone = document.getElementById('import-drop-zone');
    if (!dropZone) return;
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(e => dropZone.addEventListener(e, ev => { ev.preventDefault(); ev.stopPropagation(); }, false));
    ['dragenter', 'dragover'].forEach(e => dropZone.addEventListener(e, () => dropZone.classList.add('dragover')));
    ['dragleave', 'drop'].forEach(e => dropZone.addEventListener(e, () => dropZone.classList.remove('dragover')));
    dropZone.addEventListener('drop', e => {
        const files = e.dataTransfer.files;
        if (files?.length > 0) {
            const input = document.getElementById('import-file-input');
            if (input) { const dt = new DataTransfer(); dt.items.add(files[0]); input.files = dt.files; handleImportFile(input); }
        }
    });
}

function downloadSampleImport() {
    const link = document.createElement('a');
    link.href = '../../icons/files/sample_import_inboundOrder.xlsx';
    link.download = 'sample_import_inboundOrder.xlsx';
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
}

function handleImportFile(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            processImportData(XLSX.utils.sheet_to_json(worksheet, { header: 1 }).slice(3));
        } catch (err) { console.error('Error reading Excel:', err); showToast('Có lỗi khi đọc file Excel!', 'error'); }
    };
    reader.readAsArrayBuffer(file);
}

function processImportData(rows) {
    if (!rows?.length) { showToast('File không có dữ liệu từ dòng 4!', 'error'); return; }

    const newOrders = [], errors = [], now = new Date();
    const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

    rows.forEach((row, index) => {
        const rowNum = index + 4;
        const pallet = String(row[1] || '').trim();
        const matCode = String(row[2] || '').trim();
        const qty = row[3];
        const unit = String(row[4] || 'Cái').trim();
        const arrivalDateStr = String(row[5] || '').trim();
        const expiryDateStr = String(row[6] || '').trim();
        const destPos = String(row[7] || '').trim();
        const priorityVal = row[8];

        if (!pallet || !matCode || qty == null || qty === '' || priorityVal == null || priorityVal === '') {
            errors.push(`Dòng ${rowNum}: Thiếu thông tin bắt buộc`); return;
        }
        const quantity = parseFloat(qty);
        if (isNaN(quantity) || quantity <= 0) { errors.push(`Dòng ${rowNum}: Số lượng không hợp lệ`); return; }

        let arrivalDate = now;
        if (arrivalDateStr && arrivalDateStr !== 'undefined') {
            const match = arrivalDateStr.match(dateRegex);
            if (!match) { errors.push(`Dòng ${rowNum}: Ngày nhập sai định dạng`); return; }
            arrivalDate = new Date(match[3], match[2] - 1, match[1]);
            arrivalDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
        }

        let expiryDate = null;
        if (expiryDateStr && expiryDateStr !== 'undefined') {
            const match = expiryDateStr.match(dateRegex);
            if (!match) { errors.push(`Dòng ${rowNum}: Ngày hết hạn sai định dạng`); return; }
            expiryDate = `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
        }

        const isPriority = priorityVal === 1 || priorityVal === '1' || priorityVal === true;
        const masterMat = MASTER_MATERIALS.find(m => m.code === matCode);
        const codeSuffix = now.getTime().toString().slice(-6);

        newOrders.push({
            id: Date.now() + index, code: `${pallet}_${matCode}_${quantity}_${codeSuffix}`,
            materials: [{ code: matCode, name: masterMat ? masterMat.name : `Sản phẩm ${matCode}`, qty: quantity, unit, expiryDate }],
            pallets: [pallet], bin: destPos || '', status: 'PENDING', priority: isPriority,
            type: destPos ? 'TRANSFER' : 'NEW',
            creator: { id: 'US_IMPORT', name: 'Import System' },
            createdAt: arrivalDate, process: 'Quy trình Nhập - Kho Chuối'
        });
    });

    if (errors.length > 0) { showToast(errors[0], 'error'); return; }
    if (newOrders.length > 0) {
        MOCK_INBOUND_ORDERS.unshift(...newOrders);
        saveInboundOrders();
        mainCurrentPage = 1;
        renderTableBody();
        showToast(`Đã import thành công ${newOrders.length} lệnh nhập kho!`, 'success');
        closeImportModal();
    }
}

// ── Button Binding ───────────────────────────────────────────
function initButtonListeners() {
    const btnCreate = document.getElementById('btn-open-create');
    if (btnCreate) btnCreate.onclick = openCreateModal;
}

// ── Initialization ───────────────────────────────────────────
function init() {
    ensureBatchDataInitialized();
    ensureTodayDataInbound();
    initDefaultDateRange();
    initCreatorCombobox();
    renderTableBody();
    syncTableScroll();
    initDatePicker();
    initProcessCombobox();
    initDestinationCombobox();
    initButtonListeners();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
    setTimeout(initButtonListeners, 100);
    setTimeout(initButtonListeners, 500);
}

// ── Global Exports ───────────────────────────────────────────
Object.assign(window, {
    openCreateModal,
    closeCreateModal,
    renderTableBody,
    goToMainPage,
    goToMainPageFromInput,
    printInboundOrder,
    deleteInboundOrder,
    handleMainSearchKeyup,
    toggleTimeSort,
    togglePriorityFilter,
    setDateFilterMode,
    selectStatus,
    selectEntryType,
    toggleStatusDropdown,
    selectCreator,
    toggleCreatorCombobox,
    handleCreatorComboboxSearch,
    openQRScanner,
    closeQRScanner,
    switchScannerTab,
    scanImageFile,
    handlePalletScan,
    handleVatTuInput,
    handleSoLuongInput,
    updateTotalWeightDisplay,
    validatePDAForm,
    generateReceipt,
    addQuickDays,
    addQuickYears,
    togglePdaCalendar,
    closePdaCalendar,
    pdaCalPrevMonth,
    pdaCalNextMonth,
    pdaCalApply,
    renderBatchSelectionList,
    goToBatchStep,
    goToScanStep,
    toggleProcessCombobox,
    handleProcessSearch,
    selectProcess,
    toggleDestinationCombobox,
    handleDestinationSearch,
    selectDestination,
    openOrderDetailModal,
    closeOrderDetailModal,
    openImportModal,
    closeImportModal,
    downloadSampleImport,
    handleImportFile,
    toggleInboundExcelDropdown,
    exportInboundExcel,
    showCustomConfirm,
    closeCustomConfirm,
    initButtonListeners,
    copyToClipboard,
});