let currentMaterialPage = 1;
const materialPageSize = 20;
let materialSearchQuery = "";

// selected materials stored for create modal
let selectedMaterials = [];
let selectSearchQuery = "";
let selectPage = 1;
let createSearchQuery = "";
let createSearchPage = 1;

let selectedStartDate = null;
let selectedEndDate = null;
let currentViewLeft = new Date();
let currentViewRight = new Date();
currentViewRight.setMonth(currentViewRight.getMonth() + 1);
let activeStartDate = null;
let activeEndDate = null;
let activeDateFilterType = 'all'; // 'all', 'createdAt', or 'expiryDate'
let filterPriorityOnly = false;
let timeSortOrder = null; // null, 'asc', 'desc'

const MASTER_MATERIALS = Array.from({ length: 35 }, (_, i) => ({
    code: `MAT-${String(i + 1).padStart(3, '0')}`,
    name: [
        'Thép ống D60', 'Thép tấm 5mm', 'Bulong M16', 'Ecu M16', 'Long đen', 
        'Sơn chống rỉ', 'Que hàn', 'Vòng bi SKF', 'Dây curoa', 'Băng tải PVC',
        'Cảm biến quang', 'PLC Mitsubishi', 'Động cơ servo', 'Hộp giảm tốc', 'Nhông xích'
    ][i % 15] + ` (Loại ${Math.floor(i/15) + 1})`,
    specs: `Quy cách tiêu chuẩn nhóm ${Math.floor(i/5) + 1}`,
    unit: i % 3 === 0 ? 'kg' : (i % 3 === 1 ? 'cái' : 'thùng'),
    weight: [15, 8, 0.3, 0.2, 0.1, 12, 0.5, 2.5, 1.2, 8, 0.4, 6, 45, 30, 2.8][i % 15], // kg per unit (consistent)
    weightPerUnit: [15, 8, 0.3, 0.2, 0.1, 12, 0.5, 2.5, 1.2, 8, 0.4, 6, 45, 30, 2.8][i % 15],
    expiryDate: i % 4 === 0 ? null : `2026-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    dimensions: {
        length: [600, 250, 30, 25, 20, 300, 450, 80, 150, 400, 90, 200, 380, 320, 100][i % 15],
        width: [60, 250, 16, 16, 20, 100, 450, 80, 25, 600, 60, 150, 280, 220, 60][i % 15],
        height: [3, 5, 10, 10, 5, 100, 5, 40, 10, 5, 60, 80, 25, 30, 20][i % 15]
    }
}));

const STAFF_LIST = [
    { id: 'ST01', name: 'Nguyễn Văn A', position: 'Quản kho' },
    { id: 'ST02', name: 'Trần Thị B', position: 'Nhân viên vận hành' },
    { id: 'ST03', name: 'Lê Văn C', position: 'Kỹ thuật viên' },
];

const MOCK_PALLET_DATA = {
    'P-001': {
        material: { code: 'MAT-001', name: 'Thep ong D60', totalQty: 1000 },
        maxCapacity: 2000,
        history: [
            { code: 'P-011_MAT-001_200_251120', exported: 200, total: 1000, time: '2025-11-20 08:30' }
        ]
    },
    'P-002': {
        material: { code: 'MAT-005', name: 'Bong den LED Rang Dong', totalQty: 500 },
        maxCapacity: 500,
        history: [
            { code: 'P-002_MAT-005_50_240115', exported: 50, total: 500, time: '2024-01-15 10:00' }
        ]
    },
    'PL-1001': { maxCapacity: 1500, history: [] },
    'PL-1002': { maxCapacity: 1000, history: [] },
    'PL-1003': { maxCapacity: 800,  history: [] },
    'PL-2001': { maxCapacity: 2500, history: [] },
    'PL-2002': { maxCapacity: 2000, history: [] },
};

const MOCK_DESTINATIONS = [
    { id: 'DEST-001', code: 'N01', name: 'Kho Thành Phẩm' },
    { id: 'DEST-002', code: 'N02', name: 'Kho Bán Thành Phẩm' },
    { id: 'DEST-003', code: 'N03', name: 'Xưởng Lắp Ráp' },
    { id: 'DEST-004', code: 'N04', name: 'Nhà Máy Lắp Ráp Xe Tải' },
    { id: 'DEST-005', code: 'N05', name: 'Kho Phụ Tùng Bảo Hành' }
];

let selectedDestinationId = '';
let currentTabMode = 'normal';

const MOCK_INBOUND_ORDERS = [
  // --- Tháng 10/2025 ---
  { 
    id: 1, code: 'P-A01-L3_MAT-001_500_25102025', 
    materials: [{ code: 'MAT-001', name: 'Thép ống D60', qty: 500, unit: 'kg', specs: 'Φ60mm x 6m', weight: 500, expiryDate: '2025-10-25' }], 
    pallets: ['P-A01-L3'], bin: 'T1-F1-P1-A1', status: 'COMPLETED', priority: true,
    creator: { id: 'US01', name: 'Nguyễn Văn An' }, createdAt: new Date('2025-10-25T08:30:00')
  },
  { 
    id: 2, code: 'P-B01-L1_MAT-002_1000_26102025', 
    materials: [{ code: 'MAT-002', name: 'Xi măng Hà Tiên', qty: 1000, unit: 'bao', specs: 'Bao 50kg', weight: 50000, expiryDate: '2025-06-15' }], 
    pallets: ['P-B01-L1'], bin: 'T1-F1-P2-A5', status: 'COMPLETED', priority: false,
    creator: { id: 'US02', name: 'Trần Thị Bình' }, createdAt: new Date('2025-10-26T09:15:00')
  },
  { 
    id: 3, code: 'P-C01-L2_MAT-003_200_27102025', 
    materials: [{ code: 'MAT-003', name: 'Gạch men 60x60', qty: 200, unit: 'thùng', specs: '600x600x10', weight: 4000, expiryDate: '2025-12-27' }], 
    pallets: ['P-C01-L2'], bin: 'T2-F3-P1-A2', status: 'PROCESSING', 
    creator: { id: 'US03', name: 'Lê Văn Cường' }, createdAt: new Date('2025-10-27T14:00:00')
  },

  // --- Tháng 11/2025 ---
  { 
    id: 4, code: 'P-A05-L1_MAT-004_50_05112025', 
    materials: [{ code: 'MAT-004', name: 'Sơn Dulux Trong Nhà', qty: 50, unit: 'thùng', specs: '30x30x40', weight: 900, expiryDate: '2026-03-20' }], 
    pallets: ['P-A05-L1'], bin: 'T1-F8-P3-A2', status: 'COMPLETED', 
    creator: { id: 'US01', name: 'Nguyễn Văn An' }, createdAt: new Date('2025-11-05T10:30:00')
  },
  { 
    id: 5, code: 'P-D01-L2_MAT-005_500_12112025', 
    materials: [{ code: 'MAT-005', name: 'Bóng đèn LED Rạng Đông', qty: 500, unit: 'cái', specs: '12x6x6', weight: 25, expiryDate: '2026-11-12' }], 
    pallets: ['P-D01-L2'], bin: 'T3-F2-P5-A1', status: 'PENDING', 
    creator: { id: 'US04', name: 'Phạm Minh Dũng' }, createdAt: new Date('2025-11-12T16:45:00')
  },
  { 
    id: 6, code: 'P-E01-L3_MAT-007_300_20112025', 
    materials: [{ code: 'MAT-007', name: 'Ống nhựa Bình Minh D90', qty: 300, unit: 'cây', specs: '4000x90x90', weight: 450, expiryDate: '2025-11-20' }], 
    pallets: ['P-E01-L3'], bin: 'T1-F5-P2-A4', status: 'CANCELLED', 
    creator: { id: 'US02', name: 'Trần Thị Bình' }, createdAt: new Date('2025-11-20T08:00:00')
  },

  // --- Tháng 12/2025 ---
  { 
    id: 7, code: 'P-A10-L1_MAT-008_20_01122025', 
    materials: [{ code: 'MAT-008', name: 'Máy khoan Bosch', qty: 20, unit: 'cái', specs: '35x25x15', weight: 60, expiryDate: '2026-12-01' }], 
    pallets: ['P-A10-L1'], bin: 'T2-F2-P2-A2', status: 'COMPLETED', 
    creator: { id: 'US05', name: 'Hoàng Tuấn Em' }, createdAt: new Date('2025-12-01T09:20:00')
  },
  { 
    id: 8, code: 'P-B05-L2_MAT-009_500_15122025', 
    materials: [{ code: 'MAT-009', name: 'Đinh đóng gỗ 5cm', qty: 500, unit: 'kg', specs: '50x1.5x1.5', weight: 500, expiryDate: '2026-12-15' }], 
    pallets: ['P-B05-L2'], bin: 'T1-F1-P9-A3', status: 'PROCESSING', 
    creator: { id: 'US03', name: 'Lê Văn Cường' }, createdAt: new Date('2025-12-15T11:10:00')
  },
  { 
    id: 9, code: 'P-C05-L3_MAT-010_50_20122025', 
    materials: [{ code: 'MAT-010', name: 'Kính cường lực 10mm', qty: 50, unit: 'tấm', specs: '2400x1200x10', weight: 1500, expiryDate: '2027-12-20' }], 
    pallets: ['P-C05-L3'], bin: 'T4-F4-P4-A4', status: 'COMPLETED', 
    creator: { id: 'US01', name: 'Nguyễn Văn An' }, createdAt: new Date('2025-12-20T15:30:00')
  },
  { 
    id: 10, code: 'P-Z01-L1_MAT-012_20_28122025', 
    materials: [{ code: 'MAT-012', name: 'Cát xây dựng', qty: 20, unit: 'm3', specs: 'Không quy cách', weight: 32000, expiryDate: '2025-12-28' }], 
    pallets: ['P-Z01-L1'], bin: 'T1-F9-P1-A1', status: 'PENDING', priority: true,
    creator: { id: 'US04', name: 'Phạm Minh Dũng' }, createdAt: new Date('2025-12-28T07:45:00')
  },

  // --- Tháng 01/2024 ---
  { 
    id: 11, code: 'P-F01-L1_MAT-013_10_05012024', 
    materials: [{ code: 'MAT-013', name: 'Laptop Dell Latitude', qty: 10, unit: 'cái', specs: '38x26x2.5', weight: 18, expiryDate: '2028-01-05' }], 
    pallets: ['P-F01-L1'], bin: 'T5-F1-P1-A1', status: 'COMPLETED', priority: true,
    creator: { id: 'US06', name: 'Vũ Thị Giang' }, createdAt: new Date('2024-01-05T08:15:00')
  },
  { 
    id: 12, code: 'P-F02-L1_MAT-014_15_10012024', 
    materials: [{ code: 'MAT-014', name: 'Màn hình HP 24 inch', qty: 15, unit: 'cái', specs: '60x40x20', weight: 75, expiryDate: '2028-01-10' }], 
    pallets: ['P-F02-L1'], bin: 'T5-F1-P1-A2', status: 'PROCESSING', 
    creator: { id: 'US06', name: 'Vũ Thị Giang' }, createdAt: new Date('2024-01-10T10:00:00')
  },
  { 
    id: 13, code: 'P-F03-L2_MAT-015_50_15012024', 
    materials: [{ code: 'MAT-015', name: 'Chuột Logitech', qty: 50, unit: 'cái', specs: '12x7x4', weight: 5, expiryDate: '2028-01-15' }], 
    pallets: ['P-F03-L2'], bin: 'T5-F1-P2-A1', status: 'COMPLETED', 
    creator: { id: 'US02', name: 'Trần Thị Bình' }, createdAt: new Date('2024-01-15T13:20:00')
  },

  // --- Tháng 02/2024 ---
  { 
    id: 14, code: 'P-G01-L1_MAT-017_500_02022024', 
    materials: [{ code: 'MAT-017', name: 'Giấy in A4', qty: 500, unit: 'ram', specs: '29.7x21x5', weight: 1250, expiryDate: '2026-02-02' }], 
    pallets: ['P-G01-L1'], bin: 'T2-F8-P1-A1', status: 'COMPLETED', 
    creator: { id: 'US03', name: 'Lê Văn Cường' }, createdAt: new Date('2024-02-02T09:00:00')
  },
  { 
    id: 15, code: 'P-G03-L2_MAT-018_2000_15022024', 
    materials: [{ code: 'MAT-018', name: 'Bút bi Thiên Long', qty: 2000, unit: 'cây', specs: '14x1x1', weight: 10, expiryDate: '2026-02-15' }], 
    pallets: ['P-G03-L2'], bin: 'T2-F8-P2-A3', status: 'PENDING', 
    creator: { id: 'US05', name: 'Hoàng Tuấn Em' }, createdAt: new Date('2024-02-15T14:10:00')
  },
  { 
    id: 16, code: 'P-G04-L1_MAT-019_100_20022024', 
    materials: [{ code: 'MAT-019', name: 'Bìa còng 7cm', qty: 100, unit: 'cái', specs: '32x26x7', weight: 80, expiryDate: '2026-02-20' }], 
    pallets: ['P-G04-L1'], bin: 'T2-F8-P4-A1', status: 'CANCELLED', 
    creator: { id: 'US01', name: 'Nguyễn Văn An' }, createdAt: new Date('2024-02-20T11:30:00')
  },

  // --- Tháng 03/2024 ---
  { 
    id: 17, code: 'P-H01-L1_MAT-020_1000_01032024', 
    materials: [{ code: 'MAT-020', name: 'Vải cotton trắng', qty: 1000, unit: 'mét', specs: '100x150', weight: 200, expiryDate: '2025-09-01' }], 
    pallets: ['P-H01-L1'], bin: 'T6-F1-P1-A1', status: 'PROCESSING', 
    creator: { id: 'US04', name: 'Phạm Minh Dũng' }, createdAt: new Date('2024-03-01T08:45:00')
  },
  { 
    id: 18, code: 'P-H04-L3_MAT-022_10000_10032024', 
    materials: [{ code: 'MAT-022', name: 'Nút áo nhựa', qty: 10000, unit: 'cái', specs: '1x1x0.3', weight: 5, expiryDate: '2025-03-10' }], 
    pallets: ['P-H04-L3'], bin: 'T6-F2-P1-A5', status: 'COMPLETED', 
    creator: { id: 'US02', name: 'Trần Thị Bình' }, createdAt: new Date('2024-03-10T15:20:00')
  },
  { 
    id: 19, code: 'P-H05-L2_MAT-023_2000_15032024', 
    materials: [{ code: 'MAT-023', name: 'Khóa kéo YKK', qty: 2000, unit: 'cái', specs: '20x2x0.5', weight: 8, expiryDate: '2025-03-15' }], 
    pallets: ['P-H05-L2'], bin: 'T6-F3-P2-A2', status: 'COMPLETED', 
    creator: { id: 'US06', name: 'Vũ Thị Giang' }, createdAt: new Date('2024-03-15T10:15:00')
  },

  // --- Tháng 04/2024 ---
  { 
    id: 20, code: 'P-K01-L1_MAT-024_5000_02042024', 
    materials: [{ code: 'MAT-024', name: 'Hạt nhựa PP', qty: 5000, unit: 'kg', specs: 'Bao 25kg', weight: 5000, expiryDate: '2027-04-01' }], 
    pallets: ['P-K01-L1'], bin: 'T8-F1-P1-A1', status: 'PROCESSING', 
    creator: { id: 'US01', name: 'Nguyễn Văn An' }, createdAt: new Date('2024-04-02T09:30:00')
  },
  { 
    id: 21, code: 'P-K03-L1_MAT-025_200_05042024', 
    materials: [{ code: 'MAT-025', name: 'Phụ gia tạo màu', qty: 200, unit: 'kg', specs: 'Thùng 20kg', weight: 200, expiryDate: '2026-08-15' }], 
    pallets: ['P-K03-L1'], bin: 'T8-F1-P1-A2', status: 'PENDING', 
    creator: { id: 'US03', name: 'Lê Văn Cường' }, createdAt: new Date('2024-04-05T13:45:00')
  },
  { 
    id: 22, code: 'P-K04-L1_MAT-026_2_12042024', 
    materials: [{ code: 'MAT-026', name: 'Khuôn ép nhựa', qty: 2, unit: 'bộ', specs: '100x80x50', weight: 150, expiryDate: '2026-04-12' }], 
    pallets: ['P-K04-L1'], bin: 'T8-F2-P5-A1', status: 'COMPLETED', priority: true,
    creator: { id: 'US05', name: 'Hoàng Tuấn Em' }, createdAt: new Date('2024-04-12T11:00:00')
  },

  // --- Tháng 05/2024 ---
  { 
    id: 23, code: 'P-L01-L0_MAT-027_20_01052024', 
    materials: [{ code: 'MAT-027', name: 'Bàn làm việc gỗ', qty: 20, unit: 'cái', specs: '120x60x75', weight: 400, expiryDate: '2027-01-05' }], 
    pallets: ['P-L01-L0'], bin: 'T9-F1-P1-A1', status: 'PROCESSING', 
    creator: { id: 'US02', name: 'Trần Thị Bình' }, createdAt: new Date('2024-05-01T08:10:00')
  },
  { 
    id: 24, code: 'P-L03-L0_MAT-029_10_10052024', 
    materials: [{ code: 'MAT-029', name: 'Tủ hồ sơ sắt', qty: 10, unit: 'cái', specs: '90x40x185', weight: 350, expiryDate: '2027-01-05' }], 
    pallets: ['P-L03-L0'], bin: 'T9-F1-P2-A2', status: 'COMPLETED', 
    creator: { id: 'US04', name: 'Phạm Minh Dũng' }, createdAt: new Date('2024-05-10T14:30:00')
  },
  { 
    id: 25, code: 'P-L04-L2_MAT-030_50_20052024', 
    materials: [{ code: 'MAT-030', name: 'Kệ sách treo tường', qty: 50, unit: 'cái', specs: '80x20x30', weight: 75, expiryDate: '2027-05-20' }], 
    pallets: ['P-L04-L2'], bin: 'T9-F2-P1-A1', status: 'PENDING', 
    creator: { id: 'US06', name: 'Vũ Thị Giang' }, createdAt: new Date('2024-05-20T16:20:00')
  },

  // --- Tháng 06/2024 ---
  { 
    id: 26, code: 'P-M01-L1_MAT-031_100_01062024', 
    materials: [{ code: 'MAT-031', name: 'Nước khoáng Lavie', qty: 100, unit: 'thùng', specs: '40x30x25', weight: 1900, expiryDate: '2026-12-01' }], 
    pallets: ['P-M01-L1'], bin: 'T1-F2-P1-A1', status: 'COMPLETED', 
    creator: { id: 'US01', name: 'Nguyễn Văn An' }, createdAt: new Date('2024-06-01T07:50:00')
  },
  { 
    id: 27, code: 'P-M02-L1_MAT-032_50_05062024', 
    materials: [{ code: 'MAT-032', name: 'Cà phê hòa tan G7', qty: 50, unit: 'thùng', specs: '35x25x20', weight: 600, expiryDate: '2026-01-15' }], 
    pallets: ['P-M02-L1'], bin: 'T1-F2-P1-A2', status: 'PROCESSING', 
    creator: { id: 'US03', name: 'Lê Văn Cường' }, createdAt: new Date('2024-06-05T09:40:00')
  },
  { 
    id: 28, code: 'P-M03-L2_MAT-033_200_10062024', 
    materials: [{ code: 'MAT-033', name: 'Mì ly Modern', qty: 200, unit: 'thùng', specs: '50x35x30', weight: 1200, expiryDate: '2025-09-10' }], 
    pallets: ['P-M03-L2'], bin: 'T1-F2-P2-A1', status: 'COMPLETED', 
    creator: { id: 'US05', name: 'Hoàng Tuấn Em' }, createdAt: new Date('2024-06-10T11:15:00')
  },
  { 
    id: 29, code: 'P-M06-L1_MAT-035_60_15062024', 
    materials: [{ code: 'MAT-035', name: 'Dầu ăn Neptune 1L', qty: 60, unit: 'thùng', specs: '40x30x30', weight: 720, expiryDate: '2026-06-15' }], 
    pallets: ['P-M06-L1'], bin: 'T1-F2-P3-A4', status: 'DRAFT', 
    creator: { id: 'US02', name: 'Trần Thị Bình' }, createdAt: new Date('2024-06-15T13:50:00')
  },
  { 
    id: 30, code: 'P-M07-L0_MAT-036_500_20062024', 
    materials: [{ code: 'MAT-036', name: 'Gạo ST25', qty: 500, unit: 'kg', specs: 'Bao 25kg', weight: 500, expiryDate: '2026-02-20' }], 
    pallets: ['P-M07-L0'], bin: 'T1-F2-P4-A1', status: 'PENDING', exportMethod: 'FIFO',
    creator: { id: 'US04', name: 'Phạm Minh Dũng' }, createdAt: new Date('2024-06-20T08:30:00')
  },
  // --- Hôm nay ---
  { 
    id: 31, code: 'P-N01-L1_MAT-001_100_TDAY', 
    materials: [{ code: 'MAT-001', name: 'Thép ống D60', qty: 100, unit: 'kg', specs: 'Φ60mm x 6m', weight: 100, expiryDate: '2026-08-15' }], 
    pallets: ['P-N01-L1'], bin: 'T1-F1-P1-A1', status: 'COMPLETED', priority: true,
    creator: { id: 'US01', name: 'Nguyễn Văn An' }, createdAt: (() => { const d = new Date(); d.setHours(8, 30, 0, 0); return d; })()
  },
  { 
    id: 32, code: 'P-N02-L2_MAT-002_200_TDAY', 
    materials: [{ code: 'MAT-002', name: 'Xi măng Hà Tiên', qty: 200, unit: 'bao', specs: 'Bao 50kg', weight: 10000, expiryDate: '2026-10-10' }], 
    pallets: ['P-N02-L2'], bin: 'T2-F2-P2-A2', status: 'PROCESSING', priority: false,
    creator: { id: 'US02', name: 'Trần Thị Bình' }, createdAt: (() => { const d = new Date(); d.setHours(9, 15, 0, 0); return d; })()
  },
  { 
    id: 33, code: 'P-N03-L3_MAT-003_50_TDAY', 
    materials: [{ code: 'MAT-003', name: 'Gạch men 60x60', qty: 50, unit: 'thùng', specs: '600x600x10', weight: 1000, expiryDate: '2027-01-01' }], 
    pallets: ['P-N03-L3'], bin: 'T3-F3-P3-A3', status: 'PENDING', priority: false,
    creator: { id: 'US03', name: 'Lê Văn Cường' }, createdAt: (() => { const d = new Date(); d.setHours(14, 45, 0, 0); return d; })()
  }
];

// Initialize random export methods and mock processes
MOCK_INBOUND_ORDERS.forEach((o, i) => {
    if(!o.exportMethod) {
        const methods = ['FIFO', 'FEFO'];
        o.exportMethod = methods[Math.floor(Math.random() * methods.length)];
    }
    
    // Mock entry types
    const types = ['NEW', 'REENTRY', 'TRANSFER'];
    o.type = types[i % types.length];
    
    // Mock processes based on workflow module list
    const processes = [
        'Quy trình Nhập - Kho Phụ Tùng',
        'Quy trình Xuất - Kho Phụ Tùng', 
        'Quy trình Kiểm kê - Kho Nguyên Liệu',
        'Quy trình Nhập - Kho Phế Liệu',
        'Quy trình Xuất - Kho Thành Phẩm'
    ];
    o.process = processes[i % processes.length];

    // Mock completion time (< 10 minutes) for COMPLETED orders
    if (o.status === 'COMPLETED') {
        const addMinutes = Math.floor(Math.random() * 9) + 1; // 1 to 9 minutes
        const addSeconds = Math.floor(Math.random() * 60); // 0 to 59 seconds
        o.completedAt = new Date(o.createdAt.getTime() + addMinutes * 60000 + addSeconds * 1000);
        o.completedDisplay = `${addMinutes} phút ${addSeconds} giây`;
    }
});

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
function formatDateTime(date) {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const mo = String(date.getMonth() + 1).padStart(2, '0');
    return `${h}:${m} - ${d}/${mo}/${date.getFullYear()}`;
}

// Main table pagination
let mainCurrentPage = 1;
const mainPageSize = 20;

function getFilteredMainData() {
    const filterStatus = document.getElementById('filter-status').value;
    const filterEntryType = document.getElementById('filter-entry-type')?.value || 'ALL';
    const search = (document.getElementById('search-input')?.value || '').toLowerCase();
    
    let filtered = MOCK_INBOUND_ORDERS.filter(o => {
        // Status filter
        const statusMatch = filterStatus === 'ALL' || o.status === filterStatus;

        // Entry Type filter
        const entryTypeMatch = filterEntryType === 'ALL' || o.type === filterEntryType;
        
        // Search filter - by order code OR material name
        const searchMatch = !search || 
            o.code.toLowerCase().includes(search) || 
            o.materials.some(m => m.name.toLowerCase().includes(search) || m.code.toLowerCase().includes(search));
        
        // Date filter
        let dateMatch = true;
        if (activeStartDate && activeEndDate) {
            const start = new Date(activeStartDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(activeEndDate);
            end.setHours(23, 59, 59, 999);
            
            if (activeDateFilterType === 'all') {
                const createdMatch = o.createdAt >= start && o.createdAt <= end;
                const expiryMatch = o.materials.some(m => m.expiryDate && new Date(m.expiryDate) >= start && new Date(m.expiryDate) <= end);
                dateMatch = createdMatch || expiryMatch;
            } else if (activeDateFilterType === 'expiryDate') {
                dateMatch = o.materials.some(m => m.expiryDate && new Date(m.expiryDate) >= start && new Date(m.expiryDate) <= end);
            } else { // createdAt
                dateMatch = o.createdAt >= start && o.createdAt <= end;
            }
        }

        // Creator Filter (Custom Select)
        let creatorMatch = true;
        if (selectedCreatorId) {
            // Precise match by ID
            creatorMatch = o.creator.id === selectedCreatorId;
        }

        return statusMatch && entryTypeMatch && searchMatch && dateMatch && creatorMatch;
    });

    if (timeSortOrder === 'asc') {
        filtered.sort((a, b) => a.createdAt - b.createdAt);
    } else if (timeSortOrder === 'desc') {
        filtered.sort((a, b) => b.createdAt - a.createdAt);
    }

    return filtered;
}

function selectEntryType(val, label) {
    const hidden = document.getElementById('filter-entry-type');
    const display = document.getElementById('entry-type-selected-label');
    if (hidden) hidden.value = val;
    if (display) display.innerText = label;
    
    // Toggle active class on option divs
    const options = document.querySelectorAll('#entry-type-dropdown .dropdown-option');
    options.forEach(opt => {
        if (opt.getAttribute('data-value') === val) opt.classList.add('active');
        else opt.classList.remove('active');
    });
    
    // Close dropdown
    const dropdown = document.getElementById('entry-type-dropdown');
    if (dropdown) {
        dropdown.classList.remove('open');
        openStatusDropdownId = null;
    }
    
    mainCurrentPage = 1; // RESET PAGE
    renderTableBody();
}

// --- Custom Creator Combobox Logic ---
let selectedCreatorId = null;

function initCreatorCombobox() {
    const list = document.getElementById('creator-combobox-list');
    if (!list) return;
    
    // Initial Render of All Options
    renderCreatorOptions();

    // Global click to close
    document.addEventListener('click', (e) => {
        const wrapper = document.getElementById('creator-combobox-wrapper');
        const isClickInside = wrapper && wrapper.contains(e.target);
        const dropdown = document.getElementById('creator-combobox-dropdown');
        
        if (!isClickInside && dropdown && dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
            document.querySelector('.combobox-arrow')?.classList.remove('active');
        }
    });
}

function renderCreatorOptions(filterText = '') {
    const list = document.getElementById('creator-combobox-list');
    if (!list) return;

    const term = filterText.toLowerCase();
    let html = '';

    // "All" option - only show if no search term or matches "tất cả"
    if (!term || 'tất cả'.includes(term)) {
        html += `<li class="combobox-option ${selectedCreatorId === null ? 'selected' : ''}" onclick="selectCreator(null, 'Tất cả')">
            <span>Tất cả</span>
        </li>`;
    }

    Object.entries(MOCK_USER_DATA).forEach(([id, u]) => {
        const searchStr = `${u.username.toLowerCase()} ${u.fullname.toLowerCase()}`;
        if (!term || searchStr.includes(term)) {
             html += `<li class="combobox-option ${selectedCreatorId === id ? 'selected' : ''}" onclick="selectCreator('${id}', '${u.fullname}')">
                <span>${u.fullname}</span>
                <span class="sub-text">(${u.username})</span>
            </li>`;
        }
    });

    // If no results
    if (html === '') {
        html = `<li class="combobox-option no-results">Không tìm thấy kết quả</li>`;
    }

    list.innerHTML = html;
}

function toggleCreatorCombobox() {
    const dropdown = document.getElementById('creator-combobox-dropdown');
    const arrow = document.querySelector('.combobox-arrow');
    const input = document.getElementById('creator-combobox-input');

    if (dropdown) {
        const isShow = dropdown.classList.contains('show');
        
        if (!isShow) {
            dropdown.classList.add('show');
            arrow?.classList.add('active');
            input?.focus();
            // Reset filter on open if desired, or keep current input? 
            // User requirement: "click search bar shows list". 
            // Let's re-render full list if input is just "Tất cả" (which is placeholder really, but if value is empty)
            // Actually, if we want real-time search, the input value is the filter.
            renderCreatorOptions(input.value.trim() === 'Tất cả' ? '' : input.value);
        } else {
            dropdown.classList.remove('show');
            arrow?.classList.remove('active');
        }
    }
}

function handleCreatorComboboxSearch(input) {
    const val = input.value;
    const dropdown = document.getElementById('creator-combobox-dropdown');
    
    // Auto open if typing
    if (!dropdown.classList.contains('show')) {
        dropdown.classList.add('show');
        document.querySelector('.combobox-arrow')?.classList.add('active');
    }
    
    renderCreatorOptions(val);
}

function selectCreator(id, text) {
    selectedCreatorId = id;
    
    // Update Input
    const input = document.getElementById('creator-combobox-input');
    if (input) {
        input.value = text;
        // Optional: Perform a "blur" logic or keep focus? Usually selection implies done.
    }
    
    // Trigger Filter
    mainCurrentPage = 1; 
    renderTableBody();
    
    // Close
    const dropdown = document.getElementById('creator-combobox-dropdown');
    if(dropdown) {
        dropdown.classList.remove('show');
        document.querySelector('.combobox-arrow')?.classList.remove('active');
    }
}


function handleMainSearchKeyup() {
    mainCurrentPage = 1;
    renderTableBody();
}


function copyToClipboard(text, el) {
    // 1. Copy Logic
    if (!navigator.clipboard) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showCopyPopover(el);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }
        document.body.removeChild(textArea);
    } else {
        navigator.clipboard.writeText(text).then(function() {
            showCopyPopover(el);
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
    }
}

function showCopyPopover(el) {
    if (!el) return;
    
    // Remove existing if any global popover
    const existing = document.querySelector('.copy-popover');
    if (existing) existing.remove();

    // Calculate Position
    const rect = el.getBoundingClientRect();
    
    // Create Popover
    const popover = document.createElement('div');
    popover.className = 'copy-popover';
    popover.innerText = 'Copied!';
    
    // Append to body to avoid clipping/stacking issues
    document.body.appendChild(popover);
    
    // Position it: Center horizontally relative to icon, above the icon
    // popover width is unknown until rendered, but we can guess or use transform translate
    // let's use left/top with translate
    
    popover.style.left = (rect.left + rect.width / 2) + 'px';
    popover.style.top = (rect.top - 8) + 'px'; // 8px gap above icon

    // Remove after animation
    setTimeout(() => {
        popover.remove();
    }, 1500);
}

function renderTableBody() {
    const tbody = document.getElementById('inbound-table-body');
    if (!tbody) return;
    
    const filtered = getFilteredMainData();
    const totalPages = Math.max(1, Math.ceil(filtered.length / mainPageSize));
    
    // Ensure current page is valid
    if (mainCurrentPage > totalPages) mainCurrentPage = totalPages;
    if (mainCurrentPage < 1) mainCurrentPage = 1;
    
    const startIdx = (mainCurrentPage - 1) * mainPageSize;
    const pageItems = filtered.slice(startIdx, startIdx + mainPageSize);

    // Status badge helper
    const getStatusBadge = (status) => {
        const statusConfig = {
            'COMPLETED': { label: 'Hoàn thành', color: '#166534' },
            'PROCESSING': { label: 'Đang xử lý', color: '#1c92e1ff' },
            'PENDING': { label: 'Đang chờ', color: '#64748b' },
            'CANCELLED': { label: 'Lỗi', color: '#991b1b' },
            // 'DRAFT': { label: 'Nháp', color: '#6b7280' }
        };
        const config = statusConfig[status] || { label: status, color: '#64748b' };
        return `<span style="display:inline-block; width: fit-content; min-width: 80px; text-align: center; background:transparent; color:${config.color}; border:1px solid ${config.color}; padding: 4px 8px; border-radius:8px; font-size:13px; font-weight:500; white-space:nowrap;">${config.label}</span>`;
    };

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="11" style="text-align:center;color:#64748b;padding:30px;">Không có Lệnh nhập nào phù hợp</td></tr>`;
    } else {
        // Helper for Entry Type Labels
        const getEntryTypeBadge = (type) => {
            const types = {
                'NEW': { label: 'Nhập mới', color: '#3b82f6', bg: '#eff6ff' },
                'REENTRY': { label: 'Nhập lại', color: '#f59e0b', bg: '#fffbeb' },
                'TRANSFER': { label: 'Nhập chuyền thẳng', color: '#10b981', bg: '#f0fdf4' }
            };
            const config = types[type] || { label: type, color: '#64748b', bg: '#f1f5f9' };
            return `<span style="display:inline-block; width: 130px; text-align: center; background:${config.bg}; color:${config.color}; border:1px solid ${config.color}44; padding:4px 8px; border-radius:6px; font-size:12px; font-weight:500; white-space:nowrap;">${config.label}</span>`;
        };

        // Helper to format material info using actual mock data
        tbody.innerHTML = pageItems.map((o, i) => `
            <tr>
                <td class="text-center">${startIdx + i + 1}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        ${o.priority ? `<i class="fas fa-star" style="color: #f59e0b; font-size: 14px; margin-right: 2px;" title="Lệnh này là lệnh ưu tiên"></i>` : ''}
                        <a href="javascript:void(0)" class="text-link code-link-truncate" title="${o.code}" onclick="openOrderDetailModal('${o.id}')">${o.code}</a>
                        <i class="fas fa-copy btn-copy" onclick="copyToClipboard('${o.code}', this)" title="Sao chép"></i>
                    </div>
                </td>
                <td>
                    <div class="product-list">
                        ${o.materials.map(m => `
                            <div class="product-item" style="max-width: 100%; overflow: hidden;">
                                <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%;">
                                    <span class="prod-code" style="font-weight: 500; color: #0284c7; font-size: 13px;">${m.code}</span>
                                    <span style="font-weight: 600; color: #334155; font-size: 14px; margin-left: 4px;"> - ${m.name}</span>
                                </div>
                                <div style="font-size:13px; color:#334155; margin-top: 4px;">
                                    Số lượng: <span style="font-weight:700;">${m.qty} ${m.unit}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </td>
                <td>
                    <div class="product-item" style="border-bottom:none; min-height: fit-content; padding-left: 18px;">
                        <div class="pallet-list" style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom: 2px;">
                            ${o.pallets.length ? o.pallets.map(p => `
                                <span class="pallet-tag" style="background:#e0f2fe;border:1px solid #7dd3fc;padding:2px 6px;font-size:12px;font-weight:500;border-radius:4px;color:#0369a1">Container: ${p}</span>
                            `).join('') : '<span class="no-pallet">-</span>'}
                        </div>
                        ${o.status === 'COMPLETED' && o.bin 
                            ? `<div style="color:#cbd5e1; font-size:10px; margin: 2px 0;">-</div>
                               <span class="bin-tag" style="background:#f8fafc;border:1px solid #e2e8f0;padding:2px 6px;font-size:12px;font-weight:500;border-radius:4px;color:#64748b; width: fit-content;">Vị trí: ${formatBinLocation(o.bin)}</span>` 
                            : ''
                        }
                    </div>
                </td>
                <td class="text-center">
                    ${getEntryTypeBadge(o.type)}
                </td>
                <td style="text-align:center;">${getStatusBadge(o.status)}</td>
                <td style="text-align: left;">
                    <div class="product-item" style="border-bottom:none; min-height: fit-content; padding-left: 18px;">
                        <div style="font-size: 13px; color: #334155;">
                            <span style="font-weight: 600;">Thời gian:</span> ${formatDateTime(o.createdAt).replace(' - ', ' ')}
                        </div>
                        <div style="font-size: 13px; color: #334155; margin-top: 2px;">
                            <span style="font-weight: 600;">Người tạo:</span> ${(() => {
                                const u = MOCK_USER_DATA[o.creator.id];
                                return u ? `${u.fullname} (${u.username})` : o.creator.name;
                            })()}
                        </div>
                    </div>
                </td>
                <td class="text-center">
                    <button class="btn-icon btn-delete" 
                        ${o.status === 'PENDING' ? '' : 'disabled style="opacity:0.3; cursor:not-allowed"'} 
                        onclick="deleteInboundOrder('${o.id}')" 
                        title="${o.status === 'PENDING' ? 'Xóa' : 'Chỉ có thể xóa lệnh đang chờ'}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    // Update info
    const startRange = filtered.length > 0 ? startIdx + 1 : 0;
    const endRange = Math.min(startIdx + mainPageSize, filtered.length);
    const mainInfo = document.getElementById('main-info');
    if (mainInfo) mainInfo.innerText = `Hiển thị ${startRange} - ${endRange} trong ${filtered.length}`;
    
    // Render pagination
    renderMainPagination(totalPages, filtered.length);
}

function deleteInboundOrder(id) {
    showCustomConfirm('Bạn có chắc chắn muốn xóa Lệnh nhập này không?', () => {
        // Find index using loose equality for id/code mix
        const idx = MOCK_INBOUND_ORDERS.findIndex(o => o.id == id || o.code === id);
        if(idx !== -1) {
            if(MOCK_INBOUND_ORDERS[idx].status !== 'PENDING') {
                showToast('Chỉ có thể xóa các Lệnh nhập ở trạng thái Đang chờ (PENDING).', 'error');
                return;
            }
            MOCK_INBOUND_ORDERS.splice(idx, 1);
            renderTableBody(); // Re-render table
            showToast('Đã xóa Lệnh nhập thành công!', 'success');
        }
    });
}

function syncTableScroll() {
    const headerScroll = document.getElementById('headerScroll');
    const bodyScroll = document.getElementById('bodyScroll');
    const customScroll = document.getElementById('customScroll');

    if (bodyScroll && headerScroll && customScroll) {
        // When user scrolls via the custom scrollbar (most common)
        customScroll.addEventListener('scroll', () => {
            const scrollLeft = customScroll.scrollLeft;
            headerScroll.scrollLeft = scrollLeft;
            bodyScroll.scrollLeft = scrollLeft;
        });

        // When user scrolls the table body (touch, trackpad, shift+wheel)
        bodyScroll.addEventListener('scroll', () => {
            const scrollLeft = bodyScroll.scrollLeft;
            headerScroll.scrollLeft = scrollLeft;
            customScroll.scrollLeft = scrollLeft;
        });
    }
}





// Initial Render
// Check if loaded dynamically (DOMContentLoaded already fired) or standalone
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initDefaultDateRange();
        initCreatorCombobox();
        renderTableBody();
        syncTableScroll();
    });
} else {
    // DOM already ready (dynamic load)
    initDefaultDateRange();
    initCreatorCombobox();
    renderTableBody();
    syncTableScroll();
}

function printInboundOrder(orderId) {
    // Use loose equality (==) for id to handle string/number mismatch
    const order = MOCK_INBOUND_ORDERS.find(o => o.id == orderId || o.code === orderId);
    if (!order) return alert('Không tìm thấy Lệnh nhập');
    
    const printWindow = window.open('', '_blank');
    let htmlContent = `
    <html>
    <head>
        <title>In QR Code mã Lệnh - ${order.code}</title>
        <style>
            body { font-family: 'Times New Roman', serif; padding: 20px; }
            .label-container { 
                width: 600px; 
                border: 1px solid #000; 
                margin-bottom: 20px; 
                page-break-inside: avoid;
            }
            table { width: 100%; border-collapse: collapse; }
            td, th { border: 1px solid #000; padding: 5px 8px; vertical-align: middle; font-size: 14px; }
            .label-header { font-weight: bold; width: 120px; white-space: nowrap; }
            .qr-cell { text-align: center; vertical-align: middle; padding: 10px; }
            .qr-caption { margin-top: 10px; font-weight: bold; font-size: 16px; }
            @media print {
                @page { margin: 0; }
                body { margin: 1cm; }
            }
        </style>
    </head>
    <body>`;

    order.materials.forEach(m => {
        // Mock dimensions/weight if missing
        const dims = m.dimensions || { length: 50, width: 30, height: 10 }; // Default as per image example values?
        const weight = m.weight || 5000;
        const expiry = m.expiryDate ? new Date(m.expiryDate).toLocaleDateString('en-GB') : '-';
        const qrData = encodeURIComponent(`${order.code}|${m.code}`);
        
        htmlContent += `
        <div class="label-container">
            <table>
                <tr>
                    <td class="label-header">Mã Lệnh nhập</td>
                    <td><b>${order.code}</b></td>
                    <td class="label-header">Tên Lệnh nhập</td>
                    <td>-</td>
                </tr>
                <tr>
                    <td class="label-header">Mã vật tư</td>
                    <td><b>${m.code}</b></td>
                    <td rowspan="7" colspan="2" class="qr-cell">
                        <!-- QR Code -->
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}" alt="QR Code" width="120" height="120">
                    </td>
                </tr>
                <tr>
                    <td class="label-header">Tên vật tư</td>
                    <td>${m.name}</td>
                </tr>
                <tr>
                    <td class="label-header">Trọng lượng</td>
                    <td>${weight}kg</td>
                </tr>
                <tr>
                    <td class="label-header">HSD</td>
                    <td>${expiry}</td>
                </tr>
                <tr>
                    <td class="label-header">Dài (cm)</td>
                    <td>${dims.length}</td>
                </tr>
                <tr>
                    <td class="label-header">Rộng (cm)</td>
                    <td>${dims.width}</td>
                </tr>
                <tr>
                    <td class="label-header">Cao (cm)</td>
                    <td>${dims.height}</td>
                </tr>
            </table>
        </div>`;
    });

    htmlContent += `
    </body>
    </html>`;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    // printWindow.print(); // Auto print if desired, but nice to preview first
}

function renderMainPagination(totalPages, totalItems) {
    const container = document.getElementById('main-pagination');
    if (!container) return;
    
    if (totalItems === 0) {
        container.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Previous button
    html += `<button class="btn-page" ${mainCurrentPage === 1 ? 'disabled' : ''} onclick="goToMainPage(${mainCurrentPage - 1})" style="padding:6px 10px;border:1px solid #e2e8f0;border-radius:6px;background:#fff;cursor:pointer;"><i class="fas fa-chevron-left"></i></button>`;
    
    // Page numbers
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
    
    // Next button
    html += `<button class="btn-page" ${mainCurrentPage === totalPages ? 'disabled' : ''} onclick="goToMainPage(${mainCurrentPage + 1})" style="padding:6px 10px;border:1px solid #e2e8f0;border-radius:6px;background:#fff;cursor:pointer;"><i class="fas fa-chevron-right"></i></button>`;
    
    container.innerHTML = html;
    
    // Clear go-to-page input
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
    const input = document.getElementById('main-go-page');
    const page = parseInt(input?.value);
    if (!page || isNaN(page)) return;
    goToMainPage(page);
}

function openCreateModal() { 
    console.log('openCreateModal called');
    var modal = document.getElementById('modal-create');
    console.log('modal-create element:', modal);
    console.log('modal-create parent:', modal ? modal.parentElement : 'N/A');
    console.log('modal-create current display:', modal ? modal.style.display : 'N/A');
    if(!modal) { 
        console.error('modal-create element not found in DOM'); 
        return; 
    }
    // Add 'show' class and set opacity for compatibility with sidebar.css
    modal.classList.add('show');
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    console.log('modal-create display set to flex, computed style:', window.getComputedStyle(modal).display);
    
    // Populate staff select
    const sel = document.getElementById('staff-select');
    if(sel && sel.innerHTML === "") sel.innerHTML = STAFF_LIST.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    
    // Reset selected materials
    selectedMaterials = [];
    
    // Show initial section (just button), hide selected section (table)
    const initialSection = document.getElementById('materials-initial');
    const selectedSection = document.getElementById('materials-selected');
    if (initialSection) initialSection.style.display = 'flex';
    if (selectedSection) selectedSection.style.display = 'none';
    
    // Reset stepper UI
    const step2Circle = document.getElementById('step2-circle');
    const step2Label = document.getElementById('step2-label');
    if(step2Circle) {
        step2Circle.style.background = 'white';
        step2Circle.style.color = '#94a3b8';
        step2Circle.style.border = '2px dashed #94a3b8';
        step2Circle.innerText = '2';
    }
    if(step2Label) step2Label.style.color = '#94a3b8';
    
    const conn23 = document.getElementById('connector-2-3');
    if(conn23) conn23.style.background = '#e2e8f0';
    
    const step3Circle = document.getElementById('step3-circle');
    const step3Label = document.getElementById('step3-label');
    if(step3Circle) {
        step3Circle.style.background = 'white';
        step3Circle.style.color = '#94a3b8';
        step3Circle.style.border = '2px dashed #94a3b8';
    }
    if(step3Label) {
        step3Label.style.color = '#94a3b8';
        step3Label.style.fontWeight = '500';
    }
    
    // reset create-search when opening modal
    createSearchQuery = '';
    createSearchPage = 1;
    const searchInput = document.getElementById('selected-search');
    if (searchInput) searchInput.value = '';
    
    renderSelectedMaterials();

    // Reset UI for added materials
    const vatTuInput = document.getElementById('inputVatTu');
    const soLuongInput = document.getElementById('inputSoLuong');
    const btnScanVatTu = document.getElementById('btnScanVatTu');
    const addedContainer = document.getElementById('added-materials-container');
    
    if (vatTuInput) {
        vatTuInput.value = '';
        vatTuInput.readOnly = false;
        vatTuInput.style.backgroundColor = '';
        vatTuInput.style.cursor = '';
    }
    if (soLuongInput) {
        soLuongInput.value = '';
        soLuongInput.readOnly = false;
        soLuongInput.style.backgroundColor = '';
        soLuongInput.removeAttribute('data-min');
        soLuongInput.style.borderColor = '';
    }
    if (btnScanVatTu) {
        btnScanVatTu.disabled = false;
    }
    if (addedContainer) addedContainer.style.display = 'none';
    
    // Reset History Section
    const historySection = document.getElementById('pallet-history-section');
    if (historySection) {
        historySection.style.display = 'none';
        const historyBody = document.getElementById('pallet-history-body');
        if (historyBody) historyBody.innerHTML = '';
    }

    // renderAddedMaterialsUI(); // Removed undefined call
    
    // Auto-focus on Mã Pallet field after modal is shown
    const palletField = document.getElementById('inputPallet');
    setTimeout(function() {
        if (palletField) palletField.focus();
    }, 200);
}

function renderAddedMaterialsUI() {
    // Basic placeholder to prevent errors
    console.log('Rendering added materials list...');
}

// State for weight validation
let currentPalletMaxCapacity = null;
let currentMaterialWeightPerUnit = null;

function handlePalletScan(code) {
    code = (code || "").trim();
    console.log('Scanning pallet:', code);

    const data = MOCK_PALLET_DATA[code];
    const vatTuInput = document.getElementById('inputVatTu');
    const soLuongInput = document.getElementById('inputSoLuong');
    const btnScanVatTu = document.getElementById('btnScanVatTu');
    const historySection = document.getElementById('pallet-history-section');
    const historyBody = document.getElementById('pallet-history-body');
    const capacityInfo = document.getElementById('pallet-capacity-info');
    const capacityText = document.getElementById('pallet-max-capacity-text');

    // For any valid pallet code (min 4 chars), show capacity
    // Use mock data if available, otherwise generate a default based on code
    const isValidPalletCode = code.length >= 3;

    if (isValidPalletCode) {
        // Determine capacity: from mock data or derive a default
        let capacity = (data && data.maxCapacity) ? data.maxCapacity : null;
        if (!capacity) {
            // Generate deterministic default capacity from code hash
            let hash = 0;
            for (let i = 0; i < code.length; i++) hash = (hash * 31 + code.charCodeAt(i)) & 0xffff;
            const capacityOptions = [500, 800, 1000, 1200, 1500, 2000, 2500, 3000];
            capacity = capacityOptions[hash % capacityOptions.length];
        }
        currentPalletMaxCapacity = capacity;
        
        // Show capacity info
        if (capacityInfo && capacityText) {
            capacityText.textContent = capacity.toLocaleString() + ' kg';
            capacityInfo.style.display = 'block';
        }
    }

    if (data) {

        // Calculate remaining qty
        const totalExported = data.history.reduce((sum, item) => sum + item.exported, 0);
        const remaining = data.material.totalQty - totalExported;

        // Fill material info
        if (vatTuInput) {
            vatTuInput.value = data.material.code;
            vatTuInput.readOnly = true;
            vatTuInput.style.backgroundColor = '#f1f5f9';
            vatTuInput.style.cursor = 'not-allowed';
            // Trigger vattu handler to show weight
            handleVatTuInput(data.material.code);
        }
        
        if (soLuongInput) {
            soLuongInput.value = remaining > 0 ? remaining : 0;
            soLuongInput.readOnly = false;
            soLuongInput.style.backgroundColor = '';
            // Store min value for validation
            soLuongInput.setAttribute('data-min', remaining);
            
            // Add one-time validation listener
            if (!soLuongInput.dataset.valListener) {
                soLuongInput.addEventListener('change', function() {
                    const min = parseFloat(this.getAttribute('data-min'));
                    const val = parseFloat(this.value);
                    if (!isNaN(min) && val < min) {
                        showToast('Số lượng không được nhỏ hơn số lượng còn lại của pallet (' + min + ')', 'error');
                        this.value = min;
                        this.style.borderColor = 'red';
                    } else {
                        this.style.borderColor = '';
                    }
                });
                soLuongInput.dataset.valListener = 'true';
            }
            // Update total weight display
            handleSoLuongInput(soLuongInput.value);
        }

        // Disable scan button for pallets with history to prevent material changes
        if (btnScanVatTu) {
            btnScanVatTu.disabled = true;
        }

        // Render history
        if (historySection && historyBody) {
            historySection.style.display = 'block';
            historyBody.innerHTML = data.history.map(item => `
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${item.code}</td>
                    <td class="text-center" style="padding: 10px; border-bottom: 1px solid #f1f5f9;">
                        <span style="color: #3b82f6; font-weight: 600;">${item.exported}</span> / 
                        <span style="color: #64748b;">${item.total}</span>
                    </td>
                    <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${item.time}</td>
                </tr>
            `).join('');
        }
    } else {
        // No mock data for this pallet - clear pre-filled material if any
        // But keep capacity (already set for valid codes above)
        if (!isValidPalletCode) {
            // Code is empty/too short - clear everything
            currentPalletMaxCapacity = null;
            if (capacityInfo) capacityInfo.style.display = 'none';
        }
        
        // Clear vattu if it was previously auto-filled
        if (vatTuInput && vatTuInput.readOnly) {
            vatTuInput.value = '';
            vatTuInput.readOnly = false;
            vatTuInput.style.backgroundColor = '';
            vatTuInput.style.cursor = '';
        }
        if (soLuongInput && soLuongInput.readOnly) {
            soLuongInput.value = '';
            soLuongInput.readOnly = false;
            soLuongInput.style.backgroundColor = '';
        }
        if (btnScanVatTu) {
            btnScanVatTu.disabled = false;
        }
        if (historySection) historySection.style.display = 'none';
    }
}

// Handle vattu input - works for any format: VT001, VT-001, MAT-001, PL-1001, ABC123...
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

    // Step 1: Try exact match in MASTER_MATERIALS
    let mat = MASTER_MATERIALS.find(m => m.code.toUpperCase() === code);

    // Step 2: Strip ALL leading letters/dashes, keep only the numeric part
    // e.g. VT001→1, VT-001→1, MAT-007→7, PL-1001→1001, ABC-12→12
    if (!mat) {
        const numericMatch = code.match(/(\d+)$/);
        if (numericMatch) {
            const num = parseInt(numericMatch[1], 10);
            const padded = 'MAT-' + String(num).padStart(3, '0');
            mat = MASTER_MATERIALS.find(m => m.code.toUpperCase() === padded);
        }
    }

    if (mat) {
        currentMaterialWeightPerUnit = mat.weightPerUnit || mat.weight || 0;
        if (matWeightInfo && matWeightText) {
            matWeightText.textContent = currentMaterialWeightPerUnit + ' kg/' + mat.unit;
            matWeightInfo.style.display = 'block';
        }
    } else {
        // Step 3: Fallback - generate deterministic weight from code so display always works
        let hash = 0;
        for (let i = 0; i < code.length; i++) hash = (hash * 31 + code.charCodeAt(i)) & 0xffff;
        const weightOptions = [0.5, 1, 1.5, 2, 2.5, 5, 8, 10, 12, 15, 20, 25, 30, 50];
        const unitOptions = ['kg', 'cái', 'thùng', 'kg', 'cái'];
        currentMaterialWeightPerUnit = weightOptions[hash % weightOptions.length];
        const unit = unitOptions[(hash >> 4) % unitOptions.length];
        if (matWeightInfo && matWeightText) {
            matWeightText.textContent = currentMaterialWeightPerUnit + ' kg/' + unit;
            matWeightInfo.style.display = 'block';
        }
    }
    
    updateTotalWeightDisplay();
    if (typeof validatePDAForm === 'function') validatePDAForm();
}

// Handle quantity input - show total weight and validate against pallet capacity
function handleSoLuongInput(value) {
    updateTotalWeightDisplay();
}

function updateTotalWeightDisplay() {
    const totalWeightInfo = document.getElementById('total-weight-info');
    const totalWeightText = document.getElementById('total-weight-text');
    const soLuongInput = document.getElementById('inputSoLuong');
    
    if (!totalWeightInfo || !totalWeightText) return;
    
    const qty = parseFloat(soLuongInput?.value) || 0;
    
    if (!currentMaterialWeightPerUnit || !qty) {
        totalWeightInfo.style.display = 'none';
        return;
    }
    
    const totalWeight = currentMaterialWeightPerUnit * qty;
    totalWeightText.textContent = `${totalWeight.toLocaleString()} kg`;
    totalWeightInfo.style.display = 'block';
    
    // Check against pallet capacity
    if (currentPalletMaxCapacity && totalWeight > currentPalletMaxCapacity) {
        totalWeightInfo.style.background = '#fef2f2';
        totalWeightInfo.style.border = '1px solid #fecaca';
        totalWeightInfo.style.color = '#dc2626';
        if (soLuongInput) soLuongInput.style.borderColor = '#ef4444';
        totalWeightText.innerHTML = `${totalWeight.toLocaleString()} kg <span style="font-size: 11px; margin-left: 6px;">⚠️ Vượt sức chứa (${currentPalletMaxCapacity.toLocaleString()} kg)</span>`;
    } else {
        totalWeightInfo.style.background = '#f0fdf4';
        totalWeightInfo.style.border = '1px solid #bbf7d0';
        totalWeightInfo.style.color = '#15803d';
        if (soLuongInput) soLuongInput.style.borderColor = '';
    }
}

// Expose to window
window.handleVatTuInput = handleVatTuInput;
window.handleSoLuongInput = handleSoLuongInput;
window.updateTotalWeightDisplay = updateTotalWeightDisplay;

// Expose to window
window.handlePalletScan = handlePalletScan;

function closeCreateModal() { 
    var modal = document.getElementById('modal-create');
    if(modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
    }
}

// Handler for segmented tabs in Create Modal
function switchInboundTab(el, type) {
    // Update active class on tabs
    const tabs = document.querySelectorAll('.segment-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    el.classList.add('active');
    
    console.log('Switched to inbound type:', type);
    currentTabMode = type;
    const expGroup = document.getElementById('expiry-date-group');
    const destGroup = document.getElementById('next-destination-group');
    const palletHelper = document.getElementById('pallet-helper-text');
    
    if (type === 'transfer') {
        if (expGroup) expGroup.style.display = 'none';
        if (destGroup) destGroup.style.display = 'block';
        if (palletHelper) palletHelper.style.display = 'none';
    } else {
        if (expGroup) expGroup.style.display = 'block';
        if (destGroup) destGroup.style.display = 'none';
        if (palletHelper) palletHelper.style.display = 'block';
    }
    
    // Clear inputs when swapping to prevent validation issues
    const inputExp = document.getElementById('inputExpiry');
    const inputDest = document.getElementById('inputNextDestination');
    const hiddenDest = document.getElementById('selectedDestinationId');
    if (inputExp && type === 'transfer') inputExp.value = '';
    if (inputDest && type === 'normal') {
        inputDest.value = '';
        if (hiddenDest) hiddenDest.value = '';
        selectedDestinationId = '';
    }
    
    if (typeof validatePDAForm === 'function') validatePDAForm();
}

// Expose to window
window.switchInboundTab = switchInboundTab;

function saveInboundDraft() {
    // Validate inputs
    const code = document.getElementById('new-code')?.value;
    if(!code) {
        showToast('Vui lòng nhập mã Lệnh', 'error');
        return;
    }
    
    // Create new order object
    const newOrder = {
        id: code,
        code: code,
        type: 'Nhập mua hàng', // Value from select if needed
        warehouse: 'Kho Cơ Khí', // Default or from select
        creator: { name: 'Nguyễn Văn A' }, // From staff select - match structure expected by render
        createdAt: new Date().toISOString(),
        status: 'PENDING', // Mới tạo -> Mới tạo
        materials: [...selectedMaterials], // Store details for rendering and printing
        pallets: [],
        bin: '',
        items: selectedMaterials.length,
        totalQty: selectedMaterials.reduce((acc, curr) => acc + (curr.qty || 0), 0)
    };
    
    // Add to mock data (prepend)
    MOCK_INBOUND_ORDERS.unshift(newOrder);
    
    // Refresh table
    mainCurrentPage = 1;
    renderTableBody();
    
    // Close modal
    closeCreateModal();
    
    // Show success message (optional)
    // alert('Đã lưu Lệnh nhập thành công');
}
function handleImportExcel() { document.getElementById('modal-import-excel').style.display = 'flex'; }
function closeImportModal() { document.getElementById('modal-import-excel').style.display = 'none'; }
function toggleSelectAll(master) { document.querySelectorAll('.mat-checkbox').forEach(cb => cb.checked = master.checked); }

function handleMaterialSearch(val) { materialSearchQuery = val; currentMaterialPage = 1; renderMaterialTable(); }

function renderMaterialTable() {
    // legacy function kept for compatibility but not used for selection modal
}

// --- Selection modal functions ---
function openSelectModal() {
    document.getElementById('modal-select-material').style.display = 'flex';
    selectSearchQuery = '';
    selectPage = 1;
    
    // Reset checkboxes and confirm button
    const selectAll = document.getElementById('select-all-checkbox');
    if (selectAll) selectAll.checked = false;
    
    renderSelectMaterialTable();
    updateConfirmButton();
}
function closeSelectModal() { document.getElementById('modal-select-material').style.display = 'none'; }

function handleSelectSearch(val) { selectSearchQuery = val || ''; selectPage = 1; renderSelectMaterialTable(); }

function renderSelectMaterialTable() {
    const tbody = document.getElementById('select-material-body');
    if(!tbody) return;
    const filtered = MASTER_MATERIALS.filter(m => m.code.toLowerCase().includes(selectSearchQuery.toLowerCase()) || m.name.toLowerCase().includes(selectSearchQuery.toLowerCase()));
    const total = Math.max(1, Math.ceil(filtered.length / materialPageSize));
    const start = (selectPage - 1) * materialPageSize;
    const pageItems = filtered.slice(start, start + materialPageSize);

    // Helper to format material details
    const formatMaterialDetails = (m) => {
        let expStr = '-';
        if (m.expiryDate) {
            const d = new Date(m.expiryDate);
            expStr = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
        }
        return `<div style="font-size:11px;color:#64748b;line-height:1.4;">
            <div>KL: ${m.weight || 0}kg | ĐVT: ${m.unit}</div>
            <div>HSD: ${expStr}</div>
        </div>`;
    };

    // Helper to format dimensions
    const formatDimensions = (m) => {
        const dim = m.dimensions || { length: 0, width: 0, height: 0 };
        return `<div style="font-size:11px;color:#64748b;line-height:1.4;">
            <div>Dài: ${dim.length}mm</div>
            <div>Rộng: ${dim.width}mm</div>
            <div>Cao: ${dim.height}mm</div>
        </div>`;
    };

    tbody.innerHTML = pageItems.map((m, i) => {
        const dim = m.dimensions || { length: 0, width: 0, height: 0 };
        return `
        <tr>
            <td class="text-center"><input type="checkbox" class="select-checkbox" data-idx="${start + i}" onchange="updateConfirmButton()"></td>
            <td class="text-center">${start + i + 1}</td>
            <td><code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;">${m.code}</code></td>
            <td>${m.name}</td>
            <td>${formatMaterialDetails(m)}</td>
            <td class="text-center" style="font-size:12px;color:#475569">${dim.length}</td>
            <td class="text-center" style="font-size:12px;color:#475569">${dim.width}</td>
            <td class="text-center" style="font-size:12px;color:#475569">${dim.height}</td>
        </tr>
    `}).join('');

    const pag = document.getElementById('select-material-pagination');
    if(pag) {
        let html = `<button class="btn-page" ${selectPage === 1 ? 'disabled' : ''} onclick="goToSelectPage(${selectPage - 1})"><i class="fas fa-chevron-left"></i></button>`;
        for(let i=1;i<=total;i++) {
            if(i<=2 || i>total-2 || (i>=selectPage-1 && i<=selectPage+1)) {
                html += `<button class="btn-page ${i===selectPage?'active':''}" onclick="goToSelectPage(${i})">${i}</button>`;
            } else if(i===3 && selectPage>4) {
                html += `<span style="padding:0 6px;color:#64748b">...</span>`;
            } else if(i===total-2 && selectPage<total-3) {
                html += `<span style="padding:0 6px;color:#64748b">...</span>`;
            }
        }
        html += `<button class="btn-page" ${selectPage === total ? 'disabled' : ''} onclick="goToSelectPage(${selectPage + 1})"><i class="fas fa-chevron-right"></i></button>`;
        pag.innerHTML = html;
        // hide pagination if no items (hide the whole right-controls wrapper)
        pag.style.display = filtered.length === 0 ? 'none' : 'flex';
        if(pag.parentElement) pag.parentElement.style.display = filtered.length === 0 ? 'none' : 'flex';
    }

    // update info
    const info = document.getElementById('select-info');
    if(info) {
        const totalItems = filtered.length;
        const showing = pageItems.length;
        info.innerText = `Hiển thị ${showing} trong tổng ${totalItems}`;
    }
    const input = document.getElementById('select-go-page'); if(input) input.value = '';
}

function goToSelectPageFromInput() {
    const v = Number(document.getElementById('select-go-page').value || 0);
    if(!v || isNaN(v)) return;
    goToSelectPage(v);
}

function goToSelectPage(p) { selectPage = p; renderSelectMaterialTable(); }

function toggleSelectAllModal(master) { 
    document.querySelectorAll('#select-material-body .select-checkbox').forEach(cb => cb.checked = master.checked);
    updateConfirmButton();
}

// Update confirm button state based on selected checkboxes
function updateConfirmButton() {
    const checkboxes = Array.from(document.querySelectorAll('#select-material-body .select-checkbox'));
    const checkedCount = checkboxes.filter(cb => cb.checked).length;
    const btn = document.getElementById('btn-confirm-select');
    if (btn) {
        btn.disabled = checkedCount === 0;
    }
}

function confirmSelectMaterials() {
    const checkboxes = Array.from(document.querySelectorAll('#select-material-body .select-checkbox'));
    const chosen = [];
    checkboxes.forEach(cb => {
        if(cb.checked) {
            const idx = parseInt(cb.getAttribute('data-idx'));
            if(!isNaN(idx) && MASTER_MATERIALS[idx]) chosen.push(Object.assign({}, MASTER_MATERIALS[idx]));
        }
    });
    if(chosen.length === 0) {
        showToast('Chưa chọn vật tư', 'error');
        return;
    }
    
    // Show confirm popup
    showCustomConfirm(`Bạn muốn thêm ${chosen.length} vật tư đã chọn?`, () => {
        // Add materials
        chosen.forEach(c => { if(!selectedMaterials.find(s => s.code === c.code)) selectedMaterials.push(Object.assign({qty:0}, c)); });
        renderSelectedMaterials();
        
        // Toggle materials sections
        const initialSection = document.getElementById('materials-initial');
        const selectedSection = document.getElementById('materials-selected');
        if (initialSection) initialSection.style.display = 'none';
        if (selectedSection) selectedSection.style.display = 'block';
        
        // Update Stepper UI to Step 3 (Hoàn thành)
        // Step 2: Completed
        const step2Circle = document.getElementById('step2-circle');
        const step2Label = document.getElementById('step2-label');
        if(step2Circle) {
            step2Circle.style.background = '#0d6bb9';
            step2Circle.style.color = 'white';
            step2Circle.style.border = 'none';
            step2Circle.innerText = '✓';
        }
        if(step2Label) step2Label.style.color = '#0d6bb9';
        
        // Connector 2-3
        const conn23 = document.getElementById('connector-2-3');
        if(conn23) conn23.style.background = '#0d6bb9';
        
        // Step 3: Active
        const step3Circle = document.getElementById('step3-circle');
        const step3Label = document.getElementById('step3-label');
        if(step3Circle) {
            step3Circle.style.background = '#0d6bb9';
            step3Circle.style.color = 'white';
            step3Circle.style.border = 'none';
        }
        if(step3Label) {
            step3Label.style.color = '#0d6bb9';
            step3Label.style.fontWeight = '600';
        }

        closeSelectModal();
        
        // Open Step 3 confirmation modal
        openStep3Modal();
    });
}

// Step 3 Modal Functions
function openStep3Modal() {
    document.getElementById('modal-step3-confirm').style.display = 'flex';
    renderStep3Summary();
}

function closeStep3Modal() {
    document.getElementById('modal-step3-confirm').style.display = 'none';
}

function backToStep2() {
    closeStep3Modal();
    openSelectModal();
}

function renderStep3Summary() {
    // Render receipt info
    const receiptInfo = document.getElementById('step3-receipt-info');
    if (receiptInfo) {
        const code = document.getElementById('new-code')?.value || 'Chưa có';
        const staffSelect = document.getElementById('staff-select');
        const staff = staffSelect?.options[staffSelect.selectedIndex]?.text || 'Chưa chọn';
        const dateInputs = document.querySelectorAll('#modal-create input[type="date"]');
        const importDate = dateInputs[0]?.value ? new Date(dateInputs[0].value).toLocaleDateString('vi-VN') : 'Chưa chọn';
        const typeSelect = document.querySelector('#modal-create select.form-control');
        const type = typeSelect?.value || 'Nhập mua hàng';
        
        receiptInfo.innerHTML = `
            <div><strong>Mã Lệnh:</strong> <span style="color:#0d6bb9; font-weight:600;">${code}</span></div>
            <div><strong>Loại Lệnh:</strong> ${type}</div>
            <div><strong>Ngày nhập:</strong> ${importDate}</div>
            <div><strong>Nhân viên:</strong> ${staff}</div>
            <div><strong>Số vật tư:</strong> ${selectedMaterials.length}</div>
            <div><strong>Trạng thái:</strong> <span style="display:inline-block;width: fit-content; min-width: 80px; text-align:center;background:transparent;color:#92400e;border:1px solid #92400e;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;">Đang chờ</span></div>
        `;
    }
    
    // Render materials list
    const materialCount = document.getElementById('step3-material-count');
    if (materialCount) materialCount.innerText = selectedMaterials.length;
    
    const tbody = document.getElementById('step3-materials-body');
    if (tbody) {
        if (selectedMaterials.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#64748b;padding:20px;">Chưa chọn vật tư</td></tr>`;
        } else {
            tbody.innerHTML = selectedMaterials.map((m, i) => `
                <tr>
                    <td class="text-center">${i + 1}</td>
                    <td><code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;">${m.code}</code></td>
                    <td>${m.name}</td>
                    <td class="text-center">${m.qty || 0}</td>
                    <td style="font-size:11px;color:#64748b;">${m.specs || '-'}</td>
                </tr>
            `).join('');
        }
    }
}

function finalSaveInbound() {
    // Get form data
    const code = document.getElementById('new-code')?.value;
    if (!code) {
        showToast('Vui lòng nhập mã Lệnh', 'error');
        return;
    }
    if (selectedMaterials.length === 0) {
        showToast('Vui lòng chọn ít nhất 1 vật tư', 'error');
        return;
    }
    
    const staffSelect = document.getElementById('staff-select');
    const staffName = staffSelect?.options[staffSelect.selectedIndex]?.text || 'Nguyễn Văn A';
    
    // Create new order
    const newOrder = {
        id: code,
        code: code,
        type: 'Nhập mua hàng',
        warehouse: 'Kho Cơ Khí',
        creator: { name: staffName },
        createdAt: new Date().toISOString(),
        status: 'PENDING',
        materials: [...selectedMaterials],
        pallets: [],
        bin: '',
        items: selectedMaterials.length,
        totalQty: selectedMaterials.reduce((acc, curr) => acc + (curr.qty || 0), 0)
    };
    
    MOCK_INBOUND_ORDERS.unshift(newOrder);
    mainCurrentPage = 1;
    renderTableBody();
    
    // Close all modals
    closeStep3Modal();
    closeCreateModal();
    
    // Show success (optional toast)
    showToast('Đã lưu Lệnh nhập thành công!', 'success');
}

function renderSelectedMaterials() {
    const tbody = document.getElementById('modal-material-body');
    if(!tbody) return;
    if(selectedMaterials.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#64748b; padding:20px">Chưa chọn vật tư. Nhấn "Thêm vật tư" để chọn hoặc tìm nhanh ở ô tìm kiếm.</td></tr>`;
        updateBulkDeleteButton();
        return;
    }
    tbody.innerHTML = selectedMaterials.map((m, i) => `
        <tr>
            <td class="text-center"><input type="checkbox" class="selected-row-cb" data-idx="${i}"></td>
            <td class="text-center">${i+1}</td>
            <td><code>${m.code}</code></td>
            <td>${m.name}</td>
            <td class="qty-display">${m.qty || 0}</td>
            <td style="color:#64748b; font-size:11px">${m.specs}</td>
            <td class="text-center"><button class="btn-icon btn-view" onclick="viewSelected(${i})"><i class="fas fa-eye"></i></button> <button class="btn-icon btn-delete" onclick="confirmDeleteSingle(${i})"><i class="fas fa-trash-alt"></i></button></td>
        </tr>
    `).join('');
    // wire checkbox change handlers and update bulk-delete button
    document.querySelectorAll('.selected-row-cb').forEach(cb => cb.onchange = updateBulkDeleteButton);
    // ensure master bulk checkbox reflects page state
    const master = document.getElementById('selected-bulk-checkbox'); if(master) master.checked = Array.from(document.querySelectorAll('.selected-row-cb')).every(c=>c.checked) && document.querySelectorAll('.selected-row-cb').length>0;
    updateBulkDeleteButton();
}

function updateSelectedQty(idx, val) { if(selectedMaterials[idx]) selectedMaterials[idx].qty = Number(val)||0; }

function saveInboundDraft() {
    // placeholder: show selected materials in console and close modal
    console.log('--- INBOUND MODULE JS START ---');
    console.log('DEBUG: Inbound JS is EXECUTING! Version: ' + new Date().getTime());
    window.__inbound_loaded = false;
    console.log('Saving inbound draft with materials:', selectedMaterials);
    showToast('Lệnh nhập đã được lưu tạm (console.log)', 'info');
    closeCreateModal();
}

// Custom confirm modal helpers
function showCustomConfirm(message, onConfirm) {
    const modal = document.getElementById('custom-confirm');
    const msg = document.getElementById('custom-confirm-msg');
    const ok = document.getElementById('custom-confirm-ok');
    if(!modal || !msg || !ok) {
        showToast(message, 'warning');
        if (onConfirm) onConfirm();
        return;
    }
    msg.innerText = message;
    modal.style.display = 'flex';
    // remove previous handler
    ok.onclick = null;
    ok.onclick = () => { modal.style.display='none'; onConfirm && onConfirm(); };
}
function closeCustomConfirm() { const modal = document.getElementById('custom-confirm'); if(modal) modal.style.display='none'; }

// Pagination helpers for selected materials (client-side)
let selectedPage = 1;
function renderSelectedMaterialsPaged() {
    // show selectedMaterials paged with materialPageSize
    const tbody = document.getElementById('modal-material-body'); if(!tbody) return;
    // If there is an active create search, display search results in this table instead
    if(createSearchQuery && createSearchQuery.length>0) {
        renderCreateSearchResults();
        return;
    }

    const total = selectedMaterials.length;
    const pages = Math.max(1, Math.ceil(total / materialPageSize));
    if(selectedPage > pages) selectedPage = pages;
    const start = (selectedPage - 1) * materialPageSize;
    const pageItems = selectedMaterials.slice(start, start + materialPageSize);
    if(total === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#64748b; padding:20px">Chưa chọn vật tư. Nhấn "Thêm vật tư" để chọn hoặc tìm nhanh ở ô tìm kiếm.</td></tr>`;
    } else {
        tbody.innerHTML = pageItems.map((m, i) => `
            <tr>
                <td class="text-center"><input type="checkbox" class="selected-row-cb" data-idx="${start + i}"></td>
                <td class="text-center">${start + i + 1}</td>
                <td><code>${m.code}</code></td>
                <td>${m.name}</td>
                <td class="qty-display">${m.qty || 0}</td>
                <td style="color:#64748b; font-size:11px">${m.specs}</td>
                <td class="text-center"><button class="btn-icon btn-view" onclick="viewSelected(${start + i})"><i class="fas fa-eye"></i></button> <button class="btn-icon btn-delete" onclick="confirmDeleteSingle(${start + i})"><i class="fas fa-trash-alt"></i></button></td>
            </tr>
        `).join('');
    }
    // update info and pagination
    const info = document.getElementById('selected-info'); if(info) info.innerText = `Hiển thị ${Math.min(materialPageSize, total)} trong tổng ${total}`;
    const pagContainer = document.getElementById('selected-pagination'); if(pagContainer) {
        pagContainer.style.display = total === 0 ? 'none' : 'flex';
        if(pagContainer.parentElement) pagContainer.parentElement.style.display = total === 0 ? 'none' : 'flex';
    }
    renderSelectedPagination(pages);
    // wire checkbox listeners and bulk delete button
    document.querySelectorAll('.selected-row-cb').forEach(cb => cb.onchange = updateBulkDeleteButton);
    const master = document.getElementById('selected-bulk-checkbox'); if(master) master.checked = Array.from(document.querySelectorAll('.selected-row-cb')).every(c=>c.checked) && document.querySelectorAll('.selected-row-cb').length>0;
    updateBulkDeleteButton();
}

function renderSelectedPagination(pages) {
    const container = document.getElementById('selected-pagination'); if(!container) return;
    let html = '';
    html += `<button class="btn-page" ${selectedPage === 1 ? 'disabled' : ''} onclick="gotoSelectedPage(${selectedPage - 1})"><i class="fas fa-chevron-left"></i></button>`;
    for(let i=1;i<=pages;i++) {
        if(i<=2 || i>pages-2 || (i>=selectedPage-1 && i<=selectedPage+1)) {
            html += `<button class="btn-page ${i===selectedPage?'active':''}" onclick="gotoSelectedPage(${i})">${i}</button>`;
        } else if(i===3 && selectedPage>4) html += `<span style="padding:0 6px;color:#64748b">...</span>`;
        else if(i===pages-2 && selectedPage<pages-3) html += `<span style="padding:0 6px;color:#64748b">...</span>`;
    }
    html += `<button class="btn-page" ${selectedPage === pages ? 'disabled' : ''} onclick="gotoSelectedPage(${selectedPage + 1})"><i class="fas fa-chevron-right"></i></button>`;
    container.innerHTML = html;
    document.getElementById('selected-go-page').value = '';
}

function gotoSelectedPage(p) { selectedPage = p; renderSelectedMaterialsPaged(); }
function gotoSelectedPageInput() { const v = Number(document.getElementById('selected-go-page').value || 0); if(!v||isNaN(v)) return; gotoSelectedPage(v); }
function gotoSelectedPageInput() { const v = Number(document.getElementById('selected-go-page').value || 0); if(!v||isNaN(v)) return; if(createSearchQuery && createSearchQuery.length>0) gotoCreateSearchPage(v); else gotoSelectedPage(v); }

// override renderSelectedMaterials to use paged version
function renderSelectedMaterials() { renderSelectedMaterialsPaged(); }

// Render search results inside the main create-modal table (20/page)
function renderCreateSearchResults() {
    const tbody = document.getElementById('modal-material-body'); if(!tbody) return;
    const val = createSearchQuery.toLowerCase();
    const filtered = MASTER_MATERIALS.filter(m => m.code.toLowerCase().includes(val) || m.name.toLowerCase().includes(val));
    const pages = Math.max(1, Math.ceil(filtered.length / materialPageSize));
    if(createSearchPage > pages) createSearchPage = pages;
    const start = (createSearchPage - 1) * materialPageSize;
    const items = filtered.slice(start, start + materialPageSize);
    if(items.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#64748b; padding:20px">Không tìm thấy kết quả.</td></tr>`;
    } else {
        tbody.innerHTML = items.map((m,i)=>`
            <tr>
                <td class="text-center"></td>
                <td class="text-center">${start + i + 1}</td>
                <td><code>${m.code}</code></td>
                <td>${m.name}</td>
                <td class="qty-display">0</td>
                <td style="color:#64748b; font-size:11px">${m.specs}</td>
                <td class="text-center"><button class="btn-add-material" onclick="addMaterialQuick('${m.code}')">Thêm</button></td>
            </tr>
        `).join('');
    }
    // footer info & pagination for search results
    const info = document.getElementById('selected-info'); if(info) info.innerText = `Hiển thị ${Math.min(materialPageSize, filtered.length)} trong tổng ${filtered.length}`;
    const container = document.getElementById('selected-pagination'); if(container) {
        let html = `<button class="btn-page" ${createSearchPage === 1 ? 'disabled' : ''} onclick="gotoCreateSearchPage(${createSearchPage - 1})"><i class="fas fa-chevron-left"></i></button>`;
        for(let i=1;i<=pages;i++) {
            if(i<=2 || i>pages-2 || (i>=createSearchPage-1 && i<=createSearchPage+1)) {
                html += `<button class="btn-page ${i===createSearchPage?'active':''}" onclick="gotoCreateSearchPage(${i})">${i}</button>`;
            } else if(i===3 && createSearchPage>4) html += `<span style="padding:0 6px;color:#64748b">...</span>`;
            else if(i===pages-2 && createSearchPage<pages-3) html += `<span style="padding:0 6px;color:#64748b">...</span>`;
        }
        html += `<button class="btn-page" ${createSearchPage === pages ? 'disabled' : ''} onclick="gotoCreateSearchPage(${createSearchPage + 1})"><i class="fas fa-chevron-right"></i></button>`;
        container.innerHTML = html;
        const input = document.getElementById('selected-go-page'); if(input) input.value = '';
        container.style.display = filtered.length === 0 ? 'none' : 'flex';
        if(container.parentElement) container.parentElement.style.display = filtered.length === 0 ? 'none' : 'flex';
        // when showing search results, wire add buttons (they already exist) and update bulk delete button state
        updateBulkDeleteButton();
    }
}

// Update the bulk-delete button label and enabled state based on currently checked rows
function updateBulkDeleteButton() {
    const btn = document.getElementById('btn-bulk-delete');
    if(!btn) return;
    const checkboxes = Array.from(document.querySelectorAll('.selected-row-cb'));
    const checked = checkboxes.filter(cb => cb.checked).length;
    btn.disabled = checked === 0;
    btn.innerText = checked > 0 ? `Xóa đã chọn (${checked})` : 'Xóa đã chọn';
}

function gotoCreateSearchPage(p) { createSearchPage = p; renderCreateSearchResults(); }

// live search in create modal: show quick results and allow adding
function renderLiveSearch(q) {
    createSearchQuery = (q||'').trim();
    createSearchPage = 1;
    renderSelectedMaterials();
}

function addMaterialQuick(code) {
    const mat = MASTER_MATERIALS.find(m => m.code === code);
    if(!mat) return;
    showCustomConfirm(`Bạn muốn thêm 1 vật tư ${mat.code}?`, ()=>{
        if(!selectedMaterials.find(s => s.code===mat.code)) selectedMaterials.push(Object.assign({qty:0}, mat));
        renderSelectedMaterials();
    });
}

// Handler for the "Add" button next to input fields
function addMaterialFromInput() {
    const vatTuInput = document.getElementById('inputVatTu');
    const soLuongInput = document.getElementById('inputSoLuong');
    
    if (!vatTuInput || !soLuongInput) return;

    const code = vatTuInput.value.trim();
    const qtyStr = soLuongInput.value.trim();
    
    if (!code) {
        showToast('Vui lòng nhập hoặc quét mã vật tư', 'error');
        return;
    }
    
    const qty = parseInt(qtyStr, 10);
    if (isNaN(qty) || qty <= 0) {
        showToast('Vui lòng nhập số lượng hợp lệ', 'error');
        return;
    }

    // Try to find material details from master list if possible
    // This supports both scanning a known code or entering a new plain text code temporarily
    let mat = MASTER_MATERIALS.find(m => m.code.toLowerCase() === code.toLowerCase());
    
    if (!mat) {
        // Fallback for codes not in the master list - create a basic entry
        mat = {
            code: code.toUpperCase(),
            name: `Vật tư mới (${code.toUpperCase()})`,
            specs: 'Chưa có thông tin',
            unit: 'cái'
        };
    }

    // Check if already in list
    const existingIndex = selectedMaterials.findIndex(s => s.code.toLowerCase() === mat.code.toLowerCase());
    
    const expiryInput = document.getElementById('inputExpiry');
    const expiryDate = expiryInput ? expiryInput.value : '';

    if (existingIndex >= 0) {
        // Update quantity
        selectedMaterials[existingIndex].qty += qty;
        if (expiryDate) selectedMaterials[existingIndex].expiryDate = expiryDate;
        showToast(`Đã cộng dồn ${qty} vào vật tư ${mat.code}`, 'success');
    } else {
        // Add new
        selectedMaterials.push(Object.assign({}, mat, { qty: qty, expiryDate: expiryDate }));
        showToast(`Đã thêm vật tư ${mat.code}`, 'success');
    }

    // Clear inputs and refocus
    vatTuInput.value = '';
    soLuongInput.value = '';
    vatTuInput.focus();
    
    // Update UIs
    renderSelectedMaterials();
    renderAddedMaterialsUI();
}

function removeAddedMaterial(index) {
    if (index >= 0 && index < selectedMaterials.length) {
        selectedMaterials.splice(index, 1);
        renderSelectedMaterials();
        renderAddedMaterialsUI();
    }
}

function renderAddedMaterialsUI() {
    const container = document.getElementById('added-materials-container');
    const list = document.getElementById('added-materials-list');
    
    if (!container || !list) return;

    if (selectedMaterials.length === 0) {
        container.style.display = 'none';
        list.innerHTML = '';
        return;
    }

    container.style.display = 'block';
    
    list.innerHTML = selectedMaterials.map((m, i) => `
        <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 12px; border-radius: 6px;">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
                <code style="background: white; padding: 2px 6px; border-radius: 4px; border: 1px solid #cbd5e1; font-size: 12px; white-space: nowrap;">${m.code}</code>
                <span style="font-size: 13px; font-weight: 500; color: #334155; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${m.name}">${m.name}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; margin-left: 12px;">
                <span style="font-size: 12px; color: #64748b; margin-right: 8px;">HSD: ${m.expiryDate || '-'}</span>
                <span style="font-size: 13px; font-weight: 600; color: #0d6bb9;">Số lượng: ${m.qty}</span>
                <button type="button" class="btn-icon btn-delete" style="width: 28px; height: 28px; min-width: 28px;" onclick="removeAddedMaterial(${i})" title="Xóa">
                    <i class="fas fa-times" style="font-size: 12px;"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function viewSelected(idx) { const m = selectedMaterials[idx]; if(m) alert(`${m.code} - ${m.name}`); }

function confirmDeleteSingle(idx) {
    showCustomConfirm('Xác nhận xóa vật tư này?', () => { selectedMaterials.splice(idx,1); renderSelectedMaterials(); });
}

function toggleSelectedBulk(master) {
    const cbs = Array.from(document.querySelectorAll('.selected-row-cb'));
    cbs.forEach(cb => cb.checked = master.checked);
    updateBulkDeleteButton();
}

function bulkDeleteSelected() {
    const cbs = Array.from(document.querySelectorAll('.selected-row-cb'));
    const idxs = cbs.filter(cb => cb.checked).map(cb => parseInt(cb.getAttribute('data-idx'))).filter(n=>!isNaN(n));
    if(idxs.length === 0) return alert('Chưa chọn vật tư để xóa');
    showCustomConfirm(`Bạn muốn xóa ${idxs.length} vật tư?`, () => { idxs.sort((a,b)=>b-a).forEach(i=> selectedMaterials.splice(i,1)); renderSelectedMaterials(); });
}

function goToPage(p) { currentMaterialPage = p; renderMaterialTable(); }

function downloadSampleFile() {
    const headers = "Mã vật tư,Tên vật tư,Số lượng,Quy cách\n";
    const sampleData = "MAT-001,Thép ống D60,10,Φ60mm x 6m, SUS304\nMAT-002,Thép tấm 5mm,5,1200x2400mm, CT3";
    const csvContent = "\uFEFF" + headers + sampleData;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_material_file.csv'; 
    a.click();
    window.URL.revokeObjectURL(url);
    if (typeof showToast === 'function') {
        showToast('Đã tải file mẫu!', 'success');
    }
    return false;
}

function previewImport(input) {
    if(input.files[0]) {
        document.getElementById('import-init-view').style.display = 'none';
        document.getElementById('import-preview-view').style.display = 'block';
        document.getElementById('btn-confirm-import').style.display = 'inline-block';
        document.getElementById('import-preview-body').innerHTML = `<tr><td>MAT-001</td><td>Thép ống D60</td><td>10</td><td>Φ60mm</td></tr>`;
    }
}

// Function to bind event listeners to buttons (more reliable than inline onclick for dynamic content)
function initButtonListeners() {
    console.log('initButtonListeners: Binding event listeners...');
    
    // Bind "Thêm mới" button
    var btnCreate = document.getElementById('btn-open-create');
    if(btnCreate) {
        btnCreate.onclick = function() {
            console.log('btn-open-create clicked');
            openCreateModal();
        };
        console.log('initButtonListeners: btn-open-create bound');
    } else {
        console.warn('initButtonListeners: btn-open-create not found');
    }
    
    // Bind "Đồng bộ" button
    var btnSync = document.getElementById('btn-open-sync');
    if(btnSync) {
        btnSync.onclick = function() {
            console.log('btn-open-sync clicked');
            openSyncModal();
        };
        console.log('initButtonListeners: btn-open-sync bound');
    } else {
        console.warn('initButtonListeners: btn-open-sync not found');
    }
    
    // Bind "Refresh" button
    var btnRefresh = document.getElementById('btn-refresh');
    if(btnRefresh) {
        btnRefresh.onclick = function() {
            refreshData();
        };
    }
}

// Init when file loads
console.log('inbound.js: Starting initialization...');

// Try immediately
initButtonListeners();
renderTableBody();

// Also retry after a short delay to handle dynamic loading timing
setTimeout(function() {
    console.log('inbound.js: Retry initButtonListeners after 100ms');
    initButtonListeners();
}, 100);

setTimeout(function() {
    console.log('inbound.js: Retry initButtonListeners after 500ms');
    initButtonListeners();
}, 500);

// ========== SYNC MODAL FUNCTIONS ==========

// Add syncStatus to mock data (simulate some already synced) - NO QR CODE
const SYNC_DATA = MOCK_INBOUND_ORDERS.map((order, idx) => ({
    ...order,
    syncStatus: idx % 3 === 0 ? 'SYNCED' : 'NOT_SYNCED', // simulate some already synced
    // Add more material details for sync view
    materialsDetail: order.materials.map(m => ({
        ...m,
        weight: Math.floor(Math.random() * 100) + 10, // random weight kg
        expDate: idx % 4 === 0 ? null : new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000), // random exp date, some null
        specs: MASTER_MATERIALS.find(mm => mm.code === m.code)?.specs || 'Quy cách tiêu chuẩn'
    }))
}));

// Sync pagination
let syncCurrentPage = 1;
const syncPageSize = 20;

function openSyncModal() {
    console.log('openSyncModal called');
    var modal = document.getElementById('modal-sync');
    if(!modal) { 
        console.error('modal-sync element not found in DOM'); 
        return; 
    }
    // Add 'show' class and set opacity for compatibility with sidebar.css
    modal.classList.add('show');
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    // Reset filters
    var syncSearch = document.getElementById('sync-search');
    var syncDateFrom = document.getElementById('sync-date-from');
    var syncDateTo = document.getElementById('sync-date-to');
    var syncStatusFilter = document.getElementById('sync-status-filter');
    if(syncSearch) syncSearch.value = '';
    if(syncDateFrom) syncDateFrom.value = '';
    if(syncDateTo) syncDateTo.value = '';
    if(syncStatusFilter) syncStatusFilter.value = 'ALL';
    syncCurrentPage = 1;
    renderSyncTable();
}

function closeSyncModal() {
    var modal = document.getElementById('modal-sync');
    if(modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
    }
}

function clearSyncDateFilter() {
    document.getElementById('sync-date-from').value = '';
    document.getElementById('sync-date-to').value = '';
    syncCurrentPage = 1;
    renderSyncTable();
}

function formatSyncDateTime(date) {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const mo = String(date.getMonth() + 1).padStart(2, '0');
    return `${h}:${m} ${d}/${mo}/${date.getFullYear()}`;
}

function formatExpDate(date) {
    if (!date) return '-';
    const d = String(date.getDate()).padStart(2, '0');
    const mo = String(date.getMonth() + 1).padStart(2, '0');
    return `${d}/${mo}/${date.getFullYear()}`;
}

function getFilteredSyncData() {
    const searchQuery = (document.getElementById('sync-search')?.value || '').toLowerCase();
    const dateFrom = document.getElementById('sync-date-from')?.value;
    const dateTo = document.getElementById('sync-date-to')?.value;
    const statusFilter = document.getElementById('sync-status-filter')?.value || 'ALL';

    return SYNC_DATA.filter(order => {
        // Search filter
        if (searchQuery && !order.code.toLowerCase().includes(searchQuery)) return false;
        // Date filter
        if (dateFrom) {
            const from = new Date(dateFrom);
            from.setHours(0, 0, 0, 0);
            if (order.createdAt < from) return false;
        }
        if (dateTo) {
            const to = new Date(dateTo);
            to.setHours(23, 59, 59, 999);
            if (order.createdAt > to) return false;
        }
        // Status filter
        if (statusFilter !== 'ALL' && order.syncStatus !== statusFilter) return false;
        return true;
    });
}

function renderSyncTable() {
    const tbody = document.getElementById('sync-table-body');
    if (!tbody) return;

    const filtered = getFilteredSyncData();
    const totalPages = Math.max(1, Math.ceil(filtered.length / syncPageSize));
    
    // Ensure current page is valid
    if (syncCurrentPage > totalPages) syncCurrentPage = totalPages;
    if (syncCurrentPage < 1) syncCurrentPage = 1;
    
    const startIdx = (syncCurrentPage - 1) * syncPageSize;
    const pageItems = filtered.slice(startIdx, startIdx + syncPageSize);

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:#64748b;padding:30px;">Không có Lệnh nhập nào phù hợp</td></tr>`;
    } else {
        // Helper to format sync material info (separate from material name)
        const getSyncMaterialInfo = (m) => {
            const specs = m.specs || '-';
            const weight = m.weight || 0;
            let expStr = '-';
            if (m.expDate) {
                expStr = formatExpDate(m.expDate);
            }
            return `<div style="font-size:11px;color:#64748b;line-height:1.4;">
                <div>Quy cách: ${specs}</div>
                <div>HSD: ${expStr}</div>
                <div>KL: ${weight}kg | Số lượng: ${m.qty} ${m.unit}</div>
            </div>`;
        };

        tbody.innerHTML = pageItems.map((order, i) => `
            <tr data-order-id="${order.id}">
                <td class="text-center">
                    <input type="checkbox" class="sync-checkbox" data-id="${order.id}" onchange="updateSyncSelection()" ${order.syncStatus === 'SYNCED' ? 'disabled' : ''}>
                </td>
                <td class="text-center">${startIdx + i + 1}</td>
                <td><code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;">${order.code}</code></td>
                <td>
                    <div class="product-list">
                        ${order.materialsDetail.map(m => `<div class="product-item"><span class="prod-code">${m.code}</span> ${m.name}</div>`).join('')}
                    </div>
                </td>
                <td>
                    ${order.materialsDetail.map(m => getSyncMaterialInfo(m)).join('')}
                </td>
                <td style="font-size:12px;">${formatSyncDateTime(order.createdAt)}</td>
                <td class="text-center">
                    ${order.syncStatus === 'SYNCED' 
                        ? '<span style="background:#dcfce7;color:#166534;padding:4px 8px;border-radius:12px;font-size:11px;font-weight:600;">Đã đồng bộ</span>'
                        : '<span style="background:#fef3c7;color:#92400e;padding:4px 8px;border-radius:12px;font-size:11px;font-weight:600;">Chưa đồng bộ</span>'
                    }
                </td>
                <td class="text-center">
                    <button class="btn-icon btn-view" onclick="syncSingleOrder(${order.id})" title="Đồng bộ" ${order.syncStatus === 'SYNCED' ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}>
                        <i class="fas fa-sync-alt" style="color:${order.syncStatus === 'SYNCED' ? '#94a3b8' : '#0D6BB9'}"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Update info
    const showingCount = pageItems.length;
    document.getElementById('sync-info').innerText = `Hiển thị ${showingCount} trong tổng ${filtered.length}`;
    
    // Render pagination
    renderSyncPagination(totalPages, filtered.length);
    
    // Reset select all checkbox
    const selectAll = document.getElementById('sync-select-all');
    if (selectAll) selectAll.checked = false;
    
    updateSyncSelection();
}

function renderSyncPagination(totalPages, totalItems) {
    const container = document.getElementById('sync-pagination');
    if (!container) return;
    
    if (totalItems === 0) {
        container.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Previous button
    html += `<button class="btn-page" ${syncCurrentPage === 1 ? 'disabled' : ''} onclick="goToSyncPage(${syncCurrentPage - 1})" style="padding:6px 10px;border:1px solid #e2e8f0;border-radius:6px;background:#fff;cursor:pointer;"><i class="fas fa-chevron-left"></i></button>`;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i <= 2 || i > totalPages - 2 || (i >= syncCurrentPage - 1 && i <= syncCurrentPage + 1)) {
            const isActive = i === syncCurrentPage;
            html += `<button class="btn-page ${isActive ? 'active' : ''}" onclick="goToSyncPage(${i})" style="padding:6px 12px;border:1px solid ${isActive ? '#0D6BB9' : '#e2e8f0'};border-radius:6px;background:#fff;color:${isActive ? '#0D6BB9' : '#334155'};cursor:pointer;font-weight:${isActive ? '600' : '400'};">${i}</button>`;
        } else if (i === 3 && syncCurrentPage > 4) {
            html += `<span style="padding:0 6px;color:#64748b;">...</span>`;
        } else if (i === totalPages - 2 && syncCurrentPage < totalPages - 3) {
            html += `<span style="padding:0 6px;color:#64748b;">...</span>`;
        }
    }
    
    // Next button
    html += `<button class="btn-page" ${syncCurrentPage === totalPages ? 'disabled' : ''} onclick="goToSyncPage(${syncCurrentPage + 1})" style="padding:6px 10px;border:1px solid #e2e8f0;border-radius:6px;background:#fff;cursor:pointer;"><i class="fas fa-chevron-right"></i></button>`;
    
    container.innerHTML = html;
    
    // Clear go-to-page input
    const goPageInput = document.getElementById('sync-go-page');
    if (goPageInput) goPageInput.value = '';
}

function goToSyncPage(page) {
    const filtered = getFilteredSyncData();
    const totalPages = Math.max(1, Math.ceil(filtered.length / syncPageSize));
    if (page < 1 || page > totalPages) return;
    syncCurrentPage = page;
    renderSyncTable();
}

function goToSyncPageFromInput() {
    const input = document.getElementById('sync-go-page');
    const page = parseInt(input?.value);
    if (!page || isNaN(page)) return;
    goToSyncPage(page);
}

function toggleSyncSelectAll(master) {
    const checkboxes = document.querySelectorAll('.sync-checkbox:not(:disabled)');
    checkboxes.forEach(cb => cb.checked = master.checked);
    updateSyncSelection();
}

function updateSyncSelection() {
    const checkboxes = Array.from(document.querySelectorAll('.sync-checkbox:not(:disabled)'));
    const checked = checkboxes.filter(cb => cb.checked).length;
    
    const btn = document.getElementById('btn-bulk-sync');
    const countSpan = document.getElementById('sync-selected-count');
    
    if (btn) btn.disabled = checked === 0;
    if (countSpan) countSpan.innerText = checked;
    
    // Update select all checkbox state
    const selectAll = document.getElementById('sync-select-all');
    if (selectAll && checkboxes.length > 0) {
        selectAll.checked = checkboxes.every(cb => cb.checked);
        selectAll.indeterminate = checked > 0 && checked < checkboxes.length;
    }
}

function syncSingleOrder(orderId) {
    const order = SYNC_DATA.find(o => o.id === orderId);
    if (!order || order.syncStatus === 'SYNCED') return;
    
    showCustomConfirm(`Xác nhận đồng bộ Lệnh ${order.code}?`, () => {
        // Simulate sync
        order.syncStatus = 'SYNCED';
        renderSyncTable();
        updateLastSyncTime();
        alert(`Đã đồng bộ Lệnh ${order.code} thành công!`);
    });
}

function bulkSyncOrders() {
    const checkboxes = Array.from(document.querySelectorAll('.sync-checkbox:checked'));
    const ids = checkboxes.map(cb => parseInt(cb.getAttribute('data-id'))).filter(id => !isNaN(id));
    
    if (ids.length === 0) return alert('Chưa chọn Lệnh nào');
    
    const orders = SYNC_DATA.filter(o => ids.includes(o.id) && o.syncStatus !== 'SYNCED');
    if (orders.length === 0) return alert('Các Lệnh đã chọn đều đã được đồng bộ');
    
    showCustomConfirm(`Xác nhận đồng bộ ${orders.length} Lệnh đã chọn?`, () => {
        // Simulate bulk sync
        orders.forEach(o => o.syncStatus = 'SYNCED');
        renderSyncTable();
        updateLastSyncTime();
        alert(`Đã đồng bộ ${orders.length} Lệnh thành công!`);
    });
}

// Refresh data and update timestamp
function refreshData() {
    // Re-render the table
    renderTableBody();
    // Update last sync timestamp
    updateLastSyncTime();
}

// Update the last sync time display
function updateLastSyncTime() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const mo = String(now.getMonth() + 1).padStart(2, '0');
    
    const timestamp = `${h}:${m}:${s} ${d}/${mo}`;
    const el = document.getElementById('last-sync-time');
    if (el) {
        el.textContent = `Đồng bộ lần cuối: ${timestamp}`;
    }
}

// --- DATE RANGE PICKER FUNCTIONS ---
function toggleTimeSort() {
    if (timeSortOrder === null) timeSortOrder = 'desc';
    else if (timeSortOrder === 'desc') timeSortOrder = 'asc';
    else timeSortOrder = null;
    
    // update icon
    const icon = document.getElementById('time-sort-icon');
    if (icon) {
        if (timeSortOrder === null) {
            icon.className = 'fas fa-sort';
            icon.style.color = '#cbd5e1';
        } else if (timeSortOrder === 'asc') {
            icon.className = 'fas fa-sort-up';
            icon.style.color = '#334155';
        } else {
            icon.className = 'fas fa-sort-down';
            icon.style.color = '#334155';
        }
    }
    mainCurrentPage = 1;
    renderTableBody();
}
window.toggleTimeSort = toggleTimeSort;

function initDefaultDateRange() {
    const today = new Date();
    activeStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    activeEndDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
    selectedStartDate = new Date(activeStartDate);
    selectedEndDate = new Date(activeEndDate);
    
    const format = function(d) { 
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return dd + '/' + mm + '/' + yyyy;
    };
    const display = document.getElementById('dateRangeDisplay');
    if (display) {
        display.textContent = format(activeStartDate) + ' - ' + format(activeEndDate);
    }
    
    // Set sidebar item "Hôm nay" to active
    setTimeout(() => {
        const rangeItems = document.querySelectorAll('.sidebar-item[data-range]');
        rangeItems.forEach(i => {
            if (i.getAttribute('data-range') === 'today') i.classList.add('active');
            else i.classList.remove('active');
        });
    }, 100);
}

function togglePriorityFilter() {
    filterPriorityOnly = !filterPriorityOnly;
    const btn = document.getElementById('btn-filter-priority');
    if (btn) {
        if (filterPriorityOnly) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    }
    mainCurrentPage = 1;
    renderTableBody();
}
window.togglePriorityFilter = togglePriorityFilter;

function setDateFilterMode(mode) {
    activeDateFilterType = mode;
    
    // Update UI
    const items = document.querySelectorAll('.filter-mode-item');
    items.forEach(item => item.classList.remove('active'));
    
    const targetId = mode === 'all' ? 'mode-all' : (mode === 'createdAt' ? 'mode-inbound' : 'mode-expiry');
    const targetItem = document.getElementById(targetId);
    if (targetItem) targetItem.classList.add('active');
}
window.setDateFilterMode = setDateFilterMode;

function initDatePicker() {
    const trigger = document.getElementById('dateRangeTrigger');
    const picker = document.getElementById('analyticsPicker');
    const applyBtn = document.getElementById('applyPicker');
    const cancelBtn = document.getElementById('cancelPicker');
    const clearBtn = document.getElementById('clearPicker');
    const rangeItems = document.querySelectorAll('.sidebar-item[data-range]');
    const modeItems = document.querySelectorAll('.filter-mode-item');
    
    if (!trigger || !picker) return;
    
    // Toggle picker on trigger click
    trigger.onclick = function(e) {
        e.stopPropagation();
        picker.classList.toggle('active');
        if (picker.classList.contains('active')) {
            initPickerDropdowns();
            renderCalendars();
        }
    };
    
    // Prevent picker from closing when clicking inside
    picker.onclick = function(e) { e.stopPropagation(); };
    
    // Apply button
    if (applyBtn) {
        applyBtn.onclick = function() {
            if (selectedStartDate && selectedEndDate) {
                activeStartDate = selectedStartDate;
                activeEndDate = selectedEndDate;
                const format = function(d) { 
                    const dd = String(d.getDate()).padStart(2, '0');
                    const mm = String(d.getMonth() + 1).padStart(2, '0');
                    const yyyy = d.getFullYear();
                    return dd + '/' + mm + '/' + yyyy;
                };
                document.getElementById('dateRangeDisplay').textContent = format(activeStartDate) + ' - ' + format(activeEndDate);
                picker.classList.remove('active');
                mainCurrentPage = 1;
                renderTableBody();
            }
        };
    }
    
    // Cancel button
    if (cancelBtn) {
        cancelBtn.onclick = function() {
            selectedStartDate = activeStartDate;
            selectedEndDate = activeEndDate;
            picker.classList.remove('active');
        };
    }
    
    // Clear button
    if (clearBtn) {
        clearBtn.onclick = function() {
            selectedStartDate = null;
            selectedEndDate = null;
            activeEndDate = null;
            document.getElementById('dateRangeDisplay').textContent = 'dd/mm/yyyy - dd/mm/yyyy';
            rangeItems.forEach(function(i) { i.classList.remove('active'); });
            renderCalendars();
            mainCurrentPage = 1;
            renderTableBody();
        };
    }
    
    // Sidebar quick select items
    rangeItems.forEach(function(item) {
        item.onclick = function(e) {
            e.stopPropagation();
            rangeItems.forEach(function(i) { i.classList.remove('active'); });
            item.classList.add('active');
            
            var range = item.getAttribute('data-range');
            var today = new Date();
            var start = new Date();
            var end = new Date();
            
            switch(range) {
                case 'today': start = today; end = today; break;
                case 'last3': start.setDate(today.getDate() - 3); break;
                case 'last7': start.setDate(today.getDate() - 7); break;
                case 'last30': start.setDate(today.getDate() - 30); break;
                case 'last3mo': start.setMonth(today.getMonth() - 3); break;
                case 'last6mo': start.setMonth(today.getMonth() - 6); break;
                case 'last1yr': start.setFullYear(today.getFullYear() - 1); break;
            }
            
            selectedStartDate = start;
            selectedEndDate = end;
            currentViewLeft = new Date(start);
            currentViewRight = new Date(end);
            if (currentViewLeft.getMonth() === currentViewRight.getMonth() && currentViewLeft.getFullYear() === currentViewRight.getFullYear()) {
                currentViewRight.setMonth(currentViewRight.getMonth() + 1);
            }
            
            renderCalendars();
            updateTempDisplay();
        };
    });
    
    // Close picker when clicking outside
    document.addEventListener('click', function(e) {
        if (!picker.contains(e.target) && !trigger.contains(e.target)) {
            picker.classList.remove('active');
        }
    });
}

function initPickerDropdowns() {
    var months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    // Short month names for grid display
    var shortMonths = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];
    var currentYear = new Date().getFullYear();
    var years = [];
    for (var i = currentYear - 5; i <= currentYear + 1; i++) years.push(i);
    
    var leftMonthDropdown = document.getElementById('leftMonthDropdown');
    var leftMonthSelected = document.getElementById('leftMonthSelected');
    var leftMonthList = document.getElementById('leftMonthList');
    var leftYearDropdown = document.getElementById('leftYearDropdown');
    var leftYearSelected = document.getElementById('leftYearSelected');
    var leftYearList = document.getElementById('leftYearList');
    var rightMonthDropdown = document.getElementById('rightMonthDropdown');
    var rightMonthSelected = document.getElementById('rightMonthSelected');
    var rightMonthList = document.getElementById('rightMonthList');
    var rightYearDropdown = document.getElementById('rightYearDropdown');
    var rightYearSelected = document.getElementById('rightYearSelected');
    var rightYearList = document.getElementById('rightYearList');
    
    function populate(listEl, selectedEl, displayOpts, fullOpts, isMonth, isLeft) {
        listEl.innerHTML = displayOpts.map(function(opt, idx) {
            var val = isMonth ? idx : (fullOpts ? fullOpts[idx] : opt);
            return '<div class="dropdown-item" data-value="' + val + '">' + opt + '</div>';
        }).join('');
        
        listEl.querySelectorAll('.dropdown-item').forEach(function(item, idx) {
            item.onclick = function(e) {
                e.stopPropagation();
                var val = parseInt(item.getAttribute('data-value'));
                if (isMonth) {
                    if (isLeft) currentViewLeft.setMonth(val);
                    else currentViewRight.setMonth(val);
                    // Show full month name in selected
                    selectedEl.textContent = months[val];
                } else {
                    if (isLeft) currentViewLeft.setFullYear(val);
                    else currentViewRight.setFullYear(val);
                    selectedEl.textContent = val;
                }
                listEl.parentElement.classList.remove('active');
                listEl.querySelectorAll('.dropdown-item').forEach(function(i) { i.classList.remove('selected'); });
                item.classList.add('selected');
                renderCalendars();
            };
        });
    }
    
    // Use shortMonths for grid display, but full months are used in onclick handler
    populate(leftMonthList, leftMonthSelected, shortMonths, months, true, true);
    populate(rightMonthList, rightMonthSelected, shortMonths, months, true, false);
    populate(leftYearList, leftYearSelected, years, null, false, true);
    populate(rightYearList, rightYearSelected, years, null, false, false);
    
    // Add grid classes for month and year dropdowns
    if(leftMonthList) leftMonthList.classList.add('month-grid');
    if(rightMonthList) rightMonthList.classList.add('month-grid');
    if(leftYearList) leftYearList.classList.add('year-grid');
    if(rightYearList) rightYearList.classList.add('year-grid');
    
    // Sync UI
    leftMonthSelected.textContent = months[currentViewLeft.getMonth()];
    leftYearSelected.textContent = currentViewLeft.getFullYear();
    rightMonthSelected.textContent = months[currentViewRight.getMonth()];
    rightYearSelected.textContent = currentViewRight.getFullYear();
    
    // Toggle dropdowns
    function setupToggle(dropdownEl) {
        dropdownEl.onclick = function(e) {
            e.stopPropagation();
            var isActive = dropdownEl.classList.contains('active');
            document.querySelectorAll('.custom-dropdown').forEach(function(d) { d.classList.remove('active'); });
            if (!isActive) dropdownEl.classList.add('active');
        };
    }
    
    setupToggle(leftMonthDropdown);
    setupToggle(leftYearDropdown);
    setupToggle(rightMonthDropdown);
    setupToggle(rightYearDropdown);
}

function renderCalendars() {
    var leftContainer = document.querySelector('#leftCalendar .days-container');
    var rightContainer = document.querySelector('#rightCalendar .days-container');
    
    if (!leftContainer || !rightContainer) return;
    
    function render(container, viewDate) {
        container.innerHTML = '';
        var year = viewDate.getFullYear();
        var month = viewDate.getMonth();
        
        var firstDayRaw = new Date(year, month, 1).getDay();
        var firstDay = (firstDayRaw === 0) ? 6 : firstDayRaw - 1; // Mon = 0
        var daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Prefill empty days
        for (var i = 0; i < firstDay; i++) {
            container.insertAdjacentHTML('beforeend', '<div class="calendar-day empty"></div>');
        }
        
        for (var d = 1; d <= daysInMonth; d++) {
            var date = new Date(year, month, d);
            var cls = 'calendar-day';
            
            if (selectedStartDate && date.toDateString() === selectedStartDate.toDateString()) cls += ' selected range-start';
            if (selectedEndDate && date.toDateString() === selectedEndDate.toDateString()) cls += ' selected range-end';
            if (selectedStartDate && selectedEndDate && date > selectedStartDate && date < selectedEndDate) cls += ' in-range';
            
            const today = new Date();
            const isToday = date.getDate() === today.getDate() && 
                            date.getMonth() === today.getMonth() && 
                            date.getFullYear() === today.getFullYear();
            if (isToday) cls += ' today';
            
            var dayEl = document.createElement('div');
            dayEl.className = cls;
            dayEl.textContent = d;
            (function(capturedDate) {
                dayEl.onclick = function(e) {
                    e.stopPropagation();
                    handleDateClick(capturedDate);
                };
            })(date);
            container.appendChild(dayEl);
        }
    }
    
    render(leftContainer, currentViewLeft);
    render(rightContainer, currentViewRight);
    updateTempDisplay();
}

function handleDateClick(date) {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
        selectedStartDate = date;
        selectedEndDate = null;
    } else if (date < selectedStartDate) {
        selectedEndDate = selectedStartDate;
        selectedStartDate = date;
    } else {
        selectedEndDate = date;
    }
    renderCalendars();
}

function updateTempDisplay() {
    var el = document.getElementById('tempRangeDisplay');
    if (!el) return;
    
    function format(d) {
        return d ? d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }) : '...';
    }
    el.textContent = format(selectedStartDate) + ' — ' + format(selectedEndDate);
}

// Override getFilteredMainData to include date filter
var originalGetFilteredMainData = getFilteredMainData;
getFilteredMainData = function() {
    var filterStatus = document.getElementById('filter-status')?.value || 'ALL';
    var filterEntryType = document.getElementById('filter-entry-type')?.value || 'ALL';
    var search = (document.getElementById('search-input')?.value || '').toLowerCase();
    
    return MOCK_INBOUND_ORDERS.filter(function(o) {
        // Status filter
        if (filterStatus !== 'ALL' && o.status !== filterStatus) return false;
        
        // Entry Type filter
        if (filterEntryType !== 'ALL' && o.type !== filterEntryType) return false;

        // Creator Filter
        if (selectedCreatorId && o.creator.id !== selectedCreatorId) return false;

        // Search filter
        if (search) {
            var codeMatch = o.code.toLowerCase().includes(search);
            var materialMatch = o.materials.some(function(m) { 
                return m.name.toLowerCase().includes(search) || m.code.toLowerCase().includes(search); 
            });
            if (!codeMatch && !materialMatch) return false;
        }

        // Priority Filter
        if (filterPriorityOnly && !o.priority) return false;

        // Date range filter
        if (activeStartDate && activeEndDate) {
            var s = new Date(activeStartDate).setHours(0, 0, 0, 0);
            var e = new Date(activeEndDate).setHours(23, 59, 59, 999);
            
            if (activeDateFilterType === 'all') {
                var createMatch = o.createdAt && o.createdAt.getTime() >= s && o.createdAt.getTime() <= e;
                var expiryMatch = false;
                if (o.materials && o.materials[0] && o.materials[0].expiryDate) {
                    var expDate = new Date(o.materials[0].expiryDate).getTime();
                    expiryMatch = expDate >= s && expDate <= e;
                }
                if (!createMatch && !expiryMatch) return false;
            } else {
                var targetDate = null;
                if (activeDateFilterType === 'createdAt') {
                    targetDate = o.createdAt;
                } else if (o.materials && o.materials[0] && o.materials[0].expiryDate) {
                    targetDate = new Date(o.materials[0].expiryDate);
                }

                if (targetDate) {
                    var t = targetDate.getTime();
                    if (t < s || t > e) return false;
                } else {
                    return false;
                }
            }
        }
        return true;
    });
};

/* --- PROCESS COMBOBOX LOGIC --- */
const MOCK_PROCESS_DATA = [
    { id: 1, code: 'WF-1000', name: 'Quy trình Nhập - Kho Phụ Tùng' },
    { id: 2, code: 'WF-1001', name: 'Quy trình Xuất - Kho Phụ Tùng' },
    { id: 3, code: 'WF-1002', name: 'Quy trình Kiểm kê - Kho Nguyên Liệu' },
    { id: 4, code: 'WF-1003', name: 'Quy trình Nhập - Kho Phế Liệu' },
    { id: 5, code: 'WF-1004', name: 'Quy trình Xuất - Kho Thành Phẩm' },
    { id: 6, code: 'WF-1005', name: 'Quy trình Nhập - Kho Phụ Tùng 5' }
];

let selectedProcessId = null;

function initProcessCombobox() {
    renderProcessOptions();
    
    // Global click to close
    document.addEventListener('click', (e) => {
        const wrapper = document.querySelector('#inputProcess')?.closest('.pda-input-box');
        const dropdown = document.getElementById('process-combobox-list');
        
        if (wrapper && dropdown && !wrapper.contains(e.target) && dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
        }
    });
}

function renderProcessOptions(filterText = '') {
    const list = document.getElementById('process-combobox-list');
    if (!list) return;

    const term = filterText.toLowerCase();
    let html = '';

    const filtered = MOCK_PROCESS_DATA.filter(p => 
        !term || 
        p.name.toLowerCase().includes(term) || 
        p.code.toLowerCase().includes(term)
    );

    if (filtered.length === 0) {
        html = `<div class="combobox-option no-results" style="padding: 10px; color: #64748b; text-align: center;">Không tìm thấy kết quả</div>`;
    } else {
        html = `
            <ul class="combobox-list" style="list-style: none; padding: 0; margin: 0;">
                ${filtered.map(p => `
                    <li class="combobox-option ${selectedProcessId == p.id ? 'selected' : ''}" 
                        onclick="selectProcess('${p.id}', '${p.name}')"
                        style="padding: 10px 12px; cursor: pointer; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: flex-start; gap: 8px;">
                        <span style="font-size: 11px; color: #64748b; font-weight: 600; min-width: 60px;">${p.code}</span>
                        <span style="font-weight: 500; color: #334155;">${p.name}</span>
                    </li>
                `).join('')}
            </ul>
        `;
    }

    list.innerHTML = html;
}

function toggleProcessCombobox() {
    const list = document.getElementById('process-combobox-list');
    if (list) {
        list.style.display = list.style.display === 'block' ? 'none' : 'block';
        if (list.style.display === 'block') {
             renderProcessOptions(document.getElementById('inputProcess').value);
        }
    }
}

function handleProcessSearch(val) {
    const list = document.getElementById('process-combobox-list');
    if (list) {
        list.style.display = 'block';
        renderProcessOptions(val);
    }
}

function selectProcess(id, name) {
    selectedProcessId = id;
    const input = document.getElementById('inputProcess');
    const hidden = document.getElementById('selectedProcessId');
    if (input) input.value = name;
    if (hidden) hidden.value = id;
    
    document.getElementById('process-combobox-list').style.display = 'none';
    validatePDAForm();
}

// ============ DESTINATION COMBOBOX ============

function renderDestinationOptions(filterText = '') {
    const list = document.getElementById('destination-combobox-list');
    if (!list) return;

    const term = filterText.toLowerCase();
    let html = '';

    const filtered = MOCK_DESTINATIONS.filter(p => 
        !term || 
        p.name.toLowerCase().includes(term) || 
        p.code.toLowerCase().includes(term)
    );

    if (filtered.length === 0) {
        html = `<div class="combobox-option no-results" style="padding: 10px; color: #64748b; text-align: center;">Không tìm thấy kết quả</div>`;
    } else {
        html = `
            <ul class="combobox-list" style="list-style: none; padding: 0; margin: 0;">
                ${filtered.map(p => `
                    <li class="combobox-option ${selectedDestinationId == p.id ? 'selected' : ''}" 
                        onclick="selectDestination('${p.id}', '${p.name}')"
                        style="padding: 10px 12px; cursor: pointer; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: flex-start; gap: 8px;">
                        <span style="font-size: 11px; color: #64748b; font-weight: 600; min-width: 60px;">${p.code}</span>
                        <span style="font-weight: 500; color: #334155;">${p.name}</span>
                    </li>
                `).join('')}
            </ul>
        `;
    }

    list.innerHTML = html;
}

function toggleDestinationCombobox() {
    const list = document.getElementById('destination-combobox-list');
    if (list) {
        list.style.display = list.style.display === 'block' ? 'none' : 'block';
        if (list.style.display === 'block') {
             renderDestinationOptions(document.getElementById('inputNextDestination').value);
        }
    }
}

function handleDestinationSearch(val) {
    const list = document.getElementById('destination-combobox-list');
    if (list) {
        list.style.display = 'block';
        renderDestinationOptions(val);
    }
}

function selectDestination(id, name) {
    selectedDestinationId = id;
    const input = document.getElementById('inputNextDestination');
    const hidden = document.getElementById('selectedDestinationId');
    if (input) input.value = name;
    if (hidden) hidden.value = id;
    
    document.getElementById('destination-combobox-list').style.display = 'none';
    if (typeof validatePDAForm === 'function') validatePDAForm();
}

function initDestinationCombobox() {
    document.addEventListener('click', function(e) {
        const wrapper = document.getElementById('inputNextDestination')?.parentElement;
        const dropdown = document.getElementById('destination-combobox-list');
        
        if (wrapper && dropdown && !wrapper.contains(e.target) && dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
        }
    });
}

// Initialize date picker on DOMContentLoaded
var originalDOMContentLoaded = window.onload || function(){};
window.onload = function() {
    if (typeof originalDOMContentLoaded === 'function') originalDOMContentLoaded();
    initDatePicker();
    renderTableBody();
    initProcessCombobox(); // Init process combobox
    initDestinationCombobox(); // Init destination combobox
};

// Also call initDatePicker immediately if DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        initDatePicker();
        initProcessCombobox(); // Init process combobox
        initDestinationCombobox(); // Init destination combobox
    }, 100);
}

// ============ QR SCANNER FUNCTIONS ============
let html5QrCode = null;
let currentScanField = '';

function openQRScanner(fieldId) {
    currentScanField = fieldId;
    const overlay = document.getElementById('qr-scanner-overlay');
    if (overlay) {
        overlay.classList.add('active');
        overlay.style.display = 'flex';
    }
    
    // Reset to camera tab first
    switchScannerTab('camera');
    
    // Initialize html5-qrcode if not already done
    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("qr-reader");
    }
    
    const config = { fps: 15, qrbox: { width: 250, height: 250 } };
    
    html5QrCode.start(
        { facingMode: "environment" }, // Use back camera
        config,
        (decodedText) => {
            // On successful scan
            const targetField = document.getElementById(currentScanField);
            if (targetField) {
                targetField.value = decodedText;
            }
            closeQRScanner();
            
            // Trigger appropriate handler after scan
            if (currentScanField === 'inputPallet') {
                handlePalletScan(decodedText);
            } else if (currentScanField === 'inputVatTu') {
                handleVatTuInput(decodedText);
            }
            
            // Validate form after scan
            validatePDAForm();
            
            // Auto-focus next field after small delay
            setTimeout(() => {
                if (currentScanField === 'inputPallet') {
                    // After scanning Pallet -> jump to Vật tư
                    const vattuField = document.getElementById('inputVatTu');
                    if (vattuField) {
                        vattuField.focus();
                    }
                } else if (currentScanField === 'inputVatTu') {
                    // After scanning Vật tư -> jump to Số lượng
                    const qtyField = document.getElementById('inputSoLuong');
                    if (qtyField) {
                        qtyField.focus();
                        qtyField.select();
                    }
                }
            }, 100);
        },
        (errorMessage) => {
            // Parse error - ignore, scanner keeps trying
        }
    ).catch((err) => {
        // Camera not available - silently switch to upload tab
        console.warn('Camera not available, switching to upload mode:', err);
        switchScannerTab('upload');
    });
}

function closeQRScanner() {
    const overlay = document.getElementById('qr-scanner-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        overlay.style.display = 'none';
    }
    
    if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(() => {});
    }
    
    // Reset tabs to camera view
    switchScannerTab('camera');
    
    // Reset file input
    const fileInput = document.getElementById('qr-file-input');
    if (fileInput) fileInput.value = '';
}

// Switch between camera and upload tabs
function switchScannerTab(tab) {
    const cameraTab = document.getElementById('tab-camera');
    const uploadTab = document.getElementById('tab-upload');
    const cameraView = document.getElementById('scanner-camera-view');
    const uploadView = document.getElementById('scanner-upload-view');
    
    if (tab === 'camera') {
        cameraTab?.classList.add('active');
        uploadTab?.classList.remove('active');
        if (cameraView) cameraView.style.display = 'block';
        if (uploadView) uploadView.style.display = 'none';
    } else {
        cameraTab?.classList.remove('active');
        uploadTab?.classList.add('active');
        if (cameraView) cameraView.style.display = 'none';
        if (uploadView) uploadView.style.display = 'block';
        
        // Stop camera when switching to upload
        if (html5QrCode && html5QrCode.isScanning) {
            html5QrCode.stop().catch(() => {});
        }
    }
}

// Scan QR code from uploaded image file
function scanImageFile(input) {
    if (!input.files || !input.files[0]) return;
    
    const file = input.files[0];
    
    // Initialize html5-qrcode if needed
    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("qr-reader");
    }
    
    // Suppress any alert() that html5-qrcode library may trigger internally
    if (!window._savedAlert) {
        window._savedAlert = window.alert;
        window.alert = () => {};
    }
    
    html5QrCode.scanFile(file, true)
        .then(decodedText => {
            // Restore alert if suppressed
            if (window._savedAlert) { window.alert = window._savedAlert; delete window._savedAlert; }

            const targetField = document.getElementById(currentScanField);
            if (targetField) {
                targetField.value = decodedText;
            }
            closeQRScanner();
            
            // Trigger appropriate handler after scan
            if (currentScanField === 'inputPallet') {
                handlePalletScan(decodedText);
            } else if (currentScanField === 'inputVatTu') {
                handleVatTuInput(decodedText);
            }
            
            // Validate form after scan
            validatePDAForm();
            
            // Auto-focus next field
            setTimeout(() => {
                if (currentScanField === 'inputPallet') {
                    const vattuField = document.getElementById('inputVatTu');
                    if (vattuField) vattuField.focus();
                } else if (currentScanField === 'inputVatTu') {
                    const qtyField = document.getElementById('inputSoLuong');
                    if (qtyField) {
                        qtyField.focus();
                        qtyField.select();
                    }
                }
            }, 100);
        })
        .catch(err => {
            // Restore alert
            if (window._savedAlert) { window.alert = window._savedAlert; delete window._savedAlert; }
            console.warn('Image scan error:', err);
            // Reset file input
            input.value = '';
        });
}

// ============ QUICK DATE FUNCTIONS ============
// Custom Calendar State
let pdaCalCurrentMonth = new Date().getMonth();
let pdaCalCurrentYear = new Date().getFullYear();
let pdaSelectedDate = null;
let tempCalSelectedDate = null; // Temporary selection before Clicking "Áp dụng"

function setExpiryDate(date) {
    const input = document.getElementById('inputExpiry');
    if (input) {
        // Format as dd/mm/yyyy
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        input.value = day + '/' + month + '/' + year;
        pdaSelectedDate = new Date(date);
    }
    validatePDAForm();
}

function addQuickDays(days) {
    const d = new Date();
    // Set to end of day to avoid issues
    d.setHours(0,0,0,0);
    d.setDate(d.getDate() + days);
    
    pdaCalCurrentMonth = d.getMonth();
    pdaCalCurrentYear = d.getFullYear();
    tempCalSelectedDate = new Date(d);
    
    renderPdaCalendar();
    
    // Highlight sidebar option
    const sidebar = document.querySelector('.pda-cal-sidebar');
    if (sidebar) {
        const options = sidebar.querySelectorAll('.pda-cal-option');
        options.forEach(opt => {
            opt.classList.toggle('active', opt.textContent.includes(days + ' Ngày'));
        });
    }
}

function addQuickMonths(months) {
    const d = new Date();
    d.setHours(0,0,0,0);
    d.setMonth(d.getMonth() + months);
    
    pdaCalCurrentMonth = d.getMonth();
    pdaCalCurrentYear = d.getFullYear();
    tempCalSelectedDate = new Date(d);
    
    renderPdaCalendar();
}

function addQuickYears(years) {
    const d = new Date();
    d.setHours(0,0,0,0);
    d.setFullYear(d.getFullYear() + years);
    
    pdaCalCurrentMonth = d.getMonth();
    pdaCalCurrentYear = d.getFullYear();
    tempCalSelectedDate = new Date(d);
    
    renderPdaCalendar();
    
    // Highlight sidebar option
    const sidebar = document.querySelector('.pda-cal-sidebar');
    if (sidebar) {
        const options = sidebar.querySelectorAll('.pda-cal-option');
        options.forEach(opt => {
            opt.classList.toggle('active', opt.textContent.includes(years + ' Năm'));
        });
    }
}

// ============ CUSTOM CALENDAR FUNCTIONS ============
function togglePdaCalendar() {
    const dropdown = document.getElementById('pda-calendar-dropdown');
    if (dropdown) {
        const isActive = dropdown.classList.contains('active');
        if (isActive) {
            closePdaCalendar();
        } else {
            // Reset state to current actual selection
            if (pdaSelectedDate) {
                tempCalSelectedDate = new Date(pdaSelectedDate);
                pdaCalCurrentMonth = tempCalSelectedDate.getMonth();
                pdaCalCurrentYear = tempCalSelectedDate.getFullYear();
            } else {
                tempCalSelectedDate = null;
                pdaCalCurrentMonth = new Date().getMonth();
                pdaCalCurrentYear = new Date().getFullYear();
            }
            
            // Clear sidebar highlights
            const sidebar = document.querySelector('.pda-cal-sidebar');
            if (sidebar) {
                sidebar.querySelectorAll('.pda-cal-option').forEach(opt => opt.classList.remove('active'));
            }
            
            dropdown.classList.add('active');
            renderPdaCalendar();
        }
    }
}

function closePdaCalendar() {
    const dropdown = document.getElementById('pda-calendar-dropdown');
    if (dropdown) dropdown.classList.remove('active');
}

function pdaCalPrevMonth() {
    pdaCalCurrentMonth--;
    if (pdaCalCurrentMonth < 0) {
        pdaCalCurrentMonth = 11;
        pdaCalCurrentYear--;
    }
    renderPdaCalendar();
}

function pdaCalNextMonth() {
    pdaCalCurrentMonth++;
    if (pdaCalCurrentMonth > 11) {
        pdaCalCurrentMonth = 0;
        pdaCalCurrentYear++;
    }
    renderPdaCalendar();
}

function renderPdaCalendar() {
    const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    // Short names for grid
    const shortMonths = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];

    // 1. Setup Custom Dropdowns
    const monthDropdown = document.getElementById('pdaMonthDropdown');
    const monthSelected = document.getElementById('pdaMonthSelected');
    const monthList = document.getElementById('pdaMonthList');
    
    const yearDropdown = document.getElementById('pdaYearDropdown');
    const yearSelected = document.getElementById('pdaYearSelected');
    const yearList = document.getElementById('pdaYearList');
    
    // Populate Month Grid
    if (monthList && monthList.children.length === 0) {
        monthList.innerHTML = shortMonths.map((m, i) => 
            `<div class="dropdown-item" data-value="${i}">${m}</div>`
        ).join('');
        
        // Add click listeners to items
        monthList.querySelectorAll('.dropdown-item').forEach(item => {
            item.onclick = function(e) {
                e.stopPropagation();
                pdaCalCurrentMonth = parseInt(item.getAttribute('data-value'));
                renderPdaCalendar();
                monthDropdown.classList.remove('active');
            };
        });
    }

    // Populate Year Grid (12 years: 4 cols x 3 rows)
    // Center the range around pdaCalCurrentYear
    if (yearList) {
        // Clear existing list to ensure range updates when year changes
        yearList.innerHTML = '';
        
        // We want 12 items. Let's put current year roughly in the middle.
        // e.g. -5 to +6 (total 12)
        const startYear = pdaCalCurrentYear - 5;
        const endYear = pdaCalCurrentYear + 6;
        
        for(let y = startYear; y <= endYear; y++) {
             // Create item
             const item = document.createElement('div');
             item.className = 'dropdown-item';
             item.setAttribute('data-value', y);
             item.textContent = y;
             
             // Check selected
             if (y === pdaCalCurrentYear) {
                 item.classList.add('selected');
             }
             
             // Click handler
             item.onclick = function(e) {
                e.stopPropagation();
                pdaCalCurrentYear = parseInt(item.getAttribute('data-value'));
                renderPdaCalendar();
                yearDropdown.classList.remove('active');
             };
             
             yearList.appendChild(item);
        }
    }

    // Update Selected Text and Active States
    if(monthSelected) monthSelected.textContent = monthNames[pdaCalCurrentMonth];
    if(yearSelected) yearSelected.textContent = pdaCalCurrentYear;
    
    // Highlight selected item in lists
    if(monthList) {
         monthList.querySelectorAll('.dropdown-item').forEach(i => {
             i.classList.toggle('selected', parseInt(i.getAttribute('data-value')) === pdaCalCurrentMonth);
         });
    }
    if(yearList) {
         yearList.querySelectorAll('.dropdown-item').forEach(i => {
             i.classList.toggle('selected', parseInt(i.getAttribute('data-value')) === pdaCalCurrentYear);
         });
    }

    // Setup Toggle Handlers (only once)
    if (monthDropdown && !monthDropdown.hasAttribute('data-init')) {
        monthDropdown.setAttribute('data-init', 'true');
        monthDropdown.onclick = function(e) {
            e.stopPropagation();
            const isActive = monthDropdown.classList.contains('active');
            // close others
            if(yearDropdown) yearDropdown.classList.remove('active');
            if(!isActive) monthDropdown.classList.add('active');
            else monthDropdown.classList.remove('active');
        };
    }
    
    if (yearDropdown && !yearDropdown.hasAttribute('data-init')) {
        yearDropdown.setAttribute('data-init', 'true');
        yearDropdown.onclick = function(e) {
            e.stopPropagation();
            const isActive = yearDropdown.classList.contains('active');
             // close others
            if(monthDropdown) monthDropdown.classList.remove('active');
            if(!isActive) yearDropdown.classList.add('active');
            else yearDropdown.classList.remove('active');
        };
    }

    // 2. Render Calendar Days
    const daysContainer = document.getElementById('pda-cal-days');
    if (!daysContainer) return;
    
    daysContainer.innerHTML = '';
    
    const firstDay = new Date(pdaCalCurrentYear, pdaCalCurrentMonth, 1);
    const lastDay = new Date(pdaCalCurrentYear, pdaCalCurrentMonth + 1, 0);
    const startDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Previous month days
    const prevMonthLastDay = new Date(pdaCalCurrentYear, pdaCalCurrentMonth, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pda-cal-day other-month';
        btn.textContent = prevMonthLastDay - i;
        const d = new Date(pdaCalCurrentYear, pdaCalCurrentMonth - 1, prevMonthLastDay - i);
        btn.onclick = function() { pdaSelectDate(d); };
        daysContainer.appendChild(btn);
    }
    
    // Current month days
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pda-cal-day';
        btn.textContent = day;
        
        const d = new Date(pdaCalCurrentYear, pdaCalCurrentMonth, day);
        
        if (d.getTime() === today.getTime()) {
            btn.classList.add('today');
        }
        
        if (tempCalSelectedDate && d.getTime() === tempCalSelectedDate.getTime()) {
            btn.classList.add('selected');
        }
        
        btn.onclick = function() { 
            tempCalSelectedDate = new Date(d);
            // Clear sidebar highlights when manual selection occurs
            const sidebar = document.querySelector('.pda-cal-sidebar');
            if (sidebar) sidebar.querySelectorAll('.pda-cal-option').forEach(opt => opt.classList.remove('active'));
            renderPdaCalendar(); 
        };
        daysContainer.appendChild(btn);
    }
    
    // Next month days to fill grid
    const totalCells = daysContainer.children.length;
    const remaining = 42 - totalCells; // 6 rows * 7 days
    for (let i = 1; i <= remaining && totalCells + i <= 42; i++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pda-cal-day other-month';
        btn.textContent = i;
        const d = new Date(pdaCalCurrentYear, pdaCalCurrentMonth + 1, i);
        btn.onclick = function() { 
            tempCalSelectedDate = new Date(d);
            renderPdaCalendar();
        };
        daysContainer.appendChild(btn);
    }
}

function pdaCalApply() {
    if (tempCalSelectedDate) {
        setExpiryDate(tempCalSelectedDate);
    }
    closePdaCalendar();
}

function pdaCalCancel() {
    closePdaCalendar();
}

// Close calendar when clicking outside
document.addEventListener('click', function(e) {
    const wrapper = document.querySelector('.pda-datepicker-wrapper');
    const dropdown = document.getElementById('pda-calendar-dropdown');
    if (wrapper && dropdown && !wrapper.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});

// ============ PDA FORM VALIDATION ============
function validatePDAForm() {
    const pallet = document.getElementById('inputPallet')?.value.trim();
    const vattu = document.getElementById('inputVatTu')?.value.trim();
    const soluong = document.getElementById('inputSoLuong')?.value;
    const arrival = document.getElementById('inputArrival')?.value;
    const expiry = document.getElementById('inputExpiry')?.value;
    const nextDest = document.getElementById('selectedDestinationId')?.value;
    const processId = document.getElementById('selectedProcessId')?.value;
    const btn = document.getElementById('btnNext');
    
    if (btn) {
        // MANDATORY: process is required. Expiry OR NextDest is required based on tab mode
        let hasRequiredModeField = false;
        if (currentTabMode === 'transfer') {
            hasRequiredModeField = !!nextDest;
        } else {
            hasRequiredModeField = !!expiry;
        }
        
        const isValid = (pallet || vattu) && soluong && parseInt(soluong) > 0 && processId && hasRequiredModeField;
        btn.disabled = !isValid;
    }
}

// Generate receipt code when form is submitted
function generateReceipt() {
    const palletInput = document.getElementById('inputPallet');
    const vattuInput = document.getElementById('inputVatTu');
    const slInput = document.getElementById('inputSoLuong');
    const expInput = document.getElementById('inputExpiry');
    const destInput = document.getElementById('selectedDestinationId');
    const procInput = document.getElementById('inputProcess');
    
    const pallet = palletInput?.value.trim() || 'P-XXX';
    const vattu = vattuInput?.value.trim() || 'VT-XXX';
    const soluong = slInput?.value || '0';
    const expiry = expInput?.value;
    const nextDest = destInput?.value;
    
    if (currentTabMode === 'normal' && !expiry) {
        return alert('Vui lòng chọn ngày hết hạn');
    }
    if (currentTabMode === 'transfer' && !nextDest) {
        return alert('Vui lòng chọn đích đến tiếp theo');
    }
    
    const now = new Date();
    const dateStr = String(now.getDate()).padStart(2, '0') + 
                    String(now.getMonth() + 1).padStart(2, '0') + 
                    now.getFullYear();
    const code = `${pallet}_${vattu}_${soluong}_${dateStr}`;
    
    const newOrder = {
        id: Date.now(),
        code: code,
        supplier: 'PDA Import',
        status: 'PENDING',
        priority: document.getElementById('inputPriority')?.checked || false,
        type: 'Nhập nội bộ',
        creator: { id: 'US_PDA', name: 'PDA User' },
        createdAt: now,
        pallets: [pallet],
        materials: [{
            code: vattu,
            name: vattuInput?.value || 'Vật tư PDA',
            qty: parseInt(soluong),
            unit: 'Cái',
            expiryDate: expiry
        }],
        process: procInput?.value || 'Quy trình mặc định',
        bin: ''
    };
    
    // Add to shared data
    MOCK_INBOUND_ORDERS.unshift(newOrder);
    
    console.log('New PDA order added:', newOrder);
    
    // Reset process field
    if(procInput) procInput.value = '';
    if(document.getElementById('selectedProcessId')) document.getElementById('selectedProcessId').value = '';
    selectedProcessId = null;
    
    // Close modal immediately and show toast
    closeCreateModal();
    refreshData();
    
    // Show success toast (using global showToast from script.js)
    if (typeof showToast === 'function') {
        showToast('Thêm lệnh nhập kho thành công!', 'success');
    }
}

// Initialize PDA form listeners
function initPDAFormListeners() {
    const inputs = ['inputPallet', 'inputVatTu', 'inputSoLuong'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', validatePDAForm);
        }
    });

    // Special handling for expiry observer
    const expInput = document.getElementById('inputExpiry');
    if (expInput) {
        // Expiry is changed via custom picker, we need to observe its value.
        // The pdaSelectDate function now calls validatePDAForm directly.
        // For manual input changes (if allowed), an 'input' listener would be needed.
        // For now, assume expiry is set via picker or pdaCalClear/Today.
    }
    
    // Special handling for Số lượng - only positive integers
    const slInput = document.getElementById('inputSoLuong');
    if (slInput) {
        slInput.addEventListener('input', function(e) {
            // Remove any non-digit characters and leading zeros
            let val = e.target.value.replace(/[^0-9]/g, '');
            // Remove leading zeros
            if (val.length > 1) {
                val = val.replace(/^0+/, '') || '0';
            }
            e.target.value = val;
            validatePDAForm();
        });
        
        // Prevent decimal point and minus sign
        slInput.addEventListener('keydown', function(e) {
            if (e.key === '.' || e.key === '-' || e.key === 'e' || e.key === 'E') {
                e.preventDefault();
            }
        });
    }
}

// Override openCreateModal to init PDA form
const originalOpenCreateModal = openCreateModal;
function openCreateModalPDA() {
    const modal = document.getElementById('modal-create');
    if (!modal) {
        console.error('modal-create element not found in DOM');
        return;
    }
    
    // Reset form
    ['inputPallet', 'inputVatTu', 'inputSoLuong', 'inputExpiry', 'inputProcess', 'selectedProcessId'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    // Reset global tracking var
    selectedProcessId = null; 

    // Add 'show' class and set opacity for compatibility with sidebar.css
    modal.classList.add('show');
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    
    const resultBox = document.getElementById('result-box');
    if (resultBox) resultBox.style.display = 'none';
    
    const btn = document.getElementById('btnNext');
    if (btn) btn.disabled = true;
    
    initPDAFormListeners();
    validatePDAForm();
    
    // Auto-focus on Mã Pallet field after modal is shown
    setTimeout(() => {
        const palletField = document.getElementById('inputPallet');
        if (palletField) {
            console.log('Focusing inputPallet...');
            palletField.focus();
            palletField.select();
        }
    }, 0);
}

// Expose functions to global window scope for HTML onclick handlers
console.log('inbound.js: Exposing functions to window object...');
window.openCreateModal = openCreateModalPDA;
window.closeCreateModal = closeCreateModal;
window.openSyncModal = openSyncModal;
window.closeSyncModal = closeSyncModal;
window.refreshData = refreshData;
window.saveInboundDraft = saveInboundDraft;
window.renderTableBody = renderTableBody;
window.goToMainPage = goToMainPage;
window.goToMainPageFromInput = goToMainPageFromInput;
window.printInboundOrder = printInboundOrder;
window.syncSingleOrder = syncSingleOrder;
window.handleSelectSearch = handleSelectSearch;
window.toggleSelectedBulk = toggleSelectedBulk;
window.confirmDeleteSingle = confirmDeleteSingle;
window.viewSelected = viewSelected;
window.addMaterialQuick = addMaterialQuick;
window.renderLiveSearch = renderLiveSearch;
window.gotoCreateSearchPage = gotoCreateSearchPage;
window.gotoSelectedPageInput = gotoSelectedPageInput;
window.gotoSelectedPage = gotoSelectedPage;
window.confirmSelectMaterials = confirmSelectMaterials;
window.toggleSelectAllModal = toggleSelectAllModal;
window.goToSelectPage = goToSelectPage;
window.goToSelectPageFromInput = goToSelectPageFromInput;
window.closeSelectModal = closeSelectModal;
window.openSelectModal = openSelectModal;
window.backToStep2 = backToStep2;
window.closeStep3Modal = closeStep3Modal;
window.finalSaveInbound = finalSaveInbound;
window.handleMainSearchKeyup = handleMainSearchKeyup;
window.initButtonListeners = initButtonListeners;
// New PDA Modal functions
window.openQRScanner = openQRScanner;
window.closeQRScanner = closeQRScanner;
window.switchScannerTab = switchScannerTab;
window.selectEntryType = selectEntryType;
window.selectCreator = selectCreator;
window.scanImageFile = scanImageFile;
window.addQuickDays = addQuickDays;
window.addQuickMonths = addQuickMonths;
window.addQuickYears = addQuickYears;
window.validatePDAForm = validatePDAForm;
window.generateReceipt = generateReceipt;
// Custom calendar functions
window.togglePdaCalendar = togglePdaCalendar;
window.closePdaCalendar = closePdaCalendar;
window.pdaCalPrevMonth = pdaCalPrevMonth;
window.pdaCalNextMonth = pdaCalNextMonth;
window.pdaCalApply = pdaCalApply;
window.pdaCalCancel = pdaCalCancel;
// --- Status Custom Dropdown Logic ---
let openStatusDropdownId = null;

function toggleStatusDropdown(id) {
    const el = document.getElementById(id);
    if (!el) return;
    
    // Close other dropdowns if any
    if (openStatusDropdownId && openStatusDropdownId !== id) {
        const other = document.getElementById(openStatusDropdownId);
        if(other) other.classList.remove('open');
    }
    
    el.classList.toggle('open');
    openStatusDropdownId = el.classList.contains('open') ? id : null;
}

function selectStatus(value, label) {
    const input = document.getElementById('filter-status');
    const labelEl = document.getElementById('status-selected-label');
    const dropdown = document.getElementById('status-dropdown');
    
    if (input) {
        input.value = value;
        mainCurrentPage = 1;
        renderTableBody();
    }
    
    if (labelEl) {
        labelEl.textContent = label;
    }
    
    // Update active class
    if (dropdown) {
        const options = dropdown.querySelectorAll('.dropdown-option');
        options.forEach(opt => {
            if (opt.getAttribute('data-value') === value) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
        
        // Close dropdown
        dropdown.classList.remove('open');
        openStatusDropdownId = null;
    }
}

// Close status dropdown on outside click
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('status-dropdown');
    if (dropdown && !dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
        if (openStatusDropdownId === 'status-dropdown') openStatusDropdownId = null;
    }
});

window.toggleStatusDropdown = toggleStatusDropdown;
window.selectStatus = selectStatus;

console.log('inbound.js: Script initialization complete. window.openCreateModal =', typeof window.openCreateModal);

// --- ORDER DETAIL MODAL ---
function formatBinLocation(binInfo) {
    if (!binInfo) return '';
    // Expected incoming format: T1-F1-P1-A1
    // T = Tầng, F = Cột, P = Rack, A = Ô
    // Format to: {Tầng}-{Letter(F)}{A}
    const parts = binInfo.split('-');
    if (parts.length === 4) {
        const floor = parseInt(parts[0].replace('T', ''));
        const colNum = parseInt(parts[1].replace('F', ''));
        const cell = parseInt(parts[3].replace('A', ''));
        
        // Convert colNum to letters (1=A, 2=B... 27=AA)
        let colLetter = '';
        let temp = colNum;
        while (temp > 0) {
            let remain = (temp - 1) % 26;
            colLetter = String.fromCharCode(65 + remain) + colLetter;
            temp = Math.floor((temp - 1) / 26);
        }
        
        return `${floor}-${colLetter}${cell}`;
    }
    return binInfo;
}

function openOrderDetailModal(orderId) {
    const order = MOCK_INBOUND_ORDERS.find(o => o.id == orderId || o.code === orderId);
    if (!order) return;

    // Update Title
    const title = document.getElementById('order-detail-title');
    if (title) title.innerText = `Thông tin lệnh ${order.code}`;

    // Helper functions
    const formatDate = (dateObj) => {
        if (!dateObj) return '-';
        const d = new Date(dateObj);
        return d.toLocaleDateString('en-GB') + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusLabel = (status) => {
        const map = {
            'COMPLETED': '<span style="color: #166534; background: #f0fdf4; padding: 2px 8px; border-radius: 4px; font-weight: 500;">Hoàn thành</span>',
            'PROCESSING': '<span style="color: #0369a1; background: #e0f2fe; padding: 2px 8px; border-radius: 4px; font-weight: 500;">Đang xử lý</span>',
            'PENDING': '<span style="color: #475569; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; font-weight: 500;">Đang chờ</span>',
            'CANCELLED': '<span style="color: #9f1239; background: #ffe4e6; padding: 2px 8px; border-radius: 4px; font-weight: 500;">Lỗi</span>',
        };
        return map[status] || status;
    };

    const getTypeLabel = (type) => {
        const types = {
            'NEW': { label: 'Nhập mới', color: '#3b82f6', bg: '#eff6ff' },
            'REENTRY': { label: 'Nhập lại', color: '#f59e0b', bg: '#fffbeb' },
            'TRANSFER': { label: 'Nhập chuyền thẳng', color: '#10b981', bg: '#f0fdf4' }
        };
        const config = types[type] || { label: type, color: '#64748b', bg: '#f1f5f9' };
        return `<span style="display:inline-block; width: 130px; text-align: center; background:${config.bg}; color:${config.color}; border:1px solid ${config.color}44; padding:4px 8px; border-radius:6px; font-size:12px; font-weight:500; white-space:nowrap;">${config.label}</span>`;
    };

    // Build Rows
    let coreRowsHtml = '';
    let matRowsHtml = '';

    const renderRow = (label, value) => {
        return `
        <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 0; font-weight: 500; color: #64748b; width: 40%;">${label}</td>
            <td style="padding: 12px 0; color: #1e293b; font-weight: 500;">${value}</td>
        </tr>`;
    };
    
    // Left Column: Core Info
    coreRowsHtml += renderRow('Loại lệnh nhập', getTypeLabel(order.type));
    coreRowsHtml += renderRow('Trạng thái', getStatusLabel(order.status));
    coreRowsHtml += renderRow('Ưu tiên', order.priority ? `<i class="fas fa-star" style="color: #f59e0b; margin-right: 4px;"></i> Có` : '-');
    coreRowsHtml += renderRow('Thời gian tạo', formatDate(order.createdAt));
    coreRowsHtml += renderRow('Thời gian hoàn thành', order.completedAt ? formatDate(order.completedAt) : '-');
    
    // Calculate Execution Time
    let executionTimeStr = '-';
    if (order.createdAt && order.completedAt) {
        let diffMs = order.completedAt.getTime() - order.createdAt.getTime();
        if (diffMs < 0) diffMs = 0; // Sanity check
        
        const diffSeconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(diffSeconds / 60);
        const seconds = diffSeconds % 60;
        
        if (minutes > 0) {
            executionTimeStr = `${minutes} phút ${seconds} giây`;
        } else {
            executionTimeStr = `${seconds} giây`;
        }
    }
    coreRowsHtml += renderRow('Thời gian thực hiện', executionTimeStr);

    const creatorUser = MOCK_USER_DATA[order.creator.id];
    const creatorName = creatorUser ? `${creatorUser.fullname} (${creatorUser.username})` : order.creator.name;
    coreRowsHtml += renderRow('Người tạo', creatorName);


    // Right Column: Materials & Status
    matRowsHtml += renderRow('Container', (order.pallets && order.pallets.length > 0) ? order.pallets.join(', ') : '-');
    matRowsHtml += renderRow('Vị trí lưu', order.bin ? formatBinLocation(order.bin) : '-');
    
    const mat = order.materials && order.materials.length > 0 ? order.materials[0] : null;
    matRowsHtml += renderRow('Mã vật tư', mat ? mat.code : '-');
    matRowsHtml += renderRow('Tên vật tư', mat ? mat.name : '-');
    matRowsHtml += renderRow('Số lượng', mat ? `${mat.qty} ${mat.unit}` : '-');
    matRowsHtml += renderRow('Quy cách', order.exportMethod || 'FIFO');
    matRowsHtml += renderRow('Ngày hết hạn', (mat && mat.expiryDate) ? new Date(mat.expiryDate).toLocaleDateString('en-GB') : '-');

    const coreTbody = document.getElementById('order-detail-core-tbody');
    if (coreTbody) coreTbody.innerHTML = coreRowsHtml;

    const matTbody = document.getElementById('order-detail-mat-tbody');
    if (matTbody) matTbody.innerHTML = matRowsHtml;

    // Show Modal
    const modal = document.getElementById('modal-order-detail');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
    }
}

function closeOrderDetailModal() {
    const modal = document.getElementById('modal-order-detail');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }
}
window.openOrderDetailModal = openOrderDetailModal;
window.closeOrderDetailModal = closeOrderDetailModal;