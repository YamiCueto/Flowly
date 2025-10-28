# CHANGELOG

All notable changes to this project will be documented in this file.

Format: Keep a short note per entry with date and summary.

## [Unreleased] - 2025-10-28

- feat(connectors): Add `ConnectorsManager` to manage connectors between shapes (create, update, serialize/deserialize).
- feat(anchors): Add anchor points to shapes (8 anchors per shape); anchors visible on hover and used as connection targets.
- feat(ux): Implement drag-to-connect UX — click an anchor, drag a provisional line, highlight valid targets, and finalize connection on drop.
- feat(persistence): Persist connectors in project JSON (start/end shape IDs and connector options) and restore them on load.
- feat(properties): Add connector properties panel (type: arrow/line/bezier, color, width, dashed, arrowhead, curvature) and wire to live updates.
- fix(test): Provide `createTestConnector()` helper for quick manual testing of connectors.
- chore(index): Modularized HTML partials and refactored initialization to wait for partials.
- style: Move inline styles into `css/main.css` and add accessibility labels for form controls.
 - fix(connectors): Finalize Bezier control-point handles and persist controlPoints so curves survive save/load (commit 0dc78ab).
 - fix(connectors): Add connector visual nodes directly to `mainLayer` to avoid them becoming selectable/draggable shapes and ensure proper restore behavior on load (commit 4c21eee).

## Previous

- Initial MVP: basic shapes, canvas, grid, export and storage foundations.

---

Notes:
- Next planned work: implement draggable control-points for Bezier connectors (for precise curve editing) and enhance persistence to record exact anchor indices used by connectors.
