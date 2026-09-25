# TaskPro

TaskPro, ekiplerin board → column → card hiyerarşisiyle iş takibi yapabildiği bir Kanban uygulaması. Trello'ya benzer şekilde kullanıcı kayıt/giriş yapıyor, kendi board'larını oluşturuyor, board içine sütun (column) ve kart (card) ekleyip bunları taşıyabiliyor.

**Canlı uygulama:** https://taskpro-goodteama.vercel.app
**Backend API + Swagger dokümantasyonu:** https://task-pro-backend-b7mb.onrender.com/api/docs

> Backend free tier'da çalıştığı için ilk istekte ~30-50 saniye "cold start" gecikmesi olabilir, bu normaldir.

## Mimari

Proje iki ayrı parçadan oluşuyor:

- **Frontend** (`src/`) — React 19 + Vite 6, Context API ile state yönetimi, Vercel'e deploy ediliyor.
- **Backend** (`backend/`) — Node.js + Express + Mongoose, MongoDB Atlas'a bağlanıyor, Render'a deploy ediliyor.

İkisi arasındaki tek bağlantı `src/api/*.api.js` katmanı: frontend context'leri (`AuthContext`, `BoardContext`) hiçbir zaman backend'i doğrudan bilmiyor, sadece bu katmandaki sabit isimli fonksiyonları (`loginUser`, `createBoard`, vb.) çağırıyor. Böylece backend mock'tan gerçek API'ye geçerken `AuthContext.jsx`/`BoardContext.jsx`/component'lerin hiçbiri değişmedi.

### Önceki versiyona göre ne değişti (frontend)

Proje başlangıçta Create React App + Redux Toolkit + react-router-dom v7 ile kurulmuştu. Ekip görev tanımı (Person 1 — Architect/Infrastructure) Vite + Context API + react-router-dom v6 + Outlet tabanlı bir HomePage layout istediği için aşağıdaki geçişler yapıldı:

- **Build aracı:** Create React App (`react-scripts`) kaldırıldı, **Vite** ile değiştirildi (`vite.config.js`, kök dizinde `index.html`, `src/main.jsx`).
- **State yönetimi:** `src/redux/` klasörü (slice'lar, store, selector'lar) tamamen kaldırıldı; yerine üç ayrı React Context geldi: `AuthContext`, `BoardContext`, `ThemeContext`.
- **Routing:** `react-router-dom` v7 → v6'ya düşürüldü. `HomePage` artık iş mantığı içermeyen saf bir layout (`Sidebar` + `Header` + `Outlet`); board'a özel mantık `Outlet` üzerinden render edilen `ScreensPage`'e taşındı.
- **Ortam değişkenleri:** `REACT_APP_*` prefix'i Vite'ın beklediği `VITE_*` prefix'ine çevrildi.

### Mock API'den gerçek backend'e geçiş

İlk sürümde backend hazır olmadığı için tüm veri `localStorage` üzerinde mock bir API katmanı ile tutuluyordu. Bu artık değişti: `src/api/mock/` klasörü kaldırıldı, `src/api/*.api.js` dosyaları gerçek HTTP isteklerini `src/api/client.js` üzerinden backend'e atıyor.

## Klasör yapısı

```
src/
├── api/
│   ├── client.js         # fetch wrapper: access token bellekte, 401'de otomatik refresh+retry
│   ├── auth.api.js       # AuthContext'in çağırdığı sabit isimler (login, register, ...)
│   ├── board.api.js      # BoardContext'in çağırdığı sabit isimler (CRUD fonksiyonları)
│   └── help.api.js       # Need Help formu
├── context/
│   ├── AuthContext.jsx   # Kullanıcı oturumu: login, register, logout, updateProfile
│   ├── BoardContext.jsx  # Board/column/card CRUD + aktif board takibi
│   └── ThemeContext.jsx  # dark/light/violet tema + <html data-theme> yönetimi
├── components/
│   ├── Header/
│   ├── Sidebar/
│   ├── ScreensPage/      # Aktif board'un sütun/kart render'ı (route leaf component)
│   └── modals/
├── pages/
│   ├── WelcomePage/      # Giriş öncesi karşılama ekranı
│   ├── AuthPage/         # Login / Register formu
│   └── HomePage/         # Sidebar + Header + <Outlet/> layout'u
├── utils/
│   ├── validationSchemas.js  # Tüm Yup şemaları (login, register, board, column, card...)
│   ├── dateHelpers.js        # Tarih/deadline yardımcı fonksiyonları (date-fns tabanlı)
│   └── storage.js            # Tema tercihi gibi küçük ayarlar için localStorage erişimi
├── App.jsx               # Route tanımları + PrivateRoute/PublicRoute koruma mantığı
└── main.jsx              # Provider ağacı (Auth → Board → Theme) + BrowserRouter

backend/
├── src/
│   ├── server.js          # Express app: cors → helmet → json → cookieParser → router'lar
│   ├── db/
│   │   ├── connectMongo.js
│   │   └── models/        # user.js, session.js, board.js (Mongoose şemaları)
│   ├── routers/           # auth, users, boards, help — route tanımları + Swagger JSDoc
│   ├── controllers/       # HTTP request/response, iş mantığı services'te
│   ├── services/          # İş mantığı, Mongoose sorguları
│   ├── middlewares/        # authenticate, validateBody, rateLimiter, errorHandler, notFoundHandler
│   ├── validation/        # Joi şemaları
│   └── docs/swagger.js     # swagger-jsdoc setup
└── scripts/seed.js         # Demo kullanıcı + örnek board oluşturur (idempotent)
```

## State şeması (Context API)

Redux yerine Context + `useState` kullanıldığı için "state şeması" üç ayrı context'in tuttuğu state'lere karşılık geliyor:

**AuthContext**
```js
{
  user: { id, name, email, avatarUrl } | null,
  isLoggedIn: boolean,
  isLoading: boolean,     // login/register/updateProfile sırasında true
  isRefreshing: boolean,  // sayfa ilk açıldığında oturum kontrolü sürerken true
  error: string | null,
}
```

**BoardContext**
```js
{
  boards: Board[],            // Board: { id, title, icon, background, columns: Column[] }
  activeBoardId: string | null,
  activeBoard: Board | null,  // boards içinden türetilen, ayrı state değil
  isLoading: boolean,
  error: string | null,
}
// Column: { id, title, cards: Card[] }
// Card:   { id, title, description, priority: 'without'|'low'|'medium'|'high', deadline }
```

**ThemeContext**
```js
{
  theme: 'dark' | 'light' | 'violet',
}
```

## Auth/oturum mimarisi (backend)

JWT değil, opak access+refresh token + `sessions` koleksiyonu deseni kullanılıyor:

- Login/register başarılı olduğunda backend bir `Session` dokümanı oluşturur (`accessToken`, `refreshToken`, 15dk/30gün geçerlilik).
- `accessToken` response body'de döner, frontend bunu sadece bellekte tutar (`src/api/client.js`).
- `refreshToken` + `sessionId` `httpOnly` cookie olarak set edilir; prod'da `secure: true, sameSite: 'none'` (frontend Vercel'de, backend Render'da — farklı origin).
- Her authenticated istek `Authorization: Bearer <accessToken>` header'ı taşır. 401 alınırsa `client.js` otomatik `/auth/refresh` çağırıp isteği tekrar dener.
- `/auth/login` ve `/auth/register` rate-limit'li (15 dakikada IP başına 10 deneme) — brute force'a karşı.

## Kullanılan teknolojiler

**Frontend:** React 19, Vite 6, react-router-dom 6, React Context API, react-hook-form + yup, date-fns

**Backend:** Express, Mongoose (MongoDB), Joi, bcrypt, cookie-parser, cors, helmet, express-rate-limit, swagger-jsdoc + swagger-ui-express

## Lokalde çalıştırma

### Backend

```bash
cd backend
cp .env.example .env     # MONGODB_URI'yi kendi local/Atlas bağlantınla doldur
npm install
npm run dev               # http://localhost:3001
npm run seed               # demo hesap + örnek board oluşturur (idempotent)
```

### Frontend

```bash
npm install
npm run dev                # http://localhost:3000, VITE_API_URL .env'den okunur
npm run build               # production build (dist/)
npm run lint                # ESLint
```

Demo giriş bilgileri (`backend/scripts/seed.js` ile oluşturulur):

```
email:    demo@taskpro.com
password: Demo1234
```

## Deploy

- **Frontend:** Vercel, `vercel.json`'daki rewrite kuralı sayesinde client-side route'lar (örn. `/home/:boardId`) hard refresh'te 404 vermiyor.
- **Backend:** Render (Root Directory: `backend`), env var'lar: `MONGODB_URI`, `CLIENT_URL`, `NODE_ENV=production`.
- **Veritabanı:** MongoDB Atlas (M0 free tier).

Detaylı API dokümantasyonu için canlı backend'in `/api/docs` adresine bakın (Swagger UI).
