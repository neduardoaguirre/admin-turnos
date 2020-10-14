import AdminTurnos from './Classes/AdminTurnos.js';
import {
    mascotaInput,
    especieInput,
    propietarioInput,
    telefonoInput,
    fechaInput,
    horaInput,
    sintomasInput,
    formulario
} from './selectores.js';

export let DB;

const adminTurnos = new AdminTurnos();
let editando = false;

const turnoObjeto = {
    mascota: '',
    especie: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

export function datosTurno(e) {
    turnoObjeto[e.target.name] = e.target.value;
}

export function nuevoTurno(e) {
    e.preventDefault();
    const {
        mascota,
        especie,
        propietario,
        telefono,
        fecha,
        hora,
        sintomas
    } = turnoObjeto;

    if (mascota === '' || especie === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        adminTurnos.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }
    
    const validarHoraFecha = `${fecha} ${hora}`;
    if(Date.parse(validarHoraFecha) < Date.now()){
        adminTurnos.imprimirAlerta('Fecha y/o Hora Incorrecta', 'error');
        return;
    }

    if (editando) {
        const transaction = DB.transaction(['turnos'], 'readwrite');
        const objectStore = transaction.objectStore('turnos');
        objectStore.put(turnoObjeto);
        transaction.oncomplete = () => {
            adminTurnos.imprimirAlerta('Actualizado Correctamente');
            formulario.querySelector('button[type="submit"]').textContent = 'Crear Turno';
            editando = false;
        }
        transaction.onerror = () => {
            console.log('Error');
        }
    } 
    else {
        turnoObjeto.id = Date.now();
        const transaction = DB.transaction(['turnos'], 'readwrite');
        const objectStore = transaction.objectStore('turnos');
        objectStore.add(turnoObjeto);
        transaction.oncomplete = () => {
            console.log('Turno almacenado en BD');
        }
        adminTurnos.imprimirAlerta('Turno agregado correctamente')
    }
    adminTurnos.imprimirTurnos();
    reiniciarObjeto();
    formulario.reset();
}

export function reiniciarObjeto() {
    turnoObjeto.mascota = '';
    turnoObjeto.especie = '';
    turnoObjeto.propietario = '';
    turnoObjeto.telefono = '';
    turnoObjeto.fecha = '';
    turnoObjeto.hora = '';
    turnoObjeto.sintomas = '';
}

export function eliminarTurno(id) {
    const transaction = DB.transaction(['turnos'], 'readwrite');
    const objectStore = transaction.objectStore('turnos');
    objectStore.delete(id);

    transaction.oncomplete = () => {
        console.log(`Turno ${id} eliminado`);
        adminTurnos.imprimirTurnos()
    }

    transaction.onerror = () => {
        console.log('Error');
    }

}

export function cargarEditarTurno(turno) {
    const {
        mascota,
        especie,
        propietario,
        telefono,
        fecha,
        hora,
        sintomas,
        id
    } = turno;

    turnoObjeto.mascota = mascota;
    turnoObjeto.especie = especie;
    turnoObjeto.propietario = propietario;
    turnoObjeto.telefono = telefono;
    turnoObjeto.fecha = fecha
    turnoObjeto.hora = hora;
    turnoObjeto.sintomas = sintomas;
    turnoObjeto.id = id;

    mascotaInput.value = mascota;
    especieInput.value = especie;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    formulario.querySelector('button[type="submit"]').textContent = 'Actualizar';
    editando = true;
}

export function crearDB() {
    const crearDB = window.indexedDB.open('turnos', 1);
    crearDB.onerror = function () {
        console.log('Error');
    }

    crearDB.onsuccess = function () {
        console.log('BD creada');
        DB = crearDB.result;
        adminTurnos.imprimirTurnos();
    }

    crearDB.onupgradeneeded = function (e) {
        const db = e.target.result
        const objectStore = db.createObjectStore('turnos', {
            keyPath: 'id',
            autoIncrement: true
        });
        objectStore.createIndex('mascota', 'mascota', {
            unique: false
        });
        objectStore.createIndex('especie', 'especie', {
            unique: false
        });
        objectStore.createIndex('propietario', 'propietario', {
            unique: false
        });
        objectStore.createIndex('telefono', 'telefono', {
            unique: false
        });
        objectStore.createIndex('fecha', 'fecha', {
            unique: false
        });
        objectStore.createIndex('hora', 'hora', {
            unique: false
        });
        objectStore.createIndex('sintomas', 'sintomas', {
            unique: false
        });
        objectStore.createIndex('id', 'id', {
            unique: true
        });
    }
}