import {observer} from "mobx-react-lite";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge";
import LiveChart from "./LiveChart";

interface MetricCardProps {
    title: string;
    value: number | null;
    unit: string;
    isStable: boolean;
    dataKey: string;
    color?: string;
}

const MetricCard = observer((props: MetricCardProps) => {
    const {title, value, unit, isStable, dataKey, color} = props;

    return (
        <Card className="gap-4">
            <CardHeader className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{title}</span>
                <Badge
                    variant="secondary"
                    className={
                        isStable
                            ? "bg-ok-accent"
                            : "bg-destructive"
                    }
                >
                    {isStable ? "Stable" : "Stabilizing"}
                </Badge>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
            <span className="text-3xl font-semibold tracking-tight">
                {value !== null ? value.toFixed(2) : "—"}
                <span className="ml-1 text-lg font-normal text-muted-foreground">{unit}</span>
            </span>

                <div>
                    <LiveChart title="" unit={unit} dataKey={dataKey} color={color} />
                </div>
            </CardContent>
        </Card>
    );
});

export default MetricCard;