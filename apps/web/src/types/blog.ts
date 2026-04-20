export type Creator = {
    firstname:string
    lastname:string | null
    username: string
} 


export type Blog = {
    id:string;
    title:string
    content:string
    image:string | null
    createdAt: string;
    updatedAt: string;
    creatorId: string;
    posted: boolean; 
    creator: Creator;
}