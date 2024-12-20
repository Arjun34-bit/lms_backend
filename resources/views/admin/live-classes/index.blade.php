@extends('admin.master')

@section('content')
<div class="content-wrapper">
    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0"><i class="fas fa-chalkboard-teacher"></i> Live Classes</h1>
                </div>
                <div class="col-sm-6">
                    <div class="float-sm-right">
                        <a href="{{ route('admin.live-classes.create') }}" class="btn btn-primary">
                            <i class="fas fa-plus-circle"></i> Schedule New Class
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <section class="content">
        <div class="container-fluid">
            @if(session('success'))
                <div class="alert alert-success">
                    <i class="fas fa-check-circle"></i> {{ session('success') }}
                </div>
            @endif

            <div class="row mb-3">
                <div class="col-md-3">
                    <div class="info-box bg-light">
                        <div class="info-box-content">
                            <span class="info-box-text"><i class="fas fa-calendar-alt"></i> Upcoming Classes</span>
                            <span class="info-box-number">{{ $upcomingClassesCount }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-body p-0">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Course</th>
                                <th>Instructor</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Status</th>
                                <th>Meeting Link</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($liveClasses as $class)
                                <tr>
                                    <td style="word-wrap: break-word;">{{ $class->title }}</td>
                                    <td style="word-wrap: break-word;" title="{{ $class->course->title }}">
                                        {{ Str::limit($class->course->title, 30) }}
                                    </td>
                                    <td style="word-wrap: break-word;">{{ $class->instructor->name }}</td>
                                    <td>
                                        {{ $class->formatted_start }}
                                        @if($class->status === 'scheduled' && isset($class->countdown))
                                            <br>
                                            <small class="text-muted">Starts in {{ $class->countdown }}</small>
                                        @endif
                                    </td>
                                    <td>{{ $class->formatted_end }}</td>
                                    <td>
                                        @php
                                            $statusClass = match($class->status) {
                                                'live' => 'success',
                                                'scheduled' => 'info',
                                                'completed' => 'secondary',
                                                'cancelled' => 'danger',
                                                'not approved' => 'warning',
                                                default => 'secondary'
                                            };
                                        @endphp
                                        <span class="badge badge-{{ $statusClass }}" title="{{ ucfirst($class->status) }}">
                                            {{ Str::limit(ucfirst($class->status), 30) }}
                                        </span>
                                    </td>
                                    <td>
                                        <a href="{{ $class->meeting_link }}" target="_blank" class="btn btn-sm btn-primary">
                                            <i class="fas fa-video"></i> Join
                                        </a>
                                    </td>
                                    <td>
                                        <div class="d-flex">
                                            <a href="{{ route('admin.live-classes.edit', $class) }}" 
                                               class="btn btn-sm btn-info mr-1">
                                                <i class="fas fa-edit"></i> Edit
                                            </a>
                                            <form action="{{ route('admin.live-classes.destroy', $class) }}" 
                                                  method="POST" 
                                                  class="d-inline">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" 
                                                        class="btn btn-sm btn-danger" 
                                                        onclick="return confirm('Are you sure you want to delete this class?')">
                                                    <i class="fas fa-trash"></i> Delete
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="mt-4">
                {{ $liveClasses->links() }}
            </div>
        </div>
    </section>
</div>
@endsection