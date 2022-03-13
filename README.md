# Inflashion: an agent-based simulation of the Flash Protocol

**Check out the demo here: https://inflashion.surge.sh/**

---

The Flash protocol is a now-deprecated DeFi protocol based on the Ethereum network.

The core principle of the protocol is **flashstaking**, where the basic user journey is as follows:
1) User stakes a number of $FLASH tokens for `x` days.
2) User receives an immediate payout of $FLASH tokens, dependent on the amount staked and time staked for. These tokens are newly minted by the protocol.
4) After `x` days, user recieves their staked $FLASH tokens back in full. User can also unstake before `x` days have passed, but a relative proportion of their staked tokens will be burned.

The minting and burning of tokens is determined by the behaviour of market participants, creating an economy that is quite interesting to analyse. This project aims to simulate and visualise the economy and how it is affected by those behaviours.

For more info, check out these links:
- [Flash in 5 Explainer Blog](https://web.archive.org/web/20220227162826/https://blockzerolabs.io/flash-in-5/)
- [Protocol Overview](https://web.archive.org/web/20220227162743/https://docs.flashstake.io/en/latest/getting-started/protocol-overview.html)

---

This simulation models users as agents, who each have their own wallet of $FLASH tokens, and make random decisions based on Gaussian parameters.

You can:
- change these parameters to represent various market conditions
- follow each agent's actions and the status of their wallets
- view graphs of the protocol as a whole
