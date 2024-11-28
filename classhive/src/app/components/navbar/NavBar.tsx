import React from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';

const NavBar: React.FC = () => {
    const router = useRouter();


    const handleNavigation = (path: string): void => {
        router.push(path); 
    };

    return (
        <div className="flex border border-TextColor w-full h-[85%] items-center justify-between bg-white p-3">
            <button 
                onClick={() => handleNavigation("/Profile")}
                className="flex w-[10%] h-full">
                <Image 
                    src="/images/logo.png"
                    alt="logo"
                    width={70}
                    height={90}
                />
            </button>
            <span className="flex items-center w-[20%] h-full justify-around">
                <button 
                    className="flex text-[18px] text-TextColor" 
                    onClick={() => handleNavigation("/Profile")}
                >
                    Profile
                </button>
                <button 
                    className="flex text-[18px] text-TextColor" 
                    onClick={() => handleNavigation("/Cours")} 
                >
                    Courses
                </button>
            </span>
        </div>
    );
};

export default NavBar;
