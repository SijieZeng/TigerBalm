# Image assets (optional — emoji fallback works without them)

Drop real photos here and they swap in automatically (no code change), via
the `<FoodImage>` component. File names must match the `image` paths in
`src/data/mockData.js`.

## Dishes  → `public/images/dishes/`  (JPG)  ✅ all 8 done
- margherita.jpg      ✅ (from pizza.png)
- pasta_pomodoro.jpg  ✅ (from pasta.png)
- caprese.jpg         ✅ (from sandwich.png)
- tomato_soup.jpg     ✅
- aglio_olio.jpg      ✅
- shrimp_pasta.jpg    ✅
- pepperoni.jpg       ✅ (restaurant menu filler)
- breadsticks.jpg     ✅ (restaurant menu filler)

## Ingredients → `public/images/ingredients/`  (PNG transparent, 512×512)  ✅ all 8 done
- tomato.png · basil.png · mozzarella.png · dough.png
- garlic.png · oliveoil.png · chili.png · shrimp.png

## UI → `public/images/ui/`
- pot.png             ✅ have (PNG transparent 600×600)

## Restaurants → `public/images/restaurants/`  (logo/thumbnail JPG)  ✅ done
No hero banner anymore — restaurant page shows just the store name + a small
logo thumbnail (these images), keyed by restaurant id:
- tonys.jpg       ✅  → "Domino's"      (from Domino's.jpg)
- bella.jpg       ✅  → "Spaghetteria"  (from Spaghetteria.jpg)
- green_bowl.jpg  ✅  → "Dolce Verona"  (from Dolce_Verona.jpg)

Until a file exists, the app shows a clean emoji-on-gradient tile (no errors).
