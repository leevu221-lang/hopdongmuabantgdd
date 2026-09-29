# 📄 InHopDong A4 Pro - Phần Mềm Quản Lý & In Ấn Hợp Đồng, Biên Bản Nghiệm Thu Chuẩn A4

Ứng dụng web trực quan, hiện đại với **Tone Xanh Pastel Mint & Sage** thanh lịch, chuyên dụng để nhập liệu thông tin hợp đồng kinh tế, biên bản nghiệm thu & giao nhận hàng hóa, biên bản thanh lý hợp đồng và in ấn chuẩn khổ giấy A4 theo đúng chuẩn văn bản hành chính Việt Nam (Nghị định 30/2020/NĐ-CP).

![Tone Xanh Pastel](https://img.shields.io/badge/Giao_Di%E1%BB%87n-Tone_Xanh_Pastel-52ab98?style=for-the-badge)
![Khổ Giấy A4](https://img.shields.io/badge/Kh%E1%BB%95_Gi%E1%BA%A5y-Chu%E1%BA%A9n_A4-255d52?style=for-the-badge)
![GitHub Pages Ready](https://img.shields.io/badge/Deploy-GitHub_Pages_Ready-22c55e?style=for-the-badge)

---

## ✨ Tính Năng Nổi Bật

### 1. 📋 Đầy Đủ Các Mẫu Văn Bản Theo Mẫu Điện Máy Xanh & Doanh Nghiệp
- **Mẫu 1: Biên Bản Nghiệm Thu, Giao Nhận Hàng Hóa (BBNT)**:
  - Header Quốc hiệu tiêu ngữ chuẩn.
  - Bảng danh mục sản phẩm chi tiết có hình ảnh minh họa, mô tả, số lượng, đơn giá, thành tiền.
  - Tự động cộng tổng tiền và **dịch số tiền thành chữ Tiếng Việt chuẩn xác 100%** (ví dụ: `7.990.000` ➔ `Bảy triệu chín trăm chín mươi ngàn đồng chẵn.`).
- **Mẫu 2: Biên Bản Thanh Lý Hợp Đồng (BBTL)**:
  - Thỏa thuận điều 1: Nội dung giao dịch (nhận đủ số lượng, đảm bảo chất lượng, đã nhận hóa đơn).
  - Thỏa thuận điều 2: Giá trị thanh lý và thời gian thanh toán.
- **Mẫu 3: Hợp Đồng Mua Bán Hàng Hóa (HĐMB)**:
  - Đầy đủ các điều khoản kinh tế, bảo hành, phương thức thanh toán.
- **Mẫu 4: Hóa Đơn / Phiếu Xuất Kho Kiêm Giao Hàng (PXK)**.

### 2. 🏢 Nhập Liệu Chi Tiết Thông Tin Bên A & Bên B
- **Bên Mua (Bên A)**: Tên công ty, Mã số thuế, Trụ sở, Điện thoại, STK ngân hàng, Tên ngân hàng, Đại diện, Chức vụ.
  - Hỗ trợ nút **"+ Lưu mẫu Bên A"** vào danh bạ trình duyệt (LocalStorage) để tái sử dụng nhanh chóng cho các lần tạo hợp đồng sau.
- **Bên Bán (Bên B)**: Cấu hình sẵn theo Chi nhánh Điện Máy Xanh (Siêu thị bán hàng, MST, Hotline, Người đại diện, Chức vụ, Số giấy ủy quyền) hoặc tùy biến tự do theo công ty của bạn.

### 3. 📦 Danh Mục Hàng Hóa Linh Hoạt & Đa Năng
- Thêm / Xóa dòng hàng hóa tùy ý.
- **Upload ảnh sản phẩm trực tiếp từ máy tính**: Tự động hiển thị sắc nét trong bảng in.
- Tùy chọn ẩn/hiện cột hình ảnh và cột Đơn vị tính (ĐVT).
- Tự động nhân `Số lượng × Đơn giá = Thành tiền`.

### 4. 🎨 Trung Tâm Tải Lên & Thay Đổi Mẫu Hóa Đơn (Template Manager)
- **Tải lên ảnh phôi mẫu hóa đơn có sẵn (Background Template)**: Nếu doanh nghiệp của bạn đã có giấy in hóa đơn/hợp đồng in màu sẵn khung viền, bạn có thể tải ảnh phôi lên để căn chỉnh vị trí chữ in đè chính xác 100%.
- Tùy chỉnh thanh trượt độ mờ phôi (opacity slider).
- Tùy chọn: "In đè chữ lên phôi giấy có sẵn" hoặc "In kèm phôi nền".
- **Tải lên Logo công ty**: Tùy biến thương hiệu doanh nghiệp.
- **Xuất / Nhập cấu hình mẫu bằng file JSON**: Sao lưu và chia sẻ mẫu văn bản dễ dàng.

### 5. ✏️ Chế Độ Sửa Trực Tiếp Trên Mặt Giấy (ContentEditable)
- Bật nút **"Sửa Trực Tiếp"** trên thanh công cụ để click chuột vào bất kỳ đoạn chữ nào trên trang A4 và sửa nhanh trực tiếp trước khi in!

### 6. 🖨️ In Ấn Chuẩn Khổ Giấy A4 (210mm × 297mm)
- Căn lề chuẩn văn bản hành chính Việt Nam (Nghị định 30).
- CSS `@media print` tối ưu: Tự động ẩn toàn bộ header, thanh điều khiển, nút bấm khi in. Chỉ xuất ra mặt giấy A4 trắng tinh khiết, nét chữ sắc bén.
- Phím tắt nhanh: `Ctrl + P` (Windows) hoặc `Cmd + P` (Mac).

---

## 🚀 Hướng Dẫn Đẩy Lên GitHub & Chạy Online Miễn Phí (GitHub Pages)

### Bước 1: Tạo Repository Trên GitHub
1. Truy cập [github.com/new](https://github.com/new).
2. Đặt tên Repository: `in-hop-dong-a4`.
3. Chọn quyền **Public**.
4. Nhấn **Create repository**.

### Bước 2: Chạy Script Tự Động Đẩy Code
Mở Terminal trên máy tính và chạy dòng lệnh sau (thay bằng link repo GitHub của bạn):

```bash
cd /Users/linhvu/.gemini/antigravity-ide/scratch/in-hop-dong-a4
./push_to_github.sh https://github.com/leevu221-lang/in-hop-dong-a4.git
```

*(Hoặc dùng script Python: `python3 push_to_github.py https://github.com/leevu221-lang/in-hop-dong-a4.git`)*

### Bước 3: Kích Hoạt Website GitHub Pages
1. Mở trang Repository của bạn trên GitHub.
2. Vào **Settings** ➔ chọn mục **Pages** ở danh mục bên trái.
3. Tại **Build and deployment**:
   - **Source**: Chọn `Deploy from a branch`
   - **Branch**: Chọn `main` / Thư mục `/(root)`
   - Nhấn **Save**.
4. Sau 1 phút, trang web của bạn sẽ hoạt động trực tuyến tại:
   `https://leevu221-lang.github.io/in-hop-dong-a4/`

---

## 💻 Cách Chạy Trực Tiếp Trên Máy Tính (Local)
Không cần cài đặt bất kỳ thư viện hay môi trường phức tạp nào! Bạn chỉ cần:
- Mở trực tiếp file `index.html` bằng bất kỳ trình duyệt nào (Google Chrome, Microsoft Edge, Safari, Cốc Cốc).
- Hoặc mở một máy chủ cục bộ nhẹ:
  ```bash
  python3 -m http.server 8080
  # Sau đó truy cập: http://localhost:8080
  ```

---

## 📁 Cấu Trúc Mã Nguồn

```text
in-hop-dong-a4/
├── index.html            # Giao diện chính, cấu trúc DOM A4 & các form nhập liệu
├── style.css             # Hệ thống thiết kế tone xanh pastel, layout 2 cột & CSS in ấn @media print
├── app.js                # Xử lý logic, tính tiền, dịch số thành chữ, upload ảnh/phôi, quản lý mẫu
├── push_to_github.sh     # Script Bash tự động đẩy mã nguồn lên GitHub
├── push_to_github.py     # Script Python dự phòng đẩy mã nguồn
├── assets/               # Thư mục hình ảnh tài nguyên & ảnh mẫu sản phẩm
│   └── may_loc_nuoc_kangaroo.jpg
└── README.md             # Hướng dẫn chi tiết
```

---

*Thiết kế và phát triển chuyên nghiệp, mang lại trải nghiệm tiện lợi và thẩm mỹ cao nhất cho công tác lập chứng từ kinh doanh.*
