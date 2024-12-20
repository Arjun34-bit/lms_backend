<!DOCTYPE html>

<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>LMS - Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background: #28a745 !important;
            font-family: 'Muli', sans-serif;
        }
        .login-form {
            max-width: 1200px;
            margin: 2rem auto;
        }
        .form-container {
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .img-side {
            height: 100%;
            object-fit: cover;
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
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
        .btn-primary {
            background: #28a745;
            border: #E8D426;
        }
        .btn-primary:hover {
            background: #28a745;
            border: #E8D426;
        }
    </style>
</head>

<body>
    <div class="container login-form">
        <div class="row form-container">
            <div class="col-lg-6 p-0 d-none d-lg-block">
                <img src="{{ asset('images/ec.webp') }}" alt="Learning Management System" class="img-fluid img-side">
            </div>
            <div class="col-lg-6 p-5">
                <div class="text-center mb-4">
                    <h2 class="fw-bold text-primary">Login Form</h2>
                    <p class="text-muted">Sign in to your account</p>
                </div>

                <x-validation-errors class="mb-4 alert alert-danger" />

                @session('status')
                    <div class="alert alert-success">
                        {{ $value }}
                    </div>
                @endsession

                <form method="POST" action="{{ route('login') }}" class="needs-validation" id="loginForm" novalidate>
                    @csrf
                    
                    <div class="mb-3">
                        <label for="email" class="form-label">{{ __('Email Address') }}</label>
                        <input id="email" type="email" class="form-control" name="email" value="{{ old('email') }}" required autofocus autocomplete="username">
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">{{ __('Password') }}</label>
                        <input id="password" type="password" class="form-control" name="password" required autocomplete="current-password">
                    </div>

                    <div class="mb-3">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="remember" id="remember_me">
                            <label class="form-check-label" for="remember_me">
                                {{ __('Remember me') }}
                            </label>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-4">
                        @if (Route::has('password.request'))
                            <a href="{{ route('password.request') }}" class="text-decoration-none">
                                {{ __('Forgot your password?') }}
                            </a>
                        @endif
                        <button type="submit" class="btn btn-primary px-4">
                            {{ __('Log in') }}
                        </button>
                    </div>

                    
                </form>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Handle form submission on enter key press
        document.getElementById('loginForm').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.submit();
            }
        });
    </script>
</body>
</html>