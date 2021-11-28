#include "door.h"
#define OPEN_PERIOD 100

DoorSensor::DoorSensor() {
    state = S_CLOSED;
    period = OPEN_PERIOD;
    t = 0;
    limit = 1000;
    statusStr = "{}";
}

void DoorSensor::cmdProcessing(JSONValue cmdJson) {
    JSONObjectIterator iter(cmdJson);
    /*
    while (iter.next()) {
        if (iter.name() == "min") {
            sensorMin = iter.value().toInt();
        }
        else if (iter.name() == "max") {
            sensorMax = iter.value().toInt();
        }
    }*/
}

void DoorSensor::execute() {
    switch (state) {
        case DoorSensor::S_CLOSED:
            //t = 0;      // Reset alert timer
            statusStr = "{\"d\":\"closed\"}";
            if (!(checkIfClosed())) {
                state = DoorSensor::S_OPEN;
                
                //delay(1000);
            }
            break;
        case DoorSensor::S_OPEN:
            //t++;      // Increment alert timer
            statusStr = "{\"d\":\"open\"}";
            if (checkIfClosed()) {
                state = DoorSensor::S_CLOSED;
                
                //delay(1000);
            }
            break;
        // Implement after CP2 
        // case DoorSensor::S_ALERT:
        //     if (t >= period) {
        //         t = 0;
        //         sendAlert();
        //         state = DoorSensor::S_OPEN;
        //     }
        //     break;
        default:
            break;
    }
}

bool DoorSensor::checkIfClosed() {
    readSensorVal();
    int curSensorVal = getSensorVal();
    
    // Sensor exceeds boundaries
    if (curSensorVal > limit) {
        return false;   // Door is open
    }
    else {
        return true;    // Door is closed
    }
}

void DoorSensor::readSensorVal() {
    sensorVal = analogRead(LIGHT_SENSOR);
}

int DoorSensor::getSensorVal() {
    return sensorVal;
}
/*
void DoorSensor::sendAlert() {
    // Implement after CP2
}*/