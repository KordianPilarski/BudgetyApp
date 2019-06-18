//BUDGET CNTRLR
var budgetController = (function(){

    //some code

})();

//UI CNTRLR
var UIController = (function(){

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }

    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value,  //inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },

        getDOMStrings: function(){
            return DOMStrings;
        }
    };

})();

//GLOBAL APP CNTRLR
var controller = (function(budgetCtrl, UICtrl){

    var DOM = UIController.getDOMStrings();

    var ctrlAddItem = function () {

        //get value of add desc
        var input = UICtrl.getInput();
        console.log(input);
        //add item to budget

        //add item to UI

        // calc budget

        // display budget to UI
    };

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){

        if (event.keyCode === 13 || event.which === 13){
           ctrlAddItem();
        }
    });

})(budgetController, UIController);