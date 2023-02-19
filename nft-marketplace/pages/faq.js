import Head from 'next/head';
import { useState } from 'react';

function FAQPage() {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const questions = [
    {
      question: "What is an NFT marketplace?",
      answer: "An NFT marketplace is a platform that allows users to buy and sell non-fungible tokens (NFTs). NFTs are unique digital assets that represent ownership of a specific item, such as a piece of art or a collectible."
    },
    {
      question: "How do I buy an NFT on the marketplace?",
      answer: "To buy an NFT on the marketplace, you will need to have an account with a cryptocurrency wallet that supports the specific blockchain the NFT is built on. Once you have a wallet, you can browse the marketplace for NFTs that you are interested in and use your wallet to make a purchase."
    },
    {
      question: "Are NFTs only for digital art?",
      answer: "No, NFTs can be used to represent ownership of any type of digital asset, including but not limited to art, music, videos, collectibles, and more."
    },
    {
      question: "Can I sell my own NFTs on the marketplace?",
      answer: "Yes, most NFT marketplaces allow users to list and sell their own NFTs. You will need to create an account and follow the marketplace's guidelines for uploading and selling NFTs."
    },
    {
      question: "Are NFTs a good investment?",
      answer: "Like any investment, the value of NFTs can fluctuate and there is no guarantee of profit. It is important to do your own research and understand the risks before buying or selling NFTs."
    },
    {
      question: 'What is an NFT minting process?',
      answer: 'The NFT minting process is the process of creating and issuing a new NFT. This typically involves using a smart contract to define the properties and characteristics of the NFT, and then uploading the NFT to the blockchain. Once the NFT is on the blockchain, it becomes a unique and indivisible digital asset that can be bought and sold on an NFT marketplace.'
    },
    {
      question: 'What is the difference between an NFT and a cryptocurrency?',
      answer: 'NFTs and cryptocurrencies are both digital assets that are built on blockchain technology. However, there are some key differences between the two. Cryptocurrencies, such as Bitcoin and Ethereum, are designed to be used as a medium of exchange and are interchangeable with other cryptocurrencies. NFTs, on the other hand, are unique and indivisible digital assets that represent ownership of a specific item, such as a piece of art or a collectible. NFTs cannot be exchanged for other NFTs or cryptocurrencies in the same way that cryptocurrencies can be exchanged.'
    },
    {
      question: 'How do I store and manage my NFTs?',
      answer: 'To store and manage your NFTs, you will need a cryptocurrency wallet that supports the specific blockchain the NFT is built on. Some popular options for storing NFTs include MetaMask, Coinbase Wallet, and MyEtherWallet. When you purchase an NFT, it will be stored in your wallet, and you can view and manage your NFTs through the wallet interface. It is important to keep your wallet secure and make regular backups to ensure that you do not lose access to your NFTs.'
    },
    {
      question: 'Can NFTs be counterfeited or copied?',
      answer: 'One of the key benefits of NFTs is that they are unique and indivisible digital assets that cannot be counterfeited or copied. Each NFT is stored on the blockchain and has a unique digital signature that verifies its authenticity. This makes it difficult for anyone to create a counterfeit or copy of an NFT, which helps to protect the value of the asset.'
    },
    {
      question: 'Are there any fees associated with buying or selling NFTs on the marketplace?',
      answer: 'Yes, there are usually fees associated with buying or selling NFTs on the marketplace. These fees may include transaction fees, which are paid to the blockchain network for processing the transaction, as well as fees charged by the marketplace itself. It is important to familiarize yourself with the fees associated with buying or selling NFTs on the marketplace before making a purchase or listing an NFT for sale.'
    }
  ];

  return (
    <div>
      <Head>
        <title>Frequently Asked Questions</title>
      </Head>
      <h1 style={{ color: "black", fontWeight: "bold" }}>
        Frequently Asked Questions
      </h1>
      <ul>
        {questions.map((q, index) => (
          <li key={index}>
            <button
              style={{ fontWeight: "bold" }}
              onClick={() =>
                index === activeQuestion ? setActiveQuestion(null) : setActiveQuestion(index)
              }
              aria-expanded={index === activeQuestion}
            >
              {`${index + 1}. ${q.question}`}
            </button>
            {index === activeQuestion && (
              <p style={{ color: "black", fontWeight: "bold" }}>
                Answer: {q.answer}
              </p>
            )}
          </li>
        ))}
      </ul>
      <style jsx>{`
        h1 {
          font-size: 2rem;
          text-align: center;
        }
        h1 span {
          color: #069;
          font-weight: 600;
        }
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        li {
          margin-bottom: 1rem;
        }
        button {
          background: none;
          border: 0;
          color: #7c4dff;
          cursor: pointer;
          font-size: 1rem;
          outline: 0;
          padding: 0;
          text-align: left;
          width: 100%;
        }
        button:hover {
          color: #f60;
        }
        p {
          margin: 0;
          padding: 0.5rem 1rem;
          transition: all 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
export default FAQPage;