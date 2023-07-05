import GuestLayout from "@/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";
import { useMetaMaskContext } from "@/Contexts/MetaMaskContext";

export default function Login(): JSX.Element {
    const { connectWallet } = useMetaMaskContext();

    return (
        <GuestLayout>
            <Head title="Log in" />

            <button
                onClick={() => {
                    connectWallet();
                }}
            >
                Connect MetaMask
            </button>
        </GuestLayout>
    );
}
