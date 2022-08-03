import React from 'react'
import { PublicKey, Connection } from '@solana/web3.js';
import { copyClipboard, PhantomProvider } from "../wallet/Types"
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { FlagCircle } from '@mui/icons-material';
import { takeTrade } from "../wallet/TakeOrder";

type Props = {
  openOrders: Array<any>;
  price: number | undefined;
  userAccount: PublicKey | undefined;
  walletPubKey: String | undefined;
  connection: Connection | undefined,
  provider: PhantomProvider | undefined,
}

function OpenOrders({ openOrders, price, userAccount, walletPubKey, connection, provider }: Props) {

  const handleTrade = (tradeData: any) => {
    if (tradeData && userAccount && walletPubKey && connection && provider) {
      const passTrade = {
        tradeData,
        userAccount,
        walletPubKey,
        connection,
        provider
      }
      const tradeResult = takeTrade(passTrade);
      if (!tradeResult) {
        alert("Something went wrong. Please check our DevNet SOL Balance. DO NOT USE REAL SOL!!!");
      }
    }
  }

  return (
    <div className="mt-7">      
      {openOrders && userAccount && (
      <div className="">
        {openOrders?.map((tradeData) => {
          let isUsers = false;
          const maker = new PublicKey(tradeData.maker).toBase58();
          const taker = new PublicKey(tradeData.taker).toBase58();
          const tradeAccount = new PublicKey(tradeData.trade_account).toBase58();
          const createdDate = new Date(tradeData.unix_created * 1000).toLocaleString();
          if (maker === userAccount.toBase58() || taker === userAccount.toBase58()) isUsers = true;
          
          return (
            <div key={maker + taker + tradeData.slug} 
              className="flex flex-col relative md:mx-10 mx-6 mb-5 border-gray-200 border-[1px] px-4 py-2 bg-gray-50"
            >

              {/* Mark if Relates tp User Trade*/}
              {isUsers && <div className="absolute -left-3 -top-3 text-purple-600"><FlagCircle /></div>}

               {/* Row */}
              <div className="flex flex-wrap lg:flex-row mb-2">


                {/* Symbol */}
                <div className="mr-3 mt-2 flex flex-col justify-center w-24 py-4 bg-gray-200 border-[1px] border-gray-200">
                  <button onClick={() => copyClipboard(tradeAccount)} className="text-sky-500 mb-1">Contract</button>
                  <div className="text-ls text-gray-900">{tradeData.symbol}</div>
                  <div className="text-xs">Asset</div>
                </div>

                {/* Market */}
                <div className="mr-3 mt-2 flex flex-col justify-center w-24 py-4 bg-gray-200 border-[1px] border-gray-200">
                  {tradeData.duration === 0 && (<div className="text-xl text-gray-900">5 Min</div>)}
                  {tradeData.duration === 1 && (<div className="text-xl text-gray-900">1 Hour</div>)}
                  {tradeData.duration === 2 && (<div className="text-xl text-gray-900">24 Hour</div>)}
                  <div className="text-xs">Market</div>
                </div>

                {/* Maker */}
                <div className="mr-3 mt-2 flex flex-col items-center justify-center w-24 py-3 bg-gray-200 border-[1px] border-gray-200">
                  <button onClick={() => copyClipboard(maker)} className="text-sky-500 mb-1">Maker</button>
                  {tradeData.direction === 0 ? <ArrowUpward color="success" /> : <ArrowDownward color="error" />}
                  {tradeData.direction === 0 ? <div className="text-xs text-green-700">Long</div> : <div className="text-xs text-red-700">Short</div> }
                </div>

                {/* Winnings */}
                <div className="flex flex-grow">
                  <div className="mr-3 mt-2 flex flex-col w-full items-center justify-center py-4 bg-gray-100 border-[1px] border-gray-100">
                    <div className="text-xs">Wager</div>
                    <div className="text-gray-700 text-xl">
                      {tradeData.contract_size === 0 && <div>0.1 SOL</div>}
                      {tradeData.contract_size === 1 && <div>1.0 SOL</div>}
                      {tradeData.contract_size === 2 && <div>5.0 SOL</div>}
                    </div>
                    <div className="text-xs italic">(+ rent)</div>
                  </div>
                </div>

                {/* Winnings */}
                <div className="flex flex-grow">
                  <div className="mr-3 mt-2 flex flex-col w-full items-center justify-center py-4 bg-gray-100 border-[1px] border-gray-100">
                    <div className="text-xs">Created On</div>
                    <div className="text-gray-700 text-md">{createdDate}</div>
                    <div className="text-xs italic">(Solana Unix Timestamp)</div>
                  </div>
                </div>

                {/* Taker */}
                <div onClick={() => handleTrade(tradeData)} className="mr-3 mt-2 flex flex-col cursor-pointer items-center justify-center w-full md:w-auto py-3 px-4 bg-gray-100 border-[1px] border-gray-200">
                  <button className="text-sky-500 mb-1">{isUsers ? "CLOSE ORDER" : "TAKE ORDER"}</button>
                  {tradeData.direction !== 0 ? <ArrowUpward color="success" /> : <ArrowDownward color="error" />}
                  {tradeData.direction !== 0 ? <div className="text-xs text-green-700">Long</div> : <div className="text-xs text-red-700">Short</div> }
                </div>

              </div>
            </div>
          );
        })}
      </div>
    )}</div>
  )
}

export default OpenOrders