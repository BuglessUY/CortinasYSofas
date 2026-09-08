document.addEventListener("DOMContentLoaded", () => {
    // Inicializar todos los módulos
    initHeaderScroll();
    initMobileMenu();
    initSwiper();
    initWhatsAppCart();
    initImageViewer();
    initScrollAnimations();
    initHeroSlider();
});

/* ==================================================
   1. CAMBIO DE FONDO DEL HEADER AL HACER SCROLL
================================================== */
function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 150) {
            header.classList.add('solid-bg');
        } else {
            header.classList.remove('solid-bg');
        }
    });
}

/* ==================================================
   2. LÓGICA DEL MENÚ MÓVIL Y SUBMENÚS
================================================== */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const menuItems = document.querySelectorAll(".nav-menu > ul > li > a");
    const submenuItems = document.querySelectorAll(".submenu > li > a");

    let lastClickedItem = null;
    let lastClickTime = 0;
    const doubleClickDelay = 300; // Milisegundos para detectar doble clic

    // Abrir/Cerrar menú hamburguesa
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Lógica multinivel para móviles (Prevenir redirección al primer tap)
    function handleMenuClick(event, links) {
        links.forEach((item) => {
            item.addEventListener("click", function (e) {
                if (!isMobile()) return; // En PC funciona el hover nativo de CSS

                const parentLi = this.parentElement;
                const hasSubmenu = parentLi.querySelector("ul");
                const currentTime = new Date().getTime();

                if (hasSubmenu) {
                    e.preventDefault(); // Evitar redirección inmediata

                    // Doble clic = Redirigir
                    if (lastClickedItem === this && (currentTime - lastClickTime) < doubleClickDelay) {
                        window.location.href = this.href;
                        return;
                    }

                    // Cerrar hermanos del mismo nivel
                    const siblings = parentLi.parentElement.children;
                    for (let sibling of siblings) {
                        if (sibling !== parentLi) {
                            sibling.classList.remove("active-mobile");
                        }
                    }

                    // Alternar clase activa
                    parentLi.classList.toggle("active-mobile");

                    lastClickedItem = this;
                    lastClickTime = currentTime;
                }
            });
        });
    }

    handleMenuClick(null, menuItems);
    handleMenuClick(null, submenuItems);
}

/* ==================================================
   3. INICIALIZACIÓN DE CARRUSELES SWIPER
================================================== */
function initSwiper() {
    const swipers = document.querySelectorAll('.mySwiper');
    if (swipers.length === 0) return;

    // Solo inicializa si la librería Swiper está cargada
    if (typeof Swiper !== 'undefined') {
        swipers.forEach((swiperElement) => {
            new Swiper(swiperElement, {
                loop: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }
            });
        });
    } else {
        console.warn("Librería Swiper no detectada.");
    }
}

/* ==================================================
   4. CARRITO WHATSAPP (SOLICITAR PRESUPUESTO)
================================================== */
function initWhatsAppCart() {
    const botonesCarrito = document.querySelectorAll(".agregar-carrito");

    botonesCarrito.forEach(boton => {
        boton.addEventListener("click", function (event) {
            event.preventDefault();

            // Buscar la card contenedora
            let card = this.closest(".card");
            if (!card) return;

            // Extraer nombre (preparado para leer un h5, nombre de clase genérico, o dataset)
            let tituloEl = card.querySelector("h5") || card.querySelector(".producto-nombre");
            let nombre = tituloEl ? tituloEl.innerText.trim() : "Producto del catálogo";
            
            // Extraer imagen activa
            let imagenEl = card.querySelector(".swiper-slide-active img") || card.querySelector("img");
            let imagen = imagenEl ? imagenEl.src : "Sin imagen";

            let mensaje = `Hola, me interesa solicitar presupuesto para: *${nombre}*.%0A🔹 Enlace o Imagen de referencia: ${imagen}`;
            let telefono = "598099696610";
            let url = `https://wa.me/${telefono}?text=${mensaje}`;

            window.location.href = url;
        });
    });
}

/* ==================================================
   5. VISOR DE IMÁGENES (MODAL TIPO LIGHTBOX)
================================================== */
function initImageViewer() {
    // Usamos el visor centralizado que ahora debe estar en el HTML o lo creamos dinámicamente si no existe
    let visor = document.getElementById('visor-imagen');
    
    // Si no existe el div visor en el HTML, lo creamos dinámicamente para no ensuciar los HTML
    if (!visor) {
        visor = document.createElement('div');
        visor.id = 'visor-imagen';
        visor.className = 'visor';
        visor.innerHTML = `
            <span class="cerrar">&times;</span>
            <img class="imagen-grande" id="imagen-ampliada" alt="Visor ampliado">
        `;
        document.body.appendChild(visor);
    }

    const imagenAmpliada = visor.querySelector('#imagen-ampliada');
    const botonCerrar = visor.querySelector('.cerrar');
    const imagenesGaleria = document.querySelectorAll('.imagen-swiper, .galeria img');

    // Asignar evento a cada imagen
    imagenesGaleria.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', (e) => {
            // Evitamos que Swiper detecte esto como un link o deslice
            e.preventDefault(); 
            imagenAmpliada.src = img.src;
            visor.style.display = 'flex';
        });
    });

    // Cerrar modal
    botonCerrar.addEventListener('click', () => {
        visor.style.display = 'none';
    });

    visor.addEventListener('click', (e) => {
        if (e.target === visor) {
            visor.style.display = 'none';
        }
    });
}

/* ==================================================
   6. ANIMACIONES DE SCROLL (FADE IN)
================================================== */
function initScrollAnimations() {
    const fadeInElements = document.querySelectorAll('.fade-in');

    function checkVisibility() {
        const viewportHeight = window.innerHeight;
        
        fadeInElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < viewportHeight - 80) { // 80px de margen antes de aparecer
                element.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Chequear elementos visibles al cargar
}

/* ==================================================
   7. SLIDER HERO (Página de inicio)
================================================== */
function initHeroSlider() {
    const slides = document.querySelectorAll(".hero .slide");
    if (slides.length === 0) return;

    // Solo como placeholder por si se desean agregar botones de next/prev a futuro
    let currentSlide = 0;
    
    window.showSlide = function(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove("active");
            if (i === index) {
                slide.classList.add("active");
            }
        });
    }
}
