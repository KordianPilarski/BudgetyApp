//BUDGET CNTRLR
var budgetController = (function(){

    //some code

})();

//UI CNTRLR
var UIController = (function(){

    // some code

})();

//GLOBAL APP CNTRLR
var controller = (function(budgetCtrl, UICtrl){

    var ctrlAddItem = function () {

        //get value of add desc
        var value = document.querySelector('.add__value').value
        return value;
        //add item to budget

        //add item to UI

        // calc budget

        // display budget to UI
        console.log('werkbicz')
    };

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){

        if (event.keyCode === 13 || event.which === 13){
           ctrlAddItem();
        }

    });

})(budgetController, UIController);