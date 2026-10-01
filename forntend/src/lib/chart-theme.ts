function getCSSVariable(name: string): string {
    return getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
}

export function getChartTheme() {
    return {
        textColor: getCSSVariable("--muted-foreground"),
        axisLineColor: getCSSVariable("--muted-foreground"),
        gridColor: getCSSVariable("--muted-foreground"),
        seriesColors: [
            getCSSVariable("--primary-foreground"),
            getCSSVariable("--primary-foreground"),
            getCSSVariable("--primary-foreground"),
        ],
        fontFamily: getCSSVariable("--font-sans"),
    };
}