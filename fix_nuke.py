filepath = 'src/components/GlobalNukeEvent.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { supabase } from '../config/supabaseClient';", "// import { supabase } from '../config/supabaseClient';\nconst supabase = null;")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
