# ⚙️ PLC_FC — Lenguaje Lógico Industrial + Motor Virtual + Dashboard Web

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Python](https://img.shields.io/badge/python-3.10+-blue)
![License](https://img.shields.io/badge/license-GPLv3-red)
![Platform](https://img.shields.io/badge/platform-PC%20%7C%20Android%20(Pydroid)-orange)

**PLC_FC** es un lenguaje lógico inspirado en PLCs industriales (Siemens, Allen‑Bradley, Schneider), diseñado para ser simple, modular y ejecutarse en **Python / MicroPython**.  
Incluye:

- Motor lógico virtual  
- Entradas / salidas digitales  
- Entradas analógicas  
- Temporizadores (TON, TOF, BLINK)  
- Comparadores  
- Máquina de estados  
- Dashboard web avanzado  
- HMI web  
- Animaciones industriales SVG  
- Tendencias en tiempo real  

Este proyecto está pensado para **educación, prototipos, simulación industrial y automatización ligera**.

---

# 📸 Capturas del Dashboard

*(Agrega aquí tus imágenes cuando las subas al repo)*

---

# 🚀 Características principales

## 🔧 Motor PLC Virtual
- Entradas digitales `IN_0 … IN_15`
- Salidas digitales `OUT_0 … OUT_15`
- Entradas analógicas `AL_0 … AL_15`
- Temporizadores:
  - TON (retardo a la conexión)
  - TOF (retardo a la desconexión)
  - BLINK (parpadeo)
- Comparadores:
  - `FC_GT`, `FC_LT`, `FC_EQ`
  - `FC_RANGE`
- Máquina de estados
- Ciclo de scan tipo PLC

## 🌐 Dashboard Web Avanzado
- Estado del PLC (RUN/STOP, conexión, heartbeat)
- Tendencias en tiempo real (Chart.js)
- Animaciones industriales SVG:
  - Motores
  - Bandas transportadoras
  - Ventiladores
  - Tanques
  - Flujo de material
- Panel de entradas / salidas
- Panel de analógicas
- Animaciones dinámicas configurables por el usuario

## 🖥️ HMI Web
- Interfaz ligera para control directo
- Botones industriales
- Indicadores visuales
- Compatible con móvil y escritorio

---

# 🏗️ Arquitectura del Proyecto
#PLC_FC/ 
#│ 
#├── fc_hw.py  # Capa de hardware virtual
#├── fc_sync.py  # Sincronización del PLC
#├── main.py   # Punto de entrada 
#├── plc_fc.py   # Núcleo del lenguaje FC
#├── user_program.py  # Lógica del usuario
#│ 
#└── web/ 
#           ├── server.py # Servidor Flask
#           │ 
#           ├── templates/ 
#           │     ├── dashboard.html 
#           │     ├── hmi.html 
#           │     ├── editor.html 
#           │     └── index.html 
#           │
#           └── static/ 
#                   ├── dashboard.js 
#                   ├── hmi_advanced.js 
#                   ├── css/ 
#                   ├── img/
#                   └── js/