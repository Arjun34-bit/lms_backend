@extends('admin.master');
@section('content');

<div class="content-wrapper">
    <h1 align="center"><label>Add Meeting</label></h1>
    
    <div class="container">
    <form acton="" method="POST" enctype="multipart/form-data">
        @csrf
      
        <div class="mb-3">
          <label  class="form-label">Meeting Name</label>
          <input type="text" id="name" name="m_name" class="form-control" placeholder="Enter Meeting Name">
          
          <label  class="form-label">Meeting link</label>
          {{-- <a href="" name="lname"class="form-control" placeholder="Enter Meeting Link"></a> --}}
          <input type="text" id="lname" name="lname" class="form-control" placeholder="Enter Meeting Link">
        </div>
       
        
       
        <button type="submit" class="btn btn-primary">Add</button>
      
    </form>
    </div>
</div>
    @endsection