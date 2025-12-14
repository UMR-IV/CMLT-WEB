document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.product-card');

  productCards.forEach(card => {
    const name = card.querySelector('h3').innerText;
    const desc = productDescriptions[name] || "Short description of the item.";
    
    const p = document.createElement('p');
    p.innerText = desc;
    p.style.whiteSpace = "pre-line"; // allows newlines if needed
    card.insertBefore(p, card.querySelector('.price'));
  });
  // ---------------- LOGIN FORM ----------------
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const address = document.getElementById('address').value;
      localStorage.setItem('shopUser', JSON.stringify({ name, address }));
      document.getElementById('loginModal').style.display = 'none';
    });
  }

  // ---------------- CART SIDEBAR ----------------
  const cartSidebar = document.getElementById('cartSidebar');
  document.getElementById('openCart').addEventListener('click', () => cartSidebar.classList.add('open'));
  document.getElementById('closeCart').addEventListener('click', () => cartSidebar.classList.remove('open'));

  let cart = [];

  // ---------------- VARIATION MODAL ----------------
  const variationModal = document.getElementById('variationModal');
  const flavourOptionsDiv = document.getElementById('flavourOptions');
  const quantityOptionsDiv = document.getElementById('quantityOptions');
  const variationProductName = document.getElementById('variationProductName');
  const variationAddToCart = document.getElementById('variationAddToCart');
  const variationCancel = document.getElementById('variationCancel');
  const variationPriceDiv = document.getElementById('variationPrice');

  let selectedFlavourIndex = -1;   // -1 means none selected
  let selectedQuantityIndex = -1;  // -1 means none selected
  let variations = null;

  variationCancel.addEventListener('click', () => {
    variationModal.style.display = 'none';
  });

  // ---------------- ADD TO CART BUTTONS ----------------
  const addButtons = document.querySelectorAll('.product-card button');
  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const productName = card.querySelector('h3').innerText;
      const variationsData = card.getAttribute('data-variations');

      if (!variationsData) {
        const priceText = card.querySelector('.price').innerText.replace('RM', '').trim();
        const price = parseFloat(priceText) || 0;
        addToCart(productName, price);
        return;
      }

      variations = JSON.parse(variationsData);

      // Reset selections
      selectedFlavourIndex = -1;
      selectedQuantityIndex = -1;
      flavourOptionsDiv.innerHTML = '';
      quantityOptionsDiv.innerHTML = '';

      variationProductName.innerText = productName;

      // Flavour buttons
      variations.flavours.forEach((f, i) => {
        const btnF = document.createElement('button');
        btnF.innerText = f.name;
        btnF.addEventListener('click', () => {
          selectedFlavourIndex = i;
          highlightSelection(flavourOptionsDiv, i);
          updateVariationPrice();
        });
        flavourOptionsDiv.appendChild(btnF);
      });

      // Quantity buttons
      variations.quantities.forEach((q, i) => {
        const btnQ = document.createElement('button');
        btnQ.innerText = q;
        btnQ.addEventListener('click', () => {
          selectedQuantityIndex = i;
          highlightSelection(quantityOptionsDiv, i);
          updateVariationPrice();
        });
        quantityOptionsDiv.appendChild(btnQ);
      });

      // Default price when nothing is selected
      variationPriceDiv.innerText = `Price: RM 0.00`;

      // Add to cart confirmation
      variationAddToCart.onclick = () => {
        if (selectedFlavourIndex === -1 || selectedQuantityIndex === -1) {
          alert('Please select both a flavour and a quantity!');
          return;
        }
        const flavour = variations.flavours[selectedFlavourIndex];
        const quantity = variations.quantities[selectedQuantityIndex];
        const price = flavour.prices[selectedQuantityIndex];
        addToCart(`${productName} (${flavour.name} - ${quantity})`, price);
        variationModal.style.display = 'none';
      };

      variationModal.style.display = 'flex';
    });
  });

  // ---------------- HELPER FUNCTIONS ----------------
  function highlightSelection(container, index) {
    Array.from(container.children).forEach((btn, i) => {
      btn.classList.toggle('selected', i === index);
    });
  }

  function updateVariationPrice() {
    if (!variations || selectedFlavourIndex === -1 || selectedQuantityIndex === -1) {
      variationPriceDiv.innerText = `Price: RM 0.00`;
      return;
    }
    const flavour = variations.flavours[selectedFlavourIndex];
    const quantity = variations.quantities[selectedQuantityIndex];
    const price = flavour.prices[selectedQuantityIndex];
    variationPriceDiv.innerText = `Price: RM ${price.toFixed(2)}`;
  }

  function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) existing.quantity += 1;
    else cart.push({ name, price, quantity: 1 });
    updateCart();
    cartSidebar.classList.add('open');
  }

  function updateCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    cartItemsDiv.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
    } else {
      cart.forEach(item => {
        total += item.price * item.quantity;
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `<span>${item.name} x ${item.quantity}</span><span>RM ${(item.price * item.quantity).toFixed(2)}</span>`;
        cartItemsDiv.appendChild(div);
      });
    }

    document.getElementById('cartTotal').innerText = total.toFixed(2);
  }
});

const productDescriptions = {
  "Sardine Puff (25pcs)": "🥐 Hand laminated pastry\n🌶️ Pedas rate (6/10)\n🌟 Crunchy bila makan panas panas\n😋 10/10 insyallah",
  "Japanese Cream Puff (40pcs)": "🧊 Crunchy di atas bila sejuk\n🌟 Ice creamy like\n🧒 Children will love this!\n😋 10/10 insyallah",
  "Eclairs (30pcs)": "🍫 Dark chocolate berkualiti\n🧒 Children mesti suka sangat!\n🌟 Yang penting rasa tak manis sangat\n😋 10/10 insyallah",
  "Congo Bars/Blondies 9\"": "🍰 Definetely ramai yang suka\n🍫 Dark Chocolate\n😋 10/10 insyallah",
  "Pandan Gula Melaka Cake": "🧁 Available in cuppies of 12(RM60 @25 RM125)\n🌟 Paling favourite mak mak\n😋 10/10 insyallah",
  "Brownies (Hazelnut Topping)": "Fudgy brownies topped with crunchy hazelnuts.",
  "Pannacotta (6/12/25 pcs)": "Smooth creamy dessert available in multiple flavours.",
  "Cheestarts (49pcs)": "Savory cheese tarts with golden crust.",
  "Creme Brulee": "Classic creamy dessert with caramelized sugar top."
  // Add more products here
};