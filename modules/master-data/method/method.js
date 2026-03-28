// method.js
(function () {
    // Mock Data for Quy cách
    const initialMethods = [
        { id: 1, code: 'FIFO', name: 'First In First Out', description: 'Hàng nhập vào trước sẽ được ưu tiên xuất ra trước.' },
        { id: 2, code: 'FEFO', name: 'First Expired First Out', description: 'Hàng có ngày hết hạn sớm nhất sẽ được ưu tiên xuất ra trước.' },
        { id: 3, code: 'LIFO', name: 'Last In First Out', description: 'Hàng nhập vào sau cùng sẽ được ưu tiên xuất ra trước.' }
    ];

    let methods = [...initialMethods];
    let methodCurrentPage = 1;
    const methodRowsPerPage = 20;

    function initMethodModule() {
        console.log('initMethodModule running...');
        
        // Expose functions globally for HTML event attributes
        window.filterMethods = filterMethods;
        window.changeMethodPage = changeMethodPage;
        window.prevMethodPage = prevMethodPage;
        window.nextMethodPage = nextMethodPage;

        renderMethods();
    }

    function renderMethods() {
        const tbody = document.getElementById('method-table-body');
        const searchInput = document.getElementById('method-search');
        if (!tbody) return;

        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

        // Filter based on search term (Mã hoặc Tên)
        const filteredMethods = methods.filter(item =>
            item.code.toLowerCase().includes(searchTerm) ||
            item.name.toLowerCase().includes(searchTerm)
        );

        // Pagination Logic
        const totalItems = filteredMethods.length;
        const totalPages = Math.ceil(totalItems / methodRowsPerPage) || 1;

        if (methodCurrentPage > totalPages) methodCurrentPage = totalPages;
        if (methodCurrentPage < 1) methodCurrentPage = 1;

        const startIdx = (methodCurrentPage - 1) * methodRowsPerPage;
        const endIdx = Math.min(startIdx + methodRowsPerPage, totalItems);
        const pagedMethods = filteredMethods.slice(startIdx, endIdx);

        // Build Table Content
        if (totalItems === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 30px; color: #94a3b8; font-style: italic;">Không tìm thấy quy cách nào phù hợp</td></tr>`;
        } else {
            tbody.innerHTML = pagedMethods.map((item, index) => {
                const stt = startIdx + index + 1;
                return `
                    <tr>
                        <td style="text-align: center;">${stt}</td>
                        <td style="font-weight: 600; color: #076EB8;">${item.code}</td>
                        <td style="font-weight: 500;">${item.name}</td>
                        <td style="white-space: normal; min-width: 250px; line-height: 1.5;">${item.description}</td>
                        <td style="text-align: center;">
                            <button class="action-btn btn-disabled" title="Không thể sửa">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn btn-disabled" title="Không thể xóa">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
        }

        updatePaginationUI(totalItems, startIdx + 1, endIdx, totalPages);
    }

    function updatePaginationUI(total, start, end, totalPages) {
        const info = document.getElementById('method-page-info');
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        const pageContainer = document.getElementById('method-pages');

        if (info) {
            info.innerText = total > 0 ? `Hiển thị ${start} - ${end} trong ${total}` : 'Hiển thị 0 - 0 trong 0';
        }

        if (btnPrev) {
            btnPrev.disabled = methodCurrentPage === 1;
            btnPrev.onclick = prevMethodPage;
        }

        if (btnNext) {
            btnNext.disabled = methodCurrentPage === totalPages;
            btnNext.onclick = nextMethodPage;
        }

        if (pageContainer) {
            pageContainer.innerHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement('button');
                btn.className = `btn-page ${i === methodCurrentPage ? 'active' : ''}`;
                btn.innerText = i;
                btn.onclick = () => changeMethodPage(i);
                pageContainer.appendChild(btn);
            }
        }
    }

    function filterMethods() {
        methodCurrentPage = 1; // Reset to first page on search
        renderMethods();
    }

    function changeMethodPage(page) {
        methodCurrentPage = page;
        renderMethods();
    }

    function prevMethodPage() {
        if (methodCurrentPage > 1) {
            methodCurrentPage--;
            renderMethods();
        }
    }

    function nextMethodPage() {
        const searchInput = document.getElementById('method-search');
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const filteredCount = methods.filter(item =>
            item.code.toLowerCase().includes(searchTerm) ||
            item.name.toLowerCase().includes(searchTerm)
        ).length;
        
        const totalPages = Math.ceil(filteredCount / methodRowsPerPage);
        if (methodCurrentPage < totalPages) {
            methodCurrentPage++;
            renderMethods();
        }
    }

    // Initialize module
    initMethodModule();

})();
