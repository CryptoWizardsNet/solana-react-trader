import { useEffect, useState } from "react";
import axios from "axios";

type Props = {
  price: number | undefined;
  setPrice: React.Dispatch<React.SetStateAction<any>>;
};

function PriceBar({price, setPrice}: Props) {

  useEffect(() => {
    const price = axios.get("https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT")
    .then((result) => {setPrice(Number(result.data.price))})
    .catch((error) => {alert("Issue Retrieving Price Information from Binance. Try again later.")});
    setInterval(() => {
      console.log("Retieving price from Binance");
      const price = axios.get("https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDT")
      .then((result) => {setPrice(Number(result.data.price))})
      .catch((error) => {alert("Issue Retrieving Price Information from Binance. Try again later.")});
    }, 5000);
  }, []);

  return (
    <div className="flex justify-between items-center w-full py-2 bg-gray-900 border-b-[1px] border-gray-600 px-4">
      <div className="text-gray-300">SOLUSDT</div>
      <div className="text-sky-400 text-2xl">{price}</div>
    </div>
  );
}

export default PriceBar;
