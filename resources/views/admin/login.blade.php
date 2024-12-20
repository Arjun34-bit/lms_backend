<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PCC Admin Panel</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script> <!-- Optional: for notifications -->
</head>
<style>
  body {
    background: #28a745 !important;
    font-family: 'Muli', sans-serif;
  }
  h1 {
    color: #fff;
    padding-bottom: 2rem;
    font-weight: bold;
  }
  a {
    color: #333;
  }
  a:hover {
    color: #E8D426;
    text-decoration: none;
  }
  .form-control:focus {
    color: #000;
    background-color: #fff;
    border: 2px solid #E8D426;
    outline: 0;
    box-shadow: none;
  }
  .btn {
    background: #28a745;
    border: #E8D426;
  }
  .btn:hover {
    background: #28a745;
    border: #E8D426;
  }
</style>
<body>
<div class="pt-5">
  <h1 class="text-center">Login Form</h1>
  <div class="container">
    <div class="row">
      <div class="col-md-5 mx-auto">
        <div class="card card-body">
          <form id="loginForm">
            @csrf
            <div class="form-group required">
              <label for="username">Enter your Email</label>
              <input type="text" class="form-control text-lowercase" id="username" required="" name="email">
            </div>
            <div class="form-group required">
              <label class="d-flex flex-row align-items-center" for="password">Enter your Password
                <a class="ml-auto border-link small-xl" href="#">Forget Password?</a>
              </label>
              <input type="password" class="form-control" required="" id="password" name="password">
            </div>
            <div class="form-group mt-4 mb-4">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="remember-me" name="remember-me">
                <label class="custom-control-label" for="remember-me">Remember me?</label>
              </div>
            </div>
            <div class="form-group pt-1">
              <button class="btn btn-primary btn-block" type="submit">Log In</button>
            </div>
          </form>
          <p class="small-xl pt-3 text-center">
            <a href="/">Sign up</a> /
            <a href="/register">Register</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  $(document).ready(function() {
    $('#loginForm').submit(function(e) {
      e.preventDefault();

      // Capture form data
      var email = $('#username').val();
      var password = $('#password').val();

      // Send AJAX request to the login API
      $.ajax({
        url: 'http://localhost:3000/api/auth/login',
        type: 'POST',
        data: JSON.stringify({
          email: email,
          password: password
        }),
        contentType: 'application/json',
        success: function(response) {
          // Handle the response
          if (response.token) {
            // Store token in localStorage
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('expiresAt', response.expiresAt);

            // Redirect to dashboard
            window.location.href = '/dashboard';
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Invalid credentials or error in response!',
              icon: 'error'
            });
          }
        },
        error: function() {
          // Show error if the request fails
          Swal.fire({
            title: 'Error',
            text: 'Unable to login, please try again later.',
            icon: 'error'
          });
        }
      });
    });
  });
</script>
</body>
</html>
