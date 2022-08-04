import { useEffect, useState } from 'react';
import { PublicKey, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { PhantomProvider, PROGRAM_ID } from '../wallet/Types';
import { Refresh } from '@mui/icons-material';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import * as borsh from "@project-serum/borsh";
import Menu from './Menu';
import OpenTrade from '../opentrade/OpenTrade';
import Claimed from './Claimed';
import Orderbook from './Orderbook';
import OpenOrders from './OpenOrders';
import InPlay from './InPlay';
import ToClaim from './ToClaim';
import About from './About';

// Define User Account Struct
const USER_ACCOUNT_DATA_LAYOUT = borsh.struct([
  borsh.u32("trades_placed"),
]);

// Define Trade Account Struct
const TRADE_ACCOUNT_DATA_LAYOUT = borsh.struct([
  borsh.publicKey("maker"),
  borsh.publicKey("taker"),
  borsh.publicKey("trade_account"),
  borsh.u8("bump"),
  borsh.str("slug"),
  borsh.str("symbol"),
  borsh.u8("contract_size"),
  borsh.u8("direction"),
  borsh.u8("duration"),
  borsh.u32("unix_created"),
  borsh.u32("unix_start"),
  borsh.u32("unix_end"),
  borsh.i128("benchmark_price"),
  borsh.i128("closing_price"),
  borsh.u8("order_status"),
]);

type Props = {
  walletPubKey: String | undefined,
  connection: Connection | undefined,
  provider: PhantomProvider | undefined,
  userAccount: PublicKey | undefined,
  price: number | undefined,
};

export default function Navigator({ walletPubKey, connection, provider, userAccount, price }: Props) {
  const [page, setPage] = useState<String>("ORDER BOOK");
  const [claimed, setClaimed] = useState<Array<any>>([]);
  const [openOrders, setOpenOrders] = useState<Array<any>>([]);
  const [inPlay, setInPlay] = useState<Array<any>>([]);
  const [toClaim, setToClaim] = useState<Array<any>>([]);
  const [isShowOpenOrder, setIsShowOpenOrder] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get All Account Information
  const getAllProgramAccounts = async () => {

    // Initialise Loading
    setIsLoading(true);

    // Get Data
    if (connection) {
      const accounts = await connection.getProgramAccounts(PROGRAM_ID, "confirmed");

      // Get Solana Unix Timestamp
      const slot = await connection.getSlot();
      const timestamp = await connection.getBlockTime(slot);

      // Initialize Arrays
      const claimedArr: any = [];
      const openOrdersArr: any = [];
      const inPlayArr: any = [];
      const toClaimArr: any = [];

      // const openOrdersArr = [];
      accounts.forEach((account) => {

        // Decode User Data
        if (account.account.data.length === 4) {
          const accountData = USER_ACCOUNT_DATA_LAYOUT.decode(account.account.data);

        // Decode Trade Account Data
        } else if (account.account.data.length !== 4 && timestamp) {

          // Decode Data
          const accountData = TRADE_ACCOUNT_DATA_LAYOUT.decode(account.account.data);

          // Allocate Data
          if (accountData.order_status === 1) openOrdersArr.push(accountData)
          if (accountData.order_status === 2 && accountData.unix_end > timestamp) inPlayArr.push(accountData)
          if (accountData.order_status === 2 && accountData.unix_end < timestamp) toClaimArr.push(accountData)
          if (accountData.order_status === 3) claimedArr.push(accountData)
        }

        // Store Data in State
        setClaimed(claimedArr);
        setOpenOrders(openOrdersArr);
        setInPlay(inPlayArr);
        setToClaim(toClaimArr);
      })

      setIsLoading(false);
    }
  }

  // Trigger Account Retrieve
  useEffect(() => {
    if (connection && userAccount) {
      getAllProgramAccounts();
    }
  }, [connection, userAccount, provider])

  return (
    <>
      <div>
        {connection && userAccount && (
          <>
            <div  className="flex justify-between items-center mt-6 text-leftspace-x-2 px-6">
              <div onClick={getAllProgramAccounts} className="flex cursor-pointer hover:text-sky-600 ">
                <Refresh className="hover:text-sky-700" /> <div className="">Refresh</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-xs text-sky-500">
                  <a target="_blank" href="https://explorer.solana.com/address/Hp519DFatkWkf1dVVYum8xQZwY6Qzr8PaKzKQU5of6KK?cluster=devnet">
                    {PROGRAM_ID.toBase58()}
                  </a>
                </div>
                <div className="text-[7pt]">PROGRAM CONTRACT ADDERSS</div>
              </div>
            </div>
            <Menu page={page} setPage={setPage} setIsShowOpenOrder={setIsShowOpenOrder} />
          </>
        )}


        {isLoading && connection && (<div className="mt-12 w-11/12 mx-auto">
            <LinearProgress />
            <div className="text-sm mt-1 italic text-sky-700">loading...</div>
          </div>
        )}

        {page === "ORDER BOOK" && connection && !isLoading && (
          <Orderbook 
            openOrders={openOrders} 
            price={price} 
            userAccount={userAccount} 
            walletPubKey={walletPubKey}
            connection={connection}
            provider={provider}
        />)}

        {page === "OPEN ORDERS" && connection && !isLoading && (
          <OpenOrders 
            openOrders={openOrders} 
            price={price} 
            userAccount={userAccount} 
            walletPubKey={walletPubKey}
            connection={connection}
            provider={provider}
        />)}

        {page === "TO CLAIM" && connection && inPlay && !isLoading && (
          <ToClaim 
            toClaim={toClaim} 
            price={price} 
            userAccount={userAccount}
            walletPubKey={walletPubKey}
            connection={connection}
            provider={provider}
          />
        )}

        {page === "CLAIMED" && claimed && connection && !isLoading && <Claimed claimed={claimed} price={price} userAccount={userAccount} />}

        {page === "IN PLAY" && inPlay && connection && !isLoading && <InPlay inPlay={inPlay} price={price} userAccount={userAccount} />}

        {page === "ABOUT" && <About />}

        {/* Open Trade Modal */}
        {isShowOpenOrder && connection && !isLoading &&
          <OpenTrade 
            setIsShowOpenOrder={setIsShowOpenOrder} 
            connection={connection}
            provider={provider}
            userAccount={userAccount}
            walletPubKey={walletPubKey}
          />
        }
      </div>
    </>
  );
}
