import {observer} from "mobx-react-lite";
import {useEffect, useMemo, useRef} from "react";
import EChartsReact, {type EChartsInstance} from "echarts-for-react";
import {getChartTheme} from "@/lib/chart-theme.ts";
import {useMockHistory} from "@/lib/use-mock-history.ts";

interface LiveChartProps {
    title: string;
    unit: string;
    dataKey: string;
    color?: string;
    minimal?: boolean;
}

const LiveChart = observer((props: LiveChartProps) => {
    const chartRef = useRef<EChartsInstance | null>(null);

    const data: number[] = useMockHistory({ target: props.unit === "V" ? 0.002 : 25, noise: props.unit === "V" ? 0.0005 : 0.4 });
    const theme = getChartTheme();

    const staticOption = useMemo(() => ({
        title: props.minimal ? undefined : {
            text: props.title,
            textStyle: { color: theme.textColor, fontFamily: theme.fontFamily, fontWeight: 500 },
        },
        grid: props.minimal
            ? { top: 4, right: 4, bottom: 4, left: 4 }
            : { top: 40, right: 16, bottom: 24, left: 48 },
        xAxis: {
            type: "category",
            show: !props.minimal,
            axisLine: { lineStyle: { color: theme.axisLineColor } },
            axisLabel: { color: theme.textColor },
        },
        yAxis: {
            show: !props.minimal,
            type: "value",
            name: props.unit,
            nameTextStyle: { color: theme.textColor },
            axisLabel: { color: theme.textColor },
            splitLine: { lineStyle: { color: theme.gridColor, type: "dashed" } },
        },
        series: [{
            type: "line",
            data: [] as number[],
            color: props.color ?? theme.seriesColors[0],
            smooth: true,
            symbol: "none",
            lineStyle: { width: 2 },
        }],
        backgroundColor: "transparent",
    }), []);


    useEffect(() => {
        chartRef.current?.setOption({
            series: [{ data: data }]
        });
    }, [data]);


    return (
        <EChartsReact
            option={staticOption}
            style={{ width: "700px", height: "250px" }}
            onChartReady={(instance) => {
                chartRef.current = instance;
            }}
        />
    );
});

export default LiveChart;