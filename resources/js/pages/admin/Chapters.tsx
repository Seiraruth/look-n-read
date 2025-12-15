import { useParams } from "react-router-dom";

const Chapters = () => {
    const { id } = useParams();
    return (
        <div>
            <h1>Chapters {id}</h1>
        </div>
    );
};

export default Chapters;
