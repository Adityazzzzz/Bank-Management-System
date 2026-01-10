import HeaderBox from '@/components/HeaderBox';
import P2PForm from '@/components/PaymentTransferForm2';

import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';

const P2PTransferPage = async () => {
  const loggedIn = await getLoggedInUser();
  if(!loggedIn) redirect('/sign-in');

  const accounts = await getAccounts({ userId: loggedIn.$id });
  if(!accounts) return null;
  
  const accountsData = accounts?.data;

  return (
    <section className="flex flex-col gap-8 bg-gray-50 p-8 min-h-screen">
      <HeaderBox 
        title="Instant Transfer"
        subtext="Seamlessly move money to friends and family on Citadel."
      />

      <div className="size-full flex justify-center pt-8">
        <P2PForm
            accounts={accountsData} 
            userId={loggedIn.$id} 
        />
      </div>
    </section>
  )
}

export default P2PTransferPage;