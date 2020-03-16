app = {};
app.cards = [];
app.p1 = [];
app.p2 = [];
app.p1Hand = [];
app.p2Hand = [];
app.cardOne = "";
app.hitCard = [];
app.p1Total = 0;
app.p2Total = 0;
app.p1Clone = [];
app.p2Clone = [];
app.p1ScoreClone;
app.p2ScoreClone;

app.card = {};

// betting caching / setting up
app.current = 500;
app.pool = 0;
app.winner = true;
const $myMoney = $(".earnings");
const $bettingPool = $(".bettingPool");
const $hitButton = $(".hit");
const $stayButton = $(".stay");
const $betButton = $(".bet");

// making a clone of initial unpopulated player areas and cards
app.captureInitialState = function() {
	for (let i = 0, y = 1; i < 5; i++, y++) {
		app.p1Clone[i] = $(`.p1 .card${y}`).clone();
		app.p2Clone[i] = $(`.p2 .card${y}`).clone();
	}
	app.p1ScoreClone = $(`.p1Score p`).clone();
	app.p2ScoreClone = $(`.p2Score p`).clone();
};

// on next round this gets rid of old html and restores initial state
app.restoreInitialState = function() {
	for (let i = 0, y = 1; i < 6; i++, y++) {
		$(`.p1 .card${y}`).replaceWith(app.p1Clone[i]);
		$(`.p2 .card${y}`).replaceWith(app.p2Clone[i]);
		// re-cloning the empty player areas so I can rinse and repeat
		app.p1Clone[i] = $(`.p1 .card${y}`).clone();
		app.p2Clone[i] = $(`.p2 .card${y}`).clone();
	}
	$(`.p1Score p`).replaceWith(app.p1ScoreClone);
	$(`.p2Score p`).replaceWith(app.p2ScoreClone);

	app.p1ScoreClone = $(`.p1Score p`).clone();
	app.p2ScoreClone = $(`.p2Score p`).clone();
};

app.createDeck = () => {
	app.cards.length = 0;
	for (let i = 2; i < 15; i++) {
		app.cards.push({
			number: i,
			value: i,
			suit: "♣️"
		});
		app.cards.push({
			number: i,
			value: i,
			suit: "♦️"
		});
		app.cards.push({
			number: i,
			value: i,
			suit: "♥️"
		});
		app.cards.push({
			number: i,
			value: i,
			suit: "♠️"
		});
	}
	for (let i = 0; i < app.cards.length; i++) {
		if (app.cards[i].number == 11) {
			app.cards[i].number = "A";
		}
		if (i > 39) {
			app.cards[i].value = 10;
		}
		if (app.cards[i].number == 12) {
			app.cards[i].number = "J";
		} else if (app.cards[i].number == 13) {
			app.cards[i].number = "Q";
		} else if (app.cards[i].number == 14) {
			app.cards[i].number = "K";
		}
	}
};

app.dealCards = () => {
	// Hand one
	for (let i = 0; i < 2; i++) {
		app.cardOne = Math.floor(Math.random() * app.cards.length);
		// find card value & push card to hand
		app.p1Hand.push(app.cards[app.cardOne]);
		// take card out of the deck
		app.cards.splice(app.cardOne, 1);
	}
	// Hand Two
	for (let i = 0; i < 2; i++) {
		app.cardOne = Math.floor(Math.random() * app.cards.length);
		// find card value & push card to hand
		app.p2Hand.push(app.cards[app.cardOne]);
		// take card out of the deck
		app.cards.splice(app.cardOne, 1);
	}
};
// hides deal button
app.hideMe = () => {
	$(".deal")
		.removeClass("animatingIn")
		.addClass("animatingOut")
		.attr("disabled", "true")
		.css({
			"animation-play-state": "running",
			"animation-fill-mode": "forwards",
			"animation-iteration-count": "1"
		});
};
// reveals deal button
app.showMe = () => {
	$(".deal")
		.toggleClass("animatingOut, animatingIn")
		.css("animation-fill-mode", "reverse")
		.removeAttr("disabled");
};

app.checkTotal = (playerTotal, playerHand, player) => {
	// adding two cards together
	app[playerTotal] = app[playerHand][0].value + app[playerHand][1].value;

	// if dealt two aces
	for (let i = 0; i < app[player].length; i++) {
		if (app[playerTotal] > 21 && app[player][i].value == 11) {
			app[player][i].value = 1;
			app[playerTotal] = app.p1Hand[0].value + app.p1Hand[1].value;
		}
		$(`.${player}Score p`).text(app[playerTotal]);
	}
	// if not dealt aces proceed as normal
	$(`.${player}Score p`).text(app[playerTotal]);
};

// put data on empty divs to look like playing cards
app.populateCards = function(player, playerHand, hand = "") {
	// additional logic for split hand deal animation
	$(`.card1, .card2`)
		.css("display", "none")
		.removeClass("animated");
	// logic to show the face card letter opposed to a number
	$(".card2")
		.css("display", "none")
		.removeClass("animated");

	// populate card number and suit
	setTimeout(function() {
		$(`.card1`)
			.css("display", "flex")
			.addClass("animated");
		$(`.${player} ${hand} .card1 h3, .${player} ${hand} .card1 h4`)
			.text(app[playerHand][0].number)
			.addClass(app[playerHand][0].suit);
		// populate middle suit symbol
		$(`.${player} ${hand} .card1 .cardSuit`).text(app[playerHand][0].suit);
	}, 100);

	// same thing for card 2
	setTimeout(function() {
		$(`.card2`)
			.css("display", "flex")
			.addClass("animated");
		$(`.${player} ${hand} .card2 h3, .${player} ${hand} .card2 h4`)
			.text(app[playerHand][1].number)
			.addClass(app[playerHand][1].suit);

		$(`.${player} ${hand} .card2 .cardSuit`).text(app[playerHand][1].suit);
	}, 400);

	// color the diamond and heart cards
	app.colorCards("p1Hand", "p1");
	app.colorCards("p2Hand", "p2");
	$(`.p2 .card1 h3, .p2 .card1 .cardSuit, .p2 .card1 h4`).css("opacity", "0");
	if (app.p1Total == 21) {
		app.showHouse();
		setTimeout(function() {
			app.endRound();
		}, 500);
	}
};

app.colorCards = function(playerHand, player) {
	// future proofing for larger hands
	for (let y = 0; y < app[playerHand].length; y++) {
		if (app[playerHand][y].suit == "♥️" || app[playerHand][y].suit == "♦️") {
			$(`.${player} .card${y + 1}`).addClass("brightSuit");
		}
	}
};

app.doubleDown = function() {
	if (app.current >= app.pool) {
		$(".doubleDown").removeAttr("disabled");
	}
};

// logic to hit new cards
app.hit = function(playerHand, player, hand, playerTotal) {
	$(".doubleDown").attr("disabled", "true");
	setTimeout(function() {
		// pick a random card
		app.hitCard = Math.floor(Math.random() * app.cards.length);
		// find card value & push card to hand
		app[playerHand].push(app.cards[app.hitCard]);
		// take card out of the deck
		app.cards.splice(app.hitCard, 1);

		// populateNewCard
		let i = app[playerHand].length;
		// show card
		$(`.${player} ${hand} .card${i}`)
			.css("display", "flex")
			.addClass("animated");
		// populate card
		$(`.${player} ${hand} .card${i} h3, .${player} ${hand} .card${i} h4`)
			.text(app[playerHand][i - 1].number)
			.addClass(app[playerHand][i - 1].suit);

		// populate middle suit symbol
		$(`.${player} ${hand} .card${i} .cardSuit`).text(app[playerHand][i - 1].suit);

		// color those diamonds and hearts
		app.colorCards(playerHand, player);

		// get new total
		app[playerTotal] += app[playerHand][i - 1].value;

		// check for bust
		for (let b = 0; b < app[playerHand].length; b++) {
			// ace logic
			if (app[playerTotal] > 21 && app[playerHand][b].value == 11) {
				app[playerHand][b].value = 1;
				app[playerTotal] -= 10;
			}
			if (hand == ".hand0") {
				$(`.p0Score p`).text(app[playerTotal]);
			} else {
				$(`.${player}Score p`).text(app[playerTotal]);
			}
		}
		if (app.p1Total > 21) {
			app.freezePlayer();
			app.endRound();
		} else {
			app.checkWin();
		}
	}, 200);
};

// checking for 21 on each hit
app.checkWin = function() {
	if (app.p1Total == 21 || app.p2Total == 21) {
		app.freezePlayer();
		app.endRound();
	}
};

// stop player from hitting / staying outside of their turn
app.unfreezePlayer = () => {
	$hitButton.removeAttr("disabled");
	$stayButton.removeAttr("disabled");
	$betButton.attr("disabled", "true");
};

app.freezePlayer = () => {
	$hitButton.attr("disabled", "true");
	$stayButton.attr("disabled", "true");
};

// reveal houses' facedown card
app.showHouse = function() {
	$(`.p2 .card1`)
		.css("background", "#FAFAFA")
		.addClass("animated");
	$(`.p2 .card1 h3, .p2 .card1 .cardSuit, .p2 .card1 h4`).css("opacity", "1");
	$(`.p2Score p`).css("opacity", "1");
};

app.computerHit = function() {
	let i = 300;
	if (app.p2Total < 17) {
		app.hit("p2Hand", "p2", "", "p2Total");
	}
	i += 700;
	setTimeout(function() {
		if (app.p2Total < 17) {
			app.computerHit();
		} else {
			setTimeout(function() {
				app.endRound();
			}, 500);
		}
	}, i);
};

app.endRound = function() {
	app.winnerObj = [
		{
			hand1: true,
			winner: true,
			type: "",
			total: app.p1Total,
			payout: 0
		},
		{
			hand0: true,
			winner: false,
			type: "",
			total: app.p0Total,
			payout: 0
		}
	];

	app.checkOutcome(app.winnerObj[0]);
	if (app.winnerObj[1].total > 0) {
		console.log("still", app.winnerObj[1].total);
		app.checkOutcome(app.winnerObj[1]);
	}
	app.winLogic();
};

app.checkOutcome = function(hand) {
	hand.winner = true;
	app.freezePlayer();
	if (hand.total === 21) {
		hand.type = "blackjack";
		hand.payout = 3;
	} else if (app.p2Total === 21) {
		hand.winner = false;
		hand.type = "blackjack";
		hand.payout = 0;
	} else if (app.p2Total > 21) {
		hand.type = "normal";
		hand.payout = 2;
	} else if (hand.total > 21) {
		hand.winner = false;
		hand.type = "normal";
		hand.payout = 0;
	} else if (hand.total > app.p2Total) {
		hand.type = "normal";
		hand.payout = 2;
	} else if (hand.total === app.p2Total && hand.total > 0) {
		hand.type = "tie";
		hand.payout = 1;
	} else if (hand.total > 0) {
		hand.winner = false;
		hand.type = "normal";
		hand.payout = 0;
	}
};

const $win = $(`.winScreen`);

app.winScreen = function() {
	$win.css("display", "block");
};

app.winLogic = function() {
	if (app.winnerObj[1].total > 0) {
		const hand1 = app.winnerObj[1];
		const hand2 = app.winnerObj[0];
		const message1 =
			hand1.type == "tie" ? "Hand 1: Tie!" : hand1.winner === true ? "Hand 1: Winner!" : "Hand 1: Loser!";
		const message2 =
			hand2.type == "tie" ? "Hand 2: Tie!" : hand2.winner === true ? "Hand 2: Winner!" : "Hand 2: Loser!";
		app.winScreen();
		$win.prepend(`<h3>${message1}</h3> <h3>${message2}</h3>`);
		$win.children("h2, p").empty();
	} else {
		const { winner, type } = app.winnerObj[0];
		console.log(winner, type);
		app.winScreen();
		$win.children("h2").text(winner == true ? "winner!" : "you lost");
		if (winner == true) {
			$win
				.children("p")
				.text(type == "normal" ? "Congratulations, enjoy your winnings!" : "You got black jack! Enjoy the big bucks!");
		} else if (type == "tie") {
			$win.children("h2").text("You tied!");
			$win.children("p").text(`No one wins, but at least you get your bet back!`);
		} else {
			$win.children("p").text("too bad 💀");
		}
	}

	app.payOutLogic();
};

app.nextRound = function() {
	$(".winScreen").css("display", "none");
	if (app.cards.length < 16) {
		app.createDeck();
	}

	if (app.current < 50) {
		app.moreMoney();
	}
	app.p1.length = 0;
	app.p2.length = 0;
	app.p0Hand.length = 0;
	app.p1Hand.length = 0;
	app.p2Hand.length = 0;
	app.p0Total = 0;
	app.p1Total = 0;
	app.p2Total = 0;
	$betButton.removeAttr("disabled");
	$(".doubleDown").attr("disabled", "true");
	$(".earnings").toggleClass("attention attention2");
	if ($(".p1").hasClass("split") === true) {
		$(".p1").removeClass("split");
		$(".p0Score")
			.removeClass("score0")
			.css("display", "none");
		$(".p1Score").removeClass("score1");
		$(".hand0").empty();
		$(".hand0").css({ height: "0", width: "0", "margin-bottom": "0" });
		$(".hand1").css({ height: "100%", width: "calc(100% - 20px)" });
		$(".winScreen h3").remove();
	}
};

app.moreMoney = function() {
	app.winScreen();
	$win.children("h2").text("Uh Oh!");
	$win
		.css("display", "block")
		.children("p")
		.text("You can't afford the minimum bet, that's rough! Let's try again, here's $500");
	$win
		.children("button")
		.removeClass("playAgain")
		.addClass("getMoney");

	$(".getMoney").on("click", function() {
		$win.css("display", "none");
		$(".getMoney")
			.removeClass("getMoney")
			.addClass("playAgain");
	});
	if (app.current < 1) {
		app.current = 500;
		$myMoney.text("Wallet: $" + app.current);
		$(".bet").text("Bet $50");
	}
	app.showMe();
};

// ======= //
// BETTING //
// ======= //
app.betLogic = function() {
	app.current -= 50;
	app.pool += 50;
	$myMoney.text("Wallet: $" + app.current);
	$bettingPool.text("Current Bet $" + app.pool);
	if (app.current <= 25) {
		$betButton.attr("disabled", "true");
	}
};

app.payOutLogic = function() {
	if (app.winnerObj[0].winner == true) {
		app.current += app.pool * app.winnerObj[0].payout;
	}
	if (app.winnerObj[1].winner == true) {
		app.current += app.pool * app.winnerObj[0].payout;
	}
	app.pool = 0;
	$myMoney.text("Wallet: $" + app.current);
	$(".bettingPool").text("Current Bet $0");
};

// ======== //
// SHOPPING //
// ======== //
$(`.shop`).on("click", function() {
	// show the shop
	$(".shopWindow").css("display", "block");
	// grab the table values and manipulate them to get prices
	const shopItems = $(".table")
		.text()
		.split("$")
		.filter(item => {
			// ignoring 'switch' because that's the value of a purchased table
			return item !== "Switch";
		});
	// assess if I have enough to afford the tables
	function checkPrice() {
		shopItems.forEach(item => {
			if (app.current < item) {
				$(`.${item}`).attr("disabled", true);
			} else if ($(".shopWindow button").hasClass(item)) {
				$(`.${item}`).removeAttr("disabled");
			}
			// logic to purchase a table
			$(`.${item}`).on("click", function() {
				// if its free don't charge me!
				if ($(this).hasClass("free")) {
					app.current = app.current;
				} else {
					// take the cost out of my wallet!
					app.current -= item;
					$(`.${item}`)
						.text("Switch")
						.removeClass(item)
						.addClass("free");
					$(".earnings").text("Wallet: $" + app.current);
					// disable bet button if I can't afford it
					if (app.current <= 50) {
						$betButton.attr("disabled", "true");
					}
					// run the function again to disable the tables I can't afford now
					checkPrice();
				}
			});
		});
	}
	checkPrice();
});

// =================== //
// table color palettes //
// =================== //
$(".closeShop").on("click", function() {
	$(".shopWindow").css("display", "none");
});

$(".changeTable1").on("click", function() {
	$(":root").css({
		"--primary": "#446455",
		"--primaryLight": "#adc7bb",
		"--primaryDark10": "#2f463b",
		"--primaryDark20": "#1b2721",
		"--background": "#212a29",
		"--tertiary": "#6c5021",
		"--tertiaryDark": "#291e0c"
	});
});

$(".changeTable2").on("click", function() {
	$(":root").css({
		"--primary": "#A1454A",
		"--primaryLight": "#ca8286",
		"--primaryDark10": "#5a2629",
		"--primaryDark20": "#361719",
		"--background": "#2d2827",
		"--tertiary": "#6c5021",
		"--tertiaryDark": "#291e0c"
	});
});

$(".changeTable3").on("click", function() {
	$(":root").css({
		"--primary": "#5c415d",
		"--primaryLight": "#ac8aad",
		"--primaryDark10": "#3e2c3f",
		"--primaryDark20": "#211721",
		"--background": "#332e33",
		"--tertiary": "#6c5021",
		"--tertiaryDark": "#291e0c"
	});
});

$(".changeTable4").on("click", function() {
	$(":root").css({
		"--primary": "#292f36",
		"--primaryLight": "#dee2e6",
		"--primaryDark10": "#131619",
		"--primaryDark20": "#000000",
		"--background": "#232323",
		"--tertiary": "#fdd262",
		"--tertiaryDark": "#f0b92e"
	});
});

// ========================================= //
//  IINNNNNIIIITTTTTTIIAALLLIIIZEEEE IIIITTT //
// ========================================= //
app.init = function() {
	app.captureInitialState();
	app.createDeck();

	$(".rulesButton, .letsPlay, .closeRules").on("click", function() {
		$(".rulesModal").toggleClass("show, hide");
	});

	$(".bet").on("click", function() {
		app.betLogic();
	});

	$(`.deal`).on("click", function(e) {
		e.preventDefault();
		app.dealCards();
		app.hideMe();
		app.unfreezePlayer();
		app.checkTotal("p1Total", "p1Hand", "p1");
		app.checkTotal("p2Total", "p2Hand", "p2");
		app.populateCards("p1", "p1Hand");
		app.populateCards("p2", "p2Hand");
		app.doubleDown();
	});

	$(`.hit`).on("click", function(e) {
		e.preventDefault();

		if ($(this).hasClass("splitHand0")) {
			app.hit("p0Hand", "p1", ".hand0", "p0Total");
		} else {
			app.hit("p1Hand", "p1", ".hand1", "p1Total");
		}
	});

	$(`.stay`).on("click", function(e) {
		if ($(".hit").hasClass("splitHand0")) {
			$(".hit")
				.toggleClass("splitHand0 splitHand1")
				.text("Hand 2");
		} else if ($(".hit").hasClass("splitHand1")) {
			$(".hit")
				.removeClass("splitHand1")
				.text("Hit");
			e.preventDefault();
			app.freezePlayer();
			app.showHouse();
			app.computerHit();
		} else {
			e.preventDefault();
			app.freezePlayer();
			app.showHouse();
			app.computerHit();
		}
	});

	$(".doubleDown").on("click", function() {
		app.current -= app.pool;
		app.pool += app.pool;
		$(".bettingPool").text("Current Bet $" + app.pool);
		$("earnings").text("Wallet: $" + app.current);
		app.hit("p1Hand", "p1", "p1Total");
		$(".doubleDown").attr("disabled", "true");
		app.freezePlayer();
		setTimeout(function() {
			app.showHouse();
			app.computerHit();
		}, 1500);
	});

	$(`.splitHand`).on("click", function() {
		checkSplit();
	});

	$(".winScreen").on("click", ".playAgain", function(e) {
		e.preventDefault();
		app.nextRound();
		app.showMe();
		app.restoreInitialState();
	});
};

$(function() {
	app.init();
});

app.p0Hand = [];
app.p0Total;
let splitMod = [];
const hand1a = $(`.hand1`)
	.clone()
	.removeClass("hand1");

const checkSplit = function() {
	$(".card1, .card2").removeClass("animated");
	$(".p1").addClass("split");
	app.p0Hand.push(app.p1Hand[0]);
	$(".p0Score")
		.addClass("score0")
		.css("display", "block");
	$(".p1Score").addClass("score1");

	// prepend the split hand
	$(`.hand0`).append(hand1a);
	$(".hand0").css({ height: "40%", width: "calc(100% - 20px)", "margin-bottom": "20px" });
	$(".hand1").css({ height: "40%", width: "calc(100% - 20px)" });
	// take the first card out of the second hand's data
	app.p1Hand.shift();
	// make hit button for only hand 1
	$(".hit").addClass("splitHand0");

	// draw second card for each hand
	app.cardOne = Math.floor(Math.random() * app.cards.length);
	app.p0Hand.push(app.cards[app.cardOne]);
	app.cards.splice(app.cardOne, 1);
	app.cardTwo = Math.floor(Math.random() * app.cards.length);
	app.p1Hand.push(app.cards[app.cardTwo]);
	app.cards.splice(app.cardTwo, 1);
	app.populateCards("p1", "p0Hand", ".hand0");
	app.populateCards("p1", "p1Hand", ".hand1");
	app.checkTotal("p0Total", "p0Hand", "p1");
	app.checkTotal("p1Total", "p1Hand", "p1");
	$(".p0Score p").text(app.p0Total);
};

const splitHand = function() {
	$(".p1").append(app.p1Clone[1]);
};
