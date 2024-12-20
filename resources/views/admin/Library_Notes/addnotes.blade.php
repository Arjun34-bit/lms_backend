@extends('admin.master');
@section('content');

<div class="content-wrapper">
    <h1 align="center"><label>Add Notes</label></h1>
    
    <div class="container">
    <form acton="" method="POST" enctype="multipart/form-data">
        @csrf
     
      
        <div class="mb-3">
          <label  class="form-label">Subject Name</label>
          <input type="text" id="subject" name="subject" class="form-control" placeholder="Enter Subject Name">
        </div>
        <div class="mb-3">
          <label  class="form-label">Notes</label>
          <input type="file" id="file" name="file" class="form-control" placeholder="">
        </div>
        
         <button type="submit" class="btn btn-primary">Add</button>
      
    </form>
    </div>
</div>
    @endsection