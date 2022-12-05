---
title: "How to get the native balance of an ERC20 token vault"
slug: "how-to-get-the-native-balance-of-a-smart-contract-vault"
excerpt: "Learn how to get the native balance of a ERC20 token vault using the Moralis Balance API."
---
## Prerequisites

Before getting started, make sure you have the following ready:

- Node v.14+ or Python
- NPM/Yarn/PNPM or Pip

## Step 1: Setup Moralis

First [register](https://docs.moralis.io/docs/quickstart) your Moralis account and get your Moralis API Key.

Once you have your Moralis API Key, install [Moralis SDK](https://docs.moralis.io/docs/moralis-sdk) in your project.

```shell npm
npm install moralis @moralisweb3/common-evm-util
```
```shell yarn
yarn add moralis @moralisweb3/common-evm-util
```
```shell pnpm
pnpm add moralis @moralisweb3/common-evm-util
```
```Text pip
pip install moralis
```



## Step 2: Get the native balance of an address

In order to get the native balance of an ERC20 token vault, Moralis provides you the `[getNativeBalance](https://docs.moralis.io/reference/getnativebalance)` API endpoint.

Here you'll need two parameters: `address` and `chain`.

Once you have obtained both the `address` and `chain`, you can copy the following code:

```javascript index.js
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-util);

const runApp = () => {
  await Moralis.start({
    apiKey: "YOUR_API_KEY",
    // ...and any other configuration
  });

  // address of ERC20 token vault, e.g. WETH token address
  const address = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

  const chain = EvmChain.ETHEREUM;

  const response = await Moralis.EvmApi.balance.getNativeBalance({
    address,
    chain,
  });

  console.log(response.toJSON());
}

runApp();
```
```typescript index.ts
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-util";

const runApp = () => {
  await Moralis.start({
    apiKey: "YOUR_API_KEY",
    // ...and any other configuration
  });

  // address of ERC20 token vault, e.g. WETH token address
  const address = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

  const chain = EvmChain.ETHEREUM;

  const response = await Moralis.EvmApi.balance.getNativeBalance({
    address,
    chain,
  });

  console.log(response.toJSON());
}

runApp();
```
```python index.py
from moralis import evm_api

api_key = "YOUR_API_KEY"

params = {
    # address of ERC20 token vault, e.g. WETH token address
    "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", 
    "chain": "eth", 
}

result = evm_api.balance.get_native_balance(
    api_key=api_key,
    params=params,
)

print(result)
```



To execute the program, run the following command:

```Text Shell (JavaScript)
node index.js
```
```Text Shell (TypeScript)
node index.ts
```
```Text Shell (Python)
python index.py
```



In your terminal, you should see the following response:

```json
[
  {
  	"balance": "3989233490541891348056490"
	}
]
```



Congratulations 🥳 You just got the native balance of an ERC20 token vault with just a few lines of code using the Moralis Balance API!

## Youtube Video

https://www.youtube.com/watch?v=sL5t07JE0aE

## API Reference

If you want to know more details on the endpoint and optional parameters, check out:

- [getNativeBalance](https://docs.moralis.io/reference/getnativebalance)

## Support

If you face any trouble following the tutorial, feel free to reach out to our community engineers in our [Discord](https://moralis.io/discord) or [Forum](https://forum.moralis.io) to get 24/7 developer support.