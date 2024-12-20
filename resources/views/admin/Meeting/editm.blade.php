@extends('admin.master');
@section('content');

<div class="content-wrapper">
    <h1 align="center"><label>Edit Brand</label></h1>
    
    <div class="container">
    <form action="/updatem" method="POST"  enctype="multipart/form-data"> 
        @csrf
     
        <div class="mb-3">
            <input type="hidden" id="_id" name="_id" value={{$meeting['_id']}} class="form-control" placeholder="Enter Title">
           </div>
        <div class="mb-3">
          <label  class="form-label">Meeting Name</label>
          <input type="text" id="m_name" name="m_name" value={{$meeting['m_name']}}  class="form-control" placeholder="Enter Unit Name">
        </div>
        <div class="mb-3">
          <label  class="form-label">Link</label>
          <input type="text" id="lname" name="lname" value={{$meeting['lname']}}  class="form-control" placeholder="Enter Unit Name">
        </div>
       
        
       
        <button type="submit" class="btn btn-primary">Update</button>
      
    </form>
    </div>
  </div>
    @endsection