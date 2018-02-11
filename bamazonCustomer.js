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


    ]).then((customerRequest)=>{

		//set a global variable to store a quantity calculation
		// var newQuant = 0;

    	//change the quantity into a negative number
    	var subtrQuant = -Math.abs(customerRequest.quantity);

    	//subtract the quantity from the respective product in the db
    	// getNewQuant(result.product_id,subtrQuant);

    		//get the current quantity
		connection.query("SELECT stock_quantity FROM products WHERE ?", {
			item_id: customerRequest.product_id
			}, function(error, result) {
			if(error) throw error;

			var currentQuant = result[0].stock_quantity;

			var newQuant = currentQuant + subtrQuant;
			
			//check and see if there are enough products to buy
			if (newQuant >= 0){
				buyProduct(customerRequest.product_id,newQuant, function(err, result) {
					//print the product list again
					printItems();
					connection.end();
				});

				console.log("Your product will be shipped shortly!");


				//end
			}

			else {
				console.log("Insufficient quantity!");
			}

		});

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


//buy product 
function buyProduct(id,quant, callback){

var sql = "UPDATE products SET stock_quantity =" + quant + " WHERE item_id = " + id;

connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
    callback();
  });

};



