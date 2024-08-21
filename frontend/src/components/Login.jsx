import { Label } from "@radix-ui/react-label";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/AuthSlice";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const dispatch=useDispatch();
const {user}=useSelector(store=>store.auth)
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const Navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.email || !input.password) {
      setError("All fields are required!");
      return;
    }
    if (input.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        "https://yapper-8ny9.onrender.com/api/v1/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user))
        toast.success(res.data.message);
        setIsSubmitted(true);
        setError("");
        setInput({ email: "", password: "" });
        Navigate('/');
      } 
    } catch (error) {
      setError("Incorrect Password Or username");
      toast.error("Incorrect Password Or username");
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
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-purple-700">Yapper</h1>
          <p className="text-gray-600 mt-2">Unlock the world of social media</p>
        </div>
        <div className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {isSubmitted && (
            <p className="text-green-500 text-sm">Sign up successful!</p>
          )}
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
              onChange={(e) =>
                setInput({ ...input, [e.target.name]: e.target.value })
              }
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
              onChange={(e) =>
                setInput({ ...input, [e.target.name]: e.target.value })
              }
              disabled={isLoading}
            />
          </div>
          {isLoading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please Wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full py-3 mt-6 bg-purple-700 text-white rounded-lg hover:bg-purple-600"
            >
              Login
            </Button>
          )}

          <p className=" text-center font-bold text-sm">
            Do Not have An Account?
            <Link className="text-blue-600" to={"/signup"}>
              Signup
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
