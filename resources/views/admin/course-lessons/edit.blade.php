@extends('admin.master')

@section('content')
<div class="content-wrapper">
    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0">Edit Lesson: {{ $lesson->title }}</h1>
                </div>
            </div>
        </div>
    </div>

    <section class="content">
        <div class="container-fluid">
            @if(session('error'))
                <div class="alert alert-danger">
                    {{ session('error') }}
                </div>
            @endif

            <div class="card">
                <div class="card-body">
                    <form action="{{ route('courses.lessons.update', [$course->_id, $lesson->id]) }}" 
                          method="POST" 
                          enctype="multipart/form-data">
                        @csrf
                        @method('PUT')

                        <div class="form-group">
                            <label for="title">Title</label>
                            <input type="text" 
                                   name="title" 
                                   id="title" 
                                   value="{{ old('title', $lesson->title) }}" 
                                   class="form-control @error('title') is-invalid @enderror"
                                   required>
                            @error('title')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="form-group">
                            <label for="description">Description</label>
                            <textarea name="description" 
                                      id="description" 
                                      rows="4" 
                                      class="form-control @error('description') is-invalid @enderror">{{ old('description', $lesson->description) }}</textarea>
                            @error('description')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        @if($lesson->video_url)
                        <div class="form-group">
                            <label>Current Video</label>
                            <div class="video-thumbnail position-relative" style="max-width: 320px">
                                <video width="320" height="240" class="img-fluid" preload="metadata" poster>
                                    <source src="{{ $lesson->video_url }}" type="video/mp4">
                                    Your browser does not support the video tag.
                                </video>
                                <button type="button" class="btn btn-primary position-absolute" 
                                        style="top: 50%; left: 50%; transform: translate(-50%, -50%)"
                                        onclick="this.previousElementSibling.play()">
                                    <i class="fas fa-play"></i>
                                </button>
                            </div>
                        </div>
                        @endif

                        <div class="form-group">
                            <label for="video">Upload New Video</label>
                            <div class="custom-file">
                                <input type="file" 
                                       class="custom-file-input @error('video') is-invalid @enderror" 
                                       id="video"
                                       name="video"
                                       accept="video/mp4,video/quicktime">
                                <label class="custom-file-label" for="video">Choose file</label>
                            </div>
                            <small class="form-text text-muted">Max file size: 500MB. Supported formats: MP4, QuickTime</small>
                            @error('video')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="form-group">
                            <label for="duration">Duration</label>
                            <input type="text" 
                                   name="duration" 
                                   id="duration" 
                                   value="{{ old('duration', $lesson->duration) }}"
                                   class="form-control @error('duration') is-invalid @enderror"
                                   placeholder="e.g., 10:30">
                            @error('duration')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="form-group">
                            <label for="order">Order</label>
                            <input type="number" 
                                   name="order" 
                                   id="order" 
                                   value="{{ old('order', $lesson->order) }}"
                                   class="form-control @error('order') is-invalid @enderror">
                            @error('order')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="form-group">
                            <div class="custom-control custom-checkbox">
                                <input type="checkbox" 
                                       class="custom-control-input" 
                                       id="is_free"
                                       name="is_free" 
                                       value="1" 
                                       {{ old('is_free', $lesson->is_free) ? 'checked' : '' }}>
                                <label class="custom-control-label" for="is_free">Free Lesson</label>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="status">Status</label>
                            <select name="status" 
                                    id="status" 
                                    class="form-control @error('status') is-invalid @enderror">
                                <option value="draft" {{ old('status', $lesson->status) === 'draft' ? 'selected' : '' }}>Draft</option>
                                <option value="published" {{ old('status', $lesson->status) === 'published' ? 'selected' : '' }}>Published</option>
                            </select>
                            @error('status')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="form-group">
                            <label for="resources">Resources (JSON)</label>
                            <textarea name="resources" 
                                      id="resources" 
                                      rows="3" 
                                      class="form-control @error('resources') is-invalid @enderror">{{ old('resources', $lesson->resources) }}</textarea>
                            @error('resources')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="form-group">
                            <label for="metadata">Metadata (JSON)</label>
                            <textarea name="metadata" 
                                      id="metadata" 
                                      rows="3" 
                                      class="form-control @error('metadata') is-invalid @enderror">{{ old('metadata', $lesson->metadata) }}</textarea>
                            @error('metadata')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>

                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">Update Lesson</button>
                            <a href="{{ route('courses.lessons.index', $course->_id) }}" class="btn btn-secondary">Cancel</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
</div>
@endsection

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Custom file input
    bsCustomFileInput.init();

    // JSON validation
    const validateJson = (str) => {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    };

    const form = document.querySelector('form');
    form.addEventListener('submit', function(e) {
        const resources = document.getElementById('resources').value;
        const metadata = document.getElementById('metadata').value;

        if (resources && !validateJson(resources)) {
            e.preventDefault();
            alert('Resources must be valid JSON');
        }

        if (metadata && !validateJson(metadata)) {
            e.preventDefault();
            alert('Metadata must be valid JSON');
        }
    });
});
</script>
@endpush