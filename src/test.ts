export type Test = {
    name: string;
    description: string;
    captured: string | null;
    isVideo: boolean;
    testCase: (canvas: HTMLCanvasElement, done: boolean) => void;
}


export class TestSuite {
    allTests(): Test[] {
        const propNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        const testNames = propNames.filter(m => m.startsWith('__test') || m.startsWith('test'));
        const tests = [];

        for (const testName of testNames) {
            // tests.push([testName, this[testName as keyof TestSuite]]);
            tests.push({
                name: testName,
                description: '',
                captured: null,
                isVideo: false,
                testCase: this[testName as keyof TestSuite],
            });
        }

        return tests;
    }
}

// @ts-ignore
window.TestSuite = TestSuite;

export const registeredSuites: TestSuite[] = [];

export function registerTestSuite(suite: TestSuite) {
    registeredSuites.push(suite);
}
