<template>
  <div class="invoice-form">
    <div class="form-container">
      <div class="header">
        <h1>{{ companyName }}</h1>
        <p class="subtitle">{{ companyAddress }}</p>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <!-- Section 1: Company Information -->
        <section class="form-section">
          <h2>Company Information</h2>
          
          <div class="form-group">
            <label for="orderId">Order ID *</label>
            <input
              id="orderId"
              v-model="formData.orderId"
              type="text"
              required
              readonly
              placeholder="Order ID from URL"
            />
          </div>

          <div class="form-group">
            <label for="branch">Branch *</label>
            <select
              id="branch"
              v-model="formData.branch"
              required
              disabled
            >
              <option value="">Select Branch</option>
              <option
                v-for="branch in branches"
                :key="branch.id"
                :value="branch.id"
              >
                {{ branch.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="identityType">Identity Type *</label>
            <select
              id="identityType"
              v-model="formData.identityType"
              required
            >
              <option value="">Select Identity Type</option>
              <option value="NRIC">National Registration Identification Card (NRIC)</option>
              <option value="BRN">Business Registration Number (BRN)</option>
            </select>
          </div>

          <div class="form-group">
            <label for="identificationNumber">Identification Number *</label>
            <input
              id="identificationNumber"
              v-model="formData.identificationNumber"
              type="text"
              required
              placeholder="Enter Identification Number"
            />
          </div>

          <div class="form-group">
            <label for="tin">TIN Number *</label>
            <input
              id="tin"
              v-model="formData.tin"
              type="text"
              required
              :readonly="tinValidated"
              placeholder="TIN Number"
            />
            <p v-if="tinValidated" class="help-text">TIN validated</p>
          </div>

          <div class="form-group" v-if="formData.identityType === 'NRIC' || formData.identityType === 'BRN'">
            <button
              type="button"
              class="validate-btn"
              :disabled="!canValidateTIN || isValidatingTIN"
              @click="validateTIN"
            >
              {{ isValidatingTIN ? 'Validating...' : 'Validate TIN' }}
            </button>
          </div>
        </section>

        <!-- Section 2: Contact Information -->
        <section class="form-section">
          <h2>Contact Information</h2>
          
          <div class="form-group">
            <label for="name">Full Name *</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              placeholder="Enter Full Name"
            />
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              placeholder="Enter Email Address"
            />
          </div>

          <div class="form-group">
            <label for="phone">Phone Number *</label>
            <input
              ref="phoneInput"
              id="phone"
              v-model="formData.phone"
              type="tel"
              required
              placeholder="+60123456789"
            />
          </div>

          <div class="form-group">
            <label for="address">Address *</label>
            <input
              id="address"
              v-model="formData.address"
              type="text"
              required
              placeholder="Enter Address"
            />
          </div>

          <div class="form-group">
            <label for="city">City *</label>
            <input
              id="city"
              v-model="formData.city"
              type="text"
              required
              placeholder="Enter City"
            />
          </div>

          <div class="form-group">
            <label for="postalCode">Postal Code *</label>
            <input
              id="postalCode"
              v-model="formData.postal_code"
              type="text"
              required
              placeholder="Enter Postal Code"
            />
          </div>

          <div class="form-group">
            <label for="stateCode">State *</label>
            <select
              id="stateCode"
              v-model="formData.state_code"
              required
            >
              <option value="">Select State</option>
              <option
                v-for="state in malaysiaStates"
                :key="state.code"
                :value="state.code"
              >
                {{ state.name }} ({{ state.code }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="country">Country *</label>
            <input
              id="country"
              v-model="formData.country"
              type="text"
              required
              value="MYS"
              readonly
            />
          </div>
        </section>

        <div class="form-actions">
          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            {{ isSubmitting ? 'Submitting...' : 'Submit Invoice' }}
          </button>
        </div>
      </form>

      <!-- Success/Error Messages -->
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { branches } from '../config/branches'
import { malaysiaStates } from '../config/malaysiaStates'
import { companyDetails } from '../config/company'
import IMask from 'imask'

export default {
  name: 'InvoiceForm',
  data() {
    return {
      branches,
      malaysiaStates,
      companyName: companyDetails.name,
      companyAddress: '',
      isSubmitting: false,
      message: '',
      messageType: '',
      phoneMask: null,
      tinValidated: false,
      isValidatingTIN: false,
      formData: {
        orderId: '',
        branch: '',
        identityType: '',
        identificationNumber: '',
        tin: 'EI00000000010',
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postal_code: '',
        state_code: '',
        country: 'MYS'
      }
    }
  },
  mounted() {
    // Get values from URL query parameters
    const urlParams = new URLSearchParams(window.location.search)
    
    // Get order_id from URL (note: using order_id, not orderId)
    const orderId = urlParams.get('order_id')
    if (orderId) {
      this.formData.orderId = orderId
    }
    
    // Get branch from URL and match it to branch ID
    const branchParam = urlParams.get('branch')
    if (branchParam) {
      // Try to match by ID first (case-insensitive)
      const branchById = this.branches.find(
        b => b.id.toLowerCase() === branchParam.toLowerCase()
      )
      
      // If not found by ID, try to match by name (case-insensitive)
      const branchByName = this.branches.find(
        b => b.name.toLowerCase() === branchParam.toLowerCase()
      )
      
      // Set the branch ID if found and update header
      if (branchById) {
        this.formData.branch = branchById.id
        this.updateHeaderFromBranch(branchById)
      } else if (branchByName) {
        this.formData.branch = branchByName.id
        this.updateHeaderFromBranch(branchByName)
      } else {
        // If no match found, set the value as-is (in case it's a valid ID not in config)
        this.formData.branch = branchParam
        // Try to find branch by ID one more time
        const branch = this.branches.find(b => b.id === branchParam)
        if (branch) {
          this.updateHeaderFromBranch(branch)
        }
      }
    }

    // Initialize phone mask for Malaysia format (+60)
    this.initPhoneMask()
  },
  beforeUnmount() {
    // Clean up mask instance
    if (this.phoneMask) {
      this.phoneMask.destroy()
    }
  },
  computed: {
    canValidateTIN() {
      return (this.formData.identityType === 'NRIC' || this.formData.identityType === 'BRN') && 
             this.formData.identificationNumber && 
             this.formData.identificationNumber.trim() !== ''
    }
  },
  methods: {
    updateHeaderFromBranch(branch) {
      if (branch) {
        // this.companyName = branch.name
        this.companyAddress = branch.address || ''
      }
    },
    async validateTIN() {
      if (!this.canValidateTIN) {
        return
      }

      this.isValidatingTIN = true
      this.tinValidated = false

      try {
        // Use proxy in development, direct URL in production
        const isDev = import.meta.env.DEV
        const idType = this.formData.identityType // Use 'NRIC' or 'BRN'
        let url
        
        if (isDev) {
          // In development, use Vite proxy to avoid CORS
          url = `/api/myinvois/taxpayers/search/tin?taxpayerTIN=&idType=${idType}&idValue=${encodeURIComponent(this.formData.identificationNumber)}`
        } else {
          // In production, use direct URL (requires backend proxy)
          const myinvoisUrl = import.meta.env.VITE_MYINVOIS_URL || ''
          if (!myinvoisUrl) {
            throw new Error('MYINVOIS_URL is not configured')
          }
          url = `${myinvoisUrl}/taxpayers/search/tin?taxpayerTIN=&idType=${idType}&idValue=${encodeURIComponent(this.formData.identificationNumber)}`
        }
        
        const response = await fetch(url)

        if (response.ok) {
          const data = await response.json()
          if (data.tin) {
            this.formData.tin = data.tin
            this.tinValidated = true
            this.message = 'TIN validated successfully'
            this.messageType = 'success'
          } else {
            throw new Error('TIN not found in response')
          }
        } else if (response.status === 404) {
          // Fallback to default TIN
          this.formData.tin = 'EI00000000010'
          this.tinValidated = false
          this.message = 'TIN not found, using default TIN'
          this.messageType = 'error'
        } else {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to validate TIN')
        }
      } catch (error) {
        // On error, fallback to default TIN
        this.formData.tin = 'EI00000000010'
        this.tinValidated = false
        this.message = error.message || 'Failed to validate TIN, using default TIN'
        this.messageType = 'error'
      } finally {
        this.isValidatingTIN = false
      }
    },
    initPhoneMask() {
      // Initialize IMask for Malaysia phone format: +60 followed by 9-11 digits
      // Supports: +60 12 345 6789 (9 digits), +60 12 3456 7890 (10 digits), +60 12 3456 78901 (11 digits)
      this.$nextTick(() => {
        if (this.$refs.phoneInput) {
          this.phoneMask = IMask(this.$refs.phoneInput, {
            mask: [
              {
                mask: '+60 00 000 0000',  // 9 digits after +60
                lazy: false
              },
              {
                mask: '+60 00 0000 0000', // 10 digits after +60
                lazy: false
              },
              {
                mask: '+60 00 0000 00000', // 11 digits after +60
                lazy: false
              }
            ],
            dispatch: function (appended, dynamicMasked) {
              const number = (dynamicMasked.value + appended).replace(/\D/g, '')
              
              // Count digits after country code (+60 = 2 digits "60")
              // Total digits minus 2 (for "60") gives us digits after +60
              const digitsAfterCountryCode = number.length > 2 ? number.length - 2 : 0
              
              if (digitsAfterCountryCode <= 9) {
                return dynamicMasked.compiledMasks[0] // 9 digits: +60 00 000 0000
              } else if (digitsAfterCountryCode <= 10) {
                return dynamicMasked.compiledMasks[1] // 10 digits: +60 00 0000 0000
              } else {
                return dynamicMasked.compiledMasks[2] // 11 digits: +60 00 0000 00000
              }
            }
          })

          // Sync mask value with v-model
          this.phoneMask.on('accept', () => {
            this.formData.phone = this.phoneMask.value
          })

          // Set initial value if formData.phone already has a value
          if (this.formData.phone) {
            this.phoneMask.value = this.formData.phone
            this.formData.phone = this.phoneMask.value
          }
        }
      })
    },
    constructPayload() {
      // Construct payload based on identity type
      const payload = {
        name: this.formData.name,
        email: this.formData.email,
        phone: this.formData.phone,
        address: this.formData.address,
        city: this.formData.city,
        postal_code: this.formData.postal_code,
        state_code: this.formData.state_code,
        country: this.formData.country,
        tin: this.formData.tin
      }

      // Add identity-specific fields
      if (this.formData.identityType === 'NRIC') {
        payload.nric = this.formData.identificationNumber
      } else if (this.formData.identityType === 'BRN') {
        payload.brn = this.formData.identificationNumber
      }

      // Get selected branch and extract base URL from branch endpoint
      const selectedBranch = this.branches.find(b => b.id === this.formData.branch)
      if (!selectedBranch || !selectedBranch.endpoint) {
        return {
          payload,
          endpoint: '',
          orderId: this.formData.orderId
        }
      }

      // Extract base URL from branch endpoint (e.g., 'https://api.example.com' from 'https://api.example.com/branch1/invoice')
      const branchEndpointUrl = new URL(selectedBranch.endpoint)
      const baseUrl = `${branchEndpointUrl.protocol}//${branchEndpointUrl.host}`
      
      // Construct endpoint: {baseurl}/api/orders/{order_id}/submit-myinvois
      const orderId = this.formData.orderId
      const endpoint = `${baseUrl}/api/orders/${orderId}/submit-myinvois`

      return {
        payload,
        endpoint,
        orderId: this.formData.orderId
      }
    },
    async handleSubmit() {
      this.isSubmitting = true
      this.message = ''
      this.messageType = ''

      try {
        const { payload, endpoint, orderId } = this.constructPayload()

        if (!endpoint) {
          throw new Error('Branch endpoint is not configured or order ID is missing')
        }

        if (!orderId) {
          throw new Error('Order ID is required')
        }

        // Submit to API endpoint
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        })
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to submit invoice')
        }

        const result = await response.json()
        
        this.message = 'Company details submitted successfully!'
        this.messageType = 'success'

        // Reset form after successful submission (optional)
        // this.resetForm()

      } catch (error) {
        this.message = error.message || 'An error occurred while submitting the company details'
        this.messageType = 'error'
      } finally {
        this.isSubmitting = false
      }
    },
    resetForm() {
      const urlParams = new URLSearchParams(window.location.search)
      const orderId = urlParams.get('orderId')
      
      this.formData = {
        orderId: orderId || '',
        branch: '',
        identityType: '',
        identificationNumber: '',
        tin: 'EI00000000010',
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postal_code: '',
        state_code: '',
        country: 'MYS'
      }
    }
  }
}
</script>

<style scoped>
.invoice-form {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 3rem 1.5rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.form-container {
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 3rem;
  max-width: 800px;
  width: 100%;
  border: 1px solid #e1e8ed;
}

.header {
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e1e8ed;
}

h1 {
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  margin-top: 0;
  text-align: left;
  font-size: 1.875rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.subtitle {
  color: #6b7280;
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.5;
  font-weight: 400;
}

h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  margin-top: 0;
  font-size: 1.25rem;
  font-weight: 600;
  border-bottom: 1px solid #e1e8ed;
  padding-bottom: 0.75rem;
  letter-spacing: -0.01em;
}

.form-section {
  margin-bottom: 3rem;
}

.form-section:last-of-type {
  margin-bottom: 2.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
  font-size: 0.875rem;
  letter-spacing: 0.01em;
}

input[type="text"],
input[type="email"],
input[type="tel"],
select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d9e0;
  border-radius: 4px;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
  background-color: #fff;
  color: #1a1a1a;
  font-family: inherit;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="tel"]:focus,
select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

input[type="text"]:hover,
input[type="email"]:hover,
input[type="tel"]:hover,
select:hover {
  border-color: #94a3b8;
}

input[readonly] {
  background-color: #f8f9fa;
  cursor: not-allowed;
  color: #6b7280;
}

select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234b5563' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

select:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
  color: #6b7280;
  opacity: 1;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
}

.help-text {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #059669;
  font-weight: 500;
}

.validate-btn {
  background: #2563eb;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.validate-btn:hover:not(:disabled) {
  background: #1d4ed8;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.validate-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  opacity: 0.6;
}

.form-actions {
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid #e1e8ed;
  text-align: right;
}

.submit-btn {
  background: #2563eb;
  color: white;
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 160px;
  letter-spacing: 0.01em;
}

.submit-btn:hover:not(:disabled) {
  background: #1d4ed8;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.submit-btn:active:not(:disabled) {
  background: #1e40af;
  transform: translateY(1px);
}

.submit-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
}

.message {
  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
  border-radius: 4px;
  text-align: left;
  font-weight: 400;
  font-size: 0.9375rem;
  line-height: 1.5;
}

.message.success {
  background-color: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.message.error {
  background-color: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

@media (max-width: 768px) {
  .invoice-form {
    padding: 1.5rem 1rem;
  }

  .form-container {
    padding: 2rem 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  h2 {
    font-size: 1.125rem;
  }

  .form-actions {
    text-align: center;
  }

  .submit-btn {
    width: 100%;
  }
}
</style>

