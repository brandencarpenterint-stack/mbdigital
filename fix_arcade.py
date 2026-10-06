filepath = 'src/pages/ArcadeHub.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

import re

target = """    {
        id: 'subslayer',
        title: 'SUB SLAYER',
        desc: 'Expense Tracker.',
        gradient: 'linear-gradient(135deg, #220000, #440000)',
        icon: '🥷🏽',
        colSpan: 1,
        path: '/subslayer'
    }
];"""

replacement = """    {
        id: 'subslayer',
        title: 'SUB SLAYER',
        desc: 'Expense Tracker.',
        gradient: 'linear-gradient(135deg, #220000, #440000)',
        icon: '🥷🏽',
        colSpan: 1,
        path: '/subslayer'
    },
    {
        id: 'coloring',
        title: 'COLORING BOOK',
        desc: 'Relax & create.',
        gradient: 'linear-gradient(135deg, #FF69B4, #8A2BE2)',
        icon: '🎨',
        colSpan: 2,
        path: '/coloring'
    }
];"""

# We might have an encoding issue with the ninja emoji in the file.
# Let's use a regex to match the end of the array instead.
pattern = re.compile(r"path:\s*'/subslayer'\s*\}\s*\];", re.DOTALL)
replacement_regex = """path: '/subslayer'
    },
    {
        id: 'coloring',
        title: 'COLOR STUDIO',
        desc: 'Relax and paint.',
        gradient: 'linear-gradient(135deg, #FF69B4, #8A2BE2)',
        icon: '🎨',
        colSpan: 2,
        path: '/coloring'
    }
];"""
content = re.sub(pattern, replacement_regex, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated ArcadeHub with Coloring Book")
