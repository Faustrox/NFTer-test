import { useState } from "react";
import Header from "@/Components/Header";

/* eslint-disable @typescript-eslint/strict-boolean-expressions */
interface Properties {
    auth: { user: { address: string } };
    header: React.ReactNode;
    children?: React.ReactNode;
    error?: any;
}

export default function Authenticated({ auth, header, children }: Properties): JSX.Element {
    return (
        <>
            <Header
                type="dashboard"
                address={auth.user.address}
            />
            {children}
        </>
    );
}
