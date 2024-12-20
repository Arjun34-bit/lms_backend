<form wire:submit.prevent="updateProfileInformation" class="form-section">
    <div class="mb-4">
        <h2 class="h4">{{ __('Profile Information') }}</h2>
        <p>{{ __('Update your account\'s profile information and email address.') }}</p>
    </div>

    <div class="form-row">
        <!-- Profile Photo -->
        @if (Laravel\Jetstream\Jetstream::managesProfilePhotos())
            <div x-data="{photoName: null, photoPreview: null}" class="form-group col-md-6">
                <label for="photo">{{ __('Photo') }}</label>
                <input type="file" id="photo" class="d-none"
                       wire:model.live="photo"
                       x-ref="photo"
                       x-on:change="
                           photoName = $refs.photo.files[0].name;
                           const reader = new FileReader();
                           reader.onload = (e) => {
                               photoPreview = e.target.result;
                           };
                           reader.readAsDataURL($refs.photo.files[0]);
                       " />

                <div class="mt-2" x-show="! photoPreview">
                    <img src="{{ $this->user->profile_photo_url }}" alt="{{ $this->user->name }}" class="rounded-circle img-thumbnail">
                </div>

                <div class="mt-2" x-show="photoPreview" style="display: none;">
                    <span class="d-block rounded-circle img-thumbnail"
                          x-bind:style="'background-image: url(\'' + photoPreview + '\');'">
                    </span>
                </div>

                <button type="button" class="btn btn-secondary mt-2 me-2" x-on:click.prevent="$refs.photo.click()">
                    {{ __('Select A New Photo') }}
                </button>

                @if ($this->user->profile_photo_path)
                    <button type="button" class="btn btn-danger mt-2" wire:click="deleteProfilePhoto">
                        {{ __('Remove Photo') }}
                    </button>
                @endif

                <x-input-error for="photo" class="mt-2" />
            </div>
        @endif

        <!-- Name -->
        <div class="form-group col-md-6">
            <label for="name">{{ __('Name') }}</label>
            <input id="name" type="text" class="form-control" wire:model="state.name" required autocomplete="name" />
            <x-input-error for="name" class="mt-2" />
        </div>

        <!-- Email -->
        <div class="form-group col-md-6">
            <label for="email">{{ __('Email') }}</label>
            <input id="email" type="email" class="form-control" wire:model="state.email" required autocomplete="username" />
            <x-input-error for="email" class="mt-2" />

            @if (Laravel\Fortify\Features::enabled(Laravel\Fortify\Features::emailVerification()) && ! $this->user->hasVerifiedEmail())
                <p class="text-muted mt-2">
                    {{ __('Your email address is unverified.') }}

                    <button type="button" class="btn btn-link p-0" wire:click.prevent="sendEmailVerification">
                        {{ __('Click here to re-send the verification email.') }}
                    </button>
                </p>

                @if ($this->verificationLinkSent)
                    <p class="mt-2 text-success">
                        {{ __('A new verification link has been sent to your email address.') }}
                    </p>
                @endif
            @endif
        </div>
    </div>

    <div class="form-group mt-4">
        <x-action-message class="me-3" on="saved">
            {{ __('Saved.') }}
        </x-action-message>

        <button type="submit" class="btn btn-primary" wire:loading.attr="disabled" wire:target="photo">
            {{ __('Save') }}
        </button>
    </div>
</form>
