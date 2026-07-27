#!/usr/bin/env python3

import sys
import re
import json
from datetime import datetime
from pathlib import Path

def extract_text_from_txt(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()

def extract_text_from_pdf(file_path: str) -> str:
    import pdfplumber
    text = []
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            text.append(page_text)
    return "\n".join(text)

def extract_text_from_image(file_path: str) -> str:
    from PIL import Image
    import pytesseract
    img = Image.open(file_path)
    return pytesseract.image_to_string(img)

def extract_fields(text: str) -> dict:
    vendor_patterns = [
        r'(?im)^\s*vendor\s*:\s*(.+)$',
        r'(?im)^\s*from\s*:\s*(.+)$',
        r'(?im)^\s*supplier\s*:\s*(.+)$',
    ]
    amount_patterns = [
        r'(?im)^\s*amount\s*:\s*\$?\s*([0-9][0-9,]*\.?[0-9]*)$',
        r'(?im)^\s*total\s*(?:due)?\s*:\s*\$?\s*([0-9][0-9,]*\.?[0-9]*)$',
        r'(?im)^\s*subtotal\s*:\s*\$?\s*([0-9][0-9,]*\.?[0-9]*)$',
    ]
    date_patterns = [
        r'(?im)^\s*date\s*:\s*(.+)$',
        r'(?im)^\s*invoice\s*date\s*:\s*(.+)$',
    ]
    description_patterns = [
        r'(?im)^\s*description\s*:\s*(.+)$',
        r'(?im)^\s*items?\s*:\s*(.+)$',
    ]

    def first_match(patterns, default="Unknown"):
        for p in patterns:
            m = re.search(p, text)
            if m:
                return m.group(1).strip()
        return default

    vendor_name = first_match(vendor_patterns, "Unknown")
    amount_raw = first_match(amount_patterns, "0")
    amount = float(amount_raw.replace(",", "").replace("$", "").strip()) if amount_raw else 0.0
    date = first_match(date_patterns, datetime.now().strftime("%Y-%m-%d"))
    description = first_match(description_patterns, "No description provided")

    return {
        "vendor_name": vendor_name,
        "amount": amount,
        "date": date,
        "description": description,
        "raw_text": text[:4000],
    }

def main():
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Usage: iris_processor.py <file_path>"}))
        sys.exit(1)

    file_path = sys.argv[1]
    suffix = Path(file_path).suffix.lower()

    try:
        if suffix == ".txt":
            text = extract_text_from_txt(file_path)
        elif suffix == ".pdf":
            text = extract_text_from_pdf(file_path)
        elif suffix in [".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff"]:
            text = extract_text_from_image(file_path)
        else:
            print(json.dumps({"error": f"Unsupported file type: {suffix}"}))
            sys.exit(1)

        result = extract_fields(text)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
