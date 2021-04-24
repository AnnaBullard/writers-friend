import BookCover from "./BookCover";

export default function BookList({books}) {
    return <div className="books-list" >
        {books.map(book => <BookCover key={`story-entity-${book.id}`} entity={book} />) }
    </div>
}