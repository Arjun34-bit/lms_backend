@extends('admin.master')
@section('content')

<div class="content-wrapper">
    <h1 class="text-center">Add Advertisement</h1>
    <form action="{{ route('admin.advertisements.store') }}" method="POST" enctype="multipart/form-data">
        @csrf
        <div class="mb-3">
            <label for="title" class="form-label">Title</label>
            <input type="text" id="title" name="title" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="media" class="form-label">Media</label>
            <input type="file" id="media" name="media" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary">Add</button>
    </form>
</div>

@endsection 