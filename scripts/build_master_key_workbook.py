#!/usr/bin/env python3
"""Turns the master key plan payload into the workbook a buyer actually fills in.

Node owns the catalogue; Python owns the file format, because openpyxl is already a
dependency here (scripts/build_spanish_workbook.py) and a hand-rolled xlsx writer is a
liability nobody asked for. Same split as the Spanish review sheet.

THREE SHEETS, AND THE THIRD IS THE POINT
----------------------------------------
1. Door schedule   — the grid, with dropdowns on the columns that have catalogue answers
2. Free format     — the same thing with no structure, for a buyer whose own schedule
                     does not fit our columns. Asking somebody to retype a working
                     spreadsheet into our shape is how a form stops coming back.
3. Worked example  — already filled in. MIWA ship this and most suppliers do not; a blank
                     grid asks the buyer to invent a format, a filled one asks them to
                     copy a pattern. See docs/research/2026-09-13-miwa-lock-structure.md.

Usage:  py scripts/build_master_key_workbook.py <payload.json> [out.xlsx]
"""

import json
import sys
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

INK = "1A1A1A"
MUTED = "6B6B6B"
RULE = "D8D8D8"
HEADER_FILL = "F2F0ED"
EXAMPLE_FILL = "FAF8F5"

thin = Side(style="thin", color=RULE)
box = Border(left=thin, right=thin, top=thin, bottom=thin)


def style_header(cell):
    cell.font = Font(bold=True, color=INK, size=10)
    cell.fill = PatternFill("solid", fgColor=HEADER_FILL)
    cell.alignment = Alignment(vertical="center", wrap_text=True)
    cell.border = box


def write_intro(ws, payload, row=1):
    """Title, then the instructions, then the system-level questions."""
    ws.cell(row=row, column=1, value=payload["meta"]["title"]).font = Font(bold=True, size=14, color=INK)
    row += 1
    ws.cell(
        row=row,
        column=1,
        value="Canton Hyland Hardware (Group) Co., Ltd.  ·  cantonlock.com"
        + payload["meta"]["article"],
    ).font = Font(size=9, color=MUTED)
    row += 2

    for line in payload["intro"]:
        cell = ws.cell(row=row, column=1, value=line)
        cell.font = Font(size=10, color=INK)
        cell.alignment = Alignment(wrap_text=True, vertical="top")
        ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=10)
        ws.row_dimensions[row].height = 28
        row += 1

    row += 1
    ws.cell(row=row, column=1, value="About the system as a whole").font = Font(bold=True, size=11, color=INK)
    row += 1

    # These four decide the chart before any door is listed, so they are asked first.
    for label, hint in [
        ("Project / building", "Name we should put on the keying chart"),
        ("Levels you think you need", "Most buildings need three. Say if you are unsure — we will read the schedule and advise"),
        ("Keyway", "Every cylinder in one system shares it, and it cannot be changed later"),
        ("Spare keys per level", "Including the ones the building owner keeps in a drawer"),
        ("Contact for the chart", "Who approves it before any cylinder is pinned"),
    ]:
        ws.cell(row=row, column=1, value=label).font = Font(bold=True, size=10, color=INK)
        answer = ws.cell(row=row, column=3, value="")
        answer.border = box
        ws.merge_cells(start_row=row, start_column=3, end_row=row, end_column=6)
        ws.cell(row=row, column=7, value=hint).font = Font(size=9, color=MUTED)
        row += 1

    return row + 1


def door_grid(ws, payload, rows, dropdowns=True, fill=None, blank_rows=0):
    """The per-door table. `rows` may be example data or empty."""
    columns = payload["columns"]
    header_row = ws.max_row + 1

    for index, column in enumerate(columns, start=1):
        style_header(ws.cell(row=header_row, column=index, value=column["label"]))
        ws.column_dimensions[get_column_letter(index)].width = column["width"]

    help_row = header_row + 1
    for index, column in enumerate(columns, start=1):
        cell = ws.cell(row=help_row, column=index, value=column.get("help", ""))
        cell.font = Font(size=8, color=MUTED)
        cell.alignment = Alignment(wrap_text=True, vertical="top")
        cell.border = box
    ws.row_dimensions[help_row].height = 30

    first = help_row + 1
    for offset, record in enumerate(rows):
        for index, column in enumerate(columns, start=1):
            cell = ws.cell(row=first + offset, column=index, value=record.get(column["key"], ""))
            cell.border = box
            cell.font = Font(size=10, color=INK)
            cell.alignment = Alignment(wrap_text=True, vertical="top")
            if fill:
                cell.fill = PatternFill("solid", fgColor=fill)

    last = first + len(rows) + blank_rows - 1
    for r in range(first + len(rows), last + 1):
        for index in range(1, len(columns) + 1):
            ws.cell(row=r, column=index).border = box

    if dropdowns:
        for index, column in enumerate(columns, start=1):
            name = column.get("dropdown")
            if not name:
                continue
            values = payload["dropdowns"][name]
            # Excel caps an inline list at 255 characters; longer lists go on a hidden
            # sheet and are referenced, which is why `models` lives in the lookup tab.
            joined = ",".join(values)
            if len(joined) < 250:
                validation = DataValidation(type="list", formula1=f'"{joined}"', allow_blank=True)
            else:
                column_letter = get_column_letter(list(payload["dropdowns"]).index(name) + 1)
                validation = DataValidation(
                    type="list",
                    formula1=f"Lists!${column_letter}$2:${column_letter}${len(values) + 1}",
                    allow_blank=True,
                )
            validation.error = "Pick from the list, or clear the cell and type your own."
            validation.errorTitle = "Not in the catalogue list"
            validation.showErrorMessage = False  # advisory, never blocking
            ws.add_data_validation(validation)
            validation.add(f"{get_column_letter(index)}{first}:{get_column_letter(index)}{last}")

    return last


def build(payload: dict, out: Path) -> None:
    wb = Workbook()

    # ---------------------------------------------------------------- 1. door schedule
    ws = wb.active
    ws.title = "Door schedule"
    ws.sheet_view.showGridLines = False
    write_intro(ws, payload)
    door_grid(ws, payload, rows=[], blank_rows=40)
    ws.freeze_panes = ws.cell(row=ws.max_row - 40 + 1, column=1)

    # ------------------------------------------------------------------ 2. free format
    free = wb.create_sheet("Free format")
    free.sheet_view.showGridLines = False
    free.cell(row=1, column=1, value="Your own schedule, in your own columns").font = Font(bold=True, size=12, color=INK)
    note = free.cell(
        row=2,
        column=1,
        value=(
            "If you already keep a door schedule, paste it here rather than retyping it into ours. "
            "We need three things somewhere in it: a line per door, which group each door belongs to, "
            "and who has to be able to open it. Everything else we can ask about."
        ),
    )
    note.font = Font(size=10, color=INK)
    note.alignment = Alignment(wrap_text=True, vertical="top")
    free.merge_cells(start_row=2, start_column=1, end_row=2, end_column=10)
    free.row_dimensions[2].height = 34
    for index in range(1, 11):
        free.column_dimensions[get_column_letter(index)].width = 22

    # --------------------------------------------------------------- 3. worked example
    example = wb.create_sheet("Worked example")
    example.sheet_view.showGridLines = False
    example.cell(row=1, column=1, value="Worked example — copy this pattern").font = Font(bold=True, size=12, color=INK)
    example.cell(
        row=2,
        column=1,
        value="A small three-level building. Three levels is what most buildings need; showing five here would quietly recommend five.",
    ).font = Font(size=9, color=MUTED)
    example.merge_cells(start_row=2, start_column=1, end_row=2, end_column=10)

    row = 4
    for label, value in payload["example"]["system"].items():
        example.cell(row=row, column=1, value=label).font = Font(bold=True, size=10, color=INK)
        example.cell(row=row, column=3, value=value).font = Font(size=10, color=INK)
        example.merge_cells(start_row=row, start_column=3, end_row=row, end_column=8)
        row += 1

    example.cell(row=row + 1, column=1, value="")
    door_grid(example, payload, rows=payload["example"]["rows"], dropdowns=False, fill=EXAMPLE_FILL)

    tail = example.max_row + 2
    example.cell(
        row=tail,
        column=1,
        value=(
            "Two rows above are the ones buyers most often get wrong. G-04 is opened by the grand master ONLY — "
            "say so explicitly, because a door left blank gets the floor master by default. 2-07 counts the "
            "contractor's keys in the key column; keys nobody counted are the usual reason a chart has to be redrawn."
        ),
    ).font = Font(size=9, color=MUTED)
    example.merge_cells(start_row=tail, start_column=1, end_row=tail, end_column=10)
    example.row_dimensions[tail].height = 34

    # ------------------------------------------------------- 4. lookup lists (hidden)
    lists = wb.create_sheet("Lists")
    for index, (name, values) in enumerate(payload["dropdowns"].items(), start=1):
        lists.cell(row=1, column=index, value=name).font = Font(bold=True, size=10)
        for offset, value in enumerate(values, start=2):
            lists.cell(row=offset, column=index, value=value)
        lists.column_dimensions[get_column_letter(index)].width = 26
    lists.sheet_state = "hidden"

    out.parent.mkdir(parents=True, exist_ok=True)
    wb.save(out)


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    payload_path = Path(sys.argv[1])
    payload = json.loads(payload_path.read_text(encoding="utf-8"))
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("public/downloads/master-key-plan-sheet.xlsx")
    build(payload, out)
    print(f"workbook -> {out}")
    print(f"  door schedule : blank grid, {len(payload['columns'])} columns")
    print(f"  worked example: {len(payload['example']['rows'])} rows")
    print(f"  dropdowns     : " + ", ".join(f"{k} ({len(v)})" for k, v in payload["dropdowns"].items()))


if __name__ == "__main__":
    main()
