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

app.createDeck = () => {
    for(let i = 2; i<15; i++) {
        app.cards.push(i+" clubs");
        app.cards.push(i+" diamonds");
        app.cards.push(i+" hearts");
        app.cards.push(i+" spades");
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
    app[playerTotal] = (parseInt(app[player][0][0]) + parseInt(app[player][1][0]));
    //check for blackjack
    if (app[playerTotal] === 21) {
        console.log(`winner winner chicken dinner`);
    }
}

app.hit = function(player, playerHand){

    app.hitCard = Math.floor(Math.random() * app.cards.length);
    // find card value & push card to hand
    app[playerHand].push(app.cards[app.hitCard]);
    // take card out of the deck
    app.cards.splice(app.hitCard, 1);
    console.log(app.p1Hand);
    console.log(app.cards);
}

app.computerHit = function() {
    if (app.p2Total  )

}


app.endRound = (player, playerHand) => {
    app[player].length = 0;
    app[playerHand].length = 0;
}

app.init = function(){
    app.createDeck();

    $(`.deal`).on('click',function(e){
    e.preventDefault();
    app.dealCards();
    app.checkTotal("p1", "p1Hand", "p1Total");
    app.checkTotal("p2", "p2Hand", "p2Total");
    console.log(app.p1Hand, app.p1Total, app.p2Hand, app.p2Total);
    // app.endRound("p1","p1Hand");
    // app.endRound("p2","p2Hand");
    });

    $(`.hit`).on('click',function(e){
    e.preventDefault();
    app.hit("p1", "p1Hand");
    });
    
    $(`.stay`).on('click',function(e){
    e.preventDefault();
    app.computerHit();
    });
};

$(function() {
app.init();
});