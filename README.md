# bamazon

## Overview

Bamazon is a Node app where users can purchase products from an Scooby-Doo themed inventory. The inventory is a MySQL database table containing 12 products of varying price and stock quantities. The user interacts with the table and makes purchases through Inquirer.

## How It Works

* Upon starting the app, the user is presented with the most current inventory table and is prompted for the product ID of an item they'd like to purchase:

![alt text](images/start.png?raw=true 'Start')

* After the user enters the product ID, they are prompted for the number of units they wish to purchase. If their requested number of units is greater than the units in stock or if the stock is 0, the system will return an error:

![alt text](images/stock-error.png?raw=true 'Stock Error')

* The user is then given an opportunity to choose another product and continue shopping or just complete the purchase (if they choose to continue shopping, the process starts over)

* When a product ID and quantity are successfully chosen (the happy path), the total cost of the purchase is calculated and displayed. After the transaction is complete, the stock of the purchased item is updated to reflect the number of units bought by the user:

### For this example, I bought 999 pizzas:

![alt text](images/thanks.png?raw=true 'Much Appreciated')

### Shamelessly leaving only one behind:

![alt text](images/999-pizzas-later.png 'Who Ate All The Pizza')
