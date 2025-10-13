// BOOKING SECTION ----------
let total = 0;

function addToCart(service, price) {
  const cartList = document.getElementById("cartItems");

  // Create list item
  const item = document.createElement("li");
  item.textContent = `${service} - ₹${price}`;

  // Create remove button
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.style.marginLeft = "10px";
  removeBtn.style.background = "red";
  removeBtn.style.color = "white";
  removeBtn.style.border = "none";
  removeBtn.style.padding = "5px 10px";
  removeBtn.style.borderRadius = "5px";
  removeBtn.style.cursor = "pointer";

  removeBtn.onclick = function() {
    cartList.removeChild(item);
    total -= price;
    updateTotal();
  }

  item.appendChild(removeBtn);
  cartList.appendChild(item);

  total += price;
  updateTotal();
}

function updateTotal() {
  document.getElementById("totalPrice").innerHTML = `<strong>Total:</strong> ₹${total}`;
}

// Confirm Booking Button
document.getElementById("confirmBooking").addEventListener("click", () => {
  if (total === 0) {
    alert("Please add at least one service to book!");
    return;
  }
  alert("🎉 Booking Confirmed! We'll pick up your laundry soon.");
  document.getElementById("cartItems").innerHTML = "";
  total = 0;
  updateTotal();
});

// Booking Form Submission
document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("bookingForm");
  const cartList = document.getElementById("cartItems");
  const totalPrice = document.getElementById("totalPrice");

  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    if (total === 0) {
      alert("🧺 Please select at least one service before booking!");
      return;
    }

    alert("🎉 Booking Confirmed! We'll pick up your laundry soon 🚚");
    bookingForm.reset();
    cartList.innerHTML = "";
    total = 0;
    totalPrice.innerHTML = `<strong>Total:</strong> ₹0`;
  });
});

//  NEWSLETTER SECTION ----------
document.addEventListener("DOMContentLoaded", () => {
  const newsletterBtn = document.querySelector(".newsletter button");
  const newsletterInput = document.querySelector(".newsletter input");

  newsletterBtn.addEventListener("click", () => {
    const email = newsletterInput.value.trim();
    if (email === "") {
      alert("📩 Please enter your email before subscribing!");
    } else {
      alert(`💙 Thanks for subscribing, ${email}!`);
      newsletterInput.value = "";
    }
  });
});

//  NAVBAR HIGHLIGHT ----------
const navLinks = document.querySelectorAll("nav ul li a");

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});

//  SMOOTH SCROLL ----------
navLinks.forEach(link => {
  link.addEventListener("click", function(e) {
    if (this.hash !== "") {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ---------- SERVICE CARD HOVER EFFECT ----------
const serviceCards = document.querySelectorAll(".service-card-booking");

serviceCards.forEach(card => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "scale(1.05)";
    card.style.boxShadow = "0 12px 30px rgba(0,0,0,0.2)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "scale(1)";
    card.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
  });
});
