const axios = require('axios');
const colors = require('colors');
const fs = require('fs');

class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor() {
        this.leerDB();
    }

    get paramsMapBox() {
        return {
            'access_token' : process.env.MAPBOX_KEY, 
            'limit' : 5, 
            'language': 'es'
        }
    }

    get paramOpenWeather() {
        return {
            'appid' : process.env.OPENWEATHER_KEY,
            'units' : 'metric',
            'lang' : 'es'
        }
    }

    async buscarCiudades(lugar = '') {
        
        try {
            // Petición HTTP
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapBox
            });

            const resp = await instance.get();
            return resp.data.features.map(result => ({
                id: result.id,
                nombre: result.place_name,
                lat: result.center[0],
                long: result.center[1]
            }));
        } catch(err) {
            return []; 
        }

    }

    async climaPorLugar(lat, lon) {

        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramOpenWeather, lat, lon }
            });
            
            const resp = await instance.get();
            const { weather, main } = resp.data;

            return {
                desc: weather[0].description,
                temp: main.temp,
                min:  main.temp_min,
                max:  main.temp_max
            }

        } catch(err) {
            console.log(err);
        }

    }

    agregarHistorial(lugar = '') {
        if(this.historial.includes(lugar.toLowerCase())) {
           return;
        }
        this.historial = this.historial.splice(0,5);
        this.historial.unshift(lugar.toLowerCase());
        this.guardarDB();
    }

    obtenerHistorial() {
        return this.historial.map(lugar => lugar.split(' ').map(p => p[0].toUpperCase() + p.slice(1).toLowerCase()).join(' '));
    }

    guardarDB() {
        const payLoad = {
            historial: this.historial
        };
        fs.writeFileSync(this.dbPath, JSON.stringify(payLoad));
    }

    leerDB() {
        if(fs.existsSync(this.dbPath)) {
            const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
            const data = JSON.parse(info);
            this.historial = data.historial;
        }
    }
}

module.exports = Busquedas;