// ==== CONFIGURA AQUÍ TU NÚMERO DE WHATSAPP ====
const NUMERO_WHATSAPP = "573116723104";
// ==== FRASE DE MARCA ====
// "No cambies tu autenticidad por aprobación."

let productos = [];
let tallaSeleccionada = null;
let productoActual = null;

const grid = document.getElementById("grid");
const modalFondo = document.getElementById("modalFondo");

fetch("products.json")
  .then((res) => res.json())
  .then((data) => {
    productos = data;
    renderizar();
  })
  .catch((err) => {
    grid.innerHTML = "<p style='padding:24px;color:#f5d800'>No se pudieron cargar los productos.</p>";
    console.error(err);
  });

function formatearPrecio(numero) {
  return "$" + numero.toLocaleString("es-CO");
}

function renderizar() {
  grid.innerHTML = "";
  productos.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-img">
        ${!p.disponible ? '<div class="agotado-tag">AGOTADO</div>' : ""}
        <img src="${p.imagen}" alt="${p.nombre}">
      </div>
      <div class="card-info">
        <h3>${p.nombre}</h3>
        <div class="precio">${formatearPrecio(p.precio)}</div>
      </div>
    `;
    card.addEventListener("click", () => abrirModal(p));
    grid.appendChild(card);
  });
}

function abrirModal(p) {
  productoActual = p;
  tallaSeleccionada = null;

  document.getElementById("modalImg").src = p.imagen;
  document.getElementById("modalImg").alt = p.nombre;
  document.getElementById("modalNombre").textContent = p.nombre;
  document.getElementById("modalPrecio").textContent = formatearPrecio(p.precio);
  document.getElementById("modalDesc").textContent = p.descripcion;

  const tallasDiv = document.getElementById("modalTallas");
  tallasDiv.innerHTML = "";
  p.tallas.forEach((t) => {
    const b = document.createElement("button");
    b.className = "talla-btn";
    b.textContent = t;
    b.addEventListener("click", () => {
      tallaSeleccionada = t;
      document.querySelectorAll(".talla-btn").forEach((x) => x.classList.remove("sel"));
      b.classList.add("sel");
      actualizarEnlacePedido();
    });
    tallasDiv.appendChild(b);
  });

  actualizarEnlacePedido();
  modalFondo.classList.add("abierto");
}

function actualizarEnlacePedido() {
  const boton = document.getElementById("modalPedir");
  if (!productoActual) return;

  let mensaje = `Hola! Me interesa el producto: ${productoActual.nombre} (${formatearPrecio(productoActual.precio)})`;
  if (tallaSeleccionada) mensaje += ` - Talla: ${tallaSeleccionada}`;
  mensaje += ". ¿Está disponible?";

  boton.href = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
}

document.getElementById("cerrarModal").addEventListener("click", () => {
  modalFondo.classList.remove("abierto");
});

modalFondo.addEventListener("click", (e) => {
  if (e.target === modalFondo) modalFondo.classList.remove("abierto");
});

// ---------- Cuenta regresiva ----------
// Cambia esta fecha por la del próximo "drop" o lanzamiento
const fechaFinal = new Date("2026-10-15T00:00:00").getTime();

function actualizarCountdown() {
  const ahora = new Date().getTime();
  const diferencia = fechaFinal - ahora;

  if (diferencia < 0) return;

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diferencia % (1000 * 60)) / 1000);

  document.getElementById("c-days").textContent = String(dias).padStart(2, "0");
  document.getElementById("c-hours").textContent = String(horas).padStart(2, "0");
  document.getElementById("c-mins").textContent = String(mins).padStart(2, "0");
  document.getElementById("c-secs").textContent = String(secs).padStart(2, "0");
}

setInterval(actualizarCountdown, 1000);
actualizarCountdown();
