import time

with open('generate_labs.py', 'r', encoding='utf-8') as f:
    code = f.read()

ts = str(int(time.time()))
code = code.replace('src="../js/evaluator.js"', f'src="../js/evaluator.js?v={ts}"')

with open('generate_labs.py', 'w', encoding='utf-8') as f:
    f.write(code)

print('Cache-bust version:', ts)
