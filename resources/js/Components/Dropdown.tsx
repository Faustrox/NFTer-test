import { Transition } from "@headlessui/react";
import { Link } from "@inertiajs/react";
import { createContext, Fragment, useContext, useState } from "react";

interface Context {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    toggleOpen: () => void;
}

/* eslint-disable-next-line @typescript-eslint/consistent-type-assertions */
const DropDownContext = createContext<Context>({} as Context);

interface DropDownProperties {
    children: React.ReactNode;
}

const Dropdown = ({ children }: DropDownProperties): JSX.Element => {
    const [open, setOpen] = useState(false);

    const toggleOpen = (): void => {
        setOpen((previousState) => !previousState);
    };

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div className="relative">{children}</div>
        </DropDownContext.Provider>
    );
};

interface TriggerProperties {
    children: React.ReactNode;
}

const Trigger = ({ children }: TriggerProperties): JSX.Element => {
    const { open, setOpen, toggleOpen } = useContext(DropDownContext);

    return (
        <>
            <div onClick={toggleOpen}>{children}</div>

            {open && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setOpen(false);
                    }}
                ></div>
            )}
        </>
    );
};

interface ContentProperties {
    align?: string;
    width?: string;
    contentClasses?: string;
    children?: React.ReactNode;
}

const Content = ({
    align = "right",
    width = "48",
    contentClasses = "py-1 bg-white",
    children,
}: ContentProperties): JSX.Element => {
    const { open, setOpen } = useContext(DropDownContext);

    let alignmentClasses = "origin-top";

    if (align === "left") {
        alignmentClasses = "origin-top-left left-0";
    } else if (align === "right") {
        alignmentClasses = "origin-top-right right-0";
    }

    let widthClasses = "";

    if (width === "48") {
        widthClasses = "w-48";
    }

    return (
        <>
            <Transition
                as={Fragment}
                show={open}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <div
                    className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`}
                    onClick={() => {
                        setOpen(false);
                    }}
                >
                    <div className={`rounded-md ring-1 ring-black ring-opacity-5 ` + contentClasses}>{children}</div>
                </div>
            </Transition>
        </>
    );
};

interface LinkProperties {
    href?: string;
    method?: "post" | "get" | "put" | "patch" | "delete";
    as?: string;
    children?: React.ReactNode;
}

const DropdownLink = ({ href = "", method, as, children }: LinkProperties): JSX.Element => (
    <Link
        href={href}
        method={method}
        as={as}
        className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
    >
        {children}
    </Link>
);

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
