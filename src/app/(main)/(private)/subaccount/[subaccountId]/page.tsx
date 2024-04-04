
type Props = {
  params : {
    subaccountId : string;
  }
}

const SubAccountIdPage = ({params} : Props) => {
  return (
    <div>{params.subaccountId}</div>
  )
}

export default SubAccountIdPage