// Espera a que todo el HTML esté cargado
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. OBTENER ELEMENTOS DEL DOM ---
    
    // Inputs de Distancia
    const presetSelect = document.getElementById('preset');
    const distanceInput = document.getElementById('distance');

    // Inputs de Tiempo
    const timeHH = document.getElementById('time_hh');
    const timeMM = document.getElementById('time_mm');
    const timeSS = document.getElementById('time_ss');

    // Inputs de Ritmo
    const paceMM = document.getElementById('pace_mm');
    const paceSS = document.getElementById('pace_ss');

    // Botones
    const calculateBtn = document.getElementById('calculate-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    // Lista de todos los inputs para limpiar
    const allInputs = [distanceInput, timeHH, timeMM, timeSS, paceMM, paceSS];

    // --- 2. DEFINIR EVENTOS ---

    // Evento para el selector de distancias predefinidas
    presetSelect.addEventListener('change', () => {
        if (presetSelect.value !== 'custom') {
            distanceInput.value = presetSelect.value;
        }
    });

    // Evento para el botón de Limpiar
    clearBtn.addEventListener('click', () => {
        allInputs.forEach(input => input.value = '');
        presetSelect.value = 'custom';
    });

    // Evento principal: Botón de Calcular
    calculateBtn.addEventListener('click', () => {
        
        // --- 3. RECOGER Y CONVERTIR VALORES ---
        
        // Obtener distancia en km. Si está vacío, es 0.
        const distance = parseFloat(distanceInput.value) || 0;

        // Obtener tiempo total en segundos
        const timeTotalSeconds = (parseFloat(timeHH.value) || 0) * 3600 +
                                 (parseFloat(timeMM.value) || 0) * 60 +
                                 (parseFloat(timeSS.value) || 0);
        
        // Obtener ritmo total en segundos por km
        const paceTotalSeconds = (parseFloat(paceMM.value) || 0) * 60 +
                                 (parseFloat(paceSS.value) || 0);

        // --- 4. LÓGICA DE CÁLCULO ---
        
        // Caso 1: Calcular Ritmo (Tenemos Distancia y Tiempo)
        if (distance > 0 && timeTotalSeconds > 0 && paceTotalSeconds === 0) {
            const pacePerKm = timeTotalSeconds / distance; // Ritmo en segundos/km
            
            // Convertir segundos/km a formato MM:SS
            const paceMin = Math.floor(pacePerKm / 60);
            const paceSec = Math.round(pacePerKm % 60); // Redondear segundos

            paceMM.value = paceMin;
            paceSS.value = paceSec;
        } 
        
        // Caso 2: Calcular Tiempo (Tenemos Distancia y Ritmo)
        else if (distance > 0 && paceTotalSeconds > 0 && timeTotalSeconds === 0) {
            const timeNeeded = paceTotalSeconds * distance; // Tiempo total en segundos
            
            // Convertir segundos totales a HH:MM:SS
            const hours = Math.floor(timeNeeded / 3600);
            const minutes = Math.floor((timeNeeded % 3600) / 60);
            const seconds = Math.round(timeNeeded % 60); // Redondear segundos

            timeHH.value = hours;
            timeMM.value = minutes;
            timeSS.value = seconds;
        } 
        
        // Caso 3: Calcular Distancia (Tenemos Tiempo y Ritmo)
        else if (timeTotalSeconds > 0 && paceTotalSeconds > 0 && distance === 0) {
            const distanceCovered = timeTotalSeconds / paceTotalSeconds; // Distancia en km
            
            distanceInput.value = distanceCovered.toFixed(3); // Mostrar con 3 decimales
        } 
        
        // Caso 4: No hay suficientes datos o hay demasiados
        else {
            alert('Por favor, completa exactamente DOS de las tres secciones (Distancia, Tiempo o Ritmo) para calcular la tercera.');
        }
    });
});