---
title: "Wallet History"
slug: "wallet-history"
authors:
  name: Pietro Doninelli
tags: [Web3 Data API]
---

We’ve just launched our [Wallet History endpoint](/web3-data-api/evm/reference/wallet-api/get-wallet-history), allowing you to fetch the wallet's full transaction history, including sends, receives, token transfers, contract interactions, and potential spam, with sorting capability, with a **single API call** 🤯

This endpoint includes several query parameters:

- `chain`: Choose the blockchain to query 🌐
- `from_block` and `to_block`: Set the block range for the transactions you're interested in 📊. If both `from_date` and `from_block` (or `to_date` and `to_block`) are provided, the block parameter takes precedence.
- `from_date` and `to_date`: Specify the date range for transactions. Accepts seconds or date strings compatible with moment.js 📅.
- `internal_transactions`: Include internal transactions in your results when set to `true` ✅.
- `nft_metadata`: Include NFT metadata in your results when set to `true` ✅.
- `cursor`: Use this to paginate through results, utilizing the cursor provided in the previous response 🔄.
- `order`: Sort the results in ascending (`ASC`) or descending (`DESC`) order 🔢.
- `limit`: Adjust the page size of your results to your preference 📏.

Check-out the [API reference for more information](/web3-data-api/evm/reference/wallet-api/get-wallet-history)
