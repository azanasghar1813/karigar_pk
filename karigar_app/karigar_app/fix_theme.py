import os
import re

def process_file(filepath):
    if 'theme.dart' in filepath:
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # Fix const BoxDecoration
    content = re.sub(r'const\s+BoxDecoration\(\s*color:\s*AppTheme\.darkCard', r'BoxDecoration(color: Theme.of(context).cardColor', content)
    content = re.sub(r'const\s+BoxDecoration\(\s*color:\s*AppTheme\.darkBg', r'BoxDecoration(color: Theme.of(context).scaffoldBackgroundColor', content)
    
    # Also handle border: Border(...) where it was const
    content = re.sub(r'const\s+BoxDecoration\(\s*border:', r'BoxDecoration(border:', content)
    content = re.sub(r'const\s+BorderSide\(\s*color:\s*AppTheme\.darkBorder', r'BorderSide(color: Theme.of(context).dividerColor', content)
    
    # Replace AppTheme constants
    content = content.replace('AppTheme.darkCard', 'Theme.of(context).cardColor')
    content = content.replace('AppTheme.darkBg', 'Theme.of(context).scaffoldBackgroundColor')
    content = content.replace('AppTheme.darkBorder', 'Theme.of(context).dividerColor')
    content = content.replace('AppTheme.textSecondary', '(Theme.of(context).textTheme.bodyMedium?.color ?? Colors.grey)')

    if original != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk(r"c:\Users\Azan\Desktop\Karigar PK\karigar_app\lib"):
    for file in files:
        if file.endswith('.dart'):
            process_file(os.path.join(root, file))
