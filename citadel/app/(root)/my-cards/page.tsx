import HeaderBox from '@/components/HeaderBox'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import { getCards, createVirtualCard } from '@/lib/actions/card.actions'
import { getPots } from '@/lib/actions/savings.actions'
import VirtualCard from '@/components/VirtualCard'
import SavingsPotCard from '@/components/SavingsPotCard'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'
import NewPotForm from '@/components/NewPotForm'

const MyCards = async () => {
  const user = await getLoggedInUser();
  if(!user) redirect('/sign-in');

  const cards = await getCards({ userId: user.$id });
  const pots = await getPots(user.$id);

  const handleNewCard = async () => {
    "use server";
    await createVirtualCard({ userId: user.$id, label: `${user.firstName}'s Card` });
  }

  return (
    <section className="flex w-full flex-col gap-8 bg-gray-50 p-8 min-h-screen">
      <HeaderBox title="My Cards & Vaults" subtext="Manage your virtual cards and savings goals." />

      {/* SECTION 1: VIRTUAL CARDS */}
      <section className="flex flex-col gap-6">
        <div className="flex w-full items-center justify-between">
             <h2 className="header-2">Virtual Cards</h2>
             <form action={handleNewCard}>
                <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm rounded-lg px-4 py-2">
                    + Generate Card
                </Button>
             </form>
        </div>
        
        <div className="flex flex-wrap gap-6">
            {cards.length > 0 ? (
                cards.map((card: any) => <VirtualCard key={card.$id} card={card} />)
            ) : (
                <div className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
                    <p className="text-16 font-medium text-gray-500">No virtual cards yet.</p>
                    <p className="text-14 text-gray-400">Click "Generate Card" to create your first one instantly.</p>
                </div>
            )}
        </div>
      </section>

      {/* SECTION 2: SAVINGS POTS */}
      <section className="flex flex-col gap-6 mt-4">
        <div className="flex w-full items-center justify-between">
            <h2 className="header-2">Savings Pots</h2>
            {/* ADD THE NEW BUTTON HERE */}
            <NewPotForm userId={user.$id} />
        </div>
        
        {pots.length === 0 ? (
             <div className="flex w-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8">
                <p className="text-gray-500">No savings pots created yet.</p>
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pots.map((pot: any) => (
                    <SavingsPotCard key={pot.$id} pot={pot} />
                ))}
            </div>
        )}
      </section>
    </section>
  )
}

export default MyCards