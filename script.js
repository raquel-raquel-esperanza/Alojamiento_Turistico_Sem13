/* ═══════════════════════════════════════════════
  Guanaco's — script.js
   Interactividad: Navbar, DOM, Validación de Formulario
   Destino del formulario: queli1801@gmail.com
   ═══════════════════════════════════════════════ */

'use strict';

/* ════════════════════════════════════════
   1. NAVBAR — Scroll & Hamburger
════════════════════════════════════════ */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('navLinks');
const navItems    = document.querySelectorAll('.nav-link:not(.nav-cta)');

// Navbar scrolled
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Hamburger toggle
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Cerrar menú al hacer click en un enlace
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Active nav link por sección visible
const sections = document.querySelectorAll('section[id]');
const observerNav = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(sec => observerNav.observe(sec));


/* ════════════════════════════════════════
   2. ANIMACIONES AL HACER SCROLL (IntersectionObserver)
════════════════════════════════════════ */

// Añadir clase fade-up a elementos que deben animarse
const animTargets = [
  '.servicio-card',
  '.room-card',
  '.tarifa-card',
  '.valor',
  '.contact-item',
  '.nosotros-text > *',
  '.section-header',
];

animTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('fade-up');
    // Stagger delay por grupos de hasta 5
    const delay = (i % 5) + 1;
    el.classList.add(`fade-up-delay-${delay}`);
  });
});

const observerFade = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observerFade.unobserve(entry.target); // Una sola vez
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -48px 0px'
});

document.querySelectorAll('.fade-up').forEach(el => observerFade.observe(el));


/* ════════════════════════════════════════
   3. AÑO DINÁMICO EN FOOTER
════════════════════════════════════════ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ════════════════════════════════════════
   4. CONTADOR DE CARACTERES — Textarea
════════════════════════════════════════ */
const mensajeTextarea = document.getElementById('mensaje');
const charCount       = document.getElementById('charCount');
const MAX_CHARS       = 500;

if (mensajeTextarea && charCount) {
  mensajeTextarea.addEventListener('input', () => {
    const len = mensajeTextarea.value.length;

    // Truncar si supera el máximo
    if (len > MAX_CHARS) {
      mensajeTextarea.value = mensajeTextarea.value.substring(0, MAX_CHARS);
    }

    const current = mensajeTextarea.value.length;
    charCount.textContent = `${current} / ${MAX_CHARS}`;

    // Colorear según proximidad al límite
    if (current >= MAX_CHARS) {
      charCount.style.color = '#c0392b';
    } else if (current >= MAX_CHARS * 0.85) {
      charCount.style.color = '#e67e22';
    } else {
      charCount.style.color = '';
    }
  });
}


/* ════════════════════════════════════════
   5. FECHA MÍNIMA — Check-in y Check-out
════════════════════════════════════════ */
const checkinInput  = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');

if (checkinInput && checkoutInput) {
  // Check-in mínimo = hoy
  const today = new Date().toISOString().split('T')[0];
  checkinInput.setAttribute('min', today);

  // Check-out mínimo = day después del check-in
  checkinInput.addEventListener('change', () => {
    if (checkinInput.value) {
      const nextDay = new Date(checkinInput.value);
      nextDay.setDate(nextDay.getDate() + 1);
      checkoutInput.setAttribute('min', nextDay.toISOString().split('T')[0]);

      // Si checkout ya tenía una fecha menor, limpiarla
      if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
        checkoutInput.value = '';
        showFieldError('checkoutError', 'Selecciona una fecha de salida válida.');
      }
    }
  });
}


/* ════════════════════════════════════════
   6. VALIDACIÓN DEL FORMULARIO
════════════════════════════════════════ */
const form = document.getElementById('reservaForm');

// ── Helpers ──
function showFieldError(errorId, message) {
  const errorEl = document.getElementById(errorId);
  if (errorEl) errorEl.textContent = message;
}

function clearFieldError(errorId) {
  const errorEl = document.getElementById(errorId);
  if (errorEl) errorEl.textContent = '';
}

function markError(inputEl, errorId, message) {
  inputEl.classList.remove('valid');
  inputEl.classList.add('error');
  showFieldError(errorId, message);
  return false;
}

function markValid(inputEl, errorId) {
  inputEl.classList.remove('error');
  inputEl.classList.add('valid');
  clearFieldError(errorId);
  return true;
}

// ── Validaciones individuales ──
function validateNombre(value) {
  const el = document.getElementById('nombre');
  if (!value.trim()) return markError(el, 'nombreError', 'El nombre completo es obligatorio.');
  if (value.trim().length < 3) return markError(el, 'nombreError', 'Ingresa al menos 3 caracteres.');
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(value.trim())) return markError(el, 'nombreError', 'Solo letras y espacios, por favor.');
  return markValid(el, 'nombreError');
}

function validateEmail(value) {
  const el = document.getElementById('email');
  if (!value.trim()) return markError(el, 'emailError', 'El correo electrónico es obligatorio.');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(value.trim())) return markError(el, 'emailError', 'Ingresa un correo electrónico válido.');
  return markValid(el, 'emailError');
}

function validateTelefono(value) {
  const el = document.getElementById('telefono');
  if (!value.trim()) return markError(el, 'telefonoError', 'El teléfono / WhatsApp es obligatorio.');
  // Acepta formatos: +503 7000-0000, 70001234, (503) 7000-1234, etc.
  const tel = value.replace(/[\s\-\(\)]/g, '');
  if (!/^\+?\d{7,15}$/.test(tel)) return markError(el, 'telefonoError', 'Ingresa un número de teléfono válido.');
  return markValid(el, 'telefonoError');
}

function validatePersonas(value) {
  const el = document.getElementById('personas');
  if (!value) return markError(el, 'personasError', 'Selecciona el número de personas.');
  return markValid(el, 'personasError');
}

function validateCheckin(value) {
  const el = document.getElementById('checkin');
  if (!value) return markError(el, 'checkinError', 'Selecciona la fecha de llegada.');
  const today = new Date().toISOString().split('T')[0];
  if (value < today) return markError(el, 'checkinError', 'La fecha no puede ser anterior a hoy.');
  return markValid(el, 'checkinError');
}

function validateCheckout(value) {
  const el      = document.getElementById('checkout');
  const checkin = document.getElementById('checkin').value;
  if (!value) return markError(el, 'checkoutError', 'Selecciona la fecha de salida.');
  if (value <= checkin) return markError(el, 'checkoutError', 'La salida debe ser posterior a la llegada.');
  return markValid(el, 'checkoutError');
}

function validateAlojamiento(value) {
  const el = document.getElementById('alojamiento');
  if (!value) return markError(el, 'alojamientoError', 'Selecciona un tipo de alojamiento.');
  return markValid(el, 'alojamientoError');
}

function validateTerminos(checked) {
  const errorEl = document.getElementById('terminosError');
  if (!checked) {
    errorEl.textContent = 'Debes aceptar los términos y condiciones.';
    return false;
  }
  errorEl.textContent = '';
  return true;
}

// ── Validación en tiempo real (on blur/change) ──
if (form) {
  document.getElementById('nombre').addEventListener('blur', e => validateNombre(e.target.value));
  document.getElementById('email').addEventListener('blur', e => validateEmail(e.target.value));
  document.getElementById('telefono').addEventListener('blur', e => validateTelefono(e.target.value));
  document.getElementById('personas').addEventListener('change', e => validatePersonas(e.target.value));
  document.getElementById('checkin').addEventListener('change', e => validateCheckin(e.target.value));
  document.getElementById('checkout').addEventListener('change', e => validateCheckout(e.target.value));
  document.getElementById('alojamiento').addEventListener('change', e => validateAlojamiento(e.target.value));
}


/* ════════════════════════════════════════
   7. ENVÍO DEL FORMULARIO
════════════════════════════════════════ */
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Valores
    const nombre      = document.getElementById('nombre').value;
    const email       = document.getElementById('email').value;
    const telefono    = document.getElementById('telefono').value;
    const personas    = document.getElementById('personas').value;
    const checkin     = document.getElementById('checkin').value;
    const checkout    = document.getElementById('checkout').value;
    const alojamiento = document.getElementById('alojamiento').value;
    const terminos    = document.getElementById('terminos').checked;

    // Ejecutar todas las validaciones
    const validaciones = [
      validateNombre(nombre),
      validateEmail(email),
      validateTelefono(telefono),
      validatePersonas(personas),
      validateCheckin(checkin),
      validateCheckout(checkout),
      validateAlojamiento(alojamiento),
      validateTerminos(terminos),
    ];

    // Si alguna falla, detener y hacer scroll al primer error
    if (validaciones.includes(false)) {
      const firstError = form.querySelector('.error, [id$="Error"]:not(:empty)');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      showToast('Por favor corrige los errores antes de enviar.', 'error');
      return;
    }

    // Preparar datos del formulario
    const submitBtn  = document.getElementById('submitBtn');
    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoader  = submitBtn.querySelector('.btn-loader');

    // Estado: cargando
    submitBtn.disabled = true;
    btnText.style.display  = 'none';
    btnLoader.style.display = 'inline';

    // Calcular noches
    const noches = calcularNoches(checkin, checkout);

    // Construir los datos para enviar por Formspree (compatible con mailto)
    const formData = new FormData();
    formData.append('nombre',       nombre);
    formData.append('email',        email);
    formData.append('telefono',     telefono);
    formData.append('personas',     personas);
    formData.append('checkin',      formatDate(checkin));
    formData.append('checkout',     formatDate(checkout));
    formData.append('noches',       noches);
    formData.append('alojamiento',  document.getElementById('alojamiento').options[document.getElementById('alojamiento').selectedIndex].text);
    formData.append('mensaje',      document.getElementById('mensaje').value || 'Sin mensaje adicional.');
    formData.append('_replyto',     email);
    formData.append('_subject',     `Reserva ParaísoSV — ${nombre} · ${formatDate(checkin)}`);
    formData.append('_to',          'queli1801@gmail.com');

    try {
      // Enviar por Formspree (el endpoint ya tiene el correo configurado)
      // Si no tienes cuenta Formspree, se hace uso de mailto como fallback
      const response = await fetch('https://formspree.io/f/mjkwnvok', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        onFormSuccess(email);
      } else {
        // Fallback: abrir cliente de correo
        sendByMailto({ nombre, email, telefono, personas, checkin, checkout, noches, alojamiento });
        onFormSuccess(email);
      }

    } catch (error) {
      // Fallback sin conexión: abrir cliente de correo
      sendByMailto({ nombre, email, telefono, personas, checkin, checkout, noches, alojamiento });
      onFormSuccess(email);
    } finally {
      submitBtn.disabled = false;
      btnText.style.display  = 'inline';
      btnLoader.style.display = 'none';
    }
  });
}

function onFormSuccess(email) {
  const formEl      = document.getElementById('reservaForm');
  const successEl   = document.getElementById('formSuccess');
  const successEmail = document.getElementById('successEmail');

  formEl.style.display    = 'none';
  successEl.style.display = 'block';
  if (successEmail) successEmail.textContent = email;

  // Scroll suave al mensaje de éxito
  successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  showToast('✓ Solicitud enviada con éxito. ¡Nos pondremos en contacto pronto!');
}

// ── Fallback Mailto ──
function sendByMailto({ nombre, email, telefono, personas, checkin, checkout, noches, alojamiento }) {
  const alojaTexto = document.getElementById('alojamiento').options[document.getElementById('alojamiento').selectedIndex].text;
  const mensaje = document.getElementById('mensaje').value || 'Sin mensaje adicional.';

  const body = encodeURIComponent(
    `NUEVA SOLICITUD DE RESERVA — Paraíso SV\n` +
    `${'='.repeat(45)}\n\n` +
    `Nombre:         ${nombre}\n` +
    `Email:          ${email}\n` +
    `Teléfono:       ${telefono}\n` +
    `Personas:       ${personas}\n` +
    `Check-in:       ${formatDate(checkin)}\n` +
    `Check-out:      ${formatDate(checkout)}\n` +
    `Noches:         ${noches}\n` +
    `Alojamiento:    ${alojaTexto}\n\n` +
    `Mensaje:\n${mensaje}\n\n` +
    `${'='.repeat(45)}\n` +
    `Enviado desde: paraisosv.com`
  );

  const subject = encodeURIComponent(`Reserva ParaísoSV — ${nombre} · ${formatDate(checkin)}`);
  const mailtoLink = `mailto:queli1801@gmail.com?subject=${subject}&body=${body}`;

  // Abrir en nueva ventana para no interrumpir UX
  window.open(mailtoLink, '_blank');
}


/* ════════════════════════════════════════
   8. UTILIDADES
════════════════════════════════════════ */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return `${day} ${months[parseInt(month, 10) - 1]} ${year}`;
}

function calcularNoches(checkin, checkout) {
  if (!checkin || !checkout) return 0;
  const d1 = new Date(checkin);
  const d2 = new Date(checkout);
  const diff = d2 - d1;
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

/* ── Toast de notificación ── */
let toastTimeout = null;

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className   = 'toast';
  if (type === 'error') toast.classList.add('error');

  // Forzar reflow para reiniciar animación
  void toast.offsetWidth;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}


/* ════════════════════════════════════════
   9. MANIPULACIÓN DEL DOM — Tabs de habitaciones
   (Filtro de tarjetas por tipo)
════════════════════════════════════════ */

// Insertar controles de filtro dinámicamente
const roomsSection = document.getElementById('habitaciones');
const roomsGrid    = roomsSection ? roomsSection.querySelector('.rooms-grid') : null;

if (roomsGrid) {
  // Crear barra de filtros
  const filterBar = document.createElement('div');
  filterBar.className = 'filter-bar';
  filterBar.setAttribute('role', 'group');
  filterBar.setAttribute('aria-label', 'Filtrar habitaciones');

  const filters = [
    { key: 'all',      label: 'Todos' },
    { key: 'glamping', label: '🏕️ Glamping' },
    { key: 'cabana',   label: '🏡 Cabañas' },
    { key: 'boutique', label: '🏨 Boutique' },
    { key: 'hostal',   label: '🌊 Hostal' },
  ];

  filters.forEach(({ key, label }) => {
    const btn = document.createElement('button');
    btn.textContent       = label;
    btn.className         = 'filter-btn' + (key === 'all' ? ' filter-btn--active' : '');
    btn.dataset.filter    = key;
    btn.setAttribute('aria-pressed', key === 'all' ? 'true' : 'false');

    btn.addEventListener('click', () => {
      // Actualizar botones
      filterBar.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('filter-btn--active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('filter-btn--active');
      btn.setAttribute('aria-pressed', 'true');

      // Filtrar tarjetas
      const cards = roomsGrid.querySelectorAll('.room-card');
      cards.forEach(card => {
        const match = key === 'all' || card.dataset.room === key;
        // Animación de entrada/salida
        if (match) {
          card.style.display   = '';
          card.style.opacity   = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity    = '1';
            card.style.transform  = 'translateY(0)';
          });
        } else {
          card.style.opacity    = '0';
          card.style.transform  = 'translateY(20px)';
          setTimeout(() => { card.style.display = 'none'; }, 350);
        }
      });
    });

    filterBar.appendChild(btn);
  });

  // Insertar antes del grid
  roomsGrid.parentNode.insertBefore(filterBar, roomsGrid);

  // Inyectar estilos del filtro
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .filter-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
      margin-bottom: 36px;
    }
    .filter-btn {
      padding: 9px 22px;
      font-family: 'Jost', sans-serif;
      font-size: 0.8rem;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      border: 1.5px solid rgba(255,255,255,0.2);
      background: transparent;
      color: rgba(255,255,255,0.7);
      border-radius: 40px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .filter-btn:hover {
      border-color: rgba(201,168,92,0.6);
      color: var(--dorado, #c9a85c);
    }
    .filter-btn--active {
      background: var(--dorado, #c9a85c);
      border-color: var(--dorado, #c9a85c);
      color: #1a2e1a;
    }
    .nav-link.active {
      color: var(--dorado, #c9a85c) !important;
    }
    .nav-link.active::after {
      width: 100% !important;
    }
  `;
  document.head.appendChild(styleEl);
}


/* ════════════════════════════════════════
   10. SMOOTH SCROLL para anclas internas
════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset   = navbar.offsetHeight + 8;
      const top      = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ════════════════════════════════════════
   11. LAZY LOADING de imágenes con fade-in
════════════════════════════════════════ */
const lazyImages = document.querySelectorAll('img[loading="lazy"]');

const imageObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.style.transition = 'opacity 0.5s ease';
      img.style.opacity    = '0';
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });
      imageObserver.unobserve(img);
    }
  });
}, { rootMargin: '200px' });

lazyImages.forEach(img => imageObserver.observe(img));


/* ════════════════════════════════════════
   12. EFECTO PARALLAX suave en Hero
════════════════════════════════════════ */
const heroBg = document.querySelector('.hero-bg');

if (heroBg && window.matchMedia('(min-width: 768px)').matches) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrollY * 0.35}px)`;
    }
  }, { passive: true });
}


/* ════════════════════════════════════════
   INIT — Log de bienvenida
════════════════════════════════════════ */
console.log(
  '%c✦ Paraíso SV %c— Alojamientos Turísticos en El Salvador',
  'color:#c9a85c; font-size:16px; font-weight:bold;',
  'color:#4a7a4a; font-size:14px;'
);
console.log('%cContacto: queli1801@gmail.com', 'color:#888; font-size:11px;');
