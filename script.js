// Activa las animaciones (si JS fallara, todo el contenido seguiría visible)
document.documentElement.classList.add('js');

// ----- Referencias (coinciden con los id del HTML) -----
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const yearSpan = document.getElementById('year');
const form = document.getElementById('contactForm');
const inputNombre = document.getElementById('nombre');
const inputCorreo = document.getElementById('correo');
const inputMensaje = document.getElementById('mensaje');
const errorNombre = document.getElementById('errorNombre');
const errorCorreo = document.getElementById('errorCorreo');
const errorMensaje = document.getElementById('errorMensaje');
const formMsg = document.getElementById('formMsg');
const btnEnviar = document.getElementById('btnEnviar');

// ----- Año automático -----
yearSpan.textContent = new Date().getFullYear();

// ----- Menú para celular -----
function setMenu(open) {
  menu.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.textContent = open ? '✕' : '☰';
}

menuBtn.addEventListener('click', function (e) {
  e.stopPropagation();
  setMenu(!menu.classList.contains('open'));
});

menu.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () { setMenu(false); });
});

document.addEventListener('click', function (e) {
  if (!menu.contains(e.target)) setMenu(false);
});

// ----- Animación al aparecer -----
const reveals = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach(function (el) { observer.observe(el); });
} else {
  reveals.forEach(function (el) { el.classList.add('visible'); });
}

// ----- Validación del formulario -----
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function showError(input, errorEl, message) {
  errorEl.textContent = message;
  input.closest('.field').classList.toggle('invalid', message !== '');
  return message === '';
}

function validateNombre() {
  const v = inputNombre.value.trim();
  if (v === '') return showError(inputNombre, errorNombre, 'Por favor escribe tu nombre.');
  if (v.length < 3) return showError(inputNombre, errorNombre, 'El nombre debe tener al menos 3 caracteres.');
  return showError(inputNombre, errorNombre, '');
}

function validateCorreo() {
  const v = inputCorreo.value.trim();
  if (v === '') return showError(inputCorreo, errorCorreo, 'Por favor escribe tu correo.');
  if (!emailRegex.test(v)) return showError(inputCorreo, errorCorreo, 'Escribe un correo válido (ej: nombre@correo.com).');
  return showError(inputCorreo, errorCorreo, '');
}

function validateMensaje() {
  const v = inputMensaje.value.trim();
  if (v === '') return showError(inputMensaje, errorMensaje, 'Por favor escribe tu mensaje.');
  if (v.length < 10) return showError(inputMensaje, errorMensaje, 'El mensaje debe tener al menos 10 caracteres.');
  return showError(inputMensaje, errorMensaje, '');
}

inputNombre.addEventListener('blur', validateNombre);
inputCorreo.addEventListener('blur', validateCorreo);
inputMensaje.addEventListener('blur', validateMensaje);

form.addEventListener('submit', function (e) {
  e.preventDefault();
  formMsg.classList.remove('show');

  const okNombre = validateNombre();
  const okCorreo = validateCorreo();
  const okMensaje = validateMensaje();

  if (!(okNombre && okCorreo && okMensaje)) return;

  const nombre = inputNombre.value.trim().split(' ')[0];
  btnEnviar.disabled = true;
  btnEnviar.textContent = 'Enviando...';

  // Envío simulado
  setTimeout(function () {
    formMsg.textContent = '✅ ¡Gracias, ' + nombre + '! Tu mensaje fue enviado correctamente.';
    formMsg.classList.add('show');
    form.reset();
    btnEnviar.disabled = false;
    btnEnviar.textContent = 'Enviar mensaje';
    setTimeout(function () { formMsg.classList.remove('show'); }, 7000);
  }, 1000);
});