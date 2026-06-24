# ============================================================
#   FC.HW — Capa de Abstracción de Hardware
#   Compatible con MicroPython (Thonny) y Python normal
# ============================================================

import time

# Detectar entorno
try:
    import machine
    HW_MODE = "PICO"
except:
    HW_MODE = "VIRTUAL"


# ============================================================
#   Pines reales (solo si estamos en la Pico W2)
# ============================================================

if HW_MODE == "PICO":
    from machine import Pin, ADC

    # Entradas digitales
    DI_PINS = {
        0: Pin(2, Pin.IN),
        1: Pin(3, Pin.IN),
        2: Pin(4, Pin.IN),
        3: Pin(5, Pin.IN),
        4: Pin(6, Pin.IN),
        5: Pin(7, Pin.IN),
        6: Pin(8, Pin.IN),
    }

    # Entradas analógicas
    AI_PINS = {
        0: ADC(26),
        1: ADC(27),
        2: ADC(28),
    }

    # Salidas digitales
    DO_PINS = {
        0: Pin(10, Pin.OUT),
        1: Pin(11, Pin.OUT),
        2: Pin(12, Pin.OUT),
        3: Pin(13, Pin.OUT),
        4: Pin(14, Pin.OUT),
        5: Pin(15, Pin.OUT),
        6: Pin(16, Pin.OUT),
    }


# ============================================================
#   Funciones de lectura y escritura
# ============================================================

def read_inputs(MEM_TABLE):
    """Lee entradas reales si estamos en la Pico, o no hace nada en modo virtual."""
    if HW_MODE == "PICO":
        # Entradas digitales
        for i, pin in DI_PINS.items():
            MEM_TABLE[f"IN_{i}"] = bool(pin.value())

        # Entradas analógicas (normalizadas 0–100%)
        for i, adc in AI_PINS.items():
            MEM_TABLE[f"AL_{i}"] = adc.read_u16() / 65535 * 100

    return MEM_TABLE


def write_outputs(MEM_TABLE):
    """Escribe salidas reales si estamos en la Pico, o no hace nada en modo virtual."""
    if HW_MODE == "PICO":
        for i, pin in DO_PINS.items():
            pin.value(1 if MEM_TABLE[f"OUT_{i}"] else 0)