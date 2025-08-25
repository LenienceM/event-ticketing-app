// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Tickets is ERC1155, Ownable {

    

    struct Ticket {
        uint256 eventId;      // off-chain ID
        uint256 maxSupply;    // total tickets
        uint256 minted;       // tickets minted so far
        uint256 priceWei;     // price per ticket
    }

    uint256 public nextTicketTypeId;
    mapping(uint256 => Ticket) public ticketsByType;
   
    constructor(address initialOwner) ERC1155("https://example.com/metadata/{id}.json") Ownable(initialOwner) {
       
    }

    // Create tickets for an off-chain event
    function createTickets(
        uint256 eventId,
        uint256 maxSupply,
        uint256 priceWei
    ) external onlyOwner returns (uint256 ticketTypeId) {
        ticketTypeId = ++nextTicketTypeId;
        ticketsByType[ticketTypeId] = Ticket({
            eventId: eventId,
            maxSupply: maxSupply,
            minted: 0,
            priceWei: priceWei
        });
    }

    // Mint tickets to a buyer
    function mintTicket(uint256 ticketTypeId, uint256 amount) external payable {
        Ticket storage t = ticketsByType[ticketTypeId];
        require(t.eventId != 0, "Invalid ticket type");
        require(t.minted + amount <= t.maxSupply, "Sold out");
        require(msg.value == t.priceWei * amount, "Incorrect payment");

        t.minted += amount;
        _mint(msg.sender, ticketTypeId, amount, "");
    }

    // Withdraw ETH to owner
    function withdraw(address payable to) external onlyOwner {
        to.transfer(address(this).balance);
    }
}
