#ifndef _COMMON_H_
#define _COMMON_H_

#include "Particle.h"
#include "Adafruit_DHT.h"

#define PERIOD     1000
#define LOOP_FREQUENCY   (1000/PERIOD)   // Loop frequency
// Blue led
#define LED         D7
#define TOGGLE_FREQUENCY    1       // 1 Hz
#define PUBLISH_FREQUENCY 1

// RGB led
#define RGB_BRIGHTNESS_MAX      255
#define RGB_BRIGHTNESS_DEAULT   128
// photoresistor
#define LIGHT_SENSOR        A0
#define LIGHT_SENSOR_MIN    500
#define LIGHT_SENSOR_MAX    2500

#define DOOR_SENSOR A2
// command
#define INVALID_CMD         -99999

//thermostat
#define HALF_HOUR 1000*30
#define POWER_COOL 3000
#define POWER_HEAT 1500 
#define POWER_OFF 1

// serial communication
#define SERAIL_COMM_FREQUENCY   1   // 1 Hz

#define DHTPIN 2 
#define DHTTYPE DHT11

#endif