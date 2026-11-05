let menu = { categories: [], items: [] };
let currentCategory = null;

// ---------- Navigation ----------
function show(id) {
  document.querySelectorAll(".screen").forEach(s => (s.hidden = true));
  document.getElementById(id).hidden = false;
}

// ---------- Helpers ----------
// Prices are stored as whole numbers (150.00 -> 15000) to avoid decimal bugs.
function formatPrice(cents) {
  return "₱" + (cents / 100).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function makeIcon(src) {
  const img = document.createElement("img");
  img.src = "/" + src;
  img.alt = "";
  img.onerror = () => img.remove(); // hide if the icon file is missing
  return img;
}

// ---------- Rendering ----------
function renderCategories() {
  const box = document.getElementById("categories");
  box.innerHTML = "";
  menu.categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "cat" + (cat.id === currentCategory ? " active" : "");
    btn.appendChild(makeIcon(cat.icon));
    btn.appendChild(document.createTextNode(cat.name));
    btn.onclick = () => selectCategory(cat.id);
    box.appendChild(btn);
  });
}

function renderItems() {
  const box = document.getElementById("items");
  box.innerHTML = "";
  const cat = menu.categories.find(c => c.id === currentCategory);
  document.getElementById("category-title").textContent = cat ? cat.name : "";

  menu.items
    .filter(i => i.category_id === currentCategory)
    .forEach(item => {
      const card = document.createElement("div");
      card.className = "item" + (item.available ? "" : " sold-out");
      card.appendChild(makeIcon(item.icon));

      const name = document.createElement("div");
      name.className = "item-name";
      name.textContent = item.name;

      const price = document.createElement("div");
      price.className = "item-price";
      price.textContent = item.available ? formatPrice(item.price) : "Sold out";

      card.append(name, price);
      card.onclick = () => console.log("Tapped item", item.id); // cart comes next
      box.appendChild(card);
    });
}

function selectCategory(id) {
  currentCategory = id;
  renderCategories();
  renderItems();
}

// ---------- Startup ----------
async function loadMenu() {
  const res = await fetch("/api/menu");
  menu = await res.json();
  if (menu.categories.length) selectCategory(menu.categories[0].id);
}

loadMenu();
