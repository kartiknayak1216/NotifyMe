import { CoinsIcon, HomeIcon, Layers2Icon, ShieldCheckIcon } from "lucide-react";

export const Sidebaritems = [
    { label: "Dashboard", link: "/dashboard", icon: HomeIcon },
    { label: "Billing", link: "/billing", icon: CoinsIcon },
    { label: "Credentials", link: "/credentials", icon: ShieldCheckIcon },
]
export const Groupsitems = [
    { label: "Workflows", link: "/workflows", icon: Layers2Icon },
    { label: "Intigration", link: "/billing", icon: CoinsIcon },
  
]
export const  getLinkGrop =(name:string)=>{
return [
    { label: "Workflows", link: `/group/${name}/analytics`, icon: Layers2Icon },
    { label: "Intigration", link: `/group/${name}/integration`, icon: CoinsIcon },
]
}