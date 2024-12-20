@extends('admin.master');
@section('content');

<div class="content-wrapper">
    <h1 align="center"><label>Edit course</label></h1>
    
    <div class="container">
    <form action="/updatetest" method="POST" enctype="multipart/form-data">
        @csrf
     
        <div class="mb-3">
            <input type="hidden" id='_id' name='_id' value={{$test['_id']}} class="form-control" placeholder="Enter Title">
           </div>
        <div class="mb-3">
          <label  class="form-label">Subject Name</label>
          <input type="text" id='subject' name='subject'  value={{$test['subject']}} class="form-control" placeholder="Enter Test No">
        </div>
        <div class="mb-3">
          <label  class="form-label">Test No </label>
          <input type="text" id='no' name='no'  value={{$test['no']}} class="form-control" placeholder="Enter Test No">
        </div>
        
        <div class="mb-3">
          <label  class="form-label">Question</label>
          
            <textarea  type="text" id="que" name="que" cols="80" value={{$test['que']}} class="form-control" rows="5"></textarea>
        </div>
       <button type="submit" class="btn btn-primary">Update</button>
      
    </form>
    </div>
  </div>
    @endsection