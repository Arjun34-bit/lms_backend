<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>LMS - Registration</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #f8f9fa;
        }
        .registration-form {
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
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            display: none;
        }
    </style>
    <script>
        window.onload = function() {
            window.location.href = "{{ route('dashboard') }}";
        }
    </script>
</head>

<body>
    <div class="loading-overlay" id="loadingOverlay">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>

    <div class="container registration-form">
        <div class="row form-container">
            <div class="col-lg-6 p-0 d-none d-lg-block">
                <img src="{{ asset('images/ec.webp') }}" alt="Learning Management System" class="img-fluid img-side">
            </div>
            <div class="col-lg-6 p-5">
                <div class="text-center mb-4">
                    <h2 class="fw-bold text-primary">Registration Form</h2>
                    <p class="text-muted"></p>
                </div>

                <x-validation-errors class="mb-4 alert alert-danger" />

                <form method="POST" action="{{ route('register') }}" class="needs-validation" novalidate id="registrationForm">
                    @csrf
                    
                    <div class="mb-3">
                        <label for="name" class="form-label">{{ __('Full Name') }}</label>
                        <input id="name" type="text" class="form-control" name="name" value="{{ old('name') }}" required autofocus autocomplete="name">
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label">{{ __('Email Address') }}</label>
                        <input id="email" type="email" class="form-control" name="email" value="{{ old('email') }}" required autocomplete="username">
                    </div>

                    <div class="mb-3">
                        <label for="role" class="form-label">{{ __('Select Role') }}</label>
                        <select id="role" name="role" class="form-select" required>
                            <option value="">Choose your role</option>
                            <option value="admin" {{ old('role') == 'admin' ? 'selected' : '' }}>Administrator</option>
                            <option value="user" {{ old('role') == 'user' ? 'selected' : '' }}>Regular User</option>
                            <option value="student" {{ old('role') == 'student' ? 'selected' : '' }}>Student</option>
                            <option value="instructor" {{ old('role') == 'instructor' ? 'selected' : '' }}>Instructor</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="phone_number" class="form-label">{{ __('Phone Number') }}</label>
                        <input id="phone_number" type="tel" class="form-control" name="phone_number" value="{{ old('phone_number') }}" autocomplete="tel">
                    </div>

                    <div class="mb-3">
                        <label for="address" class="form-label">{{ __('Address') }}</label>
                        <input id="address" type="text" class="form-control" name="address" value="{{ old('address') }}">
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">{{ __('Password') }}</label>
                        <input id="password" type="password" class="form-control" name="password" required autocomplete="new-password">
                    </div>

                    <div class="mb-3">
                        <label for="password_confirmation" class="form-label">{{ __('Confirm Password') }}</label>
                        <input id="password_confirmation" type="password" class="form-control" name="password_confirmation" required autocomplete="new-password">
                    </div>

                    @if (Laravel\Jetstream\Jetstream::hasTermsAndPrivacyPolicyFeature())
                        <div class="mb-3">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="terms" id="terms" required>
                                <label class="form-check-label" for="terms">
                                    {!! __('I agree to the :terms_of_service and :privacy_policy', [
                                        'terms_of_service' => '<a href="'.route('terms.show').'" target="_blank">'.__('Terms of Service').'</a>',
                                        'privacy_policy' => '<a href="'.route('policy.show').'" target="_blank">'.__('Privacy Policy').'</a>',
                                    ]) !!}
                                </label>
                            </div>
                        </div>
                    @endif

                    <div class="d-flex justify-content-between align-items-center mt-4">
                        <a href="{{ route('login') }}" class="text-decoration-none">
                            {{ __('Already have an account?') }}
                        </a>
                        <button type="submit" class="btn btn-primary px-4">
                            {{ __('Register') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        document.getElementById('registrationForm').addEventListener('submit', function() {
            document.getElementById('loadingOverlay').style.display = 'flex';
        });
    </script>
</body>
</html>
