import { Label } from '@radix-ui/react-label';
import React, { useState ,useEffect} from 'react';
import { Button } from './ui/button';
import { toast } from "sonner"
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
export const Signup = () => {

    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    });
    const {user}=useSelector(store=>store.auth)

    const [error, setError] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const Navigate=useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.username || !input.email || !input.password) {
            setError("All fields are required!");
            return;
        }
        if (input.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        setIsLoading(true);
        try {
            const res = await axios.post('https://yapper-8ny9.onrender.com/api/v1/user/register', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                setIsSubmitted(true);
                setError("");
                setInput({ username: "", email: "", password: "" });
                Navigate('/')
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error(error);
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(()=>{
        if(user)
        {
          Navigate("/")
        }
     },[])

    return (
        <div className="flex items-center w-screen h-screen justify-center bg-gradient-to-r from-purple-500 to-pink-500">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-purple-700">Yapper</h1>
                    <p className="text-gray-600 mt-2">Unlock the world of social media</p>
                </div>
                <div className="space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {isSubmitted && <p className="text-green-500 text-sm">Sign up successful!</p>}
                    <div>
                        <Label htmlFor="username" className="text-gray-700 font-semibold">
                            Username
                        </Label>
                        <input
                            type="text"
                            name="username"
                            placeholder="JhonDoe"
                            required
                            className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={input.username}
                            onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <Label htmlFor="email" className="text-gray-700 font-semibold">
                            Email
                        </Label>
                        <input
                            type="email"
                            name="email"
                            placeholder="JhonDoe@gmail.com"
                            required
                            className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={input.email}
                            onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <Label htmlFor="password" className="text-gray-700 font-semibold">
                            Password
                        </Label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={input.password}
                            onChange={(e) => setInput({ ...input, [e.target.name]: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full py-3 mt-6 bg-purple-700 text-white rounded-lg hover:bg-purple-600"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing Up..." : "Sign Up"}
                    </Button>
                    <p className=' text-center font-bold text-sm'>
                        Already have An Account? <Link className='text-blue-600' to={'/login'}>Login</Link> 
                    </p>
                </div>
                
            </form>
        </div>
    );
};
