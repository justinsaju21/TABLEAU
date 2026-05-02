import os

labs_dir = r'c:\Users\justi\Desktop\Virtual Lab\Tableau VL\labs'

replacements = {
    'lab4.html': [
        (
            'evalFn:(xml, xmlString)=>!!(xml.getElementsByTagName("datasource-filter").length >= 1)',
            'evalFn:(xml, xmlString)=>!!(Array.from(xml.getElementsByTagName("filter")).some(f => (f.getAttribute("column") || "").includes("Category")))'
        ),
        (
            'evalFn:(xml, xmlString)=>!!(xml.getElementsByTagName("datasource-filter").length >= 2)',
            'evalFn:(xml, xmlString)=>!!(Array.from(xml.getElementsByTagName("filter")).some(f => (f.getAttribute("column") || "").includes("Region")))'
        )
    ],
    'lab7.html': [
        (
            'evalFn:(xml, xmlString)=>!!(xml.getElementsByTagName("pane").length >= 2)',
            'evalFn:(xml, xmlString)=>!!(Array.from(xml.getElementsByTagName("worksheet")).some(w => w.getElementsByTagName("pane").length >= 2))'
        )
    ],
    'lab3.html': [
        (
            'evalFn:(xml, xmlString)=>!!(TableauEvaluator.hasFormulaKeyword(xml,"SUM"))',
            'evalFn:(xml, xmlString)=>!!(Array.from(xml.getElementsByTagName("column")).some(c => c.hasAttribute("caption") && c.querySelector("calculation[formula*=\'SUM\']")))'
        )
    ],
    'lab5.html': [
        (
            'evalFn:(xml, xmlString)=>!!(TableauEvaluator.hasNode(xml,"filter"))',
            'evalFn:(xml, xmlString)=>!!(Array.from(xml.getElementsByTagName("filter")).some(f => f.hasAttribute("column") && !f.getAttribute("column").includes("__tableau_internal_object_id__") && !f.getAttribute("column").includes("Multiple Values")))'
        )
    ],
    'lab14.html': [
        (
            'evalFn:(xml, xmlString)=>!!(TableauEvaluator.hasNode(xml,"color"))',
            'evalFn:(xml, xmlString)=>!!(xml.querySelector("encodings > color[column]") !== null)'
        ),
        (
            'evalFn:(xml, xmlString)=>!!(TableauEvaluator.hasNode(xml,"filter"))',
            'evalFn:(xml, xmlString)=>!!(Array.from(xml.getElementsByTagName("filter")).some(f => f.hasAttribute("column") && !f.getAttribute("column").includes("__tableau_internal_object_id__") && !f.getAttribute("column").includes("Multiple Values")))'
        )
    ],
    'lab8.html': [
        (
            'evalFn:(xml, xmlString)=>!!(xml.getElementsByTagName("group").length > 0)',
            'evalFn:(xml, xmlString)=>!!(xml.getElementsByTagName("groupfilter").length > 0 || xml.querySelector("column > calculation[class=\'cluster\']") !== null)'
        )
    ],
    'lab15.html': [
        (
            'evalFn:(xml, xmlString)=>!!(xml !== null)',
            'evalFn:(xml, xmlString)=>!!(TableauEvaluator.worksheetCount(xml) > 0)'
        )
    ]
}

for filename, rules in replacements.items():
    filepath = os.path.join(labs_dir, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        for old_txt, new_txt in rules:
            content = content.replace(old_txt, new_txt)
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print("Second patch applied.")
