import {useState} from "react";

export default function ConfirmReset ({onSubmit, onClose}) {
    const [confirmed, setConfirmed] = useState(false)
    const [error, setError] = useState("")

    const onReset = e => {
        e.preventDefault();
        if (confirmed) {
            onSubmit();
            onClose();
        } else {
            setError("You need to confirm, that you understand consequences of this action.")
        }
    }

    const handleCancel = e => {
        e.preventDefault();
        setConfirmed(false);
        onClose();
    }

    return <form onSubmit={onReset}>
        <h3>Confirm reset</h3>
        {error?(<div>{error}</div>):""}
        <label>
        <input type="checkbox" checked={confirmed?"checked":false} onChange={()=>{setConfirmed(!confirmed)}}/>
        Yes, reset all the changes and lose all the progress
        </label>
        <div>
            <button type="submit">Reset</button>
            <button type="reset" onClick={handleCancel}>Cancel</button>
        </div>
    </form>
}
