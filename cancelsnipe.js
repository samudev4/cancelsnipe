/*
 * Script Name: Cancel Snipe
 * Version: v1.0
 * Last Updated: 09/12/2025
 * Author: samudev
 * Author URL: https://twscripts.dev/
 * Author Contact: samudevelopment@gmail.com
 * Approved: NO
 */

(function(){
    const cancelDelay = 5000;

    // Crear estilos
    const style = document.createElement("style");
    style.textContent = `
        #backtime-box { position: fixed; top:50px; right:50px; width:320px; background:#222; color:white; padding:15px; border-radius:12px; z-index:999999; box-shadow:0 0 20px rgba(0,0,0,0.5); font-family:Arial;}
        #backtime-box h2 { margin-top:0; font-size:18px; text-align:center; color:#4caf50;}
        #backtime-box input { width:100%; padding:6px; margin-bottom:12px; border-radius:6px; border:none; font-size:14px;}
        #backtime-box button { width:100%; padding:8px; background:#4caf50; color:white; border:none; border-radius:6px; font-size:15px; cursor:pointer; margin-top:5px;}
        .resultado-box { margin-top:12px; padding:12px; border-radius:8px; font-size:14px; white-space:pre-line; background:#333;}
        .ok { background:#1e4620; border-left:4px solid #4caf50;}
        .mid { background:#665c00; border-left:4px solid #ffeb3b;}
        .bad { background:#5e1a1a; border-left:4px solid #f44336;}
    `;
    document.head.appendChild(style);

    // Crear interfaz
    const box = document.createElement("div");
    box.id = "backtime-box";
    box.innerHTML = `
        <h2>CANCEL SNIPE PARA NOBLES</h2>
        <label>1. Ataque enemigo (HH:MM:SS:MMM):</label>
        <input id="ataque_enemigo" type="text" placeholder="16:14:51:492">
        <label>2. Duración viaje (HH:MM:SS:MMM):</label>
        <input id="duracion_viaje" type="text" placeholder="00:31:07:000">
        <label>3. Hora deseada regreso (HH:MM:SS:MMM):</label>
        <input id="hora_regreso" type="text" placeholder="16:14:51:592">
        <button id="calcular">Calcular</button>
        <div id="resultado" class="resultado-box">Introduce datos y pulsa Calcular.</div>
        <div style="margin-top:8px; font-size:11px; text-align:right; color:#aaa;">Hecho por samudev4</div>
    `;
    document.body.appendChild(box);

    function parseTime(str){
        const [h,m,s,ms]=str.split(":").map(Number);
        return (((h*60+m)*60+s)*1000)+ms;
    }
    function msToTime(ms){
        let h=Math.floor(ms/3600000); ms%=3600000;
        let m=Math.floor(ms/60000); ms%=60000;
        let s=Math.floor(ms/1000); let mm=ms%1000;
        return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(mm).padStart(3,'0')}`;
    }

    document.getElementById("calcular").onclick=function(){
        const ataqueEnemigo=parseTime(document.getElementById("ataque_enemigo").value);
        const duracionViaje=parseTime(document.getElementById("duracion_viaje").value);
        const regresoDeseado=parseTime(document.getElementById("hora_regreso").value);

        const tiempoRegreso=cancelDelay*2;
        const envio=regresoDeseado-tiempoRegreso;
        const cancelar=envio+cancelDelay;
        const llegadaHipotetica=envio+duracionViaje;
        const margen=regresoDeseado-ataqueEnemigo;

        const resultado=document.getElementById("resultado");
        resultado.className="resultado-box";
        if(margen>80) resultado.classList.add("ok");
        else if(margen>=20) resultado.classList.add("mid");
        else resultado.classList.add("bad");

        resultado.innerText=
            "Resultados\n\n"+
            "Tu ataque debe llegar a las: "+msToTime(llegadaHipotetica)+"\n\n"+
            "Debes cancelar el ataque a las: "+msToTime(cancelar)+"\n\n"+
            "Regreso exacto:  "+msToTime(regresoDeseado)+"\n\n"+
            "MARGEN frente al ataque enemigo: "+margen+" ms ("+(margen/1000).toFixed(3)+" s)";
    };
})();

