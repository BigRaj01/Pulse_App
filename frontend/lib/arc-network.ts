export const ARC_TESTNET_CHAIN_ID_HEX = "0x4cef52"; // 5042002 in hex

export async function ensureArcNetwork(): Promise<void> {
  if (!window.ethereum) throw new Error("No wallet provider found");

  const currentChainId = (await window.ethereum.request({
    method: "eth_chainId",
  })) as string;

  if (currentChainId.toLowerCase() === ARC_TESTNET_CHAIN_ID_HEX.toLowerCase()) {
    return; // already on the right network
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ARC_TESTNET_CHAIN_ID_HEX }],
    });
  } catch (switchError: unknown) {
    const err = switchError as { code?: number };
    if (err?.code === 4902) {
      // Network not added to MetaMask yet — add it.
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: ARC_TESTNET_CHAIN_ID_HEX,
            chainName: "Arc Testnet",
            rpcUrls: ["https://rpc.testnet.arc.network"],
            nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
            blockExplorerUrls: ["https://testnet.arcscan.app"],
          },
        ],
      });
    } else {
      throw switchError;
    }
  }
}