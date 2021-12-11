#include "thermostat.h"
#include "common.h"
DHT dht(DHTPIN, DHTTYPE);

CThermostat::CThermostat() {
    farenheit = 0.0;
    humidity = 0.0;
    state_mode = CThermostat::S_OFF;
    state_heat = CThermostat::S_HEAT_WAIT;
    state_cool = CThermostat::S_COOL_WAIT;
    state_fan_mode = CThermostat::F_OFF;
    state_power = CThermostat::P_OFF;
    statusStr = "{}";
    lastRead = 0;
    setTemp = 77;
    fanOn = 0;
    startTime = millis();
    power = POWER_OFF;

}

void CThermostat::cmdProcessing(JSONValue cmdJson) {
    JSONObjectIterator iter(cmdJson);
    while (iter.next()) {
        if(iter.name() == "mode"){
            cmd.mode = iter.value().toInt();
        }
        else if(iter.name() == "fanOn"){
            fanOn = (int)iter.value().toBool();
        }
        else if(iter.name() == "setTemp"){
            setTemp = iter.value().toInt();
        }
        /*else if(iter.name()=="sample"){
            samplingPeriod = iter.value().toInt();
        }*/
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
                    //farenheit += counter;
                    //farenheit += float(((int)millis()-startTime)/(1000/samplingPeriod*30.0));
                    counter++;
                    if(farenheit > setTemp + dT){
                        counter = 0;
                        startTime = millis();
                        state_cool = CThermostat::S_COOL_ON;
                    }
                    break;
                case CThermostat::S_COOL_ON:
                    //farenheit -= counter;
                    //farenheit -= float(((int)millis()-startTime)/(1000/samplingPeriod*30.0));
                    counter++;
                    if(farenheit <= setTemp){
                        counter = 0;
                        startTime = millis();
                        state_cool = CThermostat::S_COOL_WAIT;
                    } 
                    break;
                default:
                    break;
            }
            checkMode();
            break;
        case CThermostat::S_HEAT:
            switch(state_heat){
                case CThermostat::S_HEAT_WAIT:
                    //farenheit -= counter;
                    //farenheit -= float(((int)millis()-startTime)/(1000/samplingPeriod*30.0));
                    counter++;
                    if(farenheit < setTemp-dT){
                        counter = 0;
                        startTime = millis();
                        state_heat = CThermostat::S_HEAT_ON;
                    }
                    
                    break;
                case CThermostat::S_HEAT_ON:
                    //farenheit += counter;
                    //farenheit += float(((int)millis()-startTime)/(1000/samplingPeriod*30.0));
                    counter++;
                    if(farenheit >= setTemp){
                        counter = 0;
                        startTime = millis();
                        state_heat = CThermostat::S_HEAT_WAIT;
                    }
                    
                    break;
                default:
                    break;
            }
            checkMode();
            break;
        default:
            break;

    }
    
    switch(state_fan_mode){
        case F_OFF:
            if(fanOn || 
            (state_mode == CThermostat::S_COOL && state_cool == CThermostat::S_COOL_ON) ||
            (state_mode == CThermostat::S_HEAT && state_heat == CThermostat::S_HEAT_ON)){
                state_fan_mode = CThermostat::F_ON;
            }
            
            break;
        case F_ON:
            if(state_mode == CThermostat::S_OFF ||
            (state_mode == CThermostat::S_COOL && state_cool == CThermostat::S_COOL_WAIT) ||
            (state_mode == CThermostat::S_HEAT && state_heat == CThermostat::S_HEAT_WAIT)
            ){state_fan_mode = CThermostat::F_OFF;}
            break;
    }

    switch(state_power){
        case CThermostat::P_OFF:
            power = POWER_OFF;
            if(state_fan_mode == CThermostat::F_ON){
                power += 100;
            }
            if (state_mode == CThermostat::S_HEAT && state_heat == CThermostat::S_HEAT_ON){
                state_power = CThermostat::P_HEAT;
            }
            else if(state_mode == CThermostat::S_COOL && state_cool == CThermostat::S_COOL_ON){
                state_power = CThermostat::P_COOL;
            }
            break;
        case CThermostat::P_COOL:
            power = POWER_COOL;
            if(state_fan_mode == CThermostat::F_ON){
                power += 100;
            }
            if(state_mode == CThermostat::S_HEAT && state_heat == CThermostat::S_HEAT_ON){
                state_power = CThermostat::P_HEAT;
            }
            else if(state_mode == CThermostat::S_OFF || 
            (state_mode == CThermostat::S_HEAT && state_heat == CThermostat::S_HEAT_WAIT)||
            (state_mode == CThermostat::S_COOL && state_cool == CThermostat::S_COOL_WAIT)){
                state_power = CThermostat::P_OFF;
            }
            break;
        case CThermostat::P_HEAT:
            power = POWER_HEAT;
            if(state_fan_mode == CThermostat::F_ON){
                power += 100;
            }
            if(state_mode == CThermostat::S_COOL && state_cool == CThermostat::S_COOL_ON){
                state_power = CThermostat::P_COOL;
            }
            else if(state_mode == CThermostat::S_OFF || 
            (state_mode == CThermostat::S_HEAT && state_heat == CThermostat::S_HEAT_WAIT)||
            (state_mode == CThermostat::S_COOL && state_cool == CThermostat::S_COOL_WAIT)){
                state_power = CThermostat::P_OFF;
            }
            break;
        default:
            break;
    }
    //(howeverlong the time elapsed since last execution)/(hour is simulation time)*(POWER kwH)
    //power = ((signed)lastRead - (signed)millis())/HOUR*power*1.0;
    lastRead = millis();
    resetCmd();
    createStatusStr();
    
}


void CThermostat::checkMode(){
    switch(cmd.mode){
        case 0://off
            state_mode = CThermostat::S_OFF;
            break;
        case 1://heat
            counter = 0;
            startTime = millis();
            state_mode = CThermostat::S_HEAT;
            break;
        case 2://cool
            counter = 0;
            startTime = millis();
            state_mode = CThermostat::S_COOL;
            break;
        default:
            break;
    }   
}

void CThermostat::resetCmd() {
    cmd.mode = INVALID_CMD;
    cmd.fanMode = INVALID_CMD;
    cmd.setTemp = INVALID_CMD;
}

void CThermostat::createStatusStr() {
    statusStr = String::format("{\"M\":%d,\"H\":%d,\"C\":%d,\"F\":%d,\"P\":%d,\"t\":%f,\"h\":%f,\"sT\":%d,\"w\":%f,\"fM\":%d}"
    ,state_mode, state_heat, state_cool,state_fan_mode,state_power, farenheit, humidity, setTemp, power, fanOn);
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