import React, { useState } from "react";
import Header from "@/Components/Header";

interface Properties {
    children: React.ReactNode;
}

export default function Guest({ children }: Properties): JSX.Element {
    return (
        <div className="min-h-screen">
            <Header type="guest" />
            {children}
        </div>
    );
}
