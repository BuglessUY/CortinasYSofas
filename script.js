document.addEventListener("DOMContentLoaded", () => {
  initHeaderScroll();
  initMobileMenu();
  initSwiper();
  initWhatsAppCart();
  initImageViewer();
  initScrollAnimations();
  initContactForm();
});

function initHeaderScroll() {
  const header = document.querySelector('.header-modern');
  if (!header) return;

  // Si no está en la página principal, mantenerlo sólido siempre
  if (!document.querySelector('.hero')) {
    header.classList.add('scrolled');
    header.classList.add('solid');
    return;
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}



function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger-modern');
  const closeBtn = document.querySelector('.close-menu-btn');
  const navWrapper = document.querySelector('.nav-wrapper');
  const overlay = document.querySelector('.mobile-overlay');

  // Función toggleMenu mejorada
  function toggleMenu() {
    const isOpen = navWrapper.classList.contains('open');
    if (isOpen) {
      navWrapper.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      navWrapper.classList.add('open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Evita el scroll del body
    }
  }

  if (hamburger) hamburger.addEventListener('click', toggleMenu);
  if (closeBtn) closeBtn.addEventListener('click', toggleMenu);
  if (overlay) overlay.addEventListener('click', toggleMenu);

  // Lógica de Acordeones en Móvil (Animación Suave con JS)
  if (window.innerWidth <= 992) {
    // 1. Acordeón Principal (Productos)
    const megaMenuToggle = document.querySelector('.has-mega-menu > .nav-link');
    const megaMenuPanel = document.querySelector('.mega-menu-panel');
    const chevron = document.querySelector('.chevron-icon');

    if (megaMenuToggle && megaMenuPanel) {
      megaMenuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        megaMenuPanel.classList.toggle('open-accordion');
        
        if(megaMenuPanel.classList.contains('open-accordion')) {
          chevron.style.transform = 'rotate(180deg)';
          // Le damos un valor alto dinámico para que la transición CSS funcione suavemente
          megaMenuPanel.style.maxHeight = megaMenuPanel.scrollHeight + 800 + "px"; 
        } else {
          chevron.style.transform = 'rotate(0deg)';
          megaMenuPanel.style.maxHeight = null;
          
          // Opcional: Cerrar los submenús internos si se cierra el principal
          document.querySelectorAll('.accordion-content').forEach(content => {
            content.style.maxHeight = null;
            content.previousElementSibling.classList.remove('expanded');
          });
        }
      });
    }

    // 2. Sub-acordeones internos (Cortinas, Sofás, etc.)
    const megaTitles = document.querySelectorAll('.mega-title');
    megaTitles.forEach(title => {
      title.addEventListener('click', function() {
        this.classList.toggle('expanded');
        const content = this.nextElementSibling;
        
        if (content && content.classList.contains('accordion-content')) {
          if (content.style.maxHeight) {
            content.style.maxHeight = null; // Cierra el submenú
          } else {
            content.style.maxHeight = content.scrollHeight + "px"; // Abre midiendo el alto real
            
            // Reajusta el contenedor padre para que no corte el contenido
            if (megaMenuPanel.style.maxHeight) {
              megaMenuPanel.style.maxHeight = (megaMenuPanel.scrollHeight + content.scrollHeight) + "px";
            }
          }
        }
      });
    });
  }
}

function initSwiper() {
  if (typeof Swiper !== 'undefined') {
    const swipers = document.querySelectorAll('.mySwiper');
    swipers.forEach(swiperEl => {
      new Swiper(swiperEl, {
        loop: true,
        effect: "fade",
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        autoplay: {
          delay: 5000,
          disableOnInteraction: true,
        }
      });
    });
  }
}

function initWhatsAppCart() {
  const botonesWa = document.querySelectorAll(".agregar-carrito");
  botonesWa.forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const card = this.closest(".product-card");
      if (!card) return;

      const tituloEl = card.querySelector(".product-name");
      const nombreProducto = tituloEl ? tituloEl.textContent.trim() : "Producto del catálogo";
      
      const imagenEl = card.querySelector(".swiper-slide-active img") || card.querySelector("img");
      // Enviar URL absoluta de la imagen para que se vea en WA si es posible
      const imagenSrc = imagenEl ? new URL(imagenEl.getAttribute('src'), window.location.href).href : "";

      const mensaje = `Hola, quisiera consultar presupuesto por el siguiente producto: *${nombreProducto}*.\nReferencia: ${imagenSrc}`;
      const url = `https://wa.me/598099696610?text=${encodeURIComponent(mensaje)}`;
      
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  });
}

function initImageViewer() {
  let visor = document.getElementById('visor-imagen');
  if (!visor) {
    visor = document.createElement('div');
    visor.id = 'visor-imagen';
    visor.className = 'visor';
    visor.innerHTML = `
      <span class="cerrar" aria-label="Cerrar visor">&times;</span>
      <img id="imagen-ampliada" alt="Visor ampliado">
    `;
    document.body.appendChild(visor);
  }

  const imagenAmpliada = visor.querySelector('#imagen-ampliada');
  const cerrar = visor.querySelector('.cerrar');
  const galeriaImgs = document.querySelectorAll('.product-gallery img');

  galeriaImgs.forEach(img => {
    img.addEventListener('click', (e) => {
      e.preventDefault();
      imagenAmpliada.src = img.src;
      visor.style.display = 'flex';
    });
  });

  cerrar.addEventListener('click', () => visor.style.display = 'none');
  visor.addEventListener('click', (e) => {
    if (e.target === visor) visor.style.display = 'none';
  });
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusDiv = document.getElementById('formStatus');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusDiv.textContent = 'Enviando...';
    statusDiv.className = 'form-status';

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        statusDiv.textContent = 'Mensaje enviado correctamente. Nos comunicaremos a la brevedad.';
        statusDiv.classList.add('status-success');
        form.reset();
      } else {
        statusDiv.textContent = result.message || 'Error al enviar el mensaje. Intente vía WhatsApp.';
        statusDiv.classList.add('status-error');
      }
    } catch (error) {
      statusDiv.textContent = 'Hubo un problema de conexión. Por favor, contáctanos por WhatsApp.';
      statusDiv.classList.add('status-error');
    }
  });
}
