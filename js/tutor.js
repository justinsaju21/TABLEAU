/* ============================================================
   Tableau VL Curriculum — Rule-Based Tutor
   No API. No backend. Reads localStorage for all context.
   Include via: <script src="../tutor.js"></script> (labs)
                <script src="tutor.js"></script>    (index)
   ============================================================ */
(function () {
  'use strict';

  // ─────────────────────────────────────────────
  // MOBILE GUARD — inject warning overlay on lab pages if screen < 768px
  // ─────────────────────────────────────────────
  (function mobileGuard() {
    const isLabPage = /lab\w+\.html|capstone\.html/i.test(window.location.pathname);
    if (!isLabPage) return;     // hub is fine on mobile
    if (window.innerWidth >= 768) return; // desktop / tablet — no warning needed

    // Derive lab name from KB lazily (KB not built yet, parse from title)
    const labTitle = document.title.split('—')[1]?.trim() || 'this Lab';

    const overlay = document.createElement('div');
    overlay.id = 'mobile-guard-overlay';
    overlay.innerHTML = `
      <style>
        #mobile-guard-overlay {
          position: fixed; inset: 0; z-index: 99999;
          background: #0d0f14;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 2rem; text-align: center;
          font-family: 'Inter', sans-serif;
          gap: 1.25rem;
        }
        #mobile-guard-overlay .mg-icon {
          font-size: 4rem; line-height: 1;
          animation: mg-float 3s ease-in-out infinite;
        }
        @keyframes mg-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        #mobile-guard-overlay .mg-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.3rem 0.85rem; border-radius: 99px;
          background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.35);
          font-size: 0.72rem; font-weight: 700; color: #f59e0b;
          letter-spacing: 0.05em; text-transform: uppercase;
        }
        #mobile-guard-overlay h2 {
          font-size: 1.4rem; font-weight: 800; color: #e8eaf0;
          letter-spacing: -0.02em; line-height: 1.25;
          max-width: 300px;
        }
        #mobile-guard-overlay p {
          font-size: 0.85rem; color: #8892a4; line-height: 1.6;
          max-width: 320px;
        }
        #mobile-guard-overlay p strong { color: #e8eaf0; }
        #mobile-guard-overlay .mg-divider {
          width: 48px; height: 2px;
          background: linear-gradient(90deg, #4f8ef7, #8b5cf6);
          border-radius: 99px;
        }
        #mobile-guard-overlay .mg-back {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.75rem 1.5rem; border-radius: 12px;
          background: linear-gradient(135deg, #4f8ef7, #8b5cf6);
          color: #fff; font-size: 0.88rem; font-weight: 700;
          text-decoration: none; border: none; cursor: pointer;
          transition: opacity 0.15s; margin-top: 0.5rem;
        }
        #mobile-guard-overlay .mg-back:hover { opacity: 0.85; }
        #mobile-guard-overlay .mg-dismiss {
          font-size: 0.72rem; color: #55607a;
          background: none; border: none; cursor: pointer;
          text-decoration: underline; font-family: inherit;
        }
      </style>
      <div class="mg-icon">🖥️</div>
      <div class="mg-badge">⚠ Desktop Required</div>
      <h2>This lab works best on a larger screen</h2>
      <div class="mg-divider"></div>
      <p>
        <strong>${labTitle}</strong> uses interactive charts, drag-and-drop grids, and data controls
        that need a screen wider than <strong>768px</strong> to function properly.
      </p>
      <p>Open this on a <strong>laptop or desktop</strong> for the full experience.</p>
      <a class="mg-back" href="../index.html">← Back to Curriculum Hub</a>
      <button class="mg-dismiss" onclick="document.getElementById('mobile-guard-overlay').style.display='none'">
        Continue anyway (layout may break)
      </button>
    `;

    // Inject after body is available
    const inject = () => document.body.appendChild(overlay);
    if (document.body) inject();
    else document.addEventListener('DOMContentLoaded', inject);
  })();

  // ─────────────────────────────────────────────
  // ANTI-PASTE GUARDS — prevent copy-pasting into reflections
  // ─────────────────────────────────────────────
  (function initAntiPaste() {
    const isLabPage = /lab\w+\.html|capstone\.html/i.test(window.location.pathname);
    if (!isLabPage) return;

    const handlePasteAttempt = (e) => {
      const target = e.target;
      if (target.tagName === 'TEXTAREA' || target.id === 'reflection-text') {
        e.preventDefault();

        // Try to show lab-specific toast if available, otherwise fallback to alert
        const toastEl = document.getElementById('toast');
        if (toastEl) {
          toastEl.textContent = '⚠️ Academic Integrity: Please type your reflection manually.';
          toastEl.classList.add('show');
          setTimeout(() => toastEl.classList.remove('show'), 3000);
        } else {
          alert('Academic Integrity: Please type your reflection manually. Pasting is disabled.');
        }
      }
    };

    // Block Ctrl+V / Right-click Paste
    document.addEventListener('paste', handlePasteAttempt, true);
    // Block Drag and Drop
    document.addEventListener('drop', handlePasteAttempt, true);
    // Block Right-click context menu on textareas (prevents "Paste" option from appearing)
    document.addEventListener('contextmenu', (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.id === 'reflection-text') {
        e.preventDefault();
      }
    }, true);
  })();

  // ─────────────────────────────────────────────
  // KNOWLEDGE BASE — one entry per lab
  // ─────────────────────────────────────────────
  const KB = {
    '0': {
      title: 'Part 0: Orientation & Setup', unit: '0',
      objective: 'Install Tableau Public and VS Code, explore the Superstore dataset, and understand how the XML evaluator works.',
      completeKey: 'tvl_complete_0', rubricKey: 'tvl_rubric_0', reflectKey: 'tvl_reflect_0', nextLab: '1',
      hints: [
        'If you haven\'t already, download Tableau Public from the official website. It\'s free.',
        'Tableau workbooks are saved as .twb (XML) or .twbx (Zipped XML + Data). The evaluator reads the .twb XML.',
        'Open a .twb file in VS Code. It looks like HTML! You can see your data source and worksheets defined in tags.'
      ],
      challengeHint: 'Try to find the <worksheet> tag in your .twb file using VS Code.',
      concepts: {
        'twb': 'A .twb file is a Tableau Workbook. It is actually just an XML file containing instructions on how to connect to data and render visualizations.',
        'twbx': 'A .twbx file is a Packaged Workbook. It is a ZIP file that contains the .twb XML file along with the actual data (like an Excel or CSV file) embedded inside.'
      }
    },
    '1': {
      title: 'Connecting and Preparing Data', unit: '1',
      objective: 'Connect to Superstore, rename fields, change datatypes, and inspect XML structure in VS Code.',
      completeKey: 'tvl_complete_1', rubricKey: 'tvl_rubric_1', reflectKey: 'tvl_reflect_1', nextLab: '2',
      hints: [
        'To connect to data, drag and drop the Superstore Excel file into the Tableau start screen.',
        'Right-click any field header in the Data Source pane to rename it.',
        'Click the data type icon (like Abc or #) next to a field name to change its data type.',
        'To create a calculated field like DATEDIFF, right-click the data pane and select "Create Calculated Field".'
      ],
      challengeHint: 'Use DATEDIFF(\'day\', [Order Date], [Ship Date]) to find out how many days it took to ship each order.',
      concepts: {
        'datasource': 'A datasource in Tableau is the link to your raw data. Changing metadata here (like renaming fields) doesn\'t change the original Excel file.',
        'datatype': 'Tableau assigns data types (String, Number, Date, Boolean, Geographic). Incorrect data types will prevent proper aggregations.',
        'datediff': 'DATEDIFF is a function that calculates the difference between two dates. Syntax: DATEDIFF(date_part, date1, date2)'
      }
    },
    '2': {
      title: 'Basic Visualization and Formatting', unit: '1',
      objective: 'Create Bar, Line, and Scatter charts with proper labels and formatting.',
      completeKey: 'tvl_complete_2', rubricKey: 'tvl_rubric_2', reflectKey: 'tvl_reflect_2', nextLab: '3',
      hints: [
        'For a Bar Chart, drag a Dimension (like Category) to Rows, and a Measure (like Sales) to Columns.',
        'For a Line Chart, you need a Date field on Columns. Click the + on the Date pill to drill down.',
        'For a Scatter Plot, put one Measure on Rows, another on Columns, and drag a Dimension to the Detail mark to break it apart.',
        'Click the "Label" card in the Marks pane and check "Show mark labels".'
      ],
      challengeHint: 'Format your axes to show Currency (Standard) instead of raw numbers. Right-click the axis and select Format.',
      concepts: {
        'dimension': 'Dimensions contain qualitative values (such as names, dates, or geographical data). They affect the level of detail in the view.',
        'measure': 'Measures contain numeric, quantitative values that you can measure. They are aggregated by default (e.g., SUM, AVG).',
        'mark': 'The Marks card controls how data is visually encoded. It defines the type of visual (Bar, Line, Circle) and its properties (Color, Size, Label).'
      }
    },
    '3': {
      title: 'Calculated Fields Laboratory', unit: '1',
      objective: 'Master Aggregate, Logical, String, and Number calculations in Tableau.',
      completeKey: 'tvl_complete_3', rubricKey: 'tvl_rubric_3', reflectKey: 'tvl_reflect_3', nextLab: '4',
      hints: [
        'An Aggregate calc looks like: SUM([Profit]) / SUM([Sales]). Notice how SUM is inside the formula.',
        'A Logical calc uses IF/THEN/ELSE: IF [Sales] > 1000 THEN "High" ELSE "Low" END.',
        'A String calc manipulates text: UPPER([Customer Name]).',
        'A Number calc manipulates math: ROUND([Profit], 2).'
      ],
      challengeHint: 'Mix logical and aggregate! Try: SUM(IF [Region] = "West" THEN [Sales] ELSE 0 END).',
      concepts: {
        'aggregate': 'Aggregate calculations evaluate multiple rows of data and return a single value. SUM, AVG, MIN, MAX are common aggregations.',
        'logical': 'Logical expressions evaluate a condition and return true/false or branch into different results using IF/THEN or CASE statements.',
        'string': 'String functions manipulate text data, useful for cleaning messy data (UPPER, LOWER, REPLACE, SPLIT).'
      }
    },
    '4': {
      title: 'Dashboard Development Studio', unit: '1',
      objective: 'Build a linked multi-sheet dashboard with Category and Region quick filters.',
      completeKey: 'tvl_complete_4', rubricKey: 'tvl_rubric_4', reflectKey: 'tvl_reflect_4', nextLab: '5',
      hints: [
        'Create a new Dashboard by clicking the grid icon with a + at the bottom of the screen.',
        'Drag your 3 completed worksheets from the left pane onto the dashboard canvas.',
        'To add a filter, click the dropdown arrow on one of your charts in the dashboard, go to Filters, and select Category.',
        'Make the filter apply to all charts by clicking the filter\'s dropdown -> Apply to Worksheets -> Selected Worksheets.'
      ],
      challengeHint: 'Add a Text object to the very top to act as your Dashboard Title. Give it a large, bold font.',
      concepts: {
        'dashboard': 'A Dashboard is a collection of several views (worksheets) arranged on a single layout, allowing you to compare a variety of data simultaneously.',
        'filter': 'Filters restrict the data shown. When applied to a dashboard, a filter can be configured to update a single chart or all charts simultaneously.',
        'textobject': 'Text objects allow you to add titles, descriptions, and annotations directly to a dashboard layout independent of the data.'
      }
    },
    '5': {
      title: 'Filtering and Parameter Analytics', unit: '2',
      objective: 'Build a dynamic Top-N analysis using parameters and RANK calculated fields.',
      completeKey: 'tvl_complete_5', rubricKey: 'tvl_rubric_5', reflectKey: 'tvl_reflect_5', nextLab: '6',
      hints: [
        'Right-click the data pane and select "Create Parameter". Name it "Top N", set it to Integer, and give it a current value of 10.',
        'Right-click your new parameter and select "Show Parameter".',
        'Create a calc using RANK(SUM([Sales])). Then use it in a filter: [Rank Calc] <= [Top N Parameter].',
        'Make sure to Compute Using -> Pane (Down) or whatever matches your view level of detail.'
      ],
      challengeHint: 'Use the parameter inside your chart title so it dynamically says "Top 5 Customers" or "Top 10 Customers"!',
      concepts: {
        'parameter': 'A parameter is a dynamic value (number, date, or string) that can replace constant values in calculations, filters, and reference lines.',
        'rank': 'RANK is a table calculation that assigns a ranking to values in a partition. It is computed after the initial SQL query returns data to Tableau.'
      }
    },
    '6': {
      title: 'Statistical Visualization Lab', unit: '2',
      objective: 'Create Histograms, Box Plots, Bubble Charts, and Treemaps across two datasets.',
      completeKey: 'tvl_complete_6', rubricKey: 'tvl_rubric_6', reflectKey: 'tvl_reflect_6', nextLab: '7',
      hints: [
        'To make a Histogram, click a Measure like Sales, go to "Show Me" in the top right, and click the Histogram icon. It auto-creates "bins".',
        'For a Box Plot, put a continuous measure on Rows, and drag a granular dimension (like Order ID or Customer Name) to Detail.',
        'A Treemap requires 1-2 Dimensions on Color/Detail, and a Measure on Size. The "Show Me" menu can generate this instantly.',
        'A Bubble Chart uses the Circle mark type with a Dimension on Text/Color and a Measure on Size.'
      ],
      challengeHint: 'Box plots show the median, hinges (Q1/Q3), and whiskers (1.5x IQR). Hover over the box plot to see the five-number summary.',
      concepts: {
        'histogram': 'A histogram groups continuous data into discrete bins (buckets) to show the distribution and frequency of values.',
        'boxplot': 'A box plot is a standardized way of displaying the distribution of data based on a five-number summary (minimum, first quartile, median, third quartile, and maximum).',
        'treemap': 'A treemap displays hierarchical data as a set of nested rectangles, where the area of each rectangle is proportional to a specific measure.'
      }
    },
    '7': {
      title: 'Business Intelligence Chart Lab', unit: '2',
      objective: 'Build Pareto, Waterfall, Funnel, and Bump charts with business captions.',
      completeKey: 'tvl_complete_7', rubricKey: 'tvl_rubric_7', reflectKey: 'tvl_reflect_7', nextLab: '8',
      hints: [
        'Pareto Chart: You need a bar chart of Sales sorted descending, and a line chart of RUNNING_SUM(Sales) as % of Total on a Dual Axis.',
        'Waterfall Chart: Use the Gantt mark type. Put a measure on Rows, and place the negative version of that measure on the Size card.',
        'Bump Chart: Plot RANK(SUM(Sales)) over time on a line chart. Don\'t forget to reverse the axis so Rank 1 is at the top!',
        'Add Captions via Worksheet -> Show Caption.'
      ],
      challengeHint: 'For the Funnel chart, you can create a calculated field that assigns a rigid width to each stage, or just use the Area chart trick rotated vertically.',
      concepts: {
        'pareto': 'A Pareto chart contains both bars and a line graph, showing individual values descending and the cumulative total. It highlights the 80/20 rule.',
        'waterfall': 'A waterfall chart helps understand the cumulative effect of sequentially introduced positive or negative values.',
        'dualaxis': 'Dual Axis allows you to overlay two independent measures with different scales on the same chart (e.g. Sales in bars, Profit Ratio in lines).'
      }
    },
    '8': {
      title: 'Predictive Analytics and Forecasting', unit: '2',
      objective: 'Apply Tableau\'s trend lines, forecasting, and clustering features.',
      completeKey: 'tvl_complete_8', rubricKey: 'tvl_rubric_8', reflectKey: 'tvl_reflect_8', nextLab: '9',
      hints: [
        'Switch from the Data pane to the Analytics pane (top left, next to Data).',
        'Drag "Trend Line" onto a scatter plot or time series chart.',
        'Drag "Forecast" onto a time series chart. Note: You need a continuous date field and a measure for this to work.',
        'Drag "Cluster" onto a scatter plot to automatically group points using k-means clustering.'
      ],
      challengeHint: 'Right-click the trend line and select "Describe Trend Model" to view the R-Squared and P-value.',
      concepts: {
        'trendline': 'Trend lines help identify the general direction of data over time or the relationship between two variables, using linear, logarithmic, or polynomial models.',
        'forecast': 'Tableau uses exponential smoothing models to predict future values based on historical data.',
        'cluster': 'Clustering automatically groups similar data points together based on their statistical characteristics using the k-means algorithm.'
      }
    },
    '9': {
      title: 'Data Types, Hierarchy, and Metadata', unit: '3',
      objective: 'Create field hierarchies, assign geographic roles, and document a Data Dictionary.',
      completeKey: 'tvl_complete_9', rubricKey: 'tvl_rubric_9', reflectKey: 'tvl_reflect_9', nextLab: '10',
      hints: [
        'To create a hierarchy, drag one dimension (e.g., City) directly on top of another (e.g., State) in the Data pane.',
        'Right-click a spatial field (like State), go to Geographic Role, and assign the correct type so Tableau plots it on a map.',
        'Right-click fields to add Default Properties -> Comments. These act as your data dictionary when users hover over fields.',
        'To document it, create a text box on a dashboard listing the definitions.'
      ],
      challengeHint: 'Create a 3-level hierarchy: Country -> State -> City. Then use it in a view and click the + / - icons to drill up and down.',
      concepts: {
        'hierarchy': 'Hierarchies define the drill-down path of data. For example, Year -> Quarter -> Month, or Category -> Sub-Category.',
        'geographicrole': 'Assigning a geographic role tells Tableau that a string field contains spatial data, allowing it to auto-generate latitude and longitude.'
      }
    },
    '10': {
      title: 'Extracts and Metadata Analysis', unit: '3',
      objective: 'Compare live vs extract connections and use DATEDIFF to calculate shipping time.',
      completeKey: 'tvl_complete_10', rubricKey: 'tvl_rubric_10', reflectKey: 'tvl_reflect_10', nextLab: '11',
      hints: [
        'Go to the Data Source tab (bottom left). In the top right, switch the connection from "Live" to "Extract".',
        'Click the "Edit" button next to Extract to add an extract filter (e.g., only keep data from 2023).',
        'Use DATEDIFF(\'day\', [Order Date], [Ship Date]) to get shipping duration.',
        'Create a visual showing average shipping time by region using your new extract.'
      ],
      challengeHint: 'Extracts (.hyper files) are highly optimized for read performance. A dashboard running on a 10M row extract will be vastly faster than a live connection to a slow SQL database.',
      concepts: {
        'live': 'A Live connection sends a query to the underlying database every time you interact with a chart. Slower, but always up-to-date.',
        'extract': 'An Extract (.hyper) is a high-performance local snapshot of your data. It must be manually or scheduled to be refreshed, but is incredibly fast.'
      }
    },
    '11': {
      title: 'Geospatial Analytics Laboratory', unit: '4',
      objective: 'Build Filled Maps and Symbol Maps, and use MAKEPOINT/DISTANCE calculations.',
      completeKey: 'tvl_complete_11', rubricKey: 'tvl_rubric_11', reflectKey: 'tvl_reflect_11', nextLab: '12',
      hints: [
        'Double-click a field with a Geographic Role (like State) to auto-generate a map.',
        'A Filled Map places a measure on Color. A Symbol Map places a measure on Size.',
        'Use MAKEPOINT([Latitude], [Longitude]) to create a spatial point from raw coordinate columns.',
        'Use DISTANCE([Point1], [Point2], \'mi\') to calculate how far apart two spatial points are.'
      ],
      challengeHint: 'Put a discrete dimension on Color and a continuous measure on Size on the same symbol map to encode two variables spatially.',
      concepts: {
        'filledmap': 'A filled map (choropleth) shades entire geographic regions (states, countries) based on a measure. Good for ratios or rates, bad for raw totals due to land area bias.',
        'symbolmap': 'A symbol map places a shape (usually a circle) at the center of a geographic area, scaled by a measure. Better for raw totals.',
        'makepoint': 'MAKEPOINT converts numeric latitude and longitude fields into a true Spatial object that Tableau can map.'
      }
    },
    '12': {
      title: 'Performance Optimization Lab', unit: '4',
      objective: 'Compare workbooks before/after LOD optimization and extract migration.',
      completeKey: 'tvl_complete_12', rubricKey: 'tvl_rubric_12', reflectKey: 'tvl_reflect_12', nextLab: '13',
      hints: [
        'LODs (Level of Detail expressions) skip the view\'s grouping. syntax: { FIXED [Region] : SUM([Sales]) }.',
        'FIXED computes before Dimension Filters. INCLUDE/EXCLUDE compute after.',
        'To optimize: pre-compute complex LODs by extracting the data after creating the calculation. It materializes the result in the hyper file.',
        'Add a text object in a dashboard describing your before/after changes.'
      ],
      challengeHint: 'Run the Performance Recording (Help -> Settings and Performance -> Start Performance Recording) to actually measure the render time in seconds!',
      concepts: {
        'lod': 'Level of Detail (LOD) expressions allow you to compute aggregations that are not at the level of detail of the view. (e.g., finding the total sales per customer, then averaging that).',
        'fixed': 'FIXED LODs calculate values independent of the dimensions in the view. They are extremely powerful for cohort analysis.'
      }
    },
    '13': {
      title: 'Publishing and Sharing Workflow', unit: '5',
      objective: 'Publish to Tableau Public and embed a dashboard using the Embedding API v3.',
      completeKey: 'tvl_complete_13', rubricKey: 'tvl_rubric_13', reflectKey: 'tvl_reflect_13', nextLab: '14',
      hints: [
        'You need a free Tableau Public account.',
        'In Tableau Desktop/Public, go to Server -> Tableau Public -> Save to Tableau Public.',
        'Wait for the browser to open your published dashboard. Copy the URL.',
        'Paste the URL into the input field above the evaluator.'
      ],
      challengeHint: 'Look at the "Share" button on your published view. It gives you an embed code. This is how you embed Tableau into custom websites!',
      concepts: {
        'tableaupublic': 'Tableau Public is a free platform for hosting interactive data visualizations online. Data published here is accessible to anyone on the internet.',
        'embedding': 'Tableau dashboards can be embedded into standard HTML web pages using iframes or the JavaScript Embedding API.'
      }
    },
    '14': {
      title: 'Dashboard Iteration and Versioning', unit: '5',
      objective: 'Iterate on a published dashboard and document changes in a Version Log.',
      completeKey: 'tvl_complete_14', rubricKey: 'tvl_rubric_14', reflectKey: 'tvl_reflect_14', nextLab: '15',
      hints: [
        'Make a clear visual change: Add a Color encoding to your primary chart.',
        'Add a new interactive element: Insert a Ship Mode filter and apply it to all worksheets.',
        'Add a static annotation: Right-click a specific mark on a chart -> Annotate -> Mark.',
        'Create a new dashboard acting as your "Version Log" to document what changed.'
      ],
      challengeHint: 'Real-world dashboards are never "done". Versioning them properly prevents you from breaking an executive\'s favorite view.',
      concepts: {
        'annotation': 'Annotations call out specific data points, points in time, or entire areas of a chart to provide context or tell a story.',
        'iteration': 'The process of refining a dashboard based on user feedback. Good BI development is highly iterative.'
      }
    },
    '15': {
      title: 'Data Pipeline Integration (Bonus)', unit: '5',
      objective: 'Generate a CSV with Python and build a live monitoring dashboard. Optional +10 marks.',
      completeKey: 'tvl_complete_15', rubricKey: 'tvl_rubric_15', reflectKey: 'tvl_reflect_15', nextLab: 'Cap',
      hints: [
        'Use Python or any script to generate a mock dataset (e.g., sensor readings over time) and save it as a CSV.',
        'Connect Tableau to that CSV as a Live connection.',
        'Build a Time Series line chart with a parameter to toggle which sensor to view.',
        'This proves you can link code-generated data to visual analytics!'
      ],
      challengeHint: 'If you overwrite the CSV file with new data and click "Refresh" in Tableau, your dashboard will instantly update to show the new data.',
      concepts: {
        'timeseries': 'A line chart tracking a continuous measure over a continuous date/time axis. The standard way to monitor sensors, stock prices, or live metrics.',
        'pipeline': 'The end-to-end flow of data. In this lab: Python generates data -> Saves to CSV -> Tableau reads CSV -> Dashboard visualizes it.'
      }
    },
    'Cap': {
      title: 'Complete BI Solution — Capstone', unit: 'C',
      objective: 'Build a full multi-dashboard solution meeting 8 mandatory technical requirements.',
      completeKey: 'tvl_complete_Cap', rubricKey: 'tvl_rubric_Cap', reflectKey: 'tvl_reflect_Cap', nextLab: 'null',
      hints: [
        'This is the grand finale. You must include at least 3 dashboards.',
        'You need a Parameter, a Forecast, Trend Lines, a Map, and an LOD expression.',
        'Use Storytelling Captions (Text objects) to explain your findings.',
        'Publish the final result to Tableau Public and submit the URL.'
      ],
      challengeHint: 'Focus on a cohesive narrative. Don\'t just throw random charts together. Build an executive summary dashboard, a detailed drill-down dashboard, and a geospatial analysis dashboard.',
      concepts: {
        'capstone': 'A comprehensive project demonstrating mastery of all skills learned in the curriculum: data prep, advanced calcs, dashboard design, analytics, and publishing.'
      }
    }
  };

  // ─────────────────────────────────────────────
  // CONTEXT & PROGRESS
  // ─────────────────────────────────────────────
  function getLabId() {
    if (window.location.pathname.toLowerCase().includes('capstone')) return 'Cap';
    const m = window.location.pathname.match(/lab(\d+)\.html/i);
    return m ? m[1] : null;
  }

  function getRubricProgress(labId) {
    const lab = KB[labId];
    if (!lab) return { checked: 0, total: 4 };
    
    let total = 0;
    let domChecked = 0;
    let hasDom = false;
    while (document.getElementById('check-' + (total + 1))) {
      hasDom = true;
      if (document.getElementById('check-' + (total + 1)).classList.contains('pass')) {
        domChecked++;
      }
      total++;
    }
    if (total === 0) total = 4; // fallback for hub page
    
    const arr = JSON.parse(localStorage.getItem(lab.rubricKey) || '[]');
    let storageChecked = arr.filter(Boolean).length;
    
    return { checked: hasDom ? Math.max(domChecked, storageChecked) : storageChecked, total };
  }

  function isComplete(labId) {
    return localStorage.getItem(KB[labId]?.completeKey) === '1';
  }

  function hasReflection(labId) {
    const v = localStorage.getItem(KB[labId]?.reflectKey) || '';
    return v.trim().length > 10;
  }

  function countCompleted() {
    return Object.keys(KB).filter(id => isComplete(id)).length;
  }

  function nextIncompletelab() {
    return Object.keys(KB).find(id => !isComplete(id)) || null;
  }

  // ─────────────────────────────────────────────
  // RESPONSE ENGINE
  // ─────────────────────────────────────────────
  function respond(raw) {
    const input = raw.toLowerCase().trim();
    const labId = getLabId();
    const lab = KB[labId];
    const isHub = !labId;

    /* ── quiz mode intercept ── */
    if (quizState !== undefined && quizState !== null) {
      const qr = handleQuizInput(raw);
      if (qr) return qr;
    }

    /* ── start quiz ── */
    if (/quiz me|flashcard|quiz.*start|start.*quiz|flash card/.test(input)) {
      return startQuiz();
    }

    /* ── greetings ── */
    if (/^(hi|hey|hello|sup|yo|hiya|good\s*(morning|afternoon|evening))/.test(input)) {
      const done = countCompleted();
      if (isHub) return `Hey! 👋 You've completed **${done}/15 labs**. ${done === 0 ? "Start with **Lab 0** — it's the foundation." : done < 8 ? "Great pace! Keep moving through the units." : done < 15 ? "Almost there — push through!" : "🎉 All 15 done! You're a DataViz pro."
    } `;
      const rp = getRubricProgress(labId);
      return `Hi! I'm your tutor for **${lab.title}** (Lab ${labId}). You've checked ** ${ rp.checked }/${rp.total}** rubric items. ${rp.checked === 0 ? 'Jump in and interact with the main visualization, then say **"hint"** when you need direction.' : rp.checked < 4 ? 'Good progress! Say **"hint"** for your next nudge.' : '🎉 Rubric complete! Write your reflection and mark it done.'}`;
  }

  /* ── hint ── */
  if (/hint|nudge|clue|tip|help me|what.?s next|next step|stuck|push me/.test(input)) {
    if (!lab) return 'Navigate into a specific lab and I\'ll give you targeted hints!';
    const rp = getRubricProgress(labId);
    const idx = Math.min(rp.checked, lab.hints.length - 1);
    return `💡 **Hint ${idx + 1}/${lab.hints.length}:**\n\n${lab.hints[idx]}\n\n_Try that, then check the rubric box if you understood it._`;
  }

  /* ── challenge ── */
  if (/challenge/.test(input)) {
    if (!lab) return 'Go to a specific lab to get challenge hints!';
    return `🎯 **Challenge Hint:**\n\n${lab.challengeHint}`;
  }

  /* ── help / what do I do ── */
  if (/help|how.*start|what.*(do|should).*do|confused|lost|don.?t know/.test(input)) {
    if (!lab) return progressResponse();
    const rp = getRubricProgress(labId);
    return `Here's where you are in **${lab.title}**:\n\n🎯 ${lab.objective}\n\n📋 **${rp.checked}/${rp.total}** rubric items checked. ${rp.checked === 0 ? 'Start by interacting with the main controls above!' : rp.checked < 4 ? 'Keep going — say **"hint"** for the next specific action.' : hasReflection(labId) ? 'Write more in your reflection then hit **Mark Complete ✓**!' : 'Write your reflection below, then hit **Mark Complete ✓**!'}`;
  }

  /* ── progress ── */
  if (/progress|how.*doing|how many|status|overview|how far/.test(input)) {
    return progressResponse();
  }

  /* ── explain / what is this lab ── */
  if (/explain|what.*(this lab|we learn|objective|goal)|why.*lab/.test(input)) {
    if (!lab) return progressResponse();
    return `📖 **${lab.title}** — Lab ${labId} (Unit ${lab.unit})\n\n**Objective:** ${lab.objective}\n\n**Unit ${lab.unit} theme:** ${unitTheme(lab.unit)}\n\nSay **"hint"** to get started, or ask me about any concept by name.`;
  }

  /* ── next / which lab ── */
  if (/next|after this|move on|which lab|where.*go|what do.*after/.test(input)) {
    if (!lab) {
      const id = nextIncompletelab();
      return id ? `Next up: **Lab ${id} — ${KB[id].title}**! Click its card on the hub.` : '🎉 You\'ve completed all 15 labs!';
    }
    const rp = getRubricProgress(labId);
    if (rp.checked < rp.total) return `Finish this lab first — **${rp.total - rp.checked} rubric item(s)** left. Say **"hint"** for help.`;
    if (!hasReflection(labId)) return 'Write your reflection in the text area below, then you\'re ready to move on!';
    if (lab.nextLab) return `Great work! Next: **Lab ${lab.nextLab} — ${KB[lab.nextLab].title}**. Click **"← Curriculum"** to navigate there.`;
    return '🎉 This is the final lab! Mark it complete and you\'ve finished the entire curriculum.';
  }

  /* ── mark complete ── */
  if (/mark.*complete|finish.*lab|i.?m done|complete.*lab/.test(input)) {
    if (!lab) return 'Navigate to a lab to complete it!';
    const rp = getRubricProgress(labId);
    if (rp.checked < rp.total) return `You still have **${rp.total - rp.checked} rubric item(s)** unchecked. Review the checklist near the bottom of the page!`;
    if (!hasReflection(labId)) return 'Almost! Write a reflection in the textarea below first — it helps consolidate the learning.';
    return '✅ You\'re ready! Click **"Mark Complete ✓"** in the top-right corner of the page.';
  }

  /* ── why does this matter / real world ── */
  if (/why.*(matter|important|care|relevant)|real.?world|example|application|use.?case|practical/.test(input)) {
    if (!lab) return 'Ask me this inside a specific lab for a real-world example!';
    const examples = {
      '1A': 'In 2023, US Census reported **median household income $74K** — the **mean was $102K**. That $28K gap (caused by ultra-high earners) directly affects how poverty programs are funded. You just learned why.',
      '1B': 'Climate scientists use regression to estimate how much each 1°C of warming raises sea levels. The noise (natural variability) makes isolating the true signal as critical as anything you practiced here.',
      '1C': 'Manufacturing quality control: sample 30 bolts per batch, measure their diameter. The CLT guarantees those sample means follow a normal distribution — making defect detection statistically reliable.',
      '2A': 'Every BI dashboard at Airbnb, Netflix, or Amazon starts with SQL exactly like what you wrote. SQL is the lingua franca of data analysis — learning it here prepares you for any data role.',
      '2B': 'In medical trials, if sicker patients skip follow-up appointments, dropping their missing data makes treatments appear more effective than they are. The missing-data decisions you made here have life-or-death analogues.',
      '2C': 'Every streaming platform (Netflix, Spotify) runs data pipelines 24/7: ingest → validate → clean → model → serve recommendations. The pipeline you built here is the conceptual architecture behind all of that.',
      '3A': 'A viral COVID chart in 2020 used dual-axis trickery to make case counts and death rates "track together" — when they had actually diverged for months. Recognizing Chart A\'s flaw lets you spot that in the wild.',
      '3B': 'Political campaigns hire data viz consultants specifically to make their candidate\'s numbers look better using truncated y-axes and strategic annotations. You can now see through it.',
      '3C': 'Google\'s analytics teams produce 3 versions of every quarterly report: full technical report for data engineers, executive summary for VPs, and press-ready chart for journalists. You just practiced all three.',
      '4A': 'NASA\'s climate maps switched from rainbow color scales (misleading, not colorblind-safe) to "Inferno" and "Viridis" (perceptually uniform) in 2018. Incorrect palette choices in their old maps led scientists to misread magnitude.',
      '4B': 'Research shows that dashboards with proper type hierarchy reduce time-to-insight by 40%. Every second a decision-maker spends decoding your layout is a second not spent on the decision itself.',
      '4C': 'Jeff Bezos famously banned PowerPoint decks at Amazon exec meetings — replaced with written narratives. His argument: slide layouts optimize for presenter comfort, not audience comprehension. The layout principles here address that directly.',
      '5A': 'Protein structure researchers use 3D visualization of molecular coordinates — because proteins ARE 3D objects and the 3D structure determines function. That\'s a legitimate use case. Your height-weight-age data? Probably not.',
      '5B': 'The CDC\'s COVID dashboard team went through this exact workflow — CSV imports, SQL cleaning, Plotly/D3 charts, audience-specific versions for epidemiologists vs. the public — in a 20-minute daily standup loop for 3 years.',
    };
    return `🌍 **Real-world relevance of Lab ${labId}:**\n\n${examples[labId] || 'Every decision in this lab maps to decisions made by data journalists, scientists, and analysts every single day.'}`;
  }

  /* ── concept lookup — check all lab concept dictionaries —— fuzzy partial match —— */
  // Build flat term list from all KB concepts
  const allConcepts = [];
  for (const [, labData] of Object.entries(KB)) {
    if (!labData.concepts) continue;
    for (const [term, explanation] of Object.entries(labData.concepts)) {
      allConcepts.push({ term, explanation });
    }
  }
  // First: exact prefix match (original behaviour)
  for (const { term, explanation } of allConcepts) {
    if (input.includes(term.replace(/[^a-z0-9]/gi, '').toLowerCase().slice(0, 6))) {
      return `📚 **${term.charAt(0).toUpperCase() + term.slice(1)}**\n\n${explanation}`;
    }
  }
  // Second: fuzzy — check if any word in query appears inside any concept term/explanation
  const queryWords = input.split(/\W+/).filter(w => w.length > 3);
  for (const qw of queryWords) {
    for (const { term, explanation } of allConcepts) {
      if (term.toLowerCase().includes(qw) || explanation.toLowerCase().includes(qw)) {
        return `📚 **${term.charAt(0).toUpperCase() + term.slice(1)}**\n\n${explanation}\n\n_Matched on “${qw}” — ask **"what is ${term}"** for more._`;
      }
    }
  }

  /* ── specific keyword matches ── */
  if (/sql|query|database/.test(input)) return `📚 **SQL in this curriculum:**\n\nSQL (Structured Query Language) is used in Labs 2A and 5B. Key commands: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY. Ask me about any specific clause!`;
  if (/plotly|chart.*lib|d3/.test(input)) return `📚 **Charting libraries used:**\n\n• **Plotly.js** — interactive charts (histograms, scatter, bar, 3D)\n• **D3.js** — math utilities (KDE calculations in Lab 1A/1C)\n• **Three.js** — WebGL 3D in Lab 5A\n• **sql.js** — in-browser SQLite for Labs 2A & 5B`;
  if (/mean|average/.test(input)) return KB['1A'].concepts.mean;
  if (/median/.test(input)) return KB['1A'].concepts.median;
  if (/iqr|interquartile/.test(input)) return KB['1A'].concepts.iqr;
  if (/kde|kernel density/.test(input)) return KB['1A'].concepts.kde;
  if (/normal dist|bell curve/.test(input)) return KB['1C'].concepts.normal;
  if (/z.?score|zscore/.test(input)) return KB['1C'].concepts.zscore;
  if (/clt|central limit/.test(input)) return KB['1C'].concepts.clt;
  if (/regress/.test(input)) return KB['1B'].concepts.regression;
  if (/correl/.test(input)) return KB['1B'].concepts.correlation;
  if (/noise/.test(input)) return KB['1B'].concepts.noise;
  if (/impute|imputation/.test(input)) return KB['2B'].concepts.imputation;
  if (/pipeline|etl/.test(input)) return KB['2C'].concepts.pipeline;
  if (/dual.?axis/.test(input)) return KB['3A'].concepts.dualaxis;
  if (/truncat/.test(input)) return KB['3B'].concepts.truncation;
  if (/sequen/.test(input)) return KB['4A'].concepts.sequential;
  if (/diverg/.test(input)) return KB['4A'].concepts.diverging;
  if (/categor/.test(input)) return KB['4A'].concepts.categorical;
  if (/color.?blind|a11y|accessibility/.test(input)) return KB['4A'].concepts.colorblind;
  if (/hierarch/.test(input)) return KB['4B'].concepts.hierarchy;
  if (/whitespace|padding|spacing/.test(input)) return KB['4B'].concepts.whitespace;
  if (/kpi|key perform/.test(input)) return KB['4C'].concepts.kpi;
  if (/narrativ/.test(input)) return KB['4C'].concepts.narrative;
  if (/3d|three.?d|projection/.test(input)) return KB['5A'].concepts['3dviz'];
  if (/occlusion/.test(input)) return KB['5A'].concepts.occlusion;

  /* ── fallback ── */
  const opts = [
    `I work best with focused questions! Try:\n• **"hint"** — get a specific nudge\n• **"explain"** — understand the lab objective\n• **"what is [term]"** — any concept definition\n• **"why does this matter"** — real-world examples\n• **"quiz me"** — flashcard through all 40+ concepts\n• **"progress"** — your curriculum overview`,
    `Not sure what you mean, but I'm here to help! Say **"hint"** for your next action, **"what is [concept]"** for definitions, **"quiz me"** for concept flashcards, or **"progress"** to see how far you've come.`,
  ];
  return opts[Math.floor(Math.random() * opts.length)];
}

  function progressResponse() {
  const done = countCompleted();
  const total = Object.keys(KB).length;
  const pct = Math.round((done / total) * 100);
  const unitSummary = [1, 2, 3, 4, 5].map(u => {
    const ids = Object.entries(KB).filter(([, v]) => v.unit === u).map(([id]) => id);
    const unitDone = ids.filter(id => isComplete(id)).length;
    return `U${u}: ${unitDone}/${ids.length}`;
  }).join('  ·  ');
  const next = nextIncompletelab();
  return `📊 **Your Curriculum Progress**\n\n**${done}/${total} labs complete** (${pct}%)\n${unitSummary}\n\n${done === 0 ? '🚀 Just getting started! Begin with **Lab 1A**.' :
      done === total ? '🎉 **All 15 labs complete! You\'re a DataViz expert!**' :
        next ? `👉 Next up: **Lab ${next} — ${KB[next].title}**` : ''
    }`;
}

function unitTheme(u) {
  return ['', 'Statistical foundations — distributions, correlation, CLT.',
    'Data engineering — cleaning, querying, and pipelining raw data.',
    'Communication & ethics — how design choices affect what data "says".',
    'Design excellence — color, typography, and layout as information.',
    '3D & capstone — advanced techniques and synthesizing all skills.'][u];
}

// ─────────────────────────────────────────────
// QUIZ / FLASHCARD MODE
// ─────────────────────────────────────────────
let quizState = null; // null = not in quiz; { cards, idx, awaitingAnswer }

function buildQuizDeck() {
  const deck = [];
  for (const [labId, labData] of Object.entries(KB)) {
    if (!labData.concepts) continue;
    for (const [term, explanation] of Object.entries(labData.concepts)) {
      deck.push({ term, explanation, lab: labId });
    }
  }
  // Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function startQuiz() {
  const cards = buildQuizDeck();
  quizState = { cards, idx: 0, awaitingAnswer: true };
  const c = cards[0];
  return `🃏 **QUIZ MODE — Card 1/${cards.length}**\n\n**Define this term:**\n\n“${c.term.charAt(0).toUpperCase() + c.term.slice(1)}”\n\n_Type your answer, then say **"show answer"** to reveal the correct definition. Say **"quit quiz"** to exit._`;
}

function handleQuizInput(raw) {
  const input = raw.toLowerCase().trim();
  if (!quizState) return null;
  if (/quit quiz|exit quiz|stop quiz/.test(input)) {
    quizState = null;
    return '❌ Quiz stopped. Say **"quiz me"** anytime to restart.';
  }
  const card = quizState.cards[quizState.idx];
  if (quizState.awaitingAnswer) {
    if (/show answer|reveal|answer/i.test(input)) {
      quizState.awaitingAnswer = false;
      const remaining = quizState.cards.length - quizState.idx - 1;
      return `✅ **Answer for “${card.term}”:**\n\n${card.explanation}\n\n${remaining > 0 ? `**${remaining} card(s) left.** Say **"next"** for the next term, or anything else to continue.` : '🎉 **You finished all the cards!** Say **"quiz me"** to shuffle and restart.'}`;
    }
    // They typed something — acknowledge and prompt for show answer
    return `Got it! Your answer: “${raw}”.\n\nNow say **"show answer"** to see the expert definition and compare.`;
  } else {
    // After revealing — advance to next card
    quizState.idx++;
    if (quizState.idx >= quizState.cards.length) {
      const total = quizState.cards.length;
      quizState = null;
      return `🎉 **All ${total} flashcards completed!** Say **"quiz me"** to shuffle and go again, or **"progress"** to see where you stand.`;
    }
    quizState.awaitingAnswer = true;
    const next = quizState.cards[quizState.idx];
    return `🃏 **Card ${quizState.idx + 1}/${quizState.cards.length}**\n\n**Define this term:**\n\n“${next.term.charAt(0).toUpperCase() + next.term.slice(1)}”`;
  }
}

// ─────────────────────────────────────────────
// UI
// ─────────────────────────────────────────────
function buildUI() {
  const s = document.createElement('style');
  s.textContent = `
      #tv-btn{position:fixed;bottom:1.5rem;left:1.5rem;z-index:9998;width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#4f8ef7,#8b5cf6);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.35rem;box-shadow:0 4px 20px rgba(79,142,247,0.5);transition:transform .2s,box-shadow .2s;color:#fff;}
      #tv-btn:hover{transform:scale(1.1);box-shadow:0 6px 28px rgba(79,142,247,0.65);}
      #tv-badge{position:absolute;top:-4px;right:-4px;min-width:18px;height:18px;border-radius:99px;background:#f59e0b;border:2px solid #0d0f14;font-size:9px;font-weight:800;color:#000;display:flex;align-items:center;justify-content:center;padding:0 3px;font-family:'JetBrains Mono',monospace;}
      #tv-panel{position:fixed;bottom:5.5rem;left:1.5rem;z-index:9999;width:340px;max-height:500px;background:#141720;border:1px solid #252a3a;border-radius:16px;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,0.65);font-family:'Inter',sans-serif;font-size:.85rem;opacity:0;transform:translateY(14px) scale(.96);pointer-events:none;transition:opacity .22s,transform .22s;}
      #tv-panel.open{opacity:1;transform:none;pointer-events:all;}
      .tv-hdr{display:flex;align-items:center;gap:.6rem;padding:.85rem 1rem;border-bottom:1px solid #252a3a;flex-shrink:0;}
      .tv-av{font-size:1.25rem;}
      .tv-hdr-txt{flex:1;}
      .tv-name{font-weight:700;font-size:.9rem;color:#e8eaf0;}
      .tv-sub{font-size:.7rem;color:#8892a4;margin-top:.1rem;}
      .tv-close{background:none;border:none;color:#55607a;cursor:pointer;font-size:1rem;padding:.2rem .35rem;border-radius:6px;transition:color .15s;line-height:1;}
      .tv-close:hover{color:#e8eaf0;}
      .tv-msgs{flex:1;overflow-y:auto;padding:.8rem;display:flex;flex-direction:column;gap:.6rem;scrollbar-width:thin;scrollbar-color:#252a3a transparent;}
      .tv-msg{display:flex;max-width:100%;}
      .tv-msg .b{padding:.5rem .78rem;border-radius:12px;line-height:1.52;font-size:.81rem;max-width:90%;word-break:break-word;}
      .tv-msg.t .b{background:#1a1e2e;border:1px solid #252a3a;color:#e8eaf0;border-radius:4px 12px 12px 12px;}
      .tv-msg.u{flex-direction:row-reverse;}
      .tv-msg.u .b{background:rgba(79,142,247,.14);border:1px solid rgba(79,142,247,.3);color:#e8eaf0;border-radius:12px 4px 12px 12px;}
      .tv-msg .b strong{color:#4f8ef7;}
      .tv-msg .b em{color:#8892a4;font-style:italic;}
      .tv-chips{padding:0 .8rem .45rem;display:flex;gap:.35rem;flex-wrap:wrap;flex-shrink:0;}
      .tv-chip{padding:.22rem .6rem;border-radius:99px;border:1px solid #252a3a;background:transparent;color:#8892a4;font-size:.7rem;cursor:pointer;transition:all .15s;font-family:'Inter',sans-serif;}
      .tv-chip:hover{border-color:#4f8ef7;color:#4f8ef7;background:rgba(79,142,247,.08);}
      .tv-foot{display:flex;gap:.45rem;padding:.7rem .8rem;border-top:1px solid #252a3a;flex-shrink:0;}
      .tv-in{flex:1;padding:.45rem .7rem;background:#1a1e2e;border:1px solid #252a3a;border-radius:8px;color:#e8eaf0;font-family:'Inter',sans-serif;font-size:.81rem;outline:none;transition:border-color .15s;}
      .tv-in:focus{border-color:#4f8ef7;}
      .tv-in::placeholder{color:#55607a;}
      .tv-send{padding:.45rem .7rem;background:#4f8ef7;border:none;border-radius:8px;color:#fff;cursor:pointer;font-size:.85rem;transition:background .15s;line-height:1;}
      .tv-send:hover{background:#3d7de0;}
    `;
  document.head.appendChild(s);

  const btn = document.createElement('button');
  btn.id = 'tv-btn';
  btn.setAttribute('aria-label', 'Open Tutor');
  btn.innerHTML = '🎓<span id="tv-badge">?</span>';
  document.body.appendChild(btn);

  const panel = document.createElement('div');
  panel.id = 'tv-panel';
  panel.innerHTML = `
      <div class="tv-hdr">
        <div class="tv-av">🎓</div>
        <div class="tv-hdr-txt">
          <div class="tv-name">Tableau Tutor</div>
          <div class="tv-sub" id="tv-sub">Monitoring your progress…</div>
        </div>
        <button class="tv-close" id="tv-close" aria-label="Close">✕</button>
      </div>
      <div class="tv-msgs" id="tv-msgs"></div>
      <div class="tv-chips" id="tv-chips"></div>
      <div class="tv-foot">
        <input class="tv-in" id="tv-in" placeholder="Ask me anything…" maxlength="200" autocomplete="off">
        <button class="tv-send" id="tv-send" aria-label="Send">➤</button>
      </div>
    `;
  document.body.appendChild(panel);

  btn.addEventListener('click', togglePanel);
  document.getElementById('tv-close').addEventListener('click', togglePanel);
  document.getElementById('tv-send').addEventListener('click', send);
  document.getElementById('tv-in').addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
}

let open = false, ready = false;

function togglePanel() {
  open = !open;
  document.getElementById('tv-panel').classList.toggle('open', open);
  if (open && !ready) { ready = true; initPanel(); }
  if (open) setTimeout(() => document.getElementById('tv-in').focus(), 180);
}

function initPanel() {
  const labId = getLabId();
  const lab = KB[labId];
  const sub = document.getElementById('tv-sub');

  buildChips(labId);

  if (!lab) {
    const done = countCompleted();
    sub.textContent = `${done}/15 labs complete`;
    addMsg(`👋 Welcome to the **Tableau VL Curriculum**!\n\nYou've completed **${done}/15 labs**. ${done === 0 ? "I'd start with **Lab 0** — it's the foundation of everything." : done === 15 ? "🎉 All 15 done — you're a DataViz expert!" : "Keep going! Say 'progress' for a full overview or 'next lab' for a recommendation."}`);
    return;
  }

  const rp = getRubricProgress(labId);
  const done = isComplete(labId);
  sub.textContent = done ? `${lab.title} ✓` : `${lab.title} · ${rp.checked}/${rp.total} checked`;
  addMsg(
    done
      ? `✅ You've already completed **${lab.title}**!\n\n${lab.nextLab ? `Up next: **Lab ${lab.nextLab} — ${KB[lab.nextLab].title}**.` : 'This is the final lab — amazing work!'}\n\nFeel free to ask about any concept or revisit any topic.`
      : `Hi! I'm tracking your progress on **${lab.title}** (Lab ${labId}).\n\n🎯 *${lab.objective}*\n\nRubric: **${rp.checked}/${rp.total}** items checked.\n\nSay **"hint"** anytime for a targeted nudge!`
  );
}

function buildChips(labId) {
  const c = document.getElementById('tv-chips');
  const chips = labId
    ? ['💡 Hint', '📖 Explain', '🌍 Why it matters', '📊 Progress', '➡️ What\'s next', '🃏 Quiz me']
    : ['📊 Progress', '🚀 Next lab', '💬 Help me start', '🃏 Quiz me'];
  c.innerHTML = chips.map(chip => {
    const val = chip.replace(/^[^\w]+ ?/, '').trim();
    return `<button class="tv-chip" onclick="document.getElementById('tv-in').value='${val}';document.getElementById('tv-send').click();">${chip}</button>`;
  }).join('');
}

function addMsg(text, isUser = false) {
  const box = document.getElementById('tv-msgs');
  if (!box) return;
  const d = document.createElement('div');
  d.className = `tv-msg ${isUser ? 'u' : 't'}`;
  const html = text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code style="font-family:monospace;font-size:.78rem;background:rgba(255,255,255,.08);padding:1px 4px;border-radius:3px">$1</code>')
    .replace(/\n/g, '<br>');
  d.innerHTML = `<div class="b">${html}</div>`;
  box.appendChild(d);
  box.scrollTop = box.scrollHeight;
}

function send() {
  const inp = document.getElementById('tv-in');
  const text = inp.value.trim();
  if (!text) return;
  inp.value = '';
  addMsg(text, true);
  setTimeout(() => { addMsg(respond(text)); refreshBadge(); }, 320);
}

function refreshBadge() {
  const labId = getLabId();
  const badge = document.getElementById('tv-badge');
  if (!badge) return;
  if (labId) {
    const rp = getRubricProgress(labId);
    const left = rp.total - rp.checked;
    badge.textContent = left > 0 ? left : '✓';
    badge.style.background = left > 0 ? '#f59e0b' : '#22c55e';
  } else {
    const done = countCompleted();
    badge.textContent = done;
    badge.style.background = done === 15 ? '#22c55e' : '#4f8ef7';
  }
}

// ─────────────────────────────────────────────
// PROACTIVE NUDGE (90s + 5min if rubric still 0)
// ─────────────────────────────────────────────
function nudge(intensity) {
  if (ready) return;
  const labId = getLabId();
  if (!labId) return;
  const btn = document.getElementById('tv-btn');
  if (!btn) return;
  const pulses = intensity === 2 ? 8 : 4;
  btn.animate(
    [{ boxShadow: '0 4px 20px rgba(79,142,247,0.4)' },
    { boxShadow: '0 0 0 14px rgba(79,142,247,0)' },
    { boxShadow: '0 4px 20px rgba(79,142,247,0.4)' }],
    { duration: 1100, iterations: pulses }
  );
}

// ─────────────────────────────────────────────
// EXPORT & STUDENT LOGISTICS
// ─────────────────────────────────────────────
function requireStudentProfile() {
  const p = localStorage.getItem('tvl_student');
  if (p) return; // already registered

  const overlay = document.createElement('div');
  overlay.id = 'student-registration-overlay';
  overlay.innerHTML = `
      <style>
        #student-registration-overlay {
          position: fixed; inset: 0; z-index: 999999;
          background: rgba(13, 15, 20, 0.98); backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Inter', sans-serif; padding: 1rem;
        }
        .reg-card {
          background: #141720; border: 1px solid #252a3a;
          border-radius: 16px; padding: 2.5rem; width: 100%; max-width: 420px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.6);
        }
        .reg-card h2 { color: #e8eaf0; margin-bottom: 0.5rem; font-size: 1.4rem; font-weight: 800; }
        .reg-card p { color: #8892a4; font-size: 0.85rem; line-height: 1.5; margin-bottom: 1.5rem; }
        .reg-warn {
          background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3);
          color: #f59e0b; padding: 0.75rem; border-radius: 8px; font-size: 0.8rem;
          margin-bottom: 1.5rem; font-weight: 500; display: flex; gap: 0.5rem; align-items: flex-start;
          line-height: 1.4;
        }
        .reg-group { margin-bottom: 1.25rem; }
        .reg-group label { display: block; color: #8892a4; font-size: 0.75rem; font-weight: 600; margin-bottom: 0.4rem; text-transform: uppercase; }
        .reg-group input { 
          width: 100%; background: #0d0f14; border: 1px solid #252a3a; color: #e8eaf0;
          padding: 0.75rem; border-radius: 8px; font-family: inherit; font-size: 0.9rem;
          outline: none; transition: border-color 0.2s; box-sizing: border-box;
        }
        .reg-group input:focus { border-color: #4f8ef7; }
        .reg-btn {
          width: 100%; background: linear-gradient(135deg, #4f8ef7, #8b5cf6); border: none;
          color: white; font-weight: 700; padding: 0.85rem; border-radius: 8px;
          cursor: pointer; font-size: 0.95rem; margin-top: 0.5rem; box-shadow: 0 4px 15px rgba(79,142,247,0.3);
        }
        .reg-btn:hover { opacity: 0.9; }
        .reg-btn:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }
      </style>
      <div class="reg-card">
        <h2>Student Profile Setup</h2>
        <p>Please enter your details to initialize your session. These will be stamped on all your lab reports.</p>
        <div class="reg-warn">
          <span>⚠️</span> <span>These details will be permanently locked to your browser session to prevent tampering. Ensure they are correct before saving.</span>
        </div>
        <div class="reg-group">
          <label>Full Name</label>
          <input type="text" id="reg-name" placeholder="E.g., Jane Doe" autocomplete="off" oninput="window.checkRegForm()">
        </div>
        <div class="reg-group">
          <label>Register / Roll Number</label>
          <input type="text" id="reg-no" placeholder="E.g., CS2024-001" autocomplete="off" oninput="window.checkRegForm()">
        </div>
        <button id="reg-btn" class="reg-btn" disabled onclick="window.saveStudentProfile()">Lock Profile & Start</button>
      </div>
    `;
  document.body.appendChild(overlay);

  window.checkRegForm = () => {
    const n = document.getElementById('reg-name').value.trim();
    const r = document.getElementById('reg-no').value.trim();
    document.getElementById('reg-btn').disabled = !(n.length >= 2 && r.length >= 2);
  };

  window.saveStudentProfile = () => {
    const n = document.getElementById('reg-name').value.trim();
    const r = document.getElementById('reg-no').value.trim();
    if (n.length < 2 || r.length < 2) return;
    localStorage.setItem('tvl_student', JSON.stringify({ name: n, reg: r }));
    overlay.remove();
    delete window.checkRegForm;
    delete window.saveStudentProfile;
  };
}

function injectReportButton() {
  const labId = getLabId();
  if (!labId) return; // not a lab page

  const btn = document.createElement('button');
  btn.innerHTML = '📥 Generate Report';

  // Style to match lab buttons while standing out
  btn.style.cssText = `
      background: linear-gradient(135deg, #4f8ef7, #8b5cf6);
      border: none; color: #fff; padding: 0.4rem 1rem; border-radius: 8px;
      font-size: 0.8rem; font-weight: 700; cursor: pointer; display: inline-flex;
      align-items: center; gap: 0.4rem; box-shadow: 0 4px 12px rgba(79,142,247,0.3);
      font-family: 'Inter', sans-serif; transition: opacity 0.2s; margin-right: 0.5rem;
    `;
  btn.onmouseover = () => { btn.style.opacity = '0.85'; };
  btn.onmouseout = () => { btn.style.opacity = '1'; };
  btn.onclick = () => generateReport(labId);

  // Inject next to 'Mark Complete' in topbar if it exists
  const topBar = document.querySelector('.topbar');
  const completeBtn = document.getElementById('complete-btn');
  if (topBar && completeBtn) {
    topBar.insertBefore(btn, completeBtn);
  } else {
    // Fallback: fixed positioning above tutor button
    btn.style.position = 'fixed';
    btn.style.bottom = '5.5rem';
    btn.style.right = '1.5rem';
    btn.style.zIndex = '999';
    document.body.appendChild(btn);
  }
}

// ─────────────────────────────────────────────
// GRADING ENGINE
// ─────────────────────────────────────────────
  const BADGE_MAP = {
    '1': 'tvl_badge_connected',
    '2': 'tvl_badge_visualizer',
    '3': 'tvl_badge_calculator',
    '13': 'tvl_badge_publisher'
  };

function computeGrade(labId, rp, reflectText, isCompleted) {
  // Read exact marks from the XML Evaluator (already out of 100)
  const scoreEl = document.getElementById('scoreDisplay');
  let rubricScore = scoreEl ? (parseInt(scoreEl.textContent, 10) || 0) : 0;

  // Word-count based reflection scoring — mirrors Data Viz Lab pattern
  let reflectScore = 0;
  if (reflectText && reflectText !== 'No reflection recorded.') {
    const words = reflectText.trim().split(/\s+/).filter(w => w.length > 2).length;
    if (words > 15) reflectScore = 30;
    else if (words > 0) reflectScore = 15;
  }
  const reflectPass = reflectScore === 30;

  return { rubric: rubricScore, reflectPass: reflectPass, reflectScore: reflectScore, total: rubricScore };
}

async function generateReport(labId) {
  const studentRaw = localStorage.getItem('tvl_student') || localStorage.getItem('dvlab_student');
  if (!studentRaw) { alert("Please refresh the page to register your profile first."); return; }
  const student = JSON.parse(studentRaw);
  const lab = KB[labId];

  const rp = getRubricProgress(labId);
  const checksList = JSON.parse(localStorage.getItem(lab.rubricKey) || '[]');
  const reflectText = localStorage.getItem(lab.reflectKey) || 'No reflection recorded.';
  const completed = localStorage.getItem(lab.completeKey) === '1';

  // Try to pull explicit rubric strings from the page DOM
  const rubricTexts = [];
    for(let i=1; i<=rp.total; i++) {
        const checkEl = document.getElementById('check-'+i);
        if(checkEl) {
            rubricTexts.push(checkEl.querySelector('.check-title').textContent.trim());
        } else {
      rubricTexts.push('Requirement ' + i + ' successfully verified');
    }
  }

  const screenshot = localStorage.getItem('tvl_ss_' + labId);
  const challengeEl = document.querySelector('.challenge-q');
  let challengeHtml = '';
  if (challengeEl) {
    const challengeText = challengeEl.textContent.replace(/^"|"$/g, '').trim();
    challengeHtml = `
      <div class="section-title">Challenge Directive</div>
      <div class="challenge-block"><i>"${challengeText}"</i></div>
      `;
  }

  // Attempt to capture graphical evidence (Plotly & Canvases)
  const images = [];
  try {
    // Capture Plotly charts
    const plotlyDivs = document.querySelectorAll('.js-plotly-plot');
    if (window.Plotly && plotlyDivs.length > 0) {
      for (const el of plotlyDivs) {
        const url = await window.Plotly.toImage(el, { format: 'png', height: 400, width: 700 });
        images.push(url);
      }
    }

    // Capture standard canvas elements not owned by Plotly
    const canvases = document.querySelectorAll('canvas');
    for (const canvas of canvases) {
      if (canvas.closest('.js-plotly-plot')) continue;
      images.push(canvas.toDataURL('image/png'));
    }
  } catch (err) {
    console.warn("Could not capture all graphical evidence: ", err);
  }
  
  // Read multiple screenshots from JSON array
  let screenshots = [];
  try {
    const rawSS = localStorage.getItem('tvl_ss_' + labId);
    if (rawSS) screenshots = JSON.parse(rawSS);
  } catch(e) {}

  // Extract Experimental Steps from DOM
  const stepsTexts = [];
  const stepEls = document.querySelectorAll('.step-text');
  stepEls.forEach((el, i) => {
    stepsTexts.push(`<b>Step ${i + 1}:</b> ${el.innerHTML}`);
  });

  const stepsHtml = stepsTexts.length > 0 ? `
    <div class="section-title">Experimental Steps</div>
    <div style="margin-bottom: 2rem; font-size: 0.95rem; line-height: 1.6;">
      ${stepsTexts.map(t => `<div style="margin-bottom: 0.8rem; padding: 0.8rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">${t}</div>`).join('')}
    </div>
  ` : '';

  const rubricHtml = `
  <div class="section-title">Rubric Validation (${rp.checked}/${rp.total})</div>
  <div style="margin-bottom: 2rem;">
    ${rubricTexts.slice(0, rp.total).map((text, i) => {
      const checkId = 'check-' + (i + 1);
      const el = document.getElementById(checkId);
      let isPass = checksList.includes(checkId);
      if (el && el.classList.contains('pass')) isPass = true;
      return `<div class="rubric-item">
        <span class="box ${isPass ? 'checked' : ''}">[${isPass ? 'X' : ' '}]</span>
        <span>${text}</span>
      </div>`;
    }).join('')}
  </div>`;

  const ssHtml = screenshots.length > 0 ? `
    <div class="section-title">Visual Evidence</div>
    <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1rem; justify-content: center;">
      ${screenshots.map(src => `
        <div style="text-align:center; border:1px solid #eee; border-radius:8px; padding:10px; background:#fcfcfc; flex: 1 1 calc(50% - 1rem); min-width: 300px;">
          <img src="${src}" style="max-width:100%; max-height: 400px; border-radius:4px; box-shadow:0 4px 12px rgba(0,0,0,0.1)">
          <div style="font-size:0.75rem; color:#666; margin-top:8px; font-style:italic">Snapshot from student workspace</div>
        </div>
      `).join('')}
    </div>
  ` : `
    <div class="section-title">Visual Evidence</div>
    <div style="padding:20px; text-align:center; color:#999; border:2px dashed #eee; border-radius:8px; margin-top:1rem">
      No graphical evidence attached to this submission.
    </div>
  `;

  const d = new Date();
  const dateStr = d.toLocaleDateString() + ' at ' + d.toLocaleTimeString();

  let chartHtml = '';
  if (images.length > 0) {
    chartHtml = `
      <div class="section-title">Experimental Evidence (Live Snapshots)</div>
      <div class="evidence-grid">
        ${images.map(img => `<img src="${img}" class="evidence-img" alt="Experiment Snapshot">`).join('')}
      </div>`;
  }

  const grade = computeGrade(labId, rp, reflectText, completed);
  const gradeColor = grade.total >= 90 ? '#16a34a' : grade.total >= 70 ? '#f59e0b' : '#dc2626';
  const reflectStatus = grade.reflectPass ? '<span style="color:#16a34a">PASS</span>' : '<span style="color:#dc2626">FAIL</span>';

  const gradeHtml = `
    <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1.5rem; margin-bottom:2rem;">
      <div>
        <div style="font-size:0.85rem; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.2rem;">Final Evaluation Score</div>
        <div style="font-size:2.5rem; font-weight:800; color:${gradeColor}; line-height:1;">${grade.total}<span style="font-size:1.2rem; color:#94a3b8;">/100</span></div>
      </div>
      <div style="display:flex; gap:2rem; text-align:right;">
        <div>
          <div style="font-size:1.1rem; font-weight:700; color:#334155;">${grade.total}/100</div>
          <div style="font-size:0.75rem; color:#64748b;">XML Evaluation</div>
        </div>
        <div>
          <div style="font-size:1.1rem; font-weight:700; color:#334155;">${reflectStatus}</div>
          <div style="font-size:0.75rem; color:#64748b;">Reflection Status</div>
        </div>
      </div>
    </div>`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${student.reg}_Lab${labId}_Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono&display=swap');
    body { font-family: 'Inter', sans-serif; margin: 0; padding: 1in; color: #111; line-height: 1.6; background: #fff; max-width: 8.5in; margin: 0 auto; box-sizing: border-box; }
    @page { margin: 0.75in; size: letter; }
    .header { border-bottom: 2px solid #111; padding-bottom: 1rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: flex-end; }
    h1 { margin: 0 0 0.2rem; font-size: 1.8rem; font-weight: 800; letter-spacing: -0.02em; }
    .course-subtitle { font-size: 0.85rem; color: #555; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
    .student-info { text-align: right; }
    .student-name { font-size: 1.2rem; font-weight: 800; margin-bottom: 0.1rem; }
    .student-reg { font-family: 'JetBrains Mono', monospace; color: #444; font-size: 0.9rem; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; }
    .meta-table td { padding: 0.6rem 0.8rem; border: 1px solid #ddd; font-size: 0.9rem; }
    .meta-table td.label { font-weight: 600; background: #f4f4f5; width: 150px; color: #333; }
    .status-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 4px; font-weight: bold; font-size: 0.8rem; }
    .status-done { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .status-inc { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .section-title { font-size: 1.15rem; font-weight: 800; border-bottom: 1px solid #eee; padding-bottom: 0.3rem; margin: 2rem 0 1rem; color: #111; page-break-after: avoid; }
    
    .evidence-grid { margin-bottom: 2rem; display: flex; flex-direction: column; gap: 1rem; align-items: center; }
    .evidence-img { max-width: 100%; max-height: 400px; border: 1px solid #ddd; padding: 4px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    
    .challenge-block { font-size: 0.95rem; color: #d97706; background: #fffbeb; border-left: 4px solid #f59e0b; padding: 1rem 1.5rem; margin-bottom: 1.5rem; }
    
    .rubric-item { margin-bottom: 0.6rem; display: flex; gap: 0.75rem; align-items: flex-start; font-size: 0.95rem; }
    .box { font-family: 'JetBrains Mono', monospace; font-weight: bold; font-size: 1.1rem; line-height: 1; flex-shrink: 0; }
    .box.checked { color: #16a34a; }
    .reflection-block { background: #f8fafc; border-left: 4px solid #4f8ef7; padding: 1.25rem 1.75rem; font-style: italic; white-space: pre-wrap; margin-bottom: 2rem; font-size: 0.95rem; color: #334155; }
    .footer { margin-top: 3rem; text-align: center; font-size: 0.75rem; color: #888; border-top: 1px solid #eee; padding-top: 1rem; }
    @media print { body { padding: 0; max-width: none; } .header { margin-top: 0; } .evidence-img { page-break-inside: avoid; } }
  </style>
</head>
<body onload="setTimeout(() => window.print(), 500)">
  <div class="header">
    <div>
      <h1>Lab ${labId} Report: ${lab.title}</h1>
      <div class="course-subtitle">Data Visualization Virtual Curriculum</div>
    </div>
    <div class="student-info">
      <div class="student-name">${student.name}</div>
      <div class="student-reg">${student.reg}</div>
    </div>
  </div>

  ${gradeHtml}

  <table class="meta-table">
    <tr><td class="label">Unit</td><td>Unit ${lab.unit}</td></tr>
    <tr><td class="label">Objective</td><td>${lab.objective}</td></tr>
    <tr><td class="label">Timestamp</td><td>${dateStr}</td></tr>
    <tr><td class="label">Status</td><td><span class="status-badge ${completed ? 'status-done' : 'status-inc'}">${completed ? '✓ Completed' : '⚠ Incomplete'}</span></td></tr>
  </table>

  ${challengeHtml}
  
  ${stepsHtml}

  ${chartHtml}

  ${rubricHtml}

  ${ssHtml}

  <div class="section-title">Student Reflection Synthesis</div>
  <div class="reflection-block">${reflectText}</div>

  <div class="footer">
    Authored via Interactive Lab ${labId} &mdash; System Integrity Ver: ${Date.now().toString(36).toUpperCase()}<br>
    <em>Generated securely from local browser cache.</em>
  </div>
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert("Popup blocked! Please allow popups for this site to generate your report.");
    return;
  }
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

// ─────────────────────────────────────────────
// BOOT
// ─────────────────────────────────────────────
function boot() {
  requireStudentProfile();
  injectReportButton();
  buildUI();
  refreshBadge();
  setInterval(refreshBadge, 15000);
  setTimeout(() => nudge(1), 90000);
  // Second nudge at 5 min if rubric still at 0
  setTimeout(() => {
    if (ready) return;
    const labId = getLabId();
    if (!labId) return;
    const rp = getRubricProgress(labId);
    if (rp.checked === 0) nudge(2);
  }, 300000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

}) ();
