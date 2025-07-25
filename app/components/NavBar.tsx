import {Link} from "react-router";

export const NavBar = () => {
    return (
        <nav className="navbar">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">Resume Buddy</p>
            </Link>
            <Link to="/upload" className="primary-button w-fit">
                Upload Resume
            </Link>
        </nav>
    );
};