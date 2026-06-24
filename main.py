# ============================================================
#   MAIN — Ciclo de escaneo del PLC_FC
#   Llama al programa del usuario (user_program.py)
#   Compatible con Thonny (Pico W2) y Pydroid3
# ============================================================

import time

from plc_fc import MEM_TABLE
from fc_hw import read_inputs, write_outputs
from fc_sync import FC_SYNC
from user_program import user_main   # ← Tu programa separado


# ------------------------------------------------------------
# CONFIGURACIÓN DEL SISTEMA
# ------------------------------------------------------------

# MODO HÍBRIDO (físico + virtual)
FC_SYNC.set_mode("SERVIDOR")

# Dirección del PLC virtual (Pydroid3/PC)
# Cambia la IP por la de tu celular o PC
FC_SYNC.set_server("http://192.168.1.50:5000")


# ------------------------------------------------------------
# CICLO DE ESCANEO (SCAN CYCLE)
# ------------------------------------------------------------
def scan_cycle():
    read_inputs(MEM_TABLE)     # Leer entradas físicas o virtuales
    user_main()                # Ejecutar lógica del usuario
    write_outputs(MEM_TABLE)   # Escribir salidas físicas o virtuales
    FC_SYNC.sync(MEM_TABLE)    # Sincronización híbrida


# ------------------------------------------------------------
# LOOP PRINCIPAL
# ------------------------------------------------------------
try:
    while True:
        scan_cycle()
        time.sleep(0.01)  # 100 Hz
except KeyboardInterrupt:
    print("PLC detenido.")