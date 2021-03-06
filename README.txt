Team # 3
ECE 513
Ian Louis Bell - ilbell@email.arizona.edu
Reydesel Alejandro Cuevas - cuevasr@email.arizona.edu
Jero Delos Santos - jdelossantos22@email.arizona.edu

AWS Address: http://ec2-3-20-194-35.us-east-2.compute.amazonaws.com:3000/
Final Demo: http://ec2-3-20-194-35.us-east-2.compute.amazonaws.com:3000/checkpoint2.html
Checkpoint 2 Demos: http://ec2-3-20-194-35.us-east-2.compute.amazonaws.com:3000/checkpoint2.html
Video Demo: http://ec2-3-20-194-35.us-east-2.compute.amazonaws.com:3000/checkpoint2.html

Test Account:
username admin@email.arizona.edu
password: ece513Fall2021!

Simulation Time:
1 sec(Real World) == 5 minutes(Simulation World)
Minimum Sampling Period = 10 mins

Temperature History and Power History:
Starting on - 12/13 -01/01/2022

Particle Device: Particle Argon
Particle ID: e00fce684118b517fd70df3b
Particled Token: 1b876e93a09ff60c17322cd98e10abfbae2701ca
de7806638bd9c27b456dfd6efd56d7a1db416d2a

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

Temperature:
temperature/create
temperature/readAll
power/readAll

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

Database Collections:
User:
	email:        { type: String, required: true, unique: true },
  	fullName:     { type: String, required: true },
  	passwordHash: { type: String, required: true },
  	lastAccess:   { type: Date, default: Date.now },
  	userDevices:  { type:[String], default:[], sparse:true},
  	zip:      {type: Number},

Device:
      apikey:       String,
      deviceId:     String,
      deviceName: String,
      userEmail:    String,
      startDate: Date

Temperature
      postDate: Date,
      deviceId: String,
      userEmail: String,
      temperature: Number,
      humidity: Number,
      power: Number

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

Localhost tutorial:
The localhost is under directory Localhost/
And is run with - node localhost.js
Once the device is connected via USB, the localhost can then be connect using Serial Communication
Once Connected, the GUI will update with the current data. 
From the controllerAtHome_v0.html, the user can control the device. It includes control for the Smart Light(color, brightness, on/off, manual/auto),
and Thermostat(setTemp, read Temperature, read Humidity, off/cool/heat modes, and fanmode on/auto)
It also includes a section for the door alerts

Particle tutorial:
The particle files are under directory Particle/v3/
In order to Flash/Compile, connect the Argon device via USB and Flash(local)
The door sensor must be on pin A2
The smart light sensor must be on pin A0
The dht11 must be connected to D2



Power Consumption:
When the Thermostat is in idle, it is consuming 1 watt/hour
When the Thermostat is in Heat, it is consuming 1500 watts/hour
When the Thermostat is in Cold it is consuming 3000 watts/hour

The Power State Machine has 3 states P_OFF(POWER OFF), P_COOL, (POWER ON COOL), P_HEAT (POWER ON HEAT)
if (thermostat mode is off OR (thermostat mode is COOL AND thermostat cool is on COOL_WAIT) OR (thermostat mode is HEAT AND thermostat heat is on HEAT WAIT)
	the power state is P_OFF
else if (thermostat mode is COOL and thermostat cool is on COOL ON)
	the power state is P_COOL
else if (thermostat mode is HEAT and thermostat heat is on HEAT ON)
	the power state is P_HEAT

The Power Consumption at any point in time is saved in the same collection as the Temperatures and Humidity(The collection temperatures)

During the composition of the chart. All values within a week is grabbed.
Each value (3000,1500,1) is then grabbed and and multiplied with the time. The equation is as follows:
(POWER)*((Next Collection Time) - (Current Collection Time))/(1000*60*60)) where 1000*60*60 is 1 hour in milliseconds

The total for the week consumption is then summed up


