import {
    datosTurno,
    nuevoTurno,
    crearDB
} from '../funciones.js';

import {
    mascotaInput,
    especieInput,
    propietarioInput,
    telefonoInput,
    fechaInput,
    horaInput,
    sintomasInput,
    formulario
} from '../selectores.js';

class App {
    constructor() {
        this.initApp();
    }

    initApp() {
        crearDB();
        mascotaInput.addEventListener('change', datosTurno);
        especieInput.addEventListener('change', datosTurno);
        propietarioInput.addEventListener('change', datosTurno);
        telefonoInput.addEventListener('change', datosTurno);
        fechaInput.addEventListener('change', datosTurno);
        horaInput.addEventListener('change', datosTurno);
        sintomasInput.addEventListener('change', datosTurno);
        formulario.addEventListener('submit', nuevoTurno);     
    }
}

export default App;