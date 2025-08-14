document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURAÇÕES E BANCO DE DADOS ---
    const WHATSAPP_NUMBER = "5511999999999"; // <-- TROQUE PELO SEU NÚMERO DE WHATSAPP

    const produtos = [
        {
            id: 1,
            nome: "Vestido Elegante",
            preco: 799.90,
            descricao: "Um vestido deslumbrante em tecido fluido, com caimento perfeito e um ombro só. Ideal para casamentos e formaturas.",
            imagens: ['A.jpg', 'A.jpg'],
            cores: ["Rosa", "Branco", "Preto"],
            tamanhos: ["PP", "P", "M", "G"]
        },
        {
            id: 2,
            nome: "Blazer de Alfaiataria",
            preco: 649.50,
            descricao: "Corte de alfaiataria impecável em linho nobre. Este blazer eleva qualquer look, do casual ao formal.",
            imagens: ['B.jpg', 'B.jpg'],
            cores: ["Bege", "Branco Off-white", "Preto"],
            tamanhos: ["P", "M", "G"]
        },
        {
            id: 3,
            nome: "Conjunto de Cetim",
            preco: 589.00,
            descricao: "Elegância e conforto se unem neste conjunto de cetim com brilho sutil. Perfeito para criar looks sofisticados e modernos.",
            imagens: ['C.jpg', 'C.jpg'],
            cores: ["Champagne", "Preto", "Vinho"],
            tamanhos: ["36", "38", "40", "42"]
        },
        {
            id: 4,
            nome: "Saia Midi Plissada",
            preco: 499.90,
            descricao: "Um clássico moderno, a saia midi plissada é versátil e feminina, com um brilho sutil e elegante.",
            imagens: ['D.jpg', 'D.jpg'],
            cores: ["Rosa Chá", "Lilás", "Prata"],
            tamanhos: ["P", "M", "G", "GG"]
        },
        {
            id: 5,
            nome: "Camisa de Seda",
            preco: 350.00,
            descricao: "Peça chave para qualquer guarda-roupa, esta camisa de seda combina com saias, calças e shorts de cintura alta.",
            imagens: ['F.jpg', 'F.jpg'],
            cores: ["Branco", "Rosa", "Azul Claro"],
            tamanhos: ["P", "M", "G"]
        },
        {
            id: 6,
            nome: "Camisa de Seda",
            preco: 350.00,
            descricao: "Peça chave para qualquer guarda-roupa, esta camisa de seda combina com saias, calças e shorts de cintura alta.",
            imagens: ['H.jpg', 'H.jpg'],
            cores: ["Branco", "Rosa", "Azul Claro"],
            tamanhos: ["P", "M", "G"]
        }
    ];

    // --- ESTADO DA APLICAÇÃO ---
    let cart = [];

    // --- SELETORES DO DOM ---
    const selectors = {
        preloader: document.getElementById('preloader'),
        productGrid: document.getElementById('product-grid'),
        productModal: document.getElementById('product-modal'),
        cartModal: document.getElementById('cart-modal'),
        checkoutModal: document.getElementById('checkout-modal'),
        confirmationModal: document.getElementById('confirmation-modal'),
        cartIcon: document.getElementById('cart-icon'),
        cartCount: document.getElementById('cart-count'),
        menuToggle: document.getElementById('menu-toggle'),
        mobileMenu: document.getElementById('mobile-menu'),
        whatsappFloat: document.getElementById('whatsapp-float'),
    };

    // --- FUNÇÕES DE RENDERIZAÇÃO ---
    const formatCurrency = (value) => `R$ ${value.toFixed(2).replace('.', ',')}`;

    function renderProducts() {
        if (!selectors.productGrid) return;
        selectors.productGrid.innerHTML = produtos.map(produto => `
            <div class="swiper-slide">
                <div class="product-card" data-id="${produto.id}">
                    <div class="img-container">
                        <img src="${produto.imagens[0]}" alt="${produto.nome}" loading="lazy">
                    </div>
                    <div class="product-info">
                        <h3>${produto.nome}</h3>
                        <p class="price">${formatCurrency(produto.preco)}</p>
                        <button class="btn-card-add">Ver opções</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // --- FUNÇÕES DE MODAL ---
    function openModal(modal) {
        if (modal) modal.classList.add('active');
    }

    function closeModal(modal) {
        if (modal) modal.classList.remove('active');
    }

    function populateProductModal(productId) {
        const product = produtos.find(p => p.id === productId);
        if (!product) return;

        const modal = selectors.productModal;
        if (!modal) return;
        
        modal.querySelector('#modal-main-image').src = product.imagens[0];
        modal.querySelector('#modal-product-name').textContent = product.nome;
        modal.querySelector('#modal-product-price').textContent = formatCurrency(product.preco);
        modal.querySelector('#modal-product-description').textContent = product.descricao;
        
        const thumbnailsContainer = modal.querySelector('#modal-thumbnails');
        thumbnailsContainer.innerHTML = product.imagens.map((img, index) => 
            `<img src="${img}" alt="Imagem ${index + 1} de ${product.nome}" class="${index === 0 ? 'active' : ''}" data-index="${index}">`
        ).join('');
        
        modal.querySelector('#color-select').innerHTML = product.cores.map(c => `<option value="${c}">${c}</option>`).join('');
        modal.querySelector('#size-select').innerHTML = product.tamanhos.map(t => `<option value="${t}">${t}</option>`).join('');
        
        modal.querySelector('#add-to-cart-btn').onclick = () => handleAddToCart(product);
        
        openModal(modal);
    }

    // --- FUNÇÕES DO CARRINHO ---
    function handleAddToCart(product) {
        const color = document.getElementById('color-select').value;
        const size = document.getElementById('size-select').value;
        
        const existingItem = cart.find(item => item.id === product.id && item.cor === color && item.tamanho === size);
        
        if (existingItem) {
            existingItem.quantidade++;
        } else {
            cart.push({ ...product, cor: color, tamanho: size, quantidade: 1 });
        }
        
        updateCartUI();
        closeModal(selectors.productModal);
        openModal(selectors.confirmationModal);
    }
    
    function handleRemoveFromCart(index) {
        cart.splice(index, 1);
        updateCartUI();
    }
    
    function updateCartUI() {
        if (!selectors.cartCount) return;
        
        const totalItems = cart.reduce((acc, item) => acc + item.quantidade, 0);
        selectors.cartCount.textContent = totalItems;
        selectors.cartCount.classList.toggle('visible', totalItems > 0);
    
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalEl = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (!cartItemsContainer || !cartTotalEl || !checkoutBtn) return;
    
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
            checkoutBtn.disabled = true;
        } else {
            cartItemsContainer.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <strong>${item.nome}</strong><br>
                        <small>Cor: ${item.cor} | Tamanho: ${item.tamanho}</small><br>
                        <span>${item.quantidade} x ${formatCurrency(item.preco)}</span>
                    </div>
                    <button class="remove-from-cart" data-index="${index}" aria-label="Remover item">&times;</button>
                </div>
            `).join('');
            checkoutBtn.disabled = false;
        }
    
        const totalPedido = cart.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
        cartTotalEl.textContent = formatCurrency(totalPedido);
    }
    
    // --- FUNÇÕES DE CHECKOUT ---
    function handleCheckout(event) {
        event.preventDefault();
        const form = event.target;
        const customerName = form.querySelector('#customer-name').value;
        const customerAddress = form.querySelector('#customer-address').value;
        const customerContact = form.querySelector('#customer-contact').value;
        const paymentMethod = form.querySelector('#payment-method').value;

        let message = `*Olá! Gostaria de finalizar meu pedido na Lulu Moda Feminina!*\n\n`;
        message += `*Cliente:* ${customerName}\n`;
        message += `*Endereço:* ${customerAddress}\n`;
        message += `*Contato:* ${customerContact}\n\n`;
        message += `*Itens do Pedido:*\n`;
        
        let totalPedido = 0;
        cart.forEach(item => {
            message += `--------------------\n`;
            message += `*Produto:* ${item.nome}\n`;
            message += `*Cor:* ${item.cor} | *Tamanho:* ${item.tamanho}\n`;
            message += `*Qtd:* ${item.quantidade} x ${formatCurrency(item.preco)}\n`;
            totalPedido += item.preco * item.quantidade;
        });

        message += `--------------------\n`;
        message += `*Total do Pedido: ${formatCurrency(totalPedido)}*\n`;
        message += `*Forma de Pagamento na Entrega:* ${paymentMethod}\n\n`;
        message += `Aguardando confirmação. Obrigada!`;

        const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        cart = [];
        updateCartUI();
        closeModal(selectors.checkoutModal);
        form.reset();
    }

    // --- FUNÇÕES DE UI E EFEITOS ---
    function initCarousels() {
        if (typeof Swiper !== 'undefined') {
            new Swiper('.product-swiper', {
                loop: false,
                spaceBetween: 20,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    320: { slidesPerView: 1.5, spaceBetween: 15 },
                    480: { slidesPerView: 2, spaceBetween: 20 },
                    768: { slidesPerView: 3, spaceBetween: 30 },
                    1024: { slidesPerView: 4, spaceBetween: 30 }
                }
            });
        }
    }

    function handleScrollAnimation() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        if (!elements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(element => observer.observe(element));
    }

    function setupEventListeners() {
        // Menu mobile
        if(selectors.menuToggle) {
            selectors.menuToggle.addEventListener('click', () => {
                selectors.mobileMenu.classList.toggle('active');
                const icon = selectors.menuToggle.querySelector('i');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            });
        }

        document.querySelectorAll('.mobile-menu-link').forEach(link => {
            link.addEventListener('click', () => {
                selectors.mobileMenu.classList.remove('active');
                const icon = selectors.menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });

        // Abrir modais
        if (selectors.cartIcon) {
            selectors.cartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                updateCartUI();
                openModal(selectors.cartModal);
            });
        }

        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                closeModal(selectors.cartModal);
                openModal(selectors.checkoutModal);
            });
        }

        // Eventos para o modal de confirmação
        const continueShoppingBtn = document.getElementById('continue-shopping-btn');
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', () => closeModal(selectors.confirmationModal));
        }

        const goToCartBtn = document.getElementById('go-to-cart-btn');
        if (goToCartBtn) {
            goToCartBtn.addEventListener('click', () => {
                closeModal(selectors.confirmationModal);
                updateCartUI();
                openModal(selectors.cartModal);
            });
        }


        // Fechar modais
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.classList.contains('close-modal')) {
                    closeModal(modal);
                }
            });
        });
        
        // Eventos delegados para cliques em elementos dinâmicos
        document.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                populateProductModal(parseInt(productCard.dataset.id));
                return;
            }

            const thumbnail = e.target.closest('.thumbnail-images img');
            if (thumbnail) {
                const mainImage = document.getElementById('modal-main-image');
                if (mainImage) mainImage.src = thumbnail.src;
                thumbnail.parentElement.querySelectorAll('img').forEach(t => t.classList.remove('active'));
                thumbnail.classList.add('active');
                return;
            }
            
            const removeBtn = e.target.closest('.remove-from-cart');
            if(removeBtn) {
                handleRemoveFromCart(parseInt(removeBtn.dataset.index));
                return;
            }
        });

        // Formulário de checkout
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', handleCheckout);
        }
    }
    
    // --- INICIALIZAÇÃO ---
    function init() {
        if(selectors.preloader) {
            window.addEventListener('load', () => {
                setTimeout(() => selectors.preloader.classList.add('hidden'), 200);
            });
        }
        
        if (selectors.whatsappFloat) {
            selectors.whatsappFloat.href = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}`;
        }
        
        renderProducts();
        initCarousels();
        handleScrollAnimation();
        setupEventListeners();
    }

    init();
});
