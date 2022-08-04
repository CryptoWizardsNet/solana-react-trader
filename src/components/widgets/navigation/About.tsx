import React from 'react'

function About() {
  return (
    <>
      <div className="text-left container mx-8 w-auto md:w-4/5 lg:w-10/12 mt-5 text-sm">
        <h2><span className="font-light text-xl">WELCOME TO </span> <span className="text-xl font-bold text-purple-700">XTRADER</span></h2>
        <p>A decentralised peer to peer trading platform, with absolutely no fees going to any third parties, including the creator.</p>
        
        <br />
        <h3 className="font-medium text-sky-600 text-lg">WHO</h3>
        <ul className="list-disc ml-8">
          <li>For <i>Crypto Traders</i> who:
            <ul className="list-disc ml-8">
              <li>Want to move away from paying exchange fees (even those built into Crypto DEX's)</li>
              <li>Want to take advantage of trading based on a binary outcome, not by how much the market moves.</li>
              <li>Want to move away from getting wiped out on stop-losses, just to see the trade turn in their favour.</li>
              <li>Want to trade Options style derivatives in crypto, without rediculous bid-ask spreads.</li>
              <li>Want to practice trading without using any real funds. This is currently in DevNet only.</li>
            </ul> 
          </li>
          <br />
          <li>Created by Shaun from the CryptoWizards YouTube community for the community.</li>
        </ul>

        <br />
        <h3 className="font-medium text-sky-600 text-lg">WHAT</h3>
        <div className="mt-1">
          <p>This app is completely decentralized built on Solana as a research experiment and for education purposes only.</p>
          <br />
          <p>
            One thing the blockchain can handle extremely well, is settlement. Therefore, this application has been created for 
            crypto traders to wager their Long or Short position on an outcome happening and specify their terms of the period that their
            contract will be locked in for.
          </p>
          <br />
          <h4 className="italic text-gray-500">EXAMPLE</h4>
          <p>
            You want to bet 1 SOL that the SOL / USD price will be higher 5 minutes from now. So you decide to MAKE a market, locking in 1 SOL from 
            your trading account and then creating an order: 1 SOL will be up from the benchmark price (the price at the time your order will be match - see below), 5 
            minutes after the order is filled. At this point, nothing has happened, other than a contract being created to show your willingness to go Long.
          </p>
          <br />
          <p>
            Then, a market Taker comes along and accepts your terms. Matching you literally against one other trader. At this point, the game begins. A price 
            for SOL / USD is obtained from Chainlink on the Solana Blockchain and neither party can exit the trade until 5 minutes is up, which is when the 
            trading contract becomes <i>claimable</i>.
          </p>
          <br />
          <p>
            Once the 5 Minutes is complete, let's say that the price of SOL / USD has dropped since the price that was locked in (the benchmark price) at 
            the time the contract was filled by the Taker. Right now, neither the Taker nor the Maker have "won". However, the Taker can see that their contract 
            was right and decide to claim. At that moment when the Blockchain is called, the final price is determined as at that moment and the Taker (providing the price
            is still lower than the benchmark) receives 2.0 SOL in return. The 2.0 SOL is 1.0 SOL from the Maker's stake and 1.0 SOL of their 
            original trade - making 1.0 SOL in profit.
          </p>
          <br />
          <p className="font-light italic">Wait...why is the price not determined with the winner at exactly 5 mins in on the above example?</p>
          <br />
          <p>
            Due to a limitation in development. The creator could not find a way like with other blockchains, to get the historical price from Chainlink within the Program (Smart Contract).
            However, this also adds to the dynamic of the fun. If the winner claims on time, their should be no issue. So to be clear on this point, what determines the winner, is 
            did the price move in the direction they bet between when the Taker filled the trade and when the claim was put through - not when the duration is up. However, the duration has to fully pass 
            before a claim can be made.
          </p>
          </div>
          <br />

        <h3 className="font-medium text-sky-600 text-lg mt-2">HOW</h3>
        <div className="mt-1">
          <p>
            This application uses Solana on the backend. However, later versions will be experimented on using Sui and potential Aptos (but 
            right now Sui looks more appealing).
          </p>
          <br />
          <p>
            The front end uses React and Typescript and is launched on GitHub pages - so anyone can get all the code from the repo. Also, anyone can
            copy this and run it on their local machine or save it in Arweave for permanent storage. In fact, this is encouraged.
          </p>
        </div>
        <br />
        <h3 className="font-medium text-sky-600 text-lg">WHY</h3>
        <div className="mt-1">
          <p>
            The creator believes that the narrative online is missing the big picture. We should spend less time talking about 
            potential technology and more time finding the true flaws and improving the technology.
          </p>
          <br />
          <p className="italic ml-12">
            "
              The Blockchain I want to build on is not one that will be the fastest, but the one that offers 3 CRITICAL features that
              are missing. These are: 
              <ul className="list-disc ml-8">
                <li>Transparency on whether a Program (Smart Contract) can be modified and whether it has been locked.</li>
                <li>Transparency on the code that runs the Program (Smart Contract) in a decentralized solution.</li>
                <li>External real-time and historical price data made available both offline and online.</li>
                <li>Event scheduling in a completely decentralized way. I will happily pay network fees for this.</li>
              </ul>
              <br />
              As of right now, I don't see who is addressing these more fundamental issues with the same focus and rigger as 
              what is being put in to pump new coins and fund them with crazy amounts of money being directed into not solving problems 
              we as the users care about within our respective networks.
            " 
            <div className="mt-3 italic">Shaun</div>
          </p>
          <br />
        </div>

        <h3 className="font-medium text-sky-600 text-lg mt-2">WHEN</h3>
        <div className="mt-1">
          <p>
            Right now, this application is in DevNet. For two reasons as believe we should first test something before sticking actual 
            crypto funds into it. Also for legal reasons, one can not simply create a trading platform in the UK where the creator is based.
          </p>
          <br />
          <p>
            Even though this is to be treated as research and education only. It doesn't stop anyone getting the backend code from the github repo
            and loading it onto the mainnet. Theoretically, they would just need to change the Program ID on the React application and everything 
            should just run - but not guaranteed. Only someone with dev experience should attempt this.
          </p>
        </div>
        
        <br />
        <h3 className="font-medium text-sky-600 text-lg mt-2">EDUCATION</h3>
        <div className="mt-1 ml-4">
            <a className="text-purple-700" href="https://cryptowizards.net/">Crypto Wizards: Statistical Arbitrage and BSC Arbitrage for Retail Traders</a>
            <br/>
            <a className="text-purple-700" href="https://www.youtube.com/">Crypto Wizards: YouTube Channel</a>
            <br/>
            <a className="text-purple-700" href="https://www.udemy.com/course/machine-learning-applied-to-stock-crypto-trading-python/?referralCode=ACB1281694CF4D38F5D3">Machine Learning Applied to Stock and Crypto Trading</a>
            <br/>
            <a className="text-purple-700" href="https://www.udemy.com/course/crypto-trading-execution-with-flash-loans-web3-and-hardhat/?referralCode=3955B610321F68920F4D">Crypto Trading Execution with Flash Loans, Web3 and Hardhat</a>
            <br/>
            <a className="text-purple-700"  href="https://www.udemy.com/course/statistical-arbitrage-bot-build-in-crypto-with-python-a-z/?referralCode=07BDBF10B20BBE2E0328">Statistical Arbitrage Bot Build in Python for Crypto</a>
            <br/>
            <a className="text-purple-700" href="https://www.udemy.com/course/triangular-arbitrage/?referralCode=508CACFB505BD707A331">Triangular Arbitrage for Crypto With Python</a>
        </div>


      </div>
    </>
  )
}

export default About