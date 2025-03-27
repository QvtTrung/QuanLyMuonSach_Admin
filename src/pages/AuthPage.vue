<template>
    <div>
      <SignIn @signUp="showSignIn = false"  />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import SignIn from '@/views/SignIn.vue';
  
  const showSignIn = ref(true);
  
  // Function to handle switching to Sign In
  const signIn = () => {
    showSignIn.value = true;
  }
  
  // Function to handle switching to Sign Up
  const signUp = () => {
    showSignIn.value = false;
  }
  </script>
  