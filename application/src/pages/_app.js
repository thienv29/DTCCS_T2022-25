import 'bootswatch/dist/minty/bootstrap.min.css';
import '@/styles/globals.css'
import {configureChains, createClient, WagmiConfig} from "wagmi";
import {publicProvider} from "wagmi/providers/public";
import {SessionProvider} from "next-auth/react";
import {mainnet} from "wagmi/chains";
import {createContext, useEffect, useState} from "react";
import {getContract} from "@/core/utils/connect-contract";
import Example from "@/components/share/navbar";

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



    return (
            <WagmiConfig client={client}>
                <SessionProvider session={pageProps.session} refetchInterval={0}>
                    <Example/>
                    <Component {...pageProps} />
                </SessionProvider>
            </WagmiConfig>
    )

}
