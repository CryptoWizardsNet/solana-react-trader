// import { useEffect } from "react";
// import { PhantomProvider, PROGRAM_ID } from "../wallet/Types";
// import {
//   Keypair,
//   Connection,
//   PublicKey,
//   SystemProgram,
//   Transaction,
// } from "@solana/web3.js";
// import Button from "@mui/material/Button";

// type Props = {
//   walletPubKey: String | undefined,
//   connection: Connection | undefined,
//   provider: PhantomProvider | undefined,
// };

// function Account({ walletPubKey, connection, provider }: Props) {
//   // Create a Trading Account
//   const createAccount = async () => {
//     if (connection && walletPubKey && provider) {
//       // Build Transaction
//       const blockhash = await connection.getLatestBlockhash("finalized");
//       if (blockhash?.blockhash) {
//         const userSpace = 4; // Bytes needed for User Account with one u8 field
//         const userAccount = Keypair.generate();
//         const rentExemptionAmount =
//           await connection.getMinimumBalanceForRentExemption(userSpace);
//         const walletPK = new PublicKey(walletPubKey);
//         const createUserAccountParams = {
//           fromPubkey: walletPK,
//           newAccountPubkey: userAccount.publicKey,
//           lamports: rentExemptionAmount,
//           space: userSpace,
//           programId: PROGRAM_ID,
//         };

//         // Create Transaction
//         const createAccountTransaction = new Transaction({
//           feePayer: provider.publicKey,
//           recentBlockhash: blockhash.blockhash,
//         }).add(SystemProgram.createAccount(createUserAccountParams));

//         // Sign Transaction
//         const signature = await provider.signTransaction(
//           createAccountTransaction
//         );
//         createAccountTransaction.partialSign(userAccount);
//         console.log("Signature: \n", signature);

//         // Send Transaction
//         const id = await connection.sendRawTransaction(
//           createAccountTransaction.serialize()
//         );
//         console.log("Id: \n", signature);

//         // Confirm Transaction
//         const confirmation = await connection.confirmTransaction(id);
//         console.log("Confirmation: \n", confirmation);
//       }
//     }
//   };

//   // Get Accounts related to user from Blockchain
//   useEffect(() => {
//     if (walletPubKey) {
//     }
//   }, [walletPubKey]);

//   return (
//     <div className="flex flex-col justify-center w-1/2 border-2 h-full px-4">
//       <Button onClick={createAccount} variant="outlined" color="success">
//         Create Trading Account
//       </Button>
//       <div>{walletPubKey}</div>
//     </div>
//   );
// }

// export default Account;
