import { useMemo } from "react";
import * as d3 from "d3";

// Function to compute density
function kernelDensityEstimator(kernel: any, X: number[]) {
    return function (V: number[]) {
        return X.map(function (x) {
            return [
                x,
                d3.mean(V, function (v: number) {
                    return kernel(x - v);
                }) || 0, // Default value to handle undefined case
            ];
        });
    };
}

function kernelEpanechnikov(k: number) {
    return function (v: number) {
        return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
    };
}

type DensityChartProps = {
    width: number;
    height: number;
    data: number[];
};

export const DensityPlot = ({ width, height, data }: DensityChartProps) => {
    const xScale = useMemo(() => {
        return d3
            .scaleLinear()
            .domain([0, 1000]) // note: limiting to 1000 instead of max here because of extreme values in the dataset
            .range([10, width - 10]);
    }, [data, width]);

    // Compute kernel density estimation
    const density = useMemo(() => {
        const kde = kernelDensityEstimator(
            kernelEpanechnikov(10),
            xScale.ticks(40)
        );
        return kde(data) as [number, number][]; // Type assertion
    }, [xScale, data]);

    const yScale = useMemo(() => {
        const max = Math.max(...density.map((d) => d[1]));
        return d3.scaleLinear().range([height, 10]).domain([0, max]);
    }, [density, height]);

    const path = useMemo(() => {
        const lineGenerator = d3
            .line<[number, number]>()
            .x((d) => xScale(d[0]))
            .y((d) => yScale(d[1]))
            .curve(d3.curveBasis);
        return lineGenerator(density) || '';
    }, [density, xScale, yScale]);

    return (
        <svg width={width} height={height}>
            <path
                d={path}
                fill="#9a6fb0"
                opacity={0.4}
                stroke="black"
                strokeWidth={1}
                strokeLinejoin="round"
            />
        </svg>
    );
};
