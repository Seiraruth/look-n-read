import { IComicChapter } from "@/types/index.type";
import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useState,
} from "react";

type TChildren = {
    children?: ReactNode;
};

interface IContext {
    expandedCategory: string | null;
    setExpandedCategory: Dispatch<SetStateAction<string | null>>;
    categoryComics: IComicChapter[];
    setCategoryComics: Dispatch<SetStateAction<IComicChapter[]>>;
    isCategoryLoading: boolean;
    setIsCategoryLoading: Dispatch<SetStateAction<boolean>>;
}

export const Context = createContext<IContext>({
    expandedCategory: null,
    setExpandedCategory: () => {},
    categoryComics: [],
    setCategoryComics: () => {},
    isCategoryLoading: false,
    setIsCategoryLoading: () => {},
});

const ContextProvider = ({ children }: TChildren) => {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(
        null
    );
    const [categoryComics, setCategoryComics] = useState<IComicChapter[]>([]);
    const [isCategoryLoading, setIsCategoryLoading] = useState<boolean>(false);

    const ContextValue = {
        expandedCategory,
        setExpandedCategory,
        categoryComics,
        setCategoryComics,
        isCategoryLoading,
        setIsCategoryLoading,
    };

    return <Context.Provider value={ContextValue}>{children}</Context.Provider>;
};

export default ContextProvider;
