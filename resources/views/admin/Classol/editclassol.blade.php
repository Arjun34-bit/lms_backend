@extends('admin.master');
@section('content');

<div class="content-wrapper">
    <h1 align="center"><label>Edit Live Class</label></h1>
    
    <div class="container">
    <form action="/updateclassol" method="POST" enctype="multipart/form-data">
        @csrf
     
        <div class="mb-3">
            <input type="hidden" id="_id" name="_id" value={{$classol['_id']}} class="form-control" placeholder="Enter Title">
           </div>
        <div class="mb-3">
          <label  class="form-label">Class online</label>
          <input type="text" id="olclass" name="olclass" value={{$classol['olclass']}}  class="form-control" placeholder="Enter Class Name">
        </div>
        <div class="mb-3">
          <label  class="form-label">Class Live Link</label>
          <input type="text" id="link" name="link" value={{$classol['link']}}  class="form-control" placeholder="Enter Class Name">
        </div>
       <button type="submit" class="btn btn-primary">Update</button>
      
    </form>
    </div>
  </div>
    @endsection