# demo-feature-toggles
Demo Feature Toggles


## Workshops:

### Implement Schedule Transfer Feature
Given the Transfer feature is completed, implement the Schedule Transfer feature.

User Story: Schedule Money Transfers
As a bank customer,
I want to schedule money transfers for future dates,
So that I can automate recurring payments and manage my finances better.

📝 Acceptance Criteria:
Given I am logged into my bank account,
When I navigate to the scheduled transfer section,
Then I should be able to set a recipient, transfer amount, and schedule date for **one-time**.

Given I am logged into my bank account,
When I navigate to the scheduled transfer section,
Then I should be able to set a recipient, transfer amount, and schedule date for **monthly**.


## Features
### 📚 Real-Time Balance Update
Title: Real-Time Balance Update
User Story:
As a bank customer,
I want to see my account balance update in real-time after transactions,
So that I can be confident my financial records are up-to-date without refreshing the page.

Acceptance Criteria:

- Real-time balance updates are shown after successful transactions.
- Feature can be toggled on/off using environment variables (backend) and Firebase Remote Config (frontend).
- Fallback to manual refresh when the feature is disabled

⚙️ Feature Toggle Details:
Toggle Name: `ENABLE_REALTIME_BALANCE_UPDATE`
Enabled Behavior: Shows real-time balance updates.
Disabled Behavior: Falls back to manual refresh for balance updates.



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


### 📚 User Story: Scheduled Transfers
Title: Schedule Money Transfers

As a bank customer,
I want to schedule money transfers for future dates,
So that I can automate recurring payments and manage my finances better.

📝 Acceptance Criteria:
Given I am logged into my bank account,
When I navigate to the scheduled transfer section,
Then I should be able to set a recipient, transfer amount, and schedule date.

Given I successfully schedule a transfer,
When I view my scheduled transfers,
Then I should see the details of my scheduled transactions.

Given the scheduled transfer date has arrived,
When the system processes the transfer,
Then the recipient account should be credited successfully.

Given the feature toggle for Scheduled Transfers is disabled,
When I attempt to schedule a transfer,
Then I should see a message indicating the feature is not available.

⚙️ Feature Toggle Details:
Toggle Name: ENABLE_SCHEDULED_TRANSFER
Enabled Behavior: Allows users to schedule money transfers.
Disabled Behavior: Shows a message indicating the feature is unavailable.

### 📚Title: Display Credit Card Information
Title: Display Credit Card Information
User Story: Display Credit Card Information

As a bank customer,
I want to view my credit card information, including card details, outstanding balance, and payment due date,
So that I can manage my credit card usage and ensure timely payments.


📝 Acceptance Criteria:
Given I am logged into my bank account,
When I navigate to the credit card section,
Then I should see my credit card details, including:

Card number (partially masked, e.g., **** **** **** 1234)
Current outstanding balance
Minimum payment due
Payment due date
Given I have multiple credit cards,
When I view the credit card section,
Then I should be able to switch between cards to view details for each.

Given the feature toggle for Credit Card Info Display is disabled,
When I access the credit card section,
Then I should see a message indicating that the feature is not available.

⚙️ Feature Toggle Details:
Toggle Name: `ENABLE_CREDIT_CARD_INFO`
Enabled Behavior: Displays credit card information.
Disabled Behavior: Shows a message indicating the feature is not available.
