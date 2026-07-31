# Lady D Kitchen

Home-style catering website + admin panel for Lady D Kitchen Catering Services.
Operates in Abuja and Port Harcourt, Nigeria.

## Stack

- Next.js 14 (App Router, JavaScript — no TypeScript)
- Prisma 5.6 + PostgreSQL (Neon)
- Tailwind CSS
- Custom auth (bcrypt + signed cookies + DB sessions)
- Cloudinary (admin dish photos)
- Brevo (transactional email)
- Vercel (hosting)
- WhatsApp Business App (handoff, not automated)

## Local development

```bash
npm install
# Set up .env (see Environment variables below)
npx prisma generate
npm run dev
```

The site runs at http://localhost:3000.

## Environment variables

Required for production (graceful fallback in dev):

- `DATABASE_URL` — Neon Postgres connection string (`postgresql://...`)
- `AUTH_SECRET` — random 32+ char string for cookie signing
- `NEXT_PUBLIC_SITE_URL` — public URL of the deployed site (e.g. https://lady-d-kitchen.vercel.app)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — business WhatsApp number with country code, no spaces (e.g. 2348012345678)
- `BREVO_API_KEY` — Brevo transactional email API key
- `BREVO_SENDER_EMAIL` — verified sender email (e.g. orders@ladydkitchen.com)
- `BREVO_SENDER_NAME` — display name shown in email "from" field (defaults to "Lady D Kitchen Catering Services")
- `CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name
- `CLOUDINARY_UPLOAD_PRESET` — unsigned upload preset name
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — same as CLOUDINARY_CLOUD_NAME but for browser use

See `.env.example` for the full list.

## Admin login

- URL: `/admin/login`
- Default credentials (from seed): `admin@ladydkitchen.local` / `changeme123`
- **Change the password immediately** in production.

## Database

```bash
npx prisma migrate dev --name <name>   # Create + apply a migration
npx prisma migrate deploy              # Apply existing migrations (production)
npm run db:seed                        # Seed zones, dishes, hours, admin
```

## Deploying to Vercel

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Add all the environment variables above in the Vercel project settings.
4. Deploy.
5. After the first deploy, run migrations against the production DB from your local machine:
   ```bash
   DATABASE_URL=<production URL> npx prisma migrate deploy
   DATABASE_URL=<production URL> npm run db:seed
   ```

## Customer flow

1. Customer visits the site, browses `/menu`.
2. Adds dishes to the cart. Cart is stored in a signed cookie.
3. Picks a delivery zone (from admin-configured zones).
4. Clicks "Proceed to checkout" — signs up or signs in.
5. Fills in delivery address, date, time, agrees to Terms.
6. Clicks "Place order via WhatsApp".
7. A unique order ref is generated.
8. WhatsApp opens with a pre-filled, structured message including the ref + items + totals.
9. Order is saved to the DB. Cart is cleared. Customer is redirected to `/order/success/[ref]`.
10. Customer sees the order ref in their account. Order confirmation email is sent.
11. Staff takes over on WhatsApp: confirms availability, shares bank details, collects deposit, marks order as DEPOSIT_CONFIRMED.
12. Order progresses through the pipeline: PREPARING → OUT_FOR_DELIVERY → DELIVERED_PAID.
13. Staff generates a deposit receipt and final receipt from the admin panel.
14. Both receipts appear in the customer's account.

## Admin panel

- `/admin` — Dashboard with stats, "needs attention" (NEW orders), recent orders
- `/admin/orders` — List of all orders, filterable by status
- `/admin/orders/[ref]` — Order detail with status pipeline, rider assignment, receipt generation
- `/admin/dishes` — Catalog management (add, edit, delete, variants, photos)
- `/admin/zones` — Delivery zones + fees
- `/admin/closing-hours` — Weekly schedule + special date overrides
- `/admin/riders` — Dispatch riders
- `/admin/reviews` — Approve/reject customer reviews
- `/admin/events` — Event catering inquiries + booked-date calendar
- `/admin/laditop` — Merchandise/printing inquiries
- `/admin/test-email` — Send a test email to verify Brevo is configured

## Troubleshooting

- **DB connection errors**: Neon free tier auto-pauses after 5 minutes of inactivity. Wake the project in the Neon dashboard, then retry.
- **Order ref generation fails**: Means the DB is unreachable or the `Order` table is missing. Check the Neon dashboard.
- **Email not sending**: Check `BREVO_API_KEY` and `BREVO_SENDER_EMAIL` are set. The admin panel has a "Send a test email" tool at `/admin/test-email` to verify.
- **Photos not uploading**: Check Cloudinary env vars. The unsigned upload preset must allow uploads.
- **WhatsApp handoff shows no number**: Check `NEXT_PUBLIC_WHATSAPP_NUMBER` is set. Must include country code, no spaces.

## Project structure

```
app/              Next.js App Router pages
  (legal)/        Route group for Terms, Privacy, Refund Policy
  account/        Customer account (auth-gated)
  admin/          Admin panel (admin-auth-gated)
  api/            API routes (auth, webhooks)
  checkout/       Checkout flow
  events/         Events inquiry page
  laditop/        Laditop inquiry page
  order/          Order detail, success page
components/       Reusable React components
  account/        Account-specific (ReviewForm, ReceiptBlock, etc.)
  admin/          Admin-specific (AdminShell)
  menu/           Menu-specific (DishGrid, AddToCartButton, etc.)
  order/          Order-specific (OrderLineItem, OrderSummary)
lib/              Library code
  auth/           Auth library (customer + admin)
  cart/           Signed cart cookie
  email/          Brevo wrapper + templates
  hours/          Closing hours helper (isOpenAt)
  menu/           Menu queries + cart resolution
  orders/         Order ref generator, WhatsApp handoff, create
prisma/           Schema + migrations + seed
public/brand/     Logo, favicon, apple-touch-icon
scripts/          One-off scripts
```

## License

Proprietary. © Lady D Kitchen Catering Services. All rights reserved.
