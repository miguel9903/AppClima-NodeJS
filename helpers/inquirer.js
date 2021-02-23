const inquirer = require('inquirer');
const colors = require('colors');
const { async } = require('rxjs');

const leerEntrada = async (mensaje) => {

    const pregunta = {
        type: 'input',
        name: 'resp',
        message: mensaje,
        validate(value) {
            if(value.length === 0) {
                throw 'Seleccione una opción';
            }
            return true;
        }
    };

    const { resp } = await inquirer.prompt(pregunta);
    return resp;
}

const mostrarMenu = async () => {

    console.clear();

    const preguntas = {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${ '1.'.green } Buscar ciudad`
            },
            {
                value: 2,
                name: `${ '2.'.green } Historial`
            },
            {
                value: 3,
                name: `${ '3.'.green } Salir`
            }
        ]
    };

    console.log('============================'.green);
    console.log('    Aplicación del clima    '.green);
    console.log('============================\n'.green);

    const { opcion } = await inquirer.prompt(preguntas);
    return opcion;
}

const pausar = async () => {
    const pregunta = {
        type: 'input',
        name: 'resp',
        message: `Presione ${ 'enter'.green } para continuar`
    };
    console.log('\n');
    await inquirer.prompt(pregunta);
}

const listarLugares =  async (lugares = []) => {

    const opciones = lugares.map((lugar, index) => {
        const id = `${ index + 1} .`.green;
        return {
            value: lugar.id,
            name: `${ id } ${ lugar.nombre }`
        }
    });

    const pregunta = {
        type: 'list',
        name: 'opcion',
        message: 'Seleccione un lugar: ',
        choices: opciones
    };

    const { opcion } = await inquirer.prompt(pregunta);
    return opcion;
}

module.exports = {
    leerEntrada,
    mostrarMenu,
    pausar,
    listarLugares
};