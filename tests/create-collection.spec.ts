import { test } from "mocha";
import { viem } from "hardhat";
import { expect } from "chai";
import { createEvent, deployEventManager } from "./utils/helpers";

test("anyone can create a collection for free", async () => {
  const [owner, user] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  const userBalanceBefore = await publicClient.getBalance({
    address: user.account.address,
  });
  expect(userBalanceBefore > 0n).to.be.true;

  const eventManager = await deployEventManager(10);
  const eventReceipt = await createEvent(eventManager, owner.account);
});
