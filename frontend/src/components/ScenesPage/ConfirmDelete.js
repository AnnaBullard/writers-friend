import {useState} from "react";

export default function ConfirmDelete ({onSubmit, onClose, scene}) {
    const [confirmed, setConfirmed] = useState(false)
    const [error, setError] = useState("")

    const onReset = e => {
        e.preventDefault();
        if (confirmed) {
            onSubmit();
            onClose();
        } else {
            setError("You need to confirm, that you want to delete this scene")
        }
    }

    return <form onSubmit={onReset}>
        <h3>Confirm detete</h3>
        {error?(<div>{error}</div>):""}
        <label>
        <input type="checkbox" checked={confirmed?"checked":false} onChange={()=>{setConfirmed(!confirmed)}}/>
        Yes, I wat to remove his scene.
        </label>
        <div>{scene.text}</div>
        <button>Submit</button>
    </form>
}
