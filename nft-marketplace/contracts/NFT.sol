// SPDX-License-Identifier: MIT
/* Specifies the license for the contract */ 

pragma solidity ^0.8.17;
/* Specifies the version of the Solidity compiler to be used */ 

import "@openzeppelin/contracts/utils/Counters.sol";
/* Imports a library from OpenZeppelin for counting */

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
/* Imports a library from OpenZeppelin for ERC721 tokens with URI storage */

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
/* Imports a library from OpenZeppelin for ERC721 tokens */ 

contract NFT is ERC721URIStorage{
    /* Declares a contract named NFT that inherits from ERC721URIStorage */

    using Counters for Counters.Counter;
    /* Declares a counter to track the number of tokens created */

    Counters.Counter private _tokenIds;
    /* Declares a private counter for tokenIds */

    address contractAddress;
    /* Declares a variable to store the address of the marketplace contract */

    constructor(address marketplaceAddress) ERC721("Metaverse Tokens", "METT") {
        /* Constructor function that takes an address as an argument and calls the constructor of the parent contract */

        contractAddress = marketplaceAddress;
        /* Sets the value of contractAddress to the passed in marketplaceAddress */
    }

    function createToken(string memory tokenURI) public returns (uint) {
        /* Declares a function named createToken that takes a string argument and returns a uint */

        _tokenIds.increment();
        /* Increments the tokenIds counter */

        uint256 newItemId = _tokenIds.current();
        /* Stores the current value of tokenIds in newItemId */

        _mint(msg.sender, newItemId);
        /* Mints a new token and assigns it to the sender's address */

        _setTokenURI(newItemId, tokenURI);
        /* Sets the tokenURI for the new token */

        setApprovalForAll(contractAddress, true);
        /* Sets approval for the marketplace contract to transfer the token on behalf of the token owner */

        return newItemId;
        /* Returns the ID of the newly created token */
    }
}