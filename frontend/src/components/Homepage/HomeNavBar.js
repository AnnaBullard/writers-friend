import Logo from "../Logo";
import { useSelector } from 'react-redux';
import ProfileButton from '../Navigation/ProfileButton';
import LoginFormModal from '../LoginFormModal';

export default function HomeNavBar () {
    const sessionUser = useSelector(state => state.session.user);

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
        <ProfileButton user={sessionUser} />
        );
    } else {
        sessionLinks = (
        <>
            <LoginFormModal />
        </>
        );
    }

    return <div className="home-logo-navbar">
        <Logo extraClass="home" />
        <div>
            <span>{`Welcome, ${sessionUser?sessionUser.username:"stranger"}!` }</span>
            <span>{sessionLinks}</span>
        </div>
    </div>
}
