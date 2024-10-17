"use client";

import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense'
import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@/components/editor/Editor';
import Header from '@/components/Header';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Loader from './Loader';
import ActiveCollaborators from './ActiveCollaborators';
import { Input } from './ui/input';
import Image from 'next/image';
import { updateDocument } from '@/lib/actions/room.actions';
import ShareModal from './ShareModal';



const CollaborativeRoom = ({ roomId, roomMetadata,users, currentUserType }: CollaborativeRoomProps) => {
    
    const [editig, setEditig] = useState(false);
    const [loading, setLoading] = useState(false);
    const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);

    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLDivElement>(null)
    const updateTitlehandler = async (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            setLoading(true)

            try {
                if (documentTitle !== roomMetadata.title) {
                    const updatedDocument = await updateDocument(roomId, documentTitle)
                    if (updatedDocument) {
                        setEditig(false);
                    }
                }
            } catch (error) {
                console.log(error);

            }
        }
    }


    useEffect(() => {
        const handleClickOutSide = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setEditig(false);
                updateDocument(roomId,documentTitle);
            }

        }
        document.addEventListener('mousedown', handleClickOutSide);
        return () => {
            document.removeEventListener('mousedown', handleClickOutSide);
        }
    },[roomId,documentTitle]);

    useEffect(() => {
        if (editig && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editig])
    return (
        <RoomProvider id={roomId}>
            <ClientSideSuspense fallback={<Loader />}>
                <div className='collaboration-room'>
                    <Header>
                        <div ref={containerRef} className='flex items-center '>
                            {editig && !loading ? (
                                <Input
                                    type='type'
                                    value={documentTitle}
                                    ref={inputRef}
                                    placeholder='Enter title'
                                    onChange={(e) => setDocumentTitle(e.target.value)}
                                    onKeyDown={updateTitlehandler}
                                    disabled={!editig}
                                    className='document-title-input'


                                />
                            ) : (

                                <>
                                    <p className='document-title'>{documentTitle}</p>
                                </>
                            )}

                            {currentUserType === 'editor' && !editig && (
                                <Image
                                    src="/assets/icons/edit.svg"
                                    alt='edit'
                                    width={24}
                                    height={24}
                                    onClick={() => setEditig(true)}
                                    className='pointer'
                                />
                            )}
                            {currentUserType !== 'editor' && !editig && (
                                <p className='view-only-tag'>View only</p>
                            )}

                            {loading && <p className='text-sm tex-gray-400'>saving...</p>}
                        </div>

                        <div className='flex w-full flex-1 justify-end gap-2 sm:gap-3'>
                            <ActiveCollaborators />

                            <ShareModal
                            roomId={roomId}
                            collaborators = {users}
                            creatorId  = {roomMetadata}
                            currentUserType = {currentUserType}

                            />
                            <SignedOut>
                                <SignInButton />
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </Header>
                    <Editor roomId={roomId} currentUserType={currentUserType}/>
                </div>
            </ClientSideSuspense>
        </RoomProvider>
    )
}

export default CollaborativeRoom