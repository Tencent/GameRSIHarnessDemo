"use strict";
window.GAMEPILOT_DEMOS = [
  {
    "id": "observation",
    "label": "Scene & minimap",
    "title": "Connect the scene to a direction cue.",
    "task": "Continue the visible trial objective using the game scene and its minimap.",
    "scope": "Scene and detail from one recorded decision · step 18",
    "views": [
      {
        "title": "Read the scene",
        "image": "assets/images/demos/scene-detail.webp",
        "caption": "Scene crop from the current observation.",
        "tag": "Observation",
        "summary": "The game scene supplies the local visual context for the next action.",
        "step": "18",
        "decision": [
          "Rotate camera left ~120 degrees and sprint toward the objective.",
          "Reach the trial arena and engage the trial enemy."
        ],
        "action": "-300 0 ~100ms;-200 0 ~100ms;0 0 W Shift ~3000ms",
        "delegation": null,
        "cue": "Minimap vision cone faces northwest (~310°) while trial objective diamond is at south (~190°), roughly 120° to the left."
      },
      {
        "title": "Inspect the minimap",
        "image": "assets/images/demos/minimap-detail.webp",
        "caption": "Enlarged minimap from the same observation.",
        "tag": "Detail",
        "summary": "The same-frame minimap supplies direction cues. The corresponding decision turns the camera left, then moves forward while sprinting.",
        "step": "18",
        "decision": [
          "Rotate camera left ~120 degrees and sprint toward the objective.",
          "Reach the trial arena and engage the trial enemy."
        ],
        "action": "-300 0 ~100ms;-200 0 ~100ms;0 0 W Shift ~3000ms",
        "delegation": null,
        "cue": "Minimap vision cone faces northwest (~310°) while trial objective diamond is at south (~190°), roughly 120° to the left."
      }
    ]
  },
  {
    "id": "comparison",
    "label": "Camera comparison",
    "title": "Compare what changed after a camera turn.",
    "task": "Orient the view toward the navigation objective.",
    "scope": "One recorded comparison and its action · step 51",
    "views": [
      {
        "title": "Compare the views",
        "image": "assets/images/demos/camera-comparison.webp",
        "caption": "Preceding view on the left; current view on the right.",
        "tag": "Observation",
        "summary": "The attachment pairs preceding and current observations. The decision compares the changes and requests a further rightward camera turn.",
        "step": "51",
        "decision": [
          "WORLD_FRAMING: sweep right to align forward view with quest marker",
          "BASIS_MEASUREMENT: test forward movement along visible path"
        ],
        "action": "300 0 ~100ms;300 0 ~100ms;300 0 ~100ms",
        "delegation": null,
        "cue": "木篱危机: 前往幽径城, SAME_TASK. Comparing panel 1 & 2: trees shifted left again, view fan turned further toward S/SE (~160 deg). Minimap diamond is at ~135 deg (SE, 305米). One more sweep right will center the view toward the quest objective."
      }
    ]
  },
  {
    "id": "combat",
    "label": "Combat delegation",
    "title": "Hand off a local encounter objective.",
    "task": "Respond to the nearby hostile creature while pursuing the navigation objective.",
    "scope": "Selected observations from one run · steps 39 and 43",
    "views": [
      {
        "title": "Delegate the encounter",
        "image": "assets/images/demos/combat-delegation.webp",
        "caption": "Scene crop at the encounter delegation · step 39.",
        "tag": "Delegation",
        "summary": "The planner issues an encounter objective to relieve the immediate combat pressure.",
        "step": "39",
        "decision": [
          "Delegate: Defeat or neutralize attacking Lv.6 满月蝠 and relieve combat pressure."
        ],
        "action": "",
        "delegation": {
          "goal": "Defeat or neutralize attacking Lv.6 满月蝠 and relieve combat pressure.",
          "context": "Hostile Lv.6 满月蝠 is actively attacking avatar mid-screen. Local threat defense to relieve pressure.",
          "type": "encounter"
        },
        "cue": "Hostile Lv.6 满月蝠 is actively attacking avatar mid-screen. Local threat defense to relieve pressure."
      },
      {
        "title": "Inspect later actions",
        "image": "assets/images/demos/combat-actions.webp",
        "caption": "Later combat observation · step 43; intervening steps omitted.",
        "tag": "Action",
        "summary": "A later record contains repeated basic attacks and a Q skill action.",
        "step": "43",
        "decision": [],
        "action": "0 0 LB;0 0 LB;0 0 Q;0 0 LB;0 0 LB;0 0 LB",
        "delegation": null,
        "cue": ""
      }
    ]
  },
  {
    "id": "geometry",
    "label": "Direction geometry",
    "title": "Inspect a marked direction cue.",
    "task": "Reorient the camera while navigating near a rock wall.",
    "scope": "One recorded annotation and its action · step 53",
    "views": [
      {
        "title": "Inspect the annotation",
        "image": "assets/images/demos/geometry-detail.webp",
        "caption": "Cropped minimap attachment with its original annotations.",
        "tag": "Observation",
        "summary": "The recorded attachment marks direction cues around the player indicator. The accompanying decision requests a leftward camera adjustment.",
        "step": "53",
        "decision": [
          "Pan camera left to reorient toward open terrain",
          "Walk along open trail toward diamond marker"
        ],
        "action": "-250 0 ~100ms",
        "delegation": null,
        "cue": "木篱危机 SAME_TASK. Pos: X=592156.9, Y=-375687.6, Z=7695.2. Avatar is facing rock wall. Diamond candidate bearing is -99.6 deg relative to camera fan. Need to pan camera left toward open path."
      }
    ]
  }
];
