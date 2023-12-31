import { type VisitOptions } from "@inertiajs/core";
import { router } from "@inertiajs/react";
import axios from "axios";
import { ethers, utils } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { type Ethereum } from "./useMetaMask.contracts";

const hasMetaMask = (): boolean => window.ethereum !== undefined;

const getEthereum = (): Ethereum => window.ethereum as Ethereum;

// Metamask supports Chrome, Firefox, Brave, Edge, and Opera, since Edge and
// Opera are based on Chromium, we can just check for Chrome and Firefox
// @see https://metamask.io/download/
const isMetaMaskSupportedBrowser = (): boolean => {
    // If the user has MetaMask installed, we can assume they are on a supported browser
    if (hasMetaMask()) {
        return true;
    }

    const isCompatible = /chrome|firefox/.test(navigator.userAgent.toLowerCase());
    const isMobile = /android|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());

    return isCompatible && !isMobile;
};

export interface MetaMaskState {
    account?: string;
    chainId?: number;
    connectWallet: () => Promise<void>;
    connecting: boolean;
    initialized: boolean;
    needsMetaMask: boolean;
    supportsMetaMask: boolean;
    errorMessage?: string;
    logout: () => Promise<void>;
    nfts: NftType[];
}

type NftType = {
    token: string;
    image_url: string;
    collection_name: string;
    collection_image: string | null;
    external_url: string | null;
};

enum ErrorType {
    Generic,
    ProviderMissing,
    InvalidNetwork,
    NoAccount,
    UserRejected,
}

const ErrorTypes = {
    [ErrorType.NoAccount]: "no_account",
    [ErrorType.Generic]: "generic",
    [ErrorType.InvalidNetwork]: "invalid_network",
    [ErrorType.ProviderMissing]: "provider_missing",
    [ErrorType.UserRejected]: "user_rejected",
};

const useMetaMask = (): MetaMaskState => {
    const [initialized, setInitialized] = useState<boolean>(false);
    const [chainId, setChainId] = useState<number>();
    const [account, setAccount] = useState<string>();
    const [ethereumProvider, setEthereumProvider] = useState<ethers.providers.Web3Provider>();
    const [connecting, setConnecting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [nfts, setNfts] = useState<NftType[]>([]);
    const supportsMetaMask = isMetaMaskSupportedBrowser();
    const needsMetaMask = !hasMetaMask() || !supportsMetaMask;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const logout = async (): Promise<void> => {
        // TODO: implement
        await new Promise<void>((resolve) => {
            router.visit(route("logout"), {
                replace: true,
                method: "post" as VisitOptions["method"],
                onFinish: () => {
                    localStorage.removeItem("nfts");
                    resolve();
                },
            });
        });
    };

    const getNfts = async (address: string): Promise<void> => {
        await axios.get(`/api/nfts/${address}`).then((response) => {
            localStorage.setItem("nfts", JSON.stringify(response.data));
            setNfts(response.data);
        });
    };

    // Initialize the Web3Provider when the page loads
    useEffect(() => {
        if (!supportsMetaMask || needsMetaMask) {
            setInitialized(true);
            return;
        }

        const ethereum = getEthereum();

        const initProvider = async (): Promise<void> => {
            const provider = new ethers.providers.Web3Provider(ethereum, "any");

            const [chain, accounts] = await Promise.all([provider.getNetwork(), provider.listAccounts()]);

            const account = accounts.length > 0 ? utils.getAddress(accounts[0]) : undefined;
            const chainId = chain.chainId;

            const storedNfts = localStorage.getItem("nfts");
            if (storedNfts) {
                setNfts(JSON.parse(storedNfts));
            }

            setAccount(account);

            setChainId(chainId);

            setEthereumProvider(provider);

            // In case the user was connected prior, this will be available
            console.log("connected prior with:", account);

            setInitialized(true);
        };

        void initProvider();

        const accountChangedListener = (accounts: string[]): void => {
            setAccount(accounts.length > 0 ? utils.getAddress(accounts[0]) : undefined);
        };

        const chainChangedListener = (chainId: string): void => {
            // Chain ID came in as a hex string, so we need to convert it to decimal
            setChainId(Number.parseInt(chainId, 16));
        };
        const connectListener = ({ chainId }: { chainId: string }): void => {
            chainChangedListener(chainId);
        };

        const disconnectListener = (): void => {
            setChainId(undefined);
        };

        ethereum.on("accountsChanged", accountChangedListener);

        ethereum.on("chainChanged", chainChangedListener);

        ethereum.on("disconnect", disconnectListener);

        // Connect event is fired when the user is disconnected because an error
        // (e.g. the network is invalid) and then switches to a valid network
        ethereum.on("connect", connectListener);

        return () => {
            ethereum.removeListener("accountsChanged", accountChangedListener);
            ethereum.removeListener("chainChanged", chainChangedListener);
            ethereum.removeListener("connect", connectListener);
            ethereum.removeListener("disconnect", disconnectListener);
        };
    }, []);

    const requestAccount = useCallback(async () => {
        try {
            if (ethereumProvider === undefined) {
                throw new Error("Ethereum provider is not set");
            }

            // At this point we know for sure that the `ethereumProvider` is set
            const [accounts] = (await Promise.all([ethereumProvider.send("eth_requestAccounts", [])])) as [string[]];

            return {
                account: accounts.length > 0 ? accounts[0] : undefined,
            };
        } catch {
            return {
                account: undefined,
            };
        }
    }, [ethereumProvider]);

    const onError = useCallback((error: ErrorType, errorMessage?: string) => {
        setErrorMessage(errorMessage ?? ErrorTypes[error]);

        setConnecting(false);
    }, []);

    const connectWallet = useCallback(async () => {
        setConnecting(true);

        setErrorMessage("");

        const { account } = await requestAccount();

        if (account === undefined) {
            onError(ErrorType.NoAccount);
            return;
        }

        const address = utils.getAddress(account);

        // In case the user was connected properly, the address will be available
        console.log("connected with:", account);

        // TODO: create user by posting data
        router.visit(route("login"), {
            replace: true,
            method: "post" as VisitOptions["method"],
            data: {
                address,
                nfts,
            },
            onError: (error) => {
                const firstError = [error.address, error.chainId].find((value) => typeof value === "string");

                onError(ErrorType.Generic, firstError);
            },
            onFinish: () => {
                setAccount(account);

                setChainId(chainId);

                setConnecting(false);
            },
        });

        await getNfts(address);
    }, [requestAccount, router]);

    return {
        account,
        chainId,
        connectWallet,
        connecting,
        initialized,
        needsMetaMask,
        supportsMetaMask,
        errorMessage,
        logout,
        nfts,
    };
};

export default useMetaMask;
