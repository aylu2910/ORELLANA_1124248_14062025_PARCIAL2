// ------------------LOGICA PARA MANEJO DE PERSISTENCIA ENTRE PAGINAS CON TEMA CLARO/OSCURO ----------------------
class ThemeManager {
  constructor() {
    this.init();
    this.bindEvents();
  }

  init() {
    // Verifica si el usuario tiene una preferencia en localStorage
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme) {
      this.setTheme(savedTheme);
    } else if (prefersDark) {
      this.setTheme("dark");
    } else {
      this.setTheme("light");
    }
  }

  setTheme(theme) {
    const html = document.documentElement;

    if (theme === "dark") {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      this.updateButtonStates("dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      this.updateButtonStates("light");
    }
  }

  updateButtonStates(currentTheme) {
    const lightBtns = document.querySelectorAll(
      "#light-mode-btn, #light-mode-btn-mobile"
    );
    const darkBtns = document.querySelectorAll(
      "#dark-mode-btn, #dark-mode-btn-mobile"
    );

    if (currentTheme === "dark") {
      lightBtns.forEach((btn) =>
        btn.classList.remove("ring-2", "ring-yellow-400")
      );
      darkBtns.forEach((btn) => btn.classList.add("ring-2", "ring-gray-400"));
    } else {
      lightBtns.forEach((btn) =>
        btn.classList.add("ring-2", "ring-yellow-400")
      );
      darkBtns.forEach((btn) =>
        btn.classList.remove("ring-2", "ring-gray-400")
      );
    }
  }

  bindEvents() {
    // Botones de modo claro
    document
      .querySelectorAll("#light-mode-btn, #light-mode-btn-mobile")
      .forEach((btn) => {
        btn.addEventListener("click", () => this.setTheme("light"));
      });

    // Botones de modo oscuro
    document
      .querySelectorAll("#dark-mode-btn, #dark-mode-btn-mobile")
      .forEach((btn) => {
        btn.addEventListener("click", () => this.setTheme("dark"));
      });

    // Escucha cambios en el tema del sistema
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
          this.setTheme(e.matches ? "dark" : "light");
        }
      });
  }
}

// Funcionalidad del menú móvil
function initMobileMenu() {
  // Soporte para múltiples menús mobile con ids únicos
  const menuButtons = document.querySelectorAll('[id^="mobile-menu-button"]');
  menuButtons.forEach((btn) => {
    const suffix = btn.id.replace("mobile-menu-button", "");
    const menu = document.getElementById("mobile-menu" + suffix);
    if (menu) {
      btn.addEventListener("click", function () {
        menu.classList.toggle("hidden");
      });
    }
  });
}

// Resalta la página actual en el menú de navegación
function highlightCurrentPage() {
  const currentPath = window.location.pathname.split("/").pop(); // Obtiene el nombre del archivo (ej: index.html)
  const navLinks = document.querySelectorAll("nav a"); // Selecciona todos los enlaces de navegación

  navLinks.forEach((link) => {
    // Elimina cualquier clase 'active' o de resaltado anterior
    link.classList.remove("active");
    // Compara el nombre del archivo del enlace con el de la página actual
    const linkPath = link.href.split("/").pop();
    if (linkPath === currentPath) {
      link.classList.add("active"); // Solo añade la clase 'active'
    }
  });
}

// Inicializa todo el código
new ThemeManager();
initMobileMenu();
highlightCurrentPage(); // Llama a la nueva función

// Animación de los botones para mejorar la UI
const buttons = document.querySelectorAll('[id*="mode-btn"]');
buttons.forEach((btn) => {
  btn.addEventListener("click", function () {
    this.style.transform = "scale(0.95)";
    setTimeout(() => {
      this.style.transform = "scale(1)";
    }, 150);
  });
});

// ----------------- VALIDACIÓN DE FORMULARIO----------------------

const form = document.querySelector("form");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const asunto = document.getElementById("asunto");
    const mensaje = document.getElementById("mensaje");
    const mensajeDiv = document.getElementById("mensaje-formulario");
    let errores = [];
    // Limpiar errores visuales
    [nombre, email, asunto, mensaje].forEach(
      (input) => (input.style.borderColor = "")
    );
    // Validaciones
    if (!nombre.value.trim()) {
      errores.push("El nombre es obligatorio.");
      nombre.style.borderColor = "#ef4444"; // rojo
    }
    if (!email.value.trim()) {
      errores.push("El correo electrónico es obligatorio.");
      email.style.borderColor = "#ef4444";
    } else if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) {
      errores.push("Ingrese un correo electrónico válido.");
      email.style.borderColor = "#ef4444";
    }
    if (!asunto.value.trim()) {
      errores.push("El asunto es obligatorio.");
      asunto.style.borderColor = "#ef4444";
    }
    if (!mensaje.value.trim()) {
      errores.push("El mensaje es obligatorio.");
      mensaje.style.borderColor = "#ef4444";
    }
    if (errores.length > 0) {
      mensajeDiv.textContent = errores.join(" ");
      mensajeDiv.className =
        "mb-5 text-center text-base font-semibold text-red-500";
    } else {
      mensajeDiv.innerHTML = `¡Gracias por su contacto, <span class='text-pink-500'>${nombre.value}</span>!<br>En breve le estaré respondiendo.`;
      mensajeDiv.className =
        "mb-5 text-center text-base font-semibold text-green-600";
      form.reset();
    }
  });
}
