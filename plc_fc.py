# ============================================================
#   PLC_FC_VIRTUAL — Núcleo del Lenguaje FC
#   Compatible con MicroPython y Python normal
# ============================================================

import time

# ============================================================
#   TABLA DE MEMORIA
# ============================================================

MEM_TABLE = {
    # Entradas digitales
    "IN_0": False,
    "IN_1": False,
    "IN_2": False,
    "IN_3": False,
    "IN_4": False,
    "IN_5": False,
    "IN_6": False,

    # Entradas analógicas
    "AL_0": 0.0,
    "AL_1": 0.0,
    "AL_2": 0.0,

    # Salidas digitales
    "OUT_0": False,
    "OUT_1": False,
    "OUT_2": False,
    "OUT_3": False,
    "OUT_4": False,
    "OUT_5": False,
    "OUT_6": False,
}

# ============================================================
#   CLASE FC — Funciones industriales
# ============================================================

class FC:

    # ---------------- ENTRADAS ----------------
    @staticmethod
    def IN(n):
        return MEM_TABLE.get(f"IN_{n}", False)

    @staticmethod
    def AL(n):
        return MEM_TABLE.get(f"AL_{n}", 0.0)

    # ---------------- SALIDAS ----------------
    @staticmethod
    def OUT(n, value):
        MEM_TABLE[f"OUT_{n}"] = bool(value)

    # ---------------- MEMORIA ----------------
    @staticmethod
    def MEM(name, value=None):
        if value is None:
            return MEM_TABLE.get(name, None)
        MEM_TABLE[name] = value
        return value

    # ---------------- LÓGICA ----------------
    @staticmethod
    def AND(a, b): return a and b
    @staticmethod
    def OR(a, b): return a or b
    @staticmethod
    def NOT(a): return not a
    @staticmethod
    def XOR(a, b): return bool(a) ^ bool(b)

    # ---------------- DECISIONES ----------------
    @staticmethod
    def IF(cond, t, f): return t if cond else f
    @staticmethod
    def MUX(cond, t, f): return t if cond else f

    # ---------------- SELECTORES ----------------
    @staticmethod
    def SELECT(index, values):
        try: return values[int(index)]
        except: return None

    @staticmethod
    def CASE(value, cases: dict, default=None):
        return cases.get(value, default)

    # ---------------- COMPARADORES ----------------
    @staticmethod
    def COMPARE(a, op, b):
        if op == "==": return a == b
        if op == "!=": return a != b
        if op == ">": return a > b
        if op == "<": return a < b
        if op == ">=": return a >= b
        if op == "<=": return a <= b
        return False

    @staticmethod
    def COMPARE_RANGE(value, min_val, max_val):
        return min_val <= value <= max_val

    @staticmethod
    def LIMIT(value, min_val, max_val):
        if value < min_val: return min_val
        if value > max_val: return max_val
        return value

    # ---------------- MATH ----------------
    @staticmethod
    def MATH(expr):
        try: return eval(expr)
        except: return None

    # ---------------- TON ----------------
    @staticmethod
    def TON(name, condition, preset_ms):
        if name not in MEM_TABLE:
            MEM_TABLE[name] = {
                "start": None,
                "elapsed": 0,
                "done": False,
                "running": False
            }

        t = MEM_TABLE[name]

        if condition:
            if not t["running"]:
                t["start"] = time.time()
                t["running"] = True

            t["elapsed"] = (time.time() - t["start"]) * 1000

            if t["elapsed"] >= preset_ms:
                t["done"] = True
        else:
            t["start"] = None
            t["elapsed"] = 0
            t["done"] = False
            t["running"] = False

        return t["done"]

    # ---------------- TOF ----------------
    @staticmethod
    def TOF(name, condition, preset_ms):
        if name not in MEM_TABLE:
            MEM_TABLE[name] = {
                "start": None,
                "elapsed": 0,
                "done": False,
                "running": False,
                "output": False
            }

        t = MEM_TABLE[name]

        if condition:
            t["output"] = True
            t["start"] = None
            t["elapsed"] = 0
            t["done"] = False
            t["running"] = False
            return t["output"]

        if not t["running"]:
            t["start"] = time.time()
            t["running"] = True

        t["elapsed"] = (time.time() - t["start"]) * 1000

        if t["elapsed"] >= preset_ms:
            t["output"] = False
            t["done"] = True

        return t["output"]

    # ---------------- CTU ----------------
    @staticmethod
    def CTU(name, condition, preset):
        if name not in MEM_TABLE:
            MEM_TABLE[name] = {"count": 0, "done": False, "last": False}

        c = MEM_TABLE[name]
        rising = condition and not c["last"]

        if rising:
            c["count"] += 1

        c["done"] = c["count"] >= preset
        c["last"] = condition

        return c["done"]

    # ---------------- CTD ----------------
    @staticmethod
    def CTD(name, condition, preset):
        if name not in MEM_TABLE:
            MEM_TABLE[name] = {
                "count": preset,
                "done": False,
                "last": False,
                "preset": preset
            }

        c = MEM_TABLE[name]
        rising = condition and not c["last"]

        if rising:
            c["count"] -= 1

        if c["count"] <= 0:
            c["count"] = 0
            c["done"] = True
        else:
            c["done"] = False

        c["last"] = condition

        return c["done"]

    # ---------------- R_TRIG ----------------
    @staticmethod
    def R_TRIG(name, signal):
        if name not in MEM_TABLE:
            MEM_TABLE[name] = {"last": False}

        t = MEM_TABLE[name]
        rising = signal and not t["last"]
        t["last"] = signal
        return rising

    # ---------------- F_TRIG ----------------
    @staticmethod
    def F_TRIG(name, signal):
        if name not in MEM_TABLE:
            MEM_TABLE[name] = {"last": False}

        t = MEM_TABLE[name]
        falling = (not signal) and t["last"]
        t["last"] = signal
        return falling

    # ---------------- SR ----------------
    @staticmethod
    def SR(name, S, R):
        if name not in MEM_TABLE:
            MEM_TABLE[name] = {"Q": False}

        q = MEM_TABLE[name]

        if R: q["Q"] = False
        elif S: q["Q"] = True

        return q["Q"]

    # ---------------- RS ----------------
    @staticmethod
    def RS(name, R, S):
        if name not in MEM_TABLE:
            MEM_TABLE[name] = {"Q": False}

        q = MEM_TABLE[name]

        if S: q["Q"] = True
        elif R: q["Q"] = False

        return q["Q"]

    # ---------------- BLINK ----------------
    @staticmethod
    def BLINK(name, on_ms, off_ms):
        if name not in MEM_TABLE:
            MEM_TABLE[name] = {
                "state": False,
                "start": time.time(),
                "elapsed": 0
            }

        b = MEM_TABLE[name]
        b["elapsed"] = (time.time() - b["start"]) * 1000

        if b["state"] and b["elapsed"] >= on_ms:
            b["state"] = False
            b["start"] = time.time()

        elif not b["state"] and b["elapsed"] >= off_ms:
            b["state"] = True
            b["start"] = time.time()

        return b["state"]

    # ---------------- PULSE ----------------
    @staticmethod
    def PULSE(name, signal, preset_ms):
        if name not in MEM_TABLE:
            MEM_TABLE[name] = {
                "start": None,
                "active": False,
                "last": False
            }

        p = MEM_TABLE[name]
        rising = signal and not p["last"]

        if rising:
            p["start"] = time.time()
            p["active"] = True

        if p["active"]:
            elapsed = (time.time() - p["start"]) * 1000
            if elapsed >= preset_ms:
                p["active"] = False

        p["last"] = signal
        return p["active"]

# ============================================================
#   FUNCIONES DEL PLC VIRTUAL (FALTABAN EN TU ARCHIVO)
# ============================================================

def read_inputs():
    """Aquí puedes mapear hardware real si quieres."""
    pass

def write_outputs():
    """Aquí puedes mapear hardware real si quieres."""
    pass

def main():
    pass