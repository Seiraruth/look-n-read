type TChildren = {
    children?: React.ReactNode;
};

const NoComic = ({ children }: TChildren) => {
    return (
        <div className="col-span-4">
            <div className="text-red-500 font-bold text-2xl">{children}</div>
        </div>
    );
};

export default NoComic;
