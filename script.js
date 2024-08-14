const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const modal = document.getElementById("modal")
const cartItems = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCount = document.getElementById("cart-count")
const inputAddress = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];


//Abrir e Fechar modal
cartBtn.addEventListener("click", function () {
    updateCart();
    modal.style.display = "flex"
})

closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none"
})

modal.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none"
    }
})
//Fim Abrir e Fechar modal


//Adicionar Item ao Carrinho
menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn")
    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)

    }
})

function addToCart(name, price) {
    const itemExistente = cart.find(item => item.name === name)
    if (itemExistente) {
        itemExistente.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        })
    }
    updateCart()
}

function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                    <button class="remove-item-btn" data-name="${item.name}">
                        Remover
                    </button>
            </div>
        `
        total += item.price * item.quantity;

        cartItems.appendChild(cartItemElement)
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCount.innerHTML = cart.length;
}


//Fim Adicionar Item ao Carrinho

//Remover Item do Carrinho
cartItems.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-item-btn")) {
        const name = event.target.getAttribute("data-name")
        removeItem(name)
    }
})

function removeItem(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
        const item = cart[index];
        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCart();
            return;
        }
        cart.splice(index, 1);
        updateCart();
    }

}

//Fim Remover Item do Carrinho

//Endereço
inputAddress.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        inputAddress.classList.remove("border-red-500");
        addressWarn.classList.add("hidden")
    }
})

//finalizar pedido
checkoutBtn.addEventListener("click", function () {

    const isOpen = checkOpen();
    if(!isOpen){
        Toastify({
            text: "Ops, o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
          }).showToast();
        return;
    }

    if (cart.length === 0) return;
    if (inputAddress.value === "") {
        addressWarn.classList.remove("hidden")
        inputAddress.classList.add("border-red-500")
        return;
    }
    
    //enviar para api whats
    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")
    
    const message = encodeURIComponent(cartItems)
    const phone = "34997804340"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${inputAddress.value}`, "_blank")

    cart = [];
    updateCart();

})

//Verificar se a loja esta aberta
function checkOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 13 && hora < 22;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.add("bg-red-500")
    spanItem.classList.remove("bg-green-600")
}