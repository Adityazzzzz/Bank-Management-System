import ErrorToast from '@/components/ErrorToast';
import HeaderBox from '@/components/HeaderBox'
import RecentTransactions from '@/components/RecentTransactions';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';

const Home = async (props: SearchParamProps) => {
  const searchParams = await props.searchParams;

  const { id, page } = searchParams;

  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) {
    return <div className="p-4">Please log in to view your dashboard.</div>; 
  }
  const accounts = await getAccounts({
    userId: loggedIn.$id
  })

  if (!accounts) {
      return (
          <section className="home">
              <ErrorToast message="Dashboard data failed to load." />
              <div className="home-content">
                  <header className="home-header">
                      <HeaderBox 
                          type="greeting" title="Welcome" user={loggedIn?.firstName || 'Guest'}
                          subtext="Access and manage your account and transactions efficiently."
                      />
                      <div className="text-red-500 font-bold">
                          Error: Could not fetch account balance.
                      </div>
                  </header>
              </div>
          </section>
      );
  }

  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  const account = await getAccount({ appwriteItemId })

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || 'Guest'}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox
            accounts={accountsData}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>

        <RecentTransactions
          accounts={accountsData}
          transactions={account?.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
      </div>

      <RightSidebar
        user={loggedIn}
        transactions={account?.transactions}
        banks={accountsData?.slice(0, 2)}
      />
    </section>
  )
}

export default Home