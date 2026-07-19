const ARC_RPC_URL = "https://rpc.testnet.arc.network";
const USDC_CONTRACT_ADDRESS = "0x3600000000000000000000000000000000000000";
const USDC_DECIMALS = 6;
const BALANCE_OF_SELECTOR = "0x70a08231"; // keccak256("balanceOf(address)")

function padAddress(address: string): string {
  return address.replace("0x", "").toLowerCase().padStart(64, "0");
}

export async function getUsdcBalance(address: string): Promise<number> {
  const data = `${BALANCE_OF_SELECTOR}${padAddress(address)}`;

  const response = await fetch(ARC_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_call",
      params: [{ to: USDC_CONTRACT_ADDRESS, data }, "latest"],
    }),
  });

  const json = await response.json();
  if (json.error) throw new Error(json.error.message || "RPC call failed");

  const balanceHex = json.result as string;
  const balanceRaw = BigInt(balanceHex);
  return Number(balanceRaw) / 10 ** USDC_DECIMALS;
}