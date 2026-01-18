let currentPrice = 0;

// Navegação entre seções principais (Início, Suporte, Gangues, VIPs)
function navigate(targetId) {
    // 1. Esconder todos os containers
    const containers = document.querySelectorAll('.main-container');
    containers.forEach(c => {
        c.classList.remove('active');
    });

    // 2. Desativar todos os botões da sidebar
    const buttons = document.querySelectorAll('.side-btn');
    buttons.forEach(b => b.classList.remove('active'));

    // 3. Mostrar o container alvo
    const target = document.getElementById(targetId);
    if (target) {
        target.classList.add('active');
    }

    // 4. Ativar o botão correspondente na sidebar
    buttons.forEach(btn => {
        if (btn.getAttribute('onclick').includes(`'${targetId}'`)) {
            btn.classList.add('active');
        }
    });

    // Scroll para o topo ao navegar
    document.querySelector('.main-content').scrollTop = 0;
}

// Controle de Sub-Abas (Categorias de Gangues: Pequena, Média, Grande)
function openSubTab(tabId, className, btn) {
    // Esconder conteúdos da classe (ex: gang-content)
    document.querySelectorAll('.' + className).forEach(el => el.classList.remove('active'));
    
    // Mostrar aba selecionada
    document.getElementById(tabId).classList.add('active');
    
    // Atualizar estado dos botões da sub-nav
    btn.parentElement.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// Atualização de Preço e Plano (Troca 30D, 60D, PERM)
function updatePrice(button, price, planName, productName) {
    const card = button.closest('.card-details');
    
    // 1. Atualizar estilo do botão de plano clicado
    card.querySelectorAll('.plan-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // 2. Atualizar o visor de preço no card
    const priceDisplay = card.querySelector('.price-display');
    if (priceDisplay) {
        priceDisplay.innerText = `R$ ${price.toFixed(2).replace('.', ',')}`;
    }
    
    // 3. Atualizar o evento do botão de compra principal para levar o novo preço/plano
    const buyBtn = card.querySelector('.buy-btn');
    if (buyBtn) {
        buyBtn.setAttribute('onclick', `openCheckout('${productName} (${planName})', ${price})`);
    }
}

// Barra de Busca
function searchProducts() {
    let input = document.getElementById('site-search').value.toLowerCase();
    let cards = document.querySelectorAll('.product-compact-card, .vip-card');
    
    cards.forEach(card => {
        let text = card.innerText.toLowerCase();
        // Se o texto incluir a busca, mostra o card, senão esconde
        card.style.display = text.includes(input) ? "" : "none";
    });
}

// Modal de Checkout
function openCheckout(name, price) {
    currentPrice = price;
    document.getElementById('modal-title').innerText = name;
    document.getElementById('modal-price').innerText = "Valor Final: R$ " + price.toFixed(2).replace('.', ',');
    
    // Limpar estado anterior do modal
    document.getElementById('pix-qr-container').style.display = 'none';
    document.getElementById('main-action-btn').style.display = 'block';
    document.getElementById('player-id').value = "";
    
    document.getElementById('modal-checkout').style.display = 'flex';
}

function generatePix() {
    const id = document.getElementById('player-id').value;
    if(!id || id.trim().length < 2) {
        return alert("Por favor, informe seu ID ou Nome para identificação!");
    }

    const pixKey = "augusto.mantai@live.com";
    // QR Code dinâmico via API externa (apenas visual para este exemplo)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Chave:${pixKey}|Valor:${currentPrice}|ID:${id}`;

    document.getElementById('pix-qr-img').src = qrUrl;
    document.getElementById('pix-qr-container').style.display = 'block';
    document.getElementById('main-action-btn').style.display = 'none';
}

function closeModal() {
    document.getElementById('modal-checkout').style.display = 'none';
}

// Fechar modal ao clicar na área escura (overlay)
window.onclick = function(event) {
    const modal = document.getElementById('modal-checkout');
    if (event.target == modal) {
        closeModal();
    }
}