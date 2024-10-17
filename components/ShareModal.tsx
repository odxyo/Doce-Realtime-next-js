import { useSelf } from '@liveblocks/react/suspense'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button';
import Image from 'next/image';
import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';
import UserTypeSelesctor from './UserTypeSelesctor';
import Collaborator from './Collaborator';
import { updateDocumentAccess } from '@/lib/actions/room.actions';

const ShareModal = ({ roomId, collaborators, creatorId, currentUserType }: ShareDocumentDialogProps) => {
    const user = useSelf();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [usertype, setUsertype] = useState<UserType>('viewer')


    const shareDocumentHandler = async () => {
        setLoading(true);


        await updateDocumentAccess(
            {roomId, email, userType:usertype as UserType, updatedBy: user.info}
        )
        setLoading(false)
     }
    return (
        <Dialog>
            <DialogTrigger>

                <Button className='gradient-blue flex h-9 gap-1 px-4' disabled={currentUserType}>
                    <Image
                        src='/assets/icons/share.svg'
                        alt='sare'
                        height={20}
                        width={20}
                        className='min-w-4 md:size-5'

                    />
                    <p className='mr-1 hidden sm:block'>Share</p>
                </Button>
            </DialogTrigger>
            <DialogContent className='shad-dialog'>
                <DialogHeader>
                    <DialogTitle>Mnage who can view this document</DialogTitle>
                    <DialogDescription>Select which users and view and edit this document
                    </DialogDescription>
                </DialogHeader>

                <Label className='mt-6 text-blue-100 ' htmlFor='email'>Emaill address</Label>

                <div className='flex items-center gap-3'>
                    <div className='flex flex-1 rounded-md bg-dark-400'>
                        <Input
                            id='email'
                            placeholder='Enter email address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='share-input'

                        />

                        <UserTypeSelesctor
                            userType={usertype}
                            setUserType={setUsertype}

                        />
                    </div>

                    <Button className='gradient-blue flex h-full gap-1 px-5' type='button' onClick={shareDocumentHandler} disabled={loading}>
                        {loading ?"Sending...": 'Invite'}
                    </Button>

                </div>
                <div className='my-2 space-y-2'>
                    <ul className='flex flex-col'>
                        {collaborators.map((collaborator)=>(
                            <Collaborator
                            key={collaborator.id}
                            roomId= {roomId}
                            creatorId= {creatorId}
                            email= {collaborator.email}
                            collaborator = {collaborator}
                            user = {user.info}
                            />
                        )
                        )}

                    </ul>

                </div>
            </DialogContent>
        </Dialog>


    )
}

export default ShareModal