@extends('admin.master')
@section('content')

<div class="content-wrapper">
    <h1 class="text-center">Add New Teacher</h1>
    
    <div class="container">
        <form action="{{ route('addtech') }}" method="POST" enctype="multipart/form-data">
            @csrf
            <div class="mb-3">
                <label for="tech_name" class="form-label">Teacher Name</label>
                <input type="text" id="tech_name" name="tech_name" class="form-control" placeholder="Enter the teacher's name" required>
                
                <label for="subject_id" class="form-label">Subject</label>
                <input type="text" id="subject_id" name="subject_id" class="form-control" placeholder="Enter subject ID" required>
                
                <label for="tech_img" class="form-label">Teacher Image</label>
                <input type="file" id="tech_img" name="tech_img" class="form-control" required>
                
                <label for="mno" class="form-label">Mobile Number</label>
                <input type="text" id="mno" name="mno" class="form-control" placeholder="Enter mobile number" required>
                
                <label for="email" class="form-label">Email Address</label>
                <input type="email" id="email" name="email" class="form-control" placeholder="Enter email address" required>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
</div>
@endsection