# we-kata-bank-account
https://gist.github.com/abachar/d20bdcd07dac589feef8ef21b487648c

## Statement
Think of your personal bank account experience When in doubt, go for the simplest solution.

### Requirements
- Deposit and Withdrawal
- Account statement (date, amount, balance)
- Statement printing

### User Stories
Uer Story 1:
```
In order to save money
As a bank client
I want to make a deposit in my account
```

Uer Story 2:
```
In order to retrieve some or all of my savings
As a bank client
I want to make a withdrawal from my account
```

Uer Story 3:
```
In order to check my operations
As a bank client
I want to see the history (operation, date, amount, balance) of my operations
```

## Implementation
By reading the user stories we can see only one pitfall in the scenarios. Users can't withdraw money they don't have.
These user stories can be described with the following scenarios:

```gherkin
Scenario I make a deposit 
    Given I have 80 on my bank account
    When I make a deposit of 20
    Then the balance is 100
    
    Given I have 100 on my bank account
    When I make a deposit of -20
    Then I'm notified the operation is impossible

Scenario I make a withdrawal
    Given I have 80 on my bank account
    When I withdraw 20
    Then the balance is 60
    
    Given I have 80 on my bank account
    When I withdraw 100
    Then I'm notified the balance is not sufficient to make the withdrawal

Scenario I check my operations history
    Given I have a bank account
    When I request my operations history
    Then I see my operations history
```

**Important note:** Some considerations like authentication, authorization, and account creation are simplified. The database schema is minimal, as well.

The project uses [Node.js](https://nodejs.org/) V14 as a minimum version. It allows us to use [ESM modules](https://nodejs.org/docs/latest-v14.x/api/esm.html).

There are several ways to install Node.js:
- You can download it from the website: https://nodejs.org/en/download/
- If you already have a version of Node.js, and you want to manage several versions you can use [nvm](https://github.com/nvm-sh/nvm)

The main packages used for this project are:
- [Express](https://expressjs.com/) is an HTTP framework.
- [Joi](https://joi.dev/) is a schema description language.
- [Knex](http://knexjs.org/) is a query builder, it supports SQLite and MySQL amongst other.
- [Ava](https://github.com/avajs/ava) is used a test runner. It easily works, without any configuration needed.

A [collection]("endpoint.http") of "[HTTP request in Editor](https://github.com/JetBrains/http-request-in-editor-spec)" is provided, as well. It is natively supported by WebStorm and can be run in VS Code with the [Rest Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) plugin installed.

## Run
To run the project you need to open a terminal and go tho the project folder.

Then install its dependencies:
```shell script
# It uses npm which is installed with Node.js by default
npm i
```
You can start the project:
```shell script
# It will start a database, create tables, 
# populate them with data, then start the server 
npm run start:init
```
You can run all tests:
```shell script
npm t
```