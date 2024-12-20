@extends('admin.master');
@section('content');

<div class="content-wrapper">
    <h1 align="center"><label>Add Assignment</label></h1>
    
    <div class="container">
    <form acton="" method="POST" enctype="multipart/form-data">
        @csrf
     
      
        <div class="mb-3">
          <label  class="form-label">Assignment Name</label>
          <input type="text" id="name" name="name" class="form-control" placeholder="Enter Assignment Name">
        </div>
        <div class="mb-3">
          <label  class="form-label">Subject Name</label>
          <input type="text" id="sub_name" name="sub_name" class="form-control" placeholder="Enter Subject Name">
        </div>
        <div class="mb-3">
          <label  class="form-label">Assignment Questions</label>
          <input type="text" id="que" name="que" class="form-control" placeholder="Enter Assignment Questions">
        </div>
         <button type="submit" class="btn btn-primary">Add</button>
      
    </form>
    </div>
</div>
    @endsection