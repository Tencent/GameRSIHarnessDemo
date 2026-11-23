"use strict";
window.GAMEPILOT_REVISION = {
  "candidate": "candidate-000001",
  "stages": [
    {
      "label": "Diagnose",
      "title": "Two readouts. One binding error.",
      "body": "The diagnosis traces repeated backtracking to a mismatch between the active quest marker and a separate minimap-edge distance.",
      "bullets": [
        "Step 13: a local 62 m diamond appears alongside a 544 m edge readout.",
        "Steps 23–24: the edge number rises from 505 to 518 m while the diamond moves closer in map pixels.",
        "The actor reverses direction after interpreting the other readout as quest progress."
      ],
      "sequence": 21,
      "event": "external_diagnosis",
      "time": "2026-09-21T20:58:48.744334+00:00",
      "elapsed_seconds": 1400,
      "elapsed": "23:20"
    },
    {
      "label": "Revise",
      "title": "Attach the measurement to the diamond.",
      "body": "Candidate 000001 adds conditional gold-diamond localization and player-relative geometry to the observation harness.",
      "bullets": [
        "Locate the gold diamond and outline it in the existing minimap detail.",
        "Compare its displacement with accepted background motion; abstain when detections are ambiguous.",
        "Provide target-specific feedback to the planner while preserving the existing action interface."
      ],
      "sequence": 28,
      "event": "proposal_returned",
      "time": "2026-09-21T21:12:38.150221+00:00",
      "elapsed_seconds": 2229,
      "elapsed": "37:09"
    },
    {
      "label": "Admit",
      "title": "Evaluate the candidate before selection.",
      "body": "After source review, three offline action questions receive rubric scores. Their mean is 0.875, and the candidate is admitted.",
      "bullets": [
        "Question q-000: 1.000 / 1.000.",
        "Question q-001: 1.000 / 1.000.",
        "Question q-002: 0.625 / 1.000."
      ],
      "sequence": 44,
      "event": "admission",
      "time": "2026-09-21T21:16:19.557058+00:00",
      "elapsed_seconds": 2451,
      "elapsed": "40:51"
    },
    {
      "label": "Execute",
      "title": "Switch harnesses at the next boundary.",
      "body": "The admitted candidate becomes available at the boundary after window 4. It is selected for windows 5 and 6.",
      "bullets": [
        "Windows 1–4 run with the seed harness.",
        "Window 5 selects candidate 000001 after admission.",
        "Window 6 selects the same candidate again."
      ],
      "sequence": 50,
      "event": "selected",
      "time": "2026-09-21T21:17:06.664016+00:00",
      "elapsed_seconds": 2498,
      "elapsed": "41:38"
    }
  ],
  "scores": [
    {
      "question": "q-000",
      "score": 1.0
    },
    {
      "question": "q-001",
      "score": 1.0
    },
    {
      "question": "q-002",
      "score": 0.625
    }
  ],
  "mean": 0.875,
  "windows": [
    {
      "window": 1,
      "harness": "seed",
      "sequence": 1
    },
    {
      "window": 2,
      "harness": "seed",
      "sequence": 7
    },
    {
      "window": 3,
      "harness": "seed",
      "sequence": 18
    },
    {
      "window": 4,
      "harness": "seed",
      "sequence": 26
    },
    {
      "window": 5,
      "harness": "candidate-000001",
      "sequence": 50
    },
    {
      "window": 6,
      "harness": "candidate-000001",
      "sequence": 69
    }
  ]
};
