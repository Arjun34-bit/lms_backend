@extends('admin.master');
@section('content');

<div class="content-wrapper">
    <h1 align="center"><label>Edit Notes</label></h1>
    
    <div class="container">
    <form action="/updatenotes" method="POST" enctype="multipart/form-data">
        @csrf
     
        <div class="mb-3">
            <input type="hidden" id="_id" name="_id" value={{$note['_id']}} class="form-control" placeholder="Enter Title">
           </div>
        <div class="mb-3">
          <label  class="form-label">Subject Name</label>
          <input type="text" id="subject" name="subject" value={{$note['subject']}}  class="form-control" placeholder="Enter Coursr Name">
        </div>
        <div class="mb-3">
          <label  class="form-label">Notes</label>
          <input type="file" id="file" name="file" value={{$note['file']}}  class="form-control" placeholder="Enter Subject Name">
        </div>
        
       <button type="submit" class="btn btn-primary">Update</button>
      
    </form>
    </div>
  </div>
    @endsection