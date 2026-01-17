// Alternar abas principais
function openMainTab(tabId) {
    // Esconde todos os containers e remove classe ativa dos botões
    document.querySelectorAll('.main-container').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    // Ativa o container selecionado
    const targetContainer = document.getElementById(tabId);
    if (targetContainer) targetContainer.classList.add('active');
    
    // Ativa o botão correto procurando pelo atributo onclick que contém o tabId
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(btn => {
        if (btn.getAttribute('onclick').includes(`'${tabId}'`)) {
            btn.classList.add('active');
        }
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
let currentPrice = 0;

// Atualiza a função openCheckout para armazenar o valor
function openCheckout(name, price) {
    currentPrice = price;
    document.getElementById('modal-title').innerText = name;
    document.getElementById('modal-price').innerText = "Valor: R$ " + price.toFixed(2).replace('.', ',');
    
    // Reseta o modal
    document.getElementById('pix-qr-container').style.display = 'none';
    document.getElementById('main-action-btn').style.display = 'block';
    document.getElementById('player-id').value = "";
    
    document.getElementById('modal').style.display = 'flex';
}

function generatePix() {
    const id = document.getElementById('player-id').value;
    if(!id) return alert("Por favor, informe seu ID do jogo!");

    // Chave Pix e Valor
    const pixKey = "augusto.mantai@live.com";
    
    // Gerando URL do QR Code (Exemplo visual via API de QR Code)
    // Nota: Este QR Code redireciona para um link de pagamento ou texto da chave
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ChavePix:${pixKey}-Valor:R$${currentPrice}-ID:${id}`;

    document.getElementById('pix-qr-img').src = qrUrl;
    document.getElementById('pix-qr-container').style.display = 'block';
    document.getElementById('main-action-btn').style.display = 'none'; // Esconde o botão após gerar
    
    alert("QR Code Gerado! Após o pagamento, envie o comprovante no Discord.");
}