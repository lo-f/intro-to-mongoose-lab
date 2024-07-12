require('dotenv').config();
const mongoose = require('mongoose');


const prompt = require('prompt-sync')();

const Customer = require('./models/customer.js');
const customer = require('./models/customer.js');


// Create ------------
const createCustomer = async () => {
    const createCustomerName = prompt('What is new customer\'s full name? ')
    const createCustomerAge = prompt('What is new customer\'s age? ')
    const customerData = ({
        name: createCustomerName,
        age: createCustomerAge
    })

    const customer = await Customer.create(customerData)
    console.log(`New customer: ${customer}`)
};


// View -------------
const getAllCustomers = async () => {
    const customers = await Customer.find()
    console.log('Customers:,', customers)
}

// Update ------------
const updateCustomerName = async () => {
    let id;  
    const update = await Customer.findByIdAndUpdate(id, { name: String}, { new: true})
}

const updateCustomerAge = async () => {
    let id;
    const update = await Customer.findByIdAndUpdate(id, { age: Number}, {new: true})
}

// Delete -------------
const removeCustomer = async () => {
    const deleteCustomerPrompt = prompt('What is the Customer ObjectId? ')
    const deleteCustomer = await Customer.findByIdAndDelete(deleteCustomerPrompt)
    console.log('Customer deleted')
}

// Quit ---------------
const quitApp = async () => {
    const quitPrompt = prompt('Would you like to quit? ')
    process.exit()
}

// Start App -------------------------------------------------------------------------
const startApp = async () => {
    console.log('Hello. Welcome to CRM.')
    console.log(
        '| 1. Create |',
        '2. View |',
        '3. Update |',
        '4. Delete |',
        '5. Quit |'
    )
    console.log('')
    const menuPrompt = prompt('What would you like to do? ');
    function handleMenuPrompt() {
        if (1) {
            createCustomer();
        } else if(2) {
            getAllCustomers();
        } else if(3) {
            updateCustomerName();
        } else if (4) {
            removeCustomer();
        } else if (5) {
            quitApp();
        }
    };
    handleMenuPrompt (menuPrompt);
}

// const username = prompt('What is your name? ');

// console.log(`Your name is ${username}`);

const connect = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to CustomersDB');
    console.log('')
    await startApp();
    await mongoose.disconnect();
    console.log('Disconnected from CustomersDB');
    process.exit();
};


connect()