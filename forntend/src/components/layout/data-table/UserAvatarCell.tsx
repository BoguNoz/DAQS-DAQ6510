import { observer } from "mobx-react-lite";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";

interface UserAvatarCellProps {
    name: string
    avatarKey?: string | null
}
const getAvatarUrl = (key?: string | null) =>
    key ? `${import.meta.env.VITE_UPLOADS_URL}/${key}` : undefined

const getInitials = (name: string) =>
    name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("")

const UserAvatarCell = observer((props: UserAvatarCellProps) => {
    const { name, avatarKey } = props;

    return (
        <div className="flex items-center gap-2">
            <Avatar className="size-8">
                <AvatarImage src={getAvatarUrl(avatarKey)} alt={name} loading="lazy" />
                <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{name}</span>
        </div>
    );

});

export default UserAvatarCell;