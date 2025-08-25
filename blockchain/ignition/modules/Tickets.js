const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TicketsModule", (m) => {
  
  const owner = m.getAccount(0);

  const tickets = m.contract("Tickets", [owner]);

  return { tickets };
});
