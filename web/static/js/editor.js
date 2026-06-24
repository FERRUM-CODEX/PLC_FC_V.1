// ============================================================
//   EDITOR.JS — Editor Visual de Bloques FC
//   Versión avanzada base: nodos, movimiento, export/import,
//   IDs únicos y preparación para conexiones.
// ============================================================

const workspace = document.getElementById("workspace");

// Lista global de nodos
let NODES = [];

// Generador de IDs únicos
function uid() {
    return "N" + Math.random().toString(36).substr(2, 9);
}

// ------------------------------------------------------------
// CREAR NODO
// ------------------------------------------------------------
function createNode(type, x, y) {
    const id = uid();

    const node = document.createElement("div");
    node.className = "node";
    node.dataset.id = id;
    node.dataset.type = type;
    node.style.left = x + "px";
    node.style.top = y + "px";
    node.innerHTML = `
        <strong>${type}</strong>
        <br>
        <small>${id}</small>
    `;

    // Hacerlo movible
    node.onmousedown = dragNode;

    workspace.appendChild(node);

    // Guardar en lista
    NODES.push({
        id: id,
        type: type,
        x: x,
        y: y
    });
}

// ------------------------------------------------------------
// DRAG & DROP DESDE EL SIDEBAR
// ------------------------------------------------------------
document.querySelectorAll(".block").forEach(block => {
    block.addEventListener("dragstart", e => {
        e.dataTransfer.setData("type", block.dataset.type);
    });
});

workspace.addEventListener("dragover", e => e.preventDefault());

workspace.addEventListener("drop", e => {
    const type = e.dataTransfer.getData("type");
    createNode(type, e.clientX - 100, e.clientY - 40);
});

// ------------------------------------------------------------
// MOVER NODOS
// ------------------------------------------------------------
function dragNode(e) {
    const node = e.target.closest(".node");
    if (!node) return;

    let offsetX = e.clientX - node.offsetLeft;
    let offsetY = e.clientY - node.offsetTop;

    function move(ev) {
        node.style.left = (ev.clientX - offsetX) + "px";
        node.style.top = (ev.clientY - offsetY) + "px";

        // Actualizar en lista
        const obj = NODES.find(n => n.id === node.dataset.id);
        if (obj) {
            obj.x = ev.clientX - offsetX;
            obj.y = ev.clientY - offsetY;
        }
    }

    function stop() {
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", stop);
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", stop);
}

// ------------------------------------------------------------
// EXPORTAR DIAGRAMA
// ------------------------------------------------------------
function exportDiagram() {
    const json = JSON.stringify(NODES, null, 2);
    alert("Copia este JSON:\n\n" + json);
}

// ------------------------------------------------------------
// IMPORTAR DIAGRAMA
// ------------------------------------------------------------
function importDiagram() {
    const json = prompt("Pega el JSON del diagrama:");
    if (!json) return;

    clearWorkspace();

    const data = JSON.parse(json);
    data.forEach(n => createNode(n.type, n.x, n.y));
}

// ------------------------------------------------------------
// LIMPIAR WORKSPACE
// ------------------------------------------------------------
function clearWorkspace() {
    workspace.innerHTML = "";
    NODES = [];
}