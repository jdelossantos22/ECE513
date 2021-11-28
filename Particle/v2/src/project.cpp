/******************************************************/
//       THIS IS A GENERATED FILE - DO NOT EDIT       //
/******************************************************/

#include "Particle.h"
#line 1 "h:/Documents/Masters/ECE513/Project/ECE513/Particle/v2/src/project.ino"
/*
 * Project smartlight
 * Description: In-class activity - Smart Light Example
 * Author: Minsik Hong
 * Date: 11/3/2021
 */
// Please configure your project
// From the Command Palette 
//   1. select Particle: Configure Project for Device
//   2. the device OS version you'd like to build for: (use 2.2.0)
//   3. the type of device to you'd like to build for (i.e., select your device - Argon or Photon)
//   4. the name or device ID of the device you want to flash to. Just leave this blank

#include "common.h"
#include "smartlight.h"
#include "toggleLed.h"
#include "thermostat.h"
#include "Adafruit_DHT.h"
#include "door.h"

void serialCmdProcessing();
void setup();
void loop();
#line 21 "h:/Documents/Masters/ECE513/Project/ECE513/Particle/v2/src/project.ino"
SYSTEM_THREAD(ENABLED); 

// global variables
CSmartLight smartLight;
CToggleLed toggleLed;
CThermostat thermostat;
DoorSensor doorSensor;
int counter;

void serialCmdProcessing() {
  if (Serial.available() <= 0) return;
  String cmdStr = "";
  while (Serial.available()) {
      char c = Serial.read();
      cmdStr += String(c);
  }
  JSONValue cmdJson = JSONValue::parseCopy(cmdStr.c_str());
  JSONObjectIterator iter(cmdJson);
  while (iter.next()) {
    if (iter.name() == "smartlight") {
      smartLight.cmdProcessing(iter.value());
    }
    else if (iter.name() == "led") {
      toggleLed.cmdProcessing(iter.value());
    }
    /*else if (iter.name() == "thermostat") {
      thermostat.cmdProcessing(iter.value());
    }*/
    /*else if (iter.name() == "door") {
      door.cmdProcessing(iter.value());
    }*/

  }
}

// setup() runs once, when the device is first turned on.
void setup() {
  // Put initialization like pinMode and begin functions here.
  pinMode(LED, OUTPUT);
  RGB.control(true);
  RGB.color(255, 255, 255);   // default color white
  Serial.begin(9600);
  pinMode(DHTPIN, INPUT);
	pinSetFast(DHTPIN);
  counter = 0;
}

// loop() runs over and over again, as quickly as it can execute.
void loop() {
  unsigned long t = millis();
  //Serial.println("Starting");
  serialCmdProcessing();
  smartLight.execute();
  toggleLed.execute();
  doorSensor.execute();
  //delay(2000);
  //unsigned long s = millis();
  //Serial.printf("Thermostat start: %ld\n", s);
  thermostat.execute();
  //unsigned long e = millis();
  //Serial.printf("Thermostat end: %ld\n", e);
  
  unsigned long period = millis() - t;
  //Serial.println(counter % (SERAIL_COMM_FREQUENCY * LOOP_FREQUENCY));
  if (counter % (SERAIL_COMM_FREQUENCY * LOOP_FREQUENCY) == 0) {
    counter = 0;
    Serial.printf("{\"t\":%d,\"light\":%s,\"led\":%s,\"thermostat\":%s,\"door\":%s,\"ct\":%ld}", 
      (int)Time.now(), smartLight.getStatusStr().c_str(), toggleLed.getStatusStr().c_str(),thermostat.getStatusStr().c_str(),doorSensor.getStatusStr().c_str(),
      period
    );
    Serial.println();
  }
  counter++;
  /*
  period = PERIOD - (millis() - t);
  Serial.println(millis());
  Serial.println(t);
  Serial.println(period);
  if (period > 1000) delay(period);
  else delay(1000) ;
  */
  if (period > PERIOD) {
    int multiplier = (int)(ceil((float)period/PERIOD));
    period = PERIOD*multiplier - (int)period;
  }
  else{
    period = PERIOD - (millis() - t);
  }
  //Serial.println(period);
  delay(150);
}