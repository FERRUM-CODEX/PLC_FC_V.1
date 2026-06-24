# ============================================================
#   SERVER.PY — PLC_FC Web Server (Versión Final, OPCIÓN A)
# ============================================================

import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, render_template, request, jsonify
import threading
import time

from plc_fc import MEM_TABLE, read_inputs, write_outputs
from user_program import user_main
from fc_sync import FC_SYNC

# MODO SERVIDOR (OBLIGATORIO)
FC_SYNC.set_mode("SERVIDOR")

app = Flask(__name__)

# ============================================================
#   HILO DEL PLC VIRTUAL (100 Hz)
# ============================================================

def plc_loop():
    while True:
        try:
            read_inputs()          # ← YA NO PASA MEM_TABLE
            user_main()            # ← LÓGICA DEL USUARIO
            write_outputs()        # ← YA NO PASA MEM_TABLE
            FC_SYNC.sync(MEM_TABLE)
        except Exception as e:
            print("ERROR en PLC loop:", e)

        time.sleep(0.01)

threading.Thread(target=plc_loop, daemon=True).start()

# ============================================================
#   RUTAS WEB
# ============================================================

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/hmi")
def hmi():
    return render_template("hmi.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/editor")
def editor():
    return render_template("editor.html")

# ============================================================
#   API: Obtener estado completo del PLC
# ============================================================

@app.route("/get_state")
def get_state():
    return jsonify(MEM_TABLE)

# ============================================================
#   API: Manipular salidas digitales
# ============================================================

@app.post("/set_output")
def set_output():
    data = request.json
    key = f"OUT_{data['output']}"
    MEM_TABLE[key] = bool(data["value"])
    return {"ok": True}

# ============================================================
#   API: Manipular entradas digitales
# ============================================================

@app.post("/set_input")
def set_input():
    data = request.json
    key = f"IN_{data['input']}"
    MEM_TABLE[key] = bool(data["value"])
    return {"ok": True}

# ============================================================
#   API: Manipular entradas analógicas
# ============================================================

@app.post("/set_analog")
def set_analog():
    data = request.json
    key = f"AL_{data['analog']}"
    MEM_TABLE[key] = float(data["value"])
    return {"ok": True}

# ============================================================
#   INICIAR SERVIDOR
# ============================================================

if __name__ == "__main__":
    print("Iniciando servidor web PLC_FC...")
    app.run(host="0.0.0.0", port=5000, debug=False)