<template>
    <div class="container my-4">
      <header class="mb-4">
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary rounded shadow-sm">
          <div class="container-fluid">
            <a class="navbar-brand fw-bold" href="#">Form Generator</a>
            <button 
              class="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <router-link class="nav-link px-3" to="/" active-class="active">
                    <i class="bi bi-ui-checks"></i> Fill Form
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link class="nav-link px-3" to="/admin" active-class="active">
                    <i class="bi bi-gear"></i> Design Form
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <main class="bg-light p-4 rounded shadow-sm">
        <router-view />
      </main>
      <footer class="mt-4 text-center text-muted">
        <small>Form Generator App - Create custom forms with ease</small>
      </footer>
    </div>
  </template>
  
  <script>
  export default {
    name: 'App'
  }
  </script>
  
  <style>
  #app {
    font-family: 'Segoe UI', 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  
  .router-link-active {
    font-weight: bold;
  }
  
  /* Focus indicators for accessibility */
  :focus {
    outline: 3px solid rgba(13, 110, 253, 0.5);
    outline-offset: 2px;
  }
  
  /* Custom transitions */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  </style>
  