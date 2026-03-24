type WalletConnectButtonProps = {
  address: string | null;
  isBusy: boolean;
  isInstalled: boolean;
  onConnect: () => Promise<void>;
};

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

export function WalletConnectButton({
  address,
  isBusy,
  isInstalled,
  onConnect,
}: WalletConnectButtonProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-night/40 p-5">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-emerald-300">
          Freighter Wallet
        </p>
        <p className="mt-2 text-sm text-slate-300">
          {isInstalled
            ? address
              ? `Connected as ${truncateAddress(address)}`
              : "Connect Freighter on Testnet to issue or view certificates."
            : "Freighter was not detected in this browser."}
        </p>
      </div>

      <button
        type="button"
        onClick={() => void onConnect()}
        disabled={isBusy || !isInstalled}
        className="inline-flex items-center justify-center rounded-full bg-ember-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ember-400 disabled:cursor-not-allowed disabled:bg-slate-600"
      >
        {address ? "Reconnect Wallet" : isBusy ? "Connecting..." : "Connect Wallet"}
      </button>
    </div>
  );
}
