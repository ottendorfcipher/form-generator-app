<template>
    <div class="admin-panel">
      <div v-if="localQuestions.length === 0" class="text-center p-5 border rounded bg-light">
        <div class="mb-3 text-muted">
          <i class="bi bi-arrow-up-circle" style="font-size: 2rem;"></i>
        </div>
        <p>No questions yet. Click "Add Question" to start building your form.</p>
      </div>
  
      <div v-else class="question-list">
        <div 
          v-for="(question, index) in localQuestions" 
          :key="index" 
          class="card mb-3 border-0 shadow-sm"
          :class="{'border-primary border-2': selectedQuestion === index}"
        >
          <div class="card-header bg-white d-flex justify-content-between align-items-center py-3">
            <h3 class="h6 mb-0">
              <span class="badge bg-secondary me-2">{{ index + 1 }}</span>
              Question: {{ question.label }}
            </h3>
            <div class="btn-group">
              <button 
                class="btn btn-sm btn-outline-secondary" 
                @click="moveQuestion(index, -1)" 
                :disabled="index === 0"
                title="Move up"
              >
                <i class="bi bi-arrow-up"></i>
              </button>
              <button 
                class="btn btn-sm btn-outline-secondary" 
                @click="moveQuestion(index, 1)" 
                :disabled="index === localQuestions.length - 1"
                title="Move down"
              >
                <i class="bi bi-arrow-down"></i>
              </button>
              <button 
                class="btn btn-sm btn-outline-danger" 
                @click="removeQuestion(index)"
                title="Remove question"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
  
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Question Text</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="question.label" 
                  @change="updateQuestions"
                  placeholder="Enter question text"
                >
              </div>
              <div class="col-md-3">
                <label class="form-label">Type</label>
                <select 
                  class="form-select" 
                  v-model="question.type" 
                  @change="updateQuestions"
                >
                  <option value="text">Short Text</option>
                  <option value="textarea">Long Text</option>
                  <option value="number">Number</option>
                  <option value="email">Email</option>
                  <option value="checkbox">Checkboxes</option>
                  <option value="radio">Radio Buttons</option>
                  <option value="select">Dropdown</option>
                  <option value="date">Date</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Required</label>
                <div class="form-check form-switch mt-2">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="required-switch"
                    v-model="question.required" 
                    @change="updateQuestions"
                  >
                  <label class="form-check-label" for="required-switch">
                    {{ question.required ? 'Required' : 'Optional' }}
                  </label>
                </div>
              </div>
            </div>
  
            <!-- Options for radio, checkbox, or select types -->
            <div v-if="['radio', 'checkbox', 'select'].includes(question.type)" class="mt-3">
              <label class="form-label d-flex justify-content-between align-items-center">
                <span>Options</span>
                <button class="btn btn-sm btn-outline-primary" @click="addOption(index)">
                  <i class="bi bi-plus-circle me-1"></i> Add Option
                </button>
              </label>
              
              <div v-if="!question.options || question.options.length === 0" 
                   class="alert alert-warning">
                Please add at least one option.
              </div>
              
              <div v-else class="options-list">
                <div 
                  v-for="(option, optIndex) in question.options" 
                  :key="optIndex" 
                  class="input-group mb-2"
                >
                  <span class="input-group-text">{{ optIndex + 1 }}</span>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="question.options[optIndex]" 
                    @change="updateQuestions"
                    placeholder="Option text"
                  >
                  <button 
                    class="btn btn-outline-danger" 
                    @click="removeOption(index, optIndex)"
                    title="Remove option"
                  >
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AdminPanel',
    props: {
      questions: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        localQuestions: [...this.questions],
        selectedQuestion: null
      }
    },
    watch: {
      questions: {
        handler(newVal) {
          this.localQuestions = [...newVal]
        },
        deep: true
      }
    },
    methods: {
      removeQuestion(index) {
        if (confirm('Are you sure you want to remove this question?')) {
          this.localQuestions.splice(index, 1)
          this.updateQuestions()
        }
      },
      addOption(questionIndex) {
        if (!this.localQuestions[questionIndex].options) {
          this.localQuestions[questionIndex].options = []
        }
        this.localQuestions[questionIndex].options.push(`Option ${this.localQuestions[questionIndex].options.length + 1}`)
        this.updateQuestions()
      },
      removeOption(questionIndex, optionIndex) {
        this.localQuestions[questionIndex].options.splice(optionIndex, 1)
        this.updateQuestions()
      },
      moveQuestion(index, direction) {
        const newIndex = index + direction
        if (newIndex < 0 || newIndex >= this.localQuestions.length) return
        
        const temp = this.localQuestions[index]
        this.localQuestions[index] = this.localQuestions[newIndex]
        this.localQuestions[newIndex] = temp
        this.selectedQuestion = newIndex
        this.updateQuestions()
      },
      updateQuestions() {
        this.$emit('update-questions', this.localQuestions)
      }
    }
  }
  </script>
  
  <style scoped>
  .options-list {
    max-height: 300px;
    overflow-y: auto;
    padding-right: 5px;
  }
  
  /* Add smooth transition effects */
  .card {
    transition: all 0.2s ease-in-out;
  }
  
  .card:hover {
    transform: translateY(-2px);
  }
  
  .question-list {
    position: relative;
  }
  
  .question-list > .card {
    position: relative;
    z-index: 1;
  }
  
  .question-list > .card:hover {
    z-index: 2;
  }
  </style>
  

