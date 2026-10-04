filepath = 'src/App.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

target_import = "const PocketBro = lazy(() => import('./pages/PocketBro'));"
replacement_import = "const PocketBro = lazy(() => import('./pages/PocketBro'));\nconst TheBunker = lazy(() => import('./pages/TheBunker'));"

target_route = '<Route path="pocketbro" element={<PocketBro />} />'
replacement_route = '<Route path="pocketbro" element={<PocketBro />} />\n            <Route path="bunker" element={<TheBunker />} />'

content = content.replace(target_import, replacement_import)
content = content.replace(target_route, replacement_route)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("App.jsx updated")
