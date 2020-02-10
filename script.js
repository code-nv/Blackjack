app = {}
app.cards = [];
app.p1 = [];
app.p2 = [];
app.p1Hand = [];
app.p2Hand = [];
app.cardOne = '';
app.cardTwo = '';
app.hitCard = [];
app.p1Total = 0;
app.p2Total = 0;
app.p1Clone = [];
app.p2Clone = [];



// p1Hand is recieving array
// p1 is the array for total calc
//p1Populate is array for card represent

// making a clone of initial unpopulated player areas and cards
app.captureInitialState = function(){
    for(let i=0, y=1; i<5; i++, y++){
    app.p1Clone[i] = $(`.p1 .card${y}`).clone();
    app.p2Clone[i] = $(`.p2 .card${y}`).clone();
    }
}

// on next round this gets rid of old html and restores initial state
app.restoreInitialState = function(){
    for(let i=0, y=1; i<5; i++, y++){
        $(`.p1 .card${y}`).replaceWith(app.p1Clone[i]);
        $(`.p2 .card${y}`).replaceWith(app.p2Clone[i]);

        // recloning the empty player areas so I can rinse and repeate
        app.p1Clone[i] = $(`.p1 .card${y}`).clone();
        app.p2Clone[i] = $(`.p2 .card${y}`).clone();
    }
}

app.createDeck = () => {
    app.cards.length = 0;
    for(let i = 2; i<15; i++) {
        // app.cards.push(i+" clubs");
        // app.cards.push(i+" diamonds");
        // app.cards.push(i+" hearts");
        // app.cards.push(i+" spades");

        app.cards.push(i+" ♣️");
        app.cards.push(i+" ♦️");
        app.cards.push(i+" ♥️");
        app.cards.push(i+" ♠️");
    }
}


app.dealCards = () => {
// Hand one
    for (let i = 0; i<2; i++){
        app.cardOne = Math.floor(Math.random() * app.cards.length);
// find card value & push card to hand
        app.p1Hand.push(app.cards[app.cardOne]);
// take card out of the deck
        app.cards.splice(app.cardOne, 1);
    }
// Hand Two
    for (let i = 0; i<2; i++) {
        app.cardOne = Math.floor(Math.random() * app.cards.length);
// find card value & push card to hand
        app.p2Hand.push(app.cards[app.cardOne]);
// take card out of the deck
        app.cards.splice(app.cardOne, 1);
    }
}

app.hideMe = () => {
$('.deal').removeClass('animatingIn').addClass('animatingOut')
    .attr('disabled','true')
    .css({
        'animation-play-state':'running',
        'animation-fill-mode':'forwards',
        'animation-iteration-count': '1' });
    };

app.showMe = () => {
    $('.deal').toggleClass('animatingOut, animatingIn')
    .css('animation-fill-mode','reverse')
    .removeAttr('disabled')
}

app.checkTotal = (player, playerHand, playerTotal) => {
    // parsing card number from raw data by splitting and taking the first value (card format ex [5, clubs])
    app[player].push(app[playerHand][0].split(" "));
    app[player].push(app[playerHand][1].split(" "));
    // logic for face cards (12 = J, 13 = Q, 14 = K but numeric value is 10)
    if (app[player][0][0] > 11) {
        app[player][0][0] = 10;
    } if (app[player][1][0] > 11) {
        app[player][1][0] = 10;
    }
    // adding two cards together
    // parse will ignore the words and only keep the number 🤯🤟🏻
    app[playerTotal] = (parseInt(app[player][0]) + parseInt(app[player][1]));


    // if dealt two aces
        for (let i=0;i<app[player].length;i++){
        if (app[playerTotal] > 21 && app[player][i][0] == 11 ) {
                app[player][i][0] = 1;
                app[playerTotal] -= 10;
        }
        $(`.${player}Score p`).text(app[playerTotal]);
    }

    $(`.${player}Score p`).text(app[playerTotal]);
    // //check for blackjack
    // if (app.p1Total === 21) {
    //     app.winBy21("p1");
    // } else if (app.p2Total == 21) {
    //     app.loseSpecial();
    // }
}

// put data on empty divs to look like playing cards
app.populateCards = function(playerHand, player) {
    // logic to show the face card letter opposed to a number
    $(`.card1, .card2`).css('display','flex');
    for (let i=0;i<2;i++){
        app[playerHand][i].split(" ");
        if (parseInt(app[playerHand][i]) == 11 || app[playerHand][i] == 1) {
            app[playerHand][i] = "A"
        }
        if(parseInt(app[playerHand][i]) == 12) {
            app[playerHand][i] = "J"
        } if (parseInt(app[playerHand][i]) == 13) {
            app[playerHand][i] = "Q"
        } if (parseInt(app[playerHand][i]) == 14) {
            app[playerHand][i] = "K"
        }
    }

    // populate card number and suit 
    $(`.${player} .card1 h3, .${player} .card1 h4`)
        .text(app[playerHand][0].split(" ")[0])
        .addClass(app[player][0][1]);
    // populate middle suit symbol
    $(`.${player} .card1 .cardSuit`).text(app[player][0][1]);
    
    // same thing for card 2
    $(`.${player} .card2 h3, .${player} .card2 h4`)
    .text(app[playerHand][1].split(" ")[0])
    .addClass(app[player][1][1]);

    $(`.${player} .card2 .cardSuit`).text(app[player][1][1]);
    
    // color the diamond and heart cards
    app.colorCards("p1");
    app.colorCards("p2");
    $(`.p2 .card1 h3, .p2 .card1 .cardSuit, .p2 .card1 h4`).css('opacity','0');
    if (app.p1Total == 21 || app.p2Total == 21) {
        app.showHouse();
        setTimeout(function(){
            app.endRound()
        }, 500)
    }
}

app.colorCards = function(player){
    // future proofing for larger hands
    for (let y=0; y<app[player].length; y++){
        if (app[player][y][1] == "♥️" || app[player][y][1] == "♦️" ) {
            $(`.${player} .card${y+1}`).addClass('brightSuit');
        }
    }
}

// logic to hit new cards
app.hit = function(player, playerHand, playerTotal){
    setTimeout(function(){
        // pick a random card
        app.hitCard = Math.floor(Math.random() * app.cards.length);
        // find card value & push card to hand
        app[playerHand].push(app.cards[app.hitCard]);
        // take card out of the deck
        app.cards.splice(app.hitCard, 1);


        // pushing card to the player array to do face card logic 
        let i = (app[playerHand].length - 1);
        app[player].push(app[playerHand][i].split(" "));

        // face card logic for array value
        if (parseInt(app[player][i][0]) > 11) {
            app[player][i][0] = 10;
        }

            // face card display in hand logic
        for (let b=0;b<app[player].length;b++){
            app[playerHand][i].split(" ");
            if (parseInt(app[playerHand][b]) == 11 || app[playerHand][i] == 1) {
                app[playerHand][b] = "A"
            }
            if(parseInt(app[playerHand][b]) == 12) {
                app[playerHand][b] = "J"
            } if (parseInt(app[playerHand][b]) == 13) {
                app[playerHand][b] = "Q"
            } if (parseInt(app[playerHand][b]) == 14) {
                app[playerHand][b] = "K"
            }
        }

        // populateNewCard
        let q = (app[playerHand].length)
        // show card
        $(`.${player} .card${q}`).css('display','flex').addClass('animated');
        // populate card
        $(`.${player} .card${q} h3, .${player} .card${q} h4`)
        .text(app[playerHand][i].split(" ")[0])
        .addClass(app[player][i][1]);

        // populate middle suit symbol
        $(`.${player} .card${q} .cardSuit`).text(app[player][i][1]);

        // color those diamonds and hearts
        app.colorCards(player)
        
        // get new total
        app[playerTotal] += parseInt(app[player][i]);

        // check for bust
        for (let i=0;i<app[player].length;i++){
            // ace logic
            if (app[playerTotal] > 21 && app[player][i][0] == 11 ) {
                    app[player][i][0] = 1;
                    app[playerTotal] -= 10;
            }
            $(`.${player}Score p`).text(app[playerTotal]);
        }
        if (app.p1Total > 21) {
            app.lose();
        } else {
            app.checkWin();
        }
    },200)
}


app.checkWin = function(){
    if (app.p1Total == 21) {
        app.winBy21();
    } else if (app.p2Total == 21) {
        app.loseSpecial();
    }
}

app.showHouse = function(){
    $(`.p2 .card1`).css('background','#FAFAFA').addClass('animated');
    $(`.p2 .card1 h3, .p2 .card1 .cardSuit, .p2 .card1 h4`).css('opacity','1');
    $(`.p2Score p`).css('opacity','1');

}

app.computerHit = function() {
    setTimeout(function(){
        if (app.p2Total < 17 && app.p1Total > app.p2Total ) {
            app.hit("p2", "p2Hand", "p2Total");
        }
    },200);
    setTimeout(function(){
        if  (app.p2Total < 17 && app.p1Total > app.p2Total ) {
            app.hit("p2", "p2Hand", "p2Total");
        }  
    },600);
    setTimeout(function(){
            if  (app.p2Total < 17 && app.p1Total > app.p2Total ) {
        app.hit("p2", "p2Hand", "p2Total");
        }  
    },1000)
    setTimeout(function(){

        app.endRound();
    },1000);
    
}

app.endRound = function(){
    if (app.p1Total === 21) {
        app.winBy21();
    } else if( app.p2Total === 21) {
        app.loseSpecial();
    } else if (app.p2Total > 21) {
        app.winEnd();
    } else if (app.p1Total > app.p2Total) {
        app.winEnd();
    } else if (app.p1Total === app.p2Total){
        app.winTie();
    } else {
        app.lose();
    }
}

app.nextRound = function(){
    $('.winScreen').css('display','none')
    if (app.cards.length < 16) {
        app.createDeck();
    }
    app.p1.length = 0;
    app.p2.length = 0;
    app.p1Hand.length = 0;
    app.p2Hand.length = 0;
    app.p1Total = 0;
    app.p2Total = 0;
}

// ===================== //
//  win state  functions //
// ===================== //
$win = $(`.winScreen`);

app.winScreen = function(){
$win.css('display','block');
$win.children('h2').text('Winner! Ganier!');

}

app.winBy21 = function() {
    app.winScreen();
    $win.children('h2').text(`BLACKJACK!!`);
    $win.children('p').text(`Congrats! You get the big bucks$$$`);
}

app.winEnd = function(){
    app.winScreen();
    $win.children('p').text('YOU DID IT HELL YEAH');
}

app.winTie = function(){
    app.winScreen();
    $win.children('p').text(`lucky for you, ties don't go to the house!`);
}

app.lose = function(){
    app.winScreen();
    $win.children('h2').text('wasted');
    $win.children('p').text('you fuckin lost bro');
}

app.loseSpecial = function(){
    app.winScreen();
    $win.children('h2').text('wasted');
    $win.children('p').text(`house got 21, that's just bad luck`);
}


app.init = function(){

    // was having weird resizing issues with vh units on firefox
    $(window).on('resize',function(){
        let heightFix = $(window).height(); 
        $('.wrapper').css('height', `${heightFix}`)
        });

    app.captureInitialState();
    app.createDeck();

    $('.rulesButton, .letsPlay, .closeRules').on('click',function(){
        $('.rulesModal').toggleClass('show, hide');
    })

    $(`.deal`).on('click',function(e){
    e.preventDefault();
    app.dealCards();
    app.hideMe();
    app.checkTotal("p1", "p1Hand", "p1Total");
    app.checkTotal("p2", "p2Hand", "p2Total");
    app.populateCards("p1Hand", "p1");
    app.populateCards("p2Hand", "p2");
    // console.log(app.p1Hand, app.p1Total, app.p2Hand, app.p2Total);
    });

    $(`.hit`).on('click',function(e){
    e.preventDefault();
    app.hit("p1", "p1Hand", "p1Total");
    });
    
    $(`.stay`).on('click',function(e){
    e.preventDefault();
    app.showHouse();
    app.computerHit();
    });
    // disable the hit button once player has chosen to stay, remember to re-enable this on new round
    
    $('.playAgain').on('click',function(e){
        e.preventDefault();
        app.nextRound();
        app.showMe();
        app.restoreInitialState();
    });

    $('.dark').on('click', () => {
        $(':root').css({
        "--primary": "red"});
    });
};

$(function() {
app.init();
});