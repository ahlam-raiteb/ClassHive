"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IconEmail } from "../../icone/icone";
import { useRouter } from 'next/navigation';
import {signIn} from "next-auth/react"


interface LoginDataProps {
    register: boolean;
}

const LoginData: React.FC<LoginDataProps> = ({ register }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [isError, setError] = useState("");
    const router = useRouter();
   


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!email || !password){
            setError("all fields are necessary");
            return;
        }
        try{
            const response = await signIn("credentials",{
                email,
                password,
                redirect:false,
            });
            if (response?.error) {
                setError("Invalid Credentials");
                return;
            }
            router.push("/Profile");
        }catch (error){
            console.error('login failed', error);
        }
    };


    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!firstname || !lastname || !email || !password) {
            setError("All fields are necessary");
            return;
        }
        setError("");

        try {
            const resExit = await fetch ("/api/userExists", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email}),
            });

            const {user} = await resExit.json();
            if(user) {
                setError("User already exists.");
                return;
            }
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ firstname, lastname, email, password }),
            });

            if (response.ok) {
                setFirstName("");
                setLastName("");
                setEmail("");
                setPassword("");
                router.push("/Login"); 
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Registration failed");
            }
        } catch (error) {
            setError("An error occurred during registration.");
            console.error("Registration error:", error);
        }
    };
    

    if (register) {
        return (
            <div className="flex flex-col border border-2 w-full h-full items-center justify-around relative border-BorderColor rounded">
                <div className="flex w-full h-2%">
                    <Image
                        src="/images/logo.png"
                        alt="logo"
                        width={900}
                        height={900}
                        className="w-[100px] h-[90px] absolute right-5"
                    />
                </div>
                <form
                    className="flex flex-col w-5/6 h-4/5 items-center space-y-3"
                    onSubmit={handleRegister}
                >
                    <span className="w-[300px] h-[60px]">
                        <p className="text-[16px] text-TextColor">First Name</p>
                        <input
                            type="text"
                            className="w-full border rounded p-2"
                            placeholder="Enter your first name"
                            value={firstname}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </span>
                    <span className="w-[300px] h-[60px]">
                        <p className="text-[16px] text-TextColor">Last Name</p>
                        <input
                            type="text"
                            className="w-full border rounded p-2"
                            placeholder="Enter your last name"
                            value={lastname}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </span>
                    <span className="w-[300px] h-[60px]">
                        <p className="text-[16px] text-TextColor">Email</p>
                        <input
                            type="email"
                            className="w-full border rounded p-2"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </span>
                    <span className="w-[300px] h-[60px]">
                        <p className="text-[16px] text-TextColor">Password</p>
                        <input
                            type="password"
                            className="w-full border rounded p-2"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </span>
                    <button
                        type="submit"
                        className="w-[80px] h-[40px] text-TextColor bg-ButtonColor flex items-center justify-center rounded"
                    >
                        Submit
                    </button>
                    {isError && (
                        <div className="flex text-[11px] text-red-500">{isError}</div>
                    )}
                </form>
            </div>
        );
    } 
    else {
        return (
            <div className="flex flex-col border border-2 w-full h-full items-center justify-around relative border-BorderColor rounded">
                <div className="flex w-full h-5%">
                    <Image 
                        src="/images/logo.png"
                        alt="logo"
                        width={900}
                        height={900}
                        className="w-[100px] h-[90px] absolute right-5"
                    />
                </div>
                <form className="flex flex-col w-5/6 h-2/5 items-center space-y-3" onSubmit={handleLogin}>
                    <span className="w-[300px] h-[60px]">
                        <p className="text-[16px] text-TextColor">Email</p>
                        <input
                            type="email"
                            className="w-full border rounded p-2"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </span>
                    <span className="w-[300px] h-[110px] relative">
                        <p className="text-[16px] text-TextColor">Password</p>
                        <input
                            type="password"
                            className="w-full border rounded p-2"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <p className="text-[11px] text-TextColor absolute right-1">Forgot your password?</p>
                    </span>
                    <button 
                        type="submit"
                        className="w-[80px] h-[40px] text-TextColor bg-ButtonColor flex items-center justify-center rounded"
                        >
                        Submit
                    </button>
                </form>
                <span className="flex flex-col items-center space-x-4">
                    { isError && 
                        <div className="flex justify-start text-[11px]">
                            {isError}
                        </div>
        
                    }
                    <div className="flex items-center space-x-4">
                        <p className="text-[16px] text-TextColor">Continue With: </p>
                        <a href="/auth/google-callback"><button ><IconEmail /></button></a>
                    </div>
                </span>
            </div>
        );
    }
};

export default LoginData;
