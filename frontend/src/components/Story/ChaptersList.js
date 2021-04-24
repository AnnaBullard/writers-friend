import {Link} from "react-router-dom";

export default function ChaptersList({chapters}) {
    return <ul className="chapters-list" >
        {chapters.map(chapter => <li key={`story-entity-${chapter.id}`} >
            <Link to={`/story/${chapter.id}`}>
                <b>Chapter {chapter.order+1}.</b>
                <span>{chapter.title}</span>
            </Link>
        </li>) }
    </ul>
}