<script setup lang="ts">
import { useClicksStore } from "@/stores/clicks";
import Twitter from "@/components/icons/TwitterIcon.vue";
import GitHub from "@/components/icons/GitHubIcon.vue";
import { ref } from "vue";

const clicks = useClicksStore();
const steps = ref(0);

const { getClicks, resetClicks, increaseClicks, decreaseClicks, getUser, getName, getAge, resetUser, setUser, setName, setAge, } = clicks;
</script>

<template>
  <div class="widget shadow-xl text-white">
    <ul class="steps">
      <li :class="'step ' + ((steps === 0 || steps === 1 || steps === 2) ? 'step-primary' : '')">Fake Register</li>
      <li :class="'step ' + ((steps === 1 || steps === 2) ? 'step-primary' : '')">Click</li>
      <li :class="'step ' + ((steps === 2) ? 'step-primary' : '')">finish</li>
    </ul>
    <div v-if="steps == 0">
      <div class="my-6">
        <h1 class="text-xl">Hello {{ getName() }}</h1>
        <h2 class="text-lg">your age is: {{ getAge() }}</h2>
      </div>
      <div class="form-control w-full max-w-xs my-6">
        <label class="label">
          <span class="label-text text-white">What is your name?</span>
        </label>
        <input type="text" placeholder="Type here" @input="(e: Event) => { setName(e.target?.value) }"
          class="input input-bordered w-full max-w-xs" />
      </div>
      <div class="form-control w-full max-w-xs my-6">
        <label class="label">
          <span class="label-text text-white">What is your Age?</span>
        </label>
        <input type="text" placeholder="Type here" @input="(e: Event) => { setAge(e.target?.value) }"
          class="input input-bordered w-full max-w-xs" />
      </div>
      <div>
        <button
          class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          @click="steps++">Next</button>
      </div>
    </div>
    <div v-if="steps == 1">
      <div class="mt-10">
        <h1 class="tetx-xl">Total Clicks: {{ getClicks() }}</h1>
        <button
          class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mx-3 mt-4"
          @click="increaseClicks()">Click</button>
        <div class="mt-10">
          <button
            class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mx-3"
            @click="steps--">Previous</button>
          <button
            class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mx-3"
            @click="steps++">next</button>
        </div>
      </div>
    </div>
    <div v-if="steps == 2">
      <div class="my-10">
        <h1 class="text-xl">Thank you for your time {{ getName() }}</h1>
        <h2 class="text-lg">your age is: {{ getAge() }}</h2>
        <h2 class="text-lg">your total clicks is: {{ getClicks() }}</h2>
        <p class="p-4">Please reload the page</p>
      </div>
    </div>
    <div class="my-5">
      <h2 class="my-3">Reset</h2>
      <button
        class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mx-4"
        @click="resetUser">User Details</button>

      <button
        class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out mx-4"
        @click="resetClicks">Clicks</button>
    </div>
    <div class="my-5">
      <h2 class="my-3">Social Medias</h2>
      <div class="flex justify-around">
        <a href="https://github.com/itsanuness">
          <GitHub />
        </a>
        <a href="https://twitter.com/itsanuness">
          <Twitter />
        </a>
      </div>
    </div>
    <div class="mt-8">
      <h1 class="text-lg">This template is open source!!</h1>
      <h2 class="my-3">fork it!!</h2>
      <div class="flex justify-center">
        <a href="https://github.com/ItsAnunesS/vuejs-widget-template">
          <GitHub />
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.widget {
  display: flex;
  border-radius: 2rem;
  padding: 1rem;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  background: rgb(188, 0, 255);
  background: -moz-linear-gradient(38deg,
      rgba(188, 0, 255, 1) 19%,
      rgba(248, 23, 181, 1) 100%);
  background: -webkit-linear-gradient(38deg,
      rgba(188, 0, 255, 1) 19%,
      rgba(248, 23, 181, 1) 100%);
  background: linear-gradient(38deg,
      rgba(188, 0, 255, 1) 19%,
      rgba(248, 23, 181, 1) 100%);
}

.loading {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 0.25rem solid #fff;
  border-radius: 50%;
  border-top-color: #1a1a1a;
  animation: spin 1s ease-in-out infinite;
}

a {
  text-shadow: 0px 0px 20px #000000;
}
</style>
