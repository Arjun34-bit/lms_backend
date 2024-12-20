@extends('admin.master')
@section('content')

<div class="content-wrapper">
    <h1 class="text-center">Edit Advertisement</h1>
    <form action="{{ route('admin.advertisements.update', $advertisement->id) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        <div class="mb-3">
            <label for="title" class="form-label">Title</label>
            <input type="text" id="title" name="title" class="form-control" value="{{ $advertisement->title }}" required>
        </div>
        <div class="mb-3">
            <label for="media" class="form-label">Media</label>
            <input type="file" id="media" name="media" class="form-control">
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
    </form>
</div>

@endsection 