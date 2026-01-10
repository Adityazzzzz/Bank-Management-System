Citadel 🏰
Citadel is a modern, full-stack banking platform built with Next.js 16 and React 19. It connects to real banking APIs (Plaid) and payment processors (Dwolla) in a sandbox environment to simulate a complete financial ecosystem.

This project demonstrates cutting-edge Next.js patterns including Server Actions, React Server Components (RSC), and robust third-party API integrations.

🚀 Tech Stack
Framework: Next.js 16 (App Router)
Language: TypeScript
Styling: Tailwind CSS, Shadcn/UI
Form Management: React Hook Form + Zod
Database & Auth: Appwrite
Bank Integration: Plaid API
Payments Processor: Dwolla API
State Management: React Server Components & URL State

✨ Key Features
🔐 Bank-Grade Authentication: Secure login and signup using Appwrite (SSR).
💳 Connect Real Banks: Link multiple bank accounts via Plaid Sandbox
💸 Fund Transfers: Move money between accounts using Dwolla (ACH simulation).
📊 Financial Dashboard: Real-time visualization of total balance, recent transactions, and spending categories using Chart.js.
📜 Transaction History: Searchable, paginated transaction logs for each connected bank.
📱 Responsive Design: Fully optimized for mobile and desktop devices.
⚠️ Important Note on "Sandbox" Environment
This application is a Proof of Concept (PoC) designed to demonstrate production-grade architecture.

No Real Money: It uses the Plaid Sandbox and Dwolla Sandbox environments.
US Banking Only: The APIs used (ACH, Routing Numbers) are specific to the US banking system.
Simulated Data: Accounts and balances are simulated for testing purposes.

🛠️ Getting Started
Follow these steps to run the project locally.

1. Clone the Repository
Bash

git clone https://github.com/your-username/citadel.git
cd citadel
2. Install Dependencies
Bash

npm install
3. Environment Variables
Create a .env file in the root directory and add the following keys:

Code snippet

# NEXT
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# APPWRITE
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id
NEXT_APPWRITE_KEY=your_secret_api_key
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID=your_user_collection_id
NEXT_PUBLIC_APPWRITE_BANK_COLLECTION_ID=your_bank_collection_id
NEXT_PUBLIC_APPWRITE_TRANSACTION_COLLECTION_ID=your_transaction_collection_id

# PLAID
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox
PLAID_PRODUCTS=auth,transactions,identity
PLAID_COUNTRY_CODES=US

# DWOLLA
DWOLLA_KEY=your_dwolla_key
DWOLLA_SECRET=your_dwolla_secret
DWOLLA_BASE_URL=https://api-sandbox.dwolla.com
DWOLLA_ENV=sandbox
4. Run the Development Server
Note: This project uses a custom dev script to enforce IPv4 to prevent connection timeouts on some networks.

Bash

npm run dev
Open http://localhost:3000 in your browser.

🧪 Testing the App (Sandbox Credentials)
Since this is a sandbox, use the following credentials to link a bank:

Username: user_good

Password: pass_good

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

📄 License
This project is licensed under the MIT License.