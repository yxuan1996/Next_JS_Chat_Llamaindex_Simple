# Next_JS_Chat_Llamaindex_Simple

A Front-end Chat App for Llamaindex AI Agent Backend (https://github.com/yxuan1996/LlamaIndex_FastAPI_AI_Agent_Simple)

Features:
- Supabase authentication
- Shadcn UI Library
- View and switch between multiple chat conversations


## File structure
```
chat_app/
├── app/
│   ├── page.js (home/redirect)
│   ├── login/page.js (authentication)
│   ├── chat/page.js (chat landing)
│   ├── chat/[threadId]/page.js (specific chat)
│   └── settings/page.js (configuration)
├── components/
│   ├── Sidebar.js
│   ├── ChatInterface.js
│   ├── MessageList.js
│   └── ChatInput.js
├── lib/
│   └── supabase.js (auth helpers)
└── middleware.js (auth middleware)
```

## Usage
Create a `.env.local` file with the following config:
```
# Supabase Configuration
# Get these from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```


```bash
npm install
npm run dev
```

After logging in, configure the backend URL and API key in the settings page. 