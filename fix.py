import os
import re

pages_dir = 'src/pages'
for filename in os.listdir(pages_dir):
    if not filename.endswith('.jsx'):
        continue
    filepath = os.path.join(pages_dir, filename)
    with open(filepath, 'r') as f:
        content = f.read()

    # We want to ensure that right before "export default" we have a closed function.
    # The components typically end with `); \n\n export default`
    # Let's replace the last `);` before `export default` with `);\n};\n`
    # if the file contains `const navigate = useNavigate()` (meaning it was converted to explicit block return)
    if 'useNavigate()' in content:
        # Check if it already has `};\nexport default` or `};\n\nexport default`
        if not re.search(r'\};\s*export default', content):
            # Replace the last `);` with `};\n`
            content = re.sub(r'\);\s*export default', ');\n};\n\nexport default', content)
    
    with open(filepath, 'w') as f:
        f.write(content)

print("Fix applied")
