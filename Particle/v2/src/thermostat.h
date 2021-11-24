#ifndef _THERMOSTAT_H_
#define _THERMOSTAT_H_

#include "common.h"
#include "Adafruit_DHT.h"

class CThermostat {
public:
    CThermostat();
    void cmdProcessing(JSONValue cmdJson);
    void execute();
    String getStatusStr() {return statusStr;};
private:
    void createStatusStr();
    
private:
    String statusStr;
    float celsius;
    float farenheit;
    float humidity;
    float heatIndex;
    float dewPoint;
    float kelvin;
};

#endif