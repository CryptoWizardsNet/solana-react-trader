import React from 'react'
import { PublicKey } from '@solana/web3.js';
import { copyClipboard } from "../wallet/Types"
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { FlagCircle } from '@mui/icons-material';

type Props = {
  claimed: Array<any>;
  price: number | undefined;
  userAccount: PublicKey | undefined;
}

function Claimed({ claimed, price, userAccount }: Props) {

  return (
    <div className="mt-5">      
      {claimed.length === 0 && <>
        <p>You have no trades claimed.</p>
      </>}
      {claimed.length > 0 && userAccount && (
      <>
        <div className="mb-5">All orders that you or your trading counterpart have claimed</div>
        {claimed?.map((tradeData) => {
          let isUsers = false;
          const maker = new PublicKey(tradeData.maker).toBase58();
          const taker = new PublicKey(tradeData.taker).toBase58();
          const startDate = new Date(tradeData.unix_start * 1000).toLocaleString();
          const endDate = new Date(tradeData.unix_end * 1000).toLocaleString();
          if (maker === userAccount.toBase58() || taker === userAccount.toBase58()) isUsers = true;
          if (isUsers) {
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
                          className={Number(price) - Number(tradeData.benchmark_price / 100000000) > 0 ? "text-green-500" : "text-red-500"}
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
                    <div className="px-4 py-3 bg-gray-200 text-sm">{startDate}</div>
                    <div className="px-4 py-3 bg-gray-200 text-sm">{endDate}</div>
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
                        {(tradeData.closing_price > tradeData.benchmark_price && tradeData.direction === 0) &&
                          <>
                          <div className="text-2xl text-green-700">Maker</div>
                          <div className="text-xs text-green-700">Winner - (Long)</div>
                        </>
                        }
                        {(tradeData.closing_price < tradeData.benchmark_price && tradeData.direction === 0) &&
                          <>
                          <div className="text-2xl text-red-700">Taker</div>
                          <div className="text-xs text-red-700">Winner - (Short)</div>
                        </>
                        }
                        {(tradeData.closing_price > tradeData.benchmark_price && tradeData.direction === 1) &&
                          <>
                            <div className="text-2xl text-green-700">Taker</div>
                            <div className="text-xs text-green-700">Winner - (Long)</div>
                          </>
                        }
                        {(tradeData.closing_price < tradeData.benchmark_price && tradeData.direction === 1) &&
                          <>
                          <div className="text-2xl text-red-700">Maker</div>
                          <div className="text-xs text-red-700">Winner - (Short)</div>
                        </>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          } else {
            <div>
              <p>You have not claimed any profit from any trades.</p>
              <p>
                Either party can redeem a trade. The profit will always go to the winner based on the Chainlink provided
                SOL / USD price at the time of redeeming. If a trader fails to redeem, the price the moves against them and the 
                counterparty then redeems at a favourable price, the counterparty will receive the profit. However, if the price remains
                favourable for the trader in question, they will receive the profit.
              </p>
          </div>
          }
        })}
      </>
    )}</div>
  )
}

export default Claimed