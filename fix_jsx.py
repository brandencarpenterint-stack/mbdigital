filepath = 'src/components/Layout.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("{/* FLOATING TOP BAR (Clean & Minimal) */}\n                <div", "<>\n{/* FLOATING TOP BAR (Clean & Minimal) */}\n                <div")

# I need to find where the `</div>` for this block ends and add `</>`.
# The floating top bar ends with:
# `</Link>\n                        )}\n                    </div>\n                </div>`

content = content.replace("</Link>\n                        )}\n                    </div>\n                </div>", "</Link>\n                        )}\n                    </div>\n                </div>\n</>")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed JSX")
