import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import NFTCard from "@/Components/NftCard";
import { useMetaMaskContext } from "@/Contexts/MetaMaskContext";

import { ReactComponent as Spinner } from "../../icons/spinner.svg";
import { ReactComponent as NoNftIcon } from "../../icons/no-nft.svg";

interface Properties {
    auth: { user: { address: string } };
    errors: any;
}

export default function Dashboard(properties: Properties): JSX.Element {
    const [loading, setLoading] = useState(true);
    const { nfts } = useMetaMaskContext();

    const waitForNfts = () => {
        if (nfts.length === 0) {
            setTimeout(() => {
                setLoading(false);
            }, 1500);
        }
    };

    useEffect(() => {
        waitForNfts();
    }, []);

    return (
        <AuthenticatedLayout
            auth={properties.auth}
            /* eslint-disable-next-line  @typescript-eslint/no-unsafe-assignment */
            error={properties.errors}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            {nfts.length > 0 ? (
                <div className="flex justify-center">
                    <div className="inline-grid 2xl:grid-cols-5 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-3 w-[90%] justify-items-center my-12">
                        {nfts.map((nft, indx) => (
                            <NFTCard
                                key={indx}
                                nft={nft}
                            />
                        ))}
                    </div>
                </div>
            ) : loading ? (
                <div className="flex flex-col items-center w-full mt-10">
                    <Spinner />
                    Loading
                </div>
            ) : (
                <div className="flex flex-col items-center w-full mt-10">
                    <NoNftIcon className="h-12 w-12" />
                    <h2 className="mt-3 font-bold text-[17px] text-meta-black-700">
                        Unfortunately your wallet does not own any NFTs.
                    </h2>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
