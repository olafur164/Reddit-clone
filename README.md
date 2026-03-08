# Reddit clone

## Helstu tól og libs

- Nextjs
- Tailwind
- ShadCN
- Turbo

Ástæðan fyrir að ég nota NextJS og Turbo er bara að ég er vanur að setja upp slíkt umhverfi og er fljótur að því.

Þessi clone er frekar einfaldur en mesta vinnan er í post.tsx undir apps/nextjs/src/app/\_components/post.tsx

Ég setti upp proxy route til þess að komast fram hjá cors villum undir apps/nextjs/src/app/api/reddit/[...path]/route.ts

apps/nextjs/src/app/r/[subreddit]/page.tsx birtir hvaða subreddit sem er þannig http://localhost:3000/r/dotnet eða hvað sem er.
Kemur hydration warning útaf serverside rendering en af einhverri ástæðu er upvotes að breytast í hverju kalli en engin breyting á póstum inn á reddit síðunni sjálfri. Nenni ekki að skoða þetta en myndi lagast við að láta server side prefetcha gögnin þannig að framendinn þurfi þess ekki en þá myndi hvort sem er talan breytast þó hún sé í raun ekki að breytast að ég held á 30 sekundna fresti þar sem ég er með react query stillt að gögn verða stale eftir 30sek

apps/nextjs/src/app/r/[subreddit]/comments/[postId] er til þess að birta postin

Notaðist við claude ai til að generate-a reddit-types.tsx fyrir mig.

## Known limitations or things you would improve given more time

- Upvotes er eitthvað funky eins og ég nefni hér að ofan
- Með meiri tíma þá myndi ég eflaust gera ui-ið eitthvað meira næs, icons og fleira í þeim dúr, en ég myndi eflaust alltaf halda í eigin stíl frekar en að herma eftir útlitinu á reddit.
- Luxon notast við INTL og það er gallað í íslensku en gæti lagað það með polyfill eða láta serverinn rendera alltaf dates(sem er eflaust aðeins meiri vinna en að polyfilla)
- Ég myndi aðeins hreinsa í post.tsx og hafa í fleiri fælum en þessum eina til þess að gefa betri lesanleika.
- RedditMore í posts.tsx implementa þannig að það sé hægt að sækja comments sem eru out of depth. Gerði fetch fn fyrir það getPostMoreComments en ekki búinn að klára implmentationið.
- Með meiri tíma þá myndi ég eflaust bæta navigation og leit og svona á hin ýmsu subreddits

## Getting started

Start by installing npm packages with pnpm, if you do not have pnpm installed then install pnpm via homebrew on mac or chocolatey install pnpm on windows in powershell, lookup further if you want on pnpm homepage.

From repository root run

```bash
pnpm install
```

After installing npm packages, then from repository root run

```bash
pnpm dev
```

open http://localhost:3000
