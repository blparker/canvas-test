import { Test } from "./test";

type StoredTest = Omit<Test, 'testCase'>;

function isStoredTest(data: any): data is StoredTest[] {
    if (!Array.isArray(data)) {
        return false
    }

    function check(o: any): o is StoredTest {
        return 'name' in o
            && 'description' in o
            && 'captured' in o
            && 'isVideo' in o;
    }

    return data.every(check);
}


class TestStorage {
    private storageKey = 'tests';
    private tests: StoredTest[];

    constructor() {
        const data = localStorage.getItem(this.storageKey);
        if (data && isStoredTest(JSON.parse(data))) {
            this.tests = JSON.parse(data);
        } else {
            this.tests = [];
        }
    }

    getTests(): StoredTest[] {
        return this.tests;
    }

    getTestsByName(): Record<string, StoredTest> {
        return Object.fromEntries(this.tests.map(t => [t.name, t]));
    }

    updateTest(test: Test) {
        const storedTest = this.testByName(test.name);
        if (!storedTest) {
            // Create new test
            this.tests.push({
                name: test.name,
                description: test.description,
                captured: test.captured,
                isVideo: test.isVideo,
            })
        } else {
            // Update existing test
            storedTest.name = test.name;
            storedTest.description = test.description;
            storedTest.captured = test.captured;
            storedTest.isVideo = test.isVideo;
        }

        this.saveTests();
    }

    private saveTests() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.tests));
    }

    private testByName(name: string): StoredTest | null {
        for (const test of this.tests) {
            if (test.name === name) {
                return test;
            }
        }

        return null;
    }
}

const storage = new TestStorage();


export { storage as Storage, type StoredTest };
