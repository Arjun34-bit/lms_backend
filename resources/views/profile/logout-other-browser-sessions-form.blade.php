<x-action-section>
    <x-slot name="title">
        {{ __('Browser Sessions') }}
    </x-slot>

    <x-slot name="description">
        {{ __('Manage and log out your active sessions on other browsers and devices.') }}
    </x-slot>

    <x-slot name="content">
        <div class="alert alert-info">
            {{ __('If necessary, you may log out of all of your other browser sessions across all of your devices. Some of your recent sessions are listed below; however, this list may not be exhaustive. If you feel your account has been compromised, you should also update your password.') }}
        </div>

        @if (count($this->sessions) > 0)
            <div class="list-group mt-4">
                <!-- Other Browser Sessions -->
                @foreach ($this->sessions as $session)
                    <div class="list-group-item d-flex align-items-center">
                        <div>
                            @if ($session->agent->isDesktop())
                                <i class="bi bi-laptop text-secondary"></i>
                            @else
                                <i class="bi bi-phone text-secondary"></i>
                            @endif
                        </div>

                        <div class="ms-3">
                            <div class="fw-bold">
                                {{ $session->agent->platform() ? $session->agent->platform() : __('Unknown') }} - {{ $session->agent->browser() ? $session->agent->browser() : __('Unknown') }}
                            </div>

                            <div class="text-muted">
                                {{ $session->ip_address }},
                                @if ($session->is_current_device)
                                    <span class="text-success fw-bold">{{ __('This device') }}</span>
                                @else
                                    {{ __('Last active') }} {{ $session->last_active }}
                                @endif
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        @endif

        <div class="d-flex align-items-center mt-4">
            <button class="btn btn-primary" wire:click="confirmLogout" wire:loading.attr="disabled">
                {{ __('Log Out Other Browser Sessions') }}
            </button>

            <x-action-message class="ms-3" on="loggedOut">
                {{ __('Done.') }}
            </x-action-message>
        </div>

        <!-- Log Out Other Devices Confirmation Modal -->
        <x-dialog-modal wire:model.live="confirmingLogout">
            <x-slot name="title">
                {{ __('Log Out Other Browser Sessions') }}
            </x-slot>

            <x-slot name="content">
                {{ __('Please enter your password to confirm you would like to log out of your other browser sessions across all of your devices.') }}

                <div class="mt-3" x-data="{}" x-on:confirming-logout-other-browser-sessions.window="setTimeout(() => $refs.password.focus(), 250)">
                    <x-input type="password" class="form-control mt-2"
                                autocomplete="current-password"
                                placeholder="{{ __('Password') }}"
                                x-ref="password"
                                wire:model="password"
                                wire:keydown.enter="logoutOtherBrowserSessions" />

                    <x-input-error for="password" class="mt-2" />
                </div>
            </x-slot>

            <x-slot name="footer">
                <button class="btn btn-secondary" wire:click="$toggle('confirmingLogout')" wire:loading.attr="disabled">
                    {{ __('Cancel') }}
                </button>

                <button class="btn btn-danger ms-3"
                            wire:click="logoutOtherBrowserSessions"
                            wire:loading.attr="disabled">
                    {{ __('Log Out Other Browser Sessions') }}
                </button>
            </x-slot>
        </x-dialog-modal>
    </x-slot>
</x-action-section>
