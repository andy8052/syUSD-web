# syUSD – A stablecoin wrapper over yUSD

Today I am excited to introduce `syUSD`, it is an ERC20 token that lets you wrap `yUSD` into a stable currency. This allows for users to have a constantly increasing (as long as `yUSD` is still chugging along) stable coin balance in their wallet. It can be transfered freely and is always redeemable for the amount of `yUSD` that was deposited to mint the `syUSD`. Interact with the `syUSD` contract at [syusd.cash](https://syusd.cash).

`syUSD` lives on the Ethereum mainnet at address `0x20bef22f92fd1c2d50765c0d26f5a238219e1c1a`.

## What is yUSD?
`yUSD` is an ERC-20 token issued by Yearn that represents shares in our most popular vault: the yCRV Vault. `yUSD` makes DeFi simple by automatically maximizing yield and minimizing risk for our depositors. On the backend, the yCRV Vault implements modular, autonomous, yield-aware strategies. These are created and regularly updated by the best minds in DeFi, all under the control of Yearn governance.

## So then what is syUSD?
`syUSD` is a stablecoin wrapper for `yUSD`. `yUSD` is currently trading at about $1.15 when this site went live and has slowly increased in price over time. `syUSD` allows users to deposit their `yUSD` to recieve `syUSD`. `syUSD` will be contantly updating users balances and the totalSupply to track $1 based on the underlying assets in `yUSD`. 

### yUSD-denominated mint and burn

To mint `syUSD`, a user must approve the `syUSD` contract address and then call `mint` with the amount of `yUSD` they desire to lock up. This will mint the user an appropriate amount of `syUSD`. Likewise, to burn your `syUSD` and get back out `yUSD`, the user must call `burn` with the amount of `yUSD` they desire to get back out. At any time the user can check their underlying `yUSD` balance through the function `balanceOfUnderlying`.

## Disclaimer

The deployed `syUSD` contract is EXTREMELY experimental and requires intense scruitiny from other developers before I would recommend anyone puts their money into it. Please use at your own risk. 

## Resources
The contract source code can be found at [github.com/andy8052/syUSD](https://github.com/andy8052/syUSD).
The source code for syusd.cash is at [github.com/andy8052/syUSD-web](https://github.com/andy8052/syUSD-web).
Everything distributed under the AGPL license.

*andy8052*
