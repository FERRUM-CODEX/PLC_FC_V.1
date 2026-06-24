# ============================================================
#   USER_PROGRAM.PY — Programa del usuario para PLC_FC
#   Aquí va ÚNICAMENTE la lógica del usuario
# ============================================================

from plc_fc import FC

def user_main():
    # ============================================================
    # 1) IN_0 controla OUT_0 (estilo FC)
    # ============================================================

    # OUT_0 sigue directamente a IN_0
    FC.OUT(0, FC.IN(0))


    # ============================================================
    # 2) Control escalonado por AL_0 (0–100%)
    # ============================================================

    al = FC.AL(0)  # valor analógico 0–100

    # OUT_1 se enciende si AL_0 >= 33
    FC.OUT(1, FC.COMPARE(al, ">=", 33))

    # OUT_2 se enciende si AL_0 >= 66
    FC.OUT(2, FC.COMPARE(al, ">=", 66))

    # OUT_3 se enciende si AL_0 >= 100
    FC.OUT(3, FC.COMPARE(al, ">=", 100))