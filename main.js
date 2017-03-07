//declare variables
var land = 0;
var stakedLand = 0;
var pitchblende = 0;
var uraniumOre = 0;
var money = 0;

var dogs = 0;
var stakebots = 0;
var minecrafters = 0;
var labkits = 0;
var stands = 0;

var tierOneArray = [dogs, stakebots, minecrafters, labkits, stands];
var priceObject = {dogs:10,stakebots:15,minecrafters:25,labkits:50,stands:100};
var princeMultObject = {dogs:1.07,stakebots:1.08,minecrafters:1.09,labkits:1.10,stands:1.11}

var landps = 0;
var stakedLandps = 0;
var pitchblendeps = 0;
var uraniumOreps = 0;
var moneyps = 0;

//declare resource functions
function scourLandscape(number,actor) {
	if (actor == "player") { //if the player clicks the button add the number
		land = land + number;
	} else { //if the function is called by something else, like a building, use the number as a multiplier for the resource per second
		land = land + number * landps;
	};
	document.getElementById("land").innerHTML = land;
};
function stakeLand(number,actor) {
	if (actor == "player") {
		if (land >= number) { //if there is enough land to make the purchase
			land = land - number; //take the land
			stakedLand = stakedLand + number; //increase the staked land with a 1:1 ratio
		} else { //if there's not enough land then just take all the land it can
			stakedLand = stakedLand + land;
			land = 0;
		};
	} else { //if the function is called by a building or something
		if (land >= number * stakedLandps) { //and the player can afford the amount the building wants to process per second
			land = land - number; //take the land
			stakedLand = stakedLand + number * stakedLandps; //add the right amount (remember the number is a multiplier)
		} else {
			stakedLand = stakedLand + land; //if the player can't afford it take all of it anyway
			land = 0;
		};
	};
	document.getElementById("land").innerHTML = land;
	document.getElementById("stakedLand").innerHTML = stakedLand;
};
function mineStakes(number,actor) {
	if (actor == "player") {
		if (stakedLand >= number) { //you know the drill
			stakedLand = stakedLand - number;
			pitchblende = pitchblende + number;
		} else {
			pitchblende = pitchblende + stakedLand;
			stakedLand = 0;
		};
	} else {
		if (stakedLand >= number * pitchblendeps) {
			stakedLand = stakedLand - number;
			pitchblende = pitchblende + number * pitchblendeps;
		} else {
			pitchblende = pitchblende + stakedLand;
			stakedLand = 0;
		};
	};
	document.getElementById("stakedLand").innerHTML = stakedLand;
	document.getElementById("pitchblende").innerHTML = pitchblende;
};
function refinePitch(number,actor) {
	if (actor == "player") {
		if (pitchblende >= number) {
			pitchblende = pitchblende - number;
			uraniumOre = uraniumOre + number;
		} else {
			uraniumOre = uraniumOre + pitchblende;
			pitchblende = 0;
		};
	} else {
		if (pitchblende >= number * uraniumOreps) {
			pitchblende = pitchblende - number;
			uraniumOre = uraniumOre + number * uraniumOreps;
		} else {
			uraniumOre = uraniumOre + pitchblende;
			pitchblende = 0;
		};
	};
	document.getElementById("pitchblende").innerHTML = pitchblende;
	document.getElementById("uraniumOre").innerHTML = uraniumOre;
};
function sellUranium(number,actor) {
	if (actor == "player") {
		if (uraniumOre >= number) {
			uraniumOre = uraniumOre - number;
			money = money + number;
		} else {
			money = money + uraniumOre;
			uraniumOre = 0;
		};
	} else {
		if (uraniumOre >= number * moneyps) {
			uraniumOre = uraniumOre - number;
			money = money + number * moneyps;
		} else {
			money = money + uraniumOre;
			uraniumOre = 0;
		};
	};
	document.getElementById("uraniumOre").innerHTML = uraniumOre;
	document.getElementById("money").innerHTML = money;
};

//declare building buying function
function buyBuildings(number,type) {
	var buildingToBuy = "";
	var priceMult = 0;
	switch (type) {
		case dogs:
			buildingToBuy = dogs;
			priceMult = priceMultObject[buildingToBuy];
	};
};

window.setInterval(function() { //update window every second
	
}, 1000);