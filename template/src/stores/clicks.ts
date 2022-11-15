import { ref, reactive } from "vue";
import { defineStore } from "pinia";

export const useClicksStore = defineStore("clicks", () => {
  const totalClicks = ref(0);
  const user = reactive({
    name: ref("User"),
    age: ref(0),
  });

  function getClicks() {
    return totalClicks.value;
  }

  function increaseClicks() {
    totalClicks.value++;
  }

  function resetClicks() {
    totalClicks.value = 0;
  }

  function decreaseClicks() {
    totalClicks.value--;
  }

  function getUser() {
    return user;
  }

  function getName() {
    return user.name;
  }

  function getAge() {
    return user.age;
  }

  function setName(name: string) {
    user.name = name;
  }

  function setAge(age: number) {
    user.age = age;
  }

  function resetUser() {
    user.name = "";
    user.age = 0;
  }

  function setUser(name: string, age: number) {
    user.name = name;
    user.age = age;
  }

  return {
    getClicks,
    resetClicks,
    increaseClicks,
    decreaseClicks,
    getUser,
    getName,
    getAge,
    resetUser,
    setUser,
    setName,
    setAge,
  };
});
