## About Me

Name: Tuong Truong

I am a software engineering student passionate about blockchain technology, decentralized applications, and building real-world Web3 solutions. My goal is to create applications that solve real problems using decentralized technologies such as Stellar and Soroban smart contracts. This project is part of my journey to explore blockchain development and build practical decentralized applications.

## Vision

The vision of SkillChain is to create a global, decentralized verification system for skills and achievements. By storing certifications on the blockchain, students can prove their skills anywhere in the world without relying on centralized institutions. Employers can instantly verify credentials without paperwork, making hiring faster and more trustworthy.

##PROJECT NAME: SkillChain
#PROBLEM: Students and job seekers often struggle to prove the authenticity of their skills and certificates. Fake certificates and unverifiable achievements create trust issues for employers.
#SOLUTION: SkillChain uses Stellar Soroban smart contracts to issue and store skill certificates on-chain, allowing anyone to verify achievements instantly and securely.
#STELLAR FEATURES USED
[ ] Transfer XLM/USDC
[ ] Custom Tokens
[x] Soroban Smart Contract
[ ] Integrated DEX
[ ] Trustline
[ ] Compliance / Clawback
#TARGET USER
Students
Universities
Training platforms
Employers verifying skills
#CORE FEATURES (MVP): Issue a skill certificate to a student's wallet and store it permanently on the Stellar blockchain.
#WHY STELLAR: Traditional certificate verification requires manual checking and can take days. Using Stellar allows instant verification with extremely low transaction fees and global accessibility.
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
