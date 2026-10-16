import {observer} from "mobx-react-lite";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge";
import LiveChart from "./LiveChart";

interface MetricCardProps {
    title: string;
    value: number | null;
    unit: string;
    isStable: boolean;
    data: number[];
    color?: string;
    width?: number;
}

const MetricCard = observer((props: MetricCardProps) => {
    const {title, value, unit, isStable, data, color, width} = props;

    return (
        <Card className="gap-4 bg-transparent">
            <CardHeader className="flex items-center justify-between">
              <span className="text-xs font-medium tracking-wide text-muted-foreground/80">
                {title}
            </span>
                <Badge
                    variant="outline"
                    className={
                        isStable
                            ? "border-ok-accent text-ok-accent bg-transparent"
                            : "bg-transparent animate-pulse"
                    }
                >
                    {isStable ? "Stable" : "Stabilizing"}
                </Badge>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
                <span className="text-3xl font-light tracking-tight tabular-nums">
                    {value !== null ? value.toFixed(2) : "—"}
                    <span className="ml-1.5 text-sm font-normal tracking-normal text-muted-foreground/70">
                        {unit}
                    </span>
                </span>

                <div>
                    <LiveChart title="" unit={unit} data={data} color={color} width={width} />
                </div>
            </CardContent>
        </Card>
    );
});

export default MetricCard;