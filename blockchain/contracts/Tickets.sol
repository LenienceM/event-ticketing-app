// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Tickets is ERC1155, Ownable { 

    struct Ticket {
        uint256 eventId;      
        uint256 maxSupply;    
        uint256 minted;       
        uint256 priceWei;    
    }

    uint256 public nextTicketTypeId;
    mapping(uint256 => Ticket) public ticketsByType;
   
    constructor(address initialOwner) ERC1155("https://example.com/metadata/{id}.json") Ownable(initialOwner) {
       
    }

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

    function mintTicket(uint256 ticketTypeId, uint256 amount) external payable {
        Ticket storage t = ticketsByType[ticketTypeId];
        require(t.eventId != 0, "Invalid ticket type");
        require(t.minted + amount <= t.maxSupply, "Sold out");
        require(msg.value == t.priceWei * amount, "Incorrect payment");

        t.minted += amount;
        _mint(msg.sender, ticketTypeId, amount, "");
    }

    function withdraw(address payable to) external onlyOwner {
        to.transfer(address(this).balance);
    }
}