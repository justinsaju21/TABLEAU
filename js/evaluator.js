// ── TableauEvaluator ── XML-based grading engine for Tableau VL
// Safe localStorage wrapper to prevent QuotaExceededError crashes
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
  try {
    originalSetItem.apply(this, arguments);
  } catch(e) {
    if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      const errEl = document.getElementById('eval-error');
      if (errEl) {
        errEl.textContent = '⚠ Storage quota exceeded! Cannot save progress or screenshots. Please clear some previous labs.';
        errEl.style.display = 'block';
      }
      console.error('localStorage quota exceeded', e);
    }
  }
};

class TableauEvaluator {
  constructor(checks, onResultUpdate) {
    this.checks = checks;
    this.onResultUpdate = onResultUpdate;
    this.totalScore = 0;
    this.maxScore = checks.reduce((s, c) => s + c.marks, 0);
    this.lastResults = [];
    this.labId = null;
    this.labTitle = '';
    this.securityMetadata = { uuid: 'Not Found', userPath: 'Not Found', build: 'Not Found' };
  }

  async processFile(file) {
    try {
      let xmlString = '';
      if (file.name.endsWith('.twbx')) {
        if (typeof JSZip === 'undefined') throw new Error('JSZip not loaded.');
        const zip = await new JSZip().loadAsync(file);
        const twbName = Object.keys(zip.files).find(n => n.endsWith('.twb'));
        if (!twbName) throw new Error('No .twb found inside .twbx archive.');
        xmlString = await zip.files[twbName].async('string');
      } else if (file.name.endsWith('.twb')) {
        xmlString = await file.text();
      } else {
        throw new Error('Please upload a .twb or .twbx file.');
      }
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlString, 'text/xml');
      if (xml.getElementsByTagName('parsererror').length > 0)
        throw new Error('XML parse error in workbook.');
      this.runChecks(xml, xmlString);
      this.extractSecurityMetadata(xml, xmlString);
    } catch (e) {
      console.error(e);
      const errEl = document.getElementById('eval-error');
      if (errEl) { errEl.textContent = '⚠ ' + e.message; errEl.style.display = 'block'; }
      else alert('Evaluation Error: ' + e.message);
    }
  }

  runChecks(xml, xmlString) {
    this.totalScore = 0;
    const results = [];
    this.checks.forEach(c => {
      let passed = false;
      try { passed = c.evalFn(xml, xmlString); } catch(e) { console.error(c.id, e); }
      if (passed) this.totalScore += c.marks;
      results.push({ id: c.id, name: c.name, marks: passed ? c.marks : 0, maxMarks: c.marks, passed });
    });
    this.lastResults = results;
    if (this.onResultUpdate) this.onResultUpdate(results, this.totalScore, this.maxScore);
  }

  exportReport(labTitle, reflection, screenshots) {
    const pct = Math.round((this.totalScore / this.maxScore) * 100);
    const grade = pct >= 90 ? 'A' : pct >= 75 ? 'B' : pct >= 60 ? 'C' : 'F';
    
    let resultsHtml = this.lastResults.map(r => `
      <tr>
        <td>${r.name}</td>
        <td>${r.passed ? '<span style="color:#16a34a; font-weight:bold;">✅ Pass</span>' : '<span style="color:#dc2626; font-weight:bold;">❌ Fail</span>'}</td>
        <td>${r.marks}/${r.maxMarks}</td>
      </tr>
    `).join('');

    let ssHtml = (screenshots || []).map(ss => `
      <div style="page-break-inside: avoid; margin-bottom: 20px;">
        <img src="${ss}" style="max-width:100%; border:1px solid #e2e8f0; border-radius:8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
      </div>
    `).join('');

    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Report - ${labTitle}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; max-width: 900px; margin: 0 auto; background: #fff; }
          .header { border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
          .header h1 { margin: 0; font-size: 2.2rem; font-weight: 800; color: #0f172a; }
          .header-meta { text-align: right; color: #64748b; font-size: 0.95rem; }
          .score-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
          .stat-box { background: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; }
          .stat-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; font-weight: 700; margin-bottom: 8px; }
          .stat-value { font-size: 2rem; font-weight: 800; color: #2563eb; line-height: 1; }
          .stat-value.grade { color: #8b5cf6; }
          
          h2 { font-size: 1.25rem; font-weight: 700; color: #1e293b; margin: 40px 0 16px; border-left: 4px solid #3b82f6; padding-left: 12px; }
          
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 0.95rem; }
          th { text-align: left; padding: 14px; background: #f1f5f9; color: #475569; font-weight: 700; border-bottom: 2px solid #e2e8f0; }
          td { padding: 14px; border-bottom: 1px solid #f1f5f9; }
          
          .reflection { background: #fff; border: 1px solid #e2e8f0; padding: 24px; border-radius: 12px; white-space: pre-wrap; font-style: italic; color: #334155; }
          
          .forensic-card { background: #fff7ed; border: 1px solid #ffedd5; padding: 24px; border-radius: 12px; margin-top: 50px; }
          .forensic-card h3 { margin: 0 0 12px; font-size: 0.9rem; color: #9a3412; text-transform: uppercase; letter-spacing: 0.05em; }
          .forensic-list { list-style: none; padding: 0; margin: 0; }
          .forensic-list li { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; margin-bottom: 6px; color: #7c2d12; word-break: break-all; }
          .forensic-list b { color: #9a3412; }

          .footer { text-align: center; margin-top: 60px; padding-top: 20px; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 0.75rem; }

          @media print {
            body { padding: 0; }
            .no-print { display: none; }
            .stat-box { background: #fff !important; border: 2px solid #f1f5f9 !important; }
            .forensic-card { background: #fff !important; border: 2px solid #fed7aa !important; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div style="font-size: 0.85rem; font-weight: 700; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">Student Submission</div>
            <h1>Lab Report</h1>
          </div>
          <div class="header-meta">
            <b>${labTitle}</b><br>
            ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        <div class="score-grid">
          <div class="stat-box">
            <div class="stat-label">Evaluation Score</div>
            <div class="stat-value">${this.totalScore} <span style="font-size: 1.2rem; color: #94a3b8; font-weight: 400;">/ ${this.maxScore}</span></div>
            <div style="font-size: 0.85rem; color: #64748b; margin-top: 4px;">Accuracy: ${pct}%</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Calculated Grade</div>
            <div class="stat-value grade">${grade}</div>
            <div style="font-size: 0.85rem; color: #64748b; margin-top: 4px;">Based on XML structure</div>
          </div>
        </div>

        <h2>Automated Check Results</h2>
        <table>
          <thead>
            <tr><th>Requirement</th><th>Status</th><th>Marks</th></tr>
          </thead>
          <tbody>
            ${resultsHtml}
          </tbody>
        </table>

        <h2>Student Reflection</h2>
        <div class="reflection">${reflection || 'No reflection provided.'}</div>

        <h2>Graphical Evidence</h2>
        <div style="margin-top: 20px;">
          ${ssHtml || '<p style="color:#94a3b8; font-style:italic;">No screenshots provided for this lab.</p>'}
        </div>

        <div class="forensic-card">
          <h3>Forensic Security Metadata</h3>
          <ul class="forensic-list">
            <li><b>UUID:</b> ${this.securityMetadata.uuid || 'N/A'}</li>
            <li><b>Source Path:</b> ${this.securityMetadata.userPath || 'N/A'}</li>
            <li><b>Tableau Build:</b> ${this.securityMetadata.build || 'N/A'}</li>
          </ul>
        </div>

        <div class="footer">
          Tableau Virtual Laboratory XML Evaluator • Authorized Student Report • System ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}
        </div>

        <script>
          window.onload = () => {
            setTimeout(() => {
              window.print();
            }, 800);
          };
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(reportHtml);
      printWindow.document.close();
    } else {
      alert('Please allow popups to view the print report.');
    }
  }

  extractSecurityMetadata(xml, xmlString) {
    try {
      // 1. Digital Fingerprint (First UUID found in worksheets/windows)
      const simpleIds = xml.getElementsByTagName('simple-id');
      if (simpleIds.length > 0) {
        this.securityMetadata.uuid = simpleIds[0].getAttribute('uuid') || 'Unknown';
      }

      // 2. Username Leak (Look for local user paths in connection strings)
      const conns = xml.getElementsByTagName('connection');
      for (let i = 0; i < conns.length; i++) {
        const path = conns[i].getAttribute('filename') || '';
        if (path.toLowerCase().includes('users/')) {
          this.securityMetadata.userPath = path;
          break;
        }
      }

      // 3. Structural Build Info
      const workbook = xml.getElementsByTagName('workbook')[0];
      if (workbook) {
        this.securityMetadata.build = workbook.getAttribute('source-build') || 'Unknown';
        this.securityMetadata.platform = workbook.getAttribute('source-platform') === 'win' ? 'Windows' : 
                                         workbook.getAttribute('source-platform') === 'mac' ? 'macOS' : 
                                         (workbook.getAttribute('source-platform') || 'Unknown');
        this.securityMetadata.version = workbook.getAttribute('original-version') || 'Unknown';
      }

      // 4. Repository Path (Tracks if file was downloaded from Server/Public)
      const repoLocs = xml.getElementsByTagName('repository-location');
      if (repoLocs.length > 0) {
        this.securityMetadata.repoLoc = repoLocs[0].getAttribute('path') || 'Found (Unknown Path)';
      } else {
        this.securityMetadata.repoLoc = 'Local Machine';
      }

      // 5. New Security Stack: Structural Fingerprints
      this.securityMetadata.sheetCount = xml.getElementsByTagName('worksheet').length;
      this.securityMetadata.dashCount = xml.getElementsByTagName('dashboard').length;
      this.securityMetadata.thumbCount = xml.getElementsByTagName('thumbnail').length;
      
      const namedConns = xml.getElementsByTagName('named-connection');
      this.securityMetadata.connHash = namedConns.length > 0 ? (namedConns[0].getAttribute('name') || 'N/A') : 'N/A';

      // 6. Regional Locale
      const semanticValues = xml.getElementsByTagName('semantic-value');
      for (let i = 0; i < semanticValues.length; i++) {
        if (semanticValues[i].getAttribute('key') === '[Country].[Name]') {
          this.securityMetadata.locale = semanticValues[i].getAttribute('value').replace(/"/g, '') || 'Unknown';
          break;
        }
      }
    } catch (e) {
      console.warn('Forensic extraction failed', e);
    }
    
    if (this.labId) {
      localStorage.setItem('tvl_security_' + this.labId, JSON.stringify(this.securityMetadata));
    }
  }

  // ── Static XML Helpers ──
  static findNodes(xml, tagName) {
    // Always use namespace-agnostic search for maximum reliability
    return Array.from(xml.getElementsByTagNameNS('*', tagName));
  }

  static hasDatasource(xml, sub) {
    const ds = this.findNodes(xml, 'datasource');
    for (let i = 0; i < ds.length; i++) {
      const n = (ds[i].getAttribute('name') || '') + (ds[i].getAttribute('caption') || '');
      if (n.toLowerCase().includes(sub.toLowerCase())) return true;
    }
    return false;
  }
  static hasRenamedField(xml, caption) {
    const cols = this.findNodes(xml, 'column');
    for (let i = 0; i < cols.length; i++)
      if ((cols[i].getAttribute('caption') || '').toLowerCase() === caption.toLowerCase()) return true;
    return false;
  }
  static hasDatatypeChange(xml, fieldName, dtype) {
    const cols = this.findNodes(xml, 'column');
    for (let i = 0; i < cols.length; i++) {
      const n = cols[i].getAttribute('name') || '';
      if (n.toLowerCase().includes(fieldName.toLowerCase()) && cols[i].getAttribute('datatype') === dtype) return true;
    }
    return false;
  }

  static hasMarkType(xml, cls, xmlString) {
    const target = cls.toLowerCase();
    const content = (xmlString || new XMLSerializer().serializeToString(xml)).toLowerCase();
    
    // Split into individual worksheet blocks
    const sheets = content.split('<worksheet');
    
    for (let s of sheets) {
      // Extract the <cols> and <rows> shelf text — this is the definitive encoding
      const colsMatch = s.match(/<cols>([^<]*)<\/cols>/);
      const rowsMatch = s.match(/<rows>([^<]*)<\/rows>/);
      const cols = colsMatch ? colsMatch[1] : '';
      const rows = rowsMatch ? rowsMatch[1] : '';
      
      // BAR CHART: dimension (none:) on cols + measure (sum:sales) on rows
      // OR: dimension (none:) on rows + measure (sum:sales) on cols (transposed)
      if (target === 'bar') {
        const barCheck = 
          (cols.includes('none:category') || cols.includes('none:sub-category') || cols.includes('none:region') || cols.includes('none:segment'))
          && (rows.includes('sum:sales') || rows.includes('sum:profit') || rows.includes('sum:quantity'))
          || (rows.includes('none:category') || rows.includes('none:sub-category'))
          && (cols.includes('sum:sales') || cols.includes('sum:profit'));
        if (barCheck) return true;
      }
      
      // LINE CHART: date field on cols (mn: = month, yr: = year, qr: = quarter, dy: = day)
      if (target === 'line') {
        const lineCheck = 
          (cols.includes('mn:order date') || cols.includes('yr:order date') || cols.includes('qr:order date') || cols.includes('dy:order date') || cols.includes(':order date'))
          && (rows.includes('sum:profit') || rows.includes('sum:sales'));
        if (lineCheck) return true;
      }
      
      // SCATTER PLOT: both axes are measures (sum:)
      if (target === 'circle' || target === 'scatter') {
        const scatterCheck = 
          (cols.includes('sum:sales') && rows.includes('sum:profit'))
          || (cols.includes('sum:profit') && rows.includes('sum:sales'));
        if (scatterCheck) return true;
      }
    }
    
    // Fallback: broad content search
    if (target === 'bar') return content.includes('none:category') && content.includes('sum:sales');
    if (target === 'line') return content.includes(':order date') && content.includes('sum:profit');
    if (target === 'circle' || target === 'scatter') return content.includes('sum:sales') && content.includes('sum:profit');
    if (target === 'map') return content.includes('filled-map') || content.includes("mark-type' value='map'") || content.includes('maptype');
    if (target === 'square') return content.includes("mark-type' value='square'") || content.includes('<mark type="square"') || content.includes("type='square'");
    return false;
  }

  static hasFormulaKeyword(xml, ...keywords) {
    const calcs = this.findNodes(xml, 'calculation');
    for (let i = 0; i < calcs.length; i++) {
      const f = (calcs[i].getAttribute('formula') || '').toUpperCase();
      if (keywords.every(k => f.includes(k.toUpperCase()))) return true;
    }
    return false;
  }
  static hasParameter(xml) {
    const cols = this.findNodes(xml, 'column');
    for (let i = 0; i < cols.length; i++)
      if (cols[i].hasAttribute('param-domain-type')) return true;
    return false;
  }
  static worksheetCount(xml) {
    return this.findNodes(xml, 'worksheet').length;
  }
  static dashboardCount(xml) {
    return this.findNodes(xml, 'dashboard').length;
  }
  static hasDashboardZones(xml, minZones) {
    const dashes = this.findNodes(xml, 'dashboard');
    for (let i = 0; i < dashes.length; i++) {
      let ws = 0;
      const zones = dashes[i].getElementsByTagNameNS('*', 'zone');
      for (let j = 0; j < zones.length; j++)
        if (zones[j].getAttribute('type-v2') === 'worksheet') ws++;
      if (ws >= minZones) return true;
    }
    return false;
  }
  static hasTextObject(xml) {
    const zones = this.findNodes(xml, 'zone');
    for (let i = 0; i < zones.length; i++)
      if (zones[i].getAttribute('type-v2') === 'text') return true;
    return false;
  }
  static hasNode(xml, tagName, xmlString) {
    const target = tagName.toLowerCase();
    const content = (xmlString || new XMLSerializer().serializeToString(xml)).toLowerCase();
    
    if (target === 'label' || target === 'mark-labels') {
      // Tableau writes: attr='mark-labels-show' value='true'
      return content.includes("mark-labels-show' value='true'") ||
             content.includes('mark-labels-show" value="true"') ||
             content.includes('mark-labels-show') ||
             content.includes('labels-cull');
    }
    if (target === 'color') {
       return content.includes('mark-color') || content.includes('<color') || content.includes("encoding='color'");
    }
    return this.findNodes(xml, target).length > 0 || content.includes('<' + target);
  }
  static hasConnectionType(xml, cls) {
    const conns = xml.getElementsByTagName('connection');
    for (let i = 0; i < conns.length; i++)
      if ((conns[i].getAttribute('class') || '').includes(cls)) return true;
    return false;
  }
  static hasDrillPath(xml, minLevels) {
    const dp = xml.getElementsByTagName('drill-path');
    for (let i = 0; i < dp.length; i++)
      if (dp[i].getElementsByTagName('field').length >= minLevels) return true;
    return false;
  }
}

// ── Upload Zone Setup ──
function setupUploadZone(zoneId, inputId, evaluator) {
  const zone = document.getElementById(zoneId);
  const input = document.getElementById(inputId);
  if (!zone || !input) return;

  const process = file => {
    const label = document.getElementById('file-label');
    if (label) label.textContent = '📄 ' + file.name;
    zone.classList.add('loaded');
    evaluator.processFile(file);
  };

  zone.addEventListener('click', () => input.click());
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('dragover');
    if (e.dataTransfer.files[0]) process(e.dataTransfer.files[0]);
  });
  input.addEventListener('change', e => { if (e.target.files[0]) process(e.target.files[0]); });
}

// ── Toast ──
function showToast(msg, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) { toast = document.createElement('div'); toast.id = 'toast'; document.body.appendChild(toast); }
  toast.textContent = msg;
  toast.className = 'toast show ' + type;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2800);
}

// JSON Progress Backup/Restore (called from index.html)
function backupAllProgress() {
  var data = {};
  for (var i = 0; i < localStorage.length; i++) {
    var k = localStorage.key(i);
    if (k && k.startsWith('tvl_')) data[k] = localStorage.getItem(k);
  }
  var blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'tableau_vl_backup_' + new Date().toISOString().slice(0,10) + '.json';
  a.click(); URL.revokeObjectURL(a.href);
}
function restoreFromJSON(file) {
  var r = new FileReader();
  r.onload = function(e) {
    try {
      var data = JSON.parse(e.target.result); var n = 0;
      Object.keys(data).forEach(function(k) { if (k.startsWith('tvl_')) { localStorage.setItem(k, data[k]); n++; } });
      alert('Restored ' + n + ' records. Page will reload.'); location.reload();
    } catch(ex) { alert('Invalid backup file.'); }
  };
  r.readAsText(file);
}
