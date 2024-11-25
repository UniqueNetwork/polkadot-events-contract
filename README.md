# Polkadot App | EventManager contract

## Demo

This contract was deployed to the Opal network at address `0xd3bdE3e10D04373dFc1Ded1C68BF4F31eBB4ADa7`. Self-sponsoring is enabled, which means that the contract will cover all transaction fees.

One event registered. To claim NFT, use the collection address `0x17c4e6453cC49AaaAeaCa894E6d9683e00000eDa`. Check the collection and minted NFTs on the [Unique Scan](https://uniquescan.io/opal/collections/3802).

## API

### Types

#### CrossAddress

This struct represents EVM or Substrate account. Only one field can be filled.

- For the EVM account, set `eth` with the EVM address (0x...).
- For the Substrate account, set the `sub` property with the substrate public key in decimal format

```solidity
struct CrossAddress {
  address eth;
  uint256 sub;
}
```

#### Attribute

Key/value pair representing NFT's trait

```solidity
struct Attribute {
  string trait_type;
  string value;
}
```

#### EventConfig

This struct represents the event's configuration.

- `startTimestamp`: NFT cannot be minted if `block.timestamp` < `startTimestamp`
- `endTimestamp`: NFT cannot be minted if `block.timestamp` > `endTimestamp`
- `accountLimit`: How many NFTs a single account may have
- `collectionCoverImage`: URL of a collection cover image
- `tokenImage`: URL of an NFT image. All NFTs will have the same image
- `soulbound`: if `true` NFT cannot be transferred
- `attributes`: NFT attributes list, see [Attributes](#attribute)
- `owner`: Event owner. This address is a virtual owner of the event's NFT collection. Real ownership can be claimed

```solidity
struct EventConfig {
  uint256 startTimestamp;
  uint256 endTimestamp;
  uint256 accountLimit;
  string collectionCoverImage;
  string tokenImage;
  bool soulbound;
  Attribute[] attributes;
  CrossAddress owner;
}
```

### Creating event

#### Interface

`function createCollection(string _name,string _description,string _symbol,EventConfig _eventConfig)`

#### Events

- `event EventCreated(uint256 collectionId, address collectionAddress);`

### Creating NFT

#### Interface

`function createToken(address _collectionAddress, CrossAddress _owner)`

#### Events

- `event TokenClaimed(CrossAddress indexed owner, uint256 indexed colletionId, uint256 tokenId);`

## Using from Substrate

The contract can be called with a Substrate account using `evm.call` extrinsic.

Examples are coming soon.

## Installation

Node.js, yarn, and forge should be installed.

```sh
yarn
```

## Tests
