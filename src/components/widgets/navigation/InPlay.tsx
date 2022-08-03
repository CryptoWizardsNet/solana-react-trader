import React from 'react'
import { PublicKey } from '@solana/web3.js';
import { copyClipboard } from "../wallet/Types"
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { FlagCircle } from '@mui/icons-material';

type Props = {
  inPlay: Array<any>;
  price: number | undefined;
  userAccount: PublicKey | undefined;
}

function InPlay({ inPlay, price, userAccount }: Props) {

  const checkWinning = (direction: number, isMaker: boolean, currentPrice: number, benchPrice: number) => {
   
      if (direction === 0 && currentPrice > benchPrice) {
        return "Maker"
      }
      if (direction === 0 && currentPrice < benchPrice) {
        return "Taker"
      }
      if (direction === 1 && currentPrice > benchPrice) {
        return "Taker"
      }
      if (direction === 1 && currentPrice < benchPrice) {
        return "Maker"
      }
    
  }

  return (
    <div className="mt-7">      
      {inPlay && userAccount && (
      <>
        {inPlay?.map((tradeData) => {
          let isUsers = false;
          let isMaker = false;
          let isTaker = false;
          const maker = new PublicKey(tradeData.maker).toBase58();
          const taker = new PublicKey(tradeData.taker).toBase58();
          const tradeAccount = new PublicKey(tradeData.trade_account).toBase58();
          const startDate = new Date(tradeData.unix_start * 1000).toLocaleString();
          const endDate = new Date(tradeData.unix_end * 1000).toLocaleString();
          const createdDate = new Date(tradeData.unix_created * 1000).toLocaleString();
          if (maker === userAccount.toBase58()) {
            isUsers = true;
            isMaker = true;
          }
          if (taker === userAccount.toBase58()) {
            isUsers = true;
            isTaker= true;
          }
          
          return (
            <div key={maker + taker + tradeData.slug} 
              className="flex flex-col relative md:mx-10 mx-6 mb-3 border-gray-200 border-[1px] px-4 py-2 bg-gray-50"
            >
              {/* Mark if Relates tp User Trade*/}
              {isUsers && <div className="absolute -left-3 -top-3 text-purple-600"><FlagCircle /></div>}

              {/* Top Row */}
              <div className="flex flex-col">
                <div className="flex justify-between items-top">
                  <div className="flex flex-col items-start">
                    <div className="text-gray-800">{tradeData.symbol}</div>
                    <div className="text-[5pt]">Chainlink Asset</div>
                  </div>
                  {price &&
                    <div className="flex flex-col items-end">
                      <div
                        className={Number(price - tradeData.benchmark_price) > 0 ? "text-green-500" : "text-red-500"}
                      >
                        {Number(price - tradeData.benchmark_price / 100000000).toFixed(2)}
                      </div>
                      <div className="text-[5pt] italic">(Current Binance Price vs Contract Chainlink Benchmark)</div>
                    </div>
                  }
                </div>
              </div>

              <hr className="mb-4 mt-5" />

               {/* Bottom Row */}
              <div className="flex flex-wrap lg:flex-row mb-2">

                {/* Market */}
                <div className="mr-3 mt-2 flex flex-col justify-center w-24 py-4 bg-gray-200 border-[1px] border-gray-200">
                  <button onClick={() => copyClipboard(tradeAccount)} className="text-sky-500 mb-1">Contract</button>
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

                {/* Taker */}
                <div className="mr-3 mt-2 flex flex-col items-center justify-center w-24 py-3 bg-gray-200 border-[1px] border-gray-200">
                  <button onClick={() => copyClipboard(taker)} className="text-sky-500 mb-1">Taker</button>
                  {tradeData.direction !== 0 ? <ArrowUpward color="success" /> : <ArrowDownward color="error" />}
                  {tradeData.direction !== 0 ? <div className="text-xs text-green-700">Long</div> : <div className="text-xs text-red-700">Short</div> }
                </div>

                {/* Times */}
                <div className="mr-3 mt-2 flex flex-col justify-between">
                  <div className="flex justify-between items-center px-4 py-1 bg-gray-200 text-sm space-x-3">
                    <div className="text-xs">Maker:</div>
                    <div className="text-xs">{createdDate}</div>
                  </div>
                  <div className="flex justify-between items-center px-4 py-1 bg-gray-200 text-sm space-x-3">
                    <div className="text-xs">Start Lock:</div>
                    <div className="text-xs">{startDate}</div>
                  </div>
                  <div className="flex justify-between items-center px-4 py-1 bg-gray-200 text-sm space-x-3">
                    <div className="text-xs">End Lock:</div>
                    <div className="text-xs">{endDate}</div>
                  </div>
                </div>

                {/* Prices */}
                <div className="mr-3 mt-2 flex flex-col justify-between">
                  <div className="px-4 py-3 bg-gray-200 text-sm">{Number(tradeData.benchmark_price / 100000000).toFixed(2)}</div>
                  <div className="px-4 py-3 bg-gray-200 text-sm">{Number(tradeData.closing_price / 100000000).toFixed(2)}</div>
                </div>

                {/* Winnings */}
                <div className="flex flex-grow">
                  <div className="mr-3 mt-2 flex flex-col w-full items-center justify-center py-4 bg-gray-200 border-[1px] border-gray-200">
                    <div className="text-xs">Winnings</div>
                    <div className="text-gray-700 text-xl">
                      {tradeData.contract_size === 0 && <div>0.1 SOL</div>}
                      {tradeData.contract_size === 1 && <div>1.0 SOL</div>}
                      {tradeData.contract_size === 2 && <div>5.0 SOL</div>}
                    </div>
                    <div className="text-xs italic">(+ rent)</div>
                  </div>
                </div>

                {/* Winner */}
                <div className="flex flex-grow">
                  <div className="mr-3 mt-2 flex flex-col w-full items-center justify-center py-4 bg-gray-200 border-[1px] border-gray-200">
                    <div>
                      {price && <div>{checkWinning(tradeData.direction, isMaker, price, tradeData.benchmark_price)} Winning</div>}
                      {isUsers && isMaker && isTaker && (
                        <div className="text-xs text-gray-600">
                          (You are on both sides)
                        </div>
                      )}
                      {isUsers && isMaker && !isTaker && (
                        <div className="text-xs text-gray-600">
                          (You are the Maker)
                        </div>
                      )}
                      {isUsers && !isMaker && isTaker && (
                        <div className="text-xs text-gray-600">
                          (You are the Taker)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </>
    )}</div>
  )
}

export default InPlay