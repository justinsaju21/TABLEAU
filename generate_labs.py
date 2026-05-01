import os

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'labs')

LABS = [
  ('0','lab0.html','Orientation & Setup','Part 0','Install Tableau Public and VS Code, explore the Superstore dataset, and understand how the XML evaluator works.',
   [('check-1','Valid Workbook Submitted','xml !== null','4'),
    ('check-2','Superstore Datasource','TableauEvaluator.hasNode(xml,"datasource")','3'),
    ('check-3','Workbook Metadata Present','TableauEvaluator.hasNode(xml,"workbook")','3')],
   ['Install **Tableau Public** on your local machine.',
    'Download and open the **Sample Superstore** dataset.',
    'Explore the different fields in the Data Source tab.',
    'Save the file as a **.twb** (Tableau Workbook) and open it in **VS Code** to see the raw XML.',
    'Upload your .twb here to verify the evaluator detects the datasource nodes.']),

  ('1','lab1.html','Connecting and Preparing Data','Part 1','Connect to Superstore, rename fields, change datatypes, and inspect XML structure in VS Code.',
   [('check-1','Datasource Connected','TableauEvaluator.hasNode(xml,"datasource")','2'),
    ('check-2','Calculated Field (DATEDIFF)','TableauEvaluator.hasFormulaKeyword(xml,"DATEDIFF")','3'),
    ('check-3','Renamed Fields','TableauEvaluator.hasNode(xml,"column")','3'),
    ('check-4','Geographic Role Assigned','TableauEvaluator.hasDrillPath(xml,3)','2')],
   ['Connect to the Superstore Excel file in Tableau.',
    '**Rename** "Order ID" to "Transaction ID" and "Customer Name" to "Client Name".',
    'Change the **Data Type** of "Postal Code" to String (if it isn\'t already).',
    'Create a **Calculated Field** named "Shipping Time" using `DATEDIFF(\'day\', [Order Date], [Ship Date])`.',
    'Assign a **Geographic Role** (State/Province) to your location field.']),

  ('2','lab2.html','Basic Visualization and Formatting','Part 1','Create Bar, Line, and Scatter charts with proper labels and formatting.',
   [('check-1','3 Worksheets Present','xml.getElementsByTagName("worksheet").length >= 3','3'),
    ('check-2','Bar Chart Mark','TableauEvaluator.hasMarkType(xml,"Bar")','2'),
    ('check-3','Line Chart Mark','TableauEvaluator.hasMarkType(xml,"Line")','2'),
    ('check-4','Scatter Plot Mark','TableauEvaluator.hasMarkType(xml,"Circle")','2'),
    ('check-5','Labels Present','TableauEvaluator.hasNode(xml,"label")','1')],
   ['Create a **Bar Chart** showing Sales by Category.',
    'Create a **Line Chart** showing Profit over Time (Order Date).',
    'Create a **Scatter Plot** comparing Sales vs Profit, using Category on the Color card.',
    'Enable **Mark Labels** on all three charts.',
    'Format your axes to show **Currency** instead of standard numbers.']),

  ('3','lab3.html','Calculated Fields Laboratory','Part 1','Master Aggregate, Logical, String, and Number calculation types.',
   [('check-1','Aggregate Calc (SUM)','TableauEvaluator.hasFormulaKeyword(xml,"SUM")','2'),
    ('check-2','Logical Calc (IF)','TableauEvaluator.hasFormulaKeyword(xml,"IF","THEN","ELSE")','2'),
    ('check-3','String Calc (UPPER)','TableauEvaluator.hasFormulaKeyword(xml,"UPPER")','2'),
    ('check-4','Number Calc (ROUND)','TableauEvaluator.hasFormulaKeyword(xml,"ROUND")','2'),
    ('check-5','Dashboard 3 Sheets','TableauEvaluator.hasDashboardZones(xml,3)','2')],
   ['Create an **Aggregate Calculation**: `SUM([Profit]) / SUM([Sales])`.',
    'Create a **Logical Calculation**: `IF [Sales] > 1000 THEN "High" ELSE "Low" END`.',
    'Create a **String Calculation**: Use `UPPER([Customer Name])` to clean names.',
    'Create a **Number Calculation**: Use `ROUND([Profit], 2)` for precision.',
    'Build a **Dashboard** and drag these different calculation views onto it.']),

  ('4','lab4.html','Dashboard Development Studio','Part 1','Build a linked multi-sheet dashboard with Category and Region quick filters.',
   [('check-1','Dashboard Exists','TableauEvaluator.dashboardCount(xml) > 0','2'),
    ('check-2','3 Worksheets in Dashboard','TableauEvaluator.hasDashboardZones(xml,3)','3'),
    ('check-3','Category Filter','xml.getElementsByTagName("datasource-filter").length >= 1','2'),
    ('check-4','Region Filter','xml.getElementsByTagName("datasource-filter").length >= 2','2'),
    ('check-5','Title Text Object','TableauEvaluator.hasTextObject(xml)','1')],
   ['Create a new **Dashboard** layout.',
    'Drag three different worksheets into the layout.',
    'Add a **Quick Filter** for "Category" and set it to "Apply to all worksheets".',
    'Add a second filter for "Region".',
    'Insert a **Text Object** at the top and format it as a professional title.']),

  ('5','lab5.html','Filtering and Parameter Analytics','Part 2','Build a dynamic Top-N analysis using parameters and RANK calculated fields.',
   [('check-1','Parameter Node','TableauEvaluator.hasParameter(xml)','3'),
    ('check-2','RANK Calculated Field','TableauEvaluator.hasFormulaKeyword(xml,"RANK")','3'),
    ('check-3','Filter Present','TableauEvaluator.hasNode(xml,"filter")','2'),
    ('check-4','Dashboard Exists','TableauEvaluator.dashboardCount(xml) > 0','2')],
   ['Create a new **Parameter** named "Top N" (Integer type).',
    'Create a **RANK** calculation: `RANK(SUM([Sales]))`.',
    'Set up a filter where your Rank calculation is `<=` your "Top N" parameter.',
    'Show the **Parameter Control** on the sheet so you can change it dynamically.',
    'Add the view to a dashboard.']),

  ('6','lab6.html','Statistical Visualization Lab','Part 2','Build Histograms, Box Plots, Bubble Charts, and Treemaps.',
   [('check-1','Histogram (Bar)','TableauEvaluator.hasMarkType(xml,"Bar")','2'),
    ('check-2','Box Plot (Circle)','TableauEvaluator.hasMarkType(xml,"Circle")','2'),
    ('check-3','Size Encoding','TableauEvaluator.hasNode(xml,"size")','2'),
    ('check-4','Treemap (Square)','TableauEvaluator.hasMarkType(xml,"Square")','2'),
    ('check-5','Second Datasource','xml.getElementsByTagName("datasource").length >= 2','2')],
   ['Create a **Histogram** of Sales using the automatic binning feature.',
    'Build a **Box Plot** to show Profit distribution by Category.',
    'Create a **Treemap** using Category on Color and Sales on Size.',
    'Build a **Bubble Chart** using the Circle mark type.',
    'Connect to a **Second Datasource** (e.g., an external CSV) and use it in a view.']),

  ('7','lab7.html','Business Intelligence Chart Lab','Part 2','Build Pareto, Waterfall, Funnel, and Bump charts with business captions.',
   [('check-1','Dual Axis (Pareto)','xml.getElementsByTagName("pane").length >= 2','2'),
    ('check-2','RUNNING_SUM (Waterfall)','TableauEvaluator.hasFormulaKeyword(xml,"RUNNING_SUM")','2'),
    ('check-3','Funnel IF/ELSEIF','TableauEvaluator.hasFormulaKeyword(xml,"ELSEIF")','2'),
    ('check-4','RANK (Bump Chart)','TableauEvaluator.hasFormulaKeyword(xml,"RANK")','2'),
    ('check-5','Caption Text Objects','TableauEvaluator.hasTextObject(xml)','2')],
   ['Create a **Pareto Chart** using a Dual Axis for cumulative percentage.',
    'Build a **Waterfall Chart** using `RUNNING_SUM` on Profit.',
    'Create a **Funnel Chart** using an `IF/ELSEIF` logic to define stages.',
    'Create a **Bump Chart** to show the change in Rank over time.',
    'Add descriptive **Captions** to each worksheet explaining the business insight.']),

  ('8','lab8.html','Predictive Analytics and Forecasting','Part 2','Apply Tableau built-in trend lines, forecasting, and clustering features.',
   [('check-1','Trend Lines','TableauEvaluator.hasNode(xml,"trend-lines")','3'),
    ('check-2','Forecast Node','TableauEvaluator.hasNode(xml,"forecast")','3'),
    ('check-3','Cluster/Groups','xml.getElementsByTagName("group").length > 0','3'),
    ('check-4','Annotation Text','TableauEvaluator.hasTextObject(xml)','1')],
   ['Add a **Trend Line** to a scatter plot to identify correlations.',
    'Use the **Forecast** feature on a time-series chart.',
    'Apply **Clustering** to group similar data points automatically.',
    'Add an **Annotation** to a specific outlier or data point on your chart.',
    'Switch to the **Analytics Pane** to drag these features into your view.']),

  ('9','lab9.html','Data Types, Hierarchy, and Metadata','Part 3','Create field hierarchies, assign geographic roles, and document a Data Dictionary.',
   [('check-1','Drill Path Hierarchy','TableauEvaluator.hasDrillPath(xml,3)','3'),
    ('check-2','Map Worksheet','TableauEvaluator.hasMarkType(xml,"Map")','3'),
    ('check-3','Geographic Role','TableauEvaluator.hasNode(xml,"drill-path")','2'),
    ('check-4','Data Dictionary Dashboard','TableauEvaluator.hasTextObject(xml) && TableauEvaluator.dashboardCount(xml) > 0','2')],
   ['Create a **Hierarchy** for Product (Category -> Sub-Category -> Product Name).',
    'Assign **Geographic Roles** to State and City fields.',
    'Build a **Map Worksheet** and test the drill-down (+) capability.',
    'Create a **Dashboard** that serves as a **Data Dictionary**, explaining each field.',
    'Add **Default Properties -> Comments** to your fields for hover-over metadata.']),

  ('10','lab10.html','Extracts and Metadata Analysis','Part 3','Compare live vs extract connections and use DATEDIFF for shipping time.',
   [('check-1','Live Connection','TableauEvaluator.hasConnectionType(xml,"excel") || TableauEvaluator.hasConnectionType(xml,"textscan")','2'),
    ('check-2','Extract Connection','TableauEvaluator.hasConnectionType(xml,"hyper")','3'),
    ('check-3','Extract Filter Node','TableauEvaluator.hasNode(xml,"extract")','3'),
    ('check-4','DATEDIFF Calculation','TableauEvaluator.hasFormulaKeyword(xml,"DATEDIFF")','2')],
   ['Start with a **Live Connection** to your Excel file.',
    'Switch to an **Extract** connection and save the `.hyper` file.',
    'Add an **Extract Filter** to only include a specific year or region.',
    'Use **DATEDIFF** to create a calculation for shipping delay.',
    'Analyze the performance difference in the status bar.']),

  ('11','lab11.html','Geospatial Analytics Laboratory','Part 4','Build Filled Maps and Symbol Maps, and use MAKEPOINT/DISTANCE calculations.',
   [('check-1','Filled Map','TableauEvaluator.hasMarkType(xml,"Map")','3'),
    ('check-2','Symbol/Circle Map','TableauEvaluator.hasMarkType(xml,"Circle")','2'),
    ('check-3','DISTANCE and MAKEPOINT','TableauEvaluator.hasFormulaKeyword(xml,"DISTANCE","MAKEPOINT")','3'),
    ('check-4','Dashboard with Filter','TableauEvaluator.dashboardCount(xml) > 0','2')],
   ['Build a **Filled Map** (Choropleth) showing Profit by State.',
    'Create a **Symbol Map** using circles to show Sales by City.',
    'Use `MAKEPOINT` to create spatial points from Latitude and Longitude.',
    'Calculate the **DISTANCE** between two points using a spatial calculation.',
    'Create a dashboard that links the map to a bar chart via **Action Filters**.']),

  ('12','lab12.html','Performance Optimization Lab','Part 4','Compare workbooks before/after LOD optimization and extract migration.',
   [('check-1','FIXED LOD Expression','TableauEvaluator.hasFormulaKeyword(xml,"FIXED")','2'),
    ('check-2','INCLUDE LOD Expression','TableauEvaluator.hasFormulaKeyword(xml,"INCLUDE")','2'),
    ('check-3','EXCLUDE LOD Expression','TableauEvaluator.hasFormulaKeyword(xml,"EXCLUDE")','2'),
    ('check-4','Extract in After Version','TableauEvaluator.hasConnectionType(xml,"hyper")','2'),
    ('check-5','Optimization Notes Dashboard','TableauEvaluator.hasTextObject(xml)','2')],
   ['Create a **FIXED LOD** expression to find total sales per Region.',
    'Experiment with **INCLUDE** and **EXCLUDE** LODs to see how they react to filters.',
    'Convert your data connection to an **Extract** to speed up queries.',
    'Run the **Performance Recorder** (Help -> Settings -> Performance) and note the results.',
    'Create a dashboard text object summarizing your optimization findings.']),

  ('13','lab13.html','Publishing and Sharing Workflow','Part 5','Publish to Tableau Public and embed using the Tableau Embedding API v3.',
   [('check-1','Valid Workbook Submitted','xml !== null','3'),
    ('check-2','Dashboard Exists','TableauEvaluator.dashboardCount(xml) > 0','3'),
    ('check-3','Tableau Public URL','(document.getElementById("urlInput")&&document.getElementById("urlInput").value.includes("public.tableau.com"))','4')],
   ['Log into your **Tableau Public** account.',
    'Select **Server -> Tableau Public -> Save to Tableau Public**.',
    'Copy the **URL** of your published dashboard.',
    'Paste that URL into the input field here before uploading your workbook.',
    'Explore the "Share" options on the published page to see the embed code.']),

  ('14','lab14.html','Dashboard Iteration and Versioning','Part 5','Iterate on a published dashboard, add Ship Mode filter and worksheet annotation.',
   [('check-1','Color Encoding Present','TableauEvaluator.hasNode(xml,"color")','3'),
    ('check-2','Filter Added','TableauEvaluator.hasNode(xml,"filter")','3'),
    ('check-3','Annotation Present','TableauEvaluator.hasTextObject(xml)','2'),
    ('check-4','Version Log Dashboard','TableauEvaluator.dashboardCount(xml) >= 2','2')],
   ['Modify your existing dashboard by adding a new **Color encoding**.',
    'Add a new filter for **Ship Mode** and apply it to all sheets.',
    'Right-click a data point and select **Annotate -> Point** to add context.',
    'Create a new dashboard sheet named "Version Log" and list your changes.',
    'Re-publish the updated version to Tableau Public.']),

  ('15','lab15.html','Data Pipeline Integration (Bonus)','Part 5 — Optional','Generate a CSV with Python and build a live monitoring dashboard. Bonus +10 marks.',
   [('check-1','Valid Workbook','xml !== null','4'),
    ('check-2','Parameter for Sensor','TableauEvaluator.hasParameter(xml)','3'),
    ('check-3','Line Chart (Time Series)','TableauEvaluator.hasMarkType(xml,"Line")','3')],
   ['Use a script (Python/Excel) to generate a **CSV file** with time-stamped data.',
    'Connect Tableau to this CSV using a **Live Connection**.',
    'Build a **Time Series** line chart showing trends.',
    'Create a **Parameter** that allows you to toggle which metric is shown.',
    'Update the raw CSV and refresh Tableau to see the "live" update.']),
]

CAPSTONE = ('Cap','capstone.html','Complete BI Solution — Capstone','Capstone',
  'Build a full multi-dashboard BI solution meeting all 8 mandatory technical requirements. Total: 100 marks.',
  [('check-1','3+ Dashboards','TableauEvaluator.dashboardCount(xml) >= 3','15'),
   ('check-2','Parameter Control','TableauEvaluator.hasParameter(xml)','10'),
   ('check-3','Forecast Node','TableauEvaluator.hasNode(xml,"forecast")','10'),
   ('check-4','Trend Lines Node','TableauEvaluator.hasNode(xml,"trend-lines")','10'),
   ('check-5','Geographic Map','TableauEvaluator.hasMarkType(xml,"Map")','10'),
   ('check-6','LOD Expression','TableauEvaluator.hasFormulaKeyword(xml,"FIXED") || TableauEvaluator.hasFormulaKeyword(xml,"INCLUDE")','10'),
   ('check-7','Storytelling Captions','TableauEvaluator.hasTextObject(xml)','10'),
   ('check-8','Tableau Public URL','(document.getElementById("urlInput")&&document.getElementById("urlInput").value.includes("public.tableau.com"))','15')],
  ['Build at least **3 distinct dashboards** for a single dataset.',
   'Incorporate **Parameters** to allow user interaction.',
   'Include both **Forecasting** and **Trend Lines** for predictive analysis.',
   'Create a **Geographic Map** (Filled or Symbol).',
   'Use at least one **LOD Expression** (FIXED/INCLUDE/EXCLUDE).',
   'Add **Storytelling Captions** to guide the viewer through your insights.',
   'Publish the final project to **Tableau Public** and submit the link.'])


import re

def steps_html(steps):
    out = []
    for i, step in enumerate(steps, 1):
        step_fmt = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', step)
        out.append(f'<div class="step-item"><div class="step-num">{i}</div><div class="step-text">{step_fmt}</div></div>')
    return '\n'.join(out)


def checks_html(checks):
    out = []
    for cid, name, _, marks in checks:
        out.append(f'<div class="check-item" id="{cid}"><div class="check-icon">&#x23F3;</div><div><div class="check-title">{name}</div></div><div class="check-marks">{marks} marks</div></div>')
    return '\n'.join(out)


def checks_js(checks):
    lines = []
    for cid, name, fn, marks in checks:
        name_esc = name.replace('"', '\\"')
        lines.append(f'  {{id:"{cid}",name:"{name_esc}",marks:{marks},evalFn:(xml)=>!!({fn})}}')
    return ',\n'.join(lines)


def max_score(checks):
    return sum(int(c[3]) for c in checks)


URL_FIELD = '''<div style="margin-bottom:1rem">
  <label style="font-size:.82rem;color:var(--text-2);font-weight:600">Tableau Public URL (required for full marks):</label>
  <input id="urlInput" class="url-input" type="text" placeholder="https://public.tableau.com/views/...">
</div>'''

TMPL = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Exp {id} &mdash; {title} | Tableau VL</title>
<link rel="stylesheet" href="../css/style.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script src="../js/evaluator.js"></script>
<script src="../js/tutor.js"></script>
</head>
<body>
<div class="topbar">
  <a href="../index.html" class="back-btn">&larr; Curriculum</a>
  <span class="lab-badge">Exp {id}</span>
  <span class="topbar-title">{title}</span>
  <span class="difficulty-chip">{part}</span>
  <button class="complete-btn" id="complete-btn">Mark Complete &#x2713;</button>
</div>
<div class="page">
  <div class="objective-bar"><strong>Objective:</strong> {objective}</div>
  {url_field}
  <div class="main-grid">
    <div class="panel">
      <div class="panel-header">&#128221; Tasks</div>
      <div class="panel-body">
        <div class="info-box"><strong>Refer to your lab manual</strong> for the full step-by-step tasks, dataset download links, and deliverable specifications for this experiment. Complete all tasks, save your workbook, then upload it to the evaluator.</div>
        <div class="challenge-box" style="margin-top:1rem">
          <div class="challenge-title">&#127919; Submission Checklist</div>
          <div class="challenge-q">Before uploading: open your .twb in VS Code and verify the required XML nodes are present. The evaluator checks attribute values &mdash; not the visual output.</div>
        </div>
        <div class="section-label">Lab Instructions</div>
        <div class="steps-list">
{steps_content}
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-header">&#129514; XML Evaluator</div>
      <div class="panel-body">
        <div class="score-banner">
          <div>
            <div class="score-left">Auto-Evaluation Score</div>
            <div class="score-bar" style="width:160px;margin-top:.4rem"><div class="score-bar-fill" id="score-bar" style="width:0%"></div></div>
          </div>
          <div class="score-value"><span id="scoreDisplay">0</span>&thinsp;/&thinsp;{maxscore}</div>
        </div>
        <div class="eval-error" id="eval-error"></div>
        <div class="upload-zone" id="uploadZone">
          <div class="upload-icon">&#128196;</div>
          <div class="upload-title">Drop .twb / .twbx here</div>
          <div class="upload-sub">or click to browse &mdash; we read the XML, not screenshots</div>
          <div style="margin-top:.5rem;font-size:.73rem" id="file-label"></div>
          <input type="file" id="fileInput" style="display:none" accept=".twb,.twbx">
        </div>
        <div class="section-label" style="margin-top:1.5rem">Graphical Evidence</div>
        <div class="upload-zone" id="ssZone" style="height:140px;border-style:dashed;background:rgba(255,255,255,0.02)">
          <img id="ss-preview" style="display:none;width:100%;height:100%;object-fit:contain;border-radius:6px">
          <div id="ss-placeholder" style="text-align:center">
            <div class="upload-icon" style="font-size:1.4rem">📸</div>
            <div class="upload-title" style="font-size:0.8rem">Paste (Ctrl+V) or Upload Screenshot</div>
            <div class="upload-sub" style="font-size:0.65rem">Included in final report</div>
          </div>
          <input type="file" id="ssInput" style="display:none" accept="image/*">
        </div>
        <div class="check-list" id="resultsList" style="margin-top:1rem">
{checks_html}
        </div>
        <div style="margin-top:.75rem;display:flex;gap:.5rem;flex-wrap:wrap">
          <button class="btn export" id="export-btn">&#128229; Export Report</button>
        </div>
      </div>
    </div>
  </div>
  <div class="rubric-section">
    <div class="rubric-title">&#128221; Reflection (auto-saved)</div>
    <div class="reflection-area">
      <label for="reflection-text" style="font-size:.82rem;color:var(--text-2)">Write your observations and answers to the lab reflection questions:</label>
      <textarea id="reflection-text" placeholder="Describe what you learned, what surprised you, and how the XML changed after each step..."></textarea>
    </div>
    <div class="save-row">
      <button class="btn" id="save-btn">&#128190; Save</button>
      <button class="btn export" id="dl-btn">&#128228; Download Notes</button>
    </div>
  </div>
</div>
<div class="toast" id="toast"></div>
<script>
(function() {{
  var EID = '{id}';
  var TITLE = 'Exp {id} \u2014 {title}';

  var labChecks = [
{checks_js}
  ];

  function showToast(m, type) {{
    var t = document.getElementById('toast');
    t.textContent = m; t.className = 'toast show' + (type ? ' ' + type : '');
    clearTimeout(t._x); t._x = setTimeout(function() {{ t.classList.remove('show'); }}, 2800);
  }}

  var evaluator = new TableauEvaluator(labChecks, function(results, totalScore, maxScore) {{
    document.getElementById('scoreDisplay').textContent = totalScore;
    document.getElementById('score-bar').style.width = Math.round(totalScore / maxScore * 100) + '%';
    var allPass = true;
    results.forEach(function(r) {{
      var el = document.getElementById(r.id);
      if (el) {{
        el.className = 'check-item ' + (r.passed ? 'pass' : 'fail');
        el.querySelector('.check-icon').textContent = r.passed ? '\\u2705' : '\\u274C';
      }}
      if (!r.passed) allPass = false;
    }});
    if (allPass) {{
      localStorage.setItem('tvl_complete_' + EID, '1');
      // Set Badge Achievement if this lab has one
      const badges = {{ '1': 'tvl_badge_connected', '2': 'tvl_badge_visualizer', '3': 'tvl_badge_calculator', '13': 'tvl_badge_publisher' }};
      if (badges[EID]) localStorage.setItem(badges[EID], '1');

      var btn = document.getElementById('complete-btn');
      btn.classList.add('done'); btn.textContent = '\u2713 Completed!';
      showToast('Exp ' + EID + ' Complete! 🥳');
    }}
  }});

  setupUploadZone('uploadZone', 'fileInput', evaluator);

  // --- Screenshot Handler ---
  const ssZone = document.getElementById('ssZone');
  const ssInput = document.getElementById('ssInput');
  const ssPreview = document.getElementById('ss-preview');
  const ssPlaceholder = document.getElementById('ss-placeholder');
  const saveSS = (base64) => {{
    localStorage.setItem('tvl_ss_' + EID, base64);
    ssPreview.src = base64; ssPreview.style.display = 'block'; ssPlaceholder.style.display = 'none';
    showToast('Screenshot Captured! 📸');
  }};
  const processImg = (file) => {{
    const reader = new FileReader();
    reader.onload = (e) => {{
      const img = new Image();
      img.onload = () => {{
        const canvas = document.createElement('canvas');
        const MAX_W = 1000;
        let w = img.width, h = img.height;
        if (w > MAX_W) {{ h *= MAX_W / w; w = MAX_W; }}
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        saveSS(canvas.toDataURL('image/jpeg', 0.7));
      }};
      img.src = e.target.result;
    }};
    reader.readAsDataURL(file);
  }};
  ssZone.addEventListener('click', () => ssInput.click());
  ssInput.addEventListener('change', (e) => {{ if (e.target.files[0]) processImg(e.target.files[0]); }});
  document.addEventListener('paste', (e) => {{
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (let i = 0; i < items.length; i++) {{
      if (items[i].type.indexOf('image') !== -1) {{
        processImg(items[i].getAsFile()); break;
      }}
    }}
  }});
  const savedSS = localStorage.getItem('tvl_ss_' + EID);
  if (savedSS) {{ ssPreview.src = savedSS; ssPreview.style.display = 'block'; ssPlaceholder.style.display = 'none'; }}

  document.getElementById('export-btn').addEventListener('click', function() {{
    evaluator.exportReport(TITLE);
  }});

  document.getElementById('save-btn').addEventListener('click', function() {{
    localStorage.setItem('tvl_reflect_' + EID, document.getElementById('reflection-text').value);
    showToast('Saved \\u2713');
  }});
  document.getElementById('reflection-text').addEventListener('input', function() {{
    localStorage.setItem('tvl_reflect_' + EID, this.value);
  }});
  document.getElementById('dl-btn').addEventListener('click', function() {{
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([document.getElementById('reflection-text').value], {{type: 'text/plain'}}));
    a.download = 'tableau_exp{id}_notes.txt'; a.click();
  }});
  document.getElementById('complete-btn').addEventListener('click', function() {{
    localStorage.setItem('tvl_complete_' + EID, '1');
    const badges = {{ '1': 'tvl_badge_connected', '2': 'tvl_badge_visualizer', '3': 'tvl_badge_calculator', '13': 'tvl_badge_publisher' }};
    if (badges[EID]) localStorage.setItem(badges[EID], '1');
    this.classList.add('done'); this.textContent = '\u2713 Completed!';
    showToast('Exp ' + EID + ' marked complete! ✅');
  }});

  // Load saved state
  var saved = localStorage.getItem('tvl_reflect_' + EID);
  if (saved) document.getElementById('reflection-text').value = saved;
  if (localStorage.getItem('tvl_complete_' + EID) === '1') {{
    document.getElementById('complete-btn').classList.add('done');
    document.getElementById('complete-btn').textContent = '\u2713 Completed!';
  }}
}})();
</script>
</body>
</html>
'''


def gen(lab_id, file, title, part, objective, checks, steps, add_url=False):
    path = os.path.join(BASE, file)

    html = TMPL.format(
        id=lab_id,
        title=title,
        part=part,
        objective=objective,
        maxscore=max_score(checks),
        steps_content=steps_html(steps),
        checks_html=checks_html(checks),
        checks_js=checks_js(checks),
        url_field=URL_FIELD if add_url else ''
    )
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'  OK  {file}')


print('Generating labs...')
for lab in LABS:
    add_url = lab[0] in ('13', '14', '15')
    gen(lab[0], lab[1], lab[2], lab[3], lab[4], lab[5], lab[6], add_url)

gen(CAPSTONE[0], CAPSTONE[1], CAPSTONE[2], CAPSTONE[3], CAPSTONE[4], CAPSTONE[5], CAPSTONE[6], True)
print('All done.')
