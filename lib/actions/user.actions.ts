'use server';

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";
import { liveblocks } from "../livebloks";

export const getClerkUsers = async({userIds}:{userIds:string[]}) =>{
    try {
        const {data } = await clerkClient.users.getUserList({
            emailAddress:userIds,
        });

        const users = data.map((user)=>({
            id:user.id,
            name:`${user.firstName} ${user.lastName}`
            ,email:user.emailAddresses[0].emailAddress,
            avatar:user.imageUrl,

        }));
        const sorteUsers = userIds.map((email)=>users.find((user)=>user.email===email));

        return parseStringify(sorteUsers);
    } catch (error) {
        console.log('Error fetching users: ' ,error)
        
    }
}



export const getDocumentUsers = async ({roomId, currentUser,text}: {roomId:string, currentUser:string, text:string})=>{
    try {
        const room = await liveblocks.getRoom(roomId);
        const users = Object.keys(room.userAccesses).filter((email)=>email !== currentUser);

        
        if(text.length){
            const lowerCaseText = text.toLocaleLowerCase();
            const filteredUsers =users.filter((email:string) => email.toLocaleLowerCase().includes(lowerCaseText))

            return parseStringify(filteredUsers);
        }

    return parseStringify(users);

    } catch (error) {
        console.log(`Error fetching documentusers: ${error}`)
    }
}
