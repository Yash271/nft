import { useState } from 'react'
import { ethers } from 'ethers'
import { create } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import { Buffer } from 'buffer';

const projectId = "2JGl6IKfp6lyaFINajbbbOqVAmh";
const projectSecret = "028f4cdd51260602f5155f4b145cef29";
const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`recieved: ${prog}`)
        }
      )
      const url = `https://nftmarketplace2023.infura-ipfs.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (e) {
      console.log(e)
    }
  }

  async function createItem() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    const data = JSON.stringify({
      name, description, image: fileUrl
    })

    try {
      const added = await client.add(data)
      const url = `https://nftmarketplace2023.infura-ipfs.io/ipfs/${added.path}`
      //after the file is uploaded to IPFS, pass the URL to save it to Polygon
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal()
    try {
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()

      let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
      let transaction = await contract.createToken(url)
      let tx = await transaction.wait()

      let event = tx.events[0]
      let value = event.args[2]
      let tokenId = value.toNumber()

      const price = ethers.utils.parseUnits(formInput.price, 'ether')

      contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
      let listingPrice = await contract.getListingPrice()
      listingPrice = listingPrice.toString()

      transaction = await contract.createMarketItem(
        nftaddress, tokenId, price, { value: listingPrice }
      )
      await transaction.wait()
      router.push('/')
    } catch (error) {
      console.log(error)
      alert('Wallet Authentication Rejected')
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="NFT Name"
          className="mt-8 border rounded p-4 font-bold text-black"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="NFT Description"
          className="mt-2 border rounded p-4 font-bold text-black"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="NFT Price in Ether"
          className="mt-2 border rounded p-4 font-bold text-black"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <input
          type="file"
          name="Asset"
          class="mt-2 block w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          onChange={onChange}
        />
        {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        }
        <button
          onClick={createItem}
          className="font-bold mt-4 bg-indigo-500 hover:bg-indigo-700 text-white rounded p-4 shadow-lg text-lg"
        >
          Create NFT!
        </button>
      </div>
    </div>
  )
}  