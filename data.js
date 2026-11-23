"use strict";
window.RESULTS = {
  "main": {
    "label": "Framework",
    "note": "Each entry is one campaign from a comparable chapter start. Progress is weighted by reference human play time.",
    "rows": [
      [
        "Cradle",
        18.3,
        16,
        12.1,
        15.3
      ],
      [
        "GV w/o VR",
        24.7,
        20.3,
        17.5,
        21.6
      ],
      [
        "GV-Expert",
        27.9,
        23.8,
        20.4,
        25.2
      ],
      [
        "GamePilot",
        51.6,
        45.3,
        40.8,
        47.2
      ]
    ],
    "best": 3
  },
  "scope": {
    "label": "Editable scope",
    "note": "All variants share the seed harness. Full optimization exceeds knowledge-only optimization by 10.6\u201311.4 percentage points across the four games.",
    "rows": [
      [
        "Fixed seed harness",
        29.1,
        24.5,
        21.2,
        26
      ],
      [
        "Knowledge-only optimization",
        40.2,
        34.7,
        29.8,
        36.1
      ],
      [
        "Full optimization",
        51.6,
        45.3,
        40.8,
        47.2
      ]
    ],
    "best": 2
  },
  "ablation": {
    "label": "Variant",
    "note": "Each variant shares the backbone, seed harness, starting save, and one-hour budget. Full GamePilot scores above all five component ablations in every game.",
    "rows": [
      [
        "GamePilot (full)",
        51.6,
        45.3,
        40.8,
        47.2
      ],
      [
        "Frozen observation processing",
        43.5,
        36.8,
        32.4,
        37.6
      ],
      [
        "Without fast subagent",
        46.8,
        34.8,
        31.5,
        42.3
      ],
      [
        "Without localization guidance",
        42.7,
        35.7,
        37.2,
        41.9
      ],
      [
        "Base-bank-only admission",
        44,
        40.8,
        35.5,
        39.8
      ],
      [
        "Without advantage credit",
        47,
        41.2,
        36.4,
        43.5
      ]
    ],
    "best": 0
  }
};
