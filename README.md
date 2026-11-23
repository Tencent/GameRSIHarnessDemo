# GamePilot

GamePilot is an interactive research showcase for a game agent that learns how to observe and act from its own play. It presents the method, recorded gameplay examples, benchmark tasks, and experimental results.

Built with HTML, CSS, and JavaScript, the project runs on a static HTTP server with locally stored images and videos. This repository contains the presentation website and its interaction logic.

## Research Overview

GamePilot places a fixed-weight vision-language model inside an editable harness. A planner coordinates overall game progress and delegates local objectives to subagents with shorter contexts. The GamePilot Evolver uses execution records to identify failures, revise the harness, and evaluate candidates through offline replay tests. Feedback from subsequent gameplay informs version selection.

GamePilot Bench covers four games. Milestone tasks measure sustained gameplay progress, while Atomic and Basic tasks assess interaction skills and game knowledge.

## Features

- **Overview:** Introduces the research problem, approach, and main findings.
- **Method:** Presents the system architecture with an expandable method figure.
- **Demos:** Provides four observation-and-action examples with step navigation, automatic playback, and image inspection.
- **Harness Revision:** Walks through recorded cues, observation revisions, offline testing, and version adoption.
- **Benchmark:** Includes 39 task examples with filters for game, ability, and keywords, alongside gameplay recordings, start frames, and outcome frames.
- **Results:** Displays experimental results and comparisons.
- **Citation:** Provides a BibTeX entry with a one-click copy button.

The website also includes an animated video background, section navigation, keyboard controls, and responsive layouts.

## Getting Started

Requires Node.js 20 or later. No additional dependencies are needed.

```sh
npm start
```

Open <http://localhost:5173/>, or go directly to the demos at <http://localhost:5173/#demos>.

To use a different port:

```sh
PORT=8080 npm start
```

Access the website through its HTTP URL. Opening `index.html` directly from the filesystem may prevent interactive modules from loading because of browser restrictions on ES Modules. The local server supports HTTP Range requests for video seeking.

## Validation

```sh
npm run check
```

Checks JavaScript syntax and verifies that referenced local resources exist.

## Project Structure

| File or Directory | Purpose |
| --- | --- |
| `index.html` | Page structure and content sections |
| `styles.css` | Styling, animations, and responsive layouts |
| `app.js` | Navigation, image viewing, and shared interactions |
| `hero.js` | Hero background video playback |
| `page-layout.js` | Demo panel switching and anchor navigation |
| `walkthrough*` | Gameplay walkthrough data, state, and interactions |
| `revision*` | Harness revision data, state, and interactions |
| `benchmark*` | Benchmark task data, filtering state, and presentation |
| `data.js` | Experimental results data |
| `assets/` | Images, icons, and videos |
| `scripts/serve.mjs` | Local static HTTP server |
| `scripts/check.mjs` | JavaScript syntax and resource reference checks |

## Content Maintenance

Edit `index.html` to update page copy and structure, and `styles.css` to adjust the visual design. Example content is maintained in `walkthrough-data.js`, `revision-data.js`, and `benchmark-data.js`. Experimental results are maintained in `data.js`.

Place new images and videos in the appropriate `assets/` subdirectory and reference them using relative paths in the corresponding data files. After making changes, run `npm run check` and review the presentation and interactions in the local website.

## License

This project is licensed under the MIT License. See [LICENSE.txt](LICENSE.txt) for the full open source statement and license terms.
