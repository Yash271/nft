import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons'
import { faSort } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [search, setSearch] = useState('')
  const [originalNfts, setOriginalNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [selectedCrypto, setSelectedCrypto] = useState('ETH');
  const [conversionRate, setConversionRate] = useState(1);
  const [sortOrder, setSortOrder] = useState('');
  const cryptoOptions = [
    { label: 'Ether', value: 'ETH', icon: 'url(/ether.svg'},
    { label: 'Bitcoin', value: 'BTC'},
    { label: 'Litecoin', value: 'LTC'},
    { label: 'Ripple', value: 'XRP'},
    { label: 'Bitcoin Cash', value: 'BCH'},
    { label: 'EOS', value: 'EOS'},
    { label: 'Binance Coin', value: 'BNB'},
    { label: 'Cardano', value: 'ADA'},
    { label: 'Stellar Lumens', value: 'XLM'},
    { label: 'Tron', value: 'TRX'},
  ];


  useEffect(() => {
    loadNFTs()
  }, [])

  function handleSearch(event) {
    const searchTerm = event.target.value;
    setSearch(searchTerm);
    if (!originalNfts) {
      return;
    }

    if (searchTerm === '') {
      setNfts(originalNfts);
      return;
    }

    const filteredNfts = originalNfts.filter((nft) => {
      return nft.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setNfts(filteredNfts);
  }

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com")
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItems()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
        currency: selectedCrypto,
        priceInSelectedCrypto: price * conversionRate
      }
      return item
    }))
    setNfts(items)
    setOriginalNfts(items)
    setLoadingState('loaded')
    return items;
  }

  async function buyNft(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }

  async function handleSortOrderChange(e) {
    const sortedNfts = nfts.sort((a, b) => {
      if (e.target.value === 'high-low') {
        return b.priceInSelectedCrypto - a.priceInSelectedCrypto;
      } else if (e.target.value === 'low-high') {
        return a.priceInSelectedCrypto - b.priceInSelectedCrypto;
      } else if (e.target.value === 'a-z') {
        return a.name.localeCompare(b.name)
      } else if (e.target.value === 'z-a') {
        return b.name.localeCompare(a.name)
      }
    });
    setSortOrder(e.target.value);
    setNfts(sortedNfts);
  }

  async function handleCryptoChange(event) {
    let name = event.target.value
    const response = await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=${name}&api_key=330b9009bea124e637f7a89cf627421bbbacd92342559eaf4543916fef6e0f57`);
    const rate = response.data[name];
    const updatedNfts = nfts.map(nft => {
      return {
        ...nft,
        currency: name,
        priceInSelectedCrypto: nft.price * rate
      }
    });
    setSelectedCrypto(name);
    setConversionRate(rate);
    setNfts(updatedNfts);
    // loadNFTs();
  }

  if (loadingState !== 'loaded') return (<h1 className="px-20 py-10 text-3xl text-black font-bold">...Loading the Market!</h1>)

  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="flex items-center py-4">
          <div className="flex items-center ml-4 mt-4">
            <div className="flex justify-center items-end">
              <div className="py-1 px-2 mb-4">
                <label className="text-lg font-bold text-black">Search</label>
                <div className="flex items-center border border-gray-400 rounded-lg mt-2">
                  <span className="text-gray-600 p-2">
                    <FontAwesomeIcon icon={faSearch} />
                  </span>
                  <input
                    type='text'
                    value={search}
                    placeholder=" ...Search here"
                    onChange={handleSearch}
                    className="flex-1 appearance-none bg-white rounded-lg py-2 px-4 text-black leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-300 font-bold"
                  />
                </div>
              </div>
              <div className="py-1 px-2 mb-4">
                <label className="text-lg font-bold text-black">Filter by Crypto</label>
                <span className="text-black p-2">
                  <FontAwesomeIcon icon={faFilter} />
                </span>
                <select
                  className="h-[2.6rem] block appearance-none w-full bg-white border border-gray-400 rounded-lg py-2 px-4 pr-8 text-black font-bold leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-300 mt-2"
                  value={selectedCrypto}
                  onChange={(e) => handleCryptoChange(e)}
                >
                  {cryptoOptions.map(({ label, value, icon}) => (
                    <option key={value} value={value} icon={icon}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="py-1 px-2 mb-4">
                <label className="text-lg font-bold text-black">Sort by</label>
                <span className="text-black p-2">
                  <FontAwesomeIcon icon={faSort} />
                </span>
                <select
                  className="h-[2.6rem] block appearance-none w-full bg-white border border-gray-400 rounded-lg py-2 px-4 pr-8 text-black font-bold leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-300 mt-2"
                  value={sortOrder}
                  onChange={(e) => handleSortOrderChange(e)}
                >
                  <option value="">Default</option>
                  <option value="high-low">High to Low</option>
                  <option value="low-high">Low to High</option>
                  <option value="a-z">A-Z</option>
                  <option value="z-a">Z-A</option>
                </select>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"></svg>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden bg-white drop-shadow-xl">
                <img src={nft.image} />
                <div className="p-4 border-t-2 border-black">
                  <p style={{ height: '64px' }} className="text-2xl font-bold text-black">{nft.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-2xl mb-4 font-bold text-white">{nft.priceInSelectedCrypto} {nft.currency}</p>
                  <button
                    className="w-full bg-indigo-500 text-white font-bold py-2 rounded-md border border-indigo-500 hover:bg-indigo-400"
                    onClick={() => buyNft(nft)}
                  >
                    Buy
                  </button>
                </div>
              </div>
            ))
          }
          {
            nfts.length === 0 ? (
              <p className="py-2 px-6 mb-4 w-max text-3xl text-black font-bold">No Items In The Marketplace!</p>
            ) : <></>
          }
        </div>
      </div>
    </div>
  )
}