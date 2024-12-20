@extends('admin.master');
@section('content');

<div class="content-wrapper">
    <h1 align="center"><label>Add Live Class</label></h1>
    
    <div class="container">
    <form acton=" " method="POST" enctype="multipart/form-data">
        @csrf
     
      
        <div class="mb-3">
          <label  class="form-label">Live Class Name</label>
          <input type="text" id="olclass" name="olclass" class="form-control" placeholder="Enter Class Name">
        </div>
        <div class="mb-3">
          <label  class="form-label">Live Class Link</label>
          <input type="text" id="link" name="link" class="form-control" placeholder="Enter Link">
        </div>
         <button type="submit" class="btn btn-primary">Add</button>
      
    </form>
    </div>
</div>
    @endsection