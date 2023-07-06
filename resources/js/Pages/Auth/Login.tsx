import React, { useState } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, usePage } from "@inertiajs/react";
import { useMetaMaskContext } from "@/Contexts/MetaMaskContext";
import Alert from "@/Components/Alert";
import Button from "@/Components/Button";

import { ReactComponent as Spinner } from "../../../icons/spinner.svg";
import { ReactComponent as MetaLogo } from "../../../icons/metamask.svg";

export default function Login(): JSX.Element {
    const { auth } = usePage().props;
    const { connectWallet, connecting, errorMessage } = useMetaMaskContext();

    return (
        <GuestLayout>
            <Head title="Log in" />
            <div className="flex flex-col items-center justify-center h-[90vh]">
                <div className="flex flex-col items-center justify-center">
                    <div className="p-6 rounded-full bg-yellow-50">
                        <MetaLogo className="h-16 w-16 fill-current text-gray-500" />
                    </div>

                    <div className="flex flex-col mt-4 items-center text-center">
                        <h1 className="font-bold text-2xl">Welcome</h1>
                        <h2 className="text-gray-500 font-semibold">Connect your wallet via MetaMask to continue</h2>
                    </div>
                </div>

                {connecting ? (
                    <div className="flex items-center mt-4 gap-2">
                        <Spinner /> <h2 className="font-bold">Connecting ...</h2>
                    </div>
                ) : (
                    <Button
                        className="mt-4 text-lg"
                        onClick={connectWallet}
                    >
                        {errorMessage !== "" ? "Retry" : "Connect Wallet"}
                    </Button>
                )}
                {errorMessage && (
                    <Alert>
                        <h3 className="mt-2 text-meta-black-700 font-semibold">
                            There was a problem connecting the wallet to the NFTer, try again.
                        </h3>
                    </Alert>
                )}
            </div>
        </GuestLayout>
    );
}
