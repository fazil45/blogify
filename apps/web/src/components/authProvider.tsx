"use client"
import { useAuthStore } from "@/store/authStore";
import { ReactNode, useEffect } from "react";

export default function AuthProvider({children}:{children:ReactNode}){
    const fetchUser = useAuthStore((state) => state.fetchUser)

    useEffect(() => {
        fetchUser()
    },[])

    return (
        <>{children}</>
    )
}