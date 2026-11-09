import menuArray from "./data.js";

const orders = [];

document.addEventListener("click", function (event) {
  if (event.target.dataset.orderBtn) {
    const selectedItem = getMenuItem(Number(event.target.dataset.orderBtn));

    if (!orders.includes(selectedItem)) {
      orders.push(selectedItem);
    }

    renderOrderSummary();
  }

  if (event.target.dataset.removeBtn) {
    const indexOfRemoved = orders.findIndex(
      (order) => order.id === Number(event.target.dataset.removeBtn),
    );
    removeFromOrders(indexOfRemoved);
  }

  if (event.target.id === "complete-order-btn") {
    openCheckoutModal();
  }

  if (event.target.id === "modal-backdrop") {
    closeCheckoutModal();
  }

  if (event.target.id === "pay-btn") {
    const checkoutForm = document.getElementById("checkout-form");

    if (!checkoutForm.reportValidity()) return;

    const checkoutFormData = new FormData(checkoutForm);
    completeOrder(checkoutFormData.get("name"));
    checkoutForm.reset();
  }
});

document.addEventListener("keydown", function (event) {
  const isModalOpen = !document
    .getElementById("checkout-modal")
    .classList.contains("hidden");

  if (event.key === "Escape" && isModalOpen) {
    closeCheckoutModal();
  }
});

function completeOrder(name) {
  closeCheckoutModal();
  orders.length = 0;

  document.getElementById("order-section").classList.add("hidden");
  document.getElementById("order-complete-message").textContent =
    `Thanks, ${name}! Your order is on its way!`;
  document.getElementById("order-complete").classList.remove("hidden");
}

function openCheckoutModal() {
  document.getElementById("checkout-modal").classList.remove("hidden");
  document.getElementById("modal-backdrop").classList.remove("hidden");
  document.getElementById("name").focus();
}

function closeCheckoutModal() {
  document.getElementById("checkout-modal").classList.add("hidden");
  document.getElementById("modal-backdrop").classList.add("hidden");
}

function getMenusHtml(arr) {
  return arr
    .map((item) => {
      const { name, ingredients, id, price, emoji } = item;
      return `
            <li class="menu-item">
                <div class="item">

                    <div class="item-details">
                        <span class="emoji">${emoji}</span>
                        <div class="item-details-info">
                            <h2>${name}</h2>
                            <p>${ingredients.join(", ")}</p>
                            <span>$${price}</span>
                        </div>
                    </div>
                    <button
                        type="button"
                        id="btn-order-${id}"
                        class="order-btn"
                        data-order-btn="${id}"
                    >+</button>
                </div>
            </li>
        `;
    })
    .join("");
}

function getMenuItem(itemId) {
  return menuArray.find((item) => item.id === itemId);
}

function getOrdersHtml(orders) {
  return orders
    .map((order) => {
      return `
            <li class="order-item">
                <div class="left">
                    <p>${order.name}</p>
                    <button class="remove-btn" data-remove-btn="${order.id}">remove</button>
                </div>
                <div class="right">
                    <p>$${order.price}</p>
                </div>
            </li>
        `;
    })
    .join("");
}

function renderOrderSummary() {
  document.getElementById("order-complete").classList.add("hidden");
  document
    .getElementById("order-section")
    .classList.toggle("hidden", orders.length === 0);

  document.getElementById("order-list").innerHTML = getOrdersHtml(orders);

  document.getElementById("order-summary-total").textContent =
    "$" + orders.reduce((total, current) => total + current.price, 0);
}

function removeFromOrders(index) {
  orders.splice(index, 1);

  renderOrderSummary();
}

function render() {
  document.getElementById("menu-items").innerHTML = getMenusHtml(menuArray);
}

render();
