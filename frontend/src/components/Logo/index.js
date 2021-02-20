import {NavLink} from "react-router-dom";

export default function Logo ({extraClass="",link="/"}) {
    return <NavLink exact to={link} className={"logo "+extraClass}><div><span></span>Writer's Friend</div></NavLink>
}
