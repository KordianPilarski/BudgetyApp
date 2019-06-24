//BUDGET CNTRLR
var budgetController = (function(){

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.precentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100)
        } else {
            this.percentage = -1;
        }
    };
    
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1,
    }

    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            //crweate new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
                //create nwe item inc or exp
            if (type === 'exp'){
                newItem = new Expense(ID, des, val)
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val)
            } 

                //push it into our data structure
            data.allItems[type].push(newItem);

            //return new element
            return newItem;
        },

        deleteItem: function(type, id) {
            var ids, index;

            var ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function (){

            //calc total income and exp
            calculateTotal('exp');
            calculateTotal('inc');

            //calc budget: inc - exp
            data.budget = data.totals.inc - data.totals.exp;

            //calc the %
            if (data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            };
        },

        calculatePercentages: function (){

            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
             });
        },

        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data. percentage
            };
        },

        testing: function (){
            console.log(data);
        }
    }

})();

//UI CNTRLR
var UIController = (function(){

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    }

    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value,  //inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        addListItem: function (obj, type) {
            var html, newHtml, element;
            // create html string with placegholder
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            }

            //replace placeholder txt with some actural data

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // insert html into the DOM
            var x = document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function (selectorID){
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el); 
        },

        clearFields: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array){
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function (obj){

            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;

            if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
        },

        getDOMStrings: function(){
            return DOMStrings;
        }
    };

})();

//GLOBAL APP CNTRLR
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function () {
        var DOM = UIController.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){    
            if (event.keyCode === 13 || event.which === 13){
               ctrlAddItem();
            }
        });

        document.querySelector(DOM.container),addEventListener('click', ctrlDeleteItem);
    };
    
    var updateBudget = function(){

        // calc budget
        budgetCtrl.calculateBudget();

        //return budget
        var budget = budgetController.getBudget();

        // display budget to UI
        UICtrl.displayBudget(budget);

    };

    var updatePercentages = function() {
        
        //calc percentages
        budgetCtrl.calculatePercentages();
        //read percentages from budget controller
        var percentages = budgetCtrl.getPercentages();
        // update UI
        console.log(percentages)
    };

    var ctrlAddItem = function () {
        var input, newItem;

        //get value of add desc
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //add item to budget
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        //add item to UI
        UICtrl.addListItem(newItem, input.type);

        //clear the fields
        UICtrl.clearFields();

        //calc and update budget
        updateBudget();

        //calc mand update percentages
        updatePercentages();
        }
    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID){

            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //delete item form data
            budgetCtrl.deleteItem(type, ID);
            //delete item form UI
            UICtrl.deleteListItem(itemID);
            // update and show new budget
            updateBudget();
            //calc mand update percentages
            updatePercentages();

        }
    };

    return {
        init: function() {
            console.log('App started');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };
    
})(budgetController, UIController);

controller.init();