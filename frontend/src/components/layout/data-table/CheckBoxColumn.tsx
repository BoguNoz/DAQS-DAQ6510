import {observer} from "mobx-react-lite";
import { Checkbox } from "@/components/ui/checkbox";

export const HeaderCheckBox = observer((
    props: {
        table: any
    }
) => {
    const {table} = props;

    return (
        <div className="flex items-center justify-center">
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            />
        </div>
    );
});

export const RowCheckBox = observer((
    props: {
        row: any
    }
) => {
    const {row} = props;

    return (
        <div className="flex items-center justify-center">
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        </div>
    );
});
