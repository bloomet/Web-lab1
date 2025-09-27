document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = 'cart';

  const basketBtn = document.querySelector(".sb"); 
  const modal = document.getElementById("cart-modal");
  const overlay = modal.querySelector(".cart-overlay");
  const closeBtn = modal.querySelector(".close-cart");
  const cartItems = document.getElementById("cart-items");
  const cartSum = document.getElementById("cart-sum");
  const orderForm = document.getElementById("order-form");

  function getCart() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }
  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }
  function parsePrice(text) {
    return parseInt(String(text).replace(/\D/g, ""), 10) || 0;
  }
  function formatRub(n) {
    return n.toLocaleString("ru-RU") + " ₽";
  }

  document.querySelectorAll(".card").forEach(card => {
    const btn = card.querySelector("button");
    const name = card.querySelector(".name_gr p").textContent.trim();
    const price = parsePrice(card.querySelector(".price p").textContent);
    const img = card.querySelector("img").getAttribute("src");
    const id = name.toLowerCase().replace(/\s+/g, "-");

    btn.addEventListener("click", () => {
        const cart = getCart();
        const idx = cart.findIndex(i => i.id === id);
        if (idx >= 0) cart[idx].qty++;
        else cart.push({ id, name, price, img, qty: 1 });
        saveCart(cart);
    });
  });

  basketBtn.addEventListener("click", e => {
    e.preventDefault();
    renderCart();
    modal.classList.add("active");
  });
  overlay.addEventListener("click", () => modal.classList.remove("active"));
  closeBtn.addEventListener("click", () => modal.classList.remove("active"));

  function renderCart() {
    const cart = getCart();
    cartItems.innerHTML = "";
    if (cart.length === 0) {
      cartItems.innerHTML = "<p>Корзина пуста</p>";
      cartSum.textContent = "0 ₽";
      return;
    }
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.qty;
      const row = document.createElement("div");
      row.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;">
          <img src="${item.img}" alt="">
          <span>${item.name}</span>
        </div>
        <div>
          ${formatRub(item.price)} × 
          <input type="number" min="1" value="${item.qty}" style="width:50px"> 
          = ${formatRub(item.price * item.qty)}
          <button class="remove">&times;</button>
        </div>
      `;
      const input = row.querySelector("input");
      const removeBtn = row.querySelector(".remove");
      input.addEventListener("change", () => {
        item.qty = Math.max(1, parseInt(input.value) || 1);
        saveCart(cart);
        renderCart();
      });
      removeBtn.addEventListener("click", () => {
        const idx = cart.findIndex(i => i.id === item.id);
        cart.splice(idx, 1);
        saveCart(cart);
        renderCart();
      });
      cartItems.appendChild(row);
    });
    cartSum.textContent = formatRub(total);
  }

  orderForm.addEventListener("submit", e => {
    e.preventDefault();
    const cart = getCart();
    if (cart.length === 0) {
      alert("Корзина пуста!");
      return;
    }
    alert("Заказ создан!");
    localStorage.removeItem(STORAGE_KEY);
    orderForm.reset();
    renderCart();
  });
});
