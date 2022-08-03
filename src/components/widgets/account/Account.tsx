import { useEffect, useState } from 'react'
import { PhantomProvider, PROGRAM_ID } from '../wallet/Types';
import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Refresh } from '@mui/icons-material';
import Button from '@mui/material/Button';

import { Buffer } from 'buffer';
window.Buffer = window.Buffer || require("buffer").Buffer;


type Props = {
  walletPubKey: String | undefined,
  connection: Connection | undefined,
  provider: PhantomProvider | undefined,
  userAccount: PublicKey | undefined,
  setUserAccount: React.Dispatch<React.SetStateAction<any>>,
};

function Account({walletPubKey, connection, provider, userAccount, setUserAccount}: Props) {
  const [userAccountBalance, setUserAccountBalance] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [depositSOL, setDepositSOL] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check for a User Account relating to wallet
  const checkUserBalance = async () => {
    setIsLoading(true);
    if (connection && walletPubKey && provider && userAccount) {

      const userAccountInfo = await connection.getAccountInfo(userAccount);
      if (userAccountInfo) {
        setUserAccountBalance(userAccountInfo.lamports / LAMPORTS_PER_SOL);
      }
      const walletAccountInfo = await connection.getAccountInfo(new PublicKey(walletPubKey));
      if (walletAccountInfo) {
        setWalletBalance(walletAccountInfo.lamports / LAMPORTS_PER_SOL);
      }
    }
    setIsLoading(false);
  }

  // Add Funds
  const addFunds = async () => {
    if (connection && walletPubKey && provider && userAccount ) {

      // Guards
      if (isNaN(depositSOL) || !depositSOL) return alert("Quantity Must Be A Number");
      if (depositSOL >= Number(walletBalance) ) return alert("Not enough DevNet Facuet SOL. DO NOT USE REAL SOL!");

      // Structure Transaction
      const tx_ix = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: new PublicKey(walletPubKey),
            toPubkey: userAccount,
            lamports: LAMPORTS_PER_SOL * depositSOL, // Send x1 SOL
        })
      );
      
      // Build Transaction
      const blockhash = await connection.getLatestBlockhash('finalized');
      const addFundsTransaction = new Transaction({
        feePayer: provider.publicKey,
        recentBlockhash: blockhash.blockhash
      }).add(tx_ix);

      // Sign Transaction
      const signature = await provider.signTransaction(addFundsTransaction);
      console.log("Signature: \n", signature);

      // Send Transaction
      const id = await connection.sendRawTransaction(addFundsTransaction.serialize());
      console.log("Id: \n", signature);

      // Confirm Transaction
      const confirmation = await connection.confirmTransaction(id);
      console.log("Confirmation: \n", confirmation);

      // Show if Error else check balance
      if (!confirmation?.context?.slot) {
        alert("Failed to Add Funds. Do you have enough DevNet Faucet SOL in your Wallet? WARNING! DO NOT USE REAL SOL!!!");
      } {
        checkUserBalance();
      }
    }
  }

// Add Funds
const withdrawFunds = async () => {
  if (connection && walletPubKey && provider && userAccount) {

    // Determine Instruction Accounts
    const wallet = new PublicKey(walletPubKey);
    let ixAccounts = [
      {pubkey: wallet, isSigner: true, isWritable: false},
      {pubkey: userAccount, isSigner: false, isWritable: true},
    ];

    // Structure Transaction
    const tx_ix = new TransactionInstruction({
      keys: ixAccounts,
      programId: PROGRAM_ID,
      data: Buffer.from(new Uint8Array([1, 0])), // 1 = Withdraw All Except Rent, Other 0 is due to 'rest' formula used in Program
    });
    
    // Build Transaction
    const blockhash = await connection.getLatestBlockhash('finalized');
    const addFundsTransaction = new Transaction({
      feePayer: provider.publicKey,
      recentBlockhash: blockhash.blockhash
    }).add(tx_ix);

    // Sign Transaction
    const signature = await provider.signTransaction(addFundsTransaction);
    console.log("Signature: \n", signature);

    // Send Transaction
    const id = await connection.sendRawTransaction(addFundsTransaction.serialize());
    console.log("Id: \n", signature);

    // Confirm Transaction
    const confirmation = await connection.confirmTransaction(id);
    console.log("Confirmation: \n", confirmation);

    // Show if Error else check balance
    if (!confirmation?.context?.slot) {
      alert("Failed to Withdraw Funds. Your Trading Account Needs a minimum number of lamports to stay alive? WARNING! DO NOT USE REAL SOL!!!");
    } {
      checkUserBalance();
    }
  }
}

  // Check for User Account
  const checkUserAccount = async () => {
    if (walletPubKey) {
      const wallet = new PublicKey(walletPubKey);
      const [userAccount] = await PublicKey.findProgramAddress(
        [Buffer.from("user"), wallet.toBuffer()],
        PROGRAM_ID
      );
      setUserAccount(userAccount);
    }
  }

  // Create a Trading Account
  const createAccount = async () => {
    if (connection && walletPubKey && provider && userAccount) {

      // System Program (Needed for PDA Creation in Program)
      const systemProgramId = SystemProgram.programId;

      // Determine Instruction Accounts
      let wallet = new PublicKey(walletPubKey);
      let ixAccounts = [
        {pubkey: wallet, isSigner: true, isWritable: false},
        {pubkey: userAccount, isSigner: false, isWritable: true},
        {pubkey: systemProgramId, isSigner: false, isWritable: false},
      ];

      // Setup Transaction
      const tx_ix = new TransactionInstruction({
        keys: ixAccounts,
        programId: PROGRAM_ID,
        data: Buffer.from(new Uint8Array([0, 0])), // 0 = Create User Account, Other 0 is due to 'rest' formula used in Program
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
        alert("Account Creation Failed. Have you Deposited DevNet Facuet SOL? WARNING! DO NOT USE REAL SOL!!!");
      } else {
        checkUserBalance();
      }
    }
  }

  useEffect(() => {
    if (userAccount) {
      checkUserBalance();
    }
  }, [userAccount])

  useEffect(() => {
    if (connection && walletPubKey && provider) {
      checkUserAccount();
    }
  }, [connection, walletPubKey, provider]);

  return (
    <div className="flex flex-col justify-center w-full md:w-3/5 
                    border-b-2 border-t-2 md:border-t-0 md:border-l-2  border-gray-700
                    h-full p-7 bg-gray-800 text-gray-200">
      {userAccountBalance === 0 && walletPubKey && (
        <Button onClick={createAccount} variant="contained" color="info">Create Trading Account</Button>
      )}
      {userAccountBalance !== 0 && walletPubKey && (
        <>
        <div className="flex justify-between items-center space-x-4">
          <div className="flex md:w-1/2 w-auto justify-start space-x-4">
            <Button onClick={addFunds} variant="contained" color="success">Deposit</Button>
            <input 
                className="bg-gray-700 w-12 text-center rounded border-green-600 border-[1px]"
                defaultValue={depositSOL}
                onChange={(e) => setDepositSOL(Number(e?.target?.value))}
            />
            <Button onClick={withdrawFunds} variant="outlined" color="info">Withdraw</Button>
          </div>
          <div className="w-auto md:w-1/2">
            <a href="https://solfaucet.com/" target="_blank" className="w-full">
              <Button className="w-full" variant="contained" color="secondary">Airdrop</Button>
            </a>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm mt-2">
          <div className="flex flex-col items-start">
            <div className="font-medium text-lg">{userAccountBalance}</div>
            <div className="font-light text-sm">Trading Account</div>
          </div>
          <div className="flex items-center space-x-4">
            {!isLoading && (
              <>
                <div className="cursor-pointer" onClick={checkUserBalance}>
                  <Refresh color="info" />
                </div>
                <div className="flex flex-col items-end">
                  <div className="font-medium text-lg">{walletBalance}</div>
                  <div className="font-light text-sm">Wallet Balance</div>
                </div>
              </>
            )}
            {isLoading && 
              <>
                <div className="cursor-pointer">
                  <Refresh />
                </div>
                <div className="flex flex-col items-end">
                  <div className="font-medium text-lg text-right">Checking...</div>
                  <div className="font-light text-sm">Wallet Balance</div>
                </div>
              </>
            }
          </div>
        </div>
        </>
      )}
    </div>
  )
}

export default Account
