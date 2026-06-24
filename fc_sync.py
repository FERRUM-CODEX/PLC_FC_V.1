# ============================================================
#   FC.SYNC — Sincronización entre PLC Virtual y PLC Físico
#   Compatible con MicroPython (Thonny) y Python normal
# ============================================================

import time

# Detectar entorno
try:
    import ujson as json
    import urequests
    SYNC_ENV = "PICO"
except:
    import json
    import requests
    SYNC_ENV = "VIRTUAL"


class FC_SYNC:

    MODE = "VIRTUAL"
    # Opciones:
    # "VIRTUAL" → solo software
    # "FISICO"  → solo hardware
    # "HIBRIDO" → sincronización activa

    SERVER_URL = None  # Dirección del PLC virtual

    @staticmethod
    def set_mode(mode):
        FC_SYNC.MODE = mode

    @staticmethod
    def set_server(url):
        FC_SYNC.SERVER_URL = url

    @staticmethod
    def sync(MEM_TABLE):
        # ------------------------------
        # MODO VIRTUAL → no sincroniza
        # ------------------------------
        if FC_SYNC.MODE == "VIRTUAL":
            return MEM_TABLE

        # ------------------------------
        # MODO FÍSICO → no sincroniza
        # ------------------------------
        if FC_SYNC.MODE == "FISICO":
            return MEM_TABLE

        # ------------------------------
        # MODO HÍBRIDO → sincroniza
        # ------------------------------
        if FC_SYNC.MODE == "HIBRIDO":

            if SYNC_ENV == "PICO":
                # Pico envía su MEM_TABLE al servidor virtual
                try:
                    payload = json.dumps(MEM_TABLE)
                    r = urequests.post(FC_SYNC.SERVER_URL + "/sync", data=payload)
                    updated = json.loads(r.text)

                    # Fusionar tablas
                    for k, v in updated.items():
                        MEM_TABLE[k] = v

                except Exception as e:
                    print("Error de sincronización:", e)

            else:
                # Lado virtual no sincroniza aquí
                pass

        return MEM_TABLE