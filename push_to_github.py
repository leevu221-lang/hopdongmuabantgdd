#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script Python tự động đẩy mã nguồn dự án in ấn hợp đồng lên GitHub
Chạy: python3 push_to_github.py [URL_REPOSITORY]
"""

import os
import sys
import subprocess

PROJECT_DIR = "/Users/linhvu/.gemini/antigravity-ide/scratch/in-hop-dong-a4"

def run_cmd(cmd, check=True):
    print(f"-> {cmd}")
    res = subprocess.run(cmd, shell=True, cwd=PROJECT_DIR, text=True, capture_output=True)
    if res.stdout:
        print(res.stdout.strip())
    if res.stderr and res.returncode != 0:
        print(f"Lỗi: {res.stderr.strip()}", file=sys.stderr)
        if check:
            sys.exit(res.returncode)
    return res

def main():
    print("=" * 60)
    print("   SCRIPT ĐẨY DỰ ÁN IN HỢP ĐỒNG A4 LÊN GITHUB (PYTHON)   ")
    print("=" * 60)
    
    if len(sys.argv) > 1:
        repo_url = sys.argv[1].strip()
    else:
        print("Mẹo: Tạo repository mới tại https://github.com/new")
        repo_url = input(">> Nhập link GitHub repo của bạn: ").strip()

    if not repo_url:
        print("Lỗi: Bạn chưa nhập URL repository.")
        sys.exit(1)

    print("\n[1] Khởi tạo git...")
    if not os.path.exists(os.path.join(PROJECT_DIR, ".git")):
        run_cmd("git init")

    print("[2] Thêm các file...")
    run_cmd("git add .")

    print("[3] Commit thay đổi...")
    run_cmd('git commit -m "Cập nhật ứng dụng nhập liệu & in ấn hợp đồng A4 tone xanh pastel"', check=False)
    run_cmd("git branch -M main")

    print("[4] Cấu hình remote và đẩy lên GitHub...")
    run_cmd("git remote remove origin", check=False)
    run_cmd(f'git remote add origin "{repo_url}"')
    run_cmd("git push -u origin main --force")

    print("\n" + "=" * 60)
    print("   THÀNH CÔNG! ĐÃ ĐẨY MÃ NGUỒN LÊN GITHUB!               ")
    print("=" * 60)
    print(f"Repository: {repo_url}")
    print("Bật GitHub Pages tại: Settings -> Pages -> Source 'Deploy from a branch' -> Branch 'main' -> Save")

if __name__ == "__main__":
    main()
