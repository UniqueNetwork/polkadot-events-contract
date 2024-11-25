import { viem } from "hardhat";
import { Account } from "viem";
import { Address } from "@unique-nft/utils";
import { EventManagerType } from "./types";

export const TKN = (tokens: number) => BigInt(tokens) * 10n ** 18n;

export const deployEventManager = async (options: {
  contractBalance: bigint;
  fee: bigint;
}) => {
  const eventManager = await viem.deployContract(
    "EventManager",
    [options.fee],
    {
      value: options.contractBalance,
    },
  );

  const contractHelpers = await viem.getContractAt(
    "ContractHelpers",
    "0x842899ECF380553E8a4de75bF534cdf6fBF64049",
  );

  // Set self sponsoring
  await contractHelpers.write.selfSponsoredEnable([eventManager.address]);
  await contractHelpers.write.setSponsoringRateLimit([eventManager.address, 0]);
  await contractHelpers.write.setSponsoringMode([eventManager.address, 2]);

  return eventManager;
};

export const createEvent = async (
  eventManager: EventManagerType,
  account: Account,
  value = 0n,
) => {
  const publicClient = await viem.getPublicClient();

  const timestamp = await getBlockchainTimestamp();
  const hash = await eventManager.write.createCollection(
    [
      "Event",
      "Description",
      "EVNT",
      {
        accountLimit: 10n,
        collectionCoverImage:
          "https://orange-impressed-bonobo-853.mypinata.cloud/ipfs/QmTysVr68jiW857ZmGHuZ5WGpYQ8YSeV5FPp2DYsTCeduP",
        owner: { eth: account.address, sub: 0n },
        startTimestamp: timestamp,
        endTimestamp: timestamp + 10000n,
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
      value,
    },
  );

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  const [{ args }] = await eventManager.getEvents.EventCreated({
    blockHash: receipt.blockHash,
  });

  if (!args.collectionAddress || !args.collectionId)
    throw Error("Cannot find logs");

  return {
    collectionId: args.collectionId,
    collectionAddress: args.collectionAddress,
    receipt,
  };
};

export const mintNFT = async (
  eventManager: EventManagerType,
  collectionAddress: `0x${string}`,
  substrateOrEthereumAddress: `0x${string}` | string,
) => {
  const publicClient = await viem.getPublicClient();

  const nftOwner = substrateOrEthereumAddress.startsWith("0x")
    ? { eth: substrateOrEthereumAddress as `0x${string}`, sub: 0n }
    : {
        eth: "0x0000000000000000000000000000000000000000" as `0x${string}`,
        sub: BigInt(
          Address.extract.substratePublicKey(substrateOrEthereumAddress),
        ),
      };

  const hash = await eventManager.write.createToken([
    collectionAddress,
    nftOwner,
  ]);

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  const [{ args }] = await eventManager.getEvents.TokenClaimed(undefined, {
    blockHash: receipt.blockHash,
  });

  if (!args.collectionId || !args.owner || !args.tokenId)
    throw Error("Cannot find logs");

  return {
    collectionId: args.collectionId,
    tokenId: args.tokenId,
    owner: args.owner,
    receipt,
  };
};

export const getBlockchainTimestamp = async () => {
  const publicClient = await viem.getPublicClient();

  const block = await publicClient.getBlock();
  return block.timestamp;
};
