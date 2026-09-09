document.addEventListener("DOMContentLoaded", () => {
    initHeaderScroll();
    initMobileMenu();
    initSwiper();
    initWhatsAppCart();
    initImageViewer();
    initScrollAnimations(); // Ahora con IntersectionObserver
});

/* ==================================================
   1. HEADER SCROLL Y EFECTOS
================================================== */
function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    // Si no estamos en la página de inicio (sin hero), poner el header sólido siempre
    if (!document.querySelector('.hero')) {
        header.classList.add('solid-bg');
        return;
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('solid-bg');
        } else {
            header.classList.remove('solid-bg');
        }
    });
}

/* ==================================================
   2. LÓGICA DEL MENÚ MÓVIL OVERLAY
================================================== */
/* ==================================================
   2. LÓGICA DEL MENÚ MÓVIL OVERLAY (ACTUALIZADA)
================================================== */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Abrir/Cerrar menú hamburguesa
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('is-active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });
    }

    // Lógica de acordeón multinivel perfecta para móvil
    const dropdownLinks = document.querySelectorAll('.has-dropdown > a');
    
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault(); // Evita navegar y recargar la página si tiene submenú
                
                const parentLi = this.parentElement;
                
                // Cierra los menús hermanos del MISMO nivel sin afectar a los padres
                const siblings = parentLi.parentElement.children;
                for (let sibling of siblings) {
                    if (sibling !== parentLi && sibling.classList.contains('active-mobile')) {
                        sibling.classList.remove('active-mobile');
                    }
                }
                
                // Abre/Cierra el menú actual
                parentLi.classList.toggle('active-mobile');
            }
        });
    });
}

    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Comportamiento de acordeón para móviles
    function handleMenuClick(links) {
        links.forEach((item) => {
            item.addEventListener("click", function (e) {
                if (!isMobile()) return; 

                const parentLi = this.parentElement;
                const hasSubmenu = parentLi.querySelector("ul");

                if (hasSubmenu) {
                    e.preventDefault(); 

                    // Si ya está abierto y se hace clic en el enlace principal, redirigir
                    if (parentLi.classList.contains('active-mobile') && this.getAttribute('href') !== '#') {
                        window.location.href = this.href;
                        return;
                    }

                    // Cerrar hermanos
                    const siblings = parentLi.parentElement.children;
                    for (let sibling of siblings) {
                        if (sibling !== parentLi) {
                            sibling.classList.remove("active-mobile");
                        }
                    }

                    // Alternar clase
                    parentLi.classList.toggle("active-mobile");
                }
            });
        });
    }

    handleMenuClick(menuItems);
    handleMenuClick(submenuItems);
}

/* ==================================================
   3. INICIALIZACIÓN DE CARRUSELES SWIPER
================================================== */
function initSwiper() {
    const swipers = document.querySelectorAll('.mySwiper');
    if (swipers.length === 0) return;

    if (typeof Swiper !== 'undefined') {
        swipers.forEach((swiperElement) => {
            new Swiper(swiperElement, {
                loop: true,
                effect: "fade", // Efecto más elegante para el catálogo
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }
            });
        });
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

            let card = this.closest(".card");
            if (!card) return;

            let tituloEl = card.querySelector("h5") || card.querySelector(".producto-nombre");
            let nombre = tituloEl ? tituloEl.innerText.trim() : "Producto del catálogo";
            
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
   5. VISOR DE IMÁGENES (LIGHTBOX MODAL)
================================================== */
function initImageViewer() {
    let visor = document.getElementById('visor-imagen');
    
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
    const imagenesGaleria = document.querySelectorAll('.imagen-swiper, .galeria img, .category-card img');

    imagenesGaleria.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', (e) => {
            // Permitir clic en los links de las categorías, bloquear en las cards de productos
            if(img.closest('.category-card')) return; 
            
            e.preventDefault(); 
            imagenAmpliada.src = img.src;
            visor.style.display = 'flex';
        });
    });

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
   6. ANIMACIONES DE SCROLL (INTERSECTION OBSERVER)
================================================== */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in, .fade-up');
    
    // Cambiamos clases antiguas por la nueva para unificación
    fadeElements.forEach(el => {
        if(el.classList.contains('fade-in')) {
            el.classList.remove('fade-in');
            el.classList.add('fade-up');
        }
    });

    const elementsToAnimate = document.querySelectorAll('.fade-up');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Solo animar la primera vez
            }
        });
    }, {
        root: null,
        threshold: 0.1, // Anima cuando el 10% del elemento es visible
        rootMargin: "0px 0px -50px 0px"
    });

    elementsToAnimate.forEach(el => observer.observe(el));
}
