// Initialize EmailJS after SDK loads
document.addEventListener('DOMContentLoaded', function () {
  // TODO: Replace with your real EmailJS public key
  if (window.emailjs) {
    emailjs.init('cEyvUp9mu3LdxH-Oz');
  }

  initApp();
});

function initApp() {
  // Smooth scroll to booking section
  const scrollBtn = document.getElementById('scrollToBookingBtn');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', function () {
      const booking = document.getElementById('booking');
      if (booking) booking.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Set current year
  const yearSpan = document.getElementById('yearSpan');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Services data
  const services = [
    { id: 1, name: 'Regular Washing', price: 99 },
    { id: 2, name: 'Dry Cleaning', price: 199 },
    { id: 3, name: 'Premium Ironing', price: 79 },
    { id: 4, name: 'Wash & Fold', price: 149 },
    { id: 5, name: 'Bedsheets & Curtains', price: 249 },
  ];

  const servicesListEl = document.getElementById('servicesList');
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const emptyCartMessageEl = document.getElementById('emptyCartMessage');
  const clearCartBtn = document.getElementById('clearCartBtn');

  let cart = [];

  let servicesListListenerAttached = false;

  function renderServices() {
    if (!servicesListEl) return;
    servicesListEl.innerHTML = '';
    services.forEach((service) => {
      const cartItem = cart.find((c) => c.id === service.id);
      const quantity = cartItem ? cartItem.qty : 0;
      
      const item = document.createElement('div');
      item.className =
        'flex items-center justify-between bg-slate-50 rounded-xl p-3 border border-slate-100 hover:shadow-sm transition-shadow';
      item.innerHTML = `
        <div class="flex-1">
          <p class="font-medium text-slate-900">${service.name}</p>
          <p class="text-xs text-slate-500">Price: ₹${service.price}</p>
          ${quantity > 0 ? `<p class="text-xs font-medium text-primary mt-1">In cart: ${quantity}</p>` : ''}
        </div>
        <div class="flex items-center gap-2">
          <button
            class="add-btn inline-flex items-center px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-all transform hover:scale-105 active:scale-95 shadow-sm"
            data-id="${service.id}"
            title="Add to cart"
          >
            <span class="mr-1">+</span> Add
          </button>
          <button
            class="remove-btn inline-flex items-center px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-all transform hover:scale-105 active:scale-95 shadow-sm ${quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}"
            data-id="${service.id}"
            title="Remove from cart"
            ${quantity === 0 ? 'disabled' : ''}
          >
            <span class="mr-1">−</span> Remove
          </button>
        </div>
      `;
      servicesListEl.appendChild(item);
    });
  }

  if (servicesListEl && !servicesListListenerAttached) {
    servicesListEl.addEventListener('click', function (e) {
      const btn = e.target && e.target.closest ? e.target.closest('button') : null;
      if (!btn || !servicesListEl.contains(btn)) return;

      const idAttr = btn.getAttribute('data-id');
      if (!idAttr) return;

      const id = parseInt(idAttr, 10);
      if (Number.isNaN(id)) return;

      if (btn.classList.contains('add-btn')) {
        addToCart(id);
      } else if (btn.classList.contains('remove-btn')) {
        removeOneFromCart(id);
      }
    });

    servicesListListenerAttached = true;
  }

  function addToCart(serviceId) {
    const existing = cart.find((c) => c.id === serviceId);
    if (existing) {
      existing.qty += 1;
    } else {
      const service = services.find((s) => s.id === serviceId);
      if (service) cart.push({ ...service, qty: 1 });
    }
    renderServices();
    renderCart();
  }

  function removeOneFromCart(serviceId) {
    const idx = cart.findIndex((c) => c.id === serviceId);
    if (idx > -1) {
      if (cart[idx].qty > 1) {
        cart[idx].qty -= 1;
      } else {
        cart.splice(idx, 1);
      }
    }
    renderServices();
    renderCart();
  }

  function clearCart() {
    cart = [];
    renderServices();
    renderCart();
  }

  function renderCart() {
    if (!cartItemsEl || !cartTotalEl || !emptyCartMessageEl) return;

    cartItemsEl.innerHTML = '';
    if (cart.length === 0) {
      emptyCartMessageEl.classList.remove('hidden');
      cartItemsEl.appendChild(emptyCartMessageEl);
      cartTotalEl.textContent = '₹0';
      return;
    }
    emptyCartMessageEl.classList.add('hidden');

    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.qty;
      const row = document.createElement('div');
      row.className =
        'flex items-center justify-between py-1.5 border-b border-slate-100 last:border-none';
      row.innerHTML = `
        <div>
          <p class="font-medium text-slate-800">${item.name}</p>
          <p class="text-xs text-slate-500">Qty: ${item.qty} × ₹${item.price}</p>
        </div>
        <p class="text-sm font-semibold text-slate-900">₹${item.price * item.qty}</p>
      `;
      cartItemsEl.appendChild(row);
    });
    cartTotalEl.textContent = '₹' + total;
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', clearCart);
  }

  renderServices();
  renderCart();

  // Booking form + EmailJS
  const bookingForm = document.getElementById('bookingForm');
  const bookingMessage = document.getElementById('bookingMessage');
  const bookNowBtn = document.getElementById('bookNowBtn');

  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (cart.length === 0) {
        alert('Please add at least one service to the cart before booking.');
        return;
      }

      const name = document.getElementById('customerName').value.trim();
      const email = document.getElementById('customerEmail').value.trim();
      const phone = document.getElementById('customerPhone').value.trim();

      const serviceSummary = cart
        .map(
          (item) =>
            `${item.name} - Qty: ${item.qty} - ₹${item.price * item.qty}`
        )
        .join('\n');

      const totalAmount = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      );

      const templateParams = {
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        service_list: serviceSummary,
        total_amount: '₹' + totalAmount,
      };

      if (!window.emailjs) {
        alert('EmailJS is not loaded. Please check the script include.');
        return;
      }

      bookNowBtn.disabled = true;
      bookNowBtn.textContent = 'Booking...';

      // TODO: Replace with your own EmailJS service and template IDs
      emailjs
        .send('service_i86gxb4', 'template_okwcarh', templateParams)
        .then(() => {
          if (bookingMessage) bookingMessage.classList.remove('hidden');
          bookingForm.reset();
          clearCart();
        })
        .catch((error) => {
          console.error('EmailJS Error:', error);
          alert(
            'Unable to send booking email. Please check console or try again later.'
          );
        })
        .finally(() => {
          bookNowBtn.disabled = false;
          bookNowBtn.textContent = 'Book Now';
        });
    });
  }

  // Newsletter (simple animation only, no email sending)
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterMessage = document.getElementById('newsletterMessage');
  const subscribeBtn = document.getElementById('subscribeBtn');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!window.emailjs) {
        alert('EmailJS is not loaded. Please check the script include.');
        return;
      }

      const nameInput = document.getElementById('newsletterName');
      const emailInput = document.getElementById('newsletterEmail');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';

      if (!name || !email) {
        alert('Please enter your name and a valid email address.');
        return;
      }

      if (subscribeBtn) {
        subscribeBtn.disabled = true;
        subscribeBtn.textContent = 'Subscribing...';
        subscribeBtn.classList.add('scale-95');
        setTimeout(() => subscribeBtn.classList.remove('scale-95'), 150);
      }

      const templateParams = {
        subscriber_name: name,
        subscriber_email: email,
      };

      // Uses same EmailJS service as booking; replace template ID with your newsletter template
      emailjs
        .send('service_i86gxb4', 'template_8uzvdr6', templateParams)
        .then(() => {
          if (newsletterMessage) {
            newsletterMessage.classList.remove('hidden');
            setTimeout(() => {
              newsletterMessage.classList.add('hidden');
            }, 3000);
          }
          newsletterForm.reset();
        })
        .catch((error) => {
          console.error('EmailJS Newsletter Error:', error);
          alert(
            'Unable to subscribe you to the newsletter right now. Please try again later.'
          );
        })
        .finally(() => {
          if (subscribeBtn) {
            subscribeBtn.disabled = false;
            subscribeBtn.textContent = 'Subscribe';
          }
        });
    });
  }
}
