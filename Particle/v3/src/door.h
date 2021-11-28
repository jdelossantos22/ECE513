#ifndef _DOORH
#define _DOORH

#include "common.h"

class DoorSensor {
public:
    DoorSensor();
    void cmdProcessing(JSONValue cmdJson);
    void execute();
    int getSensorVal();
    void readSensorVal();
    bool checkIfClosed();
    String getStatusStr() {return statusStr;};
private:
    void createStatusStr();
private:
    enum STATE {S_CLOSED, S_OPEN, S_ALERT};
    STATE state;

    int t;
    int period;
    int sensorVal;
    int limit;

    String statusStr;
};

#endif