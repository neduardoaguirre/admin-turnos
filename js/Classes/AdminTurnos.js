import {
    DB,
    eliminarTurno,
    cargarEditarTurno
} from '../funciones.js';
import {
    contenedorTurnos,
    heading
} from '../selectores.js';

class AdminTurnos {
    imprimirAlerta(mensaje, tipo) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12', 'mb-5');

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        divMensaje.textContent = mensaje;
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-turno'));

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    imprimirTurnos() {
        this.limpiarHTML();
        this.textoHeading(turnos);

        const objectStore = DB.transaction('turnos').objectStore('turnos');
        const fnTextoHeading = this.textoHeading;
        const total = objectStore.count();

        total.onsuccess = () => {
            fnTextoHeading(total.result);
        }

        objectStore.openCursor().onsuccess = (e) => {
            const cursor = e.target.result;

            if (cursor) {
                const {
                    mascota,
                    especie,
                    propietario,
                    telefono,
                    fecha,
                    hora,
                    sintomas,
                    id
                } = cursor.value;

                const divTurno = document.createElement('div');
                divTurno.classList.add('turno', 'p-3', 'rounded');
                divTurno.dataset.id = id;

                const mascotaParrafo = document.createElement('h2');
                mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
                mascotaParrafo.innerHTML = `${mascota}`;

                const especieParrafo = document.createElement('p');
                especieParrafo.innerHTML = `<span class="font-weight-bolder">Especie: </span>${especie}`;

                const propietarioParrafo = document.createElement('p');
                propietarioParrafo.innerHTML = `<span class="font-weight-bolder">Propietario: </span>${propietario}`;

                const telefonoParrafo = document.createElement('p');
                telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Teléfono: </span>${telefono}`;

                const fechaParrafo = document.createElement('p');
                fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha: </span>${fecha}`;

                const horaParrafo = document.createElement('p');
                horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora: </span>${hora}`;

                const sintomasParrafo = document.createElement('p');
                sintomasParrafo.innerHTML = `<span class="font-weight-bolder">Síntomas: </span>${sintomas}`;

                const btnEliminar = document.createElement('button');
                btnEliminar.onclick = () => eliminarTurno(id);
                btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
                btnEliminar.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>'

                const btnEditar = document.createElement('button');
                const turno = cursor.value;
                btnEditar.onclick = () => cargarEditarTurno(turno);
                btnEditar.classList.add('btn', 'btn-info');
                btnEditar.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'

                divTurno.appendChild(mascotaParrafo);
                divTurno.appendChild(especieParrafo);
                divTurno.appendChild(propietarioParrafo);
                divTurno.appendChild(telefonoParrafo);
                divTurno.appendChild(fechaParrafo);
                divTurno.appendChild(horaParrafo);
                divTurno.appendChild(sintomasParrafo);
                divTurno.appendChild(btnEliminar)
                divTurno.appendChild(btnEditar)

                contenedorTurnos.appendChild(divTurno);
                cursor.continue();
            }
        }
    }

    textoHeading(resultado) {
        if (resultado > 0) {
            heading.textContent = 'Turnos Pendientes '
        } else {
            heading.textContent = 'No hay Turnos'
        }
    }

    limpiarHTML() {
        while (contenedorTurnos.firstChild) {
            contenedorTurnos.removeChild(contenedorTurnos.firstChild);
        }
    }
}

export default AdminTurnos;