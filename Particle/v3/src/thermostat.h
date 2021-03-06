#ifndef _THERMOSTAT_H_
#define _THERMOSTAT_H_

#include "common.h"
#include "Adafruit_DHT.h"

typedef struct {
    int mode;            // 0: off, 1:cool, 2:heat
    int fanMode;            //false: auto, true:on
    int setTemp;
} ThermostatCmdStruct;

class CThermostat {
    enum STATE_MODE { S_OFF, S_HEAT, S_COOL };
    enum STATE_HEAT { S_HEAT_WAIT, S_HEAT_ON };
    enum STATE_COOL { S_COOL_WAIT, S_COOL_ON };
    enum STATE_FAN_MODE  { F_OFF, F_ON};
    enum STATE_POWER {P_OFF, P_COOL, P_HEAT};
public:
    CThermostat();
    void cmdProcessing(JSONValue cmdJson);
    void execute();
    String getStatusStr() {return statusStr;};
private:
    void createStatusStr();
    void resetCmd();
    void checkMode();
    
private:
    String statusStr;
    float farenheit;
    float humidity;
    STATE_MODE state_mode;
    STATE_HEAT state_heat;
    STATE_COOL state_cool;
    STATE_FAN_MODE state_fan_mode;
    STATE_POWER state_power;
    int counter;
    unsigned long lastRead;
    int dT=2;
    int startTime;
    int samplingPeriod=1;
    int setTemp;
    float power;
    int fanOn;
    ThermostatCmdStruct cmd;
};

#endif