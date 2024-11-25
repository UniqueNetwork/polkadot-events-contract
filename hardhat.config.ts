import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-foundry";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  paths: {
    tests: "./tests",
  },
  networks: {
    quick: {
      url: "https://rpc.web.uniquenetwork.dev",
      accounts: [
        // 0xDfF622646ff985c3fA00A99490f4DaE8D843E45C | 5F6fSv3goFBZ2JiWSEWmfBLXXkcxEwfurGisnRQYkF6j1PjD
        "0x634a50bde19ab6d04edf28ef706c7ed71c58e03d2159920d03acafa227064174",
        // 0xF5Bd7CA45bdCBbeCf75E2E0Cb5dEaBc7402E7ae4 | 5HqzXKRcX9sqHy5NGERrSo4FXGa2a8DUfGWPh1uF5D7zJsws
        "0xa7c797a3ae8ef1b17e619d41faffaedf3cf935258f8a6db5f6eb4afa0796e760",
      ],
    },
  },
  mocha: {
    timeout: 500_000,
  },
};

export default config;
