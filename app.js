/**
 * PHẦN MỀM QUẢN LÝ & IN ẤN HỢP ĐỒNG - BIÊN BẢN NGHIỆM THU A4 TONE XANH PASTEL
 * Đầy đủ tính năng: Nhập liệu, tính tiền tự động, dịch số thành chữ,
 * upload ảnh sản phẩm, upload phôi mẫu hóa đơn, sửa trực tiếp, xuất/nhập JSON.
 */

// ==================== KHỞI TẠO STATE DỮ LIỆU BAN ĐẦU ====================
const defaultState = {
  docType: 'bbnt', // 'bbnt' | 'bbtl' | 'hdmb' | 'pxk'
  docNumber: '-2026/KD-TGDD/BBNT',
  contractNumber: '-2026 /KD-TGDD/HĐMB',
  day: '29',
  month: '09',
  year: '2026',
  basisExtra: 'Căn cứ việc giao nhận hàng hóa, sản phẩm hoàn thành.',
  
  // Bên A (Bên Mua)
  partyA: {
    name: 'CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ HOÀNG THUỘC',
    address: '672/12 Mậu Thân, Phường Cái Khế, TP Cần Thơ, Việt Nam',
    tax: '1801823649',
    phone: '',
    bankAccount: '',
    bankName: '',
    rep: 'Ông TRẦN VĂN THUỘC',
    position: 'GIÁM ĐỐC'
  },

  // Bên B (Bên Bán - Điện Máy Xanh)
  partyB: {
    name: 'CHI NHÁNH CÔNG TY CỔ PHẦN ĐẦU TƯ ĐIỆN MÁY XANH',
    address: 'Số 2A, Đường Trần Hưng Đạo, Khóm 6, Phường Tân Thành, Tỉnh Cà Mau, Việt Nam.',
    store: 'ĐML_CMA_CMA - 155A NGUYỄN TẤT THÀNH',
    tax: '0303217354-006',
    phone: '1800 1060 – (+84) 8 38125957',
    rep: 'Lê Thụy Sơn Ca',
    position: 'Giám Đốc Vùng (RSM)',
    auth: 'Theo giấy ủy quyền số 50/2025/ĐMX/UQ ký ngày 4/12/2025'
  },

  // Danh mục hàng hóa
  products: [
    {
      id: 1,
      image: 'assets/may_loc_nuoc_kangaroo.jpg',
      name: 'Máy lọc nước RO nóng lạnh tủ đứng Kangaroo KF10A17 10 lõi',
      unit: 'Cái',
      qty: 1,
      price: 7990000
    }
  ],

  showProductImg: true,
  showUnitCol: false,

  // Lời kết và chữ ký
  closingNote1: 'Hai bên xác nhận số hàng hóa, sản phẩm trên đã được giao nhận đầy đủ và đúng theo yêu cầu và sẽ lập biên bản thanh lý hợp đồng này sau khi biên bản giao nhận được lập.',
  closingNote2: 'Biên bản được làm thành 2 bản, có giá trị như nhau. Mỗi bên giữ 1 bản.',
  signTitleA: 'ĐẠI DIỆN BÊN A',
  signTitleB: 'ĐẠI DIỆN BÊN B',
  footerText: 'Thegioididong.com và dienmayxanh.com',

  // Phôi nền hóa đơn lưu độc lập cho từng mẫu riêng biệt (Mẫu 1, 2, 3, 4 có phôi riêng!)
  templateOverlays: {
    bbnt: { bgUrl: '', opacity: 0.4, printWithBg: false },
    bbtl: { bgUrl: '', opacity: 0.4, printWithBg: false },
    hdmb: { bgUrl: '', opacity: 0.4, printWithBg: false },
    pxk:  { bgUrl: '', opacity: 0.4, printWithBg: false }
  },
  customLogoUrl: ''
};

// Khôi phục State từ LocalStorage nếu có để duy trì dữ liệu khi F5 hoặc mở lại
function getInitialState() {
  try {
    const saved = localStorage.getItem('saved_contract_state_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      return Object.assign({}, defaultState, parsed);
    }
  } catch (e) {
    console.warn('Lỗi đọc localStorage:', e);
  }
  return JSON.parse(JSON.stringify(defaultState));
}

let appState = getInitialState();
let isDirectEditActive = false;
let currentZoom = 1.0;

function saveStateToLocalStorage() {
  try {
    localStorage.setItem('saved_contract_state_v2', JSON.stringify(appState));
  } catch (e) {
    console.warn('Không thể lưu localStorage (vượt dung lượng ảnh):', e);
  }
}

// ==================== HÀM DỊCH SỐ THÀNH CHỮ TIẾNG VIỆT CHUẨN ====================
function docSoTienTiengViet(soTien) {
  if (soTien === 0) return 'Không đồng.';
  if (isNaN(soTien) || soTien < 0) return '';

  const chuSo = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  const donViLop = ['', 'ngàn', 'triệu', 'tỷ', 'ngàn tỷ', 'triệu tỷ'];

  function docBaChuSo(baChuSo, dayDu) {
    let tram = Math.floor(baChuSo / 100);
    let chuc = Math.floor((baChuSo % 100) / 10);
    let donVi = baChuSo % 10;
    let ketQua = '';

    if (tram > 0 || dayDu) {
      ketQua += chuSo[tram] + ' trăm ';
    }

    if (chuc > 1) {
      ketQua += chuSo[chuc] + ' mươi ';
      if (donVi === 1) ketQua += 'mốt ';
      else if (donVi === 5) ketQua += 'lăm ';
      else if (donVi === 4) ketQua += 'tư ';
      else if (donVi > 0) ketQua += chuSo[donVi] + ' ';
    } else if (chuc === 1) {
      ketQua += 'mười ';
      if (donVi === 5) ketQua += 'lăm ';
      else if (donVi > 0) ketQua += chuSo[donVi] + ' ';
    } else {
      // chuc === 0
      if (tram > 0 && donVi > 0) {
        ketQua += 'lẻ ' + chuSo[donVi] + ' ';
      } else if (donVi > 0) {
        ketQua += chuSo[donVi] + ' ';
      }
    }

    return ketQua.trim();
  }

  let strSo = Math.round(soTien).toString();
  let cacLop = [];
  while (strSo.length > 0) {
    let doDai = Math.min(3, strSo.length);
    cacLop.unshift(parseInt(strSo.slice(-doDai), 10));
    strSo = strSo.slice(0, -doDai);
  }

  let docTungLop = [];
  for (let i = 0; i < cacLop.length; i++) {
    let lop = cacLop[i];
    let viTriLop = cacLop.length - 1 - i;
    if (lop > 0) {
      let docLop = docBaChuSo(lop, i > 0);
      docTungLop.push(docLop + ' ' + donViLop[viTriLop]);
    }
  }

  let ketQuaChung = docTungLop.join(' ').replace(/\s+/g, ' ').trim();
  if (ketQuaChung.length === 0) return 'Không đồng.';

  // Viết hoa chữ cái đầu và thêm 'đồng chẵn.'
  ketQuaChung = ketQuaChung.charAt(0).toUpperCase() + ketQuaChung.slice(1) + ' đồng chẵn.';
  return ketQuaChung;
}

// Format số có dấu chấm phân cách hàng nghìn (ví dụ: 7.990.000)
function formatCurrency(number) {
  if (isNaN(number)) return '0';
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ==================== CẬP NHẬT FORM VÀ PREVIEW ====================

// Đồng bộ từ Form nhập liệu vào State và Preview
function updateDocumentPreview() {
  // Lấy giá trị từ form
  appState.docNumber = document.getElementById('doc-number').value.trim();
  appState.contractNumber = document.getElementById('contract-number').value.trim();
  appState.day = document.getElementById('doc-day').value.padStart(2, '0');
  appState.month = document.getElementById('doc-month').value.padStart(2, '0');
  appState.year = document.getElementById('doc-year').value.trim();
  appState.basisExtra = document.getElementById('doc-basis-extra').value.trim();

  // Bên A
  appState.partyA.name = document.getElementById('party-a-name').value.trim();
  appState.partyA.address = document.getElementById('party-a-address').value.trim();
  appState.partyA.tax = document.getElementById('party-a-tax').value.trim();
  appState.partyA.phone = document.getElementById('party-a-phone').value.trim();
  appState.partyA.bankAccount = document.getElementById('party-a-bank-account').value.trim();
  appState.partyA.bankName = document.getElementById('party-a-bank-name').value.trim();
  appState.partyA.rep = document.getElementById('party-a-rep').value.trim();
  appState.partyA.position = document.getElementById('party-a-position').value.trim();

  // Bên B
  appState.partyB.name = document.getElementById('party-b-name').value.trim();
  appState.partyB.address = document.getElementById('party-b-address').value.trim();
  appState.partyB.store = document.getElementById('party-b-store').value.trim();
  appState.partyB.tax = document.getElementById('party-b-tax').value.trim();
  appState.partyB.phone = document.getElementById('party-b-phone').value.trim();
  appState.partyB.rep = document.getElementById('party-b-rep').value.trim();
  appState.partyB.position = document.getElementById('party-b-position').value.trim();
  appState.partyB.auth = document.getElementById('party-b-auth').value.trim();

  // Lời kết & Chữ ký
  appState.closingNote1 = document.getElementById('closing-note-1').value.trim();
  appState.closingNote2 = document.getElementById('closing-note-2').value.trim();
  appState.signTitleA = document.getElementById('sign-title-a').value.trim();
  appState.signTitleB = document.getElementById('sign-title-b').value.trim();
  appState.footerText = document.getElementById('footer-text').value.trim();

  // Đổ ra giao diện xem trước A4
  renderPreview();
}

// Render dữ liệu lên khung A4
function renderPreview() {
  document.getElementById('pv-doc-number').textContent = appState.docNumber;
  document.getElementById('pv-contract-number').textContent = appState.contractNumber;
  document.getElementById('pv-basis-extra').textContent = appState.basisExtra ? `- ${appState.basisExtra}` : '';
  document.getElementById('pv-day').textContent = appState.day;
  document.getElementById('pv-month').textContent = appState.month;
  document.getElementById('pv-year').textContent = appState.year;

  // Bên A
  document.getElementById('pv-party-a-name').textContent = appState.partyA.name;
  document.getElementById('pv-party-a-address').textContent = appState.partyA.address;
  document.getElementById('pv-party-a-tax').textContent = appState.partyA.tax;
  document.getElementById('pv-party-a-phone').textContent = appState.partyA.phone;
  document.getElementById('pv-party-a-bank-account').textContent = appState.partyA.bankAccount;
  document.getElementById('pv-party-a-bank-name').textContent = appState.partyA.bankName;
  document.getElementById('pv-party-a-rep').textContent = appState.partyA.rep;
  document.getElementById('pv-party-a-position').textContent = appState.partyA.position;

  // Bên B
  document.getElementById('pv-party-b-name').textContent = appState.partyB.name;
  document.getElementById('pv-party-b-address').textContent = appState.partyB.address;
  document.getElementById('pv-party-b-store').textContent = appState.partyB.store;
  document.getElementById('pv-party-b-tax').textContent = appState.partyB.tax;
  document.getElementById('pv-party-b-phone').textContent = appState.partyB.phone;
  document.getElementById('pv-party-b-rep').textContent = appState.partyB.rep;
  document.getElementById('pv-party-b-position').textContent = appState.partyB.position;
  document.getElementById('pv-party-b-auth').textContent = appState.partyB.auth;

  // Ẩn/hiện dòng siêu thị hoặc uỷ quyền nếu để trống
  document.getElementById('pv-row-store').style.display = appState.partyB.store ? '' : 'none';
  document.getElementById('pv-row-auth').style.display = appState.partyB.auth ? '' : 'none';

  // Lời kết & Chữ ký
  const pvClosing1 = document.getElementById('pv-closing-note-1');
  const pvClosing2 = document.getElementById('pv-closing-note-2');
  if (pvClosing1) {
    pvClosing1.textContent = appState.closingNote1;
    pvClosing1.style.display = appState.closingNote1 ? '' : 'none';
  }
  if (pvClosing2) {
    pvClosing2.textContent = appState.closingNote2;
    pvClosing2.style.display = appState.closingNote2 ? '' : 'none';
  }
  document.getElementById('pv-sign-title-a').textContent = appState.signTitleA;
  document.getElementById('pv-sign-title-b').textContent = appState.signTitleB;
  document.getElementById('pv-sign-name-a').textContent = cleanSignName(appState.partyA.rep);
  document.getElementById('pv-sign-name-b').textContent = cleanSignName(appState.partyB.rep);
  
  // Đồng bộ nội dung chân trang (Footer) hiển thị đúng như Hình 2
  const pvFooter = document.getElementById('pv-footer-text');
  if (pvFooter) {
    pvFooter.textContent = appState.footerText || 'Thegioididong.com và dienmayxanh.com';
  }

  // Render bảng hàng hóa & tính tổng tiền
  renderGoodsTable();
}

// Bỏ các từ tiền tố "Ông", "Bà" khi ký tên
function cleanSignName(name) {
  if (!name) return '';
  return name.replace(/^(Ông|Bà|Anh|Chị)\s+/i, '').toUpperCase();
}

// ==================== QUẢN LÝ DANH MỤC HÀNG HÓA ====================

// Render danh sách ô nhập liệu hàng hóa trong Form
function renderProductInputs() {
  const container = document.getElementById('product-items-list');
  container.innerHTML = '';

  appState.products.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'product-item-card';
    card.innerHTML = `
      <div class="item-card-header">
        <span class="item-index-badge">Mặt hàng #${index + 1}</span>
        ${appState.products.length > 1 ? `
          <button type="button" class="btn-remove-item" onclick="removeProductRow(${index})" title="Xóa mặt hàng này">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            Xóa
          </button>
        ` : ''}
      </div>

      <!-- Upload ảnh sản phẩm -->
      ${appState.showProductImg ? `
        <div class="img-upload-field">
          <img class="img-preview-thumb" src="${item.image || 'assets/may_loc_nuoc_kangaroo.jpg'}" alt="Ảnh hàng">
          <div class="img-upload-btn-wrap">
            <label class="btn-choose-img">
              Chọn ảnh SP
              <input type="file" accept="image/*" onchange="handleProductImageUpload(${index}, event)">
            </label>
          </div>
        </div>
      ` : ''}

      <div class="form-group">
        <label>Tên & Mô tả hàng hóa *</label>
        <textarea rows="2" oninput="updateProductField(${index}, 'name', this.value)">${item.name}</textarea>
      </div>

      <div class="form-grid-3">
        ${appState.showUnitCol ? `
          <div class="form-group">
            <label>ĐVT</label>
            <input type="text" value="${item.unit || 'Cái'}" oninput="updateProductField(${index}, 'unit', this.value)">
          </div>
        ` : ''}
        <div class="form-group">
          <label>Số Lượng (SL)</label>
          <input type="number" min="1" value="${item.qty}" oninput="updateProductField(${index}, 'qty', parseInt(this.value) || 0)">
        </div>
        <div class="form-group">
          <label>Đơn Giá (VNĐ)</label>
          <input type="number" step="1000" value="${item.price}" oninput="updateProductField(${index}, 'price', parseFloat(this.value) || 0)">
        </div>
        <div class="form-group">
          <label>Thành Tiền</label>
          <input type="text" value="${formatCurrency(item.qty * item.price)} đ" disabled style="background:#f1f5f9;font-weight:bold;">
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Thêm dòng hàng hóa mới
function addProductRow() {
  const newId = appState.products.length + 1;
  appState.products.push({
    id: newId,
    image: 'assets/may_loc_nuoc_kangaroo.jpg',
    name: 'Sản phẩm mới ' + newId,
    unit: 'Cái',
    qty: 1,
    price: 0
  });
  renderProductInputs();
  renderGoodsTable();
  showToast('Đã thêm 1 dòng hàng hóa mới!');
}

// Xóa dòng hàng hóa
function removeProductRow(index) {
  if (appState.products.length <= 1) return;
  appState.products.splice(index, 1);
  renderProductInputs();
  renderGoodsTable();
  showToast('Đã xóa dòng hàng.');
}

// Cập nhật trường của hàng hóa
function updateProductField(index, field, value) {
  appState.products[index][field] = value;
  renderGoodsTable();
}

// Upload ảnh đại diện cho dòng sản phẩm
function handleProductImageUpload(index, event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    appState.products[index].image = e.target.result;
    renderProductInputs();
    renderGoodsTable();
    showToast('Đã cập nhật ảnh sản phẩm!');
  };
  reader.readAsDataURL(file);
}

// Bật/Tắt cột hình ảnh sản phẩm
function toggleProductImgColumn() {
  appState.showProductImg = document.getElementById('opt-show-product-img').checked;
  document.getElementById('th-img').style.display = appState.showProductImg ? '' : 'none';
  renderProductInputs();
  renderGoodsTable();
}

// Bật/Tắt cột đơn vị tính
function toggleUnitColumn() {
  appState.showUnitCol = document.getElementById('opt-show-unit-col').checked;
  document.getElementById('th-unit').style.display = appState.showUnitCol ? '' : 'none';
  renderProductInputs();
  renderGoodsTable();
}

// Render bảng hàng hóa lên bản xem trước A4
function renderGoodsTable() {
  const tbody = document.getElementById('pv-goods-tbody');
  tbody.innerHTML = '';

  let grandTotal = 0;

  appState.products.forEach(item => {
    const lineTotal = (item.qty || 0) * (item.price || 0);
    grandTotal += lineTotal;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      ${appState.showProductImg ? `
        <td class="text-center">
          <img class="table-product-img" src="${item.image || 'assets/may_loc_nuoc_kangaroo.jpg'}" alt="SP">
        </td>
      ` : ''}
      <td class="col-th-desc">${item.name}</td>
      ${appState.showUnitCol ? `<td class="text-center">${item.unit || 'Cái'}</td>` : ''}
      <td class="text-center">${item.qty}</td>
      <td class="text-right">${formatCurrency(item.price)}</td>
      <td class="text-right bold">${formatCurrency(lineTotal)}</td>
    `;
    tbody.appendChild(tr);
  });

  // Tổng tiền định dạng
  const formattedTotal = formatCurrency(grandTotal);
  document.getElementById('pv-table-grand-total').textContent = `${formattedTotal} vnd`;
  document.getElementById('display-total-amount').textContent = `${formattedTotal} VNĐ`;

  // Tổng tiền bằng chữ
  const words = docSoTienTiengViet(grandTotal);
  document.getElementById('pv-words-text').textContent = words;
  document.getElementById('display-total-in-words').textContent = words;

  // Cập nhật cho mẫu thanh lý BBTL
  document.getElementById('pv-bbtl-total').textContent = formattedTotal;
  document.getElementById('pv-bbtl-words').textContent = words;

  // Tính lại số cột cho ô TỔNG CỘNG
  let totalColspan = 3;
  if (!appState.showProductImg) totalColspan -= 1;
  if (appState.showUnitCol) totalColspan += 1;
  document.getElementById('td-total-label').setAttribute('colspan', totalColspan);
}

// ==================== CHUYỂN ĐỔI MẪU VĂN BẢN (TEMPLATES) ====================
function selectDocumentType(type) {
  appState.docType = type;

  // Cập nhật trạng thái nút
  document.querySelectorAll('.tpl-btn').forEach(btn => {
    if (btn.getAttribute('data-type') === type) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const pvTitle = document.getElementById('pv-doc-title');
  const pvLeadAction = document.getElementById('pv-lead-action');
  const secBbnt = document.getElementById('body-section-bbnt');
  const secBbtl = document.getElementById('body-section-bbtl');
  const secHdmb = document.getElementById('body-section-hdmb');

  if (type === 'bbnt') {
    // Mẫu 1: BIÊN BẢN NGHIỆM THU, GIAO NHẬN HÀNG HÓA
    pvTitle.textContent = 'BIÊN BẢN NGHIỆM THU, GIAO NHẬN HÀNG HÓA';
    document.getElementById('doc-number').value = '-2026/KD-TGDD/BBNT';
    pvLeadAction.textContent = 'Tiến hành bàn giao hàng hóa, sản phẩm/Dịch vụ như sau: Bên B giao cho bên A:';
    secBbnt.style.display = 'block';
    secBbtl.style.display = 'none';
    secHdmb.style.display = 'none';
    document.getElementById('closing-note-1').value = 'Hai bên xác nhận số hàng hóa, sản phẩm trên đã được giao nhận đầy đủ và đúng theo yêu cầu và sẽ lập biên bản thanh lý hợp đồng này sau khi biên bản giao nhận được lập.';
    document.getElementById('closing-note-2').value = 'Biên bản được làm thành 2 bản, có giá trị như nhau. Mỗi bên giữ 1 bản.';
  } else if (type === 'bbtl') {
    // Mẫu 2: BIÊN BẢN THANH LÝ HỢP ĐỒNG
    pvTitle.textContent = 'BIÊN BẢN THANH LÝ HỢP ĐỒNG';
    document.getElementById('doc-number').value = '-2026 /KD-TGDĐ/BBTL';
    pvLeadAction.textContent = 'Hai bên thống nhất thỏa thuận nội dung thanh lý hợp đồng như sau:';
    secBbnt.style.display = 'none';
    secBbtl.style.display = 'block';
    secHdmb.style.display = 'none';
    document.getElementById('closing-note-1').value = 'Thanh lý hợp đồng này được làm thành 2 bản, có giá trị như nhau. Mỗi bên giữ 1 bản.';
    document.getElementById('closing-note-2').value = '';
  } else if (type === 'hdmb') {
    // Mẫu 3: HỢP ĐỒNG MUA BÁN HÀNG HÓA
    pvTitle.textContent = 'HỢP ĐỒNG MUA BÁN HÀNG HÓA';
    document.getElementById('doc-number').value = '-2026 /KD-TGDD/HĐMB';
    pvLeadAction.textContent = 'Hai bên thống nhất ký kết hợp đồng mua bán với nội dung sau:';
    secBbnt.style.display = 'block'; // Hiển thị bảng hàng hoá trong HĐMB
    secBbtl.style.display = 'none';
    secHdmb.style.display = 'none';
    document.getElementById('closing-note-1').value = 'Hợp đồng được lập thành 02 (hai) bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản.';
    document.getElementById('closing-note-2').value = '';
  } else if (type === 'pxk') {
    // Mẫu 4: HÓA ĐƠN BÁN HÀNG / PHIẾU XUẤT KHO
    pvTitle.textContent = 'HÓA ĐƠN BÁN HÀNG KIÊM PHIẾU GIAO HÀNG';
    document.getElementById('doc-number').value = 'HD-2026/DMX-0892';
    pvLeadAction.textContent = 'Chi tiết hàng hóa xuất kho giao nhận:';
    secBbnt.style.display = 'block';
    secBbtl.style.display = 'none';
    secHdmb.style.display = 'none';
    document.getElementById('closing-note-1').value = 'Quý khách vui lòng kiểm tra kỹ số lượng, bao bì và quy cách hàng hóa trước khi ký nhận.';
    document.getElementById('closing-note-2').value = 'Phiếu giao hàng được lập thành 02 bản, mỗi bên giữ 01 bản.';
  }

  applyBgTemplate();
  updateTargetTemplateBadge();
  updateDocumentPreview();
  showToast(`Đã chuyển sang: ${pvTitle.textContent}`);
}

// ==================== QUẢN LÝ PHÔI MẪU NỀN & LOGO (UPLOAD TEMPLATE: PDF, DOCX, ẢNH) ====================

let loadedPdfDocument = null;

// Tải lên phôi hóa đơn nền - Hỗ trợ cả file PDF, DOCX (Word) và Ảnh (JPG, PNG, WebP)
async function handleBgTemplateUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const fileName = file.name.toLowerCase();

  // 1. NẾU LÀ FILE PDF
  if (fileName.endsWith('.pdf') || file.type === 'application/pdf') {
    showToast('Đang đọc và chuyển đổi trang PDF làm phôi...');
    try {
      if (window.pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }
      const arrayBuffer = await file.arrayBuffer();
      loadedPdfDocument = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = loadedPdfDocument.numPages;

      const select = document.getElementById('select-pdf-page');
      select.innerHTML = '';
      for (let i = 1; i <= numPages; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `Trang ${i} / ${numPages}`;
        select.appendChild(opt);
      }
      document.getElementById('pdf-page-selector').style.display = numPages > 1 ? 'block' : 'none';

      await renderPdfPageToTemplate(1);
      document.getElementById('bg-options-panel').style.display = 'flex';
      showToast(`Đã nạp file PDF (${numPages} trang) làm phôi nền thành công!`);
    } catch (err) {
      console.error(err);
      alert('Không thể đọc file PDF này. Vui lòng kiểm tra lại file.');
    }
    return;
  }

  // 2. NẾU LÀ FILE WORD (.docx, .doc)
  if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    showToast('Đang đọc nội dung file Word (.docx)...');
    try {
      const arrayBuffer = await file.arrayBuffer();
      if (window.mammoth) {
        const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
        const html = result.value;
        renderDocxToTemplate(html);
        document.getElementById('pdf-page-selector').style.display = 'none';
        document.getElementById('bg-options-panel').style.display = 'flex';
        showToast('Đã nạp file Word (.docx) làm phôi mẫu thành công!');
      } else {
        alert('Trình duyệt đang tải thư viện Word, vui lòng thử lại sau 2 giây.');
      }
    } catch (err) {
      console.error(err);
      alert('Không thể đọc file Word này.');
    }
    return;
  }

  // 3. NẾU LÀ HÌNH ẢNH (JPG, PNG, WebP)
  const reader = new FileReader();
  reader.onload = function(e) {
    setTemplateForCurrentDocType(e.target.result);
    document.getElementById('pdf-page-selector').style.display = 'none';
    showToast(`Đã tải lên ảnh phôi mẫu cho ${getDocTypeName(appState.docType)}!`);
  };
  reader.readAsDataURL(file);
}

// Chuyển trang PDF thành ảnh độ phân giải cao cho phôi A4
async function renderPdfPageToTemplate(pageNumber) {
  if (!loadedPdfDocument) return;
  const page = await loadedPdfDocument.getPage(parseInt(pageNumber));
  // Render với scale 2.0 để ảnh sắc nét độ phân giải cao
  const viewport = page.getViewport({ scale: 2.0 });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport: viewport }).promise;
  setTemplateForCurrentDocType(canvas.toDataURL('image/png'));
}

function changePdfPage(pageNumber) {
  renderPdfPageToTemplate(pageNumber);
  showToast(`Đã chuyển sang phôi Trang ${pageNumber}`);
}

// Chuyển đổi nội dung Word DOCX sang phôi mẫu
function renderDocxToTemplate(html) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1700;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Vẽ khung viền phôi mẫu Word
  ctx.strokeStyle = '#3b8c7b';
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

  ctx.fillStyle = '#19322c';
  ctx.font = 'bold 26px "Times New Roman", serif';
  ctx.fillText('PHÔI MẪU TẢI TỪ FILE WORD (.DOCX)', 60, 90);

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const textLines = tempDiv.innerText.split('\n').filter(l => l.trim().length > 0);

  ctx.font = '18px "Times New Roman", serif';
  ctx.fillStyle = '#555555';
  let y = 140;
  for (let i = 0; i < Math.min(textLines.length, 36); i++) {
    ctx.fillText(textLines[i].substring(0, 85), 60, y);
    y += 34;
  }

  setTemplateForCurrentDocType(canvas.toDataURL('image/png'));
}

// Lấy tên hiển thị của loại mẫu
function getDocTypeName(type) {
  const map = {
    bbnt: 'Mẫu 1: Biên Bản Nghiệm Thu & Giao Nhận',
    bbtl: 'Mẫu 2: Biên Bản Thanh Lý Hợp Đồng',
    hdmb: 'Mẫu 3: Hợp Đồng Mua Bán Hàng Hóa',
    pxk:  'Mẫu 4: Hóa Đơn / Phiếu Giao Hàng'
  };
  return map[type] || type;
}

// Cập nhật nhãn và dropdown hiển thị mẫu đang cấu hình phôi
function updateTargetTemplateBadge() {
  const badge = document.getElementById('lbl-active-template-name');
  const select = document.getElementById('select-target-template-upload');
  if (badge) badge.textContent = getDocTypeName(appState.docType);
  if (select) select.value = appState.docType;
}

// Chuyển nhanh loại mẫu muốn úp phôi từ dropdown
function changeUploadTargetTemplate(type) {
  selectDocumentType(type);
  showToast(`Đang cấu hình phôi cho: ${getDocTypeName(type)}`);
}

// Gán phôi nền chính xác cho loại mẫu đang chọn và lưu vào LocalStorage
function setTemplateForCurrentDocType(dataUrl) {
  if (!appState.templateOverlays) {
    appState.templateOverlays = JSON.parse(JSON.stringify(defaultState.templateOverlays));
  }
  const prev = appState.templateOverlays[appState.docType] || { opacity: 0.4, printWithBg: false };
  appState.templateOverlays[appState.docType] = {
    bgUrl: dataUrl,
    opacity: prev.opacity || 0.4,
    printWithBg: prev.printWithBg || false
  };
  applyBgTemplate();
  saveStateToLocalStorage();
}

// ==================== XUẤT FILE WORD (.DOC / .DOCX) ====================
function exportToWordDocx() {
  const pageElement = document.getElementById('a4-page-1');
  const clone = pageElement.cloneNode(true);

  // Bỏ overlay phôi nền nếu có
  const overlay = clone.querySelector('.template-bg-overlay');
  if (overlay) overlay.remove();

  const contentHtml = clone.innerHTML;

  const wordDocument = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${appState.docType || 'HopDong'}</title>
      <style>
        @page Section1 {
          size: 595.3pt 841.9pt; /* Kích thước A4 trong Word */
          margin: 40pt 42pt 40pt 56pt;
          mso-header-margin: 35.4pt;
          mso-footer-margin: 35.4pt;
        }
        div.Section1 { page: Section1; }
        body {
          font-family: 'Times New Roman', serif;
          font-size: 12pt;
          line-height: 1.3;
          color: #000;
        }
        table {
          border-collapse: collapse;
          width: 100%;
        }
        th, td {
          border: 1px solid black;
          padding: 4pt 6pt;
          font-size: 11pt;
        }
        .party-table, .party-table td {
          border: none !important;
          padding: 2pt 0;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .bold { font-weight: bold; }
        .italic { font-style: italic; }
        .doc-main-title { font-size: 15pt; font-weight: bold; text-align: center; }
        .national-name, .national-motto { text-align: center; font-weight: bold; }
        .signatures-block { width: 100%; margin-top: 20pt; }
        .underline-bold-red { color: #c90000; font-weight: bold; text-decoration: underline; }
        .a4-footer { border-top: 1px solid black; margin-top: 24pt; padding-top: 4pt; }
      </style>
    </head>
    <body>
      <div class="Section1">
        ${contentHtml}
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', wordDocument], { type: 'application/msword;charset=utf-8' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  const safeName = (appState.docNumber || 'van_ban').replace(/[^a-zA-Z0-9_-]/g, '_');
  downloadLink.download = `${safeName}.doc`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  showToast('Đã tải xuống file Word (.doc) thành công! Mở và chỉnh sửa trực tiếp trên Microsoft Word.');
}

// Áp dụng ảnh phôi nền vào khung A4 theo đúng mẫu đang được chọn
function applyBgTemplate() {
  const overlay = document.getElementById('template-bg-overlay-1');
  if (!appState.templateOverlays) {
    appState.templateOverlays = JSON.parse(JSON.stringify(defaultState.templateOverlays));
  }
  const currentTpl = appState.templateOverlays[appState.docType] || { bgUrl: '', opacity: 0.4, printWithBg: false };
  const panel = document.getElementById('bg-options-panel');

  if (currentTpl.bgUrl) {
    overlay.style.backgroundImage = `url("${currentTpl.bgUrl}")`;
    overlay.style.opacity = currentTpl.opacity;
    if (panel) panel.style.display = 'flex';
    const slider = document.getElementById('bg-opacity-slider');
    const lbl = document.getElementById('lbl-opacity');
    const chk = document.getElementById('chk-print-bg');
    if (slider) slider.value = Math.round(currentTpl.opacity * 100);
    if (lbl) lbl.textContent = `${Math.round(currentTpl.opacity * 100)}%`;
    if (chk) chk.checked = !!currentTpl.printWithBg;

    if (currentTpl.printWithBg) {
      document.documentElement.style.setProperty('--print-bg-display', 'block');
    } else {
      document.documentElement.style.setProperty('--print-bg-display', 'none');
    }
  } else {
    overlay.style.backgroundImage = 'none';
    if (panel) panel.style.display = 'none';
  }
  updateTargetTemplateBadge();
}

// Thay đổi độ mờ phôi của mẫu hiện tại
function changeBgOpacity(val) {
  if (!appState.templateOverlays) return;
  const currentTpl = appState.templateOverlays[appState.docType];
  if (currentTpl) {
    currentTpl.opacity = val / 100;
    const lbl = document.getElementById('lbl-opacity');
    if (lbl) lbl.textContent = `${val}%`;
    const overlay = document.getElementById('template-bg-overlay-1');
    if (overlay) overlay.style.opacity = currentTpl.opacity;
    saveStateToLocalStorage();
  }
}

// Cho phép in luôn phôi nền khi in giấy trắng
function togglePrintBackground() {
  if (!appState.templateOverlays) return;
  const currentTpl = appState.templateOverlays[appState.docType];
  if (currentTpl) {
    currentTpl.printWithBg = document.getElementById('chk-print-bg').checked;
    if (currentTpl.printWithBg) {
      document.documentElement.style.setProperty('--print-bg-display', 'block');
    } else {
      document.documentElement.style.setProperty('--print-bg-display', 'none');
    }
    saveStateToLocalStorage();
  }
}

// Xóa phôi nền của mẫu hiện tại
function removeBgTemplate() {
  if (!appState.templateOverlays) return;
  appState.templateOverlays[appState.docType] = { bgUrl: '', opacity: 0.4, printWithBg: false };
  applyBgTemplate();
  document.getElementById('file-bg-template').value = '';
  saveStateToLocalStorage();
  showToast(`Đã gỡ bỏ phôi nền của ${getDocTypeName(appState.docType)}`);
}

// Tải lên logo công ty
function handleLogoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    appState.customLogoUrl = e.target.result;
    document.getElementById('img-logo-preview').src = appState.customLogoUrl;
    document.getElementById('logo-preview-box').style.display = 'flex';
    showToast('Đã tải lên logo công ty!');
  };
  reader.readAsDataURL(file);
}

function removeCustomLogo() {
  appState.customLogoUrl = '';
  document.getElementById('logo-preview-box').style.display = 'none';
  document.getElementById('file-custom-logo').value = '';
  showToast('Đã xóa logo công ty.');
}

// Đồng bộ tiêu đề mẫu tự do
function syncCustomTitle(val) {
  document.getElementById('pv-doc-title').textContent = val;
}

function syncDocNumber(val) {
  document.getElementById('doc-number').value = val;
  document.getElementById('pv-doc-number').textContent = val;
}

// Đổi font chữ in
function changeDocFont(fontVal) {
  const a4Page = document.getElementById('a4-page-1');
  a4Page.style.fontFamily = fontVal;
  showToast('Đã thay đổi font chữ in ấn!');
}

// ==================== LƯU MẪU BÊN A VÀ DANH BẠ KHÁCH HÀNG ====================
function saveCustomerPreset() {
  const customerName = document.getElementById('party-a-name').value.trim();
  if (!customerName) {
    alert('Vui lòng nhập tên công ty / khách hàng trước khi lưu!');
    return;
  }

  let presets = JSON.parse(localStorage.getItem('saved_party_a_presets') || '[]');
  const newPreset = {
    id: Date.now(),
    name: customerName,
    address: document.getElementById('party-a-address').value.trim(),
    tax: document.getElementById('party-a-tax').value.trim(),
    phone: document.getElementById('party-a-phone').value.trim(),
    bankAccount: document.getElementById('party-a-bank-account').value.trim(),
    bankName: document.getElementById('party-a-bank-name').value.trim(),
    rep: document.getElementById('party-a-rep').value.trim(),
    position: document.getElementById('party-a-position').value.trim()
  };

  presets.push(newPreset);
  localStorage.setItem('saved_party_a_presets', JSON.stringify(presets));
  loadCustomerPresetDropdown();
  showToast(`Đã lưu "${customerName}" vào danh bạ mẫu Bên A!`);
}

function loadCustomerPresetDropdown() {
  const select = document.getElementById('select-customer-preset');
  select.innerHTML = '<option value="">-- Mẫu đã lưu --</option>';
  const presets = JSON.parse(localStorage.getItem('saved_party_a_presets') || '[]');
  presets.forEach((p, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = p.name.length > 25 ? p.name.substring(0, 25) + '...' : p.name;
    select.appendChild(opt);
  });
}

function applyCustomerPreset(idx) {
  if (idx === '') return;
  const presets = JSON.parse(localStorage.getItem('saved_party_a_presets') || '[]');
  const p = presets[idx];
  if (!p) return;

  document.getElementById('party-a-name').value = p.name;
  document.getElementById('party-a-address').value = p.address;
  document.getElementById('party-a-tax').value = p.tax;
  document.getElementById('party-a-phone').value = p.phone;
  document.getElementById('party-a-bank-account').value = p.bankAccount;
  document.getElementById('party-a-bank-name').value = p.bankName;
  document.getElementById('party-a-rep').value = p.rep;
  document.getElementById('party-a-position').value = p.position;

  updateDocumentPreview();
  showToast(`Đã áp dụng mẫu Bên A: ${p.name}`);
}

// ==================== BẬT/TẮT SỬA TRỰC TIẾP TRÊN TRANG IN (CONTENTEDITABLE) ====================
function toggleDirectEdit() {
  isDirectEditActive = !isDirectEditActive;
  const btn = document.getElementById('btn-toggle-edit');
  const txt = document.getElementById('txt-toggle-edit');
  const a4Page = document.getElementById('a4-page-1');

  if (isDirectEditActive) {
    btn.classList.add('btn-primary');
    btn.classList.remove('btn-secondary');
    txt.textContent = 'Sửa Trực Tiếp: BẬT';
    a4Page.classList.add('editable-active');
    
    // Gán contenteditable cho các vùng chữ
    const editableElements = a4Page.querySelectorAll('p, span, td, h2, h3, h4, strong');
    editableElements.forEach(el => {
      el.setAttribute('contenteditable', 'true');
    });
    showToast('Đã bật chế độ Sửa Trực Tiếp! Bạn có thể click chuột vào bất kỳ chữ nào trên trang in để sửa.');
  } else {
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-secondary');
    txt.textContent = 'Sửa Trực Tiếp: Tắt';
    a4Page.classList.remove('editable-active');

    const editableElements = a4Page.querySelectorAll('[contenteditable]');
    editableElements.forEach(el => {
      el.removeAttribute('contenteditable');
    });
    showToast('Đã tắt chế độ Sửa Trực Tiếp.');
  }
}

// ==================== THU PHÓNG BẢN XEM TRƯỚC (ZOOM CONTROLS) ====================
function setZoom(val) {
  const stage = document.getElementById('a4-stage');
  const buttons = document.querySelectorAll('.zoom-controls .btn-icon');
  buttons.forEach(b => b.classList.remove('active'));

  if (val === 'auto') {
    // Tự động căn chỉnh vừa chiều rộng màn hình
    const containerWidth = document.querySelector('.preview-area').clientWidth - 48;
    const a4WidthPx = 794; // ~210mm ở 96 DPI
    let autoScale = containerWidth / a4WidthPx;
    if (autoScale > 1.2) autoScale = 1.0;
    stage.style.transform = `scale(${autoScale})`;
    showToast(`Đã thu phóng vừa khung (${Math.round(autoScale * 100)}%)`);
    return;
  }

  currentZoom = val;
  stage.style.transform = `scale(${val})`;

  // Highlight nút tương ứng
  buttons.forEach(b => {
    if (val === 1.0 && b.id === 'btn-zoom-100') b.classList.add('active');
  });
}

// ==================== XUẤT VÀ NHẬP CẤU HÌNH TEMPLATE JSON ====================
function exportTemplateJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `mau_in_hop_dong_${appState.docType}_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('Đã xuất file cấu hình mẫu JSON thành công!');
}

function importTemplateJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      appState = Object.assign({}, defaultState, imported);
      populateFormFromState();
      updateDocumentPreview();
      renderProductInputs();
      showToast('Đã nạp file mẫu JSON thành công!');
    } catch (err) {
      alert('File JSON không hợp lệ!');
    }
  };
  reader.readAsText(file);
}

// Đổ dữ liệu từ state vào các ô input trên giao diện
function populateFormFromState() {
  document.getElementById('doc-number').value = appState.docNumber;
  document.getElementById('contract-number').value = appState.contractNumber;
  document.getElementById('doc-day').value = appState.day;
  document.getElementById('doc-month').value = appState.month;
  document.getElementById('doc-year').value = appState.year;
  document.getElementById('doc-basis-extra').value = appState.basisExtra;

  document.getElementById('party-a-name').value = appState.partyA.name;
  document.getElementById('party-a-address').value = appState.partyA.address;
  document.getElementById('party-a-tax').value = appState.partyA.tax;
  document.getElementById('party-a-phone').value = appState.partyA.phone;
  document.getElementById('party-a-bank-account').value = appState.partyA.bankAccount;
  document.getElementById('party-a-bank-name').value = appState.partyA.bankName;
  document.getElementById('party-a-rep').value = appState.partyA.rep;
  document.getElementById('party-a-position').value = appState.partyA.position;

  document.getElementById('party-b-name').value = appState.partyB.name;
  document.getElementById('party-b-address').value = appState.partyB.address;
  document.getElementById('party-b-store').value = appState.partyB.store;
  document.getElementById('party-b-tax').value = appState.partyB.tax;
  document.getElementById('party-b-phone').value = appState.partyB.phone;
  document.getElementById('party-b-rep').value = appState.partyB.rep;
  document.getElementById('party-b-position').value = appState.partyB.position;
  document.getElementById('party-b-auth').value = appState.partyB.auth;

  document.getElementById('closing-note-1').value = appState.closingNote1;
  document.getElementById('closing-note-2').value = appState.closingNote2;
  document.getElementById('sign-title-a').value = appState.signTitleA;
  document.getElementById('sign-title-b').value = appState.signTitleB;
  document.getElementById('footer-text').value = appState.footerText;
}

// Khôi phục dữ liệu mẫu gốc từ file PDF người dùng
function loadSampleData() {
  if (confirm('Bạn có muốn khôi phục về dữ liệu mẫu gốc từ tài liệu Điện Máy Xanh?')) {
    appState = JSON.parse(JSON.stringify(defaultState));
    populateFormFromState();
    selectDocumentType('bbnt');
    renderProductInputs();
    updateDocumentPreview();
    showToast('Đã khôi phục dữ liệu mẫu ban đầu!');
  }
}

// ==================== IN ẤN VÀ XUẤT PDF ====================
function printDocument() {
  // Nếu đang bật chế độ sửa trực tiếp, tắt tạm để văn bản in ra không có viền outline
  const wasEditing = isDirectEditActive;
  if (wasEditing) toggleDirectEdit();

  // Tạm thời xóa title trình duyệt để khi in không bị dính tiêu đề web ở đầu trang
  const originalTitle = document.title;
  document.title = ' ';

  // Gọi lệnh in của trình duyệt
  window.print();

  setTimeout(() => {
    document.title = originalTitle;
    if (wasEditing) toggleDirectEdit();
  }, 1000);
}

// Phím tắt bàn phím (Ctrl+P / Cmd+P)
window.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
    e.preventDefault();
    printDocument();
  }
});

// ==================== CHUYỂN TABS CHÍNH HEADER ====================
function switchMainTab(tabId) {
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

  const btn = document.getElementById(`tab-btn-${tabId}`);
  const pane = document.getElementById(`pane-${tabId}`);

  if (btn) btn.classList.add('active');
  if (pane) pane.classList.add('active');
}

// Sao chép mã lệnh GitHub
function copyCode(btn) {
  const codeBox = btn.parentElement.querySelector('code');
  navigator.clipboard.writeText(codeBox.textContent).then(() => {
    btn.textContent = 'Đã chép!';
    setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    showToast('Đã sao chép lệnh Terminal!');
  });
}

// Hiển thị Toast thông báo
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// ==================== KHỞI CHẠY KHI TẢI TRANG ====================
document.addEventListener('DOMContentLoaded', () => {
  populateFormFromState();
  renderProductInputs();
  updateDocumentPreview();
  applyBgTemplate();
  updateTargetTemplateBadge();
  loadCustomerPresetDropdown();
  setZoom(1.0);
});
