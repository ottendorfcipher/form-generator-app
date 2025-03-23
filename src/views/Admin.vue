<template>
    <div class="admin-view">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0">Design Your Form</h1>
        <div class="btn-group">
          <button class="btn btn-outline-primary" @click="exportConfig" title="Export configuration to a file">
            <i class="bi bi-download me-1"></i> Export
          </button>
          <input 
            type="file" 
            ref="fileInput" 
            style="display: none" 
            accept=".json" 
            @change="handleFileUpload"
          >
          <button class="btn btn-outline-primary" @click="$refs.fileInput.click()" title="Import configuration from a file">
            <i class="bi bi-upload me-1"></i> Import
          </button>
        </div>
      </div>
      
      <div class="row">
        <!-- Form Builder Panel -->
        <div class="col-lg-7 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white d-flex justify-content-between align-items-center py-3">
              <h2 class="h5 mb-0">Form Builder</h2>
              <button class="btn btn-primary" @click="addQuestion">
                <i class="bi bi-plus-circle me-1"></i> Add Question
              </button>
            </div>
            <div class="card-body">
              <admin-panel 
                :questions="questions" 
                @update-questions="updateQuestions" 
                @export-config="exportConfig"
                @import-config="importConfig"
              />
            </div>
          </div>
        </div>
        
        <!-- Preview Panel -->
        <div class="col-lg-5">
          <div class="card border-0 shadow-sm sticky-top" style="top: 20px">
            <div class="card-header bg-white py-3">
              <h2 class="h5 mb-0">Form Preview</h2>
            </div>
            <div class="card-body">
              <form-preview :questions="questions" />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Success notification -->
      <div 
        v-if="showNotification" 
        class="position-fixed bottom-0 end-0 p-3" 
        style="z-index: 1050"
      >
        <div class="toast show bg-success text-white" role="alert" aria-live="assertive" aria-atomic="true" id="notificationToast">
          <div class="toast-header">
            <strong class="me-auto">Success</strong>
            <button type="button" class="btn-close" @click="showNotification = false" aria-label="Close"></button>
          </div>
          <div class="toast-body">
            {{ notificationMessage }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import AdminPanel from '@/views/AdminPanel.vue'
  import FormPreview from '@/components/FormPreview.vue'
  import { saveAs } from 'file-saver'
  
  export default {
    name: 'AdminView',
    components: {
      AdminPanel,
      FormPreview
    },
    data() {
      return {
        questions: JSON.parse(localStorage.getItem('formQuestions')) || [],
        showNotification: false,
        notificationMessage: ''
      }
    },
    methods: {
      addQuestion() {
        const newQuestion = {
          id: Date.now().toString(),
          label: 'New Question',
          type: 'text',
          required: false,
          options: []
        }
        this.questions.push(newQuestion)
        this.updateQuestions(this.questions)
        this.showToast('Question added successfully')
      },
      updateQuestions(questions) {
        this.questions = questions
        localStorage.setItem('formQuestions', JSON.stringify(questions))
      },
      exportConfig() {
        try {
          const jsonStr = JSON.stringify(this.questions, null, 2)
          const blob = new Blob([jsonStr], {type: "application/json"})
          saveAs(blob, "form-config.json")
          this.showToast('Configuration exported successfully')
        } catch (error) {
          console.error('Export error:', error)
          this.showToast('Error exporting configuration', 'danger')
        }
      },
      importConfig(config) {
        try {
          const parsedConfig = JSON.parse(config)
          
          // Validate the imported configuration
          if (!Array.isArray(parsedConfig)) {
            throw new Error('Invalid format: Configuration must be an array')
          }
          
          // Basic validation of each question object
          parsedConfig.forEach(question => {
            if (!question.id || !question.label || !question.type) {
              throw new Error('Invalid question format: Each question must have id, label, and type properties')
            }
          })
          
          this.questions = parsedConfig
          localStorage.setItem('formQuestions', JSON.stringify(this.questions))
          this.showToast('Form configuration imported successfully')
        } catch (error) {
          console.error('Import error:', error)
          this.showToast(`Error importing configuration: ${error.message}`, 'danger')
        }
      },
      handleFileUpload(event) {
        const file = event.target.files[0]
        if (!file) return
        
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target.result
          this.importConfig(content)
        }
        reader.readAsText(file)
        event.target.value = '' // Reset file input
      },
      showToast(message, type = 'success') {
        this.notificationMessage = message
        this.showNotification = true
        
        // Update toast styling based on type (success, danger, etc.)
        const toastElement = document.querySelector('.toast')
        if (toastElement) {
          toastElement.className = `toast show bg-${type} text-white`
        }
        
        setTimeout(() => {
          this.showNotification = false
        }, 3000)
      }
    }
  }
  </script>
  