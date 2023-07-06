import React from "react";

import { ReactComponent as ErrorIcon } from "../../icons/error.svg";

type AlertProps = {
    children: React.ReactNode;
};

const Alert: React.FC<AlertProps> = ({ children }) => {
    return (
        <div className="flex flex-col w-96 bg-red-50 rounded-lg px-5 py-3 mt-4">
            <div className="flex flex-row items-center w-full">
                <ErrorIcon className="w-5 h-5 text-red-600 mr-2" />{" "}
                <h2 className="font-bold text-red-600 text-lg">Error</h2>
            </div>
            {children}
        </div>
    );
};

export default Alert;
