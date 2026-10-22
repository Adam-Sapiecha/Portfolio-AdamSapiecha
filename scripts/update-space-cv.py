"""Add the space-sector focus while preserving the original one-page CV.

The baseline is an immutable Git version, so rerunning does not duplicate text.
Run from the repository root with reportlab and pypdf installed.
"""
from io import BytesIO
from pathlib import Path
import shutil
import subprocess

from pypdf import PdfReader, PdfWriter
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas

ROOT = Path(__file__).resolve().parents[1]
BASELINE = "d1ab3bb:assets/AdamSapiechaCV.pdf"
TEAM_URL = "https://www.spaceappschallenge.org/2026/find-a-team/sts-31/"
FONT_DIR = Path("C:/Windows/Fonts")


def main():
    original = subprocess.check_output(["git", "show", BASELINE], cwd=ROOT)
    reader = PdfReader(BytesIO(original))
    assert len(reader.pages) == 1
    page = reader.pages[0]
    width, height = map(float, page.mediabox[2:])
    pdfmetrics.registerFont(TTFont("CVArial", str(FONT_DIR / "arial.ttf")))
    pdfmetrics.registerFont(TTFont("CVArialBold", str(FONT_DIR / "arialbd.ttf")))
    overlay = BytesIO()
    canvas = Canvas(overlay, pagesize=(width, height))

    def line(x, top, text, size=8.1, bold=False, color="#151515", limit=163):
        font = "CVArialBold" if bold else "CVArial"
        assert pdfmetrics.stringWidth(text, font, size) <= limit, text
        canvas.setFont(font, size)
        canvas.setFillColor(HexColor(color))
        canvas.drawString(x, height - top - size, text)

    # Unused space below the original profession heading; explicitly an interest.
    line(224.3, 89.5,
         "Interests: satellite simulation, imaging and software validation.",
         size=8.1, color="#65563f", limit=352)

    # The original sidebar ends at y=631; preserve every existing section.
    line(19, 660, "Space sector", size=10.8, bold=True)
    line(19, 680, "NASA Space Apps Challenge 2026", bold=True)
    line(19, 694, "Team STS-31 | Upcoming")
    line(19, 708, "Planned start: 14 November 2026")
    for top, text in [
        (730, "Planned participation in the global"),
        (741, "hackathon using NASA and partner"),
        (752, "open data."),
    ]:
        line(19, top, text)
    line(19, 774, "Team page: STS-31", color="#65563f")
    canvas.linkURL(TEAM_URL, (19, height - 784, 101, height - 773), relative=0)
    canvas.save()
    overlay.seek(0)
    page.merge_page(PdfReader(overlay).pages[0])
    writer = PdfWriter()
    writer.add_page(page)
    writer.add_metadata({
        "/Title": "Adam Sapiecha - Software Engineer",
        "/Author": "Adam Sapiecha",
        "/Subject": "Space-sector interests and planned NASA Space Apps Challenge 2026 participation",
    })
    output = ROOT / "output/pdf/AdamSapiechaCV.pdf"
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("wb") as stream:
        writer.write(stream)
    check = PdfReader(output)
    text = check.pages[0].extract_text()
    for expected in ["STS-31", "Upcoming", "14 November 2026", "Samsung", "Fundacja Sorno", "Tikrow"]:
        assert expected in text, expected
    assert len(check.pages) == 1
    shutil.copy2(output, ROOT / "assets/AdamSapiechaCV.pdf")
    print(f"Updated one-page CV: {output}")


if __name__ == "__main__":
    main()
