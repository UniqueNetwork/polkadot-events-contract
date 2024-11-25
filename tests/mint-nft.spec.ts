import { test } from "mocha";
import { viem } from "hardhat";
import { expect } from "chai";
import { createEvent, deployEventManager, mintNFT, TKN } from "./utils/helpers";

test(`anyone can mint NFT for free`, async () => {
  const [owner, user] = await viem.getWalletClients();
  const EVENT_FEE = TKN(0);

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

  // owner creates Event
  const { collectionAddress, collectionId } = await createEvent(
    eventManager,
    owner.account,
    EVENT_FEE,
  );

  const eventConfig = await eventManager.read.getEventConfig([
    collectionAddress,
  ]);

  // user mints NFT for free
  await mintNFT(eventManager, collectionAddress, user.account.address);

  const userBalanceAfter = await publicClient.getBalance({
    address: user.account.address,
  });

  // User has minted NFT for free
  expect(userBalanceAfter).to.eq(userBalanceBefore - EVENT_FEE);
});
