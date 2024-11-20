import { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";
import { EventManager$Type } from "../../artifacts/contracts/EventManager.sol/EventManager";

export type EventManagerType = GetContractReturnType<EventManager$Type["abi"]>;
