// https://www.becomebetterprogrammer.com/web3-react-connect-to-phantom/

import { useEffect } from "react";
import { PhantomProvider, RPC_URL } from "./Types";
import { Connection } from '@solana/web3.js';
import Button from '@mui/material/Button';


type Props = {
  setWalletPubKey: React.Dispatch<React.SetStateAction<any>>;
  walletPubKey: PhantomProvider | undefined;
  setConnection: React.Dispatch<React.SetStateAction<any>>;
  provider: PhantomProvider | undefined;
  setProvider: React.Dispatch<React.SetStateAction<any>>;
};

function Phantom({setWalletPubKey, walletPubKey, setConnection, provider, setProvider}: Props) {

  // Get Provider
  const getProvider = (): PhantomProvider | undefined => {
    if ("solana" in window) {
      // @ts-ignore
      const provider = window.solana as any;
      if (provider.isPhantom) return provider as PhantomProvider;
    }
  };

  // Connect Wallet
  const connectWallet = async () => {
    // @ts-ignore
    const { solana } = window;

    if (solana) {
      try {
        const response = await solana.connect();
        setWalletPubKey(response.publicKey.toString());
        const connection = new Connection(RPC_URL, "confirmed");
        if (connection?.commitment === "confirmed") {
          setConnection(connection);
        } else {
          alert("There was an issue connection to the Solana Cluster. Please try again later.");
        }
      } catch (err) {
        // { code: 4001, message: 'User rejected the request.' }
      }
    }
  };

  // Disconnect Wallet
  const disconnectWallet = async () => {
    // @ts-ignore
    const { solana } = window;

    if (walletPubKey && solana) {
      await (solana as PhantomProvider).disconnect();
      setWalletPubKey(undefined);
    }
  };

  // Manager Provider Check
  const providerManager = (provider: PhantomProvider | undefined) => {
    if (provider) setProvider(provider);
    else setProvider(undefined);
  }

  // Check for provider
  useEffect(() => {
    const provider = getProvider();
    providerManager(provider);
  }, []);

  return (
    <div className="flex flex-col justify-center w-full md:w-2/5
                    md:border-b-2 border-t-0 md:border-r-0  border-gray-700
                    md:h-full md:p-7 py-3 px-4 bg-gray-900 text-gray-200">
      {provider && !walletPubKey && (
        <Button onClick={connectWallet} variant="contained" color="secondary">Connect to Phantom Wallet</Button>
      )}

      {provider && walletPubKey && (
        <div>
          <div className="font-light text-[8pt] text-gray-300">Connected account </div>
          <div className="text-gray-100 mt-1 font-light sm:text-md md:text-xs lg:text-md"><>{walletPubKey}</></div>
          <Button onClick={disconnectWallet} variant="text" color="secondary">Disconnect Wallet</Button>
        </div>
      )}

      {!provider && (
        <p>
          No provider found. Install{" "}
          <a href="https://phantom.app/" className="text-purple-700">Phantom Browser extension</a>
        </p>
      )}
    </div>
  );
}

export default Phantom;