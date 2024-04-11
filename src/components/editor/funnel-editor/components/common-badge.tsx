import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils"

type Props = {
  text : string;
  className? : string;
}

const CommonBadge = ({text, className} : Props) => {
  return (
    <Badge
    className={cn(
      "absolute -bottom-2 left-1/2 right-1/2 transform -translate-x-1/2 translate-y-1/2  rounded-none px-1 py-0 text-[9px] w-fit", className
    )}
  >
    {text}
  </Badge>
  )
}

export default CommonBadge