Team # 3
ECE 513
Ian Louis Bell - ilbell@email.arizona.edu
Reydesel Alejandro Cuevas - cuevasr@email.arizona.edu
Jero Delos Santos - jdelossantos22@email.arizona.edu
AWS Address: http://ec2-18-216-179-189.us-east-2.compute.amazonaws.com:3000/
Checkpoint 2 Demos: http://ec2-18-216-179-189.us-east-2.compute.amazonaws.com:3000/checkpoint2.html
Particle Device: Particle Argon

Registration:
users/register
users/signin
users/status

Device Registration:
device/register

Particle Cloud:
particle/report
particle/publish
particle/ping
particle/read

Data Sent from Particle Device: JSON
Format: {
  t: 1638049195,
  light: { L0: 1, L1: 1, b: 34, s: 1797, m: 500, M: 2500 },
  led: { t: 0, p: 0, s: 1, h: 0 },
  thermostat: {
    t: 82.400002,
    c: 28,
    h: 27,
    hi: 26.966972,
    dp: 7.243196,
    k: 301.149994
  },
  door: { d: 'open' },
  ct: 2
}

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


