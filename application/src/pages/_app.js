import 'bootswatch/dist/minty/bootstrap.min.css';
import '@/styles/globals.css'
import {configureChains, createClient, WagmiConfig} from "wagmi";
import {publicProvider} from "wagmi/providers/public";
import {SessionProvider} from "next-auth/react";
import {mainnet} from "wagmi/chains";
import Example from "@/components/share/navbar";
import {getContract} from "@/core/utils/connect-contract";

const {provider, webSocketProvider} = configureChains(
    [mainnet],
    [publicProvider()]
);

const client = createClient({
    provider,
    webSocketProvider,
    autoConnect: true,
});
export default function App({Component, pageProps}) {

    if (typeof window !== "undefined"){
        const contract = getContract();
        contract.on('AccessRequested', (from, clusterName, fileName) => {
            console.log({event: 'AccessRequested', from, clusterName, fileName})
        })
        contract.on('AccessGranted', (from,  clusterName, fileName) => {
            console.log({event: 'AccessGranted', from, clusterName, fileName})
        })
        contract.on('AccessRemoved', (from,  clusterName, fileName) => {
            console.log({event: 'AccessRemoved', from, clusterName, fileName})
        })

    }


    return (
        <WagmiConfig client={client}>
            <SessionProvider session={pageProps.session} refetchInterval={0}>
                <Example/>
                <Component {...pageProps} />
            </SessionProvider>
        </WagmiConfig>
    )

}
