@extends('admin.master');
@section('content');

<div class="content-wrapper">
    <h1 align="center"><label>Add Test</label></h1>
    
    <div class="container">
    <form acton=" " method="POST" enctype="multipart/form-data">
        @csrf
     
      
        <div class="mb-3">
          <label  class="form-label">Subject Name</label>
          <input type="text" id="subject" name="subject" class="form-control" placeholder="Enter Course Name">
        </div>
        <div class="mb-3">
          <label  class="form-label">Test No </label>
          <input type="text" id="no" name="no" class="form-control" placeholder="Enter Test No">
        </div>
        
        <div class="mb-3">
          <label  class="form-label">Question</label>
          
            <textarea  type="text" id="que" name="que" cols="80" class="form-control" rows="5"></textarea>
        </div>
         <button type="submit" class="btn btn-primary">Add</button>
      
    </form>
    </div>
</div>
    @endsection