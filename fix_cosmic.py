filepath = 'src/components/CosmicBackground.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the premature template string closer `}
content = content.replace("            `}\n\n                /* GLITCH */", "                /* GLITCH */")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
