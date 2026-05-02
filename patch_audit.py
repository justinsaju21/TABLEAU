import os
import re

# 1. Update evaluator.js
evaluator_path = r'c:\Users\justi\Desktop\Virtual Lab\Tableau VL\js\evaluator.js'
with open(evaluator_path, 'r', encoding='utf-8') as f:
    eval_content = f.read()

# Add safe localStorage wrapper
if "const originalSetItem = localStorage.setItem;" not in eval_content:
    safe_ls = """// Safe localStorage wrapper to prevent QuotaExceededError crashes
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

class TableauEvaluator {"""
    eval_content = eval_content.replace("class TableauEvaluator {", safe_ls)

# Fix hasMarkType
old_mark = """    if (target === 'bar') return content.includes('none:category') && content.includes('sum:sales');
    if (target === 'line') return content.includes(':order date') && content.includes('sum:profit');
    if (target === 'circle' || target === 'scatter') return content.includes('sum:sales') && content.includes('sum:profit');
    return false;"""

new_mark = """    if (target === 'bar') return content.includes('none:category') && content.includes('sum:sales');
    if (target === 'line') return content.includes(':order date') && content.includes('sum:profit');
    if (target === 'circle' || target === 'scatter') return content.includes('sum:sales') && content.includes('sum:profit');
    if (target === 'map') return content.includes('filled-map') || content.includes("mark-type' value='map'") || content.includes('maptype');
    if (target === 'square') return content.includes("mark-type' value='square'") || content.includes('<mark type="square"') || content.includes("type='square'");
    return false;"""
eval_content = eval_content.replace(old_mark, new_mark)

with open(evaluator_path, 'w', encoding='utf-8') as f:
    f.write(eval_content)


# 2. Patch HTML files
labs_dir = r'c:\Users\justi\Desktop\Virtual Lab\Tableau VL\labs'
new_keywords = """    const labKeywords = {
      '0': ['install', 'connect', 'interface', 'data'],
      '1': ['datasource', 'connection', 'dimension', 'measure'],
      '2': ['bar', 'line', 'scatter', 'marks', 'labels'],
      '3': ['hierarchy', 'drill', 'group', 'set'],
      '4': ['filter', 'exclude', 'wildcard', 'condition'],
      '5': ['sort', 'compute', 'running', 'percent'],
      '6': ['dual', 'axis', 'synchronize', 'parameter'],
      '7': ['dashboard', 'action', 'interactive', 'filter'],
      '8': ['story', 'point', 'caption', 'presentation'],
      '9': ['map', 'geographic', 'latitude', 'longitude'],
      '10': ['extract', 'live', 'performance', 'hyper'],
      '11': ['polygon', 'background', 'image', 'map'],
      '12': ['lod', 'fixed', 'include', 'exclude'],
      '13': ['publish', 'server', 'public', 'web'],
      '14': ['forecast', 'trend', 'model', 'analytics'],
      '15': ['python', 'tabpy', 'script', 'extension']
    };"""

for filename in os.listdir(labs_dir):
    if not filename.endswith('.html'): continue
    filepath = os.path.join(labs_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # Update labKeywords (it appears twice in each file)
    old_keywords = """    const labKeywords = {
      '1': ['datasource', 'connection', 'dimension', 'measure'],
      '2': ['bar', 'line', 'scatter', 'marks', 'labels'],
      '3': ['hierarchy', 'drill', 'group', 'set']
    };"""
    html = html.replace(old_keywords, new_keywords)

    # Specific lab fixes
    if filename == 'lab6.html':
        old_check5 = "evalFn:(xml, xmlString)=>!!(xml.getElementsByTagName('datasource').length >= 2)"
        new_check5 = "evalFn:(xml, xmlString)=>!!(Array.from(xml.getElementsByTagName('datasource')).filter(d=>d.getAttribute('name')!=='Parameters').length >= 2)"
        html = html.replace(old_check5, new_check5)
        
    elif filename == 'lab9.html':
        # Replace drill-path logic with semantic-role check
        old_check3_fn = "evalFn:(xml, xmlString)=>!!(TableauEvaluator.hasDrillPath(xml, 2))"
        new_check3_fn = "evalFn:(xml, xmlString)=>!!(Array.from(xml.getElementsByTagName('column')).some(c => c.getAttribute('role') === 'dimension' && c.hasAttribute('semantic-role')))"
        html = html.replace(old_check3_fn, new_check3_fn)

    elif filename == 'lab13.html':
        # Remove duplicate urlInput block
        duplicate_block = '''        <div style="margin-bottom: 1rem;">
          <label style="font-size: 0.8rem; color: var(--text-2); display: block; margin-bottom: 0.2rem;">Tableau Public URL:</label>
          <input type="text" id="urlInput" placeholder="https://public.tableau.com/views/..." style="width: 100%; padding: 0.4rem; background: rgba(0,0,0,0.2); border: 1px solid var(--border); color: #fff; border-radius: 4px;">
        </div>'''
        html = html.replace(duplicate_block, "")
        
        # Add ordering trap note
        old_info = "<strong>Evaluator looks for:</strong> A parseable .twb XML file, at least one dashboard, and a valid Tableau Public URL pasted into the designated input field above (you must paste the URL to get points)."
        new_info = "<strong>Evaluator looks for:</strong> A parseable .twb XML file, at least one dashboard, and a valid Tableau Public URL pasted into the designated input field above (you must paste the URL to get points).<br><br><span style=\"color:var(--orange)\">⚠ <strong>Note:</strong> Paste your Tableau Public URL in the field above <em>before</em> uploading your .twb file.</span>"
        html = html.replace(old_info, new_info)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)

print("Patch applied successfully.")
