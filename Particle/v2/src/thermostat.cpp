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

    statusStr = "{}";
    
}

void CThermostat::cmdProcessing(JSONValue cmdJson) {
    JSONObjectIterator iter(cmdJson);
    while (iter.next()) {
        continue;
    }
}

void CThermostat::execute() {
    // Reading temperature or humidity takes about 250 milliseconds!
    // Sensor readings may also be up to 2 seconds 'old' (its a 
    // very slow sensor)
    //dht.begin();
    //delay(2000);
	humidity = dht.getHumidity();
    // Read temperature as Celsius
	//celsius = dht.getTempCelcius();
    // Read temperature as Farenheit
	//farenheit = dht.getTempFarenheit();
  
    // Check if any reads failed and exit early (to try again).
	if (isnan(humidity) || isnan(celsius) || isnan(farenheit)) {
		Serial.println("Failed to read from DHT sensor!");
		return;
	}
    //heatIndex = dht.getHeatIndex();
	//dewPoint = dht.getDewPoint();
	//kelvin = dht.getTempKelvin();
    createStatusStr();
}

void CThermostat::createStatusStr() {
    statusStr = String::format("{\"t\":%f,\"c\":%f,\"h\":%f,\"hi\":%f,\"dp\":%f,\"k\":%f}", farenheit, celsius, humidity, heatIndex, dewPoint, kelvin);
}