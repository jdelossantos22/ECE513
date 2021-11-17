# ECE513
ECE 513 Project 
ECE 413/513 Project - Smart Home


1. Project Overview
The smart home application is a low-cost IoT enabled web application for a) monitoring temperature and humidity, b) controlling a thermostat and a lighting system, and c) simulating power consumption, a simple security system, and others.
The IoT device uses two photoresistors and a humidity & temperature sensor (DHT11)
The IoT device will transmit measurements to a web application so that users can monitor their home
A simulated clock will be used for this project
The web application uses responsive design to allow users to view the application seamlessly on desktop, tablet, and mobile devices.

2. Clarifications
Some of the project requirements are open-ended allowing individual groups to be creative in how the requirement is implemented. Intentionally open-ended requirements are underlined below.
If any requirement is not clear, you should post publicly on Q&A document to clarify the requirements. Any clarifications needed will be added to this document and marked as Clarification.
You are also responsible for monitoring the Q&A document for any project requirements and clarifications. 


3. Requirements (Both ECE 413 and 513)
The web application should have a navigation menu.
The web application should use responsive design to be viewable on desktops, tablets, and smartphones.
The web application should have the index.html page to introduce your team and your project.
The web application should have the reference.html page to list up your third-party APIS, libraries, and code.

3.1. Account Creation and Management
A user must be able to create an account, using an email address as the username and a strong password, and register at least one device with their account
A user should be able to update any of their account information, except their email
A user should be able to add and remove devices (e.g., device ID and API key) in his/her account
A user should be able to have more than one device
A user should be able to add their location using a zip code

3.2. Simulated clock
To simulate your implementation effectively, we will use a simulated clock
Real world (RW) vs. Simulated-clock world (SW)
60 seconds in real world == 1 hour in simulated-clock world
24 minutes in real world == 1 day in simulated-clock world
24 X 7 = 168 minutes in real world == 7 days in simulated-clock world
You can manipulate Date object for this purpose
A user can set “Start date and time” in real world (e.g., 3PM, 10/20/2021) while registering a device
If a user set a sampling period for temperature & humidity monitoring using the real world clock, the IoT device should use simulated clock
For example, if a user sets 1 minutes as a sampling period, the IoT device should collect data every 1 second (i.e., simulated-clock)
For example, if a user sets 60 minutes as a sampling period, the IoT device should collect data every 1 minutes (i.e., simulated-clock)
We will discuss this in Week 10 and Week 11

3.3. Server
Your server must be implemented using Node.js, Express, and MongoDB on AWS
Your server’s endpoints must use RESTful APIs. Each endpoint must have accompanying documentation that describes the behavior, the expected parameters, and responses
Recommended HTTP response code (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
200: OK (request succeeded)
201: Created
400: bad request
401: Unauthorized
404: Not found
500: Internal server error
Access to the web application should be controlled using token based authentication

3.4. Index.html 
Introduce your team and your project
You may use each student’s name, email, and photo
You may present your project based on text, images, videos, or others
Should use responsive design

3.5. Third party APIs, Libraries, and Code
You may use additional third party APIs
You may use open-source JavaScript libraries
You may use open-source CSS libraries
You may use code from any examples presented in the course
You should prepare a page (i.e., references.html) to list your third party APIs, Libraries, and Code

5. Requirements (ECE 513)
Section 3 presents the common requirements for both ECE 413 and ECE 513. Section 5 presents ECE 513 requirements. If your team should implement all the ECE 413 requirements, please see Section 4.

5.1. IoT device
Should use Particle Photon or Argon
Should use two photoresistors (A0 port and A2 port) for smart lighting and door open/close, and one DHT 11 (D2 port) for monitoring temperature/humidity
The software for the IoT device must be implemented using synchronous state machines
Thermostat (simulation feature)
System mode: Off / Cool / Heat
Fan mode: On / Auto
Temperature setting
Operate like a general thermostat
Should consider “hysteresis” for your air conditioner (A/C) and heater simulation
Should use measured temperature to control your A/C and heater
Power consumption simulation
Should include a simple power consumption estimation method
e.g., A/C on - xxx watts / hour ; heater on - yyy watts / hour
base power consumption - zzz watts / hour
WiFi Temperature & Humidity Sensor
Set sampling period (see Section 3.2 as well)
Minimum: 1 minute (RW)
Maximum: 60 minutes (RW)
Unit: 1 minute (RW)
Keep uploading measured temperature & humidity data into your server
i.e., read measured data from the sensor (DHT11) and upload the data into your server periodically
You may use measured temperature for your thermostat control
A user can start/stop this periodic uploading via the web app
Smart bulb (simulation feature)
Adjust brightness (dimming)
Manual mode: a user can adjust it using the web app
Auto mode: adjust it automatically using the photoresistor (A0 port)
Adjust color
A user can adjust color using the web app
Set timer
Bedtime: A user set this bedtime using the web app to automatically turn off this light at bedtime
Wake-up time: A user set this time using the web app to slowly brighten the light in the morning to gradually wake up
Door open/close (simulation feature)
a user can see the door status via the web app
The open/close status should be estimated using the photoresistor (A2 port)
Set timer
When the door is open for a while (i.e., timer period), send alerts.

5.2. Localhost web to show/control your thermostat, Sensors, Smart bulb, and door status
Should use the serialPort module for Node.js
Your localhost server should communicate with your IoT device using a serial port (NOT WiFi or other internet connection)
Should prepare your html document to control / visualize your thermostat, smart bulb, and door status
e.g. http://localhost:3000/controllerAtHome.html
Using this interface,
a user can control the thermostat
System mode: Off / Cool / Heat
Fan mode: Auto / On
Temperature setting
a user can see current temperature/humidity
a user can see current bulb status (i.e., brightness, color, and on/off)
Recommend using Animation or CSS
a user can see current door status (open/close)
Also, alerts (may use animation effects)


5.3. Web app
You should have the following interfaces
Login/logout interface (See 3.1 as well)
Should use responsive design
Sign-in interface (See 3.1 as well)
User management - modify user information (See 3.1 as well) 
Device management - add/delete/modify
Control panel (i.e. remote control and monitoring)
Should use responsive design
A user can control 
Thermostat
Smart light
A user can see
Door open/close status with alerts
A user can see
Current weather information (get data by using a third party API - openweathermap.org)



(reference image)
Temperature & humidity monitoring dashboard (may be helpful to see the below images)
24 hours history
Daily history (display min., max., and avg. for temperature and humidity)


Power consumption monitoring
Visualize daily usage, weekly usage, and monthly usage


6. Extra Credit (ECE 413 and 513)
HTTPS server implementation 
Clarification
2.5 points extra	 
Where default total points for this project are 35 points if your team consists of three students
For instance, if you implement all the requirements with this HTTPS server, you will get 37.5 points.


7. Due dates
Check point 1: due 11/7
Index.html (mandatory)
Provide your server information so that the instructor and TAs can access
D2L submission will open by 11/1
Check point 2: due 11/23
[1] Allow users to create accounts, register a IoT device, and view basic data collected from the device
[2] Implement code for the IoT device that: 1) takes basic measurements for temperature/humidity, 2) adjusts smart light brightness, and 3) recognize door open/close status
[3] Implement code for the LocalHost node.js app to support [2]
Your state machine diagram for the final implementation
Submit code and documentation for at least one working endpoint on your server that can be accessed by the instructor and TAs.
All code including the device, server, front-end web pages, README, etc., must be submitted as a single archive to the D2L assignment drop box.
Short video demo for [1], [2], and [3] (10 minutes maximum)
Should either be hosted on your server or hosted on some other publicly accessible service (e.g., YouTube)
Will provide more details by 11/10
Final project submission: 12/8
Should implement all the requirements
Will announce all the details regarding this submission by 11/17
Also, we will decide the due date extension by 12/1   
