@extends('admin.master')
@section('content')
<div class="content-wrapper">
    <h1 align="center"><label>Add Video</label></h1>
   
    <div class="container">
        
        <form action="{{ route('video.add') }}" method="POST" enctype="multipart/form-data">
            @csrf
            <div class="mb-3">
                <label class="form-label">Video Name</label>
                <input type="text" id="videoname" name="videoname" class="form-control" placeholder="Enter Video Name" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Video File</label>
                <input type="file" id="videofile" name="videofile" class="form-control" placeholder="Upload Video File" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Line</label>
                <input type="text" id="line" name="line" class="form-control" placeholder="Enter Line" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Course Name</label>
                <select class="form-control" id="couname" name="couname" required>
                   <?php foreach($courses as $course): ?>
                    <option value="<?php echo e($course->couname); ?>"><?php echo e($course->couname); ?></option>
                      <?php endforeach; ?>
                 </select>
            </div>
            <button type="submit" class="btn btn-primary">Add</button>
        </form>
    </div>
</div>
@endsection
