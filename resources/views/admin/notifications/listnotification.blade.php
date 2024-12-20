@extends('admin.master')

@section('content')
<div class="content-wrapper">
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>Notifications</h1>
                </div>
                <div class="col-sm-6 text-right">
                    <button class="btn btn-primary" onclick="markAllAsRead()">Mark All as Read</button>
                </div>
            </div>
        </div>
    </section>

    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Your Notifications</h3>
                        </div>
                        <div class="card-body">
                            @if($notifications->count() > 0)
                                <ul class="list-group">
                                    @foreach($notifications as $notification)
                                        <li class="list-group-item {{ is_null($notification->read_at) ? 'bg-light' : 'bg-secondary' }}">
                                            <div class="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h5 class="mb-1">{{ $notification->type }}</h5>
                                                    <div class="notification-data">
                                                        @if(is_array($notification->data))
                                                            @foreach($notification->data as $key => $value)
                                                                <p class="mb-0"><strong>{{ ucfirst($key) }}:</strong> 
                                                                    @if(is_array($value))
                                                                        {{ json_encode($value) }}
                                                                    @else
                                                                        {{ $value }}
                                                                    @endif
                                                                </p>
                                                            @endforeach
                                                        @else
                                                            <p class="mb-0">{{ $notification->data }}</p>
                                                        @endif
                                                    </div>
                                                    <small class="text-muted">{{ $notification->created_at->diffForHumans() }}</small>
                                                </div>
                                                @if(is_null($notification->read_at))
                                                    <button class="btn btn-sm btn-outline-secondary" onclick="markAsRead('{{ $notification->id }}')">Mark as Read</button>
                                                @else
                                                    <span class="badge badge-success">Read</span>
                                                @endif
                                            </div>
                                        </li>
                                    @endforeach
                                </ul>
                            @else
                                <div class="alert alert-info" role="alert">
                                    No notifications found.
                                </div>
                            @endif
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>

<script>
    function markAsRead(notificationId) {
        fetch(`/notifications/${notificationId}/mark-as-read`, {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': '{{ csrf_token() }}',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                location.reload();
            } else {
                alert(data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function markAllAsRead() {
        fetch('/notifications/mark-all-as-read', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': '{{ csrf_token() }}',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                location.reload();
            } else {
                alert(data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    }
</script>
@endsection