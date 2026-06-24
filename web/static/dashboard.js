// ---------------------- API ----------------------

async function getState() {
    const res = await fetch("/get_state");
    return await res.json();
}

// ---------------------- ESTADO DEL PLC ----------------------

function updatePLCStatus(state) {
    const runElem = document.getElementById("plc-run");
    runElem.innerText = state.PLC_RUN ? "RUN" : "STOP";
    runElem.className = "status-value " + (state.PLC_RUN ? "status-green" : "status-red");

    const connElem = document.getElementById("plc-connection");
    connElem.innerText = state.PLC_CONNECTED ? "ONLINE" : "OFFLINE";
    connElem.className = "status-value " + (state.PLC_CONNECTED ? "status-green" : "status-red");

    const modeElem = document.getElementById("plc-mode");
    modeElem.innerText = state.PLC_MODE || "AUTO";
    modeElem.className = "status-value status-yellow";

    const hbElem = document.getElementById("plc-heartbeat");
    hbElem.innerText = state.PLC_HEARTBEAT ? "●" : "○";
    hbElem.className = "status-value " + (state.PLC_HEARTBEAT ? "status-green" : "status-red");

    const syncElem = document.getElementById("plc-sync");
    if (state.PLC_LAST_SYNC) {
        syncElem.innerText = new Date(state.PLC_LAST_SYNC * 1000).toLocaleTimeString();
    } else {
        syncElem.innerText = "-";
    }
    syncElem.className = "status-value status-yellow";
}

// ---------------------- TARJETAS DIGITALES ----------------------

function createDigitalCard(name, value) {
    return `
        <div class="col-md-3 mb-3">
            <div class="card p-3">
                <div class="label-bright">${name}</div>
                <div class="status-value ${value ? "status-green" : "status-red"}">
                    ${value ? "ON" : "OFF"}
                </div>
            </div>
        </div>
    `;
}

// ---------------------- TARJETAS ANALÓGICAS ----------------------

function createAnalogCard(name, value) {
    const val = Number(value) || 0;

    return `
        <div class="col-md-4 mb-3">
            <div class="card p-3">
                <div class="label-bright">${name}</div>
                <div class="status-value status-yellow">${val}%</div>
                <div class="progress mt-2" style="height: 20px;">
                    <div class="progress-bar bg-success" style="width: ${val}%"></div>
                </div>
            </div>
        </div>
    `;
}

// ---------------------- CHARTS DINÁMICOS ----------------------

const charts = {};
const chartData = {};
const maxPoints = 50;

function createChartCard(name) {
    return `
        <div class="col-md-6 mb-3">
            <div class="card p-3">
                <div class="label-bright">${name}</div>
                <canvas id="chart-${name}" height="120"></canvas>
            </div>
        </div>
    `;
}

function initChart(name) {
    const ctx = document.getElementById(`chart-${name}`).getContext("2d");

    charts[name] = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: name,
                data: [],
                borderColor: "#58a6ff",
                backgroundColor: "rgba(88,166,255,0.2)",
                tension: 0.2,
                pointRadius: 0
            }]
        },
        options: {
            animation: false,
            scales: {
                x: { display: false },
                y: { min: 0, max: 100 }
            },
            plugins: { legend: { display: false } }
        }
    });

    chartData[name] = [];
}

function pushChartPoint(name, value) {
    const chart = charts[name];
    const data = chartData[name];

    data.push(value);
    if (data.length > maxPoints) data.shift();

    chart.data.labels = data.map((_, i) => i);
    chart.data.datasets[0].data = data;

    chart.update();
}

// ---------------------- ANIMACIONES SVG BASE ----------------------

function createMotor(label, state) {
    return `
        <div class="text-center">
            <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="35" stroke="#58a6ff" stroke-width="6" fill="none"/>
                <g transform="translate(50,50)">
                    <g class="${state ? "motor-spin" : ""}">
                        <rect x="-5" y="-30" width="10" height="20" fill="#00ff7f"/>
                        <rect x="-5" y="10" width="10" height="20" fill="#00ff7f"/>
                        <rect x="-30" y="-5" width="20" height="10" fill="#00ff7f"/>
                        <rect x="10" y="-5" width="20" height="10" fill="#00ff7f"/>
                    </g>
                </g>
            </svg>
        </div>
    `;
}

function createConveyor(label, state) {
    return `
        <div class="text-center">
            <svg width="150" height="60">
                <rect x="10" y="20" width="130" height="20" fill="#30363d" stroke="#58a6ff"/>
                <g class="${state ? "belt-move" : ""}">
                    <circle cx="20" cy="30" r="8" fill="#00ff7f"/>
                    <circle cx="60" cy="30" r="8" fill="#00ff7f"/>
                    <circle cx="100" cy="30" r="8" fill="#00ff7f"/>
                    <circle cx="140" cy="30" r="8" fill="#00ff7f"/>
                </g>
            </svg>
        </div>
    `;
}

function createLight(label, state) {
    return `
        <div class="text-center">
            <div class="light ${state ? "light-on" : "light-off"}"></div>
        </div>
    `;
}

function createFlow(label, state) {
    return `
        <div class="text-center">
            <svg width="150" height="40">
                <rect x="10" y="15" width="130" height="10" fill="#30363d" stroke="#58a6ff"/>
                <g class="${state ? "flow-move" : ""}">
                    <polygon points="20,20 30,15 30,25" fill="#00bfff"/>
                    <polygon points="50,20 60,15 60,25" fill="#00bfff"/>
                    <polygon points="80,20 90,15 90,25" fill="#00bfff"/>
                    <polygon points="110,20 120,15 120,25" fill="#00bfff"/>
                </g>
            </svg>
        </div>
    `;
}

function createFan(label, state) {
    return `
        <div class="text-center">
            <svg width="100" height="100">
                <circle cx="50" cy="50" r="40" stroke="#58a6ff" stroke-width="4" fill="none"/>
                <g class="${state ? "motor-spin" : ""}">
                    <polygon points="50,10 60,40 40,40" fill="#00bfff"/>
                    <polygon points="90,50 60,60 60,40" fill="#00bfff"/>
                    <polygon points="50,90 40,60 60,60" fill="#00bfff"/>
                    <polygon points="10,50 40,40 40,60" fill="#00bfff"/>
                </g>
            </svg>
        </div>
    `;
}

function createTank(label, state) {
    const level = state ? 80 : 20;
    return `
        <div class="text-center">
            <svg width="100" height="120">
                <rect x="20" y="10" width="60" height="100" stroke="#58a6ff" fill="none" stroke-width="3"/>
                <rect x="20" y="${110 - level}" width="60" height="${level}" fill="#00bfff" opacity="0.7"/>
            </svg>
        </div>
    `;
}

// ---------------------- SELECTOR DE ANIMACIONES DINÁMICAS ----------------------

const animationTypes = {
    "motor": "Motor Giratorio",
    "banda": "Banda Transportadora",
    "luz": "Luz de Estado",
    "flujo": "Flujo Animado",
    "ventilador": "Ventilador",
    "tanque": "Tanque Llenándose"
};

function getAnimationForOutput(outName) {
    return localStorage.getItem("anim_" + outName) || "motor";
}

function setAnimationForOutput(outName, type) {
    localStorage.setItem("anim_" + outName, type);
}

function renderAnimation(type, state) {
    switch (type) {
        case "motor": return createMotor("", state);
        case "banda": return createConveyor("", state);
        case "luz": return createLight("", state);
        case "flujo": return createFlow("", state);
        case "ventilador": return createFan("", state);
        case "tanque": return createTank("", state);
        default: return "";
    }
}

function createAnimationSelectorCard(name, state) {
    const selected = getAnimationForOutput(name);

    return `
        <div class="col-md-3 mb-3">
            <div class="card p-3 text-center">
                <div class="label-bright">${name}</div>

                <select class="form-select mt-2" onchange="changeAnimation('${name}', this.value)">
                    ${Object.keys(animationTypes).map(key => `
                        <option value="${key}" ${key === selected ? "selected" : ""}>
                            ${animationTypes[key]}
                        </option>
                    `).join("")}
                </select>

                <div class="mt-3" id="anim-${name}">
                    ${renderAnimation(selected, state)}
                </div>
            </div>
        </div>
    `;
}

function changeAnimation(name, type) {
    setAnimationForOutput(name, type);
}

// ---------------------- LOOP PRINCIPAL ----------------------

async function updateDashboard() {
    const state = await getState();

    updatePLCStatus(state);

    const analogPanel = document.getElementById("analog-panel");
    const outputPanel = document.getElementById("output-panel");
    const inputPanel = document.getElementById("input-panel");
    const chartsContainer = document.getElementById("charts-container");
    const animPanel = document.getElementById("animation-panel");
    const dynPanel = document.getElementById("dynamic-animations");

    analogPanel.innerHTML = "";
    outputPanel.innerHTML = "";
    inputPanel.innerHTML = "";
    animPanel.innerHTML = "";
    dynPanel.innerHTML = "";

    for (const key in state) {
        const value = state[key];

        // ANALÓGICAS
        if (key.startsWith("AL_")) {
            analogPanel.innerHTML += createAnalogCard(key, value);

            if (!charts[key]) {
                chartsContainer.innerHTML += createChartCard(key);
                setTimeout(() => initChart(key), 50);
            }
            pushChartPoint(key, Number(value) || 0);
        }

        // SALIDAS
        if (key.startsWith("OUT_")) {
            outputPanel.innerHTML += createDigitalCard(key, value);

            // Animaciones base
            if (key === "OUT_0") animPanel.innerHTML += `
                <div class="col-md-3 mb-3">
                    <div class="card p-3 text-center">
                        <div class="label-bright">Motor (OUT_0)</div>
                        ${createMotor("", value)}
                    </div>
                </div>
            `;
            if (key === "OUT_1") animPanel.innerHTML += `
                <div class="col-md-3 mb-3">
                    <div class="card p-3 text-center">
                        <div class="label-bright">Banda (OUT_1)</div>
                        ${createConveyor("", value)}
                    </div>
                </div>
            `;
            if (key === "OUT_2") animPanel.innerHTML += `
                <div class="col-md-3 mb-3">
                    <div class="card p-3 text-center">
                        <div class="label-bright">Luz (OUT_2)</div>
                        ${createLight("", value)}
                    </div>
                </div>
            `;
            if (key === "OUT_3") animPanel.innerHTML += `
                <div class="col-md-3 mb-3">
                    <div class="card p-3 text-center">
                        <div class="label-bright">Flujo (OUT_3)</div>
                        ${createFlow("", value)}
                    </div>
                </div>
            `;

            // Animaciones dinámicas
            dynPanel.innerHTML += createAnimationSelectorCard(key, value);
        }

        // ENTRADAS
        if (key.startsWith("IN_")) {
            inputPanel.innerHTML += createDigitalCard(key, value);
        }
    }

    // Refrescar animaciones dinámicas
    for (const key in state) {
        if (key.startsWith("OUT_")) {
            const animType = getAnimationForOutput(key);
            const elem = document.getElementById("anim-" + key);
            if (elem) {
                elem.innerHTML = renderAnimation(animType, state[key]);
            }
        }
    }
}

window.addEventListener("load", () => {
    updateDashboard();
});

setInterval(updateDashboard, 200);