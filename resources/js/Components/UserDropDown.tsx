import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

import { useMetaMaskContext } from "@/Contexts/MetaMaskContext";
import { ReactComponent as ChevronIcon } from "../../icons/chevron.svg";
import { ReactComponent as ExitIcon } from "../../icons/exit.svg";
import { ReactComponent as ExternalIcon } from "../../icons/external.svg";

type UserDropDownProps = {
    address: string;
};

const UserDropDown: React.FC<UserDropDownProps> = ({ address }) => {
    const { logout } = useMetaMaskContext();
    const strimmedAddress = address?.slice(0, 5) + "..." + address?.slice(-5);

    return (
        <Menu
            as="div"
            className="relative ml-auto p-2 rounded-xl border-0 md:border-2 border-meta-black-300"
        >
            <Menu.Button className="flex items-center px-1">
                <Jazzicon
                    diameter={25}
                    seed={jsNumberForAddress("0x1111111111111111111111111111111111111111")}
                />
                <span className="ml-2 text-sm font-semibold text-meta-black-800">{strimmedAddress}</span>
                <div className="mx-4 content-[' '] h-[15px] border-r-2 border-meta-black-300" />
                <ChevronIcon className="h-4 w-4 text-meta-black-600" />
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 mt-3 py-4 w-56 origin-top-right divide-y divide-gray-100 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                        <a
                            href={"https://etherscan.io/address/" + address}
                            target="_blank"
                            className={`flex flex-row items-center w-full h-12 pl-6 duration-300 hover:bg-meta-black-200 active:bg-meta-black-300 font-bold text-meta-black-700 hover:text-black`}
                        >
                            <ExternalIcon className="h-4 w-4 mr-2 text-inherit" /> View on Explorer
                        </a>
                    </Menu.Item>
                    <Menu.Item>
                        <button
                            onClick={logout}
                            className={`flex flex-row items-center w-full h-12 pl-6 duration-300 hover:bg-meta-black-200 active:bg-meta-black-300 font-bold text-meta-black-700 hover:text-black`}
                        >
                            <ExitIcon className="h-4 w-4 mr-2 text-inherit" />
                            Disconnect Wallet
                        </button>
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default UserDropDown;
