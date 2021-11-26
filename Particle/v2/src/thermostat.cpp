#include "thermostat.h"
#include "common.h"
DHT dht(DHTPIN, DHTTYPE);

CThermostat::CThermostat() {
    celsius = 0.0;
    farenheit = 0.0;
    humidity = 0.0;
    heatIndex = 0.0;
    dewPoint = 0.0;
    kelvin = 0.0;
    state = CThermostat::S_READ;
    statusStr = "{}";
    lastRead = 0;
    
    
}

void CThermostat::cmdProcessing(JSONValue cmdJson) {
    JSONObjectIterator iter(cmdJson);
    while (iter.next()) {
        continue;
    }
}

void CThermostat::execute() {
    //humidity = dht.getHumidity();
    //createStatusStr();
    
    int currentTime = millis();
    float tempHumidity;
    float tempCelsius;
    float tempFarenheit;
    //Serial.println(currentTime);
    //Serial.println(lastRead);
    switch(state){
        case CThermostat::S_DELAY:
            //Serial.println("DELAY");
            if (currentTime >= lastRead + 2000){
                state = CThermostat::S_READ;
            }
            break;
        // Reading temperature or humidity takes about 250 milliseconds!
        // Sensor readings may also be up to 2 seconds 'old' (its a 
        // very slow sensor)
        //dht.begin();
        //delay(2000);
        case CThermostat::S_READ:
            //Serial.println("READ");
            tempHumidity = dht.getHumidity();
            // Read temperature as Celsius
            tempCelsius = dht.getTempCelcius();
            // Read temperature as Farenheit
            tempFarenheit = dht.getTempFarenheit();

            // Check if any reads failed and exit early (to try again).
            //if (isnan(humidity) || isnan(celsius) || isnan(farenheit)) {
            //    statusStr = "Failed to read from DHT sensor!";
            //}
            //else{
            //    createStatusStr();
            //}
            if (!isnan(tempHumidity)) humidity = tempHumidity;
            if (!isnan(tempCelsius)) celsius = tempCelsius;
            if (!isnan(tempFarenheit)) farenheit = tempFarenheit;

            heatIndex = dht.getHeatIndex();
            dewPoint = dht.getDewPoint();
            kelvin = dht.getTempKelvin();
            lastRead = currentTime;
            state = CThermostat::S_DELAY;
            break;
        default:
            break;
    }
    createStatusStr();
    
}

void CThermostat::createStatusStr() {
    statusStr = String::format("{\"t\":%f,\"c\":%f,\"h\":%f,\"hi\":%f,\"dp\":%f,\"k\":%f}", farenheit, celsius, humidity, heatIndex, dewPoint, kelvin);
}