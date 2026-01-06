ਇਹ ਇੱਕ [Next.js](https://nextjs.org) ਪ੍ਰੋਜੈਕਟ ਹੈ ਜੋ [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) ਨਾਲ ਬੂਟਸਟਰੈਪ ਕੀਤਾ ਗਿਆ ਹੈ।

## ਸ਼ੁਰੂਆਤ ਕਰਨਾ

ਸਭ ਤੋਂ ਪਹਿਲਾਂ, ਵਿਕਾਸ ਸਰਵਰ (development server) ਚਲਾਓ:

```bash
npm run dev
# ਜਾਂ
yarn dev
# ਜਾਂ
pnpm dev
# ਜਾਂ
bun dev
```

ਨਤੀਜਾ ਦੇਖਣ ਲਈ ਆਪਣੇ ਬ੍ਰਾਊਜ਼ਰ ਨਾਲ [http://localhost:3000](http://localhost:3000) ਖੋਲ੍ਹੋ।

ਤੁਸੀਂ `app/page.tsx` ਨੂੰ ਸੋਧ ਕੇ ਪੰਨੇ ਨੂੰ ਸੰਪਾਦਿਤ ਕਰਨਾ ਸ਼ੁਰੂ ਕਰ ਸਕਦੇ ਹੋ। ਜਿਵੇਂ ਤੁਸੀਂ ਫਾਈਲ ਨੂੰ ਸੰਪਾਦਿਤ ਕਰਦੇ ਹੋ ਪੰਨਾ ਆਪਣੇ ਆਪ ਅੱਪਡੇਟ ਹੋ ਜਾਂਦਾ ਹੈ।

ਇਹ ਪ੍ਰੋਜੈਕਟ [Geist](https://vercel.com/font) ਨੂੰ ਸਵੈਚਲਿਤ ਤੌਰ 'ਤੇ ਅਨੁਕੂਲਿਤ ਕਰਨ ਅਤੇ ਲੋਡ ਕਰਨ ਲਈ [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) ਦੀ ਵਰਤੋਂ ਕਰਦਾ ਹੈ, ਜੋ ਕਿ Vercel ਲਈ ਇੱਕ ਨਵਾਂ ਫੌਂਟ ਪਰਿਵਾਰ ਹੈ।

## ਹੋਰ ਜਾਣੋ

Next.js ਬਾਰੇ ਹੋਰ ਜਾਣਨ ਲਈ, ਹੇਠਾਂ ਦਿੱਤੇ ਸਰੋਤਾਂ 'ਤੇ ਇੱਕ ਨਜ਼ਰ ਮਾਰੋ:

- [Next.js ਦਸਤਾਵੇਜ਼](https://nextjs.org/docs) - Next.js ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਅਤੇ API ਬਾਰੇ ਜਾਣੋ।
- [Next.js ਸਿੱਖੋ](https://nextjs.org/learn) - ਇੱਕ ਇੰਟਰਐਕਟਿਵ Next.js ਟਿਊਟੋਰਿਅਲ।

ਤੁਸੀਂ [Next.js GitHub ਰਿਪੋਜ਼ਟਰੀ](https://github.com/vercel/next.js) ਦੇਖ ਸਕਦੇ ਹੋ - ਤੁਹਾਡੇ ਫੀਡਬੈਕ ਅਤੇ ਯੋਗਦਾਨਾਂ ਦਾ ਸੁਆਗਤ ਹੈ!

## Vercel 'ਤੇ ਤੈਨਾਤ (Deploy) ਕਰੋ

ਤੁਹਾਡੀ Next.js ਐਪ ਨੂੰ ਤੈਨਾਤ ਕਰਨ ਦਾ ਸਭ ਤੋਂ ਆਸਾਨ ਤਰੀਕਾ Next.js ਦੇ ਸਿਰਜਣਹਾਰਾਂ ਤੋਂ [Vercel ਪਲੇਟਫਾਰਮ](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) ਦੀ ਵਰਤੋਂ ਕਰਨਾ ਹੈ।

ਹੋਰ ਵੇਰਵਿਆਂ ਲਈ ਸਾਡੇ [Next.js ਤੈਨਾਤੀ ਦਸਤਾਵੇਜ਼](https://nextjs.org/docs/app/building-your-application/deploying) ਦੇਖੋ।
