import {Link} from "react-router-dom";
export default function PageNotFound () {
    document.title = `Writer's Friend - Page not found`
    return <>
        <h1>Page not found</h1>
        <div>Go to the <Link to="/">Home Page</Link></div>
    </>
}