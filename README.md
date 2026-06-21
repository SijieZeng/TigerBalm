<h1 align="center">Uber Eats Oracle 🔮</h1>

<p align="center"><b>Can't decide what to eat?</b><br/>Hunt ingredients near you → cook a dish → unlock a personalized discount.</p>

<p align="center">
  <img src="public/images/ui/home_mockup.png" width="230" alt="Uber Eats Oracle" />
</p>

---

## 📲 Try it on your phone

<p align="center">
  <a href="https://sijiezeng.github.io/TigerBalm/"><b>https://sijiezeng.github.io/TigerBalm/</b></a>
</p>

<p align="center">
  <img src="qr_webapp.png" width="190" alt="Scan to try" />
</p>

<p align="center"><sub>In WeChat/QQ, tap ··· → <b>Open in browser</b> for the best experience.</sub></p>

---

## 🎮 How it works

```mermaid
flowchart TD
    A["🗺️ Open the map<br/>ingredients drop near you"] --> B{"Tap an ingredient"}
    B -->|"Pick up 👍"| C["🧺 Kitchen<br/>holds 3 · Uber One holds 5"]
    B -->|"Pass 👎"| A
    C --> D["✨ Make<br/>cook with your ingredients"]
    D --> E["🍽️ The Oracle finds 3 cuisines"]
    E --> F["Pick the one you crave"]
    F --> G["🎟️ Discount unlocked"]
    G --> H["🛵 Order Now"]
```

## 💸 Reward = how many ingredients you commit

| Ingredients used | Reward |
| :--: | :-- |
| **1** | 50% off the dish |
| **3** | The dish is **free** |
| **5** | 20% off your whole order |

<sub>Only 1 ingredient enters your bag per day → bigger rewards = a multi-day (and member-gated) investment. Sustainable for restaurants.</sub>

## 🧠 Personalization — the game *is* the data

```mermaid
flowchart LR
    P1["🧺 Pick / Pass history"] --> M["🗺️ Which ingredients drop"]
    P2["🧾 Orders & favorites"] --> R["🍽️ How cuisines rank"]
```

Two fully decoupled signals: what you collect shapes the map; what you order shapes the menu.

## 🛠️ Built with

React · Vite · Tailwind CSS · Framer Motion · 100% mock data (no backend)

## 👩‍💻 Contributors

* **iamwangshuang** - Co-developer
