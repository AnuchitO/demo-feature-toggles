# demo-feature-toggles
Demo Feature Toggles


## Workshops:

### [STORY-1] View Transactions History

Title: View Transactions History
User Story: View Transactions History

As a bank customer,
I want to view my transaction history,
So that I can track my spending and monitor my account activity.

📝 Acceptance Criteria:
Given I am logged into my bank account,
When I navigate to the transactions history section,
Then I should see a list of my transactions, including:

Transaction type
Transaction date
Transaction amounts

Note: the API endpont already exists GET /accounts/:accountNumber/transactions


### [STORY-2] Schedule Money Transfers (ONCE)

Title: Schedule Money Transfers (ONCE)
User Story: Schedule Money Transfers (ONCE)

As a bank customer,
I want to schedule money transfers for future dates,
So that I can automate recurring payments and manage my finances better.

📝 Acceptance Criteria:
Given I am logged into my bank account,
When I navigate to the scheduled transfer section,
Then I should be able to set a recipient, transfer amount, and schedule date for one-time.

Technical guide:
- the API endpoint POST /accounts/:accountNumber/schedules or add functionality to the existing POST /accounts/:accountNumber/transfers
- the API endpoint Transfer alreay done POST /accounts/:accountNumber/transfers

### [STORY-3] Schedule Money Transfers (MONTHLY)

Title: Schedule Money Transfers (MONTHLY)
User Story: Schedule Money Transfers (MONTHLY)

As a bank customer,
I want to schedule money transfers for future dates,
So that I can automate recurring payments and manage my finances better.

📝 Acceptance Criteria:
Given I am logged into my bank account,
When I navigate to the scheduled transfer section,
Then I should be able to set a recipient, transfer amount, and schedule date for monthly.

Technical guide:
- the API endpoint POST /accounts/:accountNumber/schedules or add functionality to the existing POST /accounts

### [STORY-4] View Scheduled Transactions

Title: View Scheduled transactions
User Story: View Scheduled Transactions

As a bank customer,
I want to view my scheduled transactions,
So that I can track my upcoming payments and manage my finances better.

📝 Acceptance Criteria:
Given I am logged into my bank account,
When I navigate to the scheduled transactions section,
Then I should see a list of my scheduled transactions, including:

recipient name, account number, bank, transfer amount, and schedule date.


## Existing Features
### 📚 View Account Balance
Title: View Account Balance
User Story:
As a bank customer,
I want to see my account balance update in after transactions,
So that I can be confident my financial records are up-to-date.

Acceptance Criteria:

Given I am logged into my bank account,
When I navigate to the account balance section,
Then I should see my current account balance.

⚙️ Feature Toggle Details:
Toggle Name: `ENABLE_REALTIME_BALANCE_UPDATE`
Enabled Behavior: Shows real-time balance updates.
Disabled Behavior: Falls back to manual refresh for balance updates.

note: the feature toggle is already implemented in the codebase and removed from the codebase


### 📚 User Story: Money Transfers
Title: Perform Money Transfers

As a bank customer,
I want to transfer money to another account securely and instantly,
So that I can complete financial transactions conveniently.

📝 Acceptance Criteria:
- Given I am logged into my bank account,
- When I navigate to the money transfer section,
- Then I should be able to input recipient details, transfer amount, and confirm the transaction.

- Given I have sufficient funds in my account,
- When I confirm the transfer,
- Then the transfer should succeed, and I should see a success confirmation.

- Given I have insufficient funds,
- When I attempt a transfer,
- Then I should see an error message indicating insufficient funds.

- Given the feature toggle for Money Transfers is disabled,
- When I attempt a transfer,
- Then I should see a message indicating the feature is not available.

⚙️ Feature Toggle Details:
Toggle Name: `ENABLE_MONEY_TRANSFER`
Enabled Behavior: Allows users to perform money transfers.
Disabled Behavior: Shows a message indicating the feature is unavailable.

