@extends('admin.master')

@section('content')
<div class="content-wrapper">
    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0"><i class="fas fa-edit"></i> Edit Live Class</h1>
                </div>
                <div class="col-sm-6">
                    <div class="float-sm-right">
                        <a href="{{ route('admin.live-classes.index') }}" class="btn btn-secondary">
                            <i class="fas fa-arrow-left"></i> Back to List
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <section class="content">
        <div class="container-fluid">
            <div class="card shadow-sm">
                <div class="card-header bg-primary text-white">
                    <i class="fas fa-pencil-alt"></i> Edit Live Class Details
                </div>
                <div class="card-body">
                    <form action="{{ route('admin.live-classes.update', $liveClass) }}" method="POST">
                        @csrf
                        @method('PUT')

                        <div class="mb-3">
                            <label for="title" class="form-label"><i class="fas fa-heading"></i> Title</label>
                            <input type="text" class="form-control @error('title') is-invalid @enderror"
                                   id="title" name="title" value="{{ old('title', $liveClass->title) }}" required>
                            @error('title')
                                <div class="invalid-feedback"><i class="fas fa-exclamation-circle"></i> {{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="description" class="form-label"><i class="fas fa-align-left"></i> Description</label>
                            <textarea class="form-control @error('description') is-invalid @enderror"
                                    id="description" name="description" rows="4" required>{{ old('description', $liveClass->description) }}</textarea>
                            @error('description')
                                <div class="invalid-feedback"><i class="fas fa-exclamation-circle"></i> {{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="course_id" class="form-label"><i class="fas fa-book"></i> Course</label>
                            <select class="form-select @error('course_id') is-invalid @enderror"
                                    id="course_id" name="course_id" required>
                                <option value="">Select a course</option>
                                @foreach($courses as $course)
                                    <option value="{{ $course->id }}" 
                                        {{ old('course_id', $liveClass->course_id) == $course->id ? 'selected' : '' }}>
                                        {{ $course->title }}
                                    </option>
                                @endforeach
                            </select>
                            @error('course_id')
                                <div class="invalid-feedback"><i class="fas fa-exclamation-circle"></i> {{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="start_time" class="form-label"><i class="fas fa-clock"></i> Start Time</label>
                            <input type="datetime-local" 
                                   class="form-control @error('start_time') is-invalid @enderror"
                                   id="start_time" 
                                   name="start_time" 
                                   value="{{ old('start_time', $liveClass->start_time) }}"
                                   required>
                            @error('start_time')
                                <div class="invalid-feedback"><i class="fas fa-exclamation-circle"></i> {{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="end_time" class="form-label"><i class="fas fa-clock"></i> End Time</label>
                            <input type="datetime-local" 
                                   class="form-control @error('end_time') is-invalid @enderror"
                                   id="end_time" 
                                   name="end_time" 
                                   value="{{ old('end_time', $liveClass->end_time) }}"
                                   required>
                            @error('end_time')
                                <div class="invalid-feedback"><i class="fas fa-exclamation-circle"></i> {{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="meeting_link" class="form-label"><i class="fas fa-link"></i> Meeting Link</label>
                            <input type="url" class="form-control @error('meeting_link') is-invalid @enderror"
                                   id="meeting_link" name="meeting_link" 
                                   value="{{ old('meeting_link', $liveClass->meeting_link) }}" required>
                            @error('meeting_link')
                                <div class="invalid-feedback"><i class="fas fa-exclamation-circle"></i> {{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="status" class="form-label"><i class="fas fa-info-circle"></i> Status</label>
                            <select class="form-select @error('status') is-invalid @enderror"
                                    id="status" name="status" required>
                                @foreach(['scheduled', 'live', 'completed', 'cancelled', 'not approved'] as $status)
                                    <option value="{{ $status }}" 
                                        {{ old('status', $liveClass->status) == $status ? 'selected' : '' }}>
                                        {{ ucfirst($status) }}
                                    </option>
                                @endforeach
                            </select>
                            @error('status')
                                <div class="invalid-feedback"><i class="fas fa-exclamation-circle"></i> {{ $message }}</div>
                            @enderror
                        </div>

                        <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Update Class</button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</div>
@endsection
