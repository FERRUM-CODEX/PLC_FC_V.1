// ---------------------- API ----------------------

async function getState() {
    const res = await fetch("/get_state");
    return await res.json();
}

// ---------------------- TARJETAS DIGITALES ----------------------

function createDigitalCard(name, value) {
    const isOutput = name.startsWith("OUT_");
    const isInput = name.startsWith("IN_");

    return `
        <div class="col-md-3 mb-3">
            <div class="card p-3">
                <div class="label-bright">${name}</div>

                <div class="d-flex align-items-center mt-2">
                    <div class="${value ? "indicator-on" : "indicator-off"}"></div>
                    <span class="ms-2">${value ? "ON" : "OFF"}</span>
                </div>

                ${isInput ? `
                    <button class="btn btn-primary btn-hmi" onclick="toggleInput('${name}', ${!value})">
                        Cambiar a ${!value ? "ON" : "OFF"}
                    </button>
                ` : ""}

                ${isOutput ? `
                    <button class="btn btn-warning btn-hmi" onclick="toggleOutput('${name}', ${!value})">
                        Forzar a ${!value ? "ON" : "OFF"}
                    </button>
                ` : ""}
            </div>
        </div>
    `;
}

async function toggleInput(name, value) {
    const index = name.split("_")[1];
    await fetch("/set_input", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({input: index, value})
    });
}

async function toggleOutput(name, value) {
    const index = name.split("_")[1];
    await fetch("/set_output", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({output: index, value})
    });
}

// ---------------------- TARJETAS ANALÓGICAS ----------------------

function createAnalogCard(name, value) {
    const val = Number(value) || 0;

    return `
        <div class="col-md-4 mb-3">
            <div class="card p-3">
                <div class="label-bright">${name}</div>

                <input type="range" min="0" max="100" value="${val}" 
                    class="form-range mt-2"
                    oninput="updateAnalog('${name}', this.value)">

                <div class="slider-value">${val}%</div>
            </div>
        </div>
    `;
}

async function updateAnalog(name, value) {
    const index = name.split("_")[1];
    await fetch("/set_analog", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({analog: index, value})
    });
}

// ---------------------- LOOP PRINCIPAL HMI ----------------------

async function updateHMI() {
    const state = await getState();

    const inputs = document.getElementById("inputs-container");
    const outputs = document.getElementById("outputs-container");
    const analogs = document.getElementById("analogs-container");

    inputs.innerHTML = "";
    outputs.innerHTML = "";
    analogs.innerHTML = "";

    for (const key in state) {
        const value = state[key];

        if (key.startsWith("IN_")) {
            inputs.innerHTML += createDigitalCard(key, value);
        }

        if (key.startsWith("OUT_")) {
            outputs.innerHTML += createDigitalCard(key, value);
        }

        if (key.startsWith("AL_")) {
            analogs.innerHTML += createAnalogCard(key, value);
        }
    }
}

setInterval(updateHMI, 100); 