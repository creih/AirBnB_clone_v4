#!/usr/bin/env bash
import shutil
import os

# Define source and destination paths
source_static = 'web_flask/static'
source_template = 'web_flask/templates/100-hbnb.html'
source_init = 'web_flask/__init__.py'
source_script = 'web_flask/100-hbnb.py'

dest_folder = 'web_dynamic'
dest_static = os.path.join(dest_folder, 'static')
dest_template = os.path.join(dest_folder, 'templates/0-hbnb.html')
dest_init = os.path.join(dest_folder, '__init__.py')
dest_script = os.path.join(dest_folder, '0-hbnb.py')

# Ensure the destination directory exists
os.makedirs(dest_folder, exist_ok=True)
os.makedirs(os.path.join(dest_folder, 'templates'), exist_ok=True)

# Copy the static directory
shutil.copytree(source_static, dest_static, dirs_exist_ok=True)

# Copy individual files
shutil.copy(source_template, dest_template)
shutil.copy(source_init, dest_init)
shutil.copy(source_script, dest_script)

# Rename the script and template file
os.rename(os.path.join(dest_folder, 'templates/100-hbnb.html'), dest_template)
os.rename(os.path.join(dest_folder, '100-hbnb.py'), dest_script)

# Update route in 0-hbnb.py
with open(dest_script, 'r') as file:
    script_content = file.read()

# Replace the existing route to /0-hbnb/
script_content = script_content.replace('/100-hbnb/', '/0-hbnb/')

with open(dest_script, 'w') as file:
    file.write(script_content)
