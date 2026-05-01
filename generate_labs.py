import os

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'labs')

LABS = [
  ('0','lab0.html','Orientation & Setup','Part 0','Install Tableau Public and VS Code, explore the Superstore dataset, and understand how the XML evaluator works.',
   [('check-1','Valid Workbook Submitted','xml !== null','34'),
    ('check-2','Superstore Datasource','TableauEvaluator.hasNode(xml,"datasource")','33'),
    ('check-3','Workbook Metadata Present','TableauEvaluator.hasNode(xml,"workbook")','33')],
    ['Go to **www.tableau.com/products/desktop-free/download**, create a free account, and install Tableau Public on your computer. During installation accept all defaults. Launch the application once installation completes.',
     'Go to **www.tableau.com/data-insights/dashboard-showcase/superstore** to see the final potential of the dataset. For our labs, however, open Tableau and select **File > New** to start a blank workspace. On the start screen, click the **Connect to Data** button (top left), select **To a File > Microsoft Excel**, and browse to your `Documents > My Tableau Repository > Datasources` folder to find **Sample - Superstore.xlsx**.',
     'In the **Data Source tab** (bottom left), ensure the **Orders** sheet is dragged onto the canvas area. Notice how Tableau displays field names, data types (Abc, #, calendar icon), and row counts in the preview grid. This metadata is what the XML evaluator reads.',
     'Click **Sheet 1** at the bottom to open the worksheet view. Spend a few minutes dragging fields to Rows and Columns shelves. Drag **Category** to Columns, **Sales** to Rows — Tableau auto-creates a bar chart. Click the **T icon** in the top toolbar to show labels. Undo after exploring.',
     'Go to **File > Save As (Local)**. Choose a folder you control, name the file "Exp0_Setup.twb", and **IMPORTANT**: Ensure you select ".twb" (not .twbx) in the save type dropdown. Open the saved file in VS Code to see the XML structure, then upload the .twb file here.']),

  ('1','lab1.html','Connecting and Preparing Data','Part 1','Connect to Superstore, rename fields, change datatypes, and inspect XML structure in VS Code.',
   [('check-1','Datasource Connected','TableauEvaluator.hasNode(xml,"datasource")','25'),
    ('check-2','Calculated Field (DATEDIFF)','TableauEvaluator.hasFormulaKeyword(xml,"DATEDIFF")','25'),
    ('check-3','Renamed Fields','TableauEvaluator.hasRenamedField(xml,"Transaction ID") || TableauEvaluator.hasRenamedField(xml,"Client Name")','25'),
    ('check-4','Geographic Hierarchy Created','TableauEvaluator.hasDrillPath(xml,3)','25')],
   ['Open Tableau, click **Microsoft Excel** under Connect, and browse to your Superstore file. Drag the **Orders** sheet onto the canvas. Verify you see a green tick on the data source name and a preview of rows in the lower pane.',
     'In the **Data Source tab**, right-click **Order ID** in the field list and choose **Rename**. Type "Transaction ID" and press Enter. Repeat for **Customer Name** — rename it to "Client Name". You will see the column headers update immediately in the preview grid.',
     'Find **Postal Code** in the field list. Its icon will show **#** (Number). Right-click it, go to **Change Data Type > String**. The icon changes to **Abc**. This is critical — ZIP codes must be strings to avoid arithmetic operations.',
     'Navigate to a blank worksheet (Sheet 1). Right-click any empty space in the **Data pane** and select **Create Calculated Field**. In the dialog name it "Shipping Time" and enter the formula: `DATEDIFF(\'day\', [Order Date], [Ship Date])`. Click OK. The new field appears in the Measures pane.',
     'In the **Data pane**, select **Country/Region**, **State/Province**, and **City** by holding Ctrl (or Cmd) while clicking them. Right-click the selection, choose **Hierarchy > Create Hierarchy**, and name it "Location". A hierarchy structure will appear, allowing you to drill down in maps! Save the workbook as "Exp1_Data.twb" and upload it here.']),

  ('2','lab2.html','Basic Visualization and Formatting','Part 1','Create Bar, Line, and Scatter charts with proper labels and formatting.',
   [('check-1','3 Worksheets Present','xml.getElementsByTagName("worksheet").length >= 3','20'),
    ('check-2','Bar Chart Mark','TableauEvaluator.hasMarkType(xml,"Bar")','20'),
    ('check-3','Line Chart Mark','TableauEvaluator.hasMarkType(xml,"Line")','20'),
    ('check-4','Scatter Plot Mark','TableauEvaluator.hasMarkType(xml,"Circle")','20'),
    ('check-5','Labels Present','TableauEvaluator.hasNode(xml,"label")','20')],
   ['**Bar Chart:** Click Sheet 1. Drag **Category** to Columns and **Sales** to Rows — Tableau creates a bar chart automatically. Right-click the sheet tab and rename it "Sales by Category". Click the **Color** button on the Marks card and choose a palette you like.',
     '**Line Chart:** Right-click a sheet tab at the bottom and add a new sheet (Sheet 2). Drag **Order Date** to Columns (Tableau will group by Year — click the pill and change to Month/Year via More > Month(Order Date)). Drag **Profit** to Rows. Tableau should show a line chart. If not, click the **Line** mark type in the Marks card dropdown.',
     '**Scatter Plot:** Add Sheet 3. Drag **Sales** to Columns and **Profit** to Rows. Tableau plots one aggregate point. To see individual marks, drag **Order ID** to the Detail card on the Marks card. Then drag **Category** to the **Color** card — you will see three color-coded clusters. Change mark type to **Circle** if not already set.',
     'On each sheet, click the **Show Mark Labels** button (the "T" icon in the toolbar) to add data labels to all marks. Labels appear automatically on bars, the line, and scatter points.',
     'On the Bar Chart, right-click the **Sales axis** and choose **Format**. In the Format pane go to **Numbers > Currency (Standard)**. Repeat for the Profit axis on the Line Chart. Save as "Exp2_Viz.twb" and upload.']),

  ('3','lab3.html','Calculated Fields Laboratory','Part 1','Master Aggregate, Logical, String, and Number calculation types.',
   [('check-1','Aggregate Calc (SUM)','TableauEvaluator.hasFormulaKeyword(xml,"SUM")','20'),
    ('check-2','Logical Calc (IF)','TableauEvaluator.hasFormulaKeyword(xml,"IF","THEN","ELSE")','20'),
    ('check-3','String Calc (UPPER)','TableauEvaluator.hasFormulaKeyword(xml,"UPPER")','20'),
    ('check-4','Number Calc (ROUND)','TableauEvaluator.hasFormulaKeyword(xml,"ROUND")','20'),
    ('check-5','Dashboard 3 Sheets','TableauEvaluator.hasDashboardZones(xml,3)','20')],
   ['**Aggregate Calc:** Right-click in the Data pane, choose Create Calculated Field. Name it "Profit Margin" and enter: `SUM([Profit]) / SUM([Sales])`. Click OK. Drag it to Rows on Sheet 1 alongside Sales. Right-click the Profit Margin axis, choose Format > Numbers > Percentage to display it as a %.',
     '**Logical Calc:** Create a new calculated field named "Sales Tier" with formula: `IF [Sales] > 1000 THEN "High" ELSEIF [Sales] > 500 THEN "Medium" ELSE "Low" END`. Drag this to the **Color** card on a bar chart — Tableau will color bars by tier automatically. This is a row-level calculation, not an aggregate.',
     '**String Calc:** Create a field named "Clean Name" with formula: `UPPER([Customer Name])`. Drag it to a new sheet as a dimension. You can also try `LEFT([Customer Name], FIND([Customer Name], " ")-1)` to extract first names only. Observe results in the view.',
     '**Number Calc:** Create a field named "Rounded Profit" with: `ROUND([Profit], 2)`. Add it to the Rows shelf alongside [Profit] on a text table — compare original vs rounded values using **Show Me > Text Table**.',
     '**Dashboard:** Click the **New Dashboard** button (grid icon at the bottom). Set the size to Automatic. Drag Sheet 1, Sheet 2, and Sheet 3 from the left panel onto the dashboard canvas. Use the **Layout** pane on the left to tile them. Save as "Exp3_Calcs.twb" and upload.']),

  ('4','lab4.html','Dashboard Development Studio','Part 1','Build a linked multi-sheet dashboard with Category and Region quick filters.',
   [('check-1','Dashboard Exists','TableauEvaluator.dashboardCount(xml) > 0','20'),
    ('check-2','3 Worksheets in Dashboard','TableauEvaluator.hasDashboardZones(xml,3)','20'),
    ('check-3','Category Filter','xml.getElementsByTagName("datasource-filter").length >= 1','20'),
    ('check-4','Region Filter','xml.getElementsByTagName("datasource-filter").length >= 2','20'),
    ('check-5','Title Text Object','TableauEvaluator.hasTextObject(xml)','20')],
   ['Click the **New Dashboard** icon (grid icon) at the bottom of the screen. In the Dashboard pane on the left, under **Size**, choose **Automatic** so it adapts to any screen. Switch the layout container from Tiled to Floating if you prefer free placement.',
     'From the Sheets list on the left, drag your **Sales by Category** sheet to the top half of the canvas. Then drag a **Line Chart** (Profit over Time) to the bottom-left and a **Scatter Plot** to the bottom-right. Arrange them using the blue guide lines that appear during drag.',
     'On the bar chart (Sales by Category), click the **Category** pill in the Filters shelf (or right-click **Category** in the Data pane and choose **Add to Context**). On the filter card that appears in the dashboard, click the dropdown arrow and select **Apply to Worksheets > All Using This Data Source**.',
     'Do the same for the **Region** field — drag it to the Filters shelf in any sheet, show the filter card on the dashboard, and set it to apply to all worksheets. Now test it: selecting a region should filter all three charts simultaneously.',
     'From the **Objects** panel at the bottom-left of the Dashboard pane, drag a **Text** object to the very top of the dashboard. Double-click it and type your dashboard title (e.g., "Superstore Sales Dashboard"). Use the formatting toolbar to set font size 20, bold, center-aligned. Save as "Exp4_Dashboard.twb" and upload.']),

  ('5','lab5.html','Filtering and Parameter Analytics','Part 2','Build a dynamic Top-N analysis using parameters and RANK calculated fields.',
   [('check-1','Parameter Node','TableauEvaluator.hasParameter(xml)','25'),
    ('check-2','RANK Calculated Field','TableauEvaluator.hasFormulaKeyword(xml,"RANK")','25'),
    ('check-3','Filter Present','TableauEvaluator.hasNode(xml,"filter")','25'),
    ('check-4','Dashboard Exists','TableauEvaluator.dashboardCount(xml) > 0','25')],
   ['In the Data pane, right-click and choose **Create Parameter**. Name it "Top N". Set **Data type: Integer**, **Current value: 5**, **Allowable values: Range**, Min 1, Max 20, Step 1. Click OK. The parameter now appears at the bottom of the Data pane.',
     'Create a calculated field named "Rank by Sales" with the formula: `RANK(SUM([Sales]))`. This is a Table Calculation — it ranks rows relative to each other in the view. Drag **Sub-Category** to Rows and **SUM(Sales)** to Columns to build a bar chart first.',
     'Drag **Rank by Sales** to the Filters shelf. In the filter dialog, choose **At most** and set the value to **[Top N]** (type it or use the parameter option). Alternatively, set filter range 1 to [Top N]. Click **Compute Using > Sub-Category** so it ranks within the table.',
     'Right-click the **Top N** parameter in the Data pane and choose **Show Parameter Control**. A slider appears on the sheet. Change the slider from 5 to 10 — the bar chart should dynamically update to show only the top N sub-categories.',
     'Create a dashboard, drag this sheet in, and also drag a **Highlight Table** showing the complete sales breakdown for context. Save as "Exp5_Parameters.twb" and upload.']),

  ('6','lab6.html','Statistical Visualization Lab','Part 2','Build Histograms, Box Plots, Bubble Charts, and Treemaps.',
   [('check-1','Histogram (Bar)','TableauEvaluator.hasMarkType(xml,"Bar")','20'),
    ('check-2','Box Plot (Circle)','TableauEvaluator.hasMarkType(xml,"Circle")','20'),
    ('check-3','Size Encoding','TableauEvaluator.hasNode(xml,"size")','20'),
    ('check-4','Treemap (Square)','TableauEvaluator.hasMarkType(xml,"Square")','20'),
    ('check-5','Second Datasource','xml.getElementsByTagName("datasource").length >= 2','20')],
   ['**Histogram:** On a new sheet, drag **Sales** to Columns. Tableau creates a horizontal axis. Right-click the **Sales** pill and choose **Dimension** (not Measure). Then go to **Show Me** and select **Histogram**. Tableau will auto-create bins. Right-click the **Sales (bin)** field in the Data pane and choose **Edit** to change bin size (try 500). Observe the distribution.',
     '**Box Plot:** New sheet — drag **Category** to Columns and **Profit** to Rows. In the **Show Me** panel select **Box-and-Whisker Plot**. Tableau distributes individual profit values and draws the median, quartiles, and whiskers. Right-click any outlier circle and choose **Annotate > Mark** to label it.',
     '**Treemap:** New sheet — from **Show Me** select **Treemap**. Drag **Category** to the **Color** card and **Sales** to the **Size** card. Drag **Sub-Category** to the **Label** card so each rectangle shows its name. The largest rectangles represent highest sales.',
     '**Bubble Chart:** New sheet — drag **Sub-Category** to Detail, **Sales** to Size, **Profit** to Color, and **Sub-Category** to Label. In the Marks card dropdown select **Circle**. You now have a bubble chart where bubble size = Sales and color = Profit (red = loss, blue = profit).',
     '**Second Datasource:** In the Data menu choose **New Data Source**. Connect to a simple CSV (e.g., a US state population CSV from data.gov). A second datasource appears in the Data pane. Create a new sheet using fields from this second source, then save the workbook as "Exp6_Stats.twb" and upload.']),

  ('7','lab7.html','Business Intelligence Chart Lab','Part 2','Build Pareto, Waterfall, Funnel, and Bump charts with business captions.',
   [('check-1','Dual Axis (Pareto)','xml.getElementsByTagName("pane").length >= 2','20'),
    ('check-2','RUNNING_SUM (Waterfall)','TableauEvaluator.hasFormulaKeyword(xml,"RUNNING_SUM")','20'),
    ('check-3','Funnel IF/ELSEIF','TableauEvaluator.hasFormulaKeyword(xml,"ELSEIF")','20'),
    ('check-4','RANK (Bump Chart)','TableauEvaluator.hasFormulaKeyword(xml,"RANK")','20'),
    ('check-5','Caption Text Objects','TableauEvaluator.hasTextObject(xml)','20')],
   ['**Pareto Chart:** Drag Sub-Category to Columns, SUM(Sales) to Rows. Sort descending. Duplicate SUM(Sales) on Rows (Ctrl+drag). Right-click the second pill > **Add Table Calculation > Running Total**, then Add Secondary Calculation: **Percent of Total**. Right-click the second axis > **Dual Axis > Synchronize Axis**. Change the second mark type to **Line**. You now have bars + cumulative % line.',
     '**Waterfall Chart:** New sheet — drag **Sub-Category** to Columns, **Profit** to Rows. Change mark type to **Gantt Bar**. Create a calculated field: `Negative Profit = -SUM([Profit])`. Drag it to the **Size** card. Right-click **SUM(Profit)** on Rows, choose **Add Table Calculation > Running Total**. The bars now cascade like a waterfall.',
     '**Funnel Chart:** Create a calculated field "Stage" with: `IF [Sales]>5000 THEN "Large" ELSEIF [Sales]>1000 THEN "Medium" ELSEIF [Sales]>200 THEN "Small" ELSE "Micro" END`. Drag Stage to Rows, COUNT([Order ID]) to Columns. Sort rows by stage size descending. Narrow the bars using the Size slider to create a funnel shape.',
     '**Bump Chart:** New sheet — drag **Order Date** (as discrete Year) to Columns, **Category** to Rows and also Color. Create field: `Rank = RANK(SUM([Sales]))`. Add it to Rows. Set Table Calculation to Compute Using: Category. Change mark type to **Circle** and also add **Line** as a dual mark. The result shows rank position changing each year.',
     'On each worksheet, go to **Worksheet > Show Caption**. Double-click the caption box at the bottom of each chart and type a 1–2 sentence business insight (e.g., "Technology leads in sales but Office Supplies drives volume."). Save as "Exp7_BI.twb" and upload.']),

  ('8','lab8.html','Predictive Analytics and Forecasting','Part 2','Apply Tableau built-in trend lines, forecasting, and clustering features.',
   [('check-1','Trend Lines','TableauEvaluator.hasNode(xml,"trend-lines")','25'),
    ('check-2','Forecast Node','TableauEvaluator.hasNode(xml,"forecast")','25'),
    ('check-3','Cluster/Groups','xml.getElementsByTagName("group").length > 0','25'),
    ('check-4','Annotation Text','TableauEvaluator.hasTextObject(xml)','25')],
   ['**Trend Lines:** Build a Scatter Plot with Sales on Columns and Profit on Rows, Sub-Category on Detail. Go to the **Analytics pane** (the tab next to Data on the left). Drag **Trend Line** to the view and drop it on **Linear**. Tableau draws one trend line per color group. Right-click the trend line > **Edit Trend Lines** to see R-squared and p-value, which indicate statistical significance.',
     '**Forecast:** Create a Line Chart with Order Date (Month/Year, continuous) on Columns and SUM(Sales) on Rows. In the **Analytics pane**, drag **Forecast** to the view. Tableau adds a grey shaded prediction cone extending past your last data point. Right-click the forecast > **Forecast Options** to change model type (Automatic, Additive, Multiplicative) and prediction length.',
     '**Clustering:** On a Scatter Plot (Sales vs Profit), go to the **Analytics pane** and drag **Cluster** to the view. A dialog asks for number of clusters (try 3). Tableau colors the marks by cluster. Right-click the **Cluster** pill in the Marks card > **Describe Clusters** to see the cluster centroids and statistics.',
     '**Annotation:** Right-click any extreme outlier point on a scatter plot, choose **Annotate > Mark**. In the annotation editor type a custom label like "Q4 2023 Peak — Holiday Demand Spike". Drag the annotation box to avoid overlap. Annotations are saved in the XML as `<annotation>` nodes.',
     'Combine all three sheets (Trend Lines, Forecast, Clustering) into a dashboard. Save as "Exp8_Predictive.twb" and upload.']),

  ('9','lab9.html','Data Types, Hierarchy, and Metadata','Part 3','Create field hierarchies, assign geographic roles, and document a Data Dictionary.',
   [('check-1','Drill Path Hierarchy','TableauEvaluator.hasDrillPath(xml,3)','25'),
    ('check-2','Map Worksheet','TableauEvaluator.hasMarkType(xml,"Map")','25'),
    ('check-3','Geographic Role','TableauEvaluator.hasNode(xml,"drill-path")','25'),
    ('check-4','Data Dictionary Dashboard','TableauEvaluator.hasTextObject(xml) && TableauEvaluator.dashboardCount(xml) > 0','25')],
   ['**Hierarchy:** In the Data pane, drag **Sub-Category** and drop it directly on top of **Category** — Tableau creates a hierarchy and asks you to name it (type "Product"). Then drag **Product Name** into the hierarchy below Sub-Category. You now have a 3-level drill path: Category > Sub-Category > Product Name.',
     '**Geographic Roles:** Right-click **State** in the Data pane > Geographic Role > State/Province. Right-click **City** > Geographic Role > City. Both fields now show a globe icon. These roles allow Tableau to geocode the data and plot it on a map automatically.',
     '**Map Worksheet:** Drag **State** to the view — Tableau auto-generates a filled map. Click the (+) drill button on the State pill in the view to drill down to City. You should see circles appear for individual cities. Right-click a state and choose **View Data** to see the underlying rows. This is the drill-down capability.',
     '**Data Dictionary Dashboard:** Create a new dashboard. From the Objects panel, drag a **Text** object to the canvas. Double-click it and type a table listing each key field, its data type, and what it means (e.g., "Order ID — String — Unique transaction identifier"). Format using the built-in rich text tools. This becomes your workbook documentation.',
     'Right-click any field in the Data pane > **Default Properties > Comment**. Type a description. This comment appears as a tooltip when users hover over the field name in the view. Do this for at least 3 fields. Save as "Exp9_Hierarchy.twb" and upload.']),

  ('10','lab10.html','Extracts and Metadata Analysis','Part 3','Compare live vs extract connections and use DATEDIFF for shipping time.',
   [('check-1','Live Connection','TableauEvaluator.hasConnectionType(xml,"excel") || TableauEvaluator.hasConnectionType(xml,"textscan")','25'),
    ('check-2','Extract Connection','TableauEvaluator.hasConnectionType(xml,"hyper")','25'),
    ('check-3','Extract Filter Node','TableauEvaluator.hasNode(xml,"extract")','25'),
    ('check-4','DATEDIFF Calculation','TableauEvaluator.hasFormulaKeyword(xml,"DATEDIFF")','25')],
   ['In a new workbook, connect to the Superstore Excel file and verify the connection icon shows **Live** (no extract indicator). Note the loading speed when you interact with the view — this is your baseline. Go to the **Data Source tab** and check the connection type (should show excel-direct).',
     'To switch to an Extract, click the **Extract** radio button in the top-right of the Data Source tab. Click **Edit** to choose which tables to extract, then click **Save**. Tableau prompts you to save the extract file (.hyper) — choose a location. The icon in the Data pane changes to a cylinder, indicating extract.',
     'With the extract connection active, go to **Data > Extract > Edit Extract Filter**. Click **Add** and set a filter: e.g., Order Date Year = 2022. This limits the extract to only 2022 data, which reduces file size and speeds up queries significantly.',
     'Go to Sheet 1. In the Data pane, create a calculated field "Shipping Delay" with: `DATEDIFF(\'day\', [Order Date], [Ship Date])`. Drag it to Rows alongside a bar chart of Categories. Now you can see average shipping delay per category.',
     'Go to **Help > Settings and Performance > Start Performance Recording**. Click around the view, filter, and drill down. Then stop recording. Tableau opens a performance workbook showing query times. Note which queries were slowest — include this observation in your reflection. Save as "Exp10_Extract.twb" and upload.']),

  ('11','lab11.html','Geospatial Analytics Laboratory','Part 4','Build Filled Maps and Symbol Maps, and use MAKEPOINT/DISTANCE calculations.',
   [('check-1','Filled Map','TableauEvaluator.hasMarkType(xml,"Map")','25'),
    ('check-2','Symbol/Circle Map','TableauEvaluator.hasMarkType(xml,"Circle")','25'),
    ('check-3','DISTANCE and MAKEPOINT','TableauEvaluator.hasFormulaKeyword(xml,"DISTANCE","MAKEPOINT")','25'),
    ('check-4','Dashboard with Filter','TableauEvaluator.dashboardCount(xml) > 0','25')],
   ['**Filled Map:** Drag **State** to the view — Tableau auto-creates a filled map. Drag **Profit** to the **Color** card. Tableau shades each state from red (loss) to blue (profit). Click **Color > Edit Colors** to change the palette. Right-click the map background and choose **Map Layers** to toggle on/off terrain, roads, and county borders.',
     '**Symbol Map:** Add a new sheet. Drag **City** to the view — Tableau plots circles. Drag **Sales** to the **Size** card so larger cities show bigger circles. Drag **Category** to **Color** to see the dominant sales category per city. Change mark type to **Circle** if needed.',
     '**MAKEPOINT:** Create a calculated field named "Location" with: `MAKEPOINT([Latitude], [Longitude])`. (First add Latitude and Longitude fields — Tableau auto-generates them from geocoding. Find them under **Measures > Latitude** and **Longitude** generated fields.) Drag Location to the view — it acts as a spatial point.',
     '**DISTANCE:** Create a field "Distance to Chicago" with: `DISTANCE(MAKEPOINT([Latitude],[Longitude]), MAKEPOINT(41.8781,-87.6298), "mi")`. This calculates the distance from each city to Chicago in miles. Drag it to Color or Size to visualize proximity.',
     'Build a dashboard with the Filled Map on the left and a Bar Chart (Sales by State) on the right. Go to the map sheet > **Worksheet > Actions > Add Action > Filter**. Set source sheet = map, target = bar chart. Now clicking a state on the map filters the bar. Save as "Exp11_Geo.twb" and upload.']),

  ('12','lab12.html','Performance Optimization Lab','Part 4','Compare workbooks before/after LOD optimization and extract migration.',
   [('check-1','FIXED LOD Expression','TableauEvaluator.hasFormulaKeyword(xml,"FIXED")','20'),
    ('check-2','INCLUDE LOD Expression','TableauEvaluator.hasFormulaKeyword(xml,"INCLUDE")','20'),
    ('check-3','EXCLUDE LOD Expression','TableauEvaluator.hasFormulaKeyword(xml,"EXCLUDE")','20'),
    ('check-4','Extract in After Version','TableauEvaluator.hasConnectionType(xml,"hyper")','20'),
    ('check-5','Optimization Notes Dashboard','TableauEvaluator.hasTextObject(xml)','20')],
   ['**FIXED LOD:** Create a calculated field "Total Sales by Region" with: `{{FIXED [Region] : SUM([Sales])}}`. Drag it to the view alongside Region and SUM(Sales). Notice that FIXED ignores any dimension filters you have (except context filters) — it always computes at the Region level regardless of what else is on the shelf.',
     '**INCLUDE LOD:** Create field "Avg Order Sales" with: `{{INCLUDE [Order ID] : SUM([Sales])}}`. Drag it to a view with Customer Segment on Rows. This includes Order ID in the computation even if it is not in the view, giving average sales per order per segment — finer granularity than just SUM(Sales)/COUNT(Orders).',
     '**EXCLUDE LOD:** Create field "Profit Ex-Category" with: `{{EXCLUDE [Category] : SUM([Profit])}}`. Add it to a view that has Category on Rows. This gives the total profit across all categories, ignoring the Category dimension in the view — useful for creating % of total comparisons.',
     'Convert your Superstore connection to an Extract (see Exp 10). Then create the same views as above. Time how long the view takes to load. Note any difference in the status bar query time. Switch back to Live and compare again.',
     'Create a dashboard with a **Text Object** summarizing your performance findings: e.g., "FIXED LOD with Extract reduced query time from 4.2s to 0.8s". This documentation counts as your optimization notes. Save as "Exp12_LOD.twb" and upload.']),

  ('13','lab13.html','Publishing and Sharing Workflow','Part 5','Publish to Tableau Public and embed using the Tableau Embedding API v3.',
   [('check-1','Valid Workbook Submitted','xml !== null','34'),
    ('check-2','Dashboard Exists','TableauEvaluator.dashboardCount(xml) > 0','33'),
    ('check-3','Tableau Public URL','(document.getElementById("urlInput")&&document.getElementById("urlInput").value.includes("public.tableau.com"))','33')],
   ['Sign in to **Tableau Public** from within the app: go to **Server > Tableau Public > Save to Tableau Public As**. A browser window may open asking you to log in. If you do not have an account, create one free at public.tableau.com. Tableau will upload your entire workbook including datasource.',
     'Once uploaded, Tableau Public opens your browser to the published view. Copy the full URL from the address bar (it should look like `https://public.tableau.com/views/YourWorkbookName/Sheet1`). Keep this tab open.',
     'Paste the URL into the **Tableau Public URL** field above the evaluator panel on this page. This is required for full marks on this experiment.',
     'Back on the Tableau Public page, click the **Share** button at the bottom of the embedded view. Tableau shows an embed code snippet (`<script>` tag). Copy it and paste into a simple HTML file in VS Code — open the file in a browser to see the dashboard embedded in a webpage.',
     'Save the workbook one more time to Tableau Public with any small change (e.g., title update) to confirm you can re-publish. Then save as "Exp13_Publish.twb" locally and upload the .twb here.']),

  ('14','lab14.html','Dashboard Iteration and Versioning','Part 5','Iterate on a published dashboard, add Ship Mode filter and worksheet annotation.',
   [('check-1','Color Encoding Present','TableauEvaluator.hasNode(xml,"color")','25'),
    ('check-2','Filter Added','TableauEvaluator.hasNode(xml,"filter")','25'),
    ('check-3','Annotation Present','TableauEvaluator.hasTextObject(xml)','25'),
    ('check-4','Version Log Dashboard','TableauEvaluator.dashboardCount(xml) >= 2','25')],
   ['Open the workbook you published in Exp 13. Add a **Color encoding** to one of your charts — for example, drag **Ship Mode** to the Color card on a bar chart. This immediately changes the visual and updates the XML `<color>` node.',
     'Add a **Ship Mode filter**: drag Ship Mode to the Filters shelf. Right-click the filter card on the sheet > **Apply to Worksheets > All Using This Data Source**. Show the filter control. In your dashboard, the filter card now appears and affects all sheets.',
     'On a scatter plot or bar chart, right-click a specific data point and choose **Annotate > Point**. In the annotation text box type something like "Highest profit customer in Q3 — VIP retention target". Move the annotation so it does not overlap other marks.',
     'Create a brand-new Dashboard sheet. Rename it "Version Log". Drag a **Text** object onto it. In the text, document your changes: Version 1.0 (original), Version 1.1 (added color), Version 1.2 (Ship Mode filter), Version 1.3 (annotation). This is your changelog.',
     'Go to **Server > Tableau Public > Save to Tableau Public As** and save the updated workbook. The URL will change slightly. Copy the new URL. Save locally as "Exp14_Versioning.twb" and upload here.']),

  ('15','lab15.html','Data Pipeline Integration (Bonus)','Part 5 — Optional','Generate a CSV with Python and build a live monitoring dashboard. Bonus +10 marks.',
   [('check-1','Valid Workbook','xml !== null','34'),
    ('check-2','Parameter for Sensor','TableauEvaluator.hasParameter(xml)','33'),
    ('check-3','Line Chart (Time Series)','TableauEvaluator.hasMarkType(xml,"Line")','33')],
   ['Write a Python script to generate a CSV with time-stamped sensor readings. Example: `import csv, random, datetime; f=open("sensor.csv","w"); f.write("timestamp,temperature,humidity\\n"); [f.write(f"{datetime.datetime.now()-datetime.timedelta(hours=i)},{random.uniform(20,30):.1f},{random.uniform(40,80):.1f}\\n") for i in range(100)]; f.close()`. Run it in a terminal to produce sensor.csv.',
     'In Tableau, click **Text File** under Connect and open sensor.csv. Set the **connection to Live** (not Extract). Drag **timestamp** to Columns (set as a continuous date/time). Drag **temperature** to Rows. Tableau should draw a time-series line chart.',
     'Repeat: add **humidity** on a second axis (dual axis). Right-click the second axis > Synchronize Axis. Change the mark type for humidity to a different color. You now see both metrics on the same chart.',
     'Create a **Parameter** named "Metric" with Data type: String, Allowable values: List. Add two values: "temperature" and "humidity". Create a calculated field: `IF [Metric]="temperature" THEN [temperature] ELSE [humidity] END`. Use this field on Rows to toggle which metric is shown.',
     'Append 20 more rows to your CSV (run the script again or manually add). Back in Tableau, click **Data > sensor.csv > Refresh**. The chart extends automatically — this simulates a live data pipeline. Save as "Exp15_Pipeline.twb" and upload.']),
]

CAPSTONE = ('Cap','capstone.html','Complete BI Solution — Capstone','Capstone',
  'Build a full multi-dashboard BI solution meeting all 8 mandatory technical requirements. Total: 100 marks.',
  [('check-1','3+ Dashboards','TableauEvaluator.dashboardCount(xml) >= 3','13'),
   ('check-2','Parameter Control','TableauEvaluator.hasParameter(xml)','13'),
   ('check-3','Forecast Node','TableauEvaluator.hasNode(xml,"forecast")','13'),
   ('check-4','Trend Lines Node','TableauEvaluator.hasNode(xml,"trend-lines")','13'),
   ('check-5','Geographic Map','TableauEvaluator.hasMarkType(xml,"Map")','12'),
   ('check-6','LOD Expression','TableauEvaluator.hasFormulaKeyword(xml,"FIXED") || TableauEvaluator.hasFormulaKeyword(xml,"INCLUDE")','12'),
   ('check-7','Storytelling Captions','TableauEvaluator.hasTextObject(xml)','12'),
   ('check-8','Tableau Public URL','(document.getElementById("urlInput")&&document.getElementById("urlInput").value.includes("public.tableau.com"))','12')],
  ['**Plan your story.** Choose a single dataset (Superstore recommended). Sketch on paper which 3+ dashboards you will build: e.g., Executive Summary, Sales Deep Dive, Geographic Analysis. Each dashboard must have a distinct analytical purpose.',
   '**Build Dashboard 1 (Executive KPIs):** Create 3 KPI sheets (Total Sales, Total Profit, Order Count) using **Show Me > Text Table** or large number views. Build a Line Chart for Sales Trend. Assemble into Dashboard 1 with a Text title.',
   '**Build Dashboard 2 (Sales Analysis):** Create charts showing Sales by Category, Sub-Category, and a Scatter Plot of Sales vs Profit. Add a **Parameter** named "View Metric" (String, List: Sales/Profit/Quantity). Create a calculated field to toggle the metric. Add a filter for Region and Segment.',
   '**Build Dashboard 3 (Predictive/Geographic):** Add a Trend Line to a scatter plot. Add a Forecast to the sales trend line. Create a Filled Map with Profit by State. Use at least one LOD Expression (e.g., `{{FIXED [Region]: SUM([Sales])}}`) in a view.',
   '**Add Storytelling:** On every worksheet, go to **Worksheet > Show Caption** and write a 2–3 sentence business insight. Create a **Story** (the Story tab at the bottom) to walk through your dashboards in a narrative sequence.',
   'Publish to **Tableau Public** and paste the URL in the field above. Then save locally as "Capstone.twb" and upload here for XML evaluation.'])


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
        <div class="info-box"><strong>Follow the step-by-step instructions below.</strong> Complete every task in order, save your Tableau workbook as a <strong>.twb</strong> file, then upload it to the XML Evaluator on the right. The evaluator reads your workbook&rsquo;s XML structure &mdash; not screenshots.</div>
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
        <div class="section-label" style="margin-top:1.5rem">Graphical Evidence <span style="font-size:.68rem;font-weight:400;color:var(--text-3)">(up to 5 screenshots &mdash; file upload only)</span></div>
        <div id="ss-gallery" style="display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:.5rem"></div>
        <div class="upload-zone" id="ssZone" style="min-height:80px; padding: 15px; margin-bottom: 1.5rem; border-style:dashed; background:rgba(255,255,255,0.02)" title="Click to upload screenshot">
          <div id="ss-placeholder" style="text-align:center">
            <div class="upload-icon" style="font-size:1.2rem">📸</div>
            <div class="upload-title" style="font-size:0.78rem">Click to Upload Screenshot</div>
            <div class="upload-sub" style="font-size:0.63rem">JPEG / PNG &mdash; included in final report</div>
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
    <div class="rubric-title" style="display:flex; justify-content:space-between; align-items:center;">
      <span>&#128221; Reflection (auto-saved)</span>
      <span id="reflect-status" style="font-size: 0.85rem; padding: 2px 8px; border-radius: 4px; background: #fee2e2; color: #991b1b; border: 1px solid #fecaca;">FAIL (Too Short)</span>
    </div>
    <div class="reflection-area">
      <label for="reflection-text" style="font-size:.82rem;color:var(--text-2)">Write your observations and answers to the lab reflection questions:</label>
      <textarea id="reflection-text" placeholder="Describe what you learned, what surprised you, and how the XML changed after each step..." oncopy="return false" oncut="return false" onpaste="return false"></textarea>
      <div style="font-size:.7rem;color:var(--text-3);margin-top:.25rem">&#x26A0; Copy &amp; paste is disabled &mdash; type your reflection directly.</div>
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
    var passedIds = [];
    results.forEach(function(r) {{
      if (r.passed) passedIds.push(r.id);
      var el = document.getElementById(r.id);
      if (el) {{
        el.className = 'check-item ' + (r.passed ? 'pass' : 'fail');
        el.querySelector('.check-icon').textContent = r.passed ? '\\u2705' : '\\u274C';
      }}
      if (!r.passed) allPass = false;
    }});
    
    // Save passed check IDs for report generation
    localStorage.setItem('tvl_r_' + EID, JSON.stringify(passedIds));

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

  // --- Block all global paste ---
  document.addEventListener('paste', (e) => {{ e.preventDefault(); }});

  // --- Multi-Screenshot Handler (file upload only, max 5) ---
  const MAX_SS = 5;
  const ssZone = document.getElementById('ssZone');
  const ssInput = document.getElementById('ssInput');
  const ssGallery = document.getElementById('ss-gallery');
  const ssPlaceholder = document.getElementById('ss-placeholder');

  function loadScreenshots() {{
    const arr = JSON.parse(localStorage.getItem('tvl_ss_' + EID) || '[]');
    return Array.isArray(arr) ? arr : (arr ? [arr] : []);
  }}
  function saveScreenshots(arr) {{
    localStorage.setItem('tvl_ss_' + EID, JSON.stringify(arr));
  }}
  function renderGallery() {{
    const arr = loadScreenshots();
    ssGallery.innerHTML = '';
    arr.forEach((src, idx) => {{
      const wrap = document.createElement('div');
      wrap.style.cssText = 'position:relative;display:inline-block;width:110px;height:80px;border-radius:8px;overflow:hidden;border:1px solid var(--border-bright);background:#111';
      const img = document.createElement('img');
      img.src = src;
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
      const del = document.createElement('button');
      del.textContent = '✕';
      del.title = 'Delete screenshot';
      del.style.cssText = 'position:absolute;top:3px;right:3px;background:rgba(244,63,94,0.85);color:#fff;border:none;border-radius:50%;width:18px;height:18px;font-size:10px;cursor:pointer;line-height:1;padding:0;display:flex;align-items:center;justify-content:center;';
      del.addEventListener('click', (e) => {{
        e.stopPropagation();
        const a = loadScreenshots(); a.splice(idx, 1); saveScreenshots(a); renderGallery();
        showToast('Screenshot removed.');
      }});
      wrap.appendChild(img); wrap.appendChild(del);
      ssGallery.appendChild(wrap);
    }});
    const remaining = MAX_SS - arr.length;
    ssPlaceholder.querySelector('.upload-sub').textContent = remaining > 0 ? 'JPEG / PNG \u2014 ' + remaining + ' slot' + (remaining===1?'':'s') + ' remaining' : 'Maximum 5 screenshots reached';
    ssZone.style.opacity = remaining > 0 ? '1' : '0.4';
    ssZone.style.pointerEvents = remaining > 0 ? 'auto' : 'none';
  }}
  function processImg(file) {{
    const arr = loadScreenshots();
    if (arr.length >= MAX_SS) {{ showToast('Maximum 5 screenshots reached.', 'error'); return; }}
    const reader = new FileReader();
    reader.onload = (e) => {{
      const img = new Image();
      img.onload = () => {{
        const canvas = document.createElement('canvas');
        const MAX_W = 1000; let w = img.width, h = img.height;
        if (w > MAX_W) {{ h = Math.round(h * MAX_W / w); w = MAX_W; }}
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        arr.push(canvas.toDataURL('image/jpeg', 0.7));
        saveScreenshots(arr); renderGallery();
        showToast('Screenshot added! 📸');
      }};
      img.src = e.target.result;
    }};
    reader.readAsDataURL(file);
  }}
  ssZone.addEventListener('click', () => ssInput.click());
  ssInput.addEventListener('change', (e) => {{ if (e.target.files[0]) {{ processImg(e.target.files[0]); ssInput.value=''; }} }});
  renderGallery();

  document.getElementById('export-btn').addEventListener('click', function() {{
    evaluator.exportReport(TITLE);
  }});

  const reflectInput = document.getElementById('reflection-text');
  const reflectStatus = document.getElementById('reflect-status');

  function updateReflectStatus() {
    const val = reflectInput.value.trim();
    if (val.length > 20) {
      reflectStatus.textContent = 'PASS';
      reflectStatus.style.cssText = 'font-size: 0.85rem; padding: 2px 8px; border-radius: 4px; background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; font-weight:bold;';
    } else {
      reflectStatus.textContent = 'FAIL (Too Short)';
      reflectStatus.style.cssText = 'font-size: 0.85rem; padding: 2px 8px; border-radius: 4px; background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; font-weight:bold;';
    }
  }

  document.getElementById('save-btn').addEventListener('click', function() {{
    localStorage.setItem('tvl_reflect_' + EID, reflectInput.value);
    showToast('Saved \u2713');
    updateReflectStatus();
  }});
  reflectInput.addEventListener('input', function() {{
    localStorage.setItem('tvl_reflect_' + EID, this.value);
    updateReflectStatus();
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
  if (saved) {{ 
    reflectInput.value = saved; 
    updateReflectStatus(); 
  }}
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
