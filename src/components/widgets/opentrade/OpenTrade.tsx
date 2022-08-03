import { useEffect, useState } from 'react'
import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { PhantomProvider, PROGRAM_ID, accountChainlinkPriceFeed, accountChainlinkProgramOwner } from '../wallet/Types';
import * as borsh from "@project-serum/borsh";
import { serialize } from "borsh";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from "@mui/material/Button";


// Structure of User Account for deserialisation
const USER_ACCOUNT_DATA_LAYOUT = borsh.struct([
  borsh.u32("trades_placed"),
]);

// Structure for Trade Instruction
class MakeIx {
  tag: number; symbol: string; slug: string; contract_size: number; direction: number; duration: number;
  constructor(tag: number, symbol: string, slug: string, contract_size: number, direction: number, duration: number) {
    this.tag = tag;
    this.symbol = symbol;
    this.slug = slug;
    this.contract_size = contract_size;
    this.direction = direction;
    this.duration = duration;
  }
}



type Props = {
  walletPubKey: String | undefined,
  connection: Connection | undefined,
  provider: PhantomProvider | undefined,
  userAccount: PublicKey | undefined,
  setIsShowOpenOrder: React.Dispatch<React.SetStateAction<any>>,
};

function OpenTrade({ walletPubKey, connection, provider, userAccount, setIsShowOpenOrder }: Props) {
  const [symbol, setSymbol] = useState<string>("SOL / USDT");
  const [duration, setDuration] = useState<string>("0");
  const [contractSize, setContractSize] = useState<string>("1");
  const [direction, setDirection] = useState<string>("0");
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);

  const handleSymbolChange = (event: SelectChangeEvent) => {
    setSymbol(event.target.value as string);
  };

  const handleDurationChange = (event: SelectChangeEvent) => {
    setDuration(event.target.value as string);
  };

  const handleContractSizeChange = (event: SelectChangeEvent) => {
    setContractSize(event.target.value as string);
  };

  const handleDirectionChange = (event: SelectChangeEvent) => {
    setDirection(event.target.value as string);
  };

  const makeMarket = async () => {
    if (connection && provider && userAccount && walletPubKey &&
      direction && duration && contractSize && symbol ) {

      // Setup wallet
      const wallet = new PublicKey(walletPubKey);

      // Get User Account Trades Count (for slug)
      const userAccountInfo = await connection.getAccountInfo(userAccount);
      const userAccountData = USER_ACCOUNT_DATA_LAYOUT.decode(userAccountInfo?.data);
      const SLUGN = USER_ACCOUNT_DATA_LAYOUT.decode(userAccountInfo?.data).trades_placed;

      // Build Instruction for Blog with Post]
      const tradeIx = new MakeIx(
        2, 
        "SOL / USD", 
        "trade" + SLUGN, 
        Number(contractSize), 
        Number(direction), 
        Number(duration)
      );
      const schema = new Map([[MakeIx, { kind: 'struct', fields: [['tag', 'u8'], ['symbol', 'string'], ['slug', 'string'], ['contract_size', 'u8'], ['direction', 'u8'], ['duration', 'u8']]}]]);
      const instruction_data = serialize(schema, tradeIx);

      // Generate PDA
      const [tradeAccount] = await PublicKey.findProgramAddress(
        [Buffer.from("trade"), Buffer.from(tradeIx.slug), wallet.toBuffer()],
        PROGRAM_ID
      );

      // System Program (Needed for PDA Creation in Program)
      const systemProgramId = SystemProgram.programId;

      // Determine Instruction Accounts
      let ixAccounts = [
        {pubkey: wallet, isSigner: true, isWritable: false},
        {pubkey: userAccount, isSigner: false, isWritable: true},
        {pubkey: tradeAccount, isSigner: false, isWritable: true},
        {pubkey: systemProgramId, isSigner: false, isWritable: false},
        {pubkey: accountChainlinkPriceFeed, isSigner: false, isWritable: false},
        {pubkey: accountChainlinkProgramOwner, isSigner: false, isWritable: false},
      ];

      // Call Transaction
      const tx_ix = new TransactionInstruction({
        keys: ixAccounts,
        programId: PROGRAM_ID,
        data: Buffer.from(instruction_data),
      });

      // Create Transaction
      const blockhash = await connection.getLatestBlockhash('finalized');
      const createAccountTransaction = new Transaction({
        feePayer: provider.publicKey,
        recentBlockhash: blockhash.blockhash
      }).add(tx_ix);

      // Sign Transaction
      const signature = await provider.signTransaction(createAccountTransaction);
      console.log("Signature: \n", signature);

      // Send Transaction
      const id = await connection.sendRawTransaction(createAccountTransaction.serialize());
      console.log("Id: \n", signature);

      // Confirm Transaction
      const confirmation = await connection.confirmTransaction(id);
      console.log("Confirmation: \n", confirmation);

      // Show Error
      if (!confirmation?.context?.slot) {
        alert("Failed to Create Order. Have you deposited enough DevNet Facuet SOL? WARNING! DO NOT USE REAL SOL!!!");
      } else {
        setOrderSuccess(true);
      }
    }
  }

  return (
    <>
      <div className="fixed top-0 w-screen h-screen bg-black opacity-50 z-0"></div>
      <div className="fixed h-auto mx-auto w-11/12 sm:w-3/4 md:w-3/4 inset-x-0 md:top-30 top-20 bg-white rounded shadow z-50 py-12 px-4">
        <h2><b>Create Market</b></h2>
        <p className="px-7 md:px-12 mt-4 text-sm text-gray-700">
          There's no trading without a market maker. Welcome to changing history. By making a market here,
          you are enabling others to place trades too, without any exchange fees other than blockchain transcation fees.
          Meaning, these should be the closest to a 2.0 payout you'll ever get.
        </p>
        <br />

        <div className="flex flex-col w-full lg:w-2/3 mx-auto mt-5 space-y-7">
          <FormControl fullWidth>
            <InputLabel id="symbol-label">Symbol (Currently only SOL / USD)</InputLabel>
            <Select
              labelId="symbol-label"
              id="symbol-select"
              value={"SOL / USD"}
              label="Symbol (Currently only SOL / USD)"
              disabled={true}
              onChange={handleSymbolChange}
            >
              <MenuItem value={"SOL / USD"}>SOL / USD</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel id="duration-label">Duration</InputLabel>
            <Select
              labelId="duration-label"
              id="duration-select"
              value={duration}
              label="Duration"
              onChange={handleDurationChange}
            >
              <MenuItem value={"0"}>5 Min</MenuItem>
              <MenuItem value={"1"}>1 Hour</MenuItem>
              <MenuItem value={"2"}>1 Day</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel id="contract-size-label">Contract Size</InputLabel>
            <Select
              labelId="contract-size-label"
              id="contract-size-select"
              value={contractSize}
              label="Contract Size"
              onChange={handleContractSizeChange}
            >
              <MenuItem value={"0"}>0.1 SOL</MenuItem>
              <MenuItem value={"1"}>1.0 SOL</MenuItem>
              <MenuItem value={"2"}>5.0 SOL</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="direction-label">Direction</InputLabel>
            <Select
              labelId="direction-label"
              id="direction-select"
              value={direction}
              label="Direction"
              onChange={handleDirectionChange}
            >
              <MenuItem value={"0"}>Long</MenuItem>
              <MenuItem value={"1"}>Short</MenuItem>
            </Select>
          </FormControl>

          {/* Create or Cancel */}
          {!orderSuccess && 
            <div className="flex justify-between items-center">
              <Button onClick={makeMarket} variant="contained" color="info">Place Order</Button>
              <Button onClick={() => setIsShowOpenOrder(false)} variant="outlined" color="error">
                Cancel
              </Button>
            </div>
          }

          {/* Confirmation */}
          {orderSuccess && (
            <>
              <div className="flex justify-between items-center">
              <div className="text-green-600 text-lg">Order Placed Successfully</div>
                <Button onClick={() => setIsShowOpenOrder(false)} variant="outlined" color="error">
                  Close
                </Button>
              </div>
            </>
          )}
          

        </div>

      </div>
    </>
  )
}

export default OpenTrade