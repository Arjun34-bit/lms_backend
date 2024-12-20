@extends('admin.master')
@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 offset-md-2">
            <div class="card shadow-sm">
                <div class="card-header bg-primary text-white">
                    <i class="fas fa-edit"></i> Edit Course
                </div>

                <div class="card-body">
                    @if(session('success'))
                        <div class="alert alert-success">
                            <i class="fas fa-check-circle"></i> {{ session('success') }}
                        </div>
                    @endif

                    <form method="POST" action="{{ route('courses.update', $course->_id) }}" enctype="multipart/form-data">
                        @csrf
                        @method('PUT')

                        <div class="mb-3">
                            <label for="title" class="form-label"><i class="fas fa-heading"></i> Title</label>
                            <input type="text" class="form-control @error('title') is-invalid @enderror" id="title" name="title" value="{{ old('title', $course->title ?? '') }}" required>
                            @error('title')
                                <div class="invalid-feedback"><i class="fas fa-exclamation-circle"></i> {{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="description" class="form-label"><i class="fas fa-align-left"></i> Description</label>
                            <textarea class="form-control @error('description') is-invalid @enderror" id="description" name="description" rows="4" required>{{ old('description', $course->description ?? '') }}</textarea>
                            @error('description')
                                <div class="invalid-feedback"><i class="fas fa-exclamation-circle"></i> {{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="type" class="form-label"><i class="fas fa-tags"></i> Type</label>
                            <select class="form-select @error('type') is-invalid @enderror" id="type" name="type" required>
                                <option value="">Select Type</option>
                                <option value="programming" {{ ($course->type ?? '') === 'programming' ? 'selected' : '' }}>Programming</option>
                                <option value="design" {{ ($course->type ?? '') === 'design' ? 'selected' : '' }}>Design</option>
                                <option value="business" {{ ($course->type ?? '') === 'business' ? 'selected' : '' }}>Business</option>
                            </select>
                            @error('type')
                                <div class="invalid-feedback"><i class="fas fa-exclamation-circle"></i> {{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label class="form-label"><i class="fas fa-list-alt"></i> Category</label>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="category" id="live" value="live" {{ old('category', $course->category ?? '') == 'live' ? 'checked' : '' }}>
                                <label class="form-check-label" for="live">
                                    Live
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="category" id="featured" value="featured" {{ old('category', $course->category ?? '') == 'featured' ? 'checked' : '' }}>
                                <label class="form-check-label" for="featured">
                                    Featured
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="category" id="top" value="top" {{ old('category', $course->category ?? '') == 'top' ? 'checked' : '' }}>
                                <label class="form-check-label" for="top">
                                    Top Courses
                                </label>
                            </div>
                            @error('category')
                                <div class="invalid-feedback"><i class="fas fa-exclamation-circle"></i> {{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="level" class="form-label"><i class="fas fa-signal"></i> Level</label>
                            <select class="form-select @error('level') is-invalid @enderror" id="level" name="level" required>
                                <option value="">Select Level</option>
                                <option value="beginner" {{ ($course->level ?? '') === 'beginner' ? 'selected' : '' }}>Beginner</option>
                                <option value="intermediate" {{ ($course->level ?? '') === 'intermediate' ? 'selected' : '' }}>Intermediate</option>
                                <option value="advanced" {{ ($course->level ?? '') === 'advanced' ? 'selected' : '' }}>Advanced</option>
                            </select>
                            @error('level')
                                <div class="invalid-feedback"><i class="fas fa-exclamation-circle"></i> {{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="duration" class="form-label"><i class="fas fa-clock"></i> Duration (in minutes)</label>
                            <input type="number" class="form-control @error('duration') is-invalid @enderror" id="duration" name="duration" value="{{ old('duration', $course->duration ?? '') }}" required>
                            @error('duration')
                                <div class="invalid-feedback"><i class="fas fa-exclamation-circle"></i> {{ $message }}</div>
                            @enderror
                        </div>

                        <div class="mb-3">
                            <label for="price" class="form-label"><i class="fas fa-dollar-sign"></i> Price</label>
                            <input type="number" step="0.01" class="form-control @error('price') is-invalid @enderror" id="price" name="price" value="{{ old('price', $course->price ?? '') }}" required>
                            @error('price')
                                <div class="invalid-feedback"><i class="fas fa-exclamation-circle"></i> {{ $message }}</div>
                            @enderror
                        </div>
<div class="mb-3">
                            <label for="status" class="form-label"><i class="fas fa-toggle-on"></i> Status</label>
                            <select class="form-select @error('status') is-invalid @enderror" id="status" name="status" required>
                                <option value="draft" {{ ($course->status ?? '') === 'draft' ? 'selected' : '' }}>Draft</option>
                                <option value="published" {{ ($course->status ?? '') === 'published' ? 'selected' : '' }}>Published</option>
                            </select>
                            @error('status')
                                <div class="invalid-feedback"><i class="fas fa-exclamation-circle"></i> {{ $message }}</div>
                            @enderror
                        </div>
                        <div class="mb-3">
                            <label for="thumbnail" class="form-label"><i class="fas fa-image"></i> Thumbnail</label>
                            @if($course && isset($course->thumbnail))
                                <div class="mb-2">
                                    <img src="https://s3storage.duoples.com/pcc/{{ $course->thumbnail }}" alt="Current thumbnail" class="img-thumbnail" style="max-width: 200px;">
                                </div>
                            @endif
                            <input type="file" class="form-control @error('thumbnail') is-invalid @enderror" id="thumbnail" name="thumbnail">
                            @error('thumbnail')
                                <div class="invalid-feedback"><i class="fas fa-exclamation-circle"></i> {{ $message }}</div>
                            @enderror
                        </div>

                        @if ($errors->has('error'))
                            <div class="alert alert-danger">
                                <i class="fas fa-exclamation-triangle"></i> {{ $errors->first('error') }}
                            </div>
                        @endif

                        <button type="submit" class="btn btn-success"><i class="fas fa-save"></i> Update Course</button>
                        <a href="{{ route('courses.show', $course->_id) }}" class="btn btn-secondary"><i class="fas fa-times"></i> Cancel</a>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection