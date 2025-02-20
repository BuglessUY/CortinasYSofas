// Selección de elementos del slider principal
const slides = document.querySelectorAll(".slide");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

let currentSlide = 0;

// Función para mostrar una diapositiva específica
function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove("active");
        if (i === index) {
            slide.classList.add("active");
        }
    });
}





// Cambiar el fondo del encabezado en función del desplazamiento
// Cambiar el fondo del encabezado en función del desplazamiento
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    const scrollPosition = window.scrollY;

    // Cambia 100 por la altura específica en la que quieres que el fondo cambie
    if (scrollPosition > 200) {
        header.classList.add('solid-bg');
    } else {
        header.classList.remove('solid-bg');
    }
});



// Animación de fade-in para elementos de la página
document.addEventListener('DOMContentLoaded', () => {
    const fadeInElements = document.querySelectorAll('.fade-in');

    function checkVisibility() {
        const viewportHeight = window.innerHeight;
        
        fadeInElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < viewportHeight - 100) {
                element.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Ejecutar al cargar la página para mostrar los elementos que ya están en vista
});

// Animación de revelado de texto al hacer scroll
window.addEventListener('scroll', () => {
    document.querySelectorAll('.text-reveal').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.classList.add('visible');
        }
    });
});

// Estilo y animación para la línea debajo de los enlaces en el menú de navegación
const navLinks = document.querySelectorAll('nav li a');

navLinks.forEach(link => {
    const underline = document.createElement('span');
    underline.classList.add('underline');
    link.appendChild(underline);

    link.addEventListener('mouseover', () => {
        underline.style.transform = 'scaleX(1)';
    });

    link.addEventListener('mouseout', () => {
        underline.style.transform = 'scaleX(0)';
    });
});
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});