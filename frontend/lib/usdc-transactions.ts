import { Transaction } from "@/types";

const ARC_RPC_URL = "https://rpc.testnet.arc.network";
const USDC_CONTRACT_ADDRESS = "0x3600000000000000000000000000000000000000";
const USDC_DECIMALS = 6;

// keccak256("Transfer(address,address,uint256)") — the standard ERC20 Transfer event signature.
const TRANSFER_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

function padAddressTopic(address: string): string {
  return "0x" + address.replace("0x", "").toLowerCase().padStart(64, "0");
}

function topicToAddress(topic: string): string {
  return "0x" + topic.slice(-40);
}

async function rpcCall(method: string, params: unknown[]): Promise<any> {
  const response = await fetch(ARC_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const json = await response.json();
  if (json.error) throw new Error(json.error.message || `${method} failed`);
  return json.result;
}

interface RawLog {
  transactionHash: string;
  blockNumber: string;
  topics: string[];
  data: string;
}

const blockTimestampCache = new Map<string, number>();

async function getBlockTimestamp(blockNumber: string): Promise<number> {
  if (blockTimestampCache.has(blockNumber)) {
    return blockTimestampCache.get(blockNumber)!;
  }
  const block = await rpcCall("eth_getBlockByNumber", [blockNumber, false]);
  const timestamp = parseInt(block.timestamp, 16) * 1000;
  blockTimestampCache.set(blockNumber, timestamp);
  return timestamp;
}

export async function getUsdcTransferHistory(address: string): Promise<Transaction[]> {
  const addressTopic = padAddressTopic(address);

  const [outgoing, incoming] = await Promise.all([
    rpcCall("eth_getLogs", [
      {
        address: USDC_CONTRACT_ADDRESS,
        topics: [TRANSFER_TOPIC, addressTopic],
        fromBlock: "0x0",
        toBlock: "latest",
      },
    ]) as Promise<RawLog[]>,
    rpcCall("eth_getLogs", [
      {
        address: USDC_CONTRACT_ADDRESS,
        topics: [TRANSFER_TOPIC, null, addressTopic],
        fromBlock: "0x0",
        toBlock: "latest",
      },
    ]) as Promise<RawLog[]>,
  ]);

  const allLogs = [
    ...outgoing.map((log) => ({ log, type: "outgoing" as const })),
    ...incoming.map((log) => ({ log, type: "incoming" as const })),
  ];

  const transactions = await Promise.all(
    allLogs.map(async ({ log, type }) => {
      const amountRaw = BigInt(log.data);
      const amount = Number(amountRaw) / 10 ** USDC_DECIMALS;
      const counterpartyTopic = type === "outgoing" ? log.topics[2] : log.topics[1];
      const timestamp = await getBlockTimestamp(log.blockNumber);

      return {
        id: log.transactionHash,
        type,
        amount,
        status: "completed" as const,
        counterparty: topicToAddress(counterpartyTopic),
        timestamp: new Date(timestamp).toISOString(),
      };
    })
  );

  return transactions.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}