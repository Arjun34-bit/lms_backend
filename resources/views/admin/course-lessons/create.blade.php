@extends('admin.master')

@section('content')
<div class="content-wrapper">
    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0">Create New Lesson for {{ $course['title'] }}</h1>
                </div>
            </div>
        </div>
    </div>

    <section class="content">
        <div class="container-fluid">
            @if($errors->any())
                <div class="alert alert-danger">
                    <ul class="mb-0">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            @if(session('error'))
                <div class="alert alert-danger">
                    {{ session('error') }}
                </div>
            @endif

            @if(session('success'))
                <div class="alert alert-success">
                    {{ session('success') }}
                </div>
            @endif

            <div class="card">
                <div class="card-body">
                    <form action="{{ route('courses.lessons.store', $course['_id']) }}" method="POST" enctype="multipart/form-data">
                        @csrf

                        <div class="form-group">
                            <label for="title">Title</label>
                            <input type="text" name="title" id="title" class="form-control @error('title') is-invalid @enderror" 
                                   value="{{ old('title') }}" required>
                            @error('title')
                                <span class="invalid-feedback d-block">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="form-group">
                            <label for="description">Description</label>
                            <textarea name="description" id="description" class="form-control @error('description') is-invalid @enderror" 
                                      rows="4">{{ old('description') }}</textarea>
                            @error('description')
                                <span class="invalid-feedback d-block">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="form-group">
                            <label for="video">Video File</label>
                            <input type="file" name="video" id="video" class="form-control-file @error('video') is-invalid @enderror"
                                   accept="video/mp4,video/quicktime">
                            <small class="form-text text-muted">Max file size: 500MB. Accepted formats: MP4, QuickTime</small>
                            @error('video')
                                <span class="invalid-feedback d-block">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="form-group">
                            <label for="duration">Duration</label>
                            <input type="text" name="duration" id="duration" class="form-control @error('duration') is-invalid @enderror"
                                   value="{{ old('duration') }}" placeholder="e.g. 1:30:00">
                            @error('duration')
                                <span class="invalid-feedback d-block">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="form-group">
                            <label for="order">Order</label>
                            <input type="number" name="order" id="order" class="form-control @error('order') is-invalid @enderror"
                                   value="{{ old('order', 0) }}">
                            @error('order')
                                <span class="invalid-feedback d-block">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="form-group">
                            <div class="custom-control custom-checkbox">
                                <input type="checkbox" name="is_free" id="is_free" class="custom-control-input" 
                                       value="1" {{ old('is_free') ? 'checked' : '' }}>
                                <label class="custom-control-label" for="is_free">Is Free Lesson</label>
                            </div>
                            @error('is_free')
                                <span class="invalid-feedback d-block">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="form-group">
                            <label for="status">Status</label>
                            <select name="status" id="status" class="form-control @error('status') is-invalid @enderror">
                                <option value="draft" {{ old('status') == 'draft' ? 'selected' : '' }}>Draft</option>
                                <option value="published" {{ old('status') == 'published' ? 'selected' : '' }}>Published</option>
                            </select>
                            @error('status')
                                <span class="invalid-feedback d-block">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="form-group">
                            <label for="resources">Resources (JSON)</label>
                            <textarea name="resources" id="resources" class="form-control @error('resources') is-invalid @enderror"
                                      rows="3">{{ old('resources') }}</textarea>
                            @error('resources')
                                <span class="invalid-feedback d-block">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="form-group">
                            <label for="metadata">Metadata (JSON)</label>
                            <textarea name="metadata" id="metadata" class="form-control @error('metadata') is-invalid @enderror"
                                      rows="3">{{ old('metadata') }}</textarea>
                            @error('metadata')
                                <span class="invalid-feedback d-block">{{ $message }}</span>
                            @enderror
                        </div>

                        <button type="submit" class="btn btn-primary">Create Lesson</button>
                        <a href="{{ route('courses.lessons.index', $course['_id']) }}" class="btn btn-secondary">Cancel</a>
                    </form>
                </div>
            </div>
        </div>
    </section>
</div>
@endsection