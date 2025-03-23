<template>
    <div class="form-view">
      <div class="text-center mb-4">
        <h1 class="display-6">Form Submission</h1>
        <p class="lead text-muted">Please fill out the form below</p>
      </div>
      
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <form-generator :questions="questions" />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import FormGenerator from '@/components/FormGenerator.vue'
  
  export default {
    name: 'FormView',
    components: {
      FormGenerator
    },
    data() {
      return {
        questions: []
      }
    },
    created() {
      this.loadFormQuestions()
    },
    methods: {
      loadFormQuestions() {
        const savedQuestions = localStorage.getItem('formQuestions')
        if (savedQuestions) {
          try {
            this.questions = JSON.parse(savedQuestions)
          } catch (error) {
            console.error('Error loading form questions:', error)
            this.questions = []
          }
        }
      }
    }
  }
  </script>
  