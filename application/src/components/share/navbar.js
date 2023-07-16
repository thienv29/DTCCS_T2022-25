import React, {useState} from 'react';
import Link from "next/link";
import {signOut} from "next-auth/react";
import {Button} from "reactstrap";

function Example(args) {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
                <div className="container">
                    <Link className="navbar-brand" href="/"><img src="/logo.png" alt="logo" width={80}
                                                                 height={50}/></Link>
                    <button className="navbar-toggler" type="button" onClick={toggle} data-bs-toggle="collapse"
                            data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"/>
                    </button>
                    <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarColor01">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link className="nav-link" href="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/workspace">Workspace</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/user">Profile</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/documents">Documents</Link>
                            </li>

                        </ul>
                        <Button
                            color="danger"
                            size="sm"
                            onClick={() => signOut({redirect: "/"})}
                        >
                            Sign out
                        </Button>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Example;