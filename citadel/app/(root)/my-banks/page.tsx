export const dynamic = 'force-dynamic';
import BankCard from '@/components/BankCard';
import HeaderBox from '@/components/HeaderBox'
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import React from 'react'
import ErrorToast from '@/components/ErrorToast';
import InfoTooltip from '@/components/InfoTooltip';

const MyBanks = async () => {
    const loggedIn = await getLoggedInUser();
    const accounts = await getAccounts({ 
        userId: loggedIn.$id 
    })

    if(!accounts) {
        return (
            <section className='flex'>
                <ErrorToast message="Could not load your banks." />
                <div className="my-banks">
                     <HeaderBox title="My Bank Accounts" subtext="Effortlessly manage your banking activites." />
                     <p className="text-red-500 font-bold mt-4">System Error: Unable to fetch accounts.</p>
                </div>
            </section>
        )
    }

    return (
        <section className='flex'>
            <div className="my-banks">
                <HeaderBox 
                    title="My Bank Accounts"
                    subtext="Effortlessly manage your banking activites."
                />
                <div className="mt-4">
                </div>
                <div className="space-y-4">
                    <h2 className="header-2 flex gap-2">
                        Your cards
                        <InfoTooltip content="This is a collection of all your linked banks. To receive money, click the copy icon on a card and paste that ID into the 'Receiver ID' field on the Transfer page." />
                    </h2>
                    <div className="flex flex-wrap gap-6">
                        {accounts && accounts.data.map((a: Account) => (
                        <BankCard 
                            key={a.id} 
                            account={a}
                            userName={loggedIn?.firstName}
                        />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MyBanks