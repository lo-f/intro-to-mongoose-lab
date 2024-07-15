require('dotenv').config();
const clc = require('cli-color');
const mongoose = require('mongoose');
const prompt = require('prompt-sync')({sigint: true});
const Customer = require('./models/customer.js');

const connect = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(successFlag + success(' Connected to CustomersDB\n'));
};

// CLC Color Theme ---------
const error = clc.redBright.bold;
const errorFlag = clc.whiteBright.bgRedBright(' ERROR ')
const warn = clc.yellow;
const success = clc.greenBright;
const successFlag = clc.whiteBright.bgGreenBright(' SUCCESS ')
const general = clc.cyan;
const promptColor = clc.yellow.bold;

const nameExp = /^[A-Z][a-zA-Z]+ [a-zA-Z]+$/
const idExp = /^[0-9a-zA-Z]{24}$/


// Main Menu ---------------
const mainMenu = async () => {
    console.log(
        general(`\n| 1. Create | 2. View All | 3. Update | 4. Delete | 5. Quit |\n`)
    )
    const menuPrompt = prompt(promptColor('What would you like to do? (Type number, then press <enter>) '));
    switch (menuPrompt) {
        case '1':
            await createCustomer();
            break;
        case '2':
            await getAllCustomers();
            break;
        case '3':
            await updateCustomer();
            break;
        case '4':
            await removeCustomer();
            break;
        case '5': quitApp ();
            break;
    }
    mainMenu()
}

// Create ------------
const createCustomer = async () => {
    const createCustomerName = prompt(promptColor('What is new customer\'s first and last name? (First Last) '))
    if (!createCustomerName.match(nameExp)) {
        console.log(errorFlag + error(' Please enter a valid first and last name. (First Last)\n'));
        return createCustomer();
    };

    let createCustomerAge = Number(prompt(promptColor('What is new customer\'s age? ')));
    while (isNaN(createCustomerAge))
        {
        console.log(errorFlag + error(` Please enter valid customer age.\n`));
        createCustomerAge = Number(prompt(promptColor('What is new customer\'s age? ')));
    }

    const customerData = ({
        name: createCustomerName,
        age: createCustomerAge
    })

    const customer = await Customer.create(customerData)
    console.log(successFlag + success(` New customer: `) + `${customer}`)
};

// View -------------
const getAllCustomers = async () => {
    const customers = await Customer.find()
    console.log(general('Customers:,'), customers)
}

// Update ------------
const updateCustomer = async () => {
    await getAllCustomers();
    let getCustomerIDPrompt = prompt(promptColor('Please COPY and PASTE the ObjectId of the customer you want to update, then press <enter> '))
    while (!getCustomerIDPrompt.match(idExp)) {
        getCustomerIDPrompt = prompt(errorFlag + error(' Please enter a valid Customer ObjectId '))
    }

    const updateCustomerName = async () => {
        const id = getCustomerIDPrompt;
        let newName = prompt(promptColor('What is the customer\'s name? '))
        while (!newName.match(nameExp)) {
            newName = prompt(error('Please enter a valid customer name '))
        }
        const update = await Customer.findByIdAndUpdate(id, { name: newName }, { new: true});
        console.log(successFlag + success(' Customer name updated.'))
    }
    
    const updateCustomerAge = async () => {
        const id = getCustomerIDPrompt;
        let newAge = Number(prompt(promptColor('What is the customer\'s new age? ')));
        while (isNaN(newAge)) {
            console.log(errorFlag + error(` Please enter valid customer age.`));
            newAge = Number(prompt(promptColor('What is customer\'s new age? ')))
        }
        const update = await Customer.findByIdAndUpdate(id,  {age: newAge} , {new: true})
        console.log(successFlag + success(' Customer age updated.'))
    }
    
    const nameOrAgeprompt = prompt(promptColor('Updating customer:') + general(' | 1. name | 2. age | 3. both |') + promptColor(' ? (Type number, then press <enter>) '))
    switch (nameOrAgeprompt) {
        case '1':
            await updateCustomerName();
            break;
        case '2':
            await updateCustomerAge();
            break;
        case '3':
            await updateCustomerName();
            await updateCustomerAge ();
            break;
    }

}

// Delete -------------
const removeCustomer = async () => {
    await getAllCustomers();
    let deleteCustomerPrompt = prompt(promptColor('Please COPY and PASTE the ObjectId of the customer you want to delete, then press ENTER '))
    while (!deleteCustomerPrompt.match(idExp)) {
        deleteCustomerPrompt = prompt(errorFlag + error(' Please enter a valid Customer ObjectId '))
    }
    const deleteCustomer = await Customer.findByIdAndDelete(deleteCustomerPrompt)
    console.log(successFlag + success(' Customer deleted'))
}

// Quit ---------------
const quitApp = async () => {
    console.log(general('\n| 1. Yes | 2. No | \n'))
    const quitPrompt = prompt(promptColor('Would you like to quit? (Type number, then press <enter>) '))
    switch (quitPrompt) {
        case '1':
            mongoose.disconnect();
            console.log(successFlag + success(' Disconnected from mongoose'))
            console.log(general('exiting CRM...'))
            process.exit();
            break;
        case '2':
            await mainMenu();
            break;
    }
    mainMenu();
}

// Start App -------------------------------------------------------------------------
const startApp = async () => {
    await connect();
    console.log(general('Hello. Welcome to CRM.'))
    mainMenu()
}

startApp()
