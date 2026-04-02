# SEO in Logo Setup - Navodila

## 📱 Faviconi in Ikone - Potrebne slike

Za popolno SEO optimizacijo in branding potrebujete naslednje slike v `public/` direktoriju:

### 1. **favicon.ico** (Obvezno)
- **Velikost**: 32x32 px ali 16x16 px
- **Format**: .ico
- **Opis**: Klasična ikona v brskalniku (zavihek)
- **Kako ustvariti**: Pretvorite logo v .ico format

### 2. **icon.svg** (Priporočeno)
- **Format**: .svg
- **Opis**: Vektorska ikona za moderne brskalnike
- **Prednost**: Ostane ostra na vseh velikostih
- **Kako ustvariti**: Izvozite logo kot SVG

### 3. **apple-touch-icon.png** (Za iOS)
- **Velikost**: 180x180 px
- **Format**: .png
- **Opis**: Ikona ko uporabnik doda na domači zaslon (iPhone/iPad)

### 4. **icon-192.png** (Za Android)
- **Velikost**: 192x192 px
- **Format**: .png
- **Opis**: PWA ikona za Android naprave

### 5. **icon-512.png** (Za Android)
- **Velikost**: 512x512 px
- **Format**: .png
- **Opis**: Večja PWA ikona za Android

### 6. **og-image.png** (Za Social Media)
- **Velikost**: 1200x630 px
- **Format**: .png ali .jpg
- **Opis**: Slika pri deljenju na Facebook, LinkedIn, Twitter
- **Pomembno**: Mora imeti razmerje 1.91:1

---

## 🎨 Kako Ustvariti Te Slike

### Hitra rešitev - Online orodja:
1. **Favicon Generator**: https://realfavicongenerator.net/
   - Naložite svoj logo
   - Ustvari vse potrebne velikosti
   
2. **Canva**: https://www.canva.com/
   - Za ustvarjanje Open Graph slik (1200x630)

### Z Adobe Photoshop/Figma:
1. Odprite vaš ATB logo
2. Izvozite v navedenih velikostih
3. Za favicon.ico uporabite online converter

---

## ✅ Trenutno Implementirano SEO

### Meta Tags ✓
- ✅ Dinamični naslov z template
- ✅ Opis strani (description)
- ✅ Ključne besede (keywords)
- ✅ Open Graph tags (Facebook, LinkedIn)
- ✅ Twitter Card tags
- ✅ Canonical URL
- ✅ Robots meta tags

### Structured Data ✓
- ✅ Schema.org LocalBusiness markup
- ✅ Geografska lokacija
- ✅ Delovni čas
- ✅ Kontaktni podatki

### Tehnično SEO ✓
- ✅ robots.txt datoteka
- ✅ sitemap.xml (avtomatsko generiran)
- ✅ manifest.json za PWA
- ✅ Theme color
- ✅ Jezik nastavljen na slovenščino (sl)

---

## 🔧 Naslednji Koraki

### 1. Dodajte slike v `public/`:
```
public/
├── favicon.ico         ← Dodaj
├── icon.svg           ← Dodaj
├── apple-touch-icon.png ← Dodaj
├── icon-192.png       ← Dodaj
├── icon-512.png       ← Dodaj
├── og-image.png       ← Dodaj (opcijsko, za social media)
└── manifest.json      ✓ Že ustvarjeno
```

### 2. Posodobi kontaktne podatke v `layout.tsx`:
- Telefonska številka (trenutno placeholder: "+386-XX-XXX-XXX")
- Točen naslov podjetja
- GPS koordinate (trenutno za Ljubljano)

### 3. Registriraj strani na:
- **Google Search Console**: https://search.google.com/search-console
  - Preveri lastništvo
  - Pošlji sitemap: `https://www.atb-storitve.si/sitemap.xml`
  
- **Bing Webmaster Tools**: https://www.bing.com/webmasters
  - Enako kot Google

### 4. Dodaj verification kode v `layout.tsx`:
Ko dobiš verification kode iz Google/Bing:
```typescript
verification: {
  google: "tvoj-google-code",
  bing: "tvoj-bing-code",
}
```

---

## 📊 Kako Preveriti SEO

### Online orodja:
1. **PageSpeed Insights**: https://pagespeed.web.dev/
2. **Meta Tags Inspector**: https://metatags.io/
3. **Schema Markup Validator**: https://validator.schema.org/

### Preveri lokalno:
1. Odpri brskalnik → Developer Tools → Elements → `<head>`
2. Preveri ali so vsi meta taggi prisotni

---

## 🚀 Rezultat

Ko dodaš vse slike, boš imel:
- ✅ Profesionalen favicon v brskalniku
- ✅ Lepo ikono na mobilnih napravah
- ✅ Privlačne preview slike pri deljenju na social media
- ✅ Popolno optimizacijo za Google in druge iskalnike
- ✅ PWA ready (Progressive Web App)

---

**Vprašanja?** Vse je pripravljeno - samo še dodaj slike! 🎨
