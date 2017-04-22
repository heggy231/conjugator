class Korean {

  conjugate (word, info) {
    // Format for rulesObject: { tense: 'present', formal: 'true/false', wordType: 'adjective/verb'}
    // TODO: test if word is verb, return to avoid switch
   switch (info.tense) {
     case 'present':
       return this.doPresent(word);
       break;
     case 'past':
       return this.doPast(word);
       break;
     default:
       return 'Could not find any rules for conjugation';
   }
 }

 doPresent(word) {
    let wordLength = word.length;
    let conjugate = '';
    // if the ending is 'ha' then convert to 'hey'
    if (word[wordLength - 2] === '하') {
        conjugate = word.slice(0, wordLength - 2);
        return conjugate.concat('해');
    } else {
      /** breakdown the word to find out the 2nd to last character's letter **/
      let brokeWord = breakdown(word[wordLength - 2]);
      let brokeLength = brokeWord.length;
      let syllableEnd = brokeWord[brokeLength - 1];
      let stemWord = word.slice(0, wordLength - 2);
      let newSyllable = brokeWord.slice(0, brokeLength - 1);
      switch(syllableEnd) {
        case 0: 
        case 1:
        case 4:
          // if last letter is ㅏ leave alone
          return word.slice(0, wordLength - 1);
        case 8: 
          // replace with: ㅘ (9)
            // concat back to word
            newSyllable.push(9);
            newSyllable = combineSymbols(newSyllable);
            return stemWord + newSyllable;
        case 18:
        // vowel ㅡ replace with ㅓ (4)
              newSyllable.push(4);
              newSyllable = combineSymbols(newSyllable);
            if(wordLength <= 2) {
              return newSyllable;
            } else {
              return stemWord + newSyllable;
            }
       case 13:
        // 13 (ㅜ) convert to 14 (ㅝ)
          newSyllable.push(14);
          newSyllable = combineSymbols(newSyllable);
          if(wordLength <= 2) {
            return newSyllable;
          } else {
            return stemWord + newSyllable;
          }
       case 20:
        // vowel ㅣ replace with ㅕ(6)
          newSyllable.push(6)
          newSyllable = combineSymbols(newSyllable);
          if(wordLength <= 2) {
            return newSyllable;
          } else {
            return stemWord + newSyllable;
          }
        default:
            // if consonant
            conjugate = word.slice(0, wordLength - 1);
            return conjugate.concat('어');
      }
    } // end of first else
  } // end of presentWord function

  doPast(word) {
    // stuff for past tense
    //Steps:
    // call the doPresent function on word to get the present tense form.
    // past tense word will ge stored here
    let pastWord = 'empty';
    let presentWord = this.doPresent(word); // 공부해
    console.log('presentword:', presentWord);
    
    // breakdown (present tense word)
    let breakDownWord = breakdown(presentWord[presentWord.length-1]);
    // expected output: breakDownWord: [18,1]
    // [ Initial: 18.  ㅎ, Medial: 1.  ㅐ]
    console.log('breakDownWord:', breakDownWord);
    // push ㅆ to the array unicode, final Jamo, 20 ㅆ into 
    let addedFinalJamoToBreakDownWord = breakDownWord.push(20);
    //newSyllable.push(20)
    console.log('addedFinalJamoToBreakDownWord:', addedFinalJamoToBreakDownWord);
    // call the combine function
    //newSyllable = combineSymbols(newSyllable);
    let finalPastWord = combineSymbols(addedFinalJamoToBreakDownWord);
    console.log('finalPastWord:', finalPastWord);
    // concatenate '어'
    //conjugate = word.slice(0, wordLength - 1);

    let firstTwoWordsOfPastWord = word.slice(0,presentWord.length - 1);
    console.log('firstTwoWordsOfPastWord:', firstTwoWordsOfPastWord);
    //return conjugate.concat('어');

    pastWord = firstTwoWordsOfPastWord.concat('어');
    console.log('pastWord:', pastWord);

    return pastWord;
  }
} // end for class


/** the conjugate returns a conjugate verb, but it should be checked for tense, past tense will take present tense verb and then add something to the the verb, and then add an additional letter after **/

/** Additional Functions **/
// reference: http://www.programminginkorean.com/programming/hangul-in-unicode/composing-syllables-in-unicode/
// input: hangul character
// output: returns an array of components that make up the given hangul
// ex: breakdown('린') outputs [5,20,4]
const breakdown = (input) => {
    let total = parseInt(input.charCodeAt(0).toString(16), 16); 

    let letterArray = [];
    total = total - 44032;
    let initialValue = Math.floor(total / 588);
    letterArray.push(initialValue);
    total = total - (588 * initialValue);
    let medialValue = Math.floor(total / 28);
    letterArray.push(medialValue);
    let finalValue = total - (28 * medialValue);
    if (finalValue > 0) {
        letterArray.push(finalValue);
    }
    return letterArray;
}

// input: array of 2 or 3 numbers representing modern jamo (components) that make up a hangul syllable
// output: a hangul character
const combineSymbols = (input) => {
    let initialValue = input[0] * 588;
    let medialValue = input[1] * 28;
    let finalValue = input[2] ? input[2] : 0;
    let total = initialValue + medialValue + finalValue + 44032;
    let finalWord = String.fromCharCode(total);
    return finalWord;
}


export { Korean };
