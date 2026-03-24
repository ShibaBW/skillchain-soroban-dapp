import {
  Address,
  BASE_FEE,
  Networks,
  Operation,
  StrKey,
  Transaction,
  TransactionBuilder,
  nativeToScVal,
  rpc,
  scValToNative,
  xdr,
} from "@stellar/stellar-sdk";

export const CONTRACT_ID =
  "CCVGPROHA2IBHEF673TDTAQDRW2HSQMKHRDP5H3TYFVCCCI5ANJYA34F";
export const NETWORK = "TESTNET";
export const NETWORK_PASSPHRASE = Networks.TESTNET;
export const SOROBAN_RPC_URL = "https://soroban-testnet.stellar.org";

const server = new rpc.Server(SOROBAN_RPC_URL);

type FreighterModule = typeof import("@stellar/freighter-api");

type TransactionStatus = "SUCCESS" | "FAILED" | "NOT_FOUND" | "PENDING";

export type WalletConnection = {
  installed: boolean;
  address: string | null;
};

export type SubmittedTransaction = {
  hash: string;
  status: TransactionStatus;
};

function extractErrorMessage(input: unknown, fallback: string) {
  if (!input || typeof input !== "object") {
    return fallback;
  }

  const errorValue = "error" in input ? input.error : undefined;
  if (!errorValue) {
    return "";
  }

  if (typeof errorValue === "string") {
    return errorValue;
  }

  if (typeof errorValue === "object" && errorValue && "message" in errorValue) {
    const message = errorValue.message;
    if (typeof message === "string") {
      return message;
    }
  }

  return fallback;
}

async function loadFreighter() {
  if (typeof window === "undefined") {
    throw new Error("Freighter actions are only available in the browser.");
  }

  return import("@stellar/freighter-api");
}

async function ensureWalletOnTestnet(freighter: FreighterModule) {
  if (!("getNetworkDetails" in freighter)) {
    return;
  }

  const details = await freighter.getNetworkDetails();
  const error = extractErrorMessage(details, "Unable to read Freighter network.");
  if (error) {
    throw new Error(error);
  }

  if (
    "networkPassphrase" in details &&
    details.networkPassphrase &&
    details.networkPassphrase !== NETWORK_PASSPHRASE
  ) {
    throw new Error("Freighter must be switched to Stellar Testnet.");
  }
}

function normalizeSkills(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map((item) => String(item));
  }

  if (raw == null) {
    return [];
  }

  return [String(raw)];
}

function getSimulationReturnValue(simulation: unknown) {
  if (!simulation || typeof simulation !== "object") {
    return undefined;
  }

  if ("result" in simulation && simulation.result && typeof simulation.result === "object") {
    const result = simulation.result as { retval?: xdr.ScVal };
    return result.retval;
  }

  return undefined;
}

function assertSimulationSucceeded(simulation: unknown) {
  if (!simulation || typeof simulation !== "object") {
    throw new Error("Invalid RPC simulation response.");
  }

  const error = extractErrorMessage(simulation, "Contract simulation failed.");
  if (error) {
    throw new Error(error);
  }

  if ("restorePreamble" in simulation && simulation.restorePreamble) {
    throw new Error(
      "The contract or storage needs restoration before use. Restore it on testnet and try again.",
    );
  }
}

async function buildContractTransaction(
  sourceAddress: string,
  functionName: string,
  args: xdr.ScVal[],
) {
  const account = await server.getAccount(sourceAddress);

  return new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      Operation.invokeContractFunction({
        contract: CONTRACT_ID,
        function: functionName,
        args,
      }),
    )
    .setTimeout(30)
    .build();
}

async function submitPreparedTransaction(
  transaction: Transaction,
  walletAddress: string,
) {
  const freighter = await loadFreighter();
  await ensureWalletOnTestnet(freighter);

  const preparedTransaction = await server.prepareTransaction(transaction);
  const signed = await freighter.signTransaction(
    preparedTransaction.toEnvelope().toXDR("base64"),
    {
      address: walletAddress,
      network: NETWORK,
      networkPassphrase: NETWORK_PASSPHRASE,
    },
  );

  const signError = extractErrorMessage(
    signed,
    "Freighter could not sign the transaction.",
  );
  if (signError) {
    throw new Error(signError);
  }

  const signedTransaction = TransactionBuilder.fromXDR(
    signed.signedTxXdr,
    NETWORK_PASSPHRASE,
  ) as Transaction;

  const sendResponse = await server.sendTransaction(signedTransaction);
  if (sendResponse.status !== "PENDING") {
    throw new Error(
      sendResponse.errorResultXdr
        ? `Transaction submission failed: ${sendResponse.errorResultXdr}`
        : "Transaction submission failed before reaching the network.",
    );
  }

  const finalStatus = await server.pollTransaction(sendResponse.hash, {
    attempts: 20,
    sleepStrategy: () => 1500,
  });

  if (finalStatus.status !== "SUCCESS") {
    throw new Error(`Transaction failed with status: ${finalStatus.status}`);
  }

  return {
    hash: sendResponse.hash,
    status: finalStatus.status as TransactionStatus,
  };
}

export function isValidStellarAddress(address: string) {
  return StrKey.isValidEd25519PublicKey(address);
}

export function isValidSkillSymbol(skill: string) {
  return /^[a-zA-Z0-9_]{1,32}$/.test(skill);
}

export async function getWalletConnection(): Promise<WalletConnection> {
  const freighter = await loadFreighter();

  const connection = await freighter.isConnected();
  const connectionError = extractErrorMessage(
    connection,
    "Unable to detect Freighter.",
  );
  if (connectionError) {
    throw new Error(connectionError);
  }

  if (!connection.isConnected) {
    return { installed: false, address: null };
  }

  const allowance = await freighter.isAllowed();
  const allowanceError = extractErrorMessage(
    allowance,
    "Unable to determine whether this app is already authorized in Freighter.",
  );
  if (allowanceError) {
    throw new Error(allowanceError);
  }

  if (!allowance.isAllowed) {
    return { installed: true, address: null };
  }

  const addressResult = await freighter.getAddress();
  const addressError = extractErrorMessage(
    addressResult,
    "Unable to read the active Freighter account.",
  );
  if (addressError) {
    throw new Error(addressError);
  }

  return {
    installed: true,
    address: addressResult.address || null,
  };
}

export async function connectWallet() {
  const freighter = await loadFreighter();

  const connection = await freighter.isConnected();
  const connectionError = extractErrorMessage(
    connection,
    "Unable to detect Freighter.",
  );
  if (connectionError) {
    throw new Error(connectionError);
  }

  if (!connection.isConnected) {
    throw new Error("Freighter extension not found. Please install Freighter first.");
  }

  await ensureWalletOnTestnet(freighter);

  const access = await freighter.requestAccess();
  const accessError = extractErrorMessage(
    access,
    "Freighter rejected the connection request.",
  );
  if (accessError) {
    throw new Error(accessError);
  }

  if (!access.address) {
    throw new Error("Freighter did not return an address.");
  }

  return access.address;
}

export async function viewSkills(studentAddress: string, sourceAddress: string) {
  const transaction = await buildContractTransaction(sourceAddress, "get_skills", [
    new Address(studentAddress).toScVal(),
  ]);

  const simulation = await server.simulateTransaction(transaction);
  assertSimulationSucceeded(simulation);

  const returnValue = getSimulationReturnValue(simulation);
  return normalizeSkills(returnValue ? scValToNative(returnValue) : []);
}

export async function issueSkill(
  walletAddress: string,
  studentAddress: string,
  skillName: string,
): Promise<SubmittedTransaction> {
  const transaction = await buildContractTransaction(walletAddress, "issue_skill", [
    new Address(studentAddress).toScVal(),
    nativeToScVal(skillName, { type: "symbol" }),
  ]);

  return submitPreparedTransaction(transaction, walletAddress);
}
