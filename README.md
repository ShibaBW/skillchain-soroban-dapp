# SkillChain

SkillChain is a Stellar Soroban dApp for issuing and viewing on-chain student skill certificates on Stellar Testnet.

## Stack

- Next.js
- TypeScript
- TailwindCSS
- `@stellar/stellar-sdk`
- Freighter wallet integration

## Contract

- Network: Stellar Testnet
- Contract ID: `CCVGPROHA2IBHEF673TDTAQDRW2HSQMKHRDP5H3TYFVCCCI5ANJYA34F`
- Functions:
  - `issue_skill(student: Address, skill: Symbol)`
  - `get_skills(student: Address)`

## Project Structure

```text
.
├── components
├── contracts
├── lib
│   └── stellar.ts
├── pages
│   ├── _app.tsx
│   └── index.tsx
├── styles
│   └── globals.css
├── Cargo.toml
└── package.json
```

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
