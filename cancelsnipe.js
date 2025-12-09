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

    const style = document.createElement("style");
    style.textContent = `
    #backtime-box {
        position: fixed;
        top: 100px;
        right: 20px;
        width: 300px;
        background: #f4f1e7;
        color: #2b1d0f;
        padding: 10px;
        border: 1px solid #8b6f47;
        border-radius: 5px;
        box-shadow: 0 0 8px rgba(0,0,0,0.3);
        font-family: Verdana, Geneva, sans-serif;
        z-index: 99999;
    }
    #backtime-box h2 {
        margin: 0 0 10px 0;
        font-size: 14px;
        text-align: center;
        background: #8b6f47;
        color: #fff;
        padding: 4px 0;
        border-radius: 3px;
    }
    #backtime-box input {
        width: 100%;
        padding: 4px;
        margin-bottom: 8px;
        border: 1px solid #8b6f47;
        border-radius: 3px;
        font-size: 12px;
    }
    #backtime-box button {
        width: 100%;
        padding: 6px;
        background: linear-gradient(#d9c39c, #b79868);
        border: 1px solid #8b6f47;
        color: #2b1d0f;
        border-radius: 3px;
        font-size: 12px;
        cursor: pointer;
    }
    #backtime-box button:hover {
        background: linear-gradient(#b79868, #d9c39c);
    }
    #backtime-box .resultado-box {
        margin-top: 8px;
        padding: 8px;
        border-radius: 3px;
        font-size: 12px;
        background: #e6dfc9;
        color: #2b1d0f;
    }
    #backtime-box .ok { border-left:4px solid #4caf50; }
    #backtime-box .mid { border-left:4px solid #ffeb3b; }
    #backtime-box .bad { border-left:4px solid #f44336; }
    #backtime-box #close-backtime { float:right; cursor:pointer; color:#8b6f47; font-weight:bold; }
    `;
    document.head.appendChild(style);

    // Crear interfaz
    const box = document.createElement("div");
    box.id = "backtime-box";
    box.innerHTML = `
        <span id="close-backtime">✖</span>
        <h2>CANCEL SNIPE</h2>
        <label>1. Hora de llegada de la OFENSIVA enemiga (HH:MM:SS:MMM):</label>
        <input id="ataque_enemigo" type="text" placeholder="16:14:51:492">
        <label>2. Duración del ataque de tus tropas (HH:MM:SS:MMM):</label>
        <input id="duracion_viaje" type="text" placeholder="00:31:07:000">
        <label>3. Hora deseada de regreso (HH:MM:SS:MMM):</label>
        <input id="hora_regreso" type="text" placeholder="16:14:51:592">
        <button id="calcular">Calcular</button>
        <div id="resultado" class="resultado-box">Introduce datos y pulsa Calcular.</div>
        <div style="margin-top:4px; font-size:10px; text-align:right; color:#8b6f47;">Hecho por samudev4</div>
    `;
    document.body.appendChild(box);

    // Cerrar panel
    document.getElementById("close-backtime").onclick = function() {
        document.getElementById("backtime-box").remove();
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
})();
