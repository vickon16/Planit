'use client'
import useDisplayModal from '@/hooks/use-display-modal'
import { TPlanitAccounts } from '@/lib/types'
import CreateMediaForm from '../forms/create-media'
import CustomModal from '../global/custom-modal'
import { Button } from '../ui/button'
import { PlusIcon } from 'lucide-react'

type Props = {
  type: TPlanitAccounts;
  accountId : string;
}

const CreateMediaButton = ({ type, accountId }: Props) => {
  const { setOpen } = useDisplayModal()

  return (
    <Button
      onClick={() => {
        setOpen(
          <CustomModal
            title="Create Media"
            subheading="Create a media for your media bucket"
            className='max-w-[600px]'
          >
            <CreateMediaForm type={type} accountId={accountId}></CreateMediaForm>
          </CustomModal>
        )
      }}
      icon={<PlusIcon />}
    >
      Create Media
    </Button>
  )
}

export default CreateMediaButton
