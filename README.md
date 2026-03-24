# SkillChain

SkillChain is a blockchain-based certification platform that turns student achievements into verifiable on-chain proof.

Built on the Stellar network using Soroban smart contracts, SkillChain allows institutions or organizations to issue digital skill certificates directly to a student's wallet. These certificates are stored on-chain and can be verified by employers instantly.

The platform eliminates the risk of fake certificates and creates a transparent system for verifying skills and achievements.

## Features

- Connect wallet using Freighter
- Issue skill certificates to a student wallet
- Store skill records on-chain
- Query and verify student skills
- Fully decentralized and tamper-proof

## Tech Stack

- Stellar Blockchain
- Soroban Smart Contracts
- React / Next.js Frontend
- Freighter Wallet
- Node.js

## How it works

1. User connects their wallet via Freighter.
2. A skill certificate is issued to a student's wallet.
3. The certificate is stored on the Stellar blockchain.
4. Anyone can verify the student's skills by querying the contract.

## Future Improvements

- NFT based certificates
- University issuer verification
- Employer verification portal
- Skill reputation scoring

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open `http://localhost:3000`.

4. In Freighter:
   - install the extension if needed
   - switch the wallet network to `TESTNET`
   - fund the connected account on testnet so it can pay transaction fees

## Available Scripts

- `npm run dev` starts the Next.js dev server
- `npm run build` creates a production build
- `npm run start` runs the production build
- `npm run typecheck` runs TypeScript checks

## Notes

- Viewing skills simulates the Soroban contract call and does not submit a transaction.
- Issuing a skill prepares a Soroban transaction, signs it with Freighter, and submits it to Stellar Testnet RPC.
- The existing Rust Soroban workspace in `contracts/` remains available if you want to extend the contract code locally later.
