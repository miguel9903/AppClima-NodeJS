require('dotenv').config();
const { leerEntrada, 
        mostrarMenu,
        pausar, 
        listarLugares} = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main =  async () => {
    
    let opc = 0;
    const busquedas = new Busquedas();

    do {

        opc = await mostrarMenu();
        
        switch(opc) {
            case 1:
                // Mostrar mensaje
                const lugar = await leerEntrada('Ciudad: ');

                // Buscar lugares
                const lugares = await busquedas.buscarCiudades(lugar);
               
                // Seleccionar el lugar
                const idLugarSel = await listarLugares(lugares);
                const lugarSel = lugares.find(l => l.id === idLugarSel);
                busquedas.agregarHistorial(lugarSel.nombre);
        
                // Obtener datos del clima
                const climaLugar = await busquedas.climaPorLugar(lugarSel.lat, lugarSel.long);
                
                // Mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad: ', lugarSel.nombre);
                console.log('Lat: ', lugarSel.lat);
                console.log('Long: ', lugarSel.long);
                console.log('Temperatura: ', climaLugar.temp);
                console.log(' - Minima: : ', climaLugar.min);
                console.log(' - Máxima: ', climaLugar.max);
                console.log('¿Cómo está el clima?: ', climaLugar.desc);
                break;
            case 2:
                busquedas.obtenerHistorial().forEach((lugar, index) => {
                     const idx = `${ index + 1 }`.green;
                     console.log(`${ idx } ${ lugar }`);
                })
                break;
            case 3:
                break;    
        }
        
        if(opc !== 3) await pausar();

    } while(opc !== 3);

}

main();