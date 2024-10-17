import Image from 'next/image';
import React, { useState } from 'react'
import UserTypeSelesctor from './UserTypeSelesctor';
import { Button } from './ui/button';
import { removeColaborator, updateDocument, updateDocumentAccess } from '@/lib/actions/room.actions';

const Collaborator = ({ roomId, creatorId, email, collaborator, user }: CollaboratorProps) => {
    const [userType, setUserType] = useState(collaborator.userType || 'viewer');
    const [loading, setLoading] = useState(false);


    console.log('createoasdih ',{creatorId})
    const shareDocumentHandler = async (type: string) => { 
        setLoading(true);


        await updateDocumentAccess(
            {roomId, email, userType:type as UserType, updatedBy: user}
        )
        setLoading(false)

    }
    const removeCollaboratoreHandler = async (email: string) => { 
        setLoading(true);


        await removeColaborator(
            {roomId, email}
        )
        setLoading(false)
    }

    return (
        <li className='flex items-center gap-3 py-3'>
            <div className='flex gap-2'>
                <Image
                    src={collaborator.avatar}
                    alt={collaborator.name}
                    width={36}
                    height={36}
                    className='size-9 rounded-full'
                />

            </div>

            <div>
                <p className='line-clamp-1 text-sm font-semibold leading-4 text-white'>{collaborator.name}
                    <span className='text-10-regular pl-2 text-blue-100  '>{loading && 'updating...'}</span></p>

                <p className='text-sm font-light text-blue  text-blue-100'> {collaborator.email}</p>
            </div>

            {creatorId === collaborator.id ? (

                <p className='text-sm text-blue-100'>Owner</p>  

            ) : (
                <div className='flex items-center'>
                    <UserTypeSelesctor
                        userType={userType as UserType}
                        setUserType={setUserType || 'viewer'}
                        onClickHandler={shareDocumentHandler}
                    />

                    <Button type='button' onClick={() => {
                        removeCollaboratoreHandler(collaborator.email)
                    }} >
                        Remove
                    </Button>
                </div>

            )}

        </li>
    )
}

export default Collaborator