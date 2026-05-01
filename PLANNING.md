# Tableau Virtual Laboratory - Transition & Implementation Plan

## Overview
This document outlines the plan to build the Tableau Virtual Laboratory by leveraging the existing architecture of the Data Processing and Visualization (DPV) Virtual Lab. 

## What to Incorporate from the Current DPV Lab

1. **Core Directory Structure & Routing:**
   - The central `index.html` hub mapping out all Units/Parts.
   - The `labs/` subdirectory pattern for individual experiment pages.
   - Global stylesheet and UI components (menus, sidebars, progress indicators).

2. **Lab UI Layout (from `labs/labX.html`):**
   - The split-pane or guided step-by-step UI for instructions vs. workspace.
   - Instead of a code editor, the workspace pane will be replaced with a **File Upload Zone** (drag-and-drop) and a **Results/Feedback Dashboard**.

3. **Evaluation Framework Shell (`tutor.js`):**
   - We will retain the modular evaluation structure (grading rubric hooks, success/failure UI toasts, mark accumulation logic).
   - **Crucial Change:** We will completely swap the internal validation engine. Instead of executing code or regex-matching scripts, `tutor.js` will utilize the browser's `DOMParser` to parse the XML of uploaded `.twb` files using XPath/query selectors.

4. **Security & Integrity:**
   - Any existing local storage tracking for completed labs and score persistence can be reused.

## Technical Implementation Strategy

### 1. File Handling & Parsing
- **`.twb` Support:** Simple FileReader text read, followed by `new DOMParser().parseFromString(xmlText, "text/xml")`.
- **`.twbx` Support:** A `.twbx` is just a ZIP archive. We will need to incorporate a client-side unzip library (like `JSZip`) to extract the nested `.twb` file for parsing, and ignore the `Data/` folder.

### 2. Evaluator Engine Updates (The "XML Checker")
We will need to write specific helper functions in the new `tutor.js` to perform XPath lookups for Tableau components:
- `checkDatasource(xml, sourceName)` -> Looks for `<datasource>`
- `checkWorksheet(xml, sheetName)` -> Looks for `<worksheet name="X">`
- `checkMarkType(xml, sheetName, markClass)` -> Looks for `<mark class="X">` inside a worksheet
- `checkCalculatedField(xml, formulaSubstrings)` -> Parses `<calculation formula="...">`

### 3. Adjusting the Lab Modules
We will consolidate the DPV labs into the 15 requested Tableau experiments.
- **Part 0 (Orientation):** Built into Lab 1's UI with a specific initial walkthrough.
- **Parts 1-5:** 14 Standard evaluation labs.
- **Capstone:** A final project submission page handling larger `.twbx` files and evaluating across 8 specific criteria (dashboards, parameters, forecasting, trend lines, maps, LODs, URL submission, and storytelling).

### 4. Next Steps for Implementation
1. **Scaffold the New Hub:** Duplicate and strip down `index.html` to map the new 15 experiments.
2. **Setup JSZip:** Import `JSZip` via CDN in the base template for `.twbx` evaluation.
3. **Draft the XML Parser Engine:** Build a prototype in `tutor.js` that successfully reads a mock `.twb` file and evaluates the 4 criteria from Experiment 1.
4. **Iterate Lab Pages:** Build `lab1.html` as the pilot, testing the upload and automated XML feedback loop.

*No implementation has been executed yet as per user instruction. This folder is reserved for the new project.*
