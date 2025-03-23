<template>
    <div class="form-preview">
      <div v-if="questions.length === 0" class="alert alert-info">
        <i class="bi bi-info-circle me-2"></i>
        No questions to preview. Add questions to see how your form will look.
      </div>
      
      <div v-else class="preview-content">
        <div v-for="(question, index) in questions" :key="question.id" class="mb-3 p-3 border rounded bg-white">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <label class="form-label fw-bold mb-0">
              {{ question.label }}
              <span v-if="question.required" class="text-danger">*</span>
            </label>
            <span class="badge bg-light text-dark">{{ getTypeLabel(question.type) }}</span>
          </div>
          
          <!-- Text input preview -->
          <input
            v-if="question.type === 'text' || question.type === 'email'"
            type="text"
            class="form-control"
            disabled
            :placeholder="getPlaceholder(question.type)"
          />
          
          <!-- Number input preview -->
          <input
            v-else-if="question.type === 'number'"
            type="number"
            class="form-control"
            disabled
            placeholder="Numeric input"
          />
          
          <!-- Date input preview -->
          <input
            v-else-if="question.type === 'date'"
            type="date"
            class="form-control"
            disabled
          />
          
          <!-- Textarea preview -->
          <textarea
            v-else-if="question.type === 'textarea'"
            class="form-control"
            rows="3"
            disabled
            placeholder="Multi-line text input"
          ></textarea>
          
          <!-- Select dropdown preview -->
          <select
            v-else-if="question.type === 'select'"
            class="form-select"
            disabled
          >
            <option selected>Select an option...</option>
            <option v-for="(option, i) in question.options" :key="i">{{ option }}</option>
          </select>
          
          <!-- Radio buttons preview -->
          <div v-else-if="question.type === 'radio'" class="mt-2">
            <div
              v-for="(option, optIndex) in question.options"
              :key="optIndex"
              class="form-check"
            >
              <input
                class="form-check-input"
                type="radio"
                disabled
              />
              <label class="form-check-label">
                {{ option }}
              </label>
            </div>
            
            <div v-if="!question.options || question.options.length === 0" class="text-danger small mt-1">
              <i class="bi bi-exclamation-triangle-fill me-1"></i>
              No options defined
            </div>
          </div>
          
          <!-- Checkboxes preview -->
          <div v-else-if="question.type === 'checkbox'" class="mt-2">
            <div
              v-for="(option, optIndex) in question.options"
              :key="optIndex"
              class="form-check"
            >
              <input
                class="form-check-input"
                type="checkbox"
                disabled
              />
              <label class="form-check-label">
                {{ option }}
              </label>
            </div>
            
            <div v-if="!question.options || question.options.length === 0" class="text-danger small mt-1">
              <i class="bi bi-exclamation-triangle-fill me-1"></i>
              No options defined
            </div>
          </div>
        </div>
        
        <!-- Sample submit button -->
        <div class="d-grid gap-2 col-6 mx-auto mt-4">
          <button class="btn btn-primary" disabled>Submit Form</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FormPreview',
    props: {
      questions: {
        type: Array,
        required: true
      }
    },
    methods: {
      getTypeLabel(type) {
        const typeLabels = {
          text: 'Text',
          textarea: 'Long Text',
          number: 'Number',
          email: 'Email',
          checkbox: 'Multiple Choice',
          radio: 'Single Choice',
          select: 'Dropdown',
          date: 'Date'
        }
        return typeLabels[type] || type
      },
      getPlaceholder(type) {
        const placeholders = {
          text: 'Short text input',
          email: 'Email input (example@domain.com)',
        }
        return placeholders[type] || 'User input'
      }
    }
  }
  </script>
  
  <style scoped>
  .preview-content {
    position: relative;
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 0.25rem;
  }
  
  .preview-content::before {
    content: 'PREVIEW';
    position: absolute;
    top: -10px;
    right: 10px;
    background-color: #ffc107;
    color: #212529;
    font-size: 0.7rem;
    font-weight: bold;
    padding: 2px 8px;
    border-radius: 10px;
    z-index: 1;
  }
  </style>
  