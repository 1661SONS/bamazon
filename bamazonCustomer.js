// requiring dependencies
var mysql = require('mysql');
var inquirer = require('inquirer');
var colors = require('colors');
var Table = require('cli-table');

// establishing database connection
var connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

// setting initial value of order to $0
var purchaseTotal = 0;

connection.connect( function(err) {
    if (err) throw err;
    // don't need this since the table will confirm the connection
    // console.log('is connected to id ' + connection.threadId + '\n');
});

function inventory() {
    // pretty print all items for sale in products table
    connection.query('SELECT * FROM products', function(err, response) {
        if (err) throw err;

        var inventoryTable = new Table ({
            head: ['ID'.magenta.bold, 'Product'.magenta.bold, 'Price'.magenta.bold, 'Stock'.magenta.bold],
            colWidths: [5, 30, 10, 10]
        });
        for (var i = 0; i < response.length; i++) {
            var item = response[i];
            inventoryTable.push(
                [colors.cyan(item.item_id), item.product_name, '$ '.green + item.price, item.stock_quantity]
            );
        };
        console.log('\n' + inventoryTable.toString());
        console.log(colors.magenta.bold('____________________________________________________________\n'));
        // connection.end();
    });
};
inventory();

// begin logic for making a purchase ///////////////////////////////////////////////////////////////////////////////
function buy() {
    // ask for user inputs using inquirer
    inquirer.prompt([
        {
            name: 'itemID',
            message: 'what is the ID of the product you want to buy?',
            type: 'input',
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }, {
            name: 'purchaseQuantity',
            message:'how many units would you like to buy?',
            type: 'input',
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then( function(answer) {

        // save inquirer answers as variables for more logic
        var itemID = answer.itemID;
        var purchaseQuantity = answer.purchaseQuantity;

        // select the product requested by the user from the inventory
        connection.query('SELECT * FROM products WHERE item_id=?', [itemID], function(err, response) {
            if (err) throw err;
            var stock_quantity = response[0].stock_quantity;

            // let the user know if the product they're trying to purchase has stock lower than their request
            if (stock_quantity < purchaseQuantity) {
                console.log(colors.yellow(`\nWe don't have that many units in stock! Please choose a number of units less than or equal to the current product inventory.\n`));

                // only show this for one second
                setTimeout(buy, 1000);

            } else {

                // if the math works out, decrease the product stock by the # units requested by the user
                stock_quantity -= purchaseQuantity;

                // calculate the cost of the sale to the user
                var cost = purchaseQuantity * response[0].price;
                console.log(colors.cyan('\nYour product subtotal: $' + (cost).toFixed(2)));

                // add this cost to the total
                purchaseTotal += (parseFloat(cost));
                console.log(colors.cyan('\nYour purchase total: ') + colors.green('$' + purchaseTotal.toFixed(2)) + '\n');

                // update product stock in inventory table
                connection.query('UPDATE products SET ? WHERE item_id=?', [{stock_quantity: stock_quantity}, itemID], function(err, response) {
                    if (err) throw err;
                });

                // ask the user if they want to continue shopping or complete their current purchase
                inquirer.prompt([
                    {
                        name: 'continue',
                        message: 'Would you like to continue shopping?',
                        type: 'confirm',
                        default: true
                    }
                ]).then( function(answer) {
                    // if yes, display the table and run the buy() function again
                    if(answer.continue) {
                        inventory();
                        setTimeout(buy, 1500);
                    // if no, 
                    } else {
                        console.log(colors.magenta.bold('____________________________________________________________\n'));
                        console.log(colors.green('\nPurchase complete! Much appreciated!\n'));
                        console.log(colors.green('____________________________________________________________\n'));

                        process.exit(0);
                    }
                });
            }
        });
    });
}
setTimeout(buy, 500);


