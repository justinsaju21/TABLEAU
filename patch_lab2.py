
import re

with open('generate_labs.py', 'r', encoding='utf-8') as f:
    code = f.read()

# The inline functions with properly escaped backslashes for Python string
bar_fn  = r"""(function(x){var ss=x.toLowerCase().split('<worksheet');for(var s of ss){var cm=s.match(/<cols>([^<]*)<\/cols>/);var rm=s.match(/<rows>([^<]*)<\/rows>/);var c=cm?cm[1]:'';var r=rm?rm[1]:'';if((c.includes('none:category')||c.includes('none:sub-category'))&&(r.includes('sum:sales')||r.includes('sum:profit')))return true;if(r.includes('none:category')&&c.includes('sum:sales'))return true;}return false;})(xmlString)"""
line_fn = r"""(function(x){var ss=x.toLowerCase().split('<worksheet');for(var s of ss){var cm=s.match(/<cols>([^<]*)<\/cols>/);var rm=s.match(/<rows>([^<]*)<\/rows>/);var c=cm?cm[1]:'';var r=rm?rm[1]:'';if(c.includes(':order date')&&(r.includes('sum:profit')||r.includes('sum:sales')))return true;}return false;})(xmlString)"""
scat_fn = r"""(function(x){var ss=x.toLowerCase().split('<worksheet');for(var s of ss){var cm=s.match(/<cols>([^<]*)<\/cols>/);var rm=s.match(/<rows>([^<]*)<\/rows>/);var c=cm?cm[1]:'';var r=rm?rm[1]:'';if(c.includes('sum:sales')&&r.includes('sum:profit'))return true;if(c.includes('sum:profit')&&r.includes('sum:sales'))return true;}return false;})(xmlString)"""
lbl_fn  = r"""xmlString.toLowerCase().includes('mark-labels-show')"""

# Replace using regex to be safe
code = re.sub(r"TableauEvaluator\.hasMarkType\(xml,\"Bar\",xmlString\)", bar_fn, code)
code = re.sub(r"TableauEvaluator\.hasMarkType\(xml,\"Line\",xmlString\)", line_fn, code)
code = re.sub(r"TableauEvaluator\.hasMarkType\(xml,\"Circle\",xmlString\)", scat_fn, code)
code = re.sub(r"TableauEvaluator\.hasNode\(xml,\"label\",xmlString\)", lbl_fn, code)

with open('generate_labs.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("Done. Checking result...")
idx = code.find("'3 Worksheets Present'")
print(repr(code[idx-5:idx+400]))
