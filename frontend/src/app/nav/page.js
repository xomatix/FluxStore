"use client"
import { GroupController } from "@/controllers/groupControllers";
import { useEffect, useState } from 'react';

const NavigationBar = () => {
    const [groups, setGroups] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const inputModel = {};
                const response = await GroupController.list(inputModel);
                setGroups(response.data || []);
            } catch (error) {
                console.error("Failed to fetch groups:", error);
            }
        };

        fetchGroups();
    }, []);


    const handleGroupRedirect = (e, link) => {
        e.preventDefault();
        window.location.href = `${link}`;
    };

    return (
        <div className="page">
            <div
                className="page-item"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
                aria-expanded={showDropdown}
                role="button"
                tabIndex={0}
            >
                Groups
                {showDropdown && (
                    <div className="dropdown-menu" aria-labelledby="dropdownMenu">
                        {groups.length > 0 ? (
                            groups.map((group, index) => (
                                <div
                                    key={index}
                                    className="dropdown-item"
                                    onClick={(e) => handleGroupRedirect(e, "http://localhost:3000/group/" + group.id)}
                                    role="menuitem"
                                    tabIndex={index}
                                >
                                    {group.name}
                                </div>
                            ))
                        ) : (
                            <div className="dropdown-item">
                                Loading... {}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );



};

export default NavigationBar;
