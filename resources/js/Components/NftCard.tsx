import React from "react";
import { Tooltip } from "./Tooltip";

type NftType = {
    token: string;
    image_url: string;
    collection_name: string;
    collection_image: string | null;
    external_url: string | null;
};

type CardProps = {
    nft: NftType;
};

const NftCard: React.FC<CardProps> = ({ nft }) => {
    return (
        <section className="w-full p-2 border-2 rounded-xl duration-300 hover:border-meta-blue-500">
            <div className="w-full rounded-xl">
                <img
                    className="rounded-xl w-full h-auto min-h-[270px]"
                    src={nft.image_url}
                    alt="NFT"
                />
            </div>
            <article className="mt-4 h-20 px-4">
                <Tooltip content={`${nft.collection_name} #${nft.token}`}>
                    <a
                        href={nft.external_url || ""}
                        className="select-none text-xl font-bold truncate duration-300 cursor-pointer hover:text-meta-blue-700"
                    >
                        {nft.collection_name} <span>#{nft.token}</span>
                    </a>
                </Tooltip>
                <div className="flex mt-1">
                    <img
                        className="h-6 w-6 mr-2 rounded-md"
                        src={nft.collection_image || ""}
                        alt="Collection Image"
                    />
                    <h2 className="text-meta-blue-600 font-bold truncate">{nft.collection_name}</h2>
                </div>
            </article>
        </section>
    );
};

export default NftCard;
