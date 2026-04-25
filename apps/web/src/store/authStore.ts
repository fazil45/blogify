import axios from "axios";
import {create} from "zustand"

type User = {
    id:String;
    firstname:String;
    lastname:String;
    username:String;
    email:String
}

type AuthState = {
    user: User | null;
    loading: boolean;
    fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
    user:null,  
    loading:true,

    fetchUser: async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_HTTP_URL}/auth/me`,{
                withCredentials:true
            })

            const data = response.data

            set({user:data.user, loading:false})
        } catch (error) {
            set({user:null, loading:false})
        }
    },
}))