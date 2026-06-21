"""Walk the app flow and screenshot each screen/state for visual review."""
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path("_shots")
OUT.mkdir(exist_ok=True)
URL = "http://localhost:5173/"

CLICK_PIN = """() => {
  const b = [...document.querySelectorAll('main button, body button')]
    .find(x => x.className.includes('z-10') && x.className.includes('-translate-x-1/2'));
  if (b) { b.click(); return true } return false;
}"""
CLICK_FAB = """() => {
  const b = [...document.querySelectorAll('button')].find(x => x.className.includes('bottom-44'));
  if (b) { b.click(); return true } return false;
}"""
CLICK_KITCHEN_CARDS = """(n) => {
  const cards = [...document.querySelectorAll('main button')]
    .filter(x => x.className.includes('flex-col') && x.className.includes('rounded-2xl'));
  cards.slice(0, n).forEach(c => c.click());
  return cards.length;
}"""
CLICK_FIRST_COOKED = """() => {
  const b = [...document.querySelectorAll('main button')]
    .find(x => x.className.includes('rounded-3xl') && x.querySelector('img'));
  if (b) { b.click(); return true } return false;
}"""


def shot(page, name):
    page.wait_for_timeout(700)
    page.screenshot(path=str(OUT / name))
    print("  shot", name)


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 820, "height": 960}, device_scale_factor=2)
        page.goto(URL, wait_until="networkidle")
        shot(page, "01_home.png")

        page.click('button[aria-label="Start hunt"]')
        shot(page, "02_map.png")

        # open select sheet on a pin
        page.evaluate(CLICK_PIN)
        shot(page, "03_select_sheet.png")
        page.get_by_text("Pick up", exact=True).click()
        page.wait_for_timeout(500)

        # collect two more (fills backpack to 3)
        for _ in range(2):
            page.evaluate(CLICK_PIN)
            page.wait_for_timeout(400)
            page.get_by_text("Pick up", exact=True).click()
            page.wait_for_timeout(500)
        shot(page, "04_map_collected.png")

        # 4th pickup -> replace modal (backpack full)
        page.evaluate(CLICK_PIN)
        page.wait_for_timeout(400)
        page.get_by_text("Pick up", exact=True).click()
        shot(page, "05_replace_modal.png")
        # dismiss
        page.get_by_text("Cancel", exact=True).click()
        page.wait_for_timeout(400)

        # go to kitchen
        page.evaluate(CLICK_FAB)
        shot(page, "06_kitchen.png")

        # add ingredients to the pot
        page.evaluate(CLICK_KITCHEN_CARDS, 3)
        shot(page, "07_kitchen_pot.png")

        # make -> cooked
        page.get_by_text("Make", exact=False).first.click()
        shot(page, "08_cooked.png")

        # pick first dish -> coupon
        page.evaluate(CLICK_FIRST_COOKED)
        shot(page, "09_coupon.png")

        # order now -> restaurant
        page.get_by_text("Order now", exact=False).first.click()
        shot(page, "10_restaurant.png")

        browser.close()
        print("done.")


if __name__ == "__main__":
    main()
