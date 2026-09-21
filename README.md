# Jai Kisan Engineering Works

## Public frontend

```powershell
npm install
npm run dev
```

The frontend uses the bundled catalogue until `VITE_API_URL` points at a running API. Copy `.env.example` to `.env.local` and set:

```text
VITE_API_URL=http://localhost:5000
```

## Persistent backend

The API lives in `backend/` and uses Express, MongoDB, Mongoose, JWT, and bcryptjs.

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Set these values in `backend/.env` before starting:

- `MONGODB_URI`: your MongoDB connection string
- `JWT_SECRET`: a long random secret
- `ADMIN_EMAIL`: the admin login email
- `ADMIN_PASSWORD_HASH`: a bcrypt hash, never a plain password
- `CLIENT_ORIGIN`: the deployed frontend origin, or `http://localhost:5173` locally

Generate a password hash without putting the password in source control:

```powershell
node -e "import('bcryptjs').then(async ({default:bcrypt})=>console.log(await bcrypt.hash(process.argv[1], 12)))" "replace-this-in-your-terminal"
```

Import the existing 27 products exactly as stored in `src/data/products.js`:

```powershell
npm run seed
npm run dev
```

The public API is `GET /api/products`. Admin writes require a JWT from `POST /api/admin/login`:

- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

Open `/admin/login` in the frontend to manage products. Product images are stored as URLs so uploads do not depend on Vercel's temporary filesystem. Use a persistent image host or object storage URL when adding an image.

## Deployment

Deploy the frontend and backend separately. Set the frontend `VITE_API_URL` to the deployed backend URL. Set backend `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `CLIENT_ORIGIN`, and `PORT` as production environment variables. Do not commit either `.env` file.
