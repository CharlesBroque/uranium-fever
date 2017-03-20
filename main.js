//declare variables
var land = 0;
var stakedLand = 0;
var pitchblende = 0;
var uraniumOre = 0;
var money = 10000;

var dogs = 0;
var stakebots = 0;
var minecrafters = 0;
var labkits = 0;
var stands = 0;

var landps = 0;
var stakedLandps = 0;
var pitchblendeps = 0;
var uraniumOreps = 0;
var moneyps = 0;

var buyMode = 1;

var buildingSpanIds = {dogs:"dogs",stakebots:"stakebots",minecrafters:"minecrafters",labkits:"labkits",stands:"stands"};
var buildingSpanPriceIds = {dogs:"dogPrice",stakebots:"stakebotPrice",minecrafters:"minecrafterPrice",labkits:"labkitPrice",stands:"standPrice"};
var tierOneObject = {dogs:dogs,stakebots:stakebots,minecrafters:minecrafters,labkits:labkits,stands:stands};
var priceObject = {dogs:10,stakebots:15,minecrafters:25,labkits:50,stands:100};
var initPriceObject = {dogs:10,stakebots:15,minecrafters:25,labkits:50,stands:100};
var priceMultObject = {dogs:1.07,stakebots:1.08,minecrafters:1.09,labkits:1.10,stands:1.11};
var resourcePsObject = {dogs:0.1,stakebots:0.1,minecrafters:0.1,labkits:0.1,stands:0.1}; //base resource each building converts per second
var currentPsObject = {dogs:0,stakebots:0,minecrafters:0,labkits:0,stands:0}; //actual resource output per second
var conversionEfficiencyObject = {landToStakedLand:0.9,stakedLandToPitchblende:0.9,pitchblendeToUraniumOre:0.9,uraniumOreToMoney:0.9}; //how efficiently each resource converts to the next one

//rounding utility function
function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
};

//declare resource functions
function scourLandscape(number,actor) {
	if (actor == "player") { //if the player clicks the button add the number
		land = land + number;
	} else { //if the function is called by something else, like a building, use the number as a multiplier for the resource per second
		land = land + number * resourcePsObject[actor];
	};
	document.getElementById("land").innerHTML = round(land,3);
};
function stakeLand(number,actor) {
	if (actor == "player") {
		if (land >= number) { //if there is enough land to make the purchase
			land = land - number; //take the land
			stakedLand = stakedLand + number * conversionEfficiencyObject.landToStakedLand; //increase the staked land with a 1:1 ratio
		} else { //if there's not enough land then just take all the land it can
			stakedLand = stakedLand + land * conversionEfficiencyObject.landToStakedLand;
			land = 0;
		};
	} else { //if the function is called by a building or something
		if (land >= number * resourcePsObject[actor]) { //and the player can afford the amount the building wants to process per second
			land = land - number * resourcePsObject[actor]; //take the land
			stakedLand = stakedLand + number * resourcePsObject[actor] * conversionEfficiencyObject.landToStakedLand; //add the right amount (remember the number is a multiplier)
		} else {
			stakedLand = stakedLand + land * conversionEfficiencyObject.landToStakedLand; //if the player can't afford it take all of it anyway
			land = 0;
		};
	};
	document.getElementById("land").innerHTML = round(land,3);
	document.getElementById("stakedLand").innerHTML = round(stakedLand,3);
};
function mineStakes(number,actor) {
	if (actor == "player") {
		if (stakedLand >= number) { //you know the drill
			stakedLand = stakedLand - number;
			pitchblende = pitchblende + number * conversionEfficiencyObject.stakedLandToPitchblende;
		} else {
			pitchblende = pitchblende + stakedLand * conversionEfficiencyObject.stakedLandToPitchblende;
			stakedLand = 0;
		};
	} else {
		if (stakedLand >= number * resourcePsObject[actor]) {
			stakedLand = stakedLand - number * resourcePsObject[actor];
			pitchblende = pitchblende + number * resourcePsObject[actor] * conversionEfficiencyObject.stakedLandToPitchblende;
		} else {
			pitchblende = pitchblende + stakedLand * conversionEfficiencyObject.stakedLandToPitchblende;
			stakedLand = 0;
		};
	};
	document.getElementById("stakedLand").innerHTML = round(stakedLand,3);
	document.getElementById("pitchblende").innerHTML = round(pitchblende,3);
};
function refinePitch(number,actor) {
	if (actor == "player") {
		if (pitchblende >= number) {
			pitchblende = pitchblende - number;
			uraniumOre = uraniumOre + number * conversionEfficiencyObject.pitchblendeToUraniumOre;
		} else {
			uraniumOre = uraniumOre + pitchblende * conversionEfficiencyObject.pitchblendeToUraniumOre;
			pitchblende = 0;
		};
	} else {
		if (pitchblende >= number * resourcePsObject[actor]) {
			pitchblende = pitchblende - number * resourcePsObject[actor];
			uraniumOre = uraniumOre + number * resourcePsObject[actor] * conversionEfficiencyObject.pitchblendeToUraniumOre;
		} else {
			uraniumOre = uraniumOre + pitchblende * conversionEfficiencyObject.pitchblendeToUraniumOre;
			pitchblende = 0;
		};
	};
	document.getElementById("pitchblende").innerHTML = round(pitchblende,3);
	document.getElementById("uraniumOre").innerHTML = round(uraniumOre,3);
};
function sellUranium(number,actor) {
	if (actor == "player") {
		if (uraniumOre >= number) {
			uraniumOre = uraniumOre - number;
			money = money + number * conversionEfficiencyObject.uraniumOreToMoney;
		} else {
			money = money + uraniumOre * conversionEfficiencyObject.uraniumOreToMoney;
			uraniumOre = 0;
		};
	} else {
		if (uraniumOre >= number * resourcePsObject[actor]) {
			uraniumOre = uraniumOre - number * resourcePsObject[actor];
			money = money + number * resourcePsObject[actor] * conversionEfficiencyObject.uraniumOreToMoney;
		} else {
			money = money + uraniumOre * conversionEfficiencyObject.uraniumOreToMoney;
			uraniumOre = 0;
		};
	};
	document.getElementById("uraniumOre").innerHTML = round(uraniumOre,3);
	document.getElementById("money").innerHTML = round(money,3);
};

function costCalc(price,priceMult,building,number) {
	return price * Math.pow(priceMult,building) * (Math.pow(priceMult,number) - 1) / (priceMult - 1);
};

function updatePriceOf(building) {
	switch (buyMode) {
		case "max":
		//todo later
		break;
		default:
		document.getElementById(buildingSpanPriceIds[building]).innerHTML = round(costCalc(initPriceObject[building],priceMultObject[building],tierOneObject[building],buyMode),3);
	};
};

//declare building buying function
function buyBuildings(number,type) {
	var buildingToBuy = ""; //declare building variable
	var price = 0; //declare acting price
	var priceMult = 0; //declare acting price multiplier
	var totalCost = 0; //declare temporary total cost
	switch (type) { //choose building based on type
		case 'dogs':
			buildingToBuy = "dogs"; //set temporary variables
			price = initPriceObject[buildingToBuy];
			priceMult = priceMultObject[buildingToBuy];
			break;
		case 'stakebots':
			buildingToBuy = "stakebots";
			price = initPriceObject[buildingToBuy];
			priceMult = priceMultObject[buildingToBuy];
			break;
		case 'minecrafters':
			buildingToBuy = "minecrafters";
			price = initPriceObject[buildingToBuy];
			priceMult = priceMultObject[buildingToBuy];
			break;
		case 'labkits':
			buildingToBuy = "labkits";
			price = initPriceObject[buildingToBuy];
			priceMult = priceMultObject[buildingToBuy];
			break;
		case 'stands':
			buildingToBuy = "stands";
			price = initPriceObject[buildingToBuy];
			priceMult = priceMultObject[buildingToBuy];
			break;
	};
	totalCost = costCalc(price,priceMult,tierOneObject[buildingToBuy],number);
	if (money >= totalCost) {
		money = money - totalCost;
		tierOneObject[buildingToBuy] = tierOneObject[buildingToBuy] + number;
		priceObject[buildingToBuy] = priceObject[buildingToBuy]*Math.pow(priceMult,number);
	};
	updatePriceOf(buildingToBuy);
	//document.getElementById(buildingSpanPriceIds[buildingToBuy]).innerHTML = round(priceObject[buildingToBuy],3);
	document.getElementById(buildingSpanIds[buildingToBuy]).innerHTML = round(tierOneObject[buildingToBuy],3);
	document.getElementById("money").innerHTML = round(money,3);
};

function switchBuyMode() {
	var modeArray = ["Buy x1","Buy x10","Buy x100","Buy Max"]
	switch (buyMode) {
		case 1:
		document.getElementById("buyMode").innerHTML = modeArray[1];
		buyMode = 10;
		break;
		case 10:
		document.getElementById("buyMode").innerHTML = modeArray[2];
		buyMode = 100;
		break;
		case 100:
		document.getElementById("buyMode").innerHTML = modeArray[3];
		buyMode = "max";
		break;
	};
	for (var i in tierOneObject) {
		if (tierOneObject.hasOwnProperty(i)) {
			updatePriceOf(i);
		};
	};
};

function calculatePsValues() { //n buildings * base rps * confactor - n (next) buildings base rps (next building)
	currentPsObject.stands = resourcePsObject.stands * tierOneObject.stands * conversionEfficiencyObject.uraniumOreToMoney; //no detractor buildings
	currentPsObject.labkits = resourcePsObject.labkits * tierOneObject.labkits * conversionEfficiencyObject.pitchblendeToUraniumOre - resourcePsObject.stands * tierOneObject.stands;
	currentPsObject.minecrafters = resourcePsObject.minecrafters * tierOneObject.minecrafters * conversionEfficiencyObject.stakedLandToPitchblende - resourcePsObject.labkits * tierOneObject.labkits;
	currentPsObject.stakebots = resourcePsObject.stakebots * tierOneObject.stakebots * conversionEfficiencyObject.landToStakedLand - resourcePsObject.minecrafters * tierOneObject.minecrafters;
	currentPsObject.dogs = resourcePsObject.dogs * tierOneObject.dogs - resourcePsObject.stakebots * tierOneObject.stakebots;
	landps = currentPsObject.dogs;
	stakedLandps = currentPsObject.stakebots;
	pitchblendeps = currentPsObject.minecrafters;
	uraniumOreps = currentPsObject.labkits;
	moneyps = currentPsObject.stands;
	document.getElementById("landps").innerHTML = round(landps,3);
	document.getElementById("stakedLandps").innerHTML = round(stakedLandps,3);
	document.getElementById("pitchblendeps").innerHTML = round(pitchblendeps,3);
	document.getElementById("uraniumOreps").innerHTML = round(uraniumOreps,3);
	document.getElementById("moneyps").innerHTML = round(moneyps,3);
};

function updateEfficiencies() {
	document.getElementById("stakebotEfficiency").innerHTML = round(100 * conversionEfficiencyObject.landToStakedLand,3);
	document.getElementById("minecrafterEfficiency").innerHTML = round(100 * conversionEfficiencyObject.stakedLandToPitchblende,3);
	document.getElementById("labkitEfficiency").innerHTML = round(100 * conversionEfficiencyObject.pitchblendeToUraniumOre,3);
	document.getElementById("standEfficiency").innerHTML = round(100 * conversionEfficiencyObject.uraniumOreToMoney,3);
};

window.setInterval(function() { //update window every second
	scourLandscape(tierOneObject.dogs,'dogs');
	stakeLand(tierOneObject.stakebots,'stakebots');
	mineStakes(tierOneObject.minecrafters,'minecrafters');
	refinePitch(tierOneObject.labkits,'labkits');
	sellUranium(tierOneObject.stands,'stands');
	calculatePsValues();
	updateEfficiencies();
}, 1000);