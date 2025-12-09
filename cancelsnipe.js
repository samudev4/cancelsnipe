/*
 * Script Name: Cancel Snipe
 * Version: v1.2
 * Last Updated: 09/12/2025
 * Author: samudev
 * Author URL: https://github.com/samudev4
 * Author Contact: samudevelopment@gmail.com
 * Approved: NO
 */

(function(){
    const cancelDelay = 5000;

    // Estilos al estilo TW
    const style = document.createElement("style");
    style.textContent = `
    #backtime-box {
        position: fixed;
        top: 100px;
        left: 20px;
        width: 320px;
        background: #fdf6e3; /* Fondo claro estilo TW */
        color: #2b1d0f; /* Texto oscuro */
        padding: 12px;
        border: 1px solid #c0a070; /* borde suave */
        border-radius: 5px;
        box-shadow: 0 0 8px rgba(0,0,0,0.3);
        font-family: Verdana, Geneva, sans-serif;
        z-index: 99999;
        cursor: default;
    }
    #backtime-box .header {
        position: relative;
        margin-bottom: 10px;
        cursor: move;
    }
    #backtime-box h2 {
        margin: 0;
        font-size: 14px;
        text-align: center;
        background: #c0a070; /* header TW */
        color: #fff;
        padding: 5px 0;
        border-radius: 3px;
    }
    #backtime-box #close-backtime {
        position: absolute;
        top: 2px;
        right: 4px;
        cursor: pointer;
        color: #fff;
        font-weight: bold;
        font-size: 12px;
    }
    #backtime-box input {
        width: 100%;
        padding: 5px;
        margin-bottom: 8px;
        border: 1px solid #c0a070;
        border-radius: 3px;
        font-size: 12px;
    }
    #backtime-box button {
        width: 100%;
        padding: 6px;
        background: linear-gradient(#ffd700, #c0a070); /* degradado TW */
        border: 1px solid #c0a070;
        color: #2b1d0f;
        border-radius: 3px;
        font-size: 12px;
        cursor: pointer;
        text-align: center;
    }
    #backtime-box button:hover {
        background: linear-gradient(#c0a070, #ffd700);
    }
    #backtime-box .resultado-box {
        margin-top: 8px;
        padding: 8px;
        border-radius: 3px;
        font-size: 12px;
        background: #fff8dc; /* resultado TW */
        color: #2b1d0f;
    }
    #backtime-box .ok { border-left:4px solid #4caf50; }
    #backtime-box .mid { border-left:4px solid #ffeb3b; }
    #backtime-box .bad { border-left:4px solid #f44336; }
    `;
    document.head.appendChild(style);

    // Crear interfaz
    const box = document.createElement("div");
    box.id = "backtime-box";
    box.innerHTML = `
        <div class="header">
            <h2>CANCEL SNIPE</h2>
            <span id="close-backtime">✖</span>
        </div>
        <label>1. Hora de llegada de la OFENSIVA enemiga (HH:MM:SS:MMM):</label>
        <input id="ataque_enemigo" type="text" placeholder="16:14:51:492">
        <label>2. Duración del ataque de tus tropas (HH:MM:SS:MMM):</label>
        <input id="duracion_viaje" type="text" placeholder="00:31:07:000">
        <label>3. Hora deseada de regreso (HH:MM:SS:MMM):</label>
        <input id="hora_regreso" type="text" placeholder="16:14:51:592">
        <button id="calcular">Calcular</button>
        <div id="resultado" class="resultado-box">Introduce datos y pulsa Calcular.</div>
        <div style="margin-top:4px; font-size:10px; text-align:right; color:#c0a070;">Hecho por samudev4</div>
    `;
    document.body.appendChild(box);

    // Cerrar panel
    document.getElementById("close-backtime").onclick = function(){
        box.remove();
    };

    // Funciones de cálculo
    function parseTime(str){
        const [h,m,s,ms] = str.split(":").map(Number);
        return (((h*60+m)*60+s)*1000) + ms;
    }
    function msToTime(ms){
        let h = Math.floor(ms/3600000); ms%=3600000;
        let m = Math.floor(ms/60000); ms%=60000;
        let s = Math.floor(ms/1000); let mm = ms%1000;
        return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(mm).padStart(3,'0')}`;
    }

    // Calcular tiempos
    document.getElementById("calcular").onclick = function(){
        const ataqueEnemigo = parseTime(document.getElementById("ataque_enemigo").value);
        const duracionViaje = parseTime(document.getElementById("duracion_viaje").value);
        const regresoDeseado = parseTime(document.getElementById("hora_regreso").value);

        const tiempoRegreso = cancelDelay*2;
        const envio = regresoDeseado - tiempoRegreso;
        const cancelar = envio + cancelDelay;
        const llegadaHipotetica = envio + duracionViaje;
        const margen = regresoDeseado - ataqueEnemigo;

        const resultado = document.getElementById("resultado");
        resultado.className = "resultado-box";
        if(margen > 80) resultado.classList.add("ok");
        else if(margen >= 20) resultado.classList.add("mid");
        else resultado.classList.add("bad");

        resultado.innerText =
            "Resultados\n\n"+
            "Tu ataque debe llegar a las: "+msToTime(llegadaHipotetica)+"\n"+
            "Debes cancelar el ataque a las: "+msToTime(cancelar)+"\n"+
            "Regreso exacto: "+msToTime(regresoDeseado)+"\n"+
            "MARGEN frente al ataque enemigo: "+margen+" ms ("+(margen/1000).toFixed(3)+" s)";
    };

    // Hacer draggable
    function makeDraggable(el, handle) {
        let isDragging = false, offsetX = 0, offsetY = 0;
        handle.onmousedown = function(e){
            isDragging = true;
            offsetX = e.clientX - el.getBoundingClientRect().left;
            offsetY = e.clientY - el.getBoundingClientRect().top;
            document.body.style.userSelect = "none";
        };
        document.onmousemove = function(e){
            if(!isDragging) return;
            el.style.left = (e.clientX - offsetX) + "px";
            el.style.top = (e.clientY - offsetY) + "px";
            el.style.right = "auto";
        };
        document.onmouseup = function(){ isDragging=false; document.body.style.userSelect="auto"; };
    }
    makeDraggable(box, box.querySelector(".header"));
})();
