<script setup lang="ts">
import { nextTick, onMounted, ref, defineEmits, getCurrentInstance } from 'vue'
import { Test } from '../test';
import CanvasCapture from '../canvas-capture';


const emit = defineEmits(['updated']);

const { test } = defineProps<{ test: Test }>();

const capturing = ref(false);
const width = ref(0);
const height = ref(0);
const description = ref(test.description);

const canvasCol = ref<HTMLDivElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const playbackEl = ref<HTMLVideoElement | HTMLImageElement | null>(null);

let canvasCapture: CanvasCapture;


async function captureClip() {
    if (!canvas.value) {
        return;
    }

    if (!capturing.value) {
        canvasCapture = new CanvasCapture(canvas.value);
        console.log('Capturing...')
        canvasCapture.start();
        capturing.value = true;

        play();
    } else {
        capturing.value = false;
        const clipBlob = await canvasCapture.stop();
        // console.log(clipBlob)
        const clip = await canvasCapture.resultAsBase64();
        test.captured = clip;
        test.isVideo = true;

        emit('updated', test);
    }
}


function capture() {
    const dataImage = canvas!.value!.toDataURL();
    test.captured = dataImage;
    emit('updated', test);
}


function play() {
    if (canvas.value) {
        console.log('Playing...');
        const ctx = canvas?.value.getContext('2d')!;

        ctx.reset();
        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

        test.testCase(canvas!.value, false);

        if (playbackEl.value && test.isVideo && 'play' in playbackEl.value) {
            playbackEl.value.play();
        }
    }
}


function descriptionUpdated() {
    test.description = description.value;
    emit('updated', test);
}


onMounted(() => {
    if (canvasCol) {
        const [widthUnits, heightUnits] = [14, 8];

        const el = canvasCol.value as Element;
        const style = getComputedStyle(el);
        // const width = el.clientWidth - (parseFloat(style.paddingLeft) + parseFloat(style.paddingRight));
        // const height = Math.round(width / widthUnits * heightUnits);

        width.value = el.clientWidth - (parseFloat(style.paddingLeft) + parseFloat(style.paddingRight));
        height.value = Math.round(width.value / widthUnits * heightUnits);

        console.log(`Width: ${width.value}, height: ${height.value}`);

        nextTick(() => {
            if (canvas.value) {
                test.testCase(canvas!.value, false);
            }
        });
    }
});
</script>

<template>
    <div class="flex bg-slate-200 mb-4 p-3 items-center">
        <h3 class="font-mono font-bold">{{ test.name }} <a :href="'#' + test.name" class="hover:text-blue-600">¶</a></h3>
        <button @click="play()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded ml-5">Play</button>

        <button @click="capture()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded ml-5">Capture</button>

        <button @click="captureClip()" :class="{ 'bg-red-500 hover:bg-red-700': capturing, 'bg-blue-500 hover:bg-blue-700': !capturing }" class="text-white font-bold py-1 px-4 rounded ml-5">
            <span v-if="capturing">Stop Capture</span>
            <span v-else>Capture Clip</span>
        </button>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="canvas-col" ref="canvasCol">
            <!-- <component :is="renderCanvas()" v-if="playRef" :width="width" :height="height" :test="test" ref="canvasComponent"></component> -->
            <canvas :width="width" :height="height" ref="canvas"></canvas>
            <textarea placeholder="Add a description of the test" v-model="description" @input="descriptionUpdated" class="mt-3 block p-2 w-full rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
        <div>
            <img :src="test.captured" v-if="test.captured && !test.isVideo" ref="playbackEl">
            <video :src="test.captured" v-if="test.captured && test.isVideo" ref="playbackEl" autoplay controls></video>
        </div>
    </div>
</template>

<style scoped>
</style>
