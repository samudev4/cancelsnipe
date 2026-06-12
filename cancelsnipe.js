/*
 * Script Name: Cancel Snipe
 * Version: v1.24
 * Last Updated: 12/06/2026
 * Author: samudev (Mejoras de UI/UX e Iconos de Acceso Rápido)
 * Author URL: https://github.com/samudev4
 * Author Contact: samudevelopment@gmail.com
 * Approved: NO
 */

(function(){
    // Prevenir duplicados: si ya existe, lo cierra antes de abrir uno nuevo
    const existingBox = document.getElementById("backtime-box");
    if (existingBox) existingBox.remove();

    const cancelDelay = 5000;

    const style = document.createElement("style");
    style.textContent = `
    #backtime-box {
        position: fixed;
        top: 100px;
        left: 20px;
        width: 320px;
        background: #f4f1e7;
        color: #2b1d0f;
        padding: 12px;
        border: 2px solid #8b6f47;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        font-family: Verdana, Geneva, sans-serif;
        z-index: 99999;
        cursor: default;
    }
    #backtime-box .header {
        position: relative;
        margin-bottom: 12px;
        cursor: move;
        background: #8b6f47;
        border-radius: 4px;
        padding: 6px 0;
    }
    #backtime-box h2 {
        margin: 0;
        font-size: 14px;
        text-align: center;
        color: #fff;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    #backtime-box #close-backtime {
        position: absolute;
        top: 4px;
        right: 8px;
        cursor: pointer;
        color: #fff;
        font-weight: bold;
        font-size: 14px;
        transition: color 0.2s;
    }
    #backtime-box #close-backtime:hover {
        color: #ffcccc;
    }
    #backtime-box label {
        font-size: 11px;
        font-weight: bold;
        display: block;
        margin-bottom: 4px;
    }
    #backtime-box input {
        width: 100%;
        box-sizing: border-box;
        padding: 6px;
        margin-bottom: 12px;
        border: 1px solid #c2b59b;
        border-radius: 4px;
        font-size: 13px;
        background: #fff;
    }
    #backtime-box input:focus {
        border-color: #8b6f47;
        outline: none;
    }
    #backtime-box button {
        width: 100%;
        padding: 8px;
        background: linear-gradient(#d9c39c, #b79868);
        border: 1px solid #8b6f47;
        color: #2b1d0f;
        border-radius: 4px;
        font-size: 13px;
        font-weight: bold;
        cursor: pointer;
        text-transform: uppercase;
        transition: background 0.2s;
    }
    #backtime-box button:hover {
        background: linear-gradient(#c6b088, #a58656);
    }
    #backtime-box .resultado-box {
        margin-top: 12px;
        padding: 10px;
        border-radius: 4px;
        font-size: 12px;
        background: #e6dfc9;
        color: #2b1d0f;
        line-height: 1.4;
        white-space: pre-wrap; /* Respeta los saltos de línea */
    }
    
    /* MEJORA 2: Clases específicas para agrandar títulos y horas calculadas */
    #backtime-box .res-title {
        font-size: 14px;
        font-weight: bold;
        text-transform: uppercase;
    }

    /* NUEVA MEJORA: Estilo para los textos descriptivos de los resultados */
    #backtime-box .res-label {
        font-size: 16px;
        font-weight: bold;
        display: inline-block;
        margin-bottom: 2px;
    }
    
    #backtime-box .res-time {
        font-size: 15px;
        font-weight: bold;
        color: #000;
        background: rgba(255, 255, 255, 0.4);
        padding: 1px 4px;
        border-radius: 3px;
    }

    /* NUEVA MEJORA: Estilo para el dato numérico del margen de seguridad */
    #backtime-box .res-margin-val {
        font-size: 14px;
        font-weight: bold;
        color: #000;
    }

    /* MEJORA 1: Estilos para el contenedor de accesos rápidos */
    #backtime-box .shortcuts-container {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 12px;
        padding-top: 10px;
        border-top: 1px dashed #8b6f47;
    }
    #backtime-box .shortcut-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        background: #e6dfc9;
        border: 1px solid #8b6f47;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.2s, transform 0.1s;
    }
    #backtime-box .shortcut-btn:hover {
        background: #d9c39c;
        transform: scale(1.08);
    }
    #backtime-box .shortcut-btn img {
        width: 26px;
        height: 26px;
        object-fit: contain;
    }

    /* Clases de estado mejoradas con fondos suaves */
    #backtime-box .ok { border-left: 5px solid #4caf50; background: #e8f5e9; }
    #backtime-box .mid { border-left: 5px solid #ff9800; background: #fff3e0; }
    #backtime-box .bad { border-left: 5px solid #f44336; background: #ffebee; }
    #backtime-box .error { border-left: 5px solid #d32f2f; background: #ffebee; color: #d32f2f; font-weight: bold; }
    `;
    document.head.appendChild(style);

    const box = document.createElement("div");
    box.id = "backtime-box";
    box.innerHTML = `
        <div class="header">
            <h2>👑 CANCEL SNIPE 👑</h2>
            <span id="close-backtime">✖</span>
        </div>
        <label>⚔️ 1. LLegada OFENSIVA SIN NOBLE (HH:MM:SS:MMM):</label>
        <input id="ataque_enemigo" type="text" placeholder="Ej: 16:14:51:492">
        
        <label>⏱️ 2. Duración de tus tropas a pueblo bárbaro (HH:MM:SS:MMM):</label>
        <input id="duracion_viaje" type="text" placeholder="Ej: 00:31:07:000">
        
        <label>🔙 3. Hora de regreso entre OFENSIVA y NOBLE (HH:MM:SS:MMM):</label>
        <input id="hora_regreso" type="text" placeholder="Ej: 16:14:51:592">
        
        <button id="calcular">Calcular Tiempos</button>
        <div id="resultado" class="resultado-box">Introduce los datos y pulsa calcular.</div>
        
        <div class="shortcuts-container">
            <a href="game.php?screen=map" class="shortcut-btn" title="Ir al Mapa">
                <img src="/graphic/links/map.png" onerror="this.src='https://dses.innogamescdn.com/asset/389fff4e/graphic/icons/map2.webp'" alt="Mapa">
            </a>
            <a href="game.php?screen=place" class="shortcut-btn" title="Ir a la Plaza de Reuniones">
                <img src="/graphic/buildings/place.png" onerror="this.src='https://dsen.innogamescdn.com/asset/80998fde/graphic/buildings/place.png'" alt="Plaza">
            </a>
        </div>

        <div style="margin-top:8px; font-size:10px; text-align:right; color:#8b6f47;">Hecho por samudev4 | v1.23</div>
    `;
    document.body.appendChild(box);

    // Cerrar panel
    document.getElementById("close-backtime").addEventListener("click", function() {
        box.remove();
    });

    // Funciones de cálculo
    function parseTime(str){
        if(!str) return null;
        const parts = str.split(":").map(Number);
        if(parts.some(isNaN)) return null;
        
        const h = parts[0] || 0;
        const m = parts[1] || 0;
        const s = parts[2] || 0;
        const ms = parts[3] || 0;
        
        return (((h * 60 + m) * 60 + s) * 1000) + ms;
    }

    function msToTime(ms){
        let h = Math.floor(ms / 3600000); ms %= 3600000;
        let m = Math.floor(ms / 60000); ms %= 60000;
        let s = Math.floor(ms / 1000); let mm = ms % 1000;
        return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(mm).padStart(3,'0')}`;
    }

    // Calcular tiempos con validación
    document.getElementById("calcular").addEventListener("click", function(){
        const ataqueEnemigo = parseTime(document.getElementById("ataque_enemigo").value);
        const duracionViaje = parseTime(document.getElementById("duracion_viaje").value);
        const regresoDeseado = parseTime(document.getElementById("hora_regreso").value);

        const resultado = document.getElementById("resultado");
        resultado.className = "resultado-box"; // Reset clases

        // Validación de datos
        if (ataqueEnemigo === null || duracionViaje === null || regresoDeseado === null) {
            resultado.classList.add("error");
            resultado.innerHTML = "⚠️ Error: Por favor, revisa que todos los campos tengan un formato de tiempo válido.";
            return;
        }

        const tiempoRegreso = cancelDelay * 2;
        const envio = regresoDeseado - tiempoRegreso;
        const cancelar = envio + cancelDelay;
        const llegadaHipotetica = envio + duracionViaje;
        const margen = regresoDeseado - ataqueEnemigo;

        if(margen > 80) resultado.classList.add("ok");
        else if(margen >= 20) resultado.classList.add("mid");
        else resultado.classList.add("bad");

        // MEJORA 2: Uso de innerHTML combinado con etiquetas span de tamaño aumentado y textos en negrita
        resultado.innerHTML = 
            `<span class="res-title">✅ RESULTADOS:</span>\n\n` +
            `<span class="res-label">👉 Enviar ataque para que llegue a las:</span>\n   <span class="res-time">${msToTime(llegadaHipotetica)}</span>\n\n` +
            `<span class="res-label">🛑 Cancelar exactamente a las:</span>\n   <span class="res-time">${msToTime(cancelar)}</span>\n\n` +
            `<span class="res-label">📊 Margen de seguridad:</span> <span class="res-margin-val">${margen} ms (${(margen/1000).toFixed(3)} s)</span>`;
    });

    // Hacer draggable
    function makeDraggable(el, handle) {
        let isDragging = false, offsetX = 0, offsetY = 0;
        
        handle.addEventListener("mousedown", function(e) {
            isDragging = true;
            offsetX = e.clientX - el.getBoundingClientRect().left;
            offsetY = e.clientY - el.getBoundingClientRect().top;
            document.body.style.userSelect = "none";
        });

        document.addEventListener("mousemove", function(e) {
            if (!isDragging) return;
            el.style.left = (e.clientX - offsetX) + "px";
            el.style.top = (e.clientY - offsetY) + "px";
            el.style.right = "auto";
        });

        document.addEventListener("mouseup", function() {
            if (isDragging) {
                isDragging = false;
                document.body.style.userSelect = "auto";
            }
        });
    }
    makeDraggable(box, box.querySelector(".header"));
})();
