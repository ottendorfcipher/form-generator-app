<script>
import FormQuestion from './FormQuestion.vue'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
export default {
    name: 'FormGenerator',
    components: {
      FormQuestion
    },
    props: {
      questions: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        formData: {},
        answeredQuestions: new Set(),
        validationErrors: {},
        formState: 'start', // 'start', 'success'
        submitting: false,
        showData: false,
        savedSubmissions: [],
        showAllSubmissions: false
      }
    },
    computed: {
      requiredCount() {
        return this.questions.filter(q => q.required).length
      },
      answeredCount() {
        return this.answeredQuestions.size
      },
      progressPercentage() {
        if (this.questions.length === 0) return '0%'
        return `${(this.answeredCount / this.questions.length) * 100}%`
      }
    },
    watch: {
      questions: {
        handler(newVal) {
          // Initialize form data for new questions
          newVal.forEach(question => {
            if (!this.formData[question.id]) {
              if (question.type === 'checkbox') {
                this.formData[question.id] = []
              } else {
                this.formData[question.id] = ''
              }
            }
          })
        },
        immediate: true
      }
    },
    methods: {
      checkQuestionAnswered(questionId, value) {
        // Check if the question has been answered meaningfully
        if (Array.isArray(value)) {
          if (value.length > 0) {
            this.answeredQuestions.add(questionId)
          } else {
            this.answeredQuestions.delete(questionId)
          }
        } else {
          if (value && value.trim() !== '') {
            this.answeredQuestions.add(questionId)
          } else {
            this.answeredQuestions.delete(questionId)
          }
        }
        
        // Clear validation error when user starts typing
        if (this.validationErrors[questionId]) {
          this.$set(this.validationErrors, questionId, null)
        }
      },
      validateForm() {
        this.validationErrors = {}
        let isValid = true
        
        this.questions.forEach(question => {
          if (question.required) {
            const value = this.formData[question.id]
            
            if (Array.isArray(value)) {
              if (value.length === 0) {
                this.validationErrors[question.id] = 'Please select at least one option'
                isValid = false
              }
            } else if (!value || value.trim() === '') {
              this.validationErrors[question.id] = `This field is required`
              isValid = false
            }
          }
        })
        
        return isValid
      },
      submitForm() {
        if (this.submitting) return
        
        if (!this.validateForm()) {
          // Scroll to the first error
          const firstErrorId = Object.keys(this.validationErrors)[0]
          const errorElement = document.querySelector(`[data-question-id="${firstErrorId}"]`)
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
          return
        }
        
        this.submitting = true
        
        // Simulate form submission with a delay
        setTimeout(() => {
          console.log('Form submitted with data:', this.formData)
          
          // Add the current submission to the saved submissions array
          this.savedSubmissions.push({
            data: JSON.parse(JSON.stringify(this.formData)),
            timestamp: new Date()
          })
          
          this.formState = 'success'
          this.submitting = false
        }, 1500)
      },
      resetForm() {
        this.formData = {}
        this.answeredQuestions = new Set()
        this.validationErrors = {}
        this.formState = 'start'
        this.showData = false
        this.showAllSubmissions = false
        
        // Initialize form data
        this.questions.forEach(question => {
          if (question.type === 'checkbox') {
            this.formData[question.id] = []
          } else {
            this.formData[question.id] = ''
          }
        })
      },
      formatDate(date) {
        return new Date(date).toLocaleString();
      },
      clearAllSubmissions() {
        if (confirm('Are you sure you want to clear all saved submissions?')) {
          this.savedSubmissions = [];
          this.showAllSubmissions = false;
        }
      },
      formatFormDataForExport() {
        // Check if we have submissions saved
        if (!this.savedSubmissions || this.savedSubmissions.length === 0) {
          // Create a single submission from current form data
          const formattedData = [];
          
          // Add each question with its answer
          this.questions.forEach(question => {
            const answer = this.formData[question.id] || '';
            let formattedAnswer = '';
            
            if (Array.isArray(answer)) {
              formattedAnswer = answer.join(', ');
            } else {
              formattedAnswer = answer;
            }
            
            formattedData.push({
              Question: question.label,
              Answer: formattedAnswer
            });
          });
          
          return formattedData;
        }
        
        // If we have submissions, format them appropriately
        if (this.savedSubmissions.length <= 1) {
          // Single submission
          const formattedData = [];
          const submission = this.savedSubmissions[0] || { data: this.formData };
          
          this.questions.forEach(question => {
            const answer = submission.data[question.id];
            let formattedAnswer = '';
            
            if (Array.isArray(answer)) {
              formattedAnswer = answer.join(', ');
            } else {
              formattedAnswer = answer || '';
            }
            
            formattedData.push({
              Question: question.label,
              Answer: formattedAnswer
            });
          });
          
          return formattedData;
        } else {
          // Multiple submissions
          const formattedData = [];
          
          this.savedSubmissions.forEach((submission, index) => {
            const row = {
              'Submission #': index + 1,
              'Timestamp': this.formatDate(submission.timestamp)
            };
            
            this.questions.forEach(question => {
              const answer = submission.data[question.id];
              let formattedAnswer = '';
              
              if (Array.isArray(answer)) {
                formattedAnswer = answer.join(', ');
              } else {
                formattedAnswer = answer || '';
              }
              
              row[question.label] = formattedAnswer;
            });
            
            formattedData.push(row);
          });
          
          return formattedData;
        }
      },
      
      exportToExcel() {
        const formattedData = this.formatFormDataForExport();
        
        // Create worksheet from data
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        
        // Create workbook and add the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Form Responses');
        
        // Generate Excel file and save
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(data, `form-submission-${new Date().toISOString().slice(0, 10)}.xlsx`);
      },
      exportToCSV() {
        const formattedData = this.formatFormDataForExport();
        let csvContent = '';
        
        if (this.savedSubmissions.length <= 1) {
          // Single submission format
          csvContent = "Question,Answer\n";
          
          // Add each row to the CSV content
          formattedData.forEach(item => {
            // Escape quotes and handle commas
            const escapedQuestion = `"${item.Question.replace(/"/g, '""')}"`;
            const escapedAnswer = `"${item.Answer.toString().replace(/"/g, '""')}"`;
            csvContent += `${escapedQuestion},${escapedAnswer}\n`;
          });
          
          // Create a Blob from the CSV content
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          saveAs(blob, `form-submission-${new Date().toISOString().slice(0, 10)}.csv`);
        } else {
          // Multiple submissions format
          // Create header row with dynamic columns
          const headers = ['Submission #', 'Timestamp'];
          this.questions.forEach(question => {
            headers.push(question.label);
          });
          
          // Escape header values and join with commas
          const headerRow = headers.map(header => `"${header.replace(/"/g, '""')}"`).join(',');
          csvContent = headerRow + '\n';
          
          // Add data rows
          formattedData.forEach(item => {
            const rowValues = [
              `"${item['Submission #']}"`, 
              `"${item['Timestamp'].replace(/"/g, '""')}"`
            ];
            
            // Add each question's answer to the row
            this.questions.forEach(question => {
              const value = item[question.label] || '';
              rowValues.push(`"${value.toString().replace(/"/g, '""')}"`);
            });
            
            // Add the completed row to the CSV content
            csvContent += rowValues.join(',') + '\n';
          });
          
          // Create a Blob from the CSV content
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          saveAs(blob, `form-submission-${new Date().toISOString().slice(0, 10)}.csv`);
        }
      }
    }
}
</script>

<template>
  <div class="form-generator-container">
    <!-- Form progress bar -->
    <div class="form-progress">
      <div class="progress">
        <div 
          class="progress-bar" 
          role="progressbar" 
          :style="{ width: progressPercentage }" 
          :aria-valuenow="answeredCount"
          aria-valuemin="0" 
          :aria-valuemax="questions.length">
          {{ answeredCount }} / {{ questions.length }} questions answered
        </div>
      </div>
      <div class="text-center mt-2">
        <small>{{ Math.round((answeredCount / questions.length) * 100) }}% complete</small>
      </div>
    </div>

    <!-- Success message after form submission -->
    <div v-if="formState === 'success'" class="alert alert-success">
      <h4 class="alert-heading">Form submitted successfully!</h4>
      <p>Thank you for completing the form. Your submission has been saved.</p>
      <hr>
      <div class="d-flex justify-content-between">
        <button class="btn btn-outline-primary" @click="showData = !showData">
          {{ showData ? 'Hide' : 'View' }} your submission
        </button>
        <button class="btn btn-primary" @click="resetForm">Submit another response</button>
      </div>
      
      <!-- Display form data when "View" is clicked -->
      <div v-if="showData" class="mt-3">
        <h5>Your Submission:</h5>
        <div class="card">
          <div class="card-body">
            <div v-for="question in questions" :key="question.id" class="mb-3">
              <strong>{{ question.label }}</strong>: 
              <span v-if="Array.isArray(formData[question.id])">
                {{ formData[question.id].join(', ') || 'No answer provided' }}
              </span>
              <span v-else>
                {{ formData[question.id] || 'No answer provided' }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Export options -->
      <div class="export-options mt-3">
        <h5>Export Options:</h5>
        <div class="btn-group">
          <button class="btn btn-sm btn-outline-secondary" @click="exportToExcel">
            Export as Excel
          </button>
          <button class="btn btn-sm btn-outline-secondary" @click="exportToCSV">
            Export as CSV
          </button>
        </div>
      </div>
    </div>

    <!-- Form input section -->
    <div v-else>
      <form @submit.prevent="submitForm">
        <!-- Render each question component -->
        <div v-for="question in questions" :key="question.id" class="mb-4">
          <FormQuestion
            :question="question"
            v-model="formData[question.id]"
            :validation-error="validationErrors[question.id]"
            :data-question-id="question.id"
            @input="checkQuestionAnswered(question.id, formData[question.id])"
          />
        </div>
        
        <!-- Form submission buttons -->
        <div class="d-flex justify-content-between mt-4">
          <button 
            type="button" 
            class="btn btn-outline-secondary" 
            @click="resetForm">
            Reset Form
          </button>
          <button 
            type="submit" 
            class="btn btn-primary" 
            :disabled="submitting">
            {{ submitting ? 'Submitting...' : 'Submit Form' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Saved submissions section -->
    <div v-if="savedSubmissions.length > 0" class="mt-5 pt-3 border-top">
      <div class="d-flex justify-content-between align-items-center">
        <h4>Saved Submissions ({{ savedSubmissions.length }})</h4>
        <div>
          <button 
            class="btn btn-sm btn-outline-primary mr-2" 
            @click="showAllSubmissions = !showAllSubmissions">
            {{ showAllSubmissions ? 'Hide' : 'View' }} All Submissions
          </button>
          <button 
            v-if="savedSubmissions.length > 1" 
            class="btn btn-sm btn-outline-danger" 
            @click="clearAllSubmissions">
            Clear All
          </button>
        </div>
      </div>
      
      <!-- Display all saved submissions -->
      <div v-if="showAllSubmissions" class="mt-3">
        <div v-for="(submission, index) in savedSubmissions" :key="index" class="card mb-3">
          <div class="card-header d-flex justify-content-between align-items-center">
            <div>Submission #{{ index + 1 }}</div>
            <div><small>{{ formatDate(submission.timestamp) }}</small></div>
          </div>
          <div class="card-body">
            <div v-for="question in questions" :key="`sub-${index}-${question.id}`" class="mb-2">
              <strong>{{ question.label }}</strong>: 
              <span v-if="Array.isArray(submission.data[question.id])">
                {{ submission.data[question.id].join(', ') || 'No answer provided' }}
              </span>
              <span v-else>
                {{ submission.data[question.id] || 'No answer provided' }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Export options for all submissions -->
        <div class="export-options mt-3" v-if="savedSubmissions.length > 0">
          <h5>Export All Submissions:</h5>
          <div class="btn-group">
            <button class="btn btn-sm btn-outline-secondary" @click="exportToExcel">
              Export as Excel
            </button>
            <button class="btn btn-sm btn-outline-secondary" @click="exportToCSV">
              Export as CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .form-progress {
    margin: 2rem 0;
  }
  
  .form-progress .progress-bar {
    transition: width 0.5s ease-in-out;
    background-color: #28a745;
  }

  .export-options {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding-top: 15px;
    margin-top: 15px;
  }
  </style>
