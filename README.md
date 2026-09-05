# Mahakal Mobile Hub — Repair Master Pro

Professional mobile motherboard repair AI tool.

## Files
| File | Work |
|------|------|
| `index.html` | Main app (UI + offline fallback) |
| `api/gemini.js` | Vercel API — Gemini call, key server pe safe |
| `vercel.json` | Routing |
| `package.json` | Project name |

## 1) Local (phone Chrome)
1. `index.html` open karo
2. Tools → API Key → apni Gemini key Save

## 2) GitHub + Vercel (public site)

### A. GitHub
1. naya repo banao (example: `mahakal-mobile-hub`)
2. ye **poori folder** ki files upload karo:
   - index.html
   - api/gemini.js
   - vercel.json
   - package.json
   - README.md

### B. Vercel
1. [vercel.com](https://vercel.com) → Add New Project → GitHub repo import
2. **Settings → Environment Variables**
   - Name: `GEMINI_API_KEY`
   - Value: tumhari AI Studio key (`AQ...` ya `AIza...`)
3. Deploy

### C. After deploy
- Site URL se app khulegi
- Key browser me nahi — server pe rahegi (safe)
- App pehle `/api/gemini` try karegi; fail ho to local key use

## Gemini models
`gemini-flash-latest` → `gemini-3.6-flash` → `gemini-3.5-flash` (auto)

## Security
- Kabhi key GitHub pe mat daalna
- Sirf Vercel Environment Variable me rakhna
