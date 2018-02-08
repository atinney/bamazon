var mysql = require ("mysql");
var inquirer = require ("inquirer");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	user:"root",

	password:"",
	database: "bamazon"
});



connection.connect(function(err) {
	
	if (err) throw err;
	// console.log("connected as id " + connection.threadId);
	bamazon();
});


function bamazon() {

	printItems();
	menu();
}


function menu(){

    inquirer.prompt([
    {
        type: 'input',
        name: 'product_id',
        message: 'Enter the ID of the item you would like to buy'
    },
    {
    	type: 'input',
    	name: 'quantity',
    	message: 'How many would you like to buy?'
    }


    ]).then((result)=>{

		//set a global variable to store a quantity calculation
		var newQuant = 0;

    	//change the quantity into a negative number
    	var subtrQuant = -Math.abs(result.quantity);

    	//subtract the quantity from the respective product in the db
    	getNewQuant(result.product_id,subtrQuant);

    	console.log("This should be the second value" + newQuant);

    	// buyProduct(result.product_id,newQuant);

    	//print the product list again
    	printItems();


    	//close the connection
    	connection.end();

    })
}




//print all items
function printItems() {
	connection.query("SELECT * FROM products",function(err,results) {
		if(err) throw err;

		console.log("\n ID       |         Item              |      Department     |        Price        |    Quantity");
		console.log("\n -----------------------------------------------------------------------------------------------\n")
		
		
  		for(var key in results) {
      		console.log(results[key].item_id + "    " + results[key].product_name + "      " + results[key].department_name +  "     " + results[key].price +  "     " + results[key].stock_quantity);
     	}

     	console.log("\n -----------------------------------------------------------------------------------------------\n")


	})
};

//calculate new quantity
function getNewQuant(id,quant) {


	//get the current quantity
	connection.query("SELECT stock_quantity FROM products WHERE ?", {
		item_id: id
	}, function(error, result) {
		if(error) throw error;
		currentQuant = result[0].stock_quantity;

		newQuant = currentQuant + quant;
	});



};

//buy product 
function buyProduct(id,quant){

	connection.query("UPDATE products SET ? WHERE ?", {
		stock_quantity: quant,
		id: id
		}, function(error, result) {
			if(error) throw error;
			console.log(result.affectedRows + "rows changed");
	});
};
