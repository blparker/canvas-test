<script setup lang="ts">
import { reactive, onMounted, } from 'vue';
import { Test, TestSuite, } from './test';
import { Storage, } from './storage';

import TestComponent from './components/TestComponent.vue';


let tests: Test[] = reactive([]);

interface TestSuiteCtor {
    new(): TestSuite
}


onMounted(async () => {
    const storedTests = Storage.getTestsByName();
    const module = await import('http://localhost:5173/test-cases');

    for (const suiteClass of Object.values(module) as TestSuiteCtor[]) {
        const suite = new suiteClass();
        if ('allTests' in suite) {
            for (const test of suite.allTests()) {
                if (test.name in storedTests) {
                    test.description = storedTests[test.name].description;
                    test.captured = storedTests[test.name].captured;
                    test.isVideo = storedTests[test.name].isVideo;
                }

                tests.push(test);
            }
        }
    }
});


function testUpdated(test: Test) {
    Storage.updateTest(test);
}
</script>

<template>
    <div id="app" class="p-2 w-full">
        <div v-for="test in tests" class="test mb-8" :id="test.name">
            <TestComponent :test="test" @updated="testUpdated"></TestComponent>
        </div>
    </div>
</template>

<style scoped>
</style>
