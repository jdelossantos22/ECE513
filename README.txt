Team # 3
ECE 513
Ian Louis Bell - ilbell@email.arizona.edu
Reydesel Alejandro Cuevas - cuevasr@email.arizona.edu
Jero Delos Santos - jdelossantos22@email.arizona.edu

AWS Address: http://ec2-18-216-179-189.us-east-2.compute.amazonaws.com:3000/
Checkpoint 2 Demos: http://ec2-18-216-179-189.us-east-2.compute.amazonaws.com:3000/checkpoint2.html
Video Demo: http://ec2-18-216-179-189.us-east-2.compute.amazonaws.com:3000/checkpoint2.html

Test Account:
username admin@email.arizona.edu
password: ece513Fall2021!

Particle Device: Particle Argon
Particle ID: e00fce684118b517fd70df3b
Particled Token: 1b876e93a09ff60c17322cd98e10abfbae2701ca

Registration:
users/register - registers user
users/signin - sign in user
users/status - check token status
users/update - update user info

Device Registration: 
device/create - register device
device/find - check if user already has a device registered
device/findaAll - return all devices
device/delete - delete device
device/update - modify device info

Particle Cloud:
particle/report - webhook route
particle/publish - publish commands and enable webhook
particle/ping - ping if device is online
particle/read - read rxData

Data Sent from Particle Device: JSON
Format: {
  "cmd": "read",
  "data": {
    "t": 1638676579,
    "light": {
      "L0": 1,
      "L1": 1,
      "b": 58,
      "s": 1336,
      "m": 500,
      "M": 2500
    },
    "led": {
      "t": 3,
      "p": 10,
      "s": 1,
      "h": 1
    },
    "thermostat": {
      "M": 0, //thermostat mode
      "H": 0, //heat state
      "C": 0, //cool state
      "F": 0, //fan state
      "t": 80.599998, //temp in farenheit
      "h": 28 //humidity
    },
    "door": {
      "d": "open"
    },
    "ct": 1,
    "simclock": "Sun Dec 05 2021 10:26:42 GMT+0000 (Coordinated Universal Time)"
  }
}

Response Codes:

	200 - 	{success: true, msg: "User already has device", dKey: device.apikey, dId:device.deviceId}
		{cmd: 'publish', success: true}
		{cmd: 'ping', success: true, data: JSON.parse(response.text)}

	201 - 	{success : true, message : req.body.name + "has been added to " + req.body.email, dKey:device.apikey, dId:device.deviceId}
		{success: true, msg: "This user has no device"}
		{cmd: 'publish', success: false}
		{cmd: 'ping', success: false, data: JSON.parse(err.response.text)}
		{cmd: 'read', data: retData}
		{success : true, message : req.body.fullName + "has been created"}
		{success:true, authToken: authToken, email:req.body.email}

	400 - 	{success: false, err: err}
		{success : false, message : err.errmsg, error:"bcryptjs error"}
		{success : false, message : err.errmsg, error: "Error"}

	401 - 	{success:false, err:err}
		{success: false, msg: "This email already used" }
		{success : false, message : "Can't connect."}
		{success : false, message : "Invalid Email or password ."}
		{success : false, message : "Error authenticating."}

	404 - 	Not Found
	

System Tutorial:
	
	Homepage:      Team and general information page.
		       To view relevant information and videos for checkpoint 2, select the "Click here to learn more" link on the home page.

	Sign-up:       From the homepage, click on the "Signup" icon in the top right. 
		       Enter all required information. Click register.
		       Re-enter your email and password to sign-in.
		       If you do not have a device currently registered, fill in the provided fields.
		       You will now be redirected to the controller.
	
	Login:         From the homepage, click on the "Login" icon in the top right. 
		       Enter your email and password.
		       If you do not have a device currently registered, fill in the provided fields.
		       You will now be redirected to the controller.
	
	Controller:    To view the data, you must have your device properly setup.
	             	  A0 - Light Sensor
			  A2 - Door Sensor
			  D2 - DHT11
		       Your device must also be registered and have a webhook created (Follow instructions in lecture 11_08).

Power Consumption:
When the Thermostat is in idle, it is consuming 1 watt
When the Thermostat is in Heat, it is consuming 1500 watts
When the Thermostat is in Cold it is consuming 3000 watts

The Power State Machine has 3 states P_OFF(POWER OFF), P_COOL, (POWER ON COOL), P_HEAT (POWER ON HEAT)
if (thermostat mode is off OR (thermostat mode is COOL AND thermostat cool is on COOL_WAIT) OR (thermostat mode is HEAT AND thermostat heat is on HEAT WAIT)
	the power state is P_OFF
else if (thermostat mode is COOL and thermostat cool is on COOL ON)
	the power state is P_COOL
else if (thermostat mode is HEAT and thermostat heat is on HEAT ON)
	the power state is P_HEAT


