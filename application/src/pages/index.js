import {MetaMaskConnector} from "wagmi/connectors/metaMask";
import {getSession, signIn} from "next-auth/react";
import {useAccount, useConnect, useDisconnect, useSignMessage} from "wagmi";
import {useRouter} from "next/router";
import {useAuthRequestChallengeEvm} from "@moralisweb3/next";
import {Button} from "reactstrap";
import {getContract} from "@/core/utils/connect-contract";
import {useEffect, useState} from "react";

function Index() {
    const {connectAsync} = useConnect();
    const {disconnectAsync} = useDisconnect();
    const {isConnected} = useAccount();
    const {signMessageAsync} = useSignMessage();
    const {requestChallengeAsync} = useAuthRequestChallengeEvm();
    const {push} = useRouter();


    useEffect(() => {
        const contract = getContract();
        contract.on('UserSignin', (eventArgs) => {
            push('/user')
        })
    }, [])

    const handleAuth = async () => {
        if (isConnected) {
            await disconnectAsync();
        }

        const {account, chain} = await connectAsync({
            connector: new MetaMaskConnector(),
        });

        const {message} = await requestChallengeAsync({
            address: account,
            chainId: chain.id,
        });

        const signature = await signMessageAsync({message});

        // redirect user after success authentication to '/user' page
        const {url} = await signIn("moralis-auth", {
            message,
            signature,
            redirect: false,
            callbackUrl: "/user",
        });

        await getContract().signin();
        /**
         * instead of using signIn(..., redirect: "/user")
         * we get the url from callback and push it to the router to avoid page refreshing
         */
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center "
            style={{height: "100vh"}}
        >
            <div className="flex-center flex-col">
                <h3>Hệ thống lưu trữ tài liệu điện tử</h3>
                <Button onClick={handleAuth}>Đăng nhập với metamask</Button>
            </div>
        </div>
    );
}

export default Index;
