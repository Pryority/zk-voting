import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, useProvider, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
// import { publicProvider } from "wagmi/providers/public";
// import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import Layout from "../components/Layout";

const aApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

const { chains, provider } = configureChains(
  [chain.goerli],
  [
    alchemyProvider({
      apiKey: `${aApiKey}`,
    }),
    // was causing errors so this was removed for now
    // publicProvider(),
    
    // add kevlar? ↓
    // jsonRpcProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: "RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

console.log("🌐 - P R O V I D E R - CURRENT !", wagmiClient.provider);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
