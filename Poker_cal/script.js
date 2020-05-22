const suit = {
    spade: 0, heart: 1, club: 2, diamond: 3
}

const pokerTable = {
    'A': suit,
    'K': suit,
    'Q': suit,
    'J': suit,
    'T': suit,
    '9': suit,
    '8': suit,
    '7': suit,
    '6': suit,
    '5': suit,
    '4': suit,
    '3': suit,
    '2': suit,
}

window.onload = () => {
    createPokerTable()
    pokerStrength(['Ac','Ts'],['2s','3s','5d','6d','8d'])
}

const createPokerTable = () => {
  for (let key in pokerTable){
      console.log(key)
  }
    // document.getElementById('poker-card').innerHTML= html;
}
                    //2cards //5cards
const pokerStrength =(hand, boards) =>{
    let h = []
    let strength = 
    ['straighFlush','fourOfAKind','fullHouse','flush','straight','threeOfAKind',
    'twoPairs','onePairs','highCards'];
    h = hand + boards
    console.log(h)


}

