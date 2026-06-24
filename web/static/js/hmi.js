// ============================================================
//   HMI.JS — Control total del PLC FC desde el HMI
//   Entradas, salidas, analógicas, renombrado y persistencia
// ============================================================

// -----------------------------
// Cargar nombres guardados
// -----------------------------
let IO_NAMES = JSON.parse(localStorage.getItem("PLC_IO_NAMES") || "{}");

// Si faltan nombres, asignar por defecto
function ensureDefaultNames() {
    for (let i = 0; i <= 6; i++) {
        if (!IO_NAMES["IN_" + i]) IO_NAMES["IN_" + i] = "Entrada " + i;
        if (!IO_NAMES["OUT_" + i]) IO_NAMES["OUT_" + i] = "Salida " + i;
    }
    for (let i = 0; i <= 2; i++) {
        if (!IO_NAMES["AL_" + i]) IO_NAMES["AL_" + i] = "Analógica " + i;
    }
}
ensureDefaultNames();

// Guardar nombres
function saveNames() {
    localStorage.setItem("PLC_IO_NAMES", JSON.stringify(IO_NAMES));
}

// -----------------------------
// Obtener estado del PLC
// -----------------------------
async function getState() {
    const res = await fetch("/get_state");
    return await res.json();
}

// -----------------------------
// Manipular salidas digitales
// -----------------------------
async function setOutput(n, val) {
    await fetch("/set_output", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({output: n, value: val})
    });
}

// -----------------------------
// Manipular entradas digitales
// -----------------------------
async function setInput(n, val) {
    await fetch("/set_input", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({input: n, value: val})
    });
}

// -----------------------------
// Manipular entradas analógicas
// -----------------------------
async function setAnalog(n, val) {
    await fetch("/set_analog", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({analog: n, value: val})
    });
}

// -----------------------------
// Renombrar cualquier IO
// -----------------------------
function renameIO(key) {
    const nuevo = prompt("Nuevo nombre para " + key + ":");
    if (!nuevo) return;

    IO_NAMES[key] = nuevo;
    saveNames();
}

// -----------------------------
// Renderizar todo el HMI
// -----------------------------
function renderIO(state) {
    const inputsDiv = document.getElementById("inputs");
    const outputsDiv = document.getElementById("outputs");
    const analogsDiv = document.getElementById("analogs");

    inputsDiv.innerHTML = "";
    outputsDiv.innerHTML = "";
    analogsDiv.innerHTML = "";

    // Entradas digitales
    for (let i = 0; i <= 6; i++) {
        const val = state["IN_" + i] ? "ON" : "OFF";

        inputsDiv.innerHTML += `
            <div class="io-item">
                <strong>${IO_NAMES["IN_" + i]}</strong><br>
                Estado: <span class="indicator">${val}</span><br>
                <button class="btn" onclick="setInput(${i}, true)">ON</button>
                <button class="btn" onclick="setInput(${i}, false)">OFF</button>
                <button class="btn" onclick="renameIO('IN_${i}')">Renombrar</button>
            </div>`;
    }

    // Salidas digitales
    for (let i = 0; i <= 6; i++) {
        const val = state["OUT_" + i] ? "ON" : "OFF";
        const newVal = !state["OUT_" + i];

        outputsDiv.innerHTML += `
            <div class="io-item">
                <strong>${IO_NAMES["OUT_" + i]}</strong><br>
                Estado: <span class="indicator">${val}</span><br>
                <button class="btn" onclick="setOutput(${i}, ${newVal})">Cambiar</button>
                <button class="btn" onclick="renameIO('OUT_${i}')">Renombrar</button>
            </div>`;
    }

    // Entradas analógicas
    for (let i = 0; i <= 2; i++) {
        const val = state["AL_" + i];

        analogsDiv.innerHTML += `
            <div class="io-item">
                <strong>${IO_NAMES["AL_" + i]}</strong><br>
                Valor: <span class="indicator">${val.toFixed(1)}%</span><br>
                <input type="range" min="0" max="100" value="${val}"
                    oninput="setAnalog(${i}, this.value)">
                <button class="btn" onclick="renameIO('AL_${i}')">Renombrar</button>
            </div>`;
    }
}

// -----------------------------
// LOOP PRINCIPAL
// -----------------------------
async function loop() {
    const state = await getState();
    renderIO(state);
}

setInterval(loop, 100);