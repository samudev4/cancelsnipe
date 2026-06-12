// ==UserScript==
// @name         Cancel Snipe Avanzado (Persistente)
// @namespace    https://github.com/samudev4
// @version      1.5
// @description  Calculadora de Cancel Snipe con persistencia total.
// @author       samudev4
// @match        *://*.guerrastribales.es/game.php*
// @match        *://*.tribalwars.net/game.php*
// @grant        none
// ==/UserScript==

(function(){
    'use strict';

    // Control de apertura/cierre: Si el usuario lo cerró, mostramos solo el lanzador
    const isOpen = localStorage.getItem("tw_snipe_open");
    
    if (isOpen === "false") {
        if (!document.getElementById("open-snipe-launcher")) {
            const launcher = document.createElement("div");
            launcher.id = "open-snipe-launcher";
            launcher.innerHTML = "🎯";
            launcher.setAttribute("style", "position:fixed; bottom:20px; left:20px; background:#8b6f47; color:white; padding:8px 10px; border-radius:50%; cursor:pointer; z-index:99999; box-shadow: 0 2px 5px rgba(0,0,0,0.3); font-size:16px; transition: transform 0.2s;");
            launcher.onmouseover = () => launcher.style.transform = "scale(1.1)";
            launcher.onmouseout = () => launcher.style.transform = "scale(1)";
            launcher.addEventListener("click", function() {
                localStorage.setItem("tw_snipe_open", "true");
                location.reload(); // Recarga para levantar la UI completa
            });
            document.body.appendChild(launcher);
        }
        return; 
    }

    // Prevenir duplicados en el DOM
    const existingBox = document.getElementById("backtime-box");
    if (existingBox) existingBox.remove();

    const cancelDelay = 5000;

    const style = document.createElement("style");
    style.textContent = `
    #backtime-box {
        position: fixed;
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
        white-space: pre-wrap;
    }
    #backtime-box .shortcuts-container {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px dashed #8b6f47;
    }
    #backtime-box .shortcut-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        background: #e6dfc9;
        border: 1px solid #8b6f47;
        padding: 6px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
        text-decoration: none;
        color: #2b1d0f;
        font-weight: bold;
        transition: background 0.2s;
    }
    #backtime-box .shortcut-btn:hover {
        background: #d9c39c;
    }
    #backtime-box .shortcut-btn img {
        width: 16px;
        height: 16px;
        object-fit: contain;
    }
    #backtime-box .ok { border-left: 5px solid #4caf50; background: #e8f5e9; }
    #backtime-box .mid { border-left: 5px solid #ff9800; background: #fff3e0; }
    #backtime-box .bad { border-left: 5px solid #f44336; background: #ffebee; }
    #backtime-box .error { border-left: 5px solid #d32f2f; background: #ffebee; color: #d32f2f; font-weight: bold; }
    `;
    document.head.appendChild(style);

    const box = document.createElement("div");
    box.id = "backtime-box";
    
    // Recuperar posición
    box.style.top = localStorage.getItem("tw_snipe_top") || "100px";
    box.style.left = localStorage.getItem("tw_snipe_left") || "20px";

    box.innerHTML = `
        <div class="header">
            <h2>🎯 CANCEL SNIPE</h2>
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
            <a href="game.php?screen=map" class="shortcut-btn">
                <img src="/graphic/links/map.png" onerror="this.src='https://dsen.innogamescdn.com/asset/80998fde/graphic/links/map.png'" alt="Mapa">
                <span>Ir al Mapa</span>
            </a>
            <a href="game.php?screen=place" class="shortcut-btn">
                <img src="/graphic/buildings/place.png" onerror="this.src='https://dsen.innogamescdn.com/asset/80998fde/graphic/buildings/place.png'" alt="Plaza">
                <span>Plaza Reuniones</span>
            </a>
        </div>
        <div style="margin-top:8px; font-size:10px; text-align:right; color:#8b6f47;">Hecho por samudev4</div>
    `;
    document.body.appendChild(box);

    // Cargar y guardar inputs
    const inputsFields = ['ataque_enemigo', 'duracion_viaje', 'hora_regreso'];
    inputsFields.forEach(id => {
        const field = document.getElementById(id);
        field.value = localStorage.getItem(`tw_snipe_${id}`) || "";
        field.addEventListener("input", function() {
            localStorage.setItem(`tw_snipe_${id}`, field.value);
        });
    });

    // Restaurar último cálculo si existe
    const lastResultHtml = localStorage.getItem("tw_snipe_last_result_html");
    const lastResultClass = localStorage.getItem("tw_snipe_last_result_class");
    const resultadoDiv = document.getElementById("resultado");
    
    if (lastResultHtml && lastResultClass) {
        resultadoDiv.className = lastResultClass;
        resultadoDiv.innerHTML = lastResultHtml;
    }

    // Cerrar panel
    document.getElementById("close-backtime").addEventListener("click", function() {
        localStorage.setItem("tw_snipe_open", "false");
        box.remove();
        location.reload(); 
    });

    // Lógica Matemática
    function parseTime(str){
        if(!str) return null;
        const parts = str.split(":").map(Number);
        if(parts.some(isNaN)) return null;
        const h = parts[0] || 0; const m = parts[1] || 0; const s = parts[2] || 0; const ms = parts[3] || 0;
        return (((h * 60 + m) * 60 + s) * 1000) + ms;
    }

    function msToTime(ms){
        let h = Math.floor(ms / 3600000); ms %= 3600000;
        let m = Math.floor(ms / 60000); ms %= 60000;
        let s = Math.floor(ms / 1000); let mm = ms % 1000;
        return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(mm).padStart(3,'0')}`;
    }

    // Calcular
    document.getElementById("calcular").addEventListener("click", function(){
        const ataqueEnemigo = parseTime(document.getElementById("ataque_enemigo").value);
        const duracionViaje = parseTime(document.getElementById("duracion_viaje").value);
        const regresoDeseado = parseTime(document.getElementById("hora_regreso").value);

        resultadoDiv.className = "resultado-box";

        if (ataqueEnemigo === null || duracionViaje === null || regresoDeseado === null) {
            resultadoDiv.classList.add("error");
            resultadoDiv.innerText = "⚠️ Error: Revisa que todos los campos tengan formato válido.";
            return;
        }

        const tiempoRegreso = cancelDelay * 2;
        const envio = regresoDeseado - tiempoRegreso;
        const cancelar = envio + cancelDelay;
        const llegadaHipotetica = envio + duracionViaje;
        const margen = regresoDeseado - ataqueEnemigo;

        if(margen > 80) resultadoDiv.classList.add("ok");
        else if(margen >= 20) resultadoDiv.classList.add("mid");
        else resultadoDiv.classList.add("bad");

        resultadoDiv.innerText = 
            "✅ RESULTADOS:\n\n" +
            "👉 Enviar ataque para que llegue a las:\n   " + msToTime(llegadaHipotetica) + "\n\n" +
            "🛑 Cancelar exactamente a las:\n   " + msToTime(cancelar) + "\n\n" +
            "📊 Margen: " + margen + " ms (" + (margen/1000).toFixed(3) + " s)";
            
        // Guardar resultado para mantenerlo al cambiar de pestaña
        localStorage.setItem("tw_snipe_last_result_html", resultadoDiv.innerHTML);
        localStorage.setItem("tw_snipe_last_result_class", resultadoDiv.className);
    });

    // Draggable y guardado de posición
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
                localStorage.setItem("tw_snipe_top", el.style.top);
                localStorage.setItem("tw_snipe_left", el.style.left);
            }
        });
    }
    makeDraggable(box, box.querySelector(".header"));
})();
