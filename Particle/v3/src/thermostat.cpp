#include "thermostat.h"
#include "common.h"
DHT dht(DHTPIN, DHTTYPE);

CThermostat::CThermostat() {
    farenheit = 0.0;
    humidity = 0.0;
    state_mode = CThermostat::S_OFF;
    state_heat = CThermostat::S_HEAT_WAIT;
    state_cool = CThermostat::S_COOL_WAIT;
    statusStr = "{}";
    lastRead = 0;
    
    
}

void CThermostat::cmdProcessing(JSONValue cmdJson) {
    JSONObjectIterator iter(cmdJson);
    while (iter.next()) {
        if(iter.name() == "mode"){
            cmd.mode = iter.value().toInt();;
        }
        else if(iter.name() == "fanAuto"){
            cmd.fanAuto = (int)iter.value().toBool();
        }
        else if(iter.name() == "fanOn"){
            cmd.fanMode = (int)iter.value().toBool();
        }
        else if(iter.name() == "setTemp"){
            cmd.setTemp = iter.value().toInt();
        }
    }
}

void CThermostat::execute() {
    //humidity = dht.getHumidity();
    //createStatusStr();
    
    int currentTime = millis();
    float tempHumidity;
    float tempFarenheit;
    //Serial.println(currentTime);
    //Serial.println(lastRead);
    
    tempHumidity = dht.getHumidity();
    tempFarenheit = dht.getTempFarenheit();
    if (!isnan(tempHumidity)) humidity = tempHumidity;
    if (!isnan(tempFarenheit)) farenheit = tempFarenheit;

    switch(state_mode){
        case CThermostat::S_OFF:
            if(cmd.mode != INVALID_CMD){
                checkMode();
            }
            break;
        case CThermostat::S_COOL:
            switch(state_cool){
                case CThermostat::S_COOL_WAIT:
                    if(farenheit > cmd.setTemp + dT){
                        counter = 0;
                        state_cool = CThermostat::S_COOL_ON;
                    }
                    farenheit += counter;
                    counter++;
                    break;
                case CThermostat::S_COOL_ON:
                    if(farenheit < cmd.setTemp - dT){
                        counter = 0;
                        state_cool = CThermostat::S_COOL_WAIT;
                    }
                    farenheit -= counter;
                    counter++;
                    break;
                default:
                    break;
            }
            checkMode();
            break;
        case CThermostat::S_HEAT:
            switch(state_heat){
                case CThermostat::S_HEAT_WAIT:
                    if(farenheit < cmd.setTemp-dT){
                        counter = 0;
                        state_heat = CThermostat::S_HEAT_ON;
                    }
                    farenheit -= counter;
                    counter++;
                    break;
                case CThermostat::S_HEAT_ON:
                    if(farenheit > cmd.setTemp+dT){
                        counter = 0;
                        state_heat = CThermostat::S_HEAT_WAIT;
                    }
                    farenheit += counter;
                    counter++;
                    break;
                default:
                    break;
            }
            checkMode();
            break;
        default:
            break;

    }
    resetCmd();
    createStatusStr();
    
}

void CThermostat::checkMode(){
    switch(cmd.mode){
        case 0://off
            state_mode = CThermostat::S_OFF;
            break;
        case 1://cool
            counter = 0;
            state_mode = CThermostat::S_COOL;
            break;
        case 2://heat
            counter = 0;
            state_mode = CThermostat::S_HEAT;
            break;
        default:
            break;
    }   
}

void CThermostat::resetCmd() {
    cmd.mode = INVALID_CMD;
    cmd.fanAuto = INVALID_CMD;
    cmd.fanMode = INVALID_CMD;
    cmd.setTemp = INVALID_CMD;
}

void CThermostat::createStatusStr() {
    statusStr = String::format("{\"M\":%d,\"H\":%d,\"C\":%d,\"t\":%f,\"h\":%f}",state_mode, state_heat, state_cool, farenheit, humidity);
}


/*
    //Serial.println("READ");
            tempHumidity = dht.getHumidity();
            // Read temperature as Celsius
            tempCelsius = dht.getTempCelcius();
            // Read temperature as Farenheit
            tempFarenheit = dht.getTempFarenheit();
            tempHeatIndex = dht.getHeatIndex();
            tempDewPoint = dht.getDewPoint();
            tempKelvin = dht.getTempKelvin();

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
            if (!isnan(tempHeatIndex)) heatIndex = tempHeatIndex;
            if (!isnan(tempDewPoint)) dewPoint = tempDewPoint;
            if (!isnan(tempKelvin)) kelvin = tempKelvin;
    */