#ifndef _DOOR_H_
#define _DOOR_H_

#include "common.h"

class DoorSensor {
public:
    DoorSensor();
    void cmdProcessing(JSONValue cmdJson);
    void execute();
    String getStatusStr() {return statusStr;};
private:
    void createStatusStr();
private:
    enum STATE {S_CLOSED, S_OPEN, S_ALERT};
    STATE state;

    int t;
    int period;
    int sensorVal;
    int sensorMax;
    int sensorMin;
    
    String statusStr;
};

#endif