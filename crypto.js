// TODO: Implement multiple texts and navigation for them

var letters;
var plaintext = "Secret Message: When I wake up, the other side of the bed is cold. My \
fingers stretch out, seeking Prim's warmth but finding \
only the rough canvas cover of the mattress. She must \
have had bad dreams and climbed in with our mother. Of \
course, she did. This is the day of the reaping. \
I prop myself up on one elbow. There's enough light in \
the bedroom to see them. My little sister, Prim, curled up \
on her side, cocooned in my mother's body, their cheeks \
pressed together. In sleep, my mother looks younger, \
still worn but not so beaten-down. Prim's face is as fresh \
as a raindrop, as lovely as the primrose for which she \
was named. My mother was very beautiful once, too. Or \
so they tell me."

plaintext = plaintext.replace(/[<>&/%\\#]/g,".").toUpperCase();

map = { };
rMap = { };

function swapCommand() {
    var buf = $("#commandLine").val().replace(/[^A-Za-z]/g,"").toUpperCase();
    if(buf.length != 2) {
	alert("Please enter exactly 2 letters");
	return;
    }

    if(!swap(buf.charAt(0), buf.charAt(1))) {
	return;
    }

    update();
}

function lockCommand() {
    var buf = $("#commandLine").val().replace(/[^A-Za-z]/g,"").toUpperCase();
    if(buf.length < 1) {
	alert("Please enter at least one letter");
	return;
    }
    
    for (var i=0; i<buf.length; i++) {
	var letter = letters[rMap[buf.charAt(i)]];
	letter.locked = letter.locked ? false : true;
    }
    
    update();
}

/*
 * Fisher-Yates shuffle adapted from http://bost.ocks.org/mike/shuffle/
 */
function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter--) {
        // Pick a random index
        index = (Math.random() * counter) | 0;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function generateKey() {
    var orig  = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", 
		 "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", 
		 "U", "V", "W", "X", "Y", "Z"];
    var trans = orig.slice(0);
    shuffle(trans);

    letters = new Array();
    for(i = 0 ; i < 26 ; i++) {
	letters.push(new Object());
	letters[i].trans = trans[i];
 	letters[i].freq = 0;
 	letters[i].lock = false;

	map[orig[i]] = i;
	rMap[trans[i]] = i;
    }
}

function swap(a, b) {
    var ra = letters[rMap[a]], rb = letters[rMap[b]];

    if (ra.locked || rb.locked) {
	alert("Locked letters may not be swapped");
	return false;
    }

    var ch = ra.trans;
    ra.trans = rb.trans;
    rb.trans = ch;

    ch = rMap[a];
    rMap[a] = rMap[b];
    rMap[b] = ch;
    return true;
}

function bestGuess() {
    // Letters sorted in the order they most commonly appear in English
    var order = "ETAOINSHRDLUCMWFYGPBVKXJQZ"

    // Just give the 8 most common letters as the best guess
    for(var j=0; j<8; j++) {
	var current = $("#display").text();

	for(var i = 0; i < current.length; i++) {
	    if (current.charAt(i) in map)
		letters[rMap[current.charAt(i)]].freq++
	}

	var temp = letters.slice(0);
	temp.sort( function(a, b){ return b.freq-a.freq; });

	swap(temp[j].trans, order.charAt(j));

	for(var i = 0 ; i < 26 ; i++) {
	    letters[i].lock = false;
	    letters[i].freq = 0;
	}

	update();
    }
}

function update() {
    $("#commandLine").val("");
    $("#commandLine").focus();

    display();
}

function display() {
    var output = "";
    var c = null;
    var locked = "red", unlocked = "black";

    for (var i=0; i<plaintext.length; i++) {
	c = plaintext.charAt(i);
	if (c in map) {
	    var letter = letters[map[c]];
	    output += letter.locked ? letter.trans.fontcolor(locked) : letter.trans.fontcolor(unlocked);
	} else {
	    output += c;
	}
    }

    $("#display").html(output);
}

$(document).ready(function() {
    $("#commandLine").keydown(function(event) {
	var returnKey = 13;
    	if(event.keyCode == returnKey) { 
	    $("#swapButton").click();
    	}
    });

    $(".ciphertext-link").on("click", function() {
	plaintext = $("#"+$(this).data("text")).text();
	plaintext = plaintext.replace(/[<>&/%\\#]/g,".").toUpperCase();

	generateKey();
	$("#display").css({"display": "none"});
	update();
	$("#display").slideDown("slow");

    });

    // generateKey();
    // update();
});