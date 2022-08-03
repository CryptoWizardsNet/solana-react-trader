import {useState} from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { PhantomProvider } from "../widgets/wallet/Types";
import Phantom from "../widgets/wallet/Phantom";
import Account from "../widgets/account/Account"
import Navigator from '../widgets/navigation/Navigator';
import PriceBar from '../widgets/chainlink/PriceBar';


function ContainerMain() {
  const [provider, setProvider] = useState<PhantomProvider | undefined>(undefined);
  const [walletPubKey, setWalletPubKey] = useState<any>(undefined);
  const [connection, setConnection] = useState<Connection | undefined>(undefined);
  const [userAccount, setUserAccount] = useState<PublicKey | undefined>(undefined);
  const [price, setPrice] = useState<number | undefined>(undefined);
  return (
    <div>
      <PriceBar price={price} setPrice={setPrice} />
      <div className="flex flex-wrap w-full md:h-36 items-center justify-between">
        <Phantom 
          setWalletPubKey={setWalletPubKey} 
          walletPubKey={walletPubKey} 
          setConnection={setConnection} 
          provider={provider}
          setProvider={setProvider}
        />
        <Account 
          walletPubKey={walletPubKey} 
          connection={connection} 
          provider={provider} 
          userAccount={userAccount}
          setUserAccount={setUserAccount}
        />
      </div>
      <div className="pb-24">
        <Navigator 
            userAccount={userAccount} 
            connection={connection} 
            provider={provider} 
            walletPubKey={walletPubKey}  
            price={price}
        />
      </div>
    </div>
  )
}

export default ContainerMain;
