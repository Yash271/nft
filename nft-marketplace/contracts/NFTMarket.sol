// SPDX-License-Identifier: MIT
/* Specifies the license for the contract */

pragma solidity ^0.8.17;
/* Specifies the version of the Solidity compiler to be used */

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
/* Imports a library from OpenZeppelin for ERC721 tokens */

import "@openzeppelin/contracts/utils/Counters.sol";
/* Imports a library from OpenZeppelin for counting */

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/* Imports a library from OpenZeppelin for preventing reentrancy attacks */

contract NFTMarket is ReentrancyGuard {
    /* Declares a contract named NFTMarket that inherits from ReentrancyGuard */

    using Counters for Counters.Counter;
    /* Declares a counter to track the number of items created and sold */

    Counters.Counter private _itemIds;
    /* Declares a private counter for itemIds */

    Counters.Counter private _itemsSold;
    /* Declares a private counter for itemsSold */

    address payable owner;
    /* Declares a variable to store the address of the contract owner, which is payable */

    uint256 listingPrice = 0.025 ether;
    /* Declares a variable to store the listing price of an item in ether */

    constructor() {
        owner = payable(msg.sender);
        /* Initializes the owner variable with the address of the contract deployer */
    }

    struct MarketItem {
        /* Declares a struct named MarketItem */

        uint itemId;
        /* Stores the ID of the item */

        address nftContract;
        /* Stores the address of the NFT contract */

        uint256 tokenId;
        /* Stores the ID of the token */

        address payable seller;
        /* Stores the address of the seller, which is payable */

        address payable owner;
        /* Stores the address of the owner, which is payable */

        uint256 price;
        /* Stores the price of the item */

        bool sold;
        /* Stores the status of the item, whether it has been sold or not */
    }

    mapping(uint256 => MarketItem) private idToMarketItem;
    /* Declares a private mapping to store the MarketItem structs with their respective itemIds */

    event MarketItemCreated(
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    ); // Declares an event that is emitted when a new market item is created

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
        /* This function returns the current listing price of an NFT on the marketplace. */
    }

    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) 
    public payable nonReentrant {
        /* This function allows users to create and list an NFT for sale on the marketplace. 
        It takes in the address of the NFT contract, the token ID, and the price the seller wants to list the NFT for. */
        require(price > 0, "Price must be atleast 1 wei");
        require(
            msg.value == listingPrice,
            "Price must be equal to the listing price"
        );
        /* It first checks that the price is greater than 0 and that the amount of ether sent with the transaction is equal to the current listing price. */

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );
        /* It then generates a unique ID for the NFT, creates a new MarketItem struct, and stores it in the idToMarketItem mapping. */

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        /* It also transfers the NFT from the seller to the contract. */

        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
        /* It emits a MarketItemCreated event with information about the new NFT listing. */
    } 

    function createMarketSale(
        address nftContract,
        uint256 itemId
    ) public payable nonReentrant {
        /* This function allows users to purchase an NFT that is listed on the marketplace. 
        It takes in the address of the NFT contract and the ID of the NFT being purchased. */
        
        uint price = idToMarketItem[itemId].price;
        uint tokenId = idToMarketItem[itemId].tokenId;
        /* Retrieves the price and token ID of the NFT from the idToMarketItem mapping */
        require(
            msg.value == price,
            "Please submit the asking price in order to purchase"
        );
        /* Checks that the amount of ether sent with the transaction is equal to the price of the NFT. */

        idToMarketItem[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        /* It then transfers the ether from the buyer to the seller, transfers the NFT from the contract to the buyer */

        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].sold = true;
        /* Updates the ownership and sold status of the NFT in the idToMarketItem mapping */

        _itemsSold.increment();
        /* increments the number of items sold */

        payable(owner).transfer(listingPrice);
        /*Transfers the listing price to the marketplace owner. */
    }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _itemIds.current();
        /* Get the total number of items */

        uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
        /* Calculate the number of unsold items */

        uint currentIndex = 0;
        /* Initialize the current index of the unsold items array */

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        /* Create an array of unsold MarketItem structs */

        for (uint i = 0; i < itemCount; i++) {
            /* Loop through all MarketItem structs */

            if (idToMarketItem[i + 1].owner == address(0)) {
                /* If the item has not been sold yet */

                uint currentId = idToMarketItem[i + 1].itemId;
                /* Get the ID of the current MarketItem */

                MarketItem storage currentItem = idToMarketItem[currentId];
                /* Get the MarketItem struct from the mapping and store it in currentItem */

                items[currentIndex] = currentItem;
                /* Add the currentItem to the items array at the current index */

                currentIndex += 1;
                /* Increment the current index */
            }
        }
        return items;
        /* Return the array of unsold MarketItem structs */
    }

    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        /* Get the total number of items in the marketplace */

        uint itemCount = 0;
        uint currentIndex = 0;
        /* Initialize variables to keep track of the number of items owned by the user and the current index in the items array */

        for (uint i = 0; i < totalItemCount; i++) {
            /* Loop through all items in the marketplace */
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
            /* If the item is owned by the user, increment the item count */
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        /* Create a new array to store the user's items */
        for (uint i = 0; i < totalItemCount; i++) {
            // Loop through all items in the marketplace again
            if (idToMarketItem[i + 1].owner == msg.sender) {
                items[currentIndex] = idToMarketItem[i + 1];
                currentIndex += 1;
            }
            /* If the item is owned by the user, add it to the items array and increment the current index */
        }
        return items;
        /* Return the items array containing the user's items */
    }

    function fetchItemsListed() public view returns (MarketItem[] memory) {
        
        uint totalItemCount = _itemIds.current();
        /* Get the total number of items in the marketplace */

        
        uint itemCount = 0;
        uint currentIndex = 0;
        /* Initialize variables to track the number of items listed by the current user */

        
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
            /* Loop through all items in the marketplace and count how many are listed by the current user */
        }

        
        MarketItem[] memory items = new MarketItem[](itemCount);
        /* Create a new array to store the items listed by the current user */
        
        for (uint i = 0; i < totalItemCount; i++) {
            /* Loop through all items in the marketplace again and add any listed by the current user to the new array */
            if (idToMarketItem[i + 1].seller == msg.sender) {
                
                uint currentId = i + 1;
                /* Get the ID and data of the current item */
                MarketItem storage currentItem = idToMarketItem[currentId];
                
                items[currentIndex] = currentItem;
                /* Add the current item to the new array */
                currentIndex += 1;
                
            }
        }

        return items;
        /* Return the array of items listed by the current user */
    }
}