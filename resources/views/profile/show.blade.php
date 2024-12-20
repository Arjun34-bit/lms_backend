@extends('admin.master')

@section('content')
<div class="container mt-5">
    <div class="row">
        <div class="col-md-8 offset-md-2">
            <div class="card">
                <div class="card-header">
                    <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                        {{ __('Profile') }}
                    </h2>
                </div>
                <div class="card-body">
                    @if (Laravel\Fortify\Features::canUpdateProfileInformation())
                        @livewire('profile.update-profile-information-form')
                        <hr>
                    @endif

                    @if (Laravel\Fortify\Features::enabled(Laravel\Fortify\Features::updatePasswords()))
                        <div class="mt-4">
                            @livewire('profile.update-password-form')
                        </div>
                        <hr>
                    @endif

                    @if (Laravel\Fortify\Features::canManageTwoFactorAuthentication())
                        <div class="mt-4">
                            @livewire('profile.two-factor-authentication-form')
                        </div>
                        <hr>
                    @endif

                    <div class="mt-4">
                        @livewire('profile.logout-other-browser-sessions-form')
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
