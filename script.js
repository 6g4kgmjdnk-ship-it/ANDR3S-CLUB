
// ==== CONFIGURA AQUÍ TU NÚMERO DE WHATSAPP (con código de país, sin +, sin espacios) ====
const NUMERO_WHATSAPP = "573116723104";

let productos = [];
let categoriaActual = "todo";
let tallaSeleccionada = null;
let productoActual = null;

const grid = document.getElementById("grid");
const modalFondo = document.getElementById("modalFondo");

// Cargar productos desde products.json
fetch("products.json")
  .then((res) => res.json())
  .then((data) => {
    productos = data;
    renderizar();
  })
  .catch((err) => {
    grid.innerHTML = "<p style='padding:24px;color:#8a8a82'>No se pudieron cargar los productos.</p>";
    console.error(err);
  });

function formatearPrecio(numero) {
  return "$" + numero.toLocaleString("es-CO");
}

function renderizar() {
  grid.innerHTML = "";
  const lista = productos.filter(
    (p) => categoriaActual === "todo" || p.categoria === categoriaActual
  );

  lista.forEach((p) => {
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

// Filtros de categoría
document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("activo"));
    btn.classList.add("activo");
    categoriaActual = btn.dataset.cat;
    renderizar();
  });
});

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
