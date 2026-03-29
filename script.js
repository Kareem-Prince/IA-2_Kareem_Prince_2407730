document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registrationForm = document.querySelector(".Registration-box form");

    
    // REGISTRATION LOGIC
    if (registrationForm) {
        registrationForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = registrationForm.querySelector('input[type="email"]').value.trim();
            const password = registrationForm.querySelector('input[type="password"]').value.trim();

            if (!email || !password) {
                alert("Please fill in all fields!");
                return;
            }

            let users = JSON.parse(localStorage.getItem("users")) || [];

            const userExists = users.some(user => user.email === email);

            if (userExists) {
                alert("This email is already registered!");
            } else {
                users.push({ email, password });
                localStorage.setItem("users", JSON.stringify(users));

                alert("Registration Successful! Redirecting to Login...");
                window.location.href = "Login.html";
            }
        });
    }

 
    // LOGIN LOGIC
  
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value.trim();

            let users = JSON.parse(localStorage.getItem("users")) || [];

            const validUser = users.find(
                user => user.email === email && user.password === password
            );

            if (validUser) {
                localStorage.setItem("loggedInUser", email);
                alert("Login Successful! Welcome, " + email);
                window.location.href = "Products.html";
            } else {
                alert("Invalid Email or Password. Please register if you haven't!");
            }
        });
    }
});



// product data with prices
const productsData = [
    { name: "Smart Alexa", price: 15000 },
    { name: "Smart Doorbell", price: 8000 },
    { name: "Smart Vacuum", price: 30000 },
    { name: "Smart Lock", price: 18000 },
    { name: "Motion Sensor", price: 17000 },
];


// ADD TO CART
document.addEventListener("DOMContentLoaded", () => {
    const cartButtons = document.querySelectorAll(".add-to-cart");
    cartButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const productName = button.getAttribute("data-name");
            const productData = productsData.find(p => p.name === productName);

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            // If product already in cart, increase quantity
            const existingProduct = cart.find(item => item.name === productName);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push({ name: productName, price: productData.price, quantity: 1 });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            alert(`${productName} added to cart!`);
        });
    });

    // Display cart if cart table exists
    if (document.querySelector("#cartTable")) {
        displayCart();
    }

    // Display checkout summary if summaryList exists
    if (document.querySelector("#summaryList")) {
        displayCheckoutSummary();
    }
});


// DISPLAY CART
function displayCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const tbody = document.querySelector("#cartTable tbody");
    const discountEl = document.getElementById("discount");
    const taxEl = document.getElementById("tax");
    const totalEl = document.getElementById("total");

    tbody.innerHTML = "";

    let subtotal = 0;

    cart.forEach((product, index) => {
        const itemSubtotal = product.price * product.quantity;
        subtotal += itemSubtotal;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.price.toFixed(2)}</td>
            <td>${product.quantity}</td>
            <td>${itemSubtotal.toFixed(2)}</td>
            <td><button onclick="removeFromCart(${index})">Remove</button></td>
        `;
        tbody.appendChild(row);
    });

    const discount = subtotal * 0.05; // 5% discount
    const tax = (subtotal - discount) * 0.1; // 10% tax
    const total = subtotal - discount + tax;

    if(discountEl) discountEl.textContent = discount.toFixed(2);
    if(taxEl) taxEl.textContent = tax.toFixed(2);
    if(totalEl) totalEl.textContent = total.toFixed(2);
}


// REMOVE ITEM
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}


// CLEAR CART Function
const clearCartBtn = document.getElementById("clearCart");
if(clearCartBtn){
    clearCartBtn.addEventListener("click", () => {
        localStorage.removeItem("cart");
        displayCart();
        alert("Cart cleared!");
    });
}

// DISPLAY CHECKOUT SUMMARY
function displayCheckoutSummary(){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const summaryList = document.getElementById("summaryList");
    const totalItems = document.getElementById("totalItems");
    const totalCost = document.getElementById("totalCost");

    if(!summaryList) return;

    summaryList.innerHTML = "";

    let subtotal = 0;
    cart.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;

        const li = document.createElement("li");
        li.textContent = `${item.name} - $${item.price} x ${item.quantity} = $${itemSubtotal.toFixed(2)}`;
        summaryList.appendChild(li);
    });

    const discount = subtotal * 0.05;
    const tax = (subtotal - discount) * 0.1;
    const total = subtotal - discount + tax;

    if(totalItems) totalItems.textContent = cart.length;
    if(totalCost) totalCost.textContent = total.toFixed(2);
}



