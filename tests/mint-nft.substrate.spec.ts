import "@unique-nft/unique-mainnet-types/augment-api";
import { Keyring, HttpProvider, ApiPromise } from "@polkadot/api";
import { Address } from "@unique-nft/utils";
import { test } from "mocha";
import { viem } from "hardhat";
import { encodeFunctionData } from "viem";
import { expect } from "chai";
import { createEvent, deployEventManager, mintNFT, TKN } from "./utils/helpers";

test(`anyone can mint NFT using Substrate account for free`, async () => {
  const [owner] = await viem.getWalletClients();
  const EVENT_FEE = TKN(0);

  const publicClient = await viem.getPublicClient();

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

  const provider = new HttpProvider("https://rpc.web.uniquenetwork.dev");

  // user mints NFT for free using Substrate account
  const api = await ApiPromise.create({ provider });

  const keyring = new Keyring({ type: "sr25519" });
  const alice = keyring.addFromMnemonic("//Alice");

  await api.tx.evm
    .call(
      Address.mirror.substrateToEthereum(alice.address), // Extract account's mirror
      eventManager.address,
      encodeFunctionData({
        abi: eventManager.abi,
        functionName: "createToken",
        args: [
          collectionAddress,
          Address.extract.ethCrossAccountId(alice.address) as any,
        ],
      }),
      0,
      300_000n,
      10n * 10n ** 12n,
      null,
      null,
      [],
    )
    .signAndSend(alice);

  // TODO wait tx and check balance
  console.log(`CollectionId: ${collectionId}`);
});
