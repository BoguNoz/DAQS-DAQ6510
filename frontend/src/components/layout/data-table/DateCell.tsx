// DateCell.tsx
import { format } from "date-fns"
import { pl } from "date-fns/locale"

interface DateCellProps {
    value?: string | Date | null
}

const DateCell = ({ value }: DateCellProps) => {
    if (!value) return <span className="text-muted-foreground">-</span>

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
        return <span className="text-muted-foreground">-</span>
    }

    return (
        <span className="tabular-nums text-muted-foreground">
            {format(date, "dd MMM yyyy, HH:mm", { locale: pl })}
        </span>
    )
}

export default DateCell;