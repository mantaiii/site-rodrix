// Alternar abas principais
function openMainTab(tabId) {
    document.querySelectorAll('.main-container').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    
    // Sincroniza o botão ativo
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(btn => {
        if(btn.innerText.toLowerCase().includes(tabId.substring(0,3))) btn.classList.add('active');
    });
}

// Alternar categorias da loja
function showCategory(catId, btn) {
    document.querySelectorAll('.store-category').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(catId).classList.add('active');
    btn.classList.add('active');
}

// Alternar sub-itens
function openSubTab(contentId, className, button) {
    document.querySelectorAll('.' + className).forEach(c => c.classList.remove('active'));
    button.parentElement.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(contentId).classList.add('active');
    button.classList.add('active');
}

// Lógica de Preço
function switchPrice(button, price, period) {
    const card = button.closest('.card-details');
    card.querySelectorAll('.plan-btn').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    
    const priceDisplay = card.querySelector('.price-display');
    const buyBtn = card.querySelector('.buy-btn');
    const productName = card.querySelector('h2').innerText;

    priceDisplay.innerText = "R$ " + price.toFixed(2).replace('.', ',');
    buyBtn.setAttribute('onclick', `openCheckout('${productName} (${period})', ${price})`);
}

// Modal
function openCheckout(name, price) {
    document.getElementById('modal-title').innerText = name;
    document.getElementById('modal-price').innerText = "Valor: R$ " + price.toFixed(2).replace('.', ',');
    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function handlePayment() {
    const id = document.getElementById('player-id').value;
    if(!id) return alert("Por favor, informe seu ID!");
    
    alert("Pedido registrado para o ID: " + id + "\nRealize o pagamento no PIX e envie o comprovante!");
    closeModal();
}

window.onclick = function(event) {
    if (event.target == document.getElementById('modal')) closeModal();
}