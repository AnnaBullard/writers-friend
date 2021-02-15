import {useState} from "react";
import {useDispatch} from "react-redux";
import {deletePseudonym} from "../../store/pseudonyms";

export default function ConfirmDelete ({onClose, pseudo}) {
    const dispatch = useDispatch();
    const [confirmed, setConfirmed] = useState(false)
    const [error, setError] = useState("")

    const onDelete = e => {
        e.preventDefault();
        if (confirmed) {
            dispatch(deletePseudonym(pseudo.id))
            onClose();
        } else {
            setError(`You need to confirm, that you want to delete this pseudonym`)
        }
    }

    return <form onSubmit={onDelete} className="confirm-box">
        <h3>Confirm detete</h3>
        {error?(<div className="errors">{error}</div>):""}
        <label>
        <input type="checkbox" checked={confirmed?"checked":false} onChange={()=>{setConfirmed(!confirmed)}}/>
        Yes, I wat to remove {pseudo.firstName+(pseudo.middleName?" "+pseudo.middleName:"")+" "+pseudo.lastName}.
        </label>
        <button>Submit</button>
    </form>
}
