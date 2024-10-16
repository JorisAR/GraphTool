import Graph from "Graphs/Graph";

export abstract class GraphGenerator {
    abstract getUI(onSettingsUpdate: (name: string, value: any) => void): JSX.Element;
    abstract generate(): Graph;
    abstract getName(): String;
}
