import "./BlocksList.css"
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import {getEntities} from "../../store/entities";

const initialData = {
    chapters: {
        'ch1': {id: "ch1", title: "A Long-expected Party"},
        'ch2': {id: "ch2", title: "The Shadow of the Past"},
        'ch3': {id: "ch3", title: "Three is Company"},
        'ch4': {id: "ch4", title: "The Departure of Boromir"},
        'ch5': {id: "ch5", title: "The Riders of Rohan"},
        'ch6': {id: "ch6", title: "The Uruk-hai"},
        'ch7': {id: "ch7", title: "Minas Tirith"},
        'ch8': {id: "ch8", title: "The Passing of the Grey Company"},
        'ch9': {id: "ch9", title: "The Muster of Rohan"}
    },

    books: {
        "bk1": {id: "bk1", title: "The Fellowship of the Ring", chapterIds:["ch1","ch2","ch3"]},
        "bk2": {id: "bk2", title: "The Two Towers", chapterIds:["ch4","ch5","ch6"]},
        "bk3": {id: "bk3", title: "The Return of the King", chapterIds:["ch7","ch8","ch9"]},
    },

    series: ["bk1","bk2","bk3"]
    
}

function Chapter ({chapter, index}) {
    return <Draggable
    draggableId={chapter.id}
    index={index}
    >{(provided)=>
        <div className="chapter"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
        >{chapter.title}
        </div>
    }
    </Draggable>

}

function ChaptersList ({children}) {
    return children
}

function Book ({chapters, book}) {
    return <div className="book">
        <h3>{book.title}</h3>
        <Droppable droppableId={book.id}>
            {(provided)=>
            <div
                ref={provided.innerRef}
                {...provided.droppableProps}
            >
                {chapters.map((chapter, index) => (
                    <Chapter chapter={chapter} index={index}/>
                ))}
                {provided.placeholder}
            </div>
            }
        </Droppable>
    </div>
}


export default function BlocksList () {
    const dispatch = useDispatch();

    const [data, setData] = useState(initialData)

    const onDragEnd = result => {

    }

    useEffect(()=>{
        dispatch(getEntities())
    },[])

    useEffect((data)=>{
        console.log(data)
    },[data])

    return <DragDropContext 
        // onDragStart
        // onDragUpdate
        onDragEnd={onDragEnd}
    >
        <div className="list-of-books">
                {data.series.map(bookId => {
                    const book = data.books[bookId]
                    const chapters = book.chapterIds.map(chapterId => data.chapters[chapterId])
                    return <Book chapters={chapters} book={book}/>
                })}
        </div>
    </DragDropContext>
}
