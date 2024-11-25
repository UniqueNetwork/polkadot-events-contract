import { test } from "mocha";
import { viem } from "hardhat";
import { expect } from "chai";
import { createEvent, deployEventManager, TKN } from "./utils/helpers";

for (const EVENT_FEE of [TKN(0), TKN(10)]) {
  test(`anyone can create a collection by paying ${EVENT_FEE} fee`, async () => {
    const [owner, user] = await viem.getWalletClients();
    const publicClient = await viem.getPublicClient();

    const userBalanceBefore = await publicClient.getBalance({
      address: user.account.address,
    });
    expect(userBalanceBefore > 0n).to.be.true;

    // owner creates EventManager
    const eventManager = await deployEventManager({
      contractBalance: TKN(100),
      fee: EVENT_FEE,
    });

    // User creates an event by paying EVENT_FEE (can be 0)
    const { collectionAddress, collectionId } = await createEvent(
      eventManager,
      user.account,
      EVENT_FEE,
    );

    const userBalanceAfter = await publicClient.getBalance({
      address: user.account.address,
    });

    // User has minted collection for free
    expect(userBalanceAfter).to.eq(userBalanceBefore - EVENT_FEE);
  });
}
