import { ReactNode } from "react";

const HeaderPage = ({ children }: { children: ReactNode }) => {
    return (
        <div className="border-2 border-secondary mb-10 p-5 rounded-sm bg-neutral-900">
            <p className="text-neutral-100 text-2xl font-bold">{children}</p>
        </div>
    );
};

export default HeaderPage;
