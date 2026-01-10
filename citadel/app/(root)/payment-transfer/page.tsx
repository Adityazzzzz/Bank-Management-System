import HeaderBox from '@/components/HeaderBox'
import PaymentTransferForm from '@/components/PaymentTransferForm'
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button'; // Import Button
import { ArrowRightLeft, Zap } from 'lucide-react'; // Import Icons
import Link from 'next/link'; // Import Link
import { redirect } from 'next/navigation';

const Transfer = async () => {
  const loggedIn = await getLoggedInUser();
  if(!loggedIn) redirect('/sign-in');

  const accounts = await getAccounts({ userId: loggedIn.$id });

  if(!accounts) return null;
  
  const accountsData = accounts?.data;

  return (
    <section className="payment-transfer">
      <HeaderBox 
        title="Payment Transfer"
        subtext="Please provide any specific details or notes related to the payment transfer"
      />

      <section className="size-full pt-5">
        
        {/* NEW: Navigation Button to P2P Transfer */}
        <div className="mb-8 flex flex-col gap-4 rounded-xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-blue-600 text-white">
                    <Zap size={20} />
                </div>
                <div>
                    <h2 className="text-16 font-bold text-gray-900">Need to send money instantly?</h2>
                    <p className="text-14 text-gray-600">Use Citadel P2P to send funds directly to other users in seconds.</p>
                </div>
            </div>
            
            <Link href="/payment-transfer/p2p" className="w-full sm:w-fit">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 sm:w-fit gap-2">
                    Try Instant Transfer <ArrowRightLeft size={16} />
                </Button>
            </Link>
        </div>

        <PaymentTransferForm accounts={accountsData} />
      </section>
    </section>
  )
}

export default Transfer