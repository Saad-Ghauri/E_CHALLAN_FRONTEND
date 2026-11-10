# Smart Challan — Frontend (Next.js)

```
copy .env.local.example .env.local   # API URL, default http://localhost:8000/api
npm install
npm run dev                          # http://localhost:3000
```

Checks: `npm run typecheck`, `npm run lint`, `npm run build`.

## Areas

| URL | Who | What |
| --- | --- | --- |
| `/`, `/check` | everyone | landing page, challan lookup by plate / number (no login) |
| `/login`, `/signup` (citizen), `/signup/officer` | visitors | sign in, create a citizen account, request staff access |
| `/citizen/*` | citizens | overview, challans (pay, appeal, PDF), vehicles (claim by CNIC), appeals |
| `/dashboard/*` | officers, admins | dashboard, detect & issue, **video analysis**, challans, vehicles, detection logs, **reports** |
| `/dashboard/appeals`, `/violations`, `/users`, `/audit` | admins | appeals review, fines, user management, audit log |

## Structure

`app/` routes · `components/shared/` reusable UI (DataTable, FormDialog, StatusBadge…) · `components/<feature>/` feature UI
(`citizen`, `video`, `detect`, `appeals`, `reports`, `public`, `notifications`) · `hooks/` data and form hooks (`useApi` with optional polling,
`useList`, `useForm`) · `lib/` API client, types, formatting, navigation, role routing (`routes.ts`).

`AuthGuard` keeps each user in their own area: anonymous visitors go to `/login`, citizens and staff are redirected to their own home.
