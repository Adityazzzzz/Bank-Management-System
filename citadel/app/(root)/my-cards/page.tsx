import HeaderBox from '@/components/HeaderBox'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import { getCards, createVirtualCard } from '@/lib/actions/card.actions'
import { getPots } from '@/lib/actions/savings.actions'
import VirtualCard from '@/components/VirtualCard'
import SavingsPotCard from '@/components/SavingsPotCard'
import SpendingChart from '@/components/SpendingChart' 
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'
import NewPotForm from '@/components/NewPotForm'
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getManualTransactions } from '@/lib/actions/transaction.actions';

const MyCards = async () => {
  const user = await getLoggedInUser();
  if(!user) redirect('/sign-in');
  const accountsData = await getAccounts({ userId: user.$id });
  const appwriteItemId = accountsData?.data?.[0]?.appwriteItemId;

  const account = appwriteItemId 
    ? await getAccount({ appwriteItemId }) 
    : null;

  const plaidTransactions = account?.transactions || [];
  const manualTransactions = await getManualTransactions(user.$id);
  const allTransactions = [...plaidTransactions, ...manualTransactions];

  const cards = await getCards({ userId: user.$id });
  const pots = await getPots(user.$id);

  const handleNewCard = async () => {
    "use server";
    await createVirtualCard({ userId: user.$id, label: `${user.firstName}'s Card` });
  }

  return (
    <section className="flex w-full flex-col gap-8 bg-gray-50 p-8 min-h-screen overflow-y-auto">
      <HeaderBox title="My Cards & Vaults" subtext="Manage your virtual cards and savings goals." />

      <SpendingChart transactions={allTransactions} userId={user.$id} />

      <hr className="border-gray-200" />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-[65%] flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="header-2">Virtual Cards</h2>
              <form action={handleNewCard}>
                <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-md rounded-lg h-10 px-4">
                  + Generate Card
                </Button>
              </form>
            </div>

            <div className="flex flex-wrap gap-6">
              {cards.length > 0 ? (
                cards.map((card: any) => <VirtualCard key={card.$id} card={card} />)
              ) : (
                <div className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-white/50 p-12 text-center">
                  <p className="text-16 font-medium text-gray-500">No cards yet.</p>
                </div>
              )}
            </div>
        </div>

        <div className="w-full lg:w-[35%] flex flex-col gap-6 border-t border-gray-200 pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            <div className="flex items-center justify-between">
                <h2 className="header-2">Savings Pots</h2>
                <NewPotForm userId={user.$id} />
            </div>

            <div className="flex flex-col gap-4 h-full">
                {pots.length === 0 ? (
                    <div className="flex w-full items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/50 p-8">
                        <p className="text-gray-500 text-sm">No savings goals yet.</p>
                    </div>
                ) : (
                    pots.map((pot: any) => (
                        <SavingsPotCard key={pot.$id} pot={pot} />
                    ))
                )}
            </div>
        </div>
      </div>
    </section>
  )
}

export default MyCards