'use client'
import useDisplayModal from '@/hooks/use-display-modal'
import { TPlanitAccounts } from '@/lib/types'
import CreatePipelineForm from '../forms/create-pipeline'
import CustomModal from '../global/custom-modal'
import { Button } from '../ui/button'
import { PlusIcon } from 'lucide-react'

type Props = {
  subAccountId : string;
}

const CreatePipelineButton = ({ subAccountId }: Props) => {
  const { setOpen } = useDisplayModal()

  return (
    <Button
      onClick={() => {
        setOpen(
          <CustomModal
            title="Create Pipeline"
            subheading="Create a pipeline for your contact leads"
            className='max-w-[600px] h-fit'
          >
            <CreatePipelineForm subAccountId={subAccountId} data={{}} />
          </CustomModal>
        )
      }}
      icon={<PlusIcon />}
    >
      Create Pipeline
    </Button>
  )
}

export default CreatePipelineButton
