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
  const header = document.querySelector('.header');
  if (!header) return;
  // Si no está el hero (es página interna), siempre mantener el fondo sólido
  if (!document.querySelector('.hero')) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      header.classList.add('solid-bg');
    } else {
      header.classList.remove('solid-bg');
    }
  });
}

function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const dropdownLinks = document.querySelectorAll('.has-dropdown > a');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('is-active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
  }

  dropdownLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parentLi = this.parentElement;
        
        // Cerrar hermanos
        Array.from(parentLi.parentElement.children).forEach(sibling => {
          if (sibling !== parentLi) sibling.classList.remove('active-mobile');
        });
        
        parentLi.classList.toggle('active-mobile');
      }
    });
  });
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
