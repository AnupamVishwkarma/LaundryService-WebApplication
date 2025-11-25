const buttons = document.querySelectorAll(".services-ul button");
const cartBody = document.getElementById("cart-items-body");
const totalPriceEl = document.getElementById("total-price");

let cart = [];

buttons.forEach((button, index) => {
    button.addEventListener("click", function () {
        const li = button.parentElement;
        const serviceName = li.querySelector("p").innerText.split("-")[0].trim();
        const price = parseFloat(li.querySelector("span").innerText.replace(/[^0-9.]/g, ""));

        const existingItem = cart.find(item => item.name === serviceName);

        if (!existingItem) {
            cart.push({ name: serviceName, price: price });

            button.innerText = "Remove Item";
            button.style.backgroundColor = "red";
        } else {
            cart = cart.filter(item => item.name !== serviceName);

            button.innerText = "Add Items";
            button.style.background = "#3ea8f3";
        }

        updateCart();
    });
});

function updateCart() {
    cartBody.innerHTML = "";
    let total = 0;

    const emptyCart = document.getElementById("empty-cart");
    const totalRow = document.querySelector(".total-row");

    totalRow.style.display = "flex";

    if (cart.length === 0) {
        emptyCart.style.display = "table-row";
        document.getElementById("total-price").innerText = "₹0.00";
        return;
    }

    emptyCart.style.display = "none";
    totalRow.style.display = "flex";

    cart.forEach((item, index) => {
        total += item.price;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>₹ ${item.price.toFixed(2)}</td>`;
        cartBody.appendChild(row);
    });

    totalPriceEl.innerText = "₹" + total.toFixed(2);
}

function clearCart(){
    cart = [];
    updateCart();

    document.querySelectorAll(".services-ul button").forEach(btn =>{
        btn.innerText = "Add Items";
        btn.style.background = "#3ea8f3";
    });
}


document.getElementById("bookingForm").addEventListener("submit", function(event){
    event.preventDefault();

    let orderDetails = "";
    let totalAmount = 0;

    cart.forEach((item, index) =>{
        orderDetails += `${index + 1}. ${item.name} - ₹${item.price}\n`;
        totalAmount += item.price;
    });

    if (cart.length === 0){
        document.getElementById("cartWarning").style.display = "block";
        return;
    }

    document.getElementById("cartWarning").style.display = "none";
    const fullName = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if(fullName === "" || email === "" || phone === ""){
        alert("Please fill all fields before booking.");
        return;
    }

    emailjs.send("service_gmikcfh", "template_4do41gw",{
        name : fullName,
        email : email,
        phone : phone,
        order_list : orderDetails,
        total_price : "₹" + totalAmount.toFixed(2)
    })
    .then(() =>{
        document.getElementById("successMsg").style.display = "block";
        document.getElementById("bookingForm").reset();
        clearCart();

        setTimeout(() =>{
            document.getElementById("successMsg").style.display = "none";
        }, 3000);
    })
    .catch((err) =>{
        console.error("Email error", err);
        alert("Something went wrong. Try again.");
    });

});

updateCart();