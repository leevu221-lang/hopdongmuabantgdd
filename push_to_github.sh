#!/bin/bash

# ==============================================================================
# SCRIPT TỰ ĐỘNG ĐẨY MÃ NGUỒN LÊN GITHUB (QUẢN LÝ & IN ẤN HỢP ĐỒNG A4)
# ==============================================================================

set -e

PROJECT_DIR="/Users/linhvu/.gemini/antigravity-ide/scratch/in-hop-dong-a4"
cd "$PROJECT_DIR"

echo "========================================================"
echo "   HỆ THỐNG ĐẨY DỰ ÁN LÊN GITHUB & DEPLOY GITHUB PAGES  "
echo "========================================================"
echo "Thư mục dự án: $PROJECT_DIR"
echo ""

# Lấy URL repository từ tham số dòng lệnh hoặc nhắc người dùng nhập
REPO_URL="$1"

if [ -z "$REPO_URL" ]; then
  echo "Bạn chưa truyền URL repository."
  echo "Mẹo: Bạn có thể tạo repo mới tại: https://github.com/new (Đặt tên: in-hop-dong-a4)"
  echo ""
  read -p ">> Hãy dán link GitHub Repository của bạn vào đây: " REPO_URL
fi

if [ -z "$REPO_URL" ]; then
  echo "Lỗi: Chưa cung cấp link GitHub Repository. Đã hủy thao tác."
  exit 1
fi

echo ""
echo "[1/4] Khởi tạo Git repository..."
if [ ! -d ".git" ]; then
  git init
fi

echo "[2/4] Thêm tất cả các file mã nguồn..."
git add .

echo "[3/4] Tạo Commit..."
git commit -m "Khởi tạo công cụ Nhập Liệu & In Ấn Hợp Đồng - Biên Bản Nghiệm Thu A4 Tone Xanh Pastel" || echo "Không có thay đổi mới để commit."

git branch -M main

echo "[4/4] Đang kết nối tới GitHub và đẩy mã nguồn..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"

echo "Đang đẩy lên nhánh 'main'..."
git push -u origin main --force

echo ""
echo "========================================================"
echo "   THÀNH CÔNG! ĐÃ ĐẨY DỰ ÁN LÊN GITHUB THÀNH CÔNG!     "
echo "========================================================"
echo ""
echo "Các bước tiếp theo để xem website hoạt động online:"
echo "1. Truy cập vào Repository của bạn trên GitHub:"
echo "   $REPO_URL"
echo "2. Vào mục 'Settings' -> chọn 'Pages' ở cột bên trái."
echo "3. Tại mục 'Build and deployment':"
echo "   - Source: Deploy from a branch"
echo "   - Branch: Chọn 'main' / Folder: /(root) -> Bấm 'Save'."
echo "4. Đợi khoảng 1-2 phút, bạn có thể truy cập website tại:"
echo "   https://leevu221-lang.github.io/in-hop-dong-a4/"
echo "========================================================"
