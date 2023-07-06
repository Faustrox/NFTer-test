import React from "react";
import Button from "./Button";
import { useMetaMaskContext } from "@/Contexts/MetaMaskContext";

import UserDropDown from "./UserDropDown";
import { ReactComponent as NFTLogo } from "../../icons/logo/nfter-with-text.svg";

type HeaderProps = {
    type: "guest" | "dashboard";
    address?: string;
};

const Header: React.FC<HeaderProps> = ({ type, address }) => {
    const { connectWallet, connecting } = useMetaMaskContext();

    return (
        <div className="h-[80px] w-full flex flex-row items-center p-4 border-2">
            <NFTLogo className="h-32 w-32" />
            {type === "guest" ? (
                <Button
                    onClick={connectWallet}
                    disabled={connecting}
                    className={`ml-auto ${connecting ? "bg-meta-black-200" : ""}`}
                >
                    Connect
                </Button>
            ) : (
                <UserDropDown address={address || ""} />
            )}
        </div>
    );
};

export default Header;
