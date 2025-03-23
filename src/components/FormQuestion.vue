<template>
    <div class="form-question" :data-question-id="question.id">
      <label :for="'question-' + question.id" class="form-label fw-bold mb-2">
        {{ question.label }}
        <span v-if="question.required" class="text-danger">*</span>
      </label>
  
      <!-- Text input -->
      <input
        v-if="question.type === 'text'"
        :id="'question-' + question.id"
        type="text"
        class="form-control"
        :class="{'is-invalid': error}"
        :required="question.required"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholderText"
      />
  
      <!-- Email input -->
      <input
        v-else-if="question.type === 'email'"
        :id="'question-' + question.id"
        type="email"
        class="form-control"
        :class="{'is-invalid': error}"
        :required="question.required"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        placeholder="example@domain.com"
      />
  
      <!-- Number input -->
      <input
        v-else-if="question.type === 'number'"
        :id="'question-' + question.id"
        type="number"
        class="form-control"
        :class="{'is-invalid': error}"
        :required="question.required"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        placeholder="Enter a number"
      />
  
      <!-- Date input -->
      <input
        v-else-if="question.type === 'date'"
        :id="'question-' + question.id"
        type="date"
        class="form-control"
        :class="{'is-invalid': error}"
        :required="question.required"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
  
      <!-- Textarea -->
      <textarea
        v-else-if="question.type === 'textarea'"
        :id="'question-' + question.id"
        class="form-control"
        :class="{'is-invalid': error}"
        rows="3"
        :required="question.required"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        placeholder="Enter your response here"
      ></textarea>
  
      <!-- Select dropdown -->
      <select
        v-else-if="question.type === 'select'"
        :id="'question-' + question.id"
        class="form-select"
        :class="{'is-invalid': error}"
        :required="question.required"
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
      >
        <option value="" disabled selected>Please select an option</option>
        <option
          v-for="(option, index) in question.options"
          :key="index"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
  
      <!-- Radio buttons -->
      <div v-else-if="question.type === 'radio'" class="mt-2">
        <div
          v-for="(option, index) in question.options"
          :key="index"
          class="form-check mb-2"
        >
          <input
            :id="'question-' + question.id + '-' + index"
            class="form-check-input"
            :class="{'is-invalid': error && index === question.options.length - 1}"
            type="radio"
            :name="'question-' + question.id"
            :value="option"
            :checked="modelValue === option"
            @change="$emit('update:modelValue', option)"
            :required="question.required && index === 0"
          />
          <label
            class="form-check-label"
            :for="'question-' + question.id + '-' + index"
          >
            {{ option }}
          </label>
        </div>
      </div>
  
      <!-- Checkboxes -->
      <div v-else-if="question.type === 'checkbox'" class="mt-2">
        <div
          v-for="(option, index) in question.options"
          :key="index"
          class="form-check mb-2"
        >
          <input
            :id="'question-' + question.id + '-' + index"
            class="form-check-input"
            :class="{'is-invalid': error && index === question.options.length - 1}"
            type="checkbox"
            :value="option"
            :checked="isChecked(option)"
            @change="updateCheckbox(option, $event)"
          />
          <label
            class="form-check-label"
            :for="'question-' + question.id + '-' + index"
          >
            {{ option }}
          </label>
        </div>
      </div>
      
      <small v-if="question.description" class="form-text text-muted mt-1">
        {{ question.description }}
      </small>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FormQuestion',
    props: {
      question: {
        type: Object,
        required: true
      },
      modelValue: {
        type: [String, Array],
        required: false,
        default: ''
      },
      error: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      placeholderText() {
        const typeMap = {
          text: 'Enter your answer',
          email: 'example@domain.com',
          number: 'Enter a number',
          date: '',
          textarea: 'Enter your response here'
        }
        return typeMap[this.question.type] || 'Enter your answer'
      }
    },
    methods: {
      isChecked(option) {
        if (Array.isArray(this.modelValue)) {
          return this.modelValue.includes(option)
        }
        return false
      },
      updateCheckbox(option, event) {
        let currentValue = Array.isArray(this.modelValue) ? [...this.modelValue] : []
        
        if (event.target.checked) {
          currentValue.push(option)
        } else {
          currentValue = currentValue.filter(value => value !== option)
        }
        
        this.$emit('update:modelValue', currentValue)
      }
    }
  }
  </script>
  
  <style scoped>
  .form-check-label {
    cursor: pointer;
  }
  
  .form-check-input {
    cursor: pointer;
  }
  </style>
  