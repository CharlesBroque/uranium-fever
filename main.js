if (typeof(Storage) == "undefined") {
    alert("This browser does not support HTML5 localStorage, which this game uses to save data between sessions.\nIf you wish to be able to save your progress, switch to a supported browser.");
};

//declare variables
var ticks = 0;
var sessionTicks = 0;
var datetime = new Date();
datetime.setFullYear(1955);
var saveInterval = 60;

var buyMode = 1;
var debugMode = false;

var clickPower = 1;
var clickUpgradePrice = 10;
var clickMult = 2.5;
var mouseUpgradeButton = document.getElementById("mouseUpgradeButton");

var totalPrestige = 0;
var claimedPrestige = 0;
var totalEarnings = 0;
var totalLandScoured = 0;
var totalLandStaked = 0;
var totalPitchblendeMined = 0;
var totalOreProcessed = 0;

var buttonObject = {
	dogButton: document.getElementById("dogButton"),
	stakebotButton: document.getElementById("stakebotButton"),
	minecrafterButton: document.getElementById("minecrafterButton"),
	labkitButton: document.getElementById("labkitButton"),
	standButton: document.getElementById("standButton")
};
var buildingSpanIds = {
	dogs: "dogs",
	stakebots: "stakebots",
	minecrafters: "minecrafters",
	labkits: "labkits",
	stands: "stands"
};
var buildingSpanPriceIds = {
	dogs: "dogPrice",
	stakebots: "stakebotPrice",
	minecrafters: "minecrafterPrice",
	labkits: "labkitPrice",
	stands: "standPrice"
};
var buildingButtons = {
	dogButton: buildingSpanIds.dogs,
	stakebotButton: buildingSpanIds.stakebots,
	minecrafterButton: buildingSpanIds.minecrafters,
	labkitButton: buildingSpanIds.labkits,
	standButton: buildingSpanIds.stands
};
var singularButtonNames = {
	dogButton: buildingSpanIds.dogs.slice(0,-1),
	stakebotButton: buildingSpanIds.stakebots.slice(0,-1),
	minecrafterButton: buildingSpanIds.minecrafters.slice(0,-1),
	labkitButton: buildingSpanIds.labkits.slice(0,-1),
	standButton: buildingSpanIds.stands.slice(0,-1)
};

var tierOneObject = {
	dogs: 0,
	stakebots: 0,
	minecrafters: 0,
	labkits: 0,
	stands: 0
};
var priceObject = {
	dogs: 10,
	stakebots: 15,
	minecrafters: 25,
	labkits: 50,
	stands: 100
};
var initPriceObject = {
	dogs: 10,
	stakebots: 15,
	minecrafters: 25,
	labkits: 50,
	stands: 100
};
var priceMultObject = {
	dogs: 1.11,
	stakebots: 1.10,
	minecrafters: 1.09,
	labkits: 1.08,
	stands: 1.07
};
var resourceObject = {
	land: 0,
	stakedLand: 0,
	pitchblende: 0,
	uraniumOre: 0,
	money: 0
};
var resourcePsObject = { //base resource each building converts per second
	dogs: 1.0,
	stakebots: 1.0,
	minecrafters: 1.0,
	labkits: 1.0,
	stands: 1.0
};
var currentPsObject = { //actual resource output per second
	dogs: 0,
	stakebots: 0,
	minecrafters: 0,
	labkits: 0,
	stands: 0
};
var conversionEfficiencyObject = { //how efficiently each resource converts to the next one
	scourFactor: 0.5 * (1 + claimedPrestige/100),
	landToStakedLand: 0.5 * (1 + claimedPrestige/100),
	stakedLandToPitchblende: 0.5 * (1 + claimedPrestige/100),
	pitchblendeToUraniumOre: 0.5 * (1 + claimedPrestige/100),
	uraniumOreToMoney: 0.5 * (1 + claimedPrestige/100)
};
var conversionAssociationObject = {
	dogs: "scourFactor",
	stakebots: "landToStakedLand",
	minecrafters: "stakedLandToPitchblende",
	labkits: "pitchblendeToUraniumOre",
	stands: "uraniumOreToMoney",
	scourFactor: "dogEfficiency",
	landToStakedLand: "stakebotEfficiency",
	stakedLandToPitchblende: "minecrafterEfficiency",
	pitchblendeToUraniumOre: "labkitEfficiency",
	uraniumOreToMoney: "standEfficiency"
};

var upgradeStrength = 0.1;

var tierOneUpgradeObject = {
	dogs: 0,
	stakebots: 0,
	minecrafters: 0,
	labkits: 0,
	stands: 0
};
var initUpgradePriceObject = {
	dogs: 20,
	stakebots: 30,
	minecrafters: 50,
	labkits: 90,
	stands: 150
};
var upgradePriceObject = {
	dogs: 20,
	stakebots: 30,
	minecrafters: 50,
	labkits: 90,
	stands: 150
};
var upgradePriceMultObject = {
	dogs: 1.1,
	stakebots: 1.21,
	minecrafters: 1.331,
	labkits: 1.4641,
	stands: 1.61051
};
var upgradeSpanButtonIds = {
	dogs: document.getElementById("dogUpgradeButton"),
	stakebots: document.getElementById("stakebotUpgradeButton"),
	minecrafters: document.getElementById("minecrafterUpgradeButton"),
	labkits: document.getElementById("labkitUpgradeButton"),
	stands: document.getElementById("standUpgradeButton")
};

var maxBuyableButtonObject = {
	dogButton: calcMaxBuyable(initPriceObject[buildingSpanIds.dogs],priceMultObject[buildingSpanIds.dogs],tierOneObject[buildingSpanIds.dogs],money),
	stakebotButton: calcMaxBuyable(initPriceObject[buildingSpanIds.stakebots],priceMultObject[buildingSpanIds.stakebots],tierOneObject[buildingSpanIds.stakebots],money),
	minecrafterButton: calcMaxBuyable(initPriceObject[buildingSpanIds.minecrafters],priceMultObject[buildingSpanIds.minecrafters],tierOneObject[buildingSpanIds.minecrafters],money),
	labkitButton: calcMaxBuyable(initPriceObject[buildingSpanIds.labkits],priceMultObject[buildingSpanIds.labkits],tierOneObject[buildingSpanIds.labkits],money),
	standButton: calcMaxBuyable(initPriceObject[buildingSpanIds.stands],priceMultObject[buildingSpanIds.stands],tierOneObject[buildingSpanIds.stands],money)
};

var cheevos = {
	achieved: 0,
	longStrip: {
		name: "The Long Strip",
		type: "resource",
		detect: {
			land: 1000
		},
		unlocked: false,
		unlockMessage: "You've managed to rack up 1000 square meters of virgin ground at once.\n(Achievement Unlocked)"
	},
	governmentLand: {
		name: "Government Land",
		type: "resource",
		detect: {
			stakedLand: 1000
		},
		unlocked: false,
		unlockMessage: "The stakes are high. Real high.\n(Achievement Unlocked)"
	},
	twoPointTwoPounds: {
		name: "Two Point Two Pounds",
		type: "resource",
		detect: {
			pitchblende: 1000
		},
		unlocked: false,
		unlockMessage: "A proper lump.\n(Achievement Unlocked)"
	},
	radioactive: {
		name: "Radioactive, Radioactive!",
		type: "resource",
		detect: {
			uraniumOre: 1000
		},
		unlocked: false,
		unlockMessage: "I'm waking up, I feel it in my bones. Enough to threaten the structural integrity of my skeletal system.\n(Achievement Unlocked)"
	},
	bigOne: {
		name: "Big One",
		type: "resource",
		detect: {
			money: 1000
		},
		unlocked: false,
		unlockMessage: "Grand.\n(Achievement Unlocked)"
	},
	dogAchievement: {
		name: "Dog Achievement",
		type: "building",
		detect: {
			dogs: 10
		},
		unlocked: false,
		unlockMessage: "Ten dogs. Hey, not every achievement has to have witty unlock text.\n(Achievement Unlocked)"
	},
	stakebotStakeout: {
		name: "Stakeout",
		type: "building",
		detect: {
			stakebots: 10
		},
		unlocked: false,
		unlockMessage: "It's a stakebot stakeout! ... No? Nothing?\n(Achievement Unlocked)"
	},
	miningAway: {
		name: "MINING AWAY",
		type: "building",
		detect: {
			minecrafters: 10
		},
		unlocked: false,
		unlockMessage: "IN THIS MINECRAFT DAY, SO BEAUTIFUL\n(Achievement Unlocked)"
	},
	cookingWithGas: {
		name: "Cooking With Gas",
		type: "building",
		detect: {
			labkits: 10
		},
		unlocked: false,
		unlockMessage: "Vastly inferior to electric technology.\n(Achievement Unlocked)"
	},
	standingUp: {
		name: "Standing Up",
		type: "building",
		detect: {
			stands: 10
		},
		unlocked: false,
		unlockMessage: "Upstanding.\n(Achievement 「RETIRED」)"
	},
	squareKilometer: {
		name: "Square Kilometer",
		type: "resource",
		detect: {
			land: 1000000
		},
		unlocked: false,
		unlockMessage: "You did it. One square kilometer under your watchful eyes.\n(Achievement Unlocked)"
	},
	threestarStakehouse: {
		name: "Three-Star Stakehouse",
		type: "resource",
		detect: {
			stakedLand: 1000000
		},
		unlocked: false,
		unlockMessage: "Dinner's on me, boys.\n(Achievement Unlocked)"
	},
	tonOfRocks: {
		name: "A Ton Of Rocks",
		type: "resource",
		detect: {
			pitchblende: 1000000
		},
		unlocked: false,
		unlockMessage: "You're gonna need a bigger Jeep.\n(Achievement Unlocked)"
	},
	geigerShrugged: {
		name: "Geiger Shrugged",
		type: "resource",
		detect: {
			uraniumOre: 1000000
		},
		unlocked: false,
		unlockMessage: "Society was on the verge of collapse anyway.\n(Achievement Unlocked)"
	},
	ransomDemand: {
		name: "Ransom Demand?",
		type: "resource",
		detect: {
			money: 1000000
		},
		unlocked: false,
		unlockMessage: "I make more than that in a day, probably.\n(Achievement Unlocked)"
	},
	dogAchievement2: {
		name: "Electric Boogaloo",
		type: "building",
		detect: {
			dogs: 25
		},
		unlocked: false,
		unlockMessage: "Quarter-centennial doggos. Fresh puppers, them.\n(Achievement Unlocked)"
	},
	stakeNshake: {
		name: "Stake 'n Shake",
		type: "building",
		detect: {
			stakebots: 25
		},
		unlocked: false,
		unlockMessage: "Premium stakeburger.\n(Achievement Unlocked)"
	},
	dwarfOlympics: {
		name: "Dwarf Olympics",
		type: "building",
		detect: {
			minecrafters: 25
		},
		unlocked: false,
		unlockMessage: "Diggy, diggy hole ... digging a hole.\n(Achievement Unlocked)"
	},
	bonusDrugs: {
		name: "Bonus Drugs",
		type: "building",
		detect: {
			labkits: 25
		},
		unlocked: false,
		unlockMessage: "FDA Approved*.\n(Achievement Unlocked)\n\n\n\n\n*not really."
	},
	standProud: {
		name: "Stand Proud",
		type: "building",
		detect: {
			stands: 25
		},
		unlocked: false,
		unlockMessage: "Break you down Break you down Break you down\nKobushi hanatsu seinaru VISION Stand Proud!\n(Achievement 「RETIRED」)"
	},
	frequentFlyer: {
		name: "Frequent Flyer",
		type: "resource",
		detect: {
			land: 1000000000
		},
		unlocked: false,
		unlockMessage: "That's one billion square meters, son. One billion. With a B.\n(Achievement Unlocked)"
	},
	noMisStakes: {
		name: "No Mis-stakes",
		type: "resource",
		detect: {
			stakedLand: 1000000000
		},
		unlocked: false,
		unlockMessage: "The pinnacle of stake-laying.\n(Achievement Unlocked)"
	},
	kiloton: {
		name: "Kiloton",
		type: "resource",
		detect: {
			pitchblende: 1000000000
		},
		unlocked: false,
		unlockMessage: "You're on the watchlist now, bucko.\n(Achievement Unlocked)"
	},
	illegal: {
		name: "This Is Illegal",
		type: "resource",
		detect: {
			uraniumOre: 1000000000
		},
		unlocked: false,
		unlockMessage: "... I think. I'm not positive.\n(Achievement Unlocked)"
	},
	billionaire: {
		name: "Billionaire",
		type: "resource",
		detect: {
			money: 1000000000
		},
		unlocked: false,
		unlockMessage: "'Hey Jimmy, what would you do with a billion dollars?'\n'Buy a dog. What else?'\n(Achievement Unlocked)"
	},
	midcenturyMiracle: {
		name: "Midcentury Miracle",
		type: "building",
		detect: {
			dogs: 50
		},
		unlocked: false,
		unlockMessage: "That's, like, 50 dogs, man.\n(Achievement Unlocked)"
	},
	highStakes: {
		name: "High Stakes",
		type: "building",
		detect: {
			stakebots: 50
		},
		unlocked: false,
		unlockMessage: "I've used this pun already.\n(Achievement Unlocked)"
	},
	laborUnion: {
		name: "Labor Union",
		type: "building",
		detect: {
			minecrafters: 50
		},
		unlocked: false,
		unlockMessage: "No! Not the regulations!\n(Achievement Unlocked)"
	},
	caustic: {
		name: "Caustic",
		type: "building",
		detect: {
			labkits: 50
		},
		unlocked: false,
		unlockMessage: "Only the best waste products.\n(Achievement Unlocked)"
	},
	theReasonYouLost: {
		name: "The Reason You Lost",
		type: "building",
		detect: {
			stands: 50
		},
		unlocked: false,
		unlockMessage: "You really pissed me off.\n(Achievement 「RETIRED」)"
	},
	threePointFiveNevadas: {
		name: "3.5 Nevadas",
		type: "resource",
		detect: {
			land: 1000000000000
		},
		unlocked: false,
		unlockMessage: "One square megameter. Also known as the land area in 3.5 Nevadas.\n(Achievement Unlocked)"
	},
	midwestTerritory: {
		name: "Midwest Territory",
		type: "resource",
		detect: {
			stakedLand: 1000000000000
		},
		unlocked: false,
		unlockMessage: "3.5 Nevadas is on the order of 5/6 Alaskas.\n(Achievement Unlocked)"
	},
	megaton: {
		name: "Megaton",
		type: "resource",
		detect: {
			pitchblende: 1000000000000
		},
		unlocked: false,
		unlockMessage: "This'll show them!\n(Achievement Unlocked)"
	},
	nationalSecurity: {
		name: "A Matter of National Security",
		type: "resource",
		detect: {
			uraniumOre: 1000000000000
		},
		unlocked: false,
		unlockMessage: "This is getting out of hand.\n(Achievement Unlocked)"
	},
	economicSuperpower: {
		name: "Economic Superpower",
		type: "resource",
		detect: {
			money: 1000000000000
		},
		unlocked: false,
		unlockMessage: "'One TRILLION dollars!!'\n(Achievement Unlocked)"
	},
	OneOhOneMinusOne: {
		name: "101 - 1 Dalmations",
		type: "building",
		detect: {
			dogs: 100
		},
		unlocked: false,
		unlockMessage: "Dogmeat didn't make it.\n(Achievement Unlocked)"
	},
	runningOutOfPuns: {
		name: "Running Out of Puns",
		type: "building",
		detect: {
			stakebots: 100
		},
		unlocked: false,
		unlockMessage: "100 Stakebots. I got nothin'.\n(Achievement Unlocked)"
	},
	dedicatedServer: {
		name: "Dedicated Server",
		type: "building",
		detect: {
			minecrafters: 100
		},
		unlocked: false,
		unlockMessage: "Come on in. We have Hunger Games, Spleef, and other MineCrap.\n(Achievement Unlocked)"
	},
	walterWouldBeProud: {
		name: "Walter Would Be Proud",
		type: "building",
		detect: {
			labkits: 100
		},
		unlocked: false,
		unlockMessage: "You're god damn right.\n(Achievement Unlocked)"
	},
	sutandoPowah: {
		name: "Sutando Powah",
		type: "building",
		detect: {
			stands: 100
		},
		unlocked: false,
		unlockMessage: "ORAORAORAORAORAORAORAORAORAORA--ORA!!\n(Achievement 「RETIRED」)"
	}
};

document.getElementById("totalAchievements").innerHTML = Object.keys(cheevos).length - 1;

var gamesave = {
	ticks: ticks,
	datetime: datetime,
	saveInterval: saveInterval,
	tierOneObject: tierOneObject,
	priceObject: priceObject,
	priceMultObject: priceMultObject,
	resourceObject: resourceObject,
	resourcePsObject: resourcePsObject,
	currentPsObject: currentPsObject,
	conversionEfficiencyObject: conversionEfficiencyObject,
	tierOneUpgradeObject: tierOneUpgradeObject,
	upgradePriceObject: upgradePriceObject,
	upgradePriceMultObject: upgradePriceMultObject,
	clickPower: clickPower,
	clickUpgradePrice: clickUpgradePrice,
	clickMult: clickMult,
	totalPrestige: totalPrestige,
	claimedPrestige: claimedPrestige,
	totalEarnings: totalEarnings,
	totalLandScoured: totalLandScoured,
	totalLandStaked: totalLandStaked,
	totalPitchblendeMined: totalPitchblendeMined,
	totalOreProcessed: totalOreProcessed,
	upgradeStrength: upgradeStrength,
	cheevos: cheevos
};

//developer/debug mode
if (debugMode == true) {
	for (var i in resourceObject) {
		if (resourceObject.hasOwnProperty(i)) {
			resourceObject[i] = 1000000;
		};
	};
};

//rounding utility function
function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
};

//time counting function
function clocktick() {
	ticks = ticks + 1;
	sessionTicks = sessionTicks + 1;
};

//declare resource functions
function scourLandscape(number,actor) {
	if (actor == "player") { //if the player clicks the button add the number
		resourceObject.land = resourceObject.land + number;
		totalLandScoured = totalLandScoured + number;
	} else { //if the function is called by something else, like a building, use the number as a multiplier for the resource per second
		resourceObject.land = resourceObject.land + number * resourcePsObject[actor] * conversionEfficiencyObject.scourFactor;
		totalLandScoured = totalLandScoured + number * resourcePsObject[actor] * conversionEfficiencyObject.scourFactor;
	};
	document.getElementById("land").innerHTML = round(resourceObject.land,3);
	document.getElementById("totalLandScoured").innerHTML = round(totalLandScoured,3);
};
function stakeLand(number,actor) {
	if (actor == "player") {
		if (resourceObject.land >= number) { //if there is enough land to make the purchase
			resourceObject.land = resourceObject.land - number; //take the land
			resourceObject.stakedLand = resourceObject.stakedLand + number; //increase the staked land with a 1:1 ratio
			totalLandStaked = totalLandStaked + number;
		} else { //if there's not enough land then just take all the land it can
			resourceObject.stakedLand = resourceObject.stakedLand + resourceObject.land;
			totalLandStaked = totalLandStaked + resourceObject.land;
			resourceObject.land = 0;
		};
	} else { //if the function is called by a building or something
		if (resourceObject.land >= number * resourcePsObject[actor]) { //and the player can afford the amount the building wants to process per second
			resourceObject.land = resourceObject.land - number * resourcePsObject[actor]; //take the land
			resourceObject.stakedLand = resourceObject.stakedLand + number * resourcePsObject[actor] * conversionEfficiencyObject.landToStakedLand; //add the right amount (remember the number is a multiplier)
			totalLandStaked = totalLandStaked + number * resourcePsObject[actor] * conversionEfficiencyObject.landToStakedLand;
		} else {
			resourceObject.stakedLand = resourceObject.stakedLand + resourceObject.land * conversionEfficiencyObject.landToStakedLand; //if the player can't afford it take all of it anyway
			totalLandStaked = totalLandStaked + resourceObject.land * conversionEfficiencyObject.landToStakedLand;
			resourceObject.land = 0;
		};
	};
	document.getElementById("land").innerHTML = round(resourceObject.land,3);
	document.getElementById("stakedLand").innerHTML = round(resourceObject.stakedLand,3);
	document.getElementById("totalLandStaked").innerHTML = round(totalLandStaked,3);
};
function mineStakes(number,actor) {
	if (actor == "player") {
		if (resourceObject.stakedLand >= number) { //you know the drill
			resourceObject.stakedLand = resourceObject.stakedLand - number;
			resourceObject.pitchblende = resourceObject.pitchblende + number;
			totalPitchblendeMined = totalPitchblendeMined + number;
		} else {
			resourceObject.pitchblende = resourceObject.pitchblende + resourceObject.stakedLand;
			totalPitchblendeMined = totalPitchblendeMined + resourceObject.stakedLand;
			resourceObject.stakedLand = 0;
		};
	} else {
		if (resourceObject.stakedLand >= number * resourcePsObject[actor]) {
			resourceObject.stakedLand = resourceObject.stakedLand - number * resourcePsObject[actor];
			resourceObject.pitchblende = resourceObject.pitchblende + number * resourcePsObject[actor] * conversionEfficiencyObject.stakedLandToPitchblende;
			totalPitchblendeMined = totalPitchblendeMined + number * resourcePsObject[actor] * conversionEfficiencyObject.stakedLandToPitchblende;
		} else {
			resourceObject.pitchblende = resourceObject.pitchblende + resourceObject.stakedLand * conversionEfficiencyObject.stakedLandToPitchblende;
			totalPitchblendeMined = totalPitchblendeMined + resourceObject.stakedLand * conversionEfficiencyObject.stakedLandToPitchblende;
			resourceObject.stakedLand = 0;
		};
	};
	document.getElementById("stakedLand").innerHTML = round(resourceObject.stakedLand,3);
	document.getElementById("pitchblende").innerHTML = round(resourceObject.pitchblende,3);
	document.getElementById("totalPitchblendeMined").innerHTML = round(totalPitchblendeMined,3);
};
function refinePitch(number,actor) {
	if (actor == "player") {
		if (resourceObject.pitchblende >= number) {
			resourceObject.pitchblende = resourceObject.pitchblende - number;
			resourceObject.uraniumOre = resourceObject.uraniumOre + number;
			totalOreProcessed = totalOreProcessed + number;
		} else {
			resourceObject.uraniumOre = resourceObject.uraniumOre + resourceObject.pitchblende;
			totalOreProcessed = totalOreProcessed + resourceObject.pitchblende;
			resourceObject.pitchblende = 0;
		};
	} else {
		if (resourceObject.pitchblende >= number * resourcePsObject[actor]) {
			resourceObject.pitchblende = resourceObject.pitchblende - number * resourcePsObject[actor];
			resourceObject.uraniumOre = resourceObject.uraniumOre + number * resourcePsObject[actor] * conversionEfficiencyObject.pitchblendeToUraniumOre;
			totalOreProcessed = totalOreProcessed + number * resourcePsObject[actor] * conversionEfficiencyObject.pitchblendeToUraniumOre;
		} else {
			resourceObject.uraniumOre = resourceObject.uraniumOre + resourceObject.pitchblende * conversionEfficiencyObject.pitchblendeToUraniumOre;
			totalOreProcessed = totalOreProcessed + resourceObject.pitchblende * conversionEfficiencyObject.pitchblendeToUraniumOre;
			resourceObject.pitchblende = 0;
		};
	};
	document.getElementById("pitchblende").innerHTML = round(resourceObject.pitchblende,3);
	document.getElementById("uraniumOre").innerHTML = round(resourceObject.uraniumOre,3);
	document.getElementById("totalOreProcessed").innerHTML = round(totalOreProcessed,3);
};
function sellUranium(number,actor) {
	if (actor == "player") {
		if (resourceObject.uraniumOre >= number) {
			resourceObject.uraniumOre = resourceObject.uraniumOre - number;
			resourceObject.money = resourceObject.money + number;
			totalEarnings = totalEarnings + number;
		} else {
			resourceObject.money = resourceObject.money + resourceObject.uraniumOre;
			totalEarnings = totalEarnings + resourceObject.uraniumOre;
			resourceObject.uraniumOre = 0;
		};
	} else {
		if (resourceObject.uraniumOre >= number * resourcePsObject[actor]) {
			resourceObject.uraniumOre = resourceObject.uraniumOre - number * resourcePsObject[actor];
			resourceObject.money = resourceObject.money + number * resourcePsObject[actor] * conversionEfficiencyObject.uraniumOreToMoney;
			totalEarnings = totalEarnings + number * resourcePsObject[actor] * conversionEfficiencyObject.uraniumOreToMoney;
		} else {
			resourceObject.money = resourceObject.money + resourceObject.uraniumOre * conversionEfficiencyObject.uraniumOreToMoney;
			totalEarnings = totalEarnings + resourceObject.uraniumOre * conversionEfficiencyObject.uraniumOreToMoney;
			resourceObject.uraniumOre = 0;
		};
	};
	document.getElementById("uraniumOre").innerHTML = round(resourceObject.uraniumOre,3);
	document.getElementById("money").innerHTML = round(resourceObject.money,3);
	document.getElementById("totalEarnings").innerHTML = round(totalEarnings,3);
};

function costCalc(price,priceMult,building,number) {
	return price * Math.pow(priceMult,building) * (Math.pow(priceMult,number) - 1) / (priceMult - 1);
};
function calcMaxBuyable(price,priceMult,building,funds) {
	var result = Math.trunc(Math.log( -funds * ( 1 - priceMult ) / price + Math.pow(priceMult,building) ) / Math.log(priceMult) - building);
	if (result == 0) {
		result = 1;
	};
	return result;
};

function updatePriceOf(building) {
	switch (buyMode) {
		case "max":
		document.getElementById(buildingSpanPriceIds[building]).innerHTML = round(costCalc(initPriceObject[building],priceMultObject[building],tierOneObject[building],calcMaxBuyable(initPriceObject[building],priceMultObject[building],tierOneObject[building],resourceObject.money)),3);
		break;
		default:
		document.getElementById(buildingSpanPriceIds[building]).innerHTML = round(costCalc(initPriceObject[building],priceMultObject[building],tierOneObject[building],buyMode),3);
	};
};

function updateUpgradePriceOf(upgrade) {
		upgradeSpanButtonIds[upgrade].innerHTML = "Improve " + upgrade.toString().slice(0,-1) + " efficiency by " + round((upgradeStrength * 100),3) + "% ($" + round(costCalc(initUpgradePriceObject[upgrade],upgradePriceMultObject[upgrade],tierOneUpgradeObject[upgrade],1),3) + ")";
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
	if (buyMode == "max") {
		number = calcMaxBuyable(price,priceMult,tierOneObject[buildingToBuy],resourceObject.money);
	};
	totalCost = costCalc(price,priceMult,tierOneObject[buildingToBuy],number);
	if (resourceObject.money >= totalCost) {
		resourceObject.money = resourceObject.money - totalCost;
		tierOneObject[buildingToBuy] = tierOneObject[buildingToBuy] + number;
		priceObject[buildingToBuy] = priceObject[buildingToBuy]*Math.pow(priceMult,number);
	};
	for (var i in tierOneObject) {
		if (tierOneObject.hasOwnProperty(i)) {
			updatePriceOf(i);
		};
	};
	document.getElementById(buildingSpanIds[buildingToBuy]).innerHTML = round(tierOneObject[buildingToBuy],3);
	document.getElementById("money").innerHTML = round(resourceObject.money,3);
};

function buyUpgrades(number, type) {
	var upgradeToBuy = ""; //declare upgrade variable
	var price = 0; //declare acting price
	var priceMult = 0; //declare acting price multiplier
	var totalCost = 0; //declare temporary total cost
	switch (type) { //choose upgrade based on type
		case 'dogs':
			upgradeToBuy = "dogs"; //set temporary variables
			price = initUpgradePriceObject[upgradeToBuy];
			priceMult = upgradePriceMultObject[upgradeToBuy];
			break;
		case 'stakebots':
			upgradeToBuy = "stakebots";
			price = initUpgradePriceObject[upgradeToBuy];
			priceMult = upgradePriceMultObject[upgradeToBuy];
			break;
		case 'minecrafters':
			upgradeToBuy = "minecrafters";
			price = initUpgradePriceObject[upgradeToBuy];
			priceMult = upgradePriceMultObject[upgradeToBuy];
			break;
		case 'labkits':
			upgradeToBuy = "labkits";
			price = initUpgradePriceObject[upgradeToBuy];
			priceMult = upgradePriceMultObject[upgradeToBuy];
			break;
		case 'stands':
			upgradeToBuy = "stands";
			price = initUpgradePriceObject[upgradeToBuy];
			priceMult = upgradePriceMultObject[upgradeToBuy];
			break;
	};
	totalCost = costCalc(price,priceMult,tierOneUpgradeObject[upgradeToBuy],number);
	if (resourceObject.money >= totalCost) {
		resourceObject.money = resourceObject.money - totalCost;
		tierOneUpgradeObject[upgradeToBuy] = tierOneUpgradeObject[upgradeToBuy] + number;
		upgradePriceObject[upgradeToBuy] = upgradePriceObject[upgradeToBuy]*Math.pow(priceMult,number);
		conversionEfficiencyObject[conversionAssociationObject[upgradeToBuy]] = conversionEfficiencyObject[conversionAssociationObject[upgradeToBuy]] + (upgradeStrength * number);
	};
	for (var i in tierOneUpgradeObject) {
		if (tierOneUpgradeObject.hasOwnProperty(i)) {
			updateUpgradePriceOf(i);
		};
	};
	document.getElementById(conversionAssociationObject[conversionAssociationObject[upgradeToBuy]]).innerHTML = conversionEfficiencyObject[conversionAssociationObject[upgradeToBuy]];
	document.getElementById("money").innerHTML = round(resourceObject.money,3);
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
		case "max":
		document.getElementById("buyMode").innerHTML = modeArray[0];
		buyMode = 1;
		break;
	};
	for (var i in tierOneObject) {
		if (tierOneObject.hasOwnProperty(i)) {
			updatePriceOf(i);
		};
	};
	for (var i in tierOneUpgradeObject) {
		if (tierOneUpgradeObject.hasOwnProperty(i)) {
			updateUpgradePriceOf(i);
		};
	};
};

function upgradeMouse() {
	if (resourceObject.money >= clickUpgradePrice) {
		resourceObject.money = resourceObject.money - clickUpgradePrice;
		clickUpgradePrice = clickUpgradePrice * clickMult;
		clickPower = clickPower * 2;
		mouseUpgradeButton.innerHTML = "Double click power ($" + round(clickUpgradePrice,3).toString() + ")";
	};
};

function calculatePsValues() { //n buildings * base rps * confactor - n (next) buildings base rps (next building)
	currentPsObject.stands = resourcePsObject.stands * tierOneObject.stands * conversionEfficiencyObject.uraniumOreToMoney; //no detractor buildings
	currentPsObject.labkits = resourcePsObject.labkits * tierOneObject.labkits * conversionEfficiencyObject.pitchblendeToUraniumOre - resourcePsObject.stands * tierOneObject.stands;
	currentPsObject.minecrafters = resourcePsObject.minecrafters * tierOneObject.minecrafters * conversionEfficiencyObject.stakedLandToPitchblende - resourcePsObject.labkits * tierOneObject.labkits;
	currentPsObject.stakebots = resourcePsObject.stakebots * tierOneObject.stakebots * conversionEfficiencyObject.landToStakedLand - resourcePsObject.minecrafters * tierOneObject.minecrafters;
	currentPsObject.dogs = resourcePsObject.dogs * tierOneObject.dogs * conversionEfficiencyObject.scourFactor - resourcePsObject.stakebots * tierOneObject.stakebots;
	document.getElementById("landps").innerHTML = round(currentPsObject.dogs,3);
	document.getElementById("stakedLandps").innerHTML = round(currentPsObject.stakebots,3);
	document.getElementById("pitchblendeps").innerHTML = round(currentPsObject.minecrafters,3);
	document.getElementById("uraniumOreps").innerHTML = round(currentPsObject.labkits,3);
	document.getElementById("moneyps").innerHTML = round(currentPsObject.stands,3);
};

function calculatePrestige() {
	totalPrestige = Math.pow(totalEarnings / 1000000,0.5);
	document.getElementById("unclaimedPrestige").innerHTML = round(totalPrestige - claimedPrestige,3);
	document.getElementById("claimedPrestige").innerHTML = round(claimedPrestige,3);
};

function updateEfficiencies() {
	document.getElementById("dogEfficiency").innerHTML = round(100 * conversionEfficiencyObject.scourFactor,3);
	document.getElementById("stakebotEfficiency").innerHTML = round(100 * conversionEfficiencyObject.landToStakedLand,3);
	document.getElementById("minecrafterEfficiency").innerHTML = round(100 * conversionEfficiencyObject.stakedLandToPitchblende,3);
	document.getElementById("labkitEfficiency").innerHTML = round(100 * conversionEfficiencyObject.pitchblendeToUraniumOre,3);
	document.getElementById("standEfficiency").innerHTML = round(100 * conversionEfficiencyObject.uraniumOreToMoney,3);
};

function updateMaxBuyableButtonObject() {
	for (var i in maxBuyableButtonObject) {
		if (maxBuyableButtonObject.hasOwnProperty(i)) {
			maxBuyableButtonObject[i] = calcMaxBuyable(initPriceObject[buildingButtons[i]],priceMultObject[buildingButtons[i]],tierOneObject[buildingButtons[i]],resourceObject.money);
		};
	};
};

function updateUpgradeButtons() {
	for (var i in upgradeSpanButtonIds) {
		if (resourceObject.money < upgradePriceObject[i]) {
			upgradeSpanButtonIds[i].disabled = true;
			upgradeSpanButtonIds[i].className = "disabled";
		} else {
			upgradeSpanButtonIds[i].disabled = false;
			upgradeSpanButtonIds[i].className = "button-generic";
		};
	};
	for (var i in buildingSpanIds) {
		if (buildingSpanIds.hasOwnProperty(i)) {
			updateUpgradePriceOf(i);
		};
	};
	if (resourceObject.money < clickUpgradePrice) {
		mouseUpgradeButton.disabled = true;
		mouseUpgradeButton.className = "disabled";
	} else {
		mouseUpgradeButton.disabled = false;
		mouseUpgradeButton.className = "button-generic";
	};
};

function hardReset() {
	var result = confirm("Do you really want to hard reset your game?");
	if (result == true) {
		localStorage.clear();
		location.reload();
	};
};

function claimPrestige() {
	var result = confirm("Are you sure you want to prestige?\nYou will disband your current setup and receive a building base efficiency bonus based on your prestige points.");
	if (result == true) {
		localStorage.clear();
		claimedPrestige = totalPrestige;
		for (var i in conversionEfficiencyObject) {
			if (conversionEfficiencyObject.hasOwnProperty(i)) {
				conversionEfficiencyObject[i] = 0.5 * (1 + claimedPrestige/100);
			};
		};
		upgradeStrength = 0.1 * (1 + claimedPrestige);
		save();
		location.reload();
	};
};

if (localStorage.getItem("gamesave") !== null) {
	gamesave = JSON.parse(localStorage.getItem("gamesave"));
	if (typeof gamesave.ticks !== undefined) ticks = gamesave.ticks;
	if (typeof gamesave.datetime !== undefined) startYear = gamesave.datetime;
	if (typeof gamesave.saveInterval !== undefined) saveInterval = gamesave.saveInterval;
	if (typeof gamesave.tierOneObject !== undefined) tierOneObject = gamesave.tierOneObject;
	if (typeof gamesave.priceObject !== undefined) priceObject = gamesave.priceObject;
	if (typeof gamesave.priceMultObject !== undefined) priceMultObject = gamesave.priceMultObject;
	if (typeof gamesave.resourceObject !== undefined) resourceObject = gamesave.resourceObject;
	if (typeof gamesave.resourcePsObject !== undefined) resourcePsObject = gamesave.resourcePsObject;
	if (typeof gamesave.currentPsObject !== undefined) currentPsObject = gamesave.currentPsObject;
	if (typeof gamesave.conversionEfficiencyObject !== undefined) conversionEfficiencyObject = gamesave.conversionEfficiencyObject;
	if (typeof gamesave.tierOneUpgradeObject !== undefined) tierOneUpgradeObject = gamesave.tierOneUpgradeObject;
	if (typeof gamesave.upgradePriceObject !== undefined) upgradePriceObject = gamesave.upgradePriceObject;
	if (typeof gamesave.upgradePriceMultObject !== undefined) upgradePriceMultObject = gamesave.upgradePriceMultObject;
	if (typeof gamesave.clickPower !== undefined) clickPower = gamesave.clickPower;
	if (typeof gamesave.clickUpgradePrice !== undefined) clickUpgradePrice = gamesave.clickUpgradePrice;
	if (typeof gamesave.clickMult !== undefined) clickMult = gamesave.clickMult;
	if (typeof gamesave.totalEarnings !== undefined) totalEarnings = gamesave.totalEarnings;
	if (typeof gamesave.totalLandScoured !== undefined) totalLandScoured = gamesave.totalLandScoured;
	if (typeof gamesave.totalLandStaked !== undefined) totalLandStaked = gamesave.totalLandStaked;
	if (typeof gamesave.totalPitchblendeMined !== undefined) totalPitchblendeMined = gamesave.totalPitchblendeMined;
	if (typeof gamesave.totalOreProcessed !== undefined) totalOreProcessed = gamesave.totalOreProcessed;
	if (typeof gamesave.totalPrestige !== undefined) totalPrestige = gamesave.totalPrestige;
	if (typeof gamesave.claimedPrestige !== undefined) claimedPrestige = gamesave.claimedPrestige;
	if (typeof gamesave.upgradeStrength !== undefined) upgradeStrength = gamesave.upgradeStrength;
	if (typeof gamesave.cheevos !== undefined) cheevos = gamesave.cheevos;
	for (var i in tierOneObject) {
		if (tierOneObject.hasOwnProperty(i)) {
			document.getElementById(i).innerHTML = tierOneObject[i];
		};
	};
	for (var i in tierOneUpgradeObject) {
		if (tierOneUpgradeObject.hasOwnProperty(i)) {
			document.getElementById(i).innerHTML = tierOneUpgradeObject[i];
		};
	};
	updateEfficiencies();
	updateMaxBuyableButtonObject();
	updateUpgradeButtons();
	mouseUpgradeButton.innerHTML = "Double click power ($" + round(clickUpgradePrice,3).toString() + ")";
};

function loadCheevoTable() {
	var table = document.getElementById("achievementTable");
	for (var i in cheevos) {
		if (cheevos.hasOwnProperty(i) && i !== "achieved") {
			var row = table.insertRow(-1);
			var cell0 = row.insertCell(0);
			cell0.innerHTML = cheevos[i].name;
			cell0.className = "cheevo";
		};
	};
};

function checkCheevos() {
	for (var i in cheevos) {
		if (cheevos.hasOwnProperty(i)) {
			switch (cheevos[i].type) {
				case "resource":
					for (var j in cheevos[i].detect) {
						if (cheevos[i].detect.hasOwnProperty(j)) {
							if (resourceObject[j] >= cheevos[i].detect[j] && cheevos[i].unlocked == false) {
								cheevos[i].unlocked = true;
								cheevos.achieved++;
								alert(cheevos[i].unlockMessage);
							};
						};
					};
				break;
				case "building":
					for (var j in cheevos[i].detect) {
						if (cheevos[i].detect.hasOwnProperty(j)) {
							if (tierOneObject[j] >= cheevos[i].detect[j] && cheevos[i].unlocked == false) {
								cheevos[i].unlocked = true;
								cheevos.achieved++;
								alert(cheevos[i].unlockMessage);
							};
						};
					};
				break;
				default:
			};
			var table = document.getElementById("achievementTable");
			if (cheevos[i].unlocked == true) {
				k = 0;
				while (k <= table.rows.length - 1) {
					if (table.rows[k].cells[0].innerHTML == cheevos[i].name) {
						table.rows[k].cells[0].style.backgroundColor = "green";
						table.rows[k].cells[0].style.color = "white";
						k++;
					} else {
						k++;
					};
				};
			};
		};
	};
	document.getElementById("achievementsEarned").innerHTML = cheevos.achieved;
};

function save() {
	gamesave.ticks = ticks;
	gamesave.datetime = datetime;
	gamesave.saveInterval = saveInterval;
	gamesave.tierOneObject = tierOneObject;
	gamesave.priceObject = priceObject;
	gamesave.priceMultObject = priceMultObject;
	gamesave.resourceObject = resourceObject;
	gamesave.resourcePsObject = resourcePsObject;
	gamesave.currentPsObject = currentPsObject;
	gamesave.conversionEfficiencyObject = conversionEfficiencyObject;
	gamesave.tierOneUpgradeObject = tierOneUpgradeObject;
	gamesave.upgradePriceObject = upgradePriceObject;
	gamesave.upgradePriceMultObject = upgradePriceMultObject;
	gamesave.clickPower = clickPower;
	gamesave.clickUpgradePrice = clickUpgradePrice;
	gamesave.clickMult = clickMult;
	gamesave.totalEarnings = totalEarnings;
	gamesave.totalLandScoured = totalLandScoured;
	gamesave.totalLandStaked = totalLandStaked;
	gamesave.totalPitchblendeMined = totalPitchblendeMined;
	gamesave.totalOreProcessed = totalOreProcessed;
	gamesave.totalPrestige = totalPrestige;
	gamesave.claimedPrestige = claimedPrestige;
	gamesave.upgradeStrength = upgradeStrength;
	gamesave.cheevos = cheevos;
	localStorage.setItem("gamesave",JSON.stringify(gamesave));
	document.getElementById("lastSave").innerHTML = datetime;
};

window.setInterval(function() { //update window 20 times per second
	clocktick();
	if (ticks % 20 == 0) {
		datetime.setMilliseconds(1000);
		document.getElementById("datetime").innerHTML = datetime;
		document.getElementById("saveInterval").innerHTML = saveInterval;
		scourLandscape(tierOneObject.dogs,'dogs');
		stakeLand(tierOneObject.stakebots,'stakebots');
		mineStakes(tierOneObject.minecrafters,'minecrafters');
		refinePitch(tierOneObject.labkits,'labkits');
		sellUranium(tierOneObject.stands,'stands');
	};
	if (sessionTicks % (20 * saveInterval) == 0) {
		save();
	};
	updateMaxBuyableButtonObject();
	calculatePsValues();
	updateEfficiencies();
	updateUpgradeButtons();
	calculatePrestige();
	checkCheevos();
	document.getElementById("clickPower").innerHTML = clickPower;
	for (var i in tierOneObject) {
		if (tierOneObject.hasOwnProperty(i)) {
			updatePriceOf(i);
			document.getElementById(i).innerHTML = tierOneObject[i];
		};
	};
	for (var j in buildingButtons) {
		if (buildingButtons.hasOwnProperty(j)) {
			switch (buyMode) {
				case 1:
				document.getElementById(j).innerHTML = "Buy " + buyMode.toString() + " " + singularButtonNames[j];
				break;
				case "max":
				switch (maxBuyableButtonObject[j.toString()]) {
					case 1:
					document.getElementById(j).innerHTML = "Buy " + maxBuyableButtonObject[j].toString() + " " + singularButtonNames[j];
					break;
					default:
					document.getElementById(j).innerHTML = "Buy " + maxBuyableButtonObject[j].toString() + " " + buildingButtons[j];
					break;
					};
				break;
				default:
				document.getElementById(j).innerHTML = "Buy " + buyMode.toString() + " " + buildingButtons[j];
			};
			if (document.getElementById(buildingSpanPriceIds[j.slice(0,-6).toString() + 's']).innerHTML > resourceObject.money) {
				buttonObject[j.toString()].disabled = true;
				buttonObject[j.toString()].className = "disabled";
			} else {
				buttonObject[j.toString()].disabled = false;
				buttonObject[j.toString()].className = "button-generic";
			};
		};
	};
}, 50);