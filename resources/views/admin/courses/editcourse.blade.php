@extends('admin.master')
@section('content')

<div class="content-wrapper">
    <h1 align="center"><label>Edit Course</label></h1>
    @php
      $courseCategories = [
          'live' => 'Live',
          'featured' => 'Featured',
          'top' => 'Top'
      ];
    @endphp
    <div class="container">
    <form action="/updatecourse" method="POST" enctype="multipart/form-data">
        @csrf
     
        <div class="mb-3">
            <input type="hidden" id="id" name="_id" value="{{ $course['_id'] }}" class="form-control">
        </div>
           
        <div class="mb-3">
          <label class="form-label">Course Name</label>
          <input type="text" id="couname" name="couname" value="{{ $course['couname'] }}" class="form-control" placeholder="Enter Course Name">
        </div>
        <div class="mb-3">
          <label class="form-label">Course Price</label>
          <input type="text" id="price" name="price" value="{{ $course['price'] }}" class="form-control" placeholder="Enter Course Price">
        </div>
        <div class="mb-3">
          <label class="form-label">Course Image</label>
          <input type="file" id="cimg" name="cimg" class="form-control">
        </div>
        <div class="mb-3">
          <label class="form-label">Course Category</label>
          <div>
              @foreach($courseCategories as $key => $value)
                  <div class="form-check">
                      <input class="form-check-input" type="radio" name="course_category" id="category_{{ $key }}" value="{{ $key }}" {{ $course['course_category'] == $key ? 'checked' : '' }}>
                      <label class="form-check-label" for="category_{{ $key }}">
                          {{ $value }}
                      </label>
                  </div>
              @endforeach
          </div>
        </div>
       <button type="submit" class="btn btn-primary">Update</button>
      
    </form>
    </div>
</div>
@endsection