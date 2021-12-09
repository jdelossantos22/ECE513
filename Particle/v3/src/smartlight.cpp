#include "smartlight.h"

CSmartLight::CSmartLight() {
    state_L0 = CSmartLight::S_ON;
    state_L1 = CSmartLight::S_AUTO;
    brightness = RGB_BRIGHTNESS_DEAULT;
    sensorMax = LIGHT_SENSOR_MAX;
    sensorMin = LIGHT_SENSOR_MIN;
    color = 16777215;   //ffffff (white)
    bedtimeStart = 72000000;
    wakeupStart = 21600000;
    
    statusStr = "{}";
    resetCmd();
}

void CSmartLight::cmdProcessing(JSONValue cmdJson) {
    JSONObjectIterator iter(cmdJson);
    while (iter.next()) {
        if (iter.name() == "on") {
            cmd.On = (int)iter.value().toBool();
        }
        else if (iter.name() == "auto") {
            cmd.Auto = (int)iter.value().toBool();
        }
        else if (iter.name() == "brightness") {
            cmd.Brightness = iter.value().toInt();
        }
        else if (iter.name() == "min") {
            sensorMin = iter.value().toInt();
        }
        else if (iter.name() == "max") {
            sensorMax = iter.value().toInt();
        }
        else if (iter.name() == "color") {
            color = iter.value().toInt();
        }
        else if (iter.name() == "bedtime") {
            bedtimeStart = iter.value().toInt();        //In milliseconds (See controllerAtHome.html)
        }
        else if (iter.name() == "wakeup") {
            wakeupStart = iter.value().toInt();         //In milliseconds (See controllerAtHome.html)
        }
    }
}

void CSmartLight::execute() {
    switch (state_L0) {
        case CSmartLight::S_OFF:
            turnOffLight();
            if (cmd.On != INVALID_CMD) {
                if (cmd.On) { 
                    state_L0 = CSmartLight::S_ON;
                    state_L1 = CSmartLight::S_MANUAL;
                }
            }
            else if (!(bedtimeActive())) {
                state_L0 = CSmartLight::S_ON;
                state_L1 = CSmartLight::S_MANUAL;
            }
            break;
        case CSmartLight::S_ON:
            switch (state_L1) {
                case CSmartLight::S_MANUAL:
                    updateBrightnessManually(cmd.Brightness);
                    updateColor();
                    if (cmd.Auto != INVALID_CMD) {
                        if(cmd.Auto) state_L1 = CSmartLight::S_AUTO;
                    }
                    break;
                
                case CSmartLight::S_AUTO:
                    updataBrightnessAutomatically();
                    updateColor();
                    if (cmd.Auto != INVALID_CMD) {
                        if(!cmd.Auto) state_L1 = CSmartLight::S_MANUAL;
                    }
                    break;
                
                default:
                    break;
            }
            if (cmd.On != INVALID_CMD) {
                if(!cmd.On) state_L0= CSmartLight::S_OFF;
            }
            else if (bedtimeActive()) {
                state_L0 = CSmartLight::S_OFF;
            }
            break;
        default:
            break;
    }
    resetCmd();
    createStatusStr();
}

void CSmartLight::resetCmd() {
    cmd.On = INVALID_CMD;
    cmd.Auto = INVALID_CMD;
    cmd.Brightness = INVALID_CMD;
}

void CSmartLight::turnOffLight() {
    if (RGB.brightness() != 0) RGB.brightness(0);
}

// 0 <= val <= 100 (i.e., %)
void CSmartLight::updateBrightnessManually(int val) {
    if (val == INVALID_CMD) {
        if (brightness != RGB.brightness()) RGB.brightness(brightness);
        return;
    }
    brightness = (int)((double)RGB_BRIGHTNESS_MAX*(double)val/100.0);
    RGB.brightness(brightness);
}


void CSmartLight::updataBrightnessAutomatically() {
    readSensorVal();
    int curSensorVal = getSensorVal();
    
    if(curSensorVal < sensorMin) curSensorVal = sensorMin;
    if(curSensorVal > sensorMax) curSensorVal = sensorMax;
    double amountOfLight = (double)(curSensorVal-sensorMin)/(double)(sensorMax-sensorMin);
    brightness = (int)((double)RGB_BRIGHTNESS_MAX*(1.0-amountOfLight));

    RGB.brightness(brightness);
}

void CSmartLight::updateColor() {
    char colorHex[7];
    
    snprintf(colorHex, sizeof colorHex, "%06lx", color);
    puts(colorHex);

    int RGB1 = 0;
    int RGB2 = 0;
    int RGB3 = 0;

    int value = 0;
    int length = 1;

    //Find the decimal representation of RGB1
    for(int i = 0; i <= 1; i++) {
        if(colorHex[i]>='0' && colorHex[i]<='9')
        {
            value = colorHex[i] - 48;
        }
        else if(colorHex[i]>='a' && colorHex[i]<='f')
        {
            value = colorHex[i] - 97 + 10;
        }

        RGB1 += value * pow(16, length);
        length--;
    }

    length = 1;

    //Find the decimal representation of RGB2
    for(int i = 2; i <= 3; i++) {
        if(colorHex[i]>='0' && colorHex[i]<='9')
        {
            value = colorHex[i] - 48;
        }
        else if(colorHex[i]>='a' && colorHex[i]<='f')
        {
            value = colorHex[i] - 97 + 10;
        }

        RGB2 += value * pow(16, length);
        length--;
    }

    length = 1;

    //Find the decimal representation of RGB3
    for(int i = 4; i <= 5; i++) {
        if(colorHex[i]>='0' && colorHex[i]<='9')
        {
            value = colorHex[i] - 48;
        }
        else if(colorHex[i]>='a' && colorHex[i]<='f')
        {
            value = colorHex[i] - 97 + 10;
        }

        RGB3 += value * pow(16, length);
        length--;
    }
    RGB.color(RGB1, RGB2, RGB3);
}

bool CSmartLight::bedtimeActive() {
    int currentTime = ((int)Time.hour() * 60 * 60 * 1000 + (int)Time.minute() * 60 * 1000 + Time.second() * 1000) / 24;
    bedtimeStart /= 3600;
    wakeupStart /= 3600;
    Serial.printf("%d ",currentTime);
    Serial.printf("%d ",bedtimeStart);
    Serial.printf("%d ",wakeupStart);
    Serial.println();
    if ((currentTime > bedtimeStart) && (currentTime < wakeupStart)) {
        return false;
    }
    else {
        return false;
    }
}

void CSmartLight::readSensorVal() {
    sensorVal = analogRead(LIGHT_SENSOR);
}

int CSmartLight::getSensorVal() {
    return sensorVal;
}


void CSmartLight::createStatusStr() {
    statusStr = String::format("{\"L0\":%d,\"L1\":%d,\"b\":%d,\"s\":%d,\"m\":%d,\"M\":%d,\"D\":%d}", 
        state_L0, state_L1, (int)((double)brightness/RGB_BRIGHTNESS_MAX*100.0), sensorVal, sensorMin, sensorMax, color);
}
