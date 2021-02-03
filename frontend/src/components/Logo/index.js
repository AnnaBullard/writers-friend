import {NavLink} from "react-router-dom";
import "./Logo.css";

export default function Logo ({extraClass="",link="/"}) {
    return <NavLink exact to={link} className={"logo "+extraClass}>Writer's Friend</NavLink>
}
