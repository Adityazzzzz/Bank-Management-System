import HeaderBox from '@/components/HeaderBox';
import PaymentTransferForm2 from '@/components/PaymentTransferForm2';
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';

const Transfer = async () => {
  const loggedIn = await getLoggedInUser();
  if(!loggedIn) redirect('/sign-in');

  const accounts = await getAccounts({ userId: loggedIn.$id });

  if(!accounts) return null;

  const accountsData = accounts?.data;

  return (
    <section className="flex flex-col gap-8 bg-gray-50 p-8 min-h-screen">
      <HeaderBox 
        title="Payment Transfer"
        subtext="Please provide any specific details or notes related to the payment transfer"
      />

      <div className="flex flex-col gap-8">
        <PaymentTransferForm2 
            accounts={accountsData} 
            userId={loggedIn.$id} 
        />
      </div>
    </section>
  )
}

export default Transfer;