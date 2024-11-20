import { viem } from "hardhat";
import { Account, parseEther } from "viem";

import { EventManagerType } from "./types";

const getTimestamp = () => BigInt(Math.floor(Date.now() / 1000));

export const deployEventManager = async (contractBalance: number) => {
  return viem.deployContract("EventManager", [0n], {
    value: parseEther(contractBalance.toString()),
  });
};

export const createEvent = async (
  eventManager: EventManagerType,
  account: Account,
) => {
  const publicClient = await viem.getPublicClient();

  const hash = await eventManager.write.createCollection(
    [
      "Event",
      "Description",
      "EVNT",
      {
        accountLimit: 0n,
        collectionCoverImage:
          "https://orange-impressed-bonobo-853.mypinata.cloud/ipfs/QmTysVr68jiW857ZmGHuZ5WGpYQ8YSeV5FPp2DYsTCeduP",
        owner: { eth: account.address, sub: 0n },
        startTimestamp: getTimestamp(),
        endTimestamp: getTimestamp() + 1000n,
        soulbound: false,
        tokenImage:
          "https://orange-impressed-bonobo-853.mypinata.cloud/ipfs/QmTysVr68jiW857ZmGHuZ5WGpYQ8YSeV5FPp2DYsTCeduP",
        attributes: [
          {
            trait_type: "Website",
            value: "http://localhost:3000",
          },
        ],
      },
    ],
    {
      account,
    },
  );

  return publicClient.waitForTransactionReceipt({ hash });
};
