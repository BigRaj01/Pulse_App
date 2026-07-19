import { ensureArcNetwork } from "./arc-network";

const USDC_CONTRACT_ADDRESS = "0x3600000000000000000000000000000000000000";
const USDC_DECIMALS = 6;
const APPROVE_SELECTOR = "0x095ea7b3"; // keccak256("approve(address,uint256)")

function padHex(hex: string, length: number): string {
  return hex.replace("0x", "").padStart(length, "0");
}

function encodeApprove(spender: string, amount: bigint): string {
  const spenderPadded = padHex(spender, 64);
  const amountPadded = padHex(amount.toString(16), 64);
  return `${APPROVE_SELECTOR}${spenderPadded}${amountPadded}`;
}

export async function approveUsdcSpending(
  ownerAddress: string,
  spenderAddress: string,
  amountUsdc: number
): Promise<string> {
  if (!window.ethereum) throw new Error("No wallet provider found");
  if (!ownerAddress) throw new Error("Missing owner address");
  if (!spenderAddress) throw new Error("Missing spender address (check NEXT_PUBLIC_DEV_WALLET_ADDRESS)");

  await ensureArcNetwork();

  const amountInSmallestUnit = BigInt(Math.round(amountUsdc * 10 ** USDC_DECIMALS));
  const data = encodeApprove(spenderAddress, amountInSmallestUnit);

  const txHash = (await window.ethereum.request({
    method: "eth_sendTransaction",
    params: [
      {
        from: ownerAddress,
        to: USDC_CONTRACT_ADDRESS,
        data,
      },
    ],
  })) as string;

  return txHash;
}