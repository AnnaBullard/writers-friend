import {useState} from "react";
import {useDispatch} from "react-redux";
import {deleteScene} from "../../store/scenes";
import sanitizeHtml from 'sanitize-html';

export default function ConfirmDelete ({onSubmit, onClose, scene}) {
    const dispatch = useDispatch();

    const [confirmed, setConfirmed] = useState(false)
    const [error, setError] = useState("")

    const onDelete = e => {
        e.preventDefault();
        if (confirmed) {
            dispatch(deleteScene(scene.id))
            onClose();
        } else {
            setError("You need to confirm, that you want to delete this scene")
        }
    }

    const handleCancel = e => {
        e.preventDefault();
        setConfirmed(false);
        onClose();
    }


    return <form onSubmit={onDelete} className="confirm-box">
        <h3>Confirm detete</h3>
        {error?(<div className="errors">{error}</div>):""}
        <label>
        <input type="checkbox" checked={confirmed?"checked":false} onChange={()=>{setConfirmed(!confirmed)}}/>
        Yes, I wat to remove his scene.
        </label>
        <div className="text" dangerouslySetInnerHTML={{__html: scene.temp?sanitizeHtml(scene.temp):sanitizeHtml(scene.text)}}></div>
        <div>
            <button type="submit">Submit</button>
            <button type="reset" onClick={handleCancel}>Cancel</button>
        </div>
    </form>
}
