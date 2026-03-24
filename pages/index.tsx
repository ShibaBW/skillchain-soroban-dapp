import Head from "next/head";
import { useEffect, useState } from "react";

import { SectionCard } from "../components/SectionCard";
import { SkillList } from "../components/SkillList";
import { WalletConnectButton } from "../components/WalletConnectButton";
import {
  CONTRACT_ID,
  SOROBAN_RPC_URL,
  connectWallet,
  getWalletConnection,
  isValidSkillSymbol,
  isValidStellarAddress,
  issueSkill,
  viewSkills,
} from "../lib/stellar";

export default function HomePage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [studentAddress, setStudentAddress] = useState("");
  const [skillName, setSkillName] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [isFreighterInstalled, setIsFreighterInstalled] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function hydrateWallet() {
      try {
        const connection = await getWalletConnection();
        if (!isMounted) {
          return;
        }

        setIsFreighterInstalled(connection.installed);
        setWalletAddress(connection.address);

        if (connection.address) {
          setStudentAddress((current) => current || connection.address || "");
        }
      } catch (caughtError) {
        if (!isMounted) {
          return;
        }

        const message =
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to check Freighter status.";

        if (/not found|install/i.test(message)) {
          setIsFreighterInstalled(false);
        }

        setError(message);
      }
    }

    void hydrateWallet();

    return () => {
      isMounted = false;
    };
  }, []);

  function requireWallet() {
    if (!walletAddress) {
      throw new Error("Connect Freighter before interacting with the contract.");
    }

    return walletAddress;
  }

  function validateInputs(options: { requireSkill: boolean }) {
    if (!studentAddress.trim()) {
      throw new Error("Enter a student wallet address.");
    }

    if (!isValidStellarAddress(studentAddress.trim())) {
      throw new Error("Enter a valid Stellar public key for the student.");
    }

    if (options.requireSkill) {
      if (!skillName.trim()) {
        throw new Error("Enter a skill name.");
      }

      if (!isValidSkillSymbol(skillName.trim())) {
        throw new Error(
          "Skill names must be 1-32 characters using only letters, numbers, or underscores.",
        );
      }
    }
  }

  async function handleConnectWallet() {
    setIsConnecting(true);
    setError(null);
    setFeedback(null);

    try {
      const address = await connectWallet();
      setWalletAddress(address);
      setStudentAddress((current) => current || address);
      setFeedback("Freighter connected on Stellar Testnet.");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to connect Freighter.",
      );
    } finally {
      setIsConnecting(false);
    }
  }

  async function handleViewSkills() {
    setIsLoadingSkills(true);
    setError(null);
    setFeedback(null);

    try {
      const source = requireWallet();
      validateInputs({ requireSkill: false });

      const result = await viewSkills(studentAddress.trim(), source);
      setSkills(result);
      setFeedback(`Loaded ${result.length} skill certificate(s) from Soroban.`);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load skills.",
      );
    } finally {
      setIsLoadingSkills(false);
    }
  }

  async function handleIssueSkill() {
    setIsIssuing(true);
    setError(null);
    setFeedback(null);

    try {
      const source = requireWallet();
      validateInputs({ requireSkill: true });

      const transaction = await issueSkill(
        source,
        studentAddress.trim(),
        skillName.trim(),
      );

      const refreshedSkills = await viewSkills(studentAddress.trim(), source);
      setSkills(refreshedSkills);
      setSkillName("");
      setFeedback(`Skill issued successfully. Transaction hash: ${transaction.hash}`);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to issue skill.",
      );
    } finally {
      setIsIssuing(false);
    }
  }

  return (
    <>
      <Head>
        <title>SkillChain</title>
        <meta
          name="description"
          content="Issue and view on-chain student skill certificates on Stellar Soroban."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-5 py-10 md:px-8 md:py-14">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 px-6 py-8 backdrop-blur md:px-10 md:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.34em] text-ember-300">
                Stellar Soroban dApp
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white md:text-6xl">
                SkillChain turns student achievements into on-chain proof.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                Connect Freighter, issue a Soroban certificate to a student
                wallet, and query the full skill list stored in your deployed
                testnet contract.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-ember-400/20 bg-night/60 p-5">
              <div className="grid gap-4 text-sm text-slate-300">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-ember-200">
                    Network
                  </p>
                  <p className="mt-2 text-white">Stellar Testnet</p>
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-ember-200">
                    Contract ID
                  </p>
                  <p className="mt-2 break-all font-mono text-xs text-slate-200">
                    {CONTRACT_ID}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-ember-200">
                    Soroban RPC
                  </p>
                  <p className="mt-2 break-all font-mono text-xs text-slate-200">
                    {SOROBAN_RPC_URL}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <WalletConnectButton
          address={walletAddress}
          isBusy={isConnecting}
          isInstalled={isFreighterInstalled}
          onConnect={handleConnectWallet}
        />

        {feedback ? (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            {feedback}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <SectionCard
            eyebrow="Certificate Actions"
            title="Issue a new skill"
            description="The connected Freighter account builds, signs, and submits the Soroban transaction."
          >
            <div className="grid gap-5">
              <label className="grid gap-2 text-sm text-slate-200">
                Student wallet address
                <input
                  value={studentAddress}
                  onChange={(event) => setStudentAddress(event.target.value)}
                  placeholder="G..."
                  className="rounded-2xl border border-white/10 bg-night/50 px-4 py-3 font-mono text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-ember-400"
                />
              </label>

              <label className="grid gap-2 text-sm text-slate-200">
                Skill symbol
                <input
                  value={skillName}
                  onChange={(event) => setSkillName(event.target.value)}
                  placeholder="Rust, TypeScript, Soroban"
                  className="rounded-2xl border border-white/10 bg-night/50 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-ember-400"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => void handleIssueSkill()}
                  disabled={isIssuing}
                  className="rounded-full bg-ember-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ember-400 disabled:cursor-not-allowed disabled:bg-slate-600"
                >
                  {isIssuing ? "Issuing..." : "Issue Skill"}
                </button>

                <button
                  type="button"
                  onClick={() => void handleViewSkills()}
                  disabled={isLoadingSkills}
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-ember-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-slate-500"
                >
                  {isLoadingSkills ? "Loading..." : "View Skills"}
                </button>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Student Ledger View"
            title="Current on-chain skills"
            description="Read the certificate list returned by get_skills for any Stellar address."
          >
            <SkillList skills={skills} />
          </SectionCard>
        </div>
      </main>
    </>
  );
}
