import HeaderBox from '@/components/HeaderBox'
import { Pagination } from '@/components/Pagination';
import TransactionsTable from '@/components/TransactionsTable';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { formatAmount } from '@/lib/utils';
import React from 'react'
import ErrorToast from '@/components/ErrorToast';
import { BankDropdown } from '@/components/BankDropdown'; // IMPORT DROPDOWN

const TransactionHistory = async (props: SearchParamProps) => {
  const searchParams = await props.searchParams;
  const { id, page } = searchParams;

  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) {
    return <div className="p-4">Please log in to view transaction history.</div>;
  }
  const accounts = await getAccounts({
    userId: loggedIn.$id
  })

  if (!accounts) {
    return (
        <section className="transactions">
            <ErrorToast message="Failed to fetch account data. Please try again." />
            <div className="transactions-header">
                <HeaderBox title="Transaction History" subtext="See your bank details and transactions." />
            </div>
            <div className="p-4 text-red-500 font-semibold">
                System Error: Could not load accounts.
            </div>
        </section>
    );
  }

  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  const account = await getAccount({ appwriteItemId })

  // FIXED: Handle fallback for transactions to prevent crash
  const transactions = account?.transactions || []; 

  const rowsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = transactions.slice(
    indexOfFirstTransaction, indexOfLastTransaction
  )

  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox
          title="Transaction History"
          subtext="See your bank details and transactions."
        />
        {/* ADDED: Bank Dropdown to allow switching accounts */}
        <BankDropdown accounts={accountsData} setValue={undefined} />
      </div>

      <div className="space-y-6">
        <div className="transactions-account">
          <div className="flex flex-col gap-2">
            <h2 className="text-18 font-bold text-white">{account?.name}</h2> 
            <p className="text-14 text-blue-25">
              {account?.officialName}
            </p>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●● {account?.mask}
            </p>
          </div>

          <div className='transactions-account-balance'>
            <p className="text-14">Current balance</p>
            {/* FIXED: Added '|| 0' to prevent $NaN error if balance is missing */}
            <p className="text-24 text-center font-bold">
              {formatAmount(account?.currentBalance || 0)}
            </p>
          </div>
        </div>

        <section className="flex w-full flex-col gap-6">
          <TransactionsTable
            transactions={currentTransactions}
          />
          {totalPages > 1 && (
            <div className="my-4 w-full">
              <Pagination totalPages={totalPages} page={currentPage} />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default TransactionHistory