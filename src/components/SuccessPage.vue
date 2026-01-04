<template>
  <div class="success-page">
    <div class="success-container">
      <div class="success-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <h1>Request Submitted</h1>
      <p>Your request has been submitted, please check your email</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuccessPage'
}
</script>

<style scoped>
.success-page {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.success-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 3rem;
  text-align: center;
  max-width: 500px;
  width: 100%;
  border: 1px solid #e1e8ed;
}

.success-icon {
  color: #059669;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.success-icon svg {
  width: 64px;
  height: 64px;
}

h1 {
  color: #1a1a1a;
  font-size: 1.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

p {
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 768px) {
  .success-page {
    padding: 1.5rem 1rem;
  }

  .success-container {
    padding: 2rem 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  p {
    font-size: 0.9375rem;
  }
}
</style>

