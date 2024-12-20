@extends('admin.master')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 offset-md-2">
            <div class="card shadow-sm">
                @if(isset($course['thumbnail_url']))
                    <div class="thumbnail-container">
                        <img src="{{ $course['thumbnail_url'] }}" class="card-img-top" alt="{{ $course['title'] }}">
                    </div>
                @endif
                
                <div class="card-body">
                    <h1 class="card-title fw-bold mb-3">{{ $course['title'] }}</h1>
                    
                    <div class="mb-3 badge-container">
                        <span class="badge bg-primary"><i class="fas fa-tag me-1"></i>{{ $course['category'] }}</span>
                        <span class="badge bg-secondary"><i class="fas fa-layer-group me-1"></i>{{ $course['level'] }}</span>
                        <span class="badge bg-info"><i class="far fa-clock me-1"></i>{{ $course['duration'] }} minutes</span>
                    </div>

                    <h5 class="card-subtitle mb-3 text-muted">
                        <i class="fas fa-dollar-sign me-1"></i>Price: ${{ number_format($course['price'], 2) }}
                    </h5>
                    
                    <div class="card-text mb-4">
                        <h4 class="fw-bold"><i class="fas fa-info-circle me-2"></i>Description</h4>
                        <p class="lead">{{ $course['description'] }}</p>
                    </div>

                    <div class="mb-4">
                        <h4 class="fw-bold"><i class="fas fa-chalkboard-teacher me-2"></i>Instructor Details</h4>
                        <p><i class="fas fa-user me-2"></i><strong>Name:</strong> {{ $course['instructor_name'] }}</p>
                        <p><i class="fas fa-envelope me-2"></i><strong>Email:</strong> {{ $course['instructor_email'] }}</p>
                    </div>

                    @if(Auth::id() === $course['instructor_id'])
                        <div class="mb-4">
                            <a href="{{ route('courses.edit', $course['_id']) }}" 
                               class="btn btn-warning btn-lg me-2">
                                <i class="fas fa-edit me-1"></i> Edit Course
                            </a>
                            <form action="{{ route('courses.destroy', $course['_id']) }}" 
                                  method="POST" 
                                  class="d-inline">
                                @csrf
                                @method('DELETE')
                                <button type="submit" 
                                        class="btn btn-danger btn-lg" 
                                        onclick="return confirm('Are you sure?')">
                                    <i class="fas fa-trash me-1"></i> Delete Course
                                </button>
                            </form>
                        </div>
                    @endif
                </div>
            </div>

            <!-- Lessons Section -->
            <div class="card mt-4 shadow-sm">
                <div class="card-header bg-light">
                    <div class="d-flex justify-content-between align-items-center">
                        <h3 class="fw-bold mb-0"><i class="fas fa-book me-2"></i>Course Lessons</h3>
                        @if(Auth::id() === $course['instructor_id'])
                            <a href="{{ route('courses.lessons.create', $course['_id']) }}" 
                               class="btn btn-primary">
                                <i class="fas fa-plus me-1"></i> Add Lesson
                            </a>
                        @endif
                    </div>
                </div>
                <div class="card-body">
                    @if($lessons->count() > 0)
                        <div class="list-group">
                            @foreach($lessons as $lesson)
                                <div class="list-group-item">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5 class="fw-bold mb-2">{{ $lesson->title }}</h5>
                                            <p class="mb-2 text-muted">{{ $lesson->description }}</p>
                                            <div class="badge-container">
                                                <small class="text-muted">
                                                    <i class="far fa-clock me-1"></i> {{ $lesson->duration }} minutes |
                                                    <span class="badge bg-{{ $lesson->status === 'published' ? 'success' : 'warning' }}">
                                                        {{ ucfirst($lesson->status) }}
                                                    </span>
                                                    @if($lesson->is_free)
                                                        | <span class="badge bg-info">Free</span>
                                                    @endif
                                                </small>
                                            </div>
                                            @if($lesson->video_url)
                                                <div class="mt-3 video-container">
                                                    <video width="100%" controls class="rounded">
                                                        <source src="{{ $lesson->video_url }}" type="video/mp4">
                                                        Your browser does not support the video tag.
                                                    </video>
                                                </div>
                                            @endif
                                        </div>
                                        @if(Auth::id() === $course['instructor_id'])
                                            <div>
                                                <a href="{{ route('courses.lessons.edit', [$course['_id'], $lesson->id]) }}" 
                                                   class="btn btn-warning btn-sm me-1">
                                                    <i class="fas fa-edit me-1"></i> Edit
                                                </a>
                                                <form action="{{ route('courses.lessons.destroy', [$course['_id'], $lesson->id]) }}" 
                                                      method="POST" 
                                                      class="d-inline">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" 
                                                            class="btn btn-danger btn-sm" 
                                                            onclick="return confirm('Are you sure?')">
                                                        <i class="fas fa-trash me-1"></i> Delete
                                                    </button>
                                                </form>
                                            </div>
                                        @endif
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    @else
                        <p class="text-center text-muted">No lessons available for this course yet.</p>
                    @endif
                </div>
            </div>

            <!-- Live Classes Section -->
            <div class="card mt-4 shadow-sm">
                <div class="card-header bg-light">
                    <h3 class="fw-bold mb-2"><i class="fas fa-video me-2"></i>Live Classes</h3>
                    <div class="d-flex gap-2">
                        <span class="badge bg-primary">
                            <i class="fas fa-calendar me-1"></i> Upcoming: {{ $upcomingClassesCount }}
                        </span>
                        <span class="badge bg-success">
                            <i class="fas fa-video me-1"></i> Live Now: {{ $liveClassesCount }}
                        </span>
                        <span class="badge bg-secondary">
                            <i class="fas fa-check me-1"></i> Completed: {{ $completedClassesCount }}
                        </span>
                    </div>
                </div>
                <div class="card-body">
                    @if($liveClasses->count() > 0)
                        <div class="list-group">
                            @foreach($liveClasses as $class)
                                <div class="list-group-item">
                                    <h5 class="fw-bold mb-2">{{ $class->title }}</h5>
                                    <p class="text-muted mb-2">{{ $class->description }}</p>
                                    <div class="d-flex gap-2 align-items-center mb-2">
                                        <span class="badge bg-{{ $class->status === 'scheduled' ? 'primary' : ($class->status === 'live' ? 'success' : 'secondary') }}">
                                            <i class="fas fa-{{ $class->status === 'scheduled' ? 'calendar' : ($class->status === 'live' ? 'video' : 'check') }} me-1"></i>
                                            {{ ucfirst($class->status) }}
                                        </span>
                                        @if($class->countdown)
                                            <small class="text-muted">
                                                <i class="fas fa-clock me-1"></i> Starts in: {{ $class->countdown }}
                                            </small>
                                        @endif
                                    </div>
                                    <div class="text-muted mb-2">
                                        <small><i class="fas fa-play me-1"></i> Start: {{ $class->formatted_start }}</small><br>
                                        <small><i class="fas fa-stop me-1"></i> End: {{ $class->formatted_end }}</small>
                                    </div>
                                    @if($class->status === 'live')
                                        <a href="{{ $class->meeting_link }}" 
                                           target="_blank" 
                                           class="btn btn-success btn-sm">
                                            <i class="fas fa-video me-1"></i> Join Now
                                        </a>
                                    @endif
                                </div>
                            @endforeach
                        </div>
                    @else
                        <p class="text-center text-muted">No live classes scheduled for this course.</p>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.thumbnail-container {
    height: 300px;
    overflow: hidden;
}

.thumbnail-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.video-container {
    border-radius: 8px;
    overflow: hidden;
}

.badge-container {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}
</style>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
@endsection